import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, MapPin, GraduationCap, Phone, FileText, Send, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [candidateUser, setCandidateUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [basicInfo, setBasicInfo] = useState({ fullName: "", email: "", phone: "", resumeUrl: "" });
  const [answers, setAnswers] = useState<Record<string, string>>({});

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
          setBasicInfo(prev => ({ ...prev, fullName: user.name, email: user.email }));
        }
      } catch (err) {
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!basicInfo.phone || !basicInfo.resumeUrl) return toast.error("Please fill all required fields");
    
    setSubmitting(true);
    const formattedAnswers = Object.entries(answers).map(([label, answer]) => ({ label, answer }));

    try {
      const res = await fetch("/.netlify/functions/public-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: id, ...basicInfo, answers: formattedAnswers })
      });

      if (res.ok) {
        toast.success("Application Submitted!");
        navigate("/success");
      } else {
        const err = await res.json();
        toast.error(err.message || "Submission failed");
      }
    } catch (error) {
      toast.error("Network Error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-slate-400 animate-pulse">Loading Job Details...</div>;
  if (!job) return <div className="p-20 text-center">Job not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="bg-indigo-600 p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <motion.h1 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{job.title}</motion.h1>
          <div className="flex flex-wrap gap-6 text-indigo-100 font-bold text-sm">
            <span className="flex items-center gap-2 bg-indigo-500/50 px-4 py-2 rounded-full"><MapPin size={16}/> {job.location}</span>
            <span className="flex items-center gap-2 bg-indigo-500/50 px-4 py-2 rounded-full"><Briefcase size={16}/> {job.department}</span>
            <span className="flex items-center gap-2 bg-indigo-500/50 px-4 py-2 rounded-full"><GraduationCap size={16}/> {job.experience}</span>
          </div>
        </div>

        {/* Info & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="lg:col-span-2 p-8 md:p-12 bg-slate-50/50 border-r border-slate-100">
            <h3 className="text-xl font-black text-slate-800 mb-4">Job Description</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          <div className="lg:col-span-3 p-8 md:p-12">
            {!candidateUser ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-black text-slate-800 mb-4">Interested in this role?</h2>
                <p className="text-slate-500 mb-8">You need to verify your identity before applying.</p>
                <button onClick={() => navigate(`/candidate/login?redirect=${location.pathname}`)} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Get Started with OTP</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-2xl">
                  <div className="text-xs">
                    <p className="text-indigo-400 font-black uppercase tracking-widest">Applying as</p>
                    <p className="text-indigo-900 font-bold">{candidateUser.name} ({candidateUser.email})</p>
                  </div>
                  <button type="button" onClick={() => { localStorage.clear(); window.location.reload(); }} className="p-2 text-indigo-400 hover:text-indigo-600 transition"><LogOut size={18}/></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 text-slate-300" size={16}/>
                      <input required type="tel" className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="+91..." onChange={e => setBasicInfo({...basicInfo, phone: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Resume Link</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-3.5 text-slate-300" size={16}/>
                      <input required type="url" className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="G-Drive/Dropbox Link" onChange={e => setBasicInfo({...basicInfo, resumeUrl: e.target.value})} />
                    </div>
                  </div>
                </div>

                {job.formFields?.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Screening Questions</h4>
                    {job.formFields.map((field: any, i: number) => (
                      <div key={i} className="space-y-1">
                        <label className="text-xs font-bold text-slate-500">{field.label} {field.required && "*"}</label>
                        {field.inputType === "select" ? (
                          <select required={field.required} className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 appearance-none" onChange={e => setAnswers({...answers, [field.label]: e.target.value})}>
                            <option value="">Choose option</option>
                            {field.options?.map((o: string) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input required={field.required} type={field.inputType} className="w-full p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" onChange={e => setAnswers({...answers, [field.label]: e.target.value})} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <button type="submit" disabled={submitting} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 disabled:bg-slate-200">
                  {submitting ? "Sending..." : "Submit Application"} <Send size={20}/>
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default ApplyJob;