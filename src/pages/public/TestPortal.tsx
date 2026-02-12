import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardCheck, Sparkles, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const QUESTIONS = [
  "I enjoy taking responsibility for complex projects.",
  "I remain calm and efficient during high-pressure situations.",
  "I prefer clear instructions over creative freedom.",
  "I am comfortable presenting my ideas to a large audience.",
  "I prioritize accuracy over speed when completing tasks."
];

const TestPortal = () => {
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [testCode, setTestCode] = useState("");
  const [answers, setAnswers] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const submitTest = async () => {
    if (answers.length < QUESTIONS.length) return toast.error("Please answer all questions");
    setSubmitting(true);
    try {
      const res = await fetch("/.netlify/functions/submit-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: id, testCode, answers })
      });
      if (res.ok) {
        toast.success("Assessment Submitted!");
        setStep(3);
      } else {
        toast.error("Verification Failed. Check your code.");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50/50 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white max-w-xl w-full rounded-[3rem] shadow-2xl overflow-hidden border border-white">
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="p1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-12 text-center">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <ClipboardCheck size={40} />
              </div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Assessment Login</h1>
              <p className="text-slate-400 mt-2 mb-10 text-sm font-medium">Please enter your 6-digit access code.</p>
              <input type="text" maxLength={6} className="w-full text-center text-5xl tracking-[1.5rem] font-mono border-b-4 border-indigo-100 pb-4 mb-12 outline-none focus:border-indigo-600 transition" value={testCode} onChange={e => setTestCode(e.target.value)} />
              <button onClick={() => testCode.length === 6 ? setStep(2) : toast.error("Enter 6 digits")} className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition">Start Evaluation</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="p2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-800">Psychometric Test</h2>
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">{answers.filter(a => a).length} / {QUESTIONS.length} Done</span>
              </div>
              
              <div className="space-y-8">
                {QUESTIONS.map((q, i) => (
                  <div key={i} className="space-y-4">
                    <p className="text-slate-700 font-bold text-sm">{i+1}. {q}</p>
                    <div className="flex justify-between gap-1">
                      {[1, 2, 3, 4, 5].map(v => (
                        <button key={v} onClick={() => {const a = [...answers]; a[i] = {value: v}; setAnswers(a);}} className={`flex-1 py-3 text-xs font-bold rounded-xl border transition-all ${answers[i]?.value === v ? 'bg-indigo-600 text-white border-indigo-600 scale-105 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-indigo-200'}`}>
                          {v === 1 ? 'Never' : v === 5 ? 'Always' : v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={submitTest} disabled={submitting} className="w-full mt-12 bg-emerald-600 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 hover:bg-emerald-700 transition disabled:bg-slate-200">
                {submitting ? 'Calculating Result...' : 'Finish Assessment'} <Sparkles size={20}/>
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="p3" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="p-20 text-center">
              <CheckCircle2 size={80} className="text-emerald-500 mx-auto mb-6" />
              <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tighter">Assessment Complete</h2>
              <p className="text-slate-400 font-medium">Your profile has been updated. We will be in touch shortly you can close the window</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
export default TestPortal;