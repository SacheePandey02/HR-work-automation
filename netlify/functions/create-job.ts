import { Handler } from "@netlify/functions";
import { connectDB } from "./utils/db";
import { getUserFromToken } from "./utils/auth";
import Job from "./utils/Job";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    await connectDB("standard");
    const user: any = getUserFromToken(event);

    const body = JSON.parse(event.body || "{}");
    const { title, domain, department, experience, location, description, duration, platforms, formFields } = body;

    // ✅ Calculate closingDate based on duration (e.g., "7 Days")
    let computedClosingDate = new Date();
    const days = parseInt(duration) || 7; // Default to 7 days if duration is missing
    computedClosingDate.setDate(computedClosingDate.getDate() + days);

    const formattedPlatforms = Array.isArray(platforms)
      ? platforms.map((p: string) => ({ name: p, status: "pending" }))
      : [];

    const job = await Job.create({
      createdBy: user.id,
      title,
      domain,
      department,
      experience,
      location,
      description,
      duration,
      closingDate: computedClosingDate,
      platforms: formattedPlatforms,
      formFields: Array.isArray(formFields) ? formFields : [],
      jobStatus: "published",
    });

    return { statusCode: 201, body: JSON.stringify(job) };
  } catch (err: any) {
    return { statusCode: 400, body: JSON.stringify({ message: err.message }) };
  }
};