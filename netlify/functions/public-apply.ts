import { Handler } from "@netlify/functions";
import { connectDB } from "./utils/db";
import Application from "./utils/Application";
import Job from "./utils/Job";

export const handler: Handler = async (event) => {
  // 1. Validate Method
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    await connectDB("lite");
    const body = JSON.parse(event.body || "{}");
    const { jobId, fullName, email, phone, resumeUrl, answers } = body;

    // 2. Validate Inputs
    if (!jobId || !fullName || !email) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ message: "Missing required fields (Name, Email, or Job ID)" }) 
      };
    }

    // 3. Check if Job exists and is Published
    const job = await Job.findById(jobId);
    if (!job || job.jobStatus !== "published") {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ message: "This job is no longer accepting applications." }) 
      };
    }

    // 4. Check for Duplicate Application (Same Email + Same Job)
    const existingApp = await Application.findOne({ jobId, email });
    if (existingApp) {
      return { 
        statusCode: 409, 
        body: JSON.stringify({ message: "You have already applied for this job." }) 
      };
    }

    // 5. Intelligent Filter Extraction
    // We look through the dynamic 'answers' array to find key metrics for the Admin Dashboard filters
    const findAns = (keyword: string) => 
      answers?.find((a: any) => a.label.toLowerCase().includes(keyword))?.answer;

    const extractedLocation = findAns("location") || findAns("city") || job.location; // Fallback to job location
    const extractedExpStr = findAns("experience") || findAns("years");
    const extractedCTCStr = findAns("ctc") || findAns("salary") || findAns("expectation");

    // Parse numbers safely
    const filterExperience = extractedExpStr ? parseFloat(extractedExpStr) : 0;
    const filterCTC = extractedCTCStr ? parseFloat(extractedCTCStr.replace(/[^0-9.]/g, '')) : 0;

    // 6. Create Application
    const newApp = await Application.create({
      jobId,
      fullName,
      email,
      phone,
      resumeUrl,
      answers: answers || [], // Save the full dynamic form data
      
      // Save extracted fields for easy filtering later
      filterLocation: extractedLocation,
      filterExperience,
      filterCTC,
      
      status: "Applied"
    });

    return {
      statusCode: 201,
      body: JSON.stringify({ 
        message: "Application Submitted Successfully", 
        applicationId: newApp._id 
      })
    };

  } catch (err: any) {
    console.error("Apply Error:", err);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: err.message || "Internal Server Error" }) 
    };
  }
};