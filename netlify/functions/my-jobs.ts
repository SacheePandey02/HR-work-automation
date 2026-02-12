import { Handler } from "@netlify/functions";
import { connectDB } from "./utils/db";
import { getUserFromToken } from "./utils/auth";
import Job from "./utils/Job";

export const handler: Handler = async (event) => {
  try {
    await connectDB("lite");
    const user: any = getUserFromToken(event);

    const jobs = await Job.find({ createdBy: user.id })
      .sort({ createdAt: -1 });

    return {
      statusCode: 200,
      body: JSON.stringify(jobs)
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" })
    };
  }
};
