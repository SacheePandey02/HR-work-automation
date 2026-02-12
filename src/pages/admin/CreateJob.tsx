import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trash2, Plus, Send, CalendarClock } from "lucide-react";
import Input from "../../components/Input";
import Select from "../../components/Select";
import toast from "react-hot-toast";

const TEMPLATES = {
  Sales: [
    { label: "Years of Sales Experience", inputType: "number", required: true },
    { label: "Do you own a vehicle?", inputType: "select", options: ["Yes", "No"], required: true },
    { label: "Current CTC", inputType: "text", required: true },
    { label: "Expected Salary", inputType: "text", required: true },
  ],
  Tech: [
    { label: "GitHub Profile URL", inputType: "text", required: true },
    { label: "Portfolio URL", inputType: "text", required: false },
    { label: "Primary Tech Stack", inputType: "select", options: ["MERN", "Java", "Python"], required: true },
  ],
  Operations: [
    { label: "Willing to work night shifts?", inputType: "select", options: ["Yes", "No"], required: true },
    { label: "Excel Proficiency (1-10)", inputType: "number", required: true },
  ],
};

const CreateJob = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", domain: "", department: "", experience: "", location: "",
    description: "", duration: "", createdAt: new Date().toISOString()
  });

  const [formFields, setFormFields] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // 1. Fetch data for pre-fill if in Edit Mode
  useEffect(() => {
    if (editId) {
      const fetchJobData = async () => {
        const res = await fetch(`/.netlify/functions/get-job-public?id=${editId}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            title: data.title || "",
            domain: data.domain || "",
            department: data.department || "",
            experience: data.experience || "",
            location: data.location || "",
            description: data.description || "",
            duration: data.duration || "",
            createdAt: data.createdAt || new Date().toISOString()
          });
          setFormFields(data.formFields || []);
        }
      };
      fetchJobData();
    }
  }, [editId]);

  const handleTemplateSelect = (e: any) => {
    const tmpl = e.target.value;
    setSelectedTemplate(tmpl);
    if (tmpl && TEMPLATES[tmpl as keyof typeof TEMPLATES]) {
      setFormFields([...TEMPLATES[tmpl as keyof typeof TEMPLATES]]);
    } else {
      setFormFields([]);
    }
  };

  const handleSaveJob = async () => {
    if(!form.domain || !form.title) return toast.error("Please fill Job Title and Domain");
    
    const token = localStorage.getItem("token");
    const url = editId ? "/.netlify/functions/update-job" : "/.netlify/functions/create-job";
    
    const res = await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ 
        id: editId, 
        action: editId ? "EDIT_FULL" : undefined,
        ...form, 
        formFields 
      }),
    });

    if (res.ok) {
      toast.success(editId ? "Job Updated!" : "Job Published!");
      navigate("/admin/jobs");
    } else {
      toast.error("Failed to save changes");
    }
  };

  const closingDate = form.createdAt && form.duration
    ? new Date(new Date(form.createdAt).getTime() + Number(form.duration) * 24 * 60 * 60 * 1000).toLocaleDateString()
    : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-32">
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          {editId ? "Edit Job Posting" : "Create Hiring Post"}
        </h1>
        <p className="text-slate-500 font-medium">Define your requirements and control job duration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information Card */}
        <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <Input label="Job Title" value={form.title} onChange={(e:any) => setForm({...form, title: e.target.value})} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Domain" value={form.domain} options={["Tech", "Sales", "Operations", "Marketing", "HR"]} onChange={(e:any) => setForm({...form, domain: e.target.value})} />
            <Input label="Department" value={form.department} onChange={(e:any) => setForm({...form, department: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Experience" value={form.experience} options={["Fresher", "1-3 Years", "3-5 Years", "5+ Years"]} onChange={(e:any) => setForm({...form, experience: e.target.value})} />
            <Input label="Location" value={form.location} onChange={(e:any) => setForm({...form, location: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Job Duration (Days)" type="number" value={form.duration} onChange={(e:any) => setForm({...form, duration: e.target.value})} />
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase"><CalendarClock size={14} /> Closing Date</div>
              <p className="text-lg font-black text-indigo-600 mt-1">{closingDate || "—"}</p>
            </div>
          </div>

          <textarea className="w-full bg-slate-50 rounded-2xl p-4 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[160px]" placeholder="Describe the role responsibilities..." value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
        </motion.div>

        {/* Form Builder Card */}
        <motion.div initial={{ x: 20 }} animate={{ x: 0 }} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center"><Sparkles size={20} /></div>
              <h2 className="text-xl font-bold text-slate-800">Candidate Form</h2>
            </div>
            <select value={selectedTemplate} onChange={handleTemplateSelect} className="bg-violet-50 text-violet-700 p-2 rounded-xl text-xs font-black uppercase outline-none border-none">
              <option value="">Custom</option>
              <option value="Tech">Tech</option>
              <option value="Sales">Sales</option>
              <option value="Operations">Ops</option>
            </select>
          </div>

          <div className="flex-1 space-y-3">
            <AnimatePresence>
              {formFields.map((field, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <input className="flex-1 bg-transparent px-2 font-bold text-slate-700 outline-none" value={field.label} onChange={(e) => { const up = [...formFields]; up[i].label = e.target.value; setFormFields(up); }} />
                  <button onClick={() => setFormFields(formFields.filter((_, idx) => idx !== i))} className="p-2 text-slate-300 hover:text-red-500 transition"><Trash2 size={16} /></button>
                </motion.div>
              ))}
            </AnimatePresence>
            <button onClick={() => setFormFields([...formFields, {label: "New Question", inputType: "text", required: true}])} className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 font-bold rounded-2xl hover:bg-slate-50 transition flex items-center justify-center gap-2">
              <Plus size={18} /> Add Custom Field
            </button>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSaveJob} className="group px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2">
          {editId ? "Update Posting" : "Publish Opening"} <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default CreateJob;
