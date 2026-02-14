// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Briefcase, Users, CheckCircle, Clock, ChevronRight, BarChart3 } from "lucide-react";
// import { Link } from "react-router-dom";

// const Dashboard = () => {
//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         const res = await fetch("/.netlify/functions/dashboard-stats", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const json = await res.json();
//         setData(json);
//       } catch (err: any) {
//         console.error("Dashboard fetch error:", err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboard();
//   }, [token]);

//   if (loading) return <div className="p-10 animate-pulse font-black text-slate-400 uppercase tracking-widest">Loading Analytics...</div>;
//   if (!data) return <p>Failed to load dashboard</p>;

//   // Helper to extract count from aggregation stages
//   const getStageCount = (stages: any[], status: string) => {
//     return stages.find((s) => s.status === status)?.count || 0;
//   };

//   const stats = [
//     { label: "Active Roles", val: data.totalJobs, color: "bg-indigo-600", icon: <Briefcase size={20}/> },
//     { label: "Applicants", val: data.totalCandidates, color: "bg-blue-600", icon: <Users size={20}/> },
//     { label: "Interviews", val: "12", color: "bg-emerald-600", icon: <CheckCircle size={20}/> },
//     { label: "Pending", val: "4", color: "bg-amber-500", icon: <Clock size={20}/> },
//   ];

//   return (
//     <div className="space-y-10 pb-20">
//       <header>
//         <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard ✨</h1>
//         <p className="text-slate-500 font-medium">Welcome back, {data.hr.name}. Here is your hiring overview.</p>
//       </header>

//       {/* 📊 High-Level Metrics */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((s, i) => (
//           <motion.div 
//             key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
//             className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all"
//           >
//             <div>
//               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
//               <h3 className="text-3xl font-black text-slate-900 mt-1">{s.val}</h3>
//             </div>
//             <div className={`w-12 h-12 rounded-2xl ${s.color} text-white flex items-center justify-center shadow-lg`}>
//               {s.icon}
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {/* 🚀 NEW: THE HIRING PIPELINE MASTER VIEW */}
//       <section className="space-y-6">
//         <div className="flex items-center justify-between px-2">
//           <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
//             <BarChart3 className="text-indigo-600" size={24} /> Hiring Pipeline
//           </h2>
//           <Link to="/admin/screening" className="text-xs font-bold text-indigo-600 hover:underline">View Detailed Pipeline →</Link>
//         </div>

//         <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-slate-50/50 border-b">
//                 <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
//                   <th className="p-8">Posting Title / Domain</th>
//                   <th className="p-8 text-center">Applied</th>
//                   <th className="p-8 text-center">Shortlisted</th>
//                   <th className="p-8 text-center">Interviewing</th>
//                   <th className="p-8 text-center">Hired</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {data.pipeline?.map((job: any) => (
//                   <tr key={job._id?._id} className="hover:bg-slate-50/50 transition-colors">
//                     <td className="p-8">
//                       <p className="font-black text-slate-800 text-lg tracking-tight">{job._id?.title || "Unknown Job"}</p>
//                       <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">{job._id?.domain}</p>
//                     </td>
                    
//                     {/* Status Cells with Visual Flow */}
//                     <PipelineCell count={getStageCount(job.stages, "Applied")} color="bg-slate-100 text-slate-500" />
//                     <PipelineCell count={getStageCount(job.stages, "Shortlisted")} color="bg-blue-50 text-blue-600" isChevron />
//                     <PipelineCell count={getStageCount(job.stages, "Interviewing")} color="bg-indigo-50 text-indigo-600" isChevron />
//                     <PipelineCell count={getStageCount(job.stages, "Hired")} color="bg-emerald-50 text-emerald-600" isEnd />
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {(!data.pipeline || data.pipeline.length === 0) && (
//                 <div className="p-20 text-center text-slate-400 font-bold italic uppercase tracking-widest">No active candidate data</div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* 📋 Recent Jobs List */}
//       <section className="space-y-6">
//         <h2 className="text-xl font-black text-slate-800 px-2">Active Postings</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {data.jobs.map((job: any) => (
//             <div key={job._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all">
//               <div>
//                 <div className="flex justify-between items-start mb-4">
//                   <h3 className="text-xl font-bold text-slate-800 tracking-tight">{job.title}</h3>
//                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-full tracking-widest">{job.jobStatus}</span>
//                 </div>
//                 <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                   <span>📍 {job.location}</span>
//                   <span>💼 {job.department}</span>
//                 </div>
//               </div>
//               <Link to={`/admin/create-job?edit=${job._id}`} className="mt-8 text-sm font-bold text-indigo-600 flex items-center gap-1 hover:underline">
//                 Edit Posting <ChevronRight size={14}/>
//               </Link>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// // 🏛️ Internal Pipeline Cell Component with Chevron Logic
// const PipelineCell = ({ count, color, isChevron, isEnd }: any) => (
//   <td className="p-4 text-center">
//     <div className={`
//       relative inline-flex items-center justify-center min-w-[100px] py-2.5 rounded-xl font-black text-sm 
//       ${color} ${isEnd ? 'border-2 border-emerald-200' : ''}
//     `}>
//       {count}
//       {isChevron && count > 0 && (
//         <div 
//           className="absolute -right-2 w-4 h-4 rotate-45 border-t-4 border-r-4 border-white z-10"
//           style={{ backgroundColor: 'inherit' }}
//         />
//       )}
//     </div>
//   </td>
// );

// export default Dashboard;
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, CheckCircle, Clock, ChevronRight, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/.netlify/functions/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading)
    return (
      <div className="p-10 animate-pulse font-black text-slate-400 uppercase tracking-widest">
        Loading Analytics...
      </div>
    );

  if (!data) return <p>Failed to load dashboard</p>;

  // ✅ Safe helper
  const getStageCount = (stages: any[] = [], status: string) => {
    return stages?.find((s) => s.status === status)?.count || 0;
  };

  const stats = [
    { label: "Active Roles", val: data?.totalJobs ?? 0, color: "bg-indigo-600", icon: <Briefcase size={20}/> },
    { label: "Applicants", val: data?.totalCandidates ?? 0, color: "bg-blue-600", icon: <Users size={20}/> },
    { label: "Interviews", val: "12", color: "bg-emerald-600", icon: <CheckCircle size={20}/> },
    { label: "Pending", val: "4", color: "bg-amber-500", icon: <Clock size={20}/> },
  ];

  return (
    <div className="space-y-10 pb-20">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Dashboard ✨
        </h1>

        {/* ✅ FIXED CRASH LINE */}
        <p className="text-slate-500 font-medium">
          Welcome back, {data?.hr?.name || "User"}. Here is your hiring overview.
        </p>
      </header>

      {/* 📊 High-Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all"
          >
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {s.label}
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {s.val}
              </h3>
            </div>
            <div
              className={`w-12 h-12 rounded-2xl ${s.color} text-white flex items-center justify-center shadow-lg`}
            >
              {s.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🚀 Hiring Pipeline */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <BarChart3 className="text-indigo-600" size={24} /> Hiring Pipeline
          </h2>
          <Link
            to="/admin/screening"
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            View Detailed Pipeline →
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="p-8">Posting Title / Domain</th>
                  <th className="p-8 text-center">Applied</th>
                  <th className="p-8 text-center">Shortlisted</th>
                  <th className="p-8 text-center">Interviewing</th>
                  <th className="p-8 text-center">Hired</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {data?.pipeline?.map((job: any) => (
                  <tr key={job?._id?._id || Math.random()} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-8">
                      <p className="font-black text-slate-800 text-lg tracking-tight">
                        {job?._id?.title || "Unknown Job"}
                      </p>
                      <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">
                        {job?._id?.domain || ""}
                      </p>
                    </td>

                    <PipelineCell
                      count={getStageCount(job?.stages, "Applied")}
                      color="bg-slate-100 text-slate-500"
                    />
                    <PipelineCell
                      count={getStageCount(job?.stages, "Shortlisted")}
                      color="bg-blue-50 text-blue-600"
                      isChevron
                    />
                    <PipelineCell
                      count={getStageCount(job?.stages, "Interviewing")}
                      color="bg-indigo-50 text-indigo-600"
                      isChevron
                    />
                    <PipelineCell
                      count={getStageCount(job?.stages, "Hired")}
                      color="bg-emerald-50 text-emerald-600"
                      isEnd
                    />
                  </tr>
                ))}
              </tbody>
            </table>

            {(!data?.pipeline || data.pipeline.length === 0) && (
              <div className="p-20 text-center text-slate-400 font-bold italic uppercase tracking-widest">
                No active candidate data
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 📋 Recent Jobs */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-slate-800 px-2">
          Active Postings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.jobs?.map((job: any) => (
            <div
              key={job?._id}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                    {job?.title}
                  </h3>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-full tracking-widest">
                    {job?.jobStatus}
                  </span>
                </div>
                <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>📍 {job?.location}</span>
                  <span>💼 {job?.department}</span>
                </div>
              </div>

              <Link
                to={`/admin/create-job?edit=${job?._id}`}
                className="mt-8 text-sm font-bold text-indigo-600 flex items-center gap-1 hover:underline"
              >
                Edit Posting <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const PipelineCell = ({ count, color, isChevron, isEnd }: any) => (
  <td className="p-4 text-center">
    <div
      className={`relative inline-flex items-center justify-center min-w-[100px] py-2.5 rounded-xl font-black text-sm 
      ${color} ${isEnd ? "border-2 border-emerald-200" : ""}`}
    >
      {count}
      {isChevron && count > 0 && (
        <div
          className="absolute -right-2 w-4 h-4 rotate-45 border-t-4 border-r-4 border-white z-10"
          style={{ backgroundColor: "inherit" }}
        />
      )}
    </div>
  </td>
);

export default Dashboard;
