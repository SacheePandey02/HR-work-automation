import mongoose from "mongoose";

const CandidateUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    resumeUrl: String, // Store resume at profile level
    skills: [String]
  },
  { timestamps: true }
);

export default mongoose.models.CandidateUser || mongoose.model("CandidateUser", CandidateUserSchema);