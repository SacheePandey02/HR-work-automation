import { Handler } from "@netlify/functions";
import mongoose from "mongoose";
import { connectDB } from "./utils/db";
import { getUserFromToken } from "./utils/auth";
import Job from "./utils/Job";

export const handler: Handler = async (event) => {
  try {
    await connectDB();
    const user: any = getUserFromToken(event);

    // ✅ Use Aggregation to join Job with Application count
    const jobs = await Job.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(user.id) } },
      {
        $lookup: {
          from: "applications", // MongoDB collection name for Application model
          localField: "_id",
          foreignField: "jobId",
          as: "applicants"
        }
      },
      {
        $project: {
          title: 1, domain: 1, department: 1, location: 1,
          jobStatus: 1, experience: 1, description: 1,
          formFields: 1, closingDate: 1, duration: 1,
          applicantsCount: { $size: "$applicants" } // ✅ Return count
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    return { statusCode: 200, body: JSON.stringify(jobs) };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};