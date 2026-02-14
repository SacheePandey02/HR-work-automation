import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, FileText, Users, Mic, Mail, GraduationCap, ChevronRight } from "lucide-react";

const features = [
  { title: "Automated Job Posting", desc: "Post across LinkedIn, Indeed & WhatsApp with one click.", icon: <Rocket className="text-indigo-600" /> },
  { title: "AI Resume Screening", desc: "Rank candidates instantly based on skill matching.", icon: <FileText className="text-blue-600" /> },
  { title: "Smart Shortlisting", desc: "Bias-free candidate evaluation at scale.", icon: <Users className="text-purple-600" /> },
  { title: "Interview Suite", desc: "Schedule and record interviews directly from your portal.", icon: <Mic className="text-pink-600" /> },
  { title: "Offer Automation", desc: "Generate professional HTML offer letters in seconds.", icon: <Mail className="text-orange-600" /> },
  { title: "LMS & Onboarding", desc: "Train your new hires with built-in modules.", icon: <GraduationCap className="text-teal-600" /> },
];

const PublicLayout = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");


  useEffect(() => {
    // If user is an HR Admin, don't show the landing page, go to dashboard
    if (token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [token, navigate]);

  // If token exists, return null or a loader to prevent UI flickering
  if (token) return null;


  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-indigo-100">
      {/* 🚀 Sticky Glass Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-600 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg rotate-12 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
           Zyncly
          </Link>

          <div className="flex gap-4">
            <Link to="/login" className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition">Login</Link>
            <Link to="/register" className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-full shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">Get Started</Link>
          </div>
        </div>
      </header>

      {/* 🌪️ Hero Section with Mesh Background */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10" />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest">Version 2.0 is Live</span>
            <h2 className="mt-8 text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Hire Faster, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Automate Better</span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
              The only end-to-end hiring pipeline that manages everything from JD creation to candidate training. Join 500+ smart HR teams.
            </p>

            <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
              <Link to="/register" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-xl">
                Start Free Trial <ChevronRight size={18} />
              </Link>
              <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition">Watch Demo</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🧩 Vibrant Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900">Built for Modern Teams</h3>
            <p className="text-slate-500 mt-2">Replace 10 different tools with one vibrant dashboard.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i} whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all group"
              >
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h4 className="font-bold text-lg text-slate-900 mb-2">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* 🕯️ Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 text-center">
        <p className="text-slate-400 text-sm font-medium">
          © 2026 Zyncly · Powered by HR Intelligence
        </p>
      </footer>
    </div>
  );
};

export default PublicLayout;
// import { useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   Rocket,
//   FileText,
//   Users,
//   Mic,
//   Mail,
//   GraduationCap,
//   ChevronRight,
//   Briefcase,
// } from "lucide-react";

// const features = [
//   {
//     title: "Automated Job Posting",
//     desc: "Post across LinkedIn, Indeed & WhatsApp with one click.",
//     icon: <Rocket className="text-indigo-600" />,
//   },
//   {
//     title: "AI Resume Screening",
//     desc: "Rank candidates instantly based on skill matching.",
//     icon: <FileText className="text-blue-600" />,
//   },
//   {
//     title: "Smart Shortlisting",
//     desc: "Bias-free candidate evaluation at scale.",
//     icon: <Users className="text-purple-600" />,
//   },
//   {
//     title: "Interview Suite",
//     desc: "Schedule and record interviews directly from your portal.",
//     icon: <Mic className="text-pink-600" />,
//   },
//   {
//     title: "Offer Automation",
//     desc: "Generate professional HTML offer letters in seconds.",
//     icon: <Mail className="text-orange-600" />,
//   },
//   {
//     title: "LMS & Onboarding",
//     desc: "Train your new hires with built-in modules.",
//     icon: <GraduationCap className="text-teal-600" />,
//   },
// ];

// const PublicLayout = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (token) {
//       navigate("/admin/dashboard", { replace: true });
//     }
//   }, [token, navigate]);

//   if (token) return null;

//   return (
//     <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-indigo-100">
//       {/* Navbar */}
//       <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-200">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           <Link
//             to="/"
//             className="text-2xl font-black tracking-tighter text-indigo-600 flex items-center gap-2"
//           >
//             <div className="w-8 h-8 bg-indigo-600 rounded-lg rotate-12 flex items-center justify-center">
//               <div className="w-3 h-3 bg-white rounded-full" />
//             </div>
//             Zyncly
//           </Link>

//           <div className="flex gap-4">
//             <Link
//               to="/jobs"
//               className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition flex items-center gap-1"
//             >
//               <Briefcase size={16} /> Jobs
//             </Link>

//             <Link
//               to="/login"
//               className="px-5 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
//             >
//               Login
//             </Link>

//             <Link
//               to="/register"
//               className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-full shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
//             >
//               Get Started
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="relative pt-32 pb-20 overflow-hidden">
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10" />

//         <div className="max-w-7xl mx-auto px-6 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <span className="px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest">
//               Version 2.0 is Live
//             </span>

//             <h2 className="mt-8 text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
//               Hire Faster,{" "}
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
//                 Automate Better
//               </span>
//             </h2>

//             <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
//               The only end-to-end hiring pipeline that manages everything from
//               JD creation to candidate training. Join 500+ smart HR teams.
//             </p>

//             <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
//               <Link
//                 to="/register"
//                 className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-xl"
//               >
//                 Start Free Trial <ChevronRight size={18} />
//               </Link>

//               <Link
//                 to="/jobs"
//                 className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
//               >
//                 Apply for Jobs
//               </Link>

//               <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition">
//                 Watch Demo
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-24 bg-white">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center mb-16">
//             <h3 className="text-3xl font-bold text-slate-900">
//               Built for Modern Teams
//             </h3>
//             <p className="text-slate-500 mt-2">
//               Replace 10 different tools with one vibrant dashboard.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {features.map((f, i) => (
//               <motion.div
//                 key={i}
//                 whileHover={{ y: -5 }}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.1 }}
//                 className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all group"
//               >
//                 <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//                   {f.icon}
//                 </div>

//                 <h4 className="font-bold text-lg text-slate-900 mb-2">
//                   {f.title}
//                 </h4>
//                 <p className="text-slate-500 text-sm leading-relaxed">
//                   {f.desc}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-slate-50 border-t border-slate-200 py-12 text-center">
//         <p className="text-slate-400 text-sm font-medium">
//           © 2026 Zyncly · Powered by HR Intelligence
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default PublicLayout;
