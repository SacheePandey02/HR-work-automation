import { Handler } from "@netlify/functions";
import { connectDB } from "./utils/db";
import { getUserFromToken } from "./utils/auth";
import Application from "./utils/Application";
import Job from "./utils/Job"; // Required to prevent population errors

export const handler: Handler = async (event) => {
  // 1. Only allow PUT
  if (event.httpMethod !== "PUT") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    await connectDB("lite");
    getUserFromToken(event); // Ensure HR is logged in

    // This line ensures Job model is registered in Mongoose memory
    const _modelFix = Job.modelName; 

    const body = JSON.parse(event.body || "{}");
    const { id, status, testScore, interviewFeedback, offeredPackage } = body;

    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ message: "ID is required" }) };
    }

    const app = await Application.findById(id);
    if (!app) {
      return { statusCode: 404, body: JSON.stringify({ message: "Candidate not found" }) };
    }

    // ✅ Update status if provided
    if (status) app.status = status;

    // ✅ If shortlisting, generate the 6-digit test code from phone
    if (status === "Shortlisted" && app.phone) {
      // Remove any non-numeric characters and take first 6
      const cleanPhone = app.phone.replace(/\D/g, "");
      app.testCode = cleanPhone.substring(0, 6) || "123456"; 
    }

    // ✅ Store Screening/Interview data
    if (testScore !== undefined) app.testScore = testScore;
    if (interviewFeedback !== undefined) app.interviewFeedback = interviewFeedback;
    if (offeredPackage !== undefined) app.offeredPackage = offeredPackage;

    await app.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Status updated", app })
    };
  } catch (err: any) {
    console.error("Update Status Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message })
    };
  }
};