import { Handler } from "@netlify/functions";
import { connectDB } from "./utils/db";
import Job from "./utils/Job";

export const handler: Handler = async (event) => {
  try {
    await connectDB("lite");
    const { id } = event.queryStringParameters || {};

    // ✅ CRITICAL: Ensure 'formFields' is in the .select() list
    const job = await Job.findById(id).select("title description location department experience formFields jobStatus");

    if (!job || job.jobStatus !== "published") {
      return { statusCode: 404, body: JSON.stringify({ message: "Job not available" }) };
    }

    return { statusCode: 200, body: JSON.stringify(job) };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};