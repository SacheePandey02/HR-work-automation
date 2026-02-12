import { Handler } from "@netlify/functions";
import { connectDB } from "./utils/db";
import Application from "./utils/Application";

export const handler: Handler = async (event) => {
  try {
    await connectDB("lite");
    const { applicationId, testCode, answers } = JSON.parse(event.body || "{}");

    const app = await Application.findById(applicationId);
    
    if (!app) {
      return { statusCode: 404, body: JSON.stringify({ message: "Application not found" }) };
    }

    // ✅ FIX: Force string comparison and trim whitespace
    const dbCode = String(app.testCode || app.phone.substring(0, 6)).trim();
    const providedCode = String(testCode).trim();

    console.log(`Checking Code for ${app.fullName}: DB(${dbCode}) vs Provided(${providedCode})`);

    if (dbCode !== providedCode) {
      return { 
        statusCode: 401, 
        body: JSON.stringify({ message: "Invalid 6-digit code. Please check your email." }) 
      };
    }

    // Score Calculation
    const totalPoints = answers.reduce((acc: number, curr: any) => acc + parseInt(curr.value), 0);
    const finalScore = Math.round((totalPoints / (answers.length * 5)) * 100);

    app.testScore = finalScore;
    app.status = "Interviewing"; // Automatically move to screening/interview
    await app.save();

    return { statusCode: 200, body: JSON.stringify({ score: finalScore }) };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};