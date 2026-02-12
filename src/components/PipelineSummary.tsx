import { useEffect, useState } from "react";

const PipelineSummary = () => {
  const [data, setData] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("/.netlify/functions/get-pipeline-stats", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(setData);
  }, []);

  // Helper to get count for a specific status from the stages array
  const getCount = (stages: any[], status: string) => {
    return stages.find(s => s.status === status)?.count || 0;
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
              <th className="p-6">Job Posting / Domain</th>
              <th className="p-6 text-center">Applied</th>
              <th className="p-6 text-center">Shortlisted</th>
              <th className="p-6 text-center">Interviewing</th>
              <th className="p-6 text-center">Hired</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((item) => (
              <tr key={item._id._id} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-6">
                  <p className="font-black text-slate-800 tracking-tight">{item._id.title}</p>
                  <p className="text-[10px] text-indigo-500 font-bold uppercase">{item._id.domain}</p>
                </td>

                {/* Status Columns with Chevron styling */}
                <StatusCell count={getCount(item.stages, "Applied")} color="bg-slate-100 text-slate-600" />
                <StatusCell count={getCount(item.stages, "Shortlisted")} color="bg-blue-100 text-blue-600" isChevron />
                <StatusCell count={getCount(item.stages, "Interviewing")} color="bg-indigo-100 text-indigo-600" isChevron />
                <StatusCell count={getCount(item.stages, "Hired")} color="bg-emerald-100 text-emerald-600" isEnd />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Internal sub-component for the "Chevron" effect
const StatusCell = ({ count, color, isChevron }: any) => (
  <td className="p-4 text-center">
    <div className={`relative inline-flex items-center justify-center px-6 py-2 rounded-lg font-black text-sm ${color} ${isChevron ? 'clip-chevron' : ''}`}>
      {count}
      {isChevron && <div className="absolute right-[-10px] top-0 bottom-0 w-3 bg-white" style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 50%)' }} />}
    </div>
  </td>
);

export default PipelineSummary;