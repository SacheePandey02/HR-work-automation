
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { MapPin, Briefcase, CalendarDays, ChevronDown, ChevronUp } from "lucide-react";

// interface Job {
//   _id: string;
//   title: string;
//   location: string;
//   type: string;
//   description: string;
//   closingDate: string;
// }

// const PublicJobs = () => {
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [expanded, setExpanded] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await fetch(
//           "/.netlify/functions/get-active-jobs"
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch jobs");
//         }

//         const data = await response.json();
//         setJobs(data);
//       } catch (error) {
//         console.error("Error fetching jobs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   const formatDate = (date: string) =>
//     new Date(date).toLocaleDateString("en-IN");

//   const formatDescription = (text: string) => {
//     return text.split("\n").map((line, index) => (
//       <p key={index} className="mb-2">
//         {line}
//       </p>
//     ));
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-400">
//         Loading open positions...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-6">
//       <div className="max-w-5xl mx-auto">

//         <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-16">
//           Open Positions
//         </h1>

//         {jobs.length === 0 ? (
//           <p className="text-center text-gray-500">
//             No active jobs available right now.
//           </p>
//         ) : (
//           <div className="space-y-10">
//             {jobs.map((job) => {
//               const isExpanded = expanded === job._id;
//               const shortText =
//                 job.description.length > 250
//                   ? job.description.slice(0, 250) + "..."
//                   : job.description;

//               return (
//                 <motion.div
//                   key={job._id}
//                   layout
//                   className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all border border-gray-100 p-8"
//                 >
//                   {/* Title */}
//                   <h2 className="text-2xl font-bold text-gray-900 mb-4">
//                     {job.title}
//                   </h2>

//                   {/* Meta Info */}
//                   <div className="flex flex-wrap gap-6 text-sm font-medium mb-6">

//                     <span className="flex items-center gap-2 text-gray-600">
//                       <MapPin size={16} />
//                       {job.location}
//                     </span>

//                     <span className="flex items-center gap-2 text-gray-600">
//                       <Briefcase size={16} />
//                       {job.type || "Full Time"}
//                     </span>

//                     <span className="flex items-center gap-2 text-red-500">
//                       <CalendarDays size={16} />
//                       Apply Before: {formatDate(job.closingDate)}
//                     </span>

//                   </div>

//                   {/* Description Section */}
//                   <div className="text-gray-700 leading-relaxed text-[15px]">
//                     <AnimatePresence mode="wait">
//                       <motion.div
//                         key={isExpanded ? "expanded" : "collapsed"}
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         {isExpanded
//                           ? formatDescription(job.description)
//                           : formatDescription(shortText)}
//                       </motion.div>
//                     </AnimatePresence>
//                   </div>

//                   {/* Toggle Button */}
//                   {job.description.length > 250 && (
//                     <button
//                       onClick={() =>
//                         setExpanded(isExpanded ? null : job._id)
//                       }
//                       className="mt-4 flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition"
//                     >
//                       {isExpanded ? "Show Less" : "Read More"}
//                       {isExpanded ? (
//                         <ChevronUp size={18} />
//                       ) : (
//                         <ChevronDown size={18} />
//                       )}
//                     </button>
//                   )}

//                   {/* Apply Button */}
//                   <div className="mt-8">
//                     <button
//                       onClick={() => navigate(`/apply/${job._id}`)}
//                       className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-md"
//                     >
//                       Apply Now
//                     </button>
//                   </div>

//                 </motion.div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PublicJobs;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Briefcase, CalendarDays, ChevronDown, ChevronUp } from "lucide-react";

interface Job {
  _id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  closingDate: string;
}

const PublicJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/.netlify/functions/get-active-jobs");
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN");

  const formatDescription = (text: string) =>
    text.split("\n").map((line, index) => (
      <p key={index} className="mb-2">
        {line}
      </p>
    ));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-400">
        Loading open positions...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-16">
          Open Positions
        </h1>

        {jobs.length === 0 ? (
          <p className="text-center text-gray-500">
            No active jobs available right now.
          </p>
        ) : (
          <div className="space-y-10">
            {jobs.map((job) => {
              const isExpanded = expanded === job._id;
              const shortText =
                job.description.length > 200
                  ? job.description.slice(0, 200) + "..."
                  : job.description;

              return (
                <motion.div
                  key={job._id}
                  layout
                  className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all border border-gray-100 p-8"
                >
                  {/* Job Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {job.title}
                  </h2>

                  {/* Job Meta */}
                  <div className="flex flex-wrap gap-6 text-sm font-medium mb-6 text-gray-600">
                    <span className="flex items-center gap-2">
                      <MapPin size={16} />
                      <strong>Location:</strong> {job.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <Briefcase size={16} />
                      <strong>Type:</strong> {job.type || "Full Time"}
                    </span>
                    <span className="flex items-center gap-2 text-red-500">
                      <CalendarDays size={16} />
                      <strong>Apply Before:</strong> {formatDate(job.closingDate)}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="text-gray-700 leading-relaxed text-[15px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isExpanded ? "expanded" : "collapsed"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {isExpanded
                          ? formatDescription(job.description)
                          : formatDescription(shortText)}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Toggle Button */}
                  {job.description.length > 200 && (
                    <button
                      onClick={() =>
                        setExpanded(isExpanded ? null : job._id)
                      }
                      className="mt-3 flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition"
                    >
                      {isExpanded ? "Show Less" : "Read More"}
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  )}

                  {/* Apply Button */}
                  <div className="mt-8">
                    <button
                      onClick={() => navigate(`/apply/${job._id}`)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-md"
                    >
                      Apply Now
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicJobs;
