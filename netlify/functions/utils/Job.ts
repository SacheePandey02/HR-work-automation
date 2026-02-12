import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    domain: { type: String, required: true }, // Tech, Sales, etc.
    department: String,
    experience: String,
    location: String,
    description: String,
    duration: String, // e.g., "7 Days"
    closingDate: Date, // The actual timestamp
    jobStatus: { 
      type: String, 
      enum: ["published", "closed", "draft"], 
      default: "published" 
    },
    formFields: [
      {
        label: String,
        inputType: String,
        options: [String],
        required: Boolean,
      }
    ],
    platforms: [
      {
        name: String,
        status: { type: String, default: "pending" },
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);