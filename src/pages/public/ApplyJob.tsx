import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, MapPin, GraduationCap, Phone, Upload, Send, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [candidateUser, setCandidateUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [basicInfo, setBasicInfo] = useState({
    fullName: "",
    email: "",
    phone: "+91",
    resumeUrl: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/.netlify/functions/get-job-public?id=${id}`);
        if (res.ok) setJob(await res.json());

        const token = localStorage.getItem("candidate_token");
        const userStr = localStorage.getItem("candidate_user");
        if (token && userStr) {
          const user = JSON.parse(userStr);
          setCandidateUser(user);
          setBasicInfo(prev => ({
            ...prev,
            fullName: user.name,
            email: user.email,
          }));
        }
      } catch {
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ✅ Strict Indian Phone Validation
  const isValidIndianPhone = (phone: string) => {
    return /^\+91\d{10}$/.test(phone);
  };

  // ✅ Handle Phone Input (Only 10 digits allowed)
  const handlePhoneChange = (value: string) => {
    let digits = value.replace(/\D/g, ""); // remove non-digits

    if (digits.startsWith("91")) {
      digits = digits.substring(2);
    }

    if (digits.length > 10) {
      digits = digits.slice(0, 10);
    }

    setBasicInfo(prev => ({
      ...prev,
      phone: "+91" + digits,
    }));
  };

  // ✅ File Upload Handler
  const handleFileUpload = (file: File) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF or JPG/PNG allowed");
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setBasicInfo(prev => ({
        ...prev,
        resumeUrl: reader.result as string,
      }));
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidIndianPhone(basicInfo.phone)) {
      return toast.error("Phone must be +91 followed by 10 digits");
    }

    if (!basicInfo.resumeUrl) {
      return toast.error("Please upload your resume");
    }

    setSubmitting(true);

    try {
      const res = await fetch("/.netlify/functions/public-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: id,
          ...basicInfo,
          answers: [], // screening removed
        }),
      });

      if (res.ok) {
        toast.success("Application Submitted!");
        navigate("/success");
      } else {
        const err = await res.json();
        toast.error(err.message || "Submission failed");
      }
    } catch {
      toast.error("Network Error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="flex h-screen items-center justify-center font-bold text-slate-400">Loading...</div>;

  if (!job) return <div className="p-20 text-center">Job not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <motion.div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-indigo-600 p-10 text-white">
          <h1 className="text-4xl font-black mb-4">{job.title}</h1>
          <div className="flex gap-6 text-sm font-bold">
            <span className="flex items-center gap-2"><MapPin size={16}/> {job.location}</span>
            <span className="flex items-center gap-2"><Briefcase size={16}/> {job.department}</span>
            <span className="flex items-center gap-2"><GraduationCap size={16}/> {job.experience}</span>
          </div>
        </div>

        <div className="p-10">
          {!candidateUser ? (
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4">Verify before applying</h2>
              <button
                onClick={() => navigate(`/candidate/login?redirect=${location.pathname}`)}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl"
              >
                Login with OTP
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="text-xs font-bold">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={16}/>
                  <input
                    type="tel"
                    value={basicInfo.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold">Upload Resume (Max 2MB)</label>
                <div className="relative">
                  <Upload className="absolute left-3 top-3 text-slate-400" size={16}/>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files) handleFileUpload(e.target.files[0]);
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-slate-900 text-white py-4 rounded-xl"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>

            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ApplyJob;
