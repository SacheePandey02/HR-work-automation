import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Edit3, Briefcase, MapPin, Users, Eye, Share2, X, Copy, 
  Mail, Facebook, MessageCircle, Twitter, Smartphone, 
  CalendarClock, Loader2, CalendarDays 
} from "lucide-react";
import toast from "react-hot-toast";

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [sharingJob, setSharingJob] = useState<any>(null); 
  const [previewJob, setPreviewJob] = useState<any>(null); 
  const [extendingJob, setExtendingJob] = useState<any>(null);
  const [newExpiryDate, setNewExpiryDate] = useState("");

  const token = localStorage.getItem("token");

  const fetchJobs = async () => {
    try {
      const res = await fetch("/.netlify/functions/get-hr-jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      toast.error("Failed to sync jobs");
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  // ✅ FIXED: Using parameters correctly
  const performUpdate = async (id: string, action: string, extraData = {}) => {
    setLoadingId(id);
    try {
      const res = await fetch("/.netlify/functions/update-job", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ id, action, ...extraData }),
      });
      if (res.ok) {
        toast.success(action === "CLOSE" ? "Recruitment Closed" : "Job Expiry Updated");
        setExtendingJob(null); 
        await fetchJobs();
      }
    } catch {
      toast.error("Action failed");
    } finally {
      setLoadingId(null);
    }
  };

  const generatePostText = (job: any) => {
    const link = `${window.location.origin}/apply/${job._id}`;
    return `🚀 We are hiring a ${job.title}!\n\n📍 Location: ${job.location}\n📄 Exp: ${job.experience || 'Not specified'}\n\n${job.description || ''}\n\n👉 Apply here: ${link}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Content copied!");
  };

  return (
    <div className="space-y-8 pb-20 px-2">
      <header>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Manage Postings</h1>
        <p className="text-slate-500 text-sm font-medium">Distribute openings and track candidate intake.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, i) => {
          const isClosed = job.jobStatus === "closed";
          return (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`relative bg-white p-6 rounded-[2.5rem] border flex flex-col justify-between transition-all ${
                isClosed ? "opacity-60 grayscale bg-slate-50 border-slate-200" : "shadow-sm border-slate-100 hover:shadow-xl"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white ${isClosed ? "bg-slate-400" : "bg-indigo-600 shadow-lg"}`}>
                    <Briefcase size={22} />
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    isClosed ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {isClosed ? "Closed" : "Published"}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-1 truncate leading-tight">{job.title}</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold">
                    <span className="flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                    <span className="flex items-center gap-1 text-indigo-600">
                        <Users size={12}/> {job.applicantsCount || 0} Candidates
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                    <CalendarClock size={12} className="text-amber-500"/> Closing: {new Date(job.closingDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-100">
                  <button onClick={() => setSharingJob(job)} className="flex flex-col items-center py-2 bg-slate-50 rounded-2xl text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all text-[9px] font-black uppercase"><Share2 size={16}/>Share</button>
                  <button onClick={() => setPreviewJob(job)} className="flex flex-col items-center py-2 bg-slate-50 rounded-2xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all text-[9px] font-black uppercase"><Eye size={16}/>Preview</button>
                  <Link to={`/admin/create-job?edit=${job._id}`} className="flex flex-col items-center py-2 bg-slate-50 rounded-2xl text-slate-500 hover:bg-amber-50 hover:text-amber-600 transition-all text-[9px] font-black uppercase"><Edit3 size={16}/>Edit</Link>
                </div>

                <div className="flex gap-2">
                    {!isClosed ? (
                      <button 
                        disabled={loadingId === job._id}
                        onClick={() => performUpdate(job._id, "CLOSE")} 
                        className="flex-1 py-3 rounded-2xl font-black text-[10px] uppercase border-2 border-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        {loadingId === job._id ? <Loader2 className="animate-spin" size={14}/> : "Close Job"}
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                            setExtendingJob(job);
                            setNewExpiryDate(new Date().toISOString().split('T')[0]);
                        }}
                        className="flex-1 py-3 text-center text-indigo-600 font-black text-[10px] uppercase bg-indigo-50 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition-all"
                      >
                        Re-Open
                      </button>
                    )}

                    <button 
                        onClick={() => {
                            setExtendingJob(job);
                            setNewExpiryDate(new Date().toISOString().split('T')[0]);
                        }}
                        className="px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-200 transition-all"
                    >
                        Extend
                    </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* --- EXTEND MODAL --- */}
      <AnimatePresence>
        {extendingJob && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setExtendingJob(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 border border-white flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><CalendarDays size={20}/></div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Extend Expiry</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Expiry</p>
                  <p className="font-bold text-slate-700">{new Date(extendingJob.closingDate).toLocaleDateString()}</p>
                </div>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all"
                  value={newExpiryDate}
                  onChange={(e) => setNewExpiryDate(e.target.value)}
                />
                <div className="flex gap-3">
                  <button 
                    disabled={loadingId === extendingJob._id}
                    onClick={() => performUpdate(extendingJob._id, "EXTEND", { customDate: newExpiryDate })}
                    className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-indigo-700 flex items-center justify-center"
                  >
                    {loadingId === extendingJob._id ? <Loader2 className="animate-spin" size={18}/> : "Update Date"}
                  </button>
                  <button onClick={() => setExtendingJob(null)} className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase hover:bg-slate-200">Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- PREVIEW MODAL (Used generatePostText) --- */}
      <AnimatePresence>
        {previewJob && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewJob(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="relative bg-white w-full max-w-[340px] rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[75vh]">
              <div className="px-6 py-5 border-b border-slate-100 bg-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Smartphone size={18}/></div>
                   <h2 className="text-sm font-black text-slate-800">Social Preview</h2>
                </div>
                <button onClick={() => setPreviewJob(null)} className="text-slate-300 hover:text-red-500"><X size={20} /></button>
              </div>
              <div className="p-5 bg-white overflow-y-auto no-scrollbar">
                <div className="bg-[#e7f3ef] border border-[#d1e7dd] p-5 rounded-2xl rounded-tl-none relative text-[#111b21]">
                  <div className="absolute top-0 left-[-8px] w-0 h-0 border-t-[12px] border-t-[#e7f3ef] border-l-[12px] border-l-transparent" />
                  <pre className="whitespace-pre-wrap font-sans text-[11px] leading-relaxed tracking-tight">{generatePostText(previewJob)}</pre>
                </div>
              </div>
              <div className="p-5 bg-white border-t border-slate-100 flex gap-2">
                <button onClick={() => copyToClipboard(generatePostText(previewJob))} className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-black text-[11px] flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all uppercase"><Copy size={14} /> Copy Post</button>
                <button onClick={() => setPreviewJob(null)} className="px-5 py-3 bg-slate-50 text-slate-500 rounded-2xl font-black text-[11px] hover:bg-slate-100 uppercase transition-all">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SHARE MODAL (Uses generatePostText) --- */}
      <AnimatePresence>
        {sharingJob && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSharingJob(null)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"/>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-[#121212] text-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-white/10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold tracking-tight text-white">Share Opening</h2>
                <X className="cursor-pointer text-slate-500 hover:text-white" onClick={() => setSharingJob(null)} size={24} />
              </div>
              <div className="grid grid-cols-4 gap-4 mb-10">
                {[
                  { name: 'WhatsApp', icon: <MessageCircle size={26} />, color: 'bg-[#25D366]', url: `https://wa.me/?text=${encodeURIComponent(generatePostText(sharingJob))}` },
                  { name: 'X', icon: <Twitter size={26} />, color: 'bg-black border border-white/20', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(generatePostText(sharingJob))}` },
                  { name: 'Email', icon: <Mail size={26} />, color: 'bg-slate-700', url: `mailto:?subject=Job Opening&body=${encodeURIComponent(generatePostText(sharingJob))}` },
                  { name: 'FB', icon: <Facebook size={26} />, color: 'bg-[#1877F2]', url: `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/apply/${sharingJob._id}` },
                ].map((item) => (
                  <a key={item.name} href={item.url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 group">
                    <div className={`w-14 h-14 ${item.color} rounded-full flex items-center justify-center transition-all group-hover:scale-110 shadow-lg text-white`}>{item.icon}</div>
                    <span className="text-[10px] font-black text-slate-500 uppercase">{item.name}</span>
                  </a>
                ))}
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center gap-2">
                <input readOnly value={`${window.location.origin}/apply/${sharingJob._id}`} className="bg-transparent flex-1 text-[10px] pl-3 outline-none text-slate-400 truncate" />
                <button onClick={() => copyToClipboard(`${window.location.origin}/apply/${sharingJob._id}`)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Copy</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Jobs;