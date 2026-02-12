import { Handler } from "@netlify/functions";
import jwt from "jsonwebtoken";
import { connectDB } from "./utils/db";
import CandidateUser from "./utils/CandidateUser";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    await connectDB("lite");
    const body = JSON.parse(event.body || "{}");
    const { action, email, name, otp } = body;

    // STEP 1: REQUEST OTP
    if (action === "request_otp") {
      if (!email || !name) {
        return { statusCode: 400, body: JSON.stringify({ message: "Name and Email required" }) };
      }

      // 🔹 FOR DEMO: We are "simulating" sending an email.
      // In production, you would use Nodemailer/SendGrid here.
      console.log(`📨 OPT GENERATED FOR ${email}: 123456`);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "OTP sent to your email (Use 123456)" })
      };
    }

    // STEP 2: VERIFY OTP
    if (action === "verify_otp") {
      if (!email || !otp) {
        return { statusCode: 400, body: JSON.stringify({ message: "Email and OTP required" }) };
      }

      // 🔹 HARDCODED CHECK
      if (otp !== "123456") {
        return { statusCode: 401, body: JSON.stringify({ message: "Invalid OTP" }) };
      }

      // Find or Create User (Passwordless logic)
      let user = await CandidateUser.findOne({ email });
      
      if (!user) {
        // Create new candidate if not exists
        // Note: We set a dummy password because your schema might require it, 
        // or you can remove 'required: true' from password in Schema.
        user = await CandidateUser.create({
          name: body.name,
          email,
          password: "passwordless_entry", 
          isVerified: true
        });
      }

      // Generate Token
      const token = jwt.sign(
        { id: user._id, role: "candidate", name: user.name, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      return {
        statusCode: 200,
        body: JSON.stringify({ 
          token, 
          user: { name: user.name, email: user.email } 
        })
      };
    }

    return { statusCode: 400, body: "Invalid action" };

  } catch (err: any) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};