import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    resumeUrl: String,
    answers: [
      {
        label: String,
        answer: String
      }
    ],
  status: { 
  type: String, 
  enum: ["Applied", "Shortlisted", "Interviewing", "Hired", "Rejected"], 
  default: "Applied" 
},
// New fields for the Screening module
testScore: { type: Number, default: 0 },
interviewFeedback: { type: String },
offeredPackage: { type: String }, // e.g., "6.5 LPA"
joiningDate: { type: Date },
    filterLocation: String,
    filterExperience: Number,
  },
  { timestamps: true }
);

// ✅ This allows: amit@test.com -> Job1 AND amit@test.com -> Job2
// But blocks: amit@test.com -> Job1 (Twice)
ApplicationSchema.index({ jobId: 1, email: 1 }, { unique: true });

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);