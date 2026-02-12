import { Link } from "react-router-dom";

const JobsList = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Open Positions
      </h1>

      {["Sales Executive", "HR Intern"].map((job, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded shadow mb-4"
        >
          <h2 className="font-semibold">{job}</h2>
          <Link
            to={`/apply/${i}`}
            className="text-blue-600 text-sm"
          >
            Apply Now
          </Link>
        </div>
      ))}
    </div>
  );
};

export default JobsList;
