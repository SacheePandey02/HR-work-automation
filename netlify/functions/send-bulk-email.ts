import { Handler } from "@netlify/functions";
import { Resend } from 'resend';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'; // ✅ Switched to pdf-lib
import { connectDB } from "./utils/db";
import { getUserFromToken } from "./utils/auth";
// import Application from "./utils/Application";
// import Job from "./utils/Job";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export const handler: Handler = async (event) => {
  console.log("🚀 [Email Function] Triggered");

  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    await connectDB("standard");
    getUserFromToken(event);

    // Register models
    // console.log(`Mailer Active: ${Job.modelName} & ${Application.modelName}`);

    const body = JSON.parse(event.body || "{}");
    const { emails, type, candidateName, packageAmount, jobTitle, message } = body;

    // console.log("📩 [Email Function] Request Data:", { type, emails, candidateName, jobTitle });

    let attachments: any[] = [];

    // 📄 HANDLE PDF GENERATION WITH PDF-LIB
    if (type === "OFFER_LETTER") {
      console.log("📄 [Email Function] Generating PDF-Lib document for:", candidateName);
      
      try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();
        
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Header
        page.drawText('OFFER LETTER', {
          x: 220,
          y: height - 100,
          size: 24,
          font: fontBold,
          color: rgb(0.31, 0.27, 0.9) // Indigo color
        });

        // Date
        page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
          x: 450,
          y: height - 140,
          size: 10,
          font: fontRegular,
        });

        // Content
        let currentY = height - 200;
        page.drawText(`Dear ${candidateName || 'Candidate'},`, { x: 50, y: currentY, size: 14, font: fontBold });
        
        currentY -= 40;
        page.drawText(`We are pleased to offer you the position of ${jobTitle || 'selected role'}.`, { x: 50, y: currentY, size: 12, font: fontRegular });
        
        currentY -= 30;
        page.drawText(`Annual CTC: ${packageAmount || 'As per discussion'}`, { x: 50, y: currentY, size: 12, font: fontBold });
        
        currentY -= 20;
        page.drawText(`Joining Date: Immediate / As per notification`, { x: 50, y: currentY, size: 12, font: fontRegular });

        currentY -= 50;
        // Simple word wrap simulation for message
        const messageSnippet = "We are excited to have you join our team and look forward to a successful journey together.";
        page.drawText(messageSnippet.substring(0, 80), { x: 50, y: currentY, size: 11, font: fontRegular });

        currentY -= 100;
        page.drawText('Authorized Signatory,', { x: 50, y: currentY, size: 12, font: fontRegular });
        page.drawText('Human Resources Team - Zyncly', { x: 50, y: currentY - 20, size: 12, font: fontBold });

        // Save to Base64
        const pdfBase64 = await pdfDoc.saveAsBase64();

        attachments.push({
          content: pdfBase64,
          filename: `Offer_Letter_${candidateName?.replace(/\s+/g, '_')}.pdf`,
        });
        
        //console.log("✅ [Email Function] PDF-Lib Generated Successfully");
      } catch (pdfErr: any) {
       // console.error("❌ [Email Function] PDF-Lib Error:", pdfErr.message);
        throw new Error("Failed to generate PDF document");
      }
    }

    // 📤 SEND VIA RESEND
    const { data, error } = await resend.emails.send({
      from: 'HR Portal <onboarding@resend.dev>',
      to: emails,
      subject: type === "OFFER_LETTER" ? `Official Offer Letter - ${jobTitle}` : "Recruitment Update",
      html: `
        <div style="font-family: sans-serif; color: #333; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Update for ${candidateName}</h2>
          <p>${'Please find the attached document regarding your application.'}</p>
          <hr/>
          <p style="font-size: 12px; color: #777;">Sent via Zyncly Automated HR System</p>
        </div>
      `,
      attachments: attachments.length > 0 ? attachments : undefined
    });

    if (error) {
      console.error("❌ [Email Function] Resend API Error:", error);
      return { statusCode: 400, body: JSON.stringify(error) };
    }

    return { 
      statusCode: 200, 
      body: JSON.stringify({ message: "Dispatched", data }) 
    };

  } catch (err: any) {
    console.error("🔥 [Email Function] CRITICAL ERROR:", err.message);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: "Internal Server Error", error: err.message }) 
    };
  }
};