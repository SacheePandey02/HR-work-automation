import { Handler } from "@netlify/functions";
import { connectDB } from "./utils/db";
import { getUserFromToken } from "./utils/auth";
import Application from "./utils/Application";
import Job from "./utils/Job";

export const handler: Handler = async (event) => {
  try {
    await connectDB();
    getUserFromToken(event);

    // ✅ MongoDB Aggregation: Group applications by Job and Status
    const stats = await Application.aggregate([
      {
        $group: {
          _id: { jobId: "$jobId", status: "$status" },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.jobId",
          stages: {
            $push: {
              status: "$_id.status",
              count: "$count"
            }
          }
        }
      }
    ]);

    // Populate Job details (Title and Domain)
    const populatedStats = await Job.populate(stats, { path: "_id", select: "title domain" });

    return {
      statusCode: 200,
      body: JSON.stringify(populatedStats),
    };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};