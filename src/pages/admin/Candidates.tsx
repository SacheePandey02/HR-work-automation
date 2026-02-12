import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Mail, Filter, ChevronRight, X, 
  CheckCircle, Send, 
  DollarSign, Briefcase, Award,
} from "lucide-react";
import toast from "react-hot-toast";

const Candidates = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [allCandidates, setAllCandidates] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  
  // ✅ Email State Logic
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({ 
    type: "GENERAL", 
    subject: "", 
    message: "", 
    package: "" 
  });

  // ✅ Selection-based Filters
  const [filters, setFilters] = useState({ 
    domain: "", 
    status: "", 
    salaryRange: "", 
    expRange: "" 
  });

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const res = await fetch("/.netlify/functions/get-candidates", { 
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAllCandidates(data);
      setCandidates(data);
    } catch (err) {
      toast.error("Failed to load candidates");
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ✅ Advanced Filtering Logic (Salary & Experience Ranges)
  useEffect(() => {
    let filtered = allCandidates;

    // 1. Domain Filter
    if (filters.domain) {
      filtered = filtered.filter(c => c.jobId?.domain === filters.domain);
    }

    // 2. Status Filter
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    // 3. Salary Range Logic
    if (filters.salaryRange) {
      filtered = filtered.filter(c => {
        // Find salary answer in form or offered package
        const val = c.offeredPackage || c.answers?.find((a: any) => 
            a.label.toLowerCase().includes("ctc") || a.label.toLowerCase().includes("salary")
        )?.answer;
        
        if(!val) return false;
        const num = parseFloat(val.replace(/[^0-9.]/g, ""));
        
        if (filters.salaryRange === "0-5") return num <= 5;
        if (filters.salaryRange === "5-10") return num > 5 && num <= 10;
        if (filters.salaryRange === "10-20") return num > 10 && num <= 20;
        if (filters.salaryRange === "20+") return num > 20;
        return true;
      });
    }

    // 4. Experience Range Logic (Mapping form answers or Job requirements)
    if (filters.expRange) {
      filtered = filtered.filter(c => {
        const formExp = c.answers?.find((a: any) => 
            a.label.toLowerCase().includes("experience") || a.label.toLowerCase().includes("years")
        )?.answer;
        
        // Logic: Assume candidate matches Job Exp if not specified in form
        const effectiveExp = formExp || c.jobId?.experience || "";
        
        if (filters.expRange === "Fresher") return effectiveExp.toLowerCase().includes("fresher") || effectiveExp.includes("0-1");
        return effectiveExp.includes(filters.expRange);
      });
    }

    setCandidates(filtered);
  }, [filters, allCandidates]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/.netlify/functions/update-app-status", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        toast.success(`Status updated to ${status}`);
        fetchData();
      }
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const handleSendEmails = async () => {
    // Determine target recipient(s)
    const targetIds = selectedIds.length > 0 ? selectedIds : [selectedCandidate?._id];
    const recipients = allCandidates.filter(c => targetIds.includes(c._id));

    if (recipients.length === 0) return toast.error("No recipients selected");
    
    const res = await fetch("/.netlify/functions/send-bulk-email", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        emails: recipients.map(r => r.email),
        type: emailData.type,
        subject: emailData.subject || "Next Steps in Recruitment",
        message: emailData.message,
        candidateId: recipients[0]?._id, // Reference for dynamic links
        candidateName: recipients.length === 1 ? recipients[0].fullName : "Candidate",
        packageAmount: emailData.package
      })
    });

    if(res.ok) {
      toast.success("Dispatch Successful! 🚀");
      setShowEmailModal(false);
      setSelectedIds([]);
    } else {
      toast.error("Mail server error");
    }
  };

  return (
    <div className="p-6 md:p-12 bg-slate-50 min-h-screen">
      
      {/* 🚀 Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div className="w-full">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="text-indigo-600" size={36} /> Candidate Pool
          </h1>
          <p className="text-slate-500 font-medium mt-1">Track and manage your active talent pipeline</p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02, translateY: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowEmailModal(true)} 
          disabled={selectedIds.length === 0} 
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-indigo-100 disabled:bg-slate-300 disabled:shadow-none transition-all"
        >
          <Mail size={20} /> Bulk Email ({selectedIds.length})
        </motion.button>
      </div>

      {/* 🔍 RANGE-BASED FILTERS */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Briefcase size={14}/> Job Domain</label>
            <select className="w-full bg-slate-50 border-none p-3.5 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition" 
              onChange={e => setFilters({...filters, domain: e.target.value})}>
              <option value="">All Domains</option>
              <option value="Tech">Tech</option><option value="Sales">Sales</option><option value="Operations">Operations</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Filter size={14}/> Status</label>
            <select className="w-full bg-slate-50 border-none p-3.5 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition" 
              onChange={e => setFilters({...filters, status: e.target.value})}>
              <option value="">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Rejected">Rejected</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Hired">Hired</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><DollarSign size={14}/> Salary Range</label>
            <select className="w-full bg-slate-50 border-none p-3.5 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition" 
              onChange={e => setFilters({...filters, salaryRange: e.target.value})}>
              <option value="">Any Salary</option>
              <option value="0-5">0 - 5 LPA</option>
              <option value="5-10">5 - 10 LPA</option>
              <option value="10-20">10 - 20 LPA</option>
              <option value="20+">20+ LPA</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Award size={14}/> Experience</label>
            <select className="w-full bg-slate-50 border-none p-3.5 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition" 
              onChange={e => setFilters({...filters, expRange: e.target.value})}>
              <option value="">Any Exp</option>
              <option value="Fresher">Fresher</option>
              <option value="1-3">1 - 3 Years</option>
              <option value="3-5">3 - 5 Years</option>
              <option value="5+">5+ Years</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* 📋 TABLE CONTAINER */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white border-b border-slate-50">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <th className="p-8 w-12 text-center"><input type="checkbox" className="rounded" onChange={e => setSelectedIds(e.target.checked ? candidates.map(c => c._id) : [])} /></th>
                <th className="p-8">Candidate</th>
                <th className="p-8 text-center">Domain</th>
                <th className="p-8 text-center">Status</th>
                <th className="p-8 text-center">Applied Date</th>
                <th className="p-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {candidates.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="p-8"><input type="checkbox" checked={selectedIds.includes(c._id)} className="rounded" onChange={() => setSelectedIds(prev => prev.includes(c._id) ? prev.filter(id => id !== c._id) : [...prev, c._id])} /></td>
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">{c.fullName.charAt(0)}</div>
                      <div>
                        <p className="font-black text-slate-800 text-lg tracking-tight leading-none mb-1">{c.fullName}</p>
                        <p className="text-xs text-slate-400 font-medium">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8 text-center">
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {c.jobId?.domain || "N/A"}
                    </span>
                  </td>
                  <td className="p-8 text-center">
                    <span className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${
                      c.status === 'Hired' ? 'bg-blue-50 text-blue-600' : 
                      c.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      <CheckCircle size={14}/> {c.status}
                    </span>
                  </td>
                  <td className="p-8 text-center text-slate-500 font-bold text-sm">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-8 text-right">
                    <button onClick={() => setSelectedCandidate(c)} className="p-3 bg-slate-100 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all transform group-hover:scale-110 shadow-sm">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {candidates.length === 0 && (
            <div className="p-20 text-center text-slate-300 font-black italic uppercase tracking-widest">No matching talent found</div>
          )}
        </div>
      </motion.div>

      {/* 👤 Candidate Detail Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] p-4 flex items-center justify-center">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-white"
            >
              <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">{selectedCandidate.fullName.charAt(0)}</div>
                  <div><h2 className="text-2xl font-black text-slate-800">{selectedCandidate.fullName}</h2><p className="text-indigo-600 font-black text-[10px] uppercase">Reviewing Profile</p></div>
                </div>
                <button onClick={() => setSelectedCandidate(null)} className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors rounded-xl"><X size={24}/></button>
              </div>

              <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6 custom-scrollbar">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p>
                        <p className="text-sm font-bold text-slate-800">{selectedCandidate.email}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                        <p className="text-sm font-bold text-slate-800">{selectedCandidate.phone}</p>
                    </div>
                 </div>
                 <a href={selectedCandidate.resumeUrl} target="_blank" rel="noreferrer" className="block p-4 bg-indigo-50 text-indigo-600 rounded-2xl text-center font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">View Linked Resume</a>
                 
                 <div className="space-y-4">
                    <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest border-l-4 border-indigo-500 pl-3">Form Responses</h3>
                    {selectedCandidate.answers.map((a: any, i: number) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">{a.label}</p><p className="text-sm font-bold text-slate-800">{a.answer}</p></div>
                    ))}
                 </div>
              </div>

              <div className="p-8 bg-slate-50 border-t flex gap-4">
                <button onClick={() => updateStatus(selectedCandidate._id, "Rejected")} className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition">Reject Candidate</button>
                <button onClick={() => { updateStatus(selectedCandidate._id, "Shortlisted"); setShowEmailModal(true); }} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition">Shortlist & Send Invite</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ✉️ Email Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} 
              className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-800">Compose Message</h2>
                <X className="cursor-pointer text-slate-400 hover:text-red-500" onClick={() => setShowEmailModal(false)} />
              </div>
              <div className="space-y-5">
                <select className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" 
                  onChange={e => setEmailData({...emailData, type: e.target.value})}>
                  <option value="GENERAL">Assessment Link (General)</option>
                  <option value="OFFER_LETTER">Professional Offer Letter</option>
                </select>
                <input placeholder="Subject Line" className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" 
                  onChange={e => setEmailData({...emailData, subject: e.target.value})} />
                
                {emailData.type === "OFFER_LETTER" && (
                  <input placeholder="Offer Package (LPA)" className="w-full bg-indigo-50 p-4 rounded-2xl border-none font-black text-indigo-700 outline-none" 
                    onChange={e => setEmailData({...emailData, package: e.target.value})} />
                )}

                <textarea placeholder="Write your message..." className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" rows={4} 
                  onChange={e => setEmailData({...emailData, message: e.target.value})} />
                
                <button onClick={handleSendEmails} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl hover:bg-indigo-700 transition-all">
                   <Send size={20} /> Dispatch Now 
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Candidates;