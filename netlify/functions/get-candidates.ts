import { Handler } from "@netlify/functions";
import { connectDB } from "./utils/db";
import { getUserFromToken } from "./utils/auth";
import Application from "./utils/Application";
import Job from "./utils/Job"; // 👈 CRITICAL: Must import to register the model

export const handler: Handler = async (event) => {
  try {
    await connectDB();
    getUserFromToken(event); 

    // This ensures Mongoose knows about the Job model before populating
    const _modelRef = Job.modelName; 

    const { jobId } = event.queryStringParameters || {};
    let filter: any = {};
    if (jobId) filter.jobId = jobId;

    // ✅ Force population of the jobId field to get the domain
    const candidates = await Application.find(filter)
      .populate("jobId", "title domain experience") 
      .sort({ createdAt: -1 });

    return {
      statusCode: 200,
      body: JSON.stringify(candidates),
    };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};