import { Handler } from "@netlify/functions";
import { connectDB } from "./utils/db";
import { getUserFromToken } from "./utils/auth";
import Job from "./utils/Job";
import User from "./utils/user";
import Application from "./utils/Application";

export const handler: Handler = async (event) => {
  try {
    await connectDB();
    const user: any = getUserFromToken(event);

    const hr = await User.findById(user.id).select("name email");

    // 1. Basic Stats
    const jobs = await Job.find({ createdBy: user.id }).sort({ createdAt: -1 }).lean();
    const totalCandidates = await Application.countDocuments({});

    // 2. 🚀 NEW: Pipeline Aggregation (Grouping by Job and Status)
    const pipelineData = await Application.aggregate([
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

    // Populate Job details for the pipeline table
    const populatedPipeline = await Job.populate(pipelineData, { 
      path: "_id", 
      select: "title domain" 
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        hr,
        totalJobs: jobs.length,
        totalCandidates,
        jobs,
        pipeline: populatedPipeline // This feeds the new chart
      }),
    };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};