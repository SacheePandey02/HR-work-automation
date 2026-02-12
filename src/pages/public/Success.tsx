import { motion } from "framer-motion";
import { CheckCircle, Mail, Clock } from "lucide-react";

const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[3.5rem] shadow-2xl text-center max-w-lg border border-slate-100 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />
        
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle size={48} />
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Application Received!</h1>
        <p className="text-slate-500 leading-relaxed mb-10">
          Your application is currently <span className="text-indigo-600 font-black">Under Review</span>. 
          Our HR team will reach out to you via email for the next steps.
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-slate-50 rounded-3xl flex flex-col items-center">
            <Mail className="text-indigo-400 mb-2" size={20} />
            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Check Inbox</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-3xl flex flex-col items-center">
            <Clock className="text-indigo-400 mb-2" size={20} />
            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">2-3 Day Review</p>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
export default Success;