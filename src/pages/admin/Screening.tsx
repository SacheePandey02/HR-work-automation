import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Award, MessageSquare, CheckCircle2, Loader2, Search, 
  MoreVertical, Briefcase, Filter, Sparkles, FileText, Check, Edit3,
} from "lucide-react";
import toast from "react-hot-toast";

const Screening = () => {
  const [allCandidates, setAllCandidates] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Offer Letter Preview States
  const [showOfferPreview, setShowOfferPreview] = useState(false);
  const [offerContent, setOfferContent] = useState("");

  // Filters
  const [filters, setFilters] = useState({ domain: "", status: "", searchQuery: "" });
  const [evalData, setEvalData] = useState({ score: 0, notes: "", package: "" });
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/.netlify/functions/get-candidates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const inPipeline = data.filter((c: any) => ["Shortlisted", "Interviewing", "Hired"].includes(c.status));
      setAllCandidates(inPipeline);
      setCandidates(inPipeline);
    } catch (err) {
      toast.error("Failed to load pipeline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    let filtered = allCandidates;
    if (filters.domain) filtered = filtered.filter(c => c.jobId?.domain === filters.domain);
    if (filters.status) filtered = filtered.filter(c => c.status === filters.status);
    if (filters.searchQuery) {
      filtered = filtered.filter(c => 
        c.fullName.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
        c.jobId?.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }
    setCandidates(filtered);
  }, [filters, allCandidates]);

  // Initial Action Handler
  const handleAction = async (status: string) => {
    if (status === "Hired") {
      const draft = `Dear ${selected.fullName},\n\nWe are pleased to offer you the position of ${selected.jobId?.title}. Based on your performance (Score: ${evalData.score}%) and interview feedback, we have finalized an annual package of ${evalData.package}.\n\nNotes: ${evalData.notes}\n\nPlease review and confirm your acceptance.`;
      setOfferContent(draft);
      setShowOfferPreview(true);
    } else {
      await finalizeCandidate(status);
    }
  };

  // Final API Dispatcher
  const finalizeCandidate = async (status: string, finalMessage?: string) => {
    setIsProcessing(true);
    const toastId = toast.loading("Processing...");
    try {
      const resStatus = await fetch("/.netlify/functions/update-app-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          id: selected._id, 
          status, 
          testScore: evalData.score, 
          interviewFeedback: evalData.notes, 
          offeredPackage: evalData.package 
        }),
      });

      if (status === "Hired" && resStatus.ok) {
        await fetch("/.netlify/functions/send-bulk-email", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ 
            emails: [selected.email], 
            type: "OFFER_LETTER", 
            candidateName: selected.fullName, 
            packageAmount: evalData.package, 
            jobTitle: selected.jobId?.title, 
            message: finalMessage || offerContent 
          }),
        });
      }
      toast.success(`Candidate status: ${status}`, { id: toastId });
      setSelected(null);
      setShowOfferPreview(false);
      fetchData();
    } catch (err) {
      toast.error("Process failed", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="p-4 md:p-8 space-y-10 pb-20 bg-slate-50 min-h-screen">
      
      {/* 🏎️ #1. HORIZONTAL CAROUSEL (ZOMATO STYLE) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
             <Sparkles size={12} className="text-indigo-500" /> Action Required
           </h2>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 px-2 no-scrollbar scroll-smooth">
          {candidates.map((c) => (
            <motion.div key={c._id} whileHover={{ y: -5 }} className={`flex-shrink-0 w-60 md:w-64 bg-white rounded-[2rem] border p-6 shadow-sm transition-all hover:shadow-xl ${c.status === 'Hired' ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-100'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="max-w-[70%]">
                  <h3 className="text-lg font-bold text-slate-800 truncate">{c.fullName}</h3>
                  <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest truncate mt-0.5">{c.jobId?.title}</p>
                </div>
                <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${c.status === 'Hired' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-600'}`}>{c.status}</div>
              </div>
              <div className="bg-slate-50/80 p-3 rounded-2xl mb-4">
                <div className="flex justify-between text-[8px] font-black text-slate-400 mb-1.5 uppercase"><span>Score</span><span>{c.testScore || 0}%</span></div>
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${c.testScore || 0}%` }} className={`h-full ${c.testScore > 70 ? 'bg-emerald-500' : 'bg-indigo-600'}`} />
                </div>
              </div>
              <button onClick={() => { setSelected(c); setEvalData({ score: c.testScore, notes: c.interviewFeedback, package: c.offeredPackage }); }} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase shadow-md shadow-indigo-100 hover:bg-indigo-700 transition">View Details</button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ⚪️ #2. FILTER CARD */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Briefcase size={14}/> Domain</label>
            <select className="w-full border-none bg-slate-50/80 p-4 rounded-2xl font-bold text-slate-700 outline-none appearance-none" onChange={e => setFilters({...filters, domain: e.target.value})}><option value="">All Domains</option><option value="Tech">Tech</option><option value="Sales">Sales</option><option value="Operations">Operations</option></select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Filter size={14}/> Stage</label>
            <select className="w-full border-none bg-slate-50/80 p-4 rounded-2xl font-bold text-slate-700 outline-none appearance-none" onChange={e => setFilters({...filters, status: e.target.value})}><option value="">All Stages</option><option value="Shortlisted">Shortlisted</option><option value="Interviewing">Interviewing</option><option value="Hired">Hired</option></select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Search size={14}/> Search</label>
            <input type="text" placeholder="e.g. Varun" className="w-full border-none bg-slate-50/80 p-4 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition" onChange={e => setFilters({...filters, searchQuery: e.target.value})} />
          </div>
        </div>
      </motion.div>

      {/* 📋 #3. TABLE WITH HORIZONTAL SCROLL FIX */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Master Pipeline View</h2>
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          {/* ✅ Outer container controls overflow */}
          <div className="overflow-x-auto no-scrollbar">
            {/* ✅ min-w ensures the table doesn't squish and triggers the scroll */}
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-white border-b border-slate-50">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="p-8 w-12"><input type="checkbox" className="rounded" onChange={e => setSelectedIds(e.target.checked ? candidates.map(c => c._id) : [])} /></th>
                  <th className="p-8">Candidate</th>
                  <th className="p-8">Position</th>
                  <th className="p-8 text-center">Score</th>
                  <th className="p-8">Status</th>
                  <th className="p-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {candidates.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-8 w-12"><input type="checkbox" checked={selectedIds.includes(c._id)} className="rounded" onChange={() => setSelectedIds(prev => prev.includes(c._id) ? prev.filter(id => id !== c._id) : [...prev, c._id])} /></td>
                    <td className="p-8"><p className="font-black text-slate-800 text-lg tracking-tight leading-none mb-1">{c.fullName}</p><p className="text-xs text-slate-400 font-medium">{c.email}</p></td>
                    <td className="p-8"><p className="text-sm font-black text-slate-600">{c.jobId?.title}</p><p className="text-[10px] text-indigo-400 font-bold uppercase">{c.jobId?.domain}</p></td>
                    <td className="p-8 text-center"><span className={`text-xs font-black ${c.testScore > 70 ? 'text-emerald-600' : 'text-indigo-600'}`}>{c.testScore || 0}%</span></td>
                    <td className="p-8"><span className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${c.status === 'Hired' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}><CheckCircle2 size={14}/> {c.status}</span></td>
                    <td className="p-8 text-right"><button onClick={() => setSelected(c)} className="p-3 bg-slate-100 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all transform group-hover:scale-110"><MoreVertical size={20} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {candidates.length === 0 && <div className="p-20 text-center text-slate-300 font-black italic uppercase">No results found</div>}
        </div>
      </div>

      {/* 👤 EVALUATION MODAL */}
      <AnimatePresence>
        {selected && !showOfferPreview && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden border border-white">
              <div className="p-6 md:p-10 border-b bg-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg">{selected.fullName.charAt(0)}</div>
                  <div><h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">{selected.fullName}</h2><p className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Pipeline Review</p></div>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-300 hover:text-red-500 text-3xl transition-colors">&times;</button>
              </div>
              <div className="p-6 md:p-10 space-y-6">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><MessageSquare size={14} /> Feedback</label><textarea className="w-full bg-slate-50 border-none rounded-2xl p-5 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition" rows={4} value={evalData.notes} onChange={(e) => setEvalData({ ...evalData, notes: e.target.value })} /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Award size={14} /> Final Package (LPA)</label><input className="w-full bg-slate-50 border-none rounded-2xl p-5 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition" value={evalData.package} onChange={(e) => setEvalData({ ...evalData, package: e.target.value })} /></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button onClick={() => handleAction("Rejected")} className="bg-red-50 text-red-600 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition"> Reject </button>
                  <button onClick={() => handleAction("Interviewing")} className="bg-blue-50 text-blue-600 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition"> Interview </button>
                  <button onClick={() => handleAction("Hired")} className="bg-indigo-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition"> Hire & Offer </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📄 OFFER LETTER PREVIEW MODAL */}
      <AnimatePresence>
        {showOfferPreview && selected && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white flex flex-col max-h-[90vh]">
              <div className="p-6 md:p-8 border-b bg-indigo-600 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FileText size={24} />
                  <div>
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">Review Offer Letter</h2>
                    <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">Candidate: {selected.fullName}</p>
                  </div>
                </div>
                <button onClick={() => setShowOfferPreview(false)} className="text-white/50 hover:text-white transition-colors text-3xl">&times;</button>
              </div>

              <div className="p-6 md:p-8 bg-slate-50 overflow-y-auto flex-1">
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-inner border border-slate-200 min-h-[300px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 mb-4">
                    <Edit3 size={12} /> Edit Document Content
                  </label>
                  <textarea 
                    className="w-full h-64 font-serif text-slate-700 leading-relaxed outline-none resize-none"
                    value={offerContent}
                    onChange={(e) => setOfferContent(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-6 md:p-8 bg-white border-t flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowOfferPreview(false)} 
                  className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase hover:bg-slate-200 transition"
                >
                  Back
                </button>
                <button 
                  disabled={isProcessing}
                  onClick={() => finalizeCandidate("Hired")}
                  className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={18}/> : <Check size={18}/>}
                  Confirm & Dispatch
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Screening;