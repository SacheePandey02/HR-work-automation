import { Handler } from "@netlify/functions";
import { connectDB } from "./utils/db";
import { getUserFromToken } from "./utils/auth";
import Job from "./utils/Job";

export const handler: Handler = async (event) => {
  // Only allow PUT requests for updates
  if (event.httpMethod !== "PUT") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    await connectDB();
    getUserFromToken(event); // Secure: ensure only HR can call this

    const body = JSON.parse(event.body || "{}");
    const { id, action } = body;

    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ message: "Job ID required" }) };
    }

    const job = await Job.findById(id);
    if (!job) {
      return { statusCode: 404, body: JSON.stringify({ message: "Job not found" }) };
    }

    let updateData: any = {};

    // --- LOGIC SWITCHBOARD ---
    switch (action) {
      case "EDIT_FULL": {
        // Full update from the Edit Page
        const { title, domain, department, experience, location, description, duration, formFields } = body;
        
        // Recalculate closing date based on provided duration
        let newClosingDate = new Date();
        newClosingDate.setDate(newClosingDate.getDate() + (parseInt(duration) || 7));
        
        updateData = { 
          title, domain, department, experience, 
          location, description, duration, 
          formFields, closingDate: newClosingDate 
        };
        break;
      }

      case "CLOSE": {
        // Just close the job
        updateData = { jobStatus: "closed" };
        break;
      }

      case "EXTEND": {
        // ✅ NEW: Receive customDate from the frontend Date Picker
        const { customDate } = body;
        
        if (!customDate) {
          return { 
            statusCode: 400, 
            body: JSON.stringify({ message: "New expiry date is required for extension" }) 
          };
        }

        updateData = { 
          closingDate: new Date(customDate), 
          jobStatus: "published" // Automatically re-open the job if it was closed
        };
        break;
      }

      default:
        return { statusCode: 400, body: JSON.stringify({ message: "Invalid action" }) };
    }

    const updatedJob = await Job.findByIdAndUpdate(id, updateData, { new: true });

    return {
      statusCode: 200,
      body: JSON.stringify(updatedJob),
    };

  } catch (err: any) {
    console.error("Update Job Error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};