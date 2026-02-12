import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, ShieldCheck, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const CandidateLogin = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectPath = searchParams.get("redirect") || "/";

  const requestOtp = async () => {
    if (!email || !name) return toast.error("Please enter Name and Email");
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/candidate-otp-auth", {
        method: "POST",
        body: JSON.stringify({ action: "request_otp", email, name })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) return toast.error("Enter a valid 6-digit code");
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/candidate-otp-auth", {
        method: "POST",
        body: JSON.stringify({ action: "verify_otp", email, otp, name })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("candidate_token", data.token);
        localStorage.setItem("candidate_user", JSON.stringify(data.user));
        toast.success("Identity Verified!");
        navigate(redirectPath);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200 rotate-3">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {step === 1 ? "Begin Application" : "Check Your Email"}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {step === 1 ? "Enter your details to access the job form." : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-4 text-slate-400" size={18} />
                <input type="text" placeholder="Full Name" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
                <input type="email" placeholder="Email Address" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button onClick={requestOtp} disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 disabled:bg-slate-300">
                {loading ? "Sending..." : "Get OTP Code"} <ArrowRight size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
              <div className="flex justify-center gap-2">
                <input type="text" maxLength={6} placeholder="000000" className="w-full text-center text-4xl tracking-[1rem] font-mono py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" value={otp} onChange={(e) => setOtp(e.target.value)} />
              </div>
              <button onClick={verifyOtp} disabled={loading} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition">
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>
              <button onClick={() => setStep(1)} className="w-full text-slate-400 text-sm font-bold hover:text-indigo-600">Change Details</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
export default CandidateLogin;