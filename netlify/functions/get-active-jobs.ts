import { connectDB } from "./utils/db";
import Job from "./utils/Job";

export const handler = async () => {
  try {
    await connectDB();

    const jobs = await Job.find({
      jobStatus: "published",
      closingDate: { $gte: new Date() },
    }).sort({ createdAt: -1 });

    return {
      statusCode: 200,
      body: JSON.stringify(jobs),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server Error" }),
    };
  }
};
