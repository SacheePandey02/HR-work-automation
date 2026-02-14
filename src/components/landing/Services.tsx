import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Services = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const services = [
    {
      title: "Vehicle Repair",
      image: "/images/service1.jpeg",
      short: "Complete repair solutions for all major brands.",
      full: "We provide complete repair solutions including suspension, brake systems, clutch repairs, electrical faults, and accident restoration. Our certified technicians ensure quality workmanship using genuine parts."
    },
    {
      title: "Engine Diagnostics",
      image: "/images/service2.jpeg",
      short: "Advanced diagnostic tools & fault detection.",
      full: "Using computerized diagnostic systems, we accurately detect ECU errors, sensor failures, fuel injection problems, and performance issues to restore optimal engine efficiency."
    },
    {
      title: "Regular Maintenance",
      image: "/images/service3.jpeg",
      short: "Oil change, brake service & periodic servicing.",
      full: "Routine maintenance includes oil replacement, filter change, brake adjustments, chain lubrication, tire inspection, and complete safety checks for long-lasting performance."
    }
  ];

  return (
    <section id="services" className="py-28 bg-gradient-to-b from-slate-50 via-indigo-50 to-white px-6">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
          Our Premium Services
        </h2>
        <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
          Professional expertise, modern tools, and trusted service quality.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {services.map((service, index) => {
          const isOpen = expanded === index;

          return (
            <div
              key={index}
              className="group bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-indigo-100 overflow-hidden"
            >
              {/* Image with Zoom */}
              <div className="overflow-hidden">
                <img
                  src={service.image}
                  className="h-56 w-full object-cover group-hover:scale-110 transition duration-700"
                />
              </div>

              <div className="p-8">
                <h3 className="text-xl font-bold mb-3 text-indigo-700">
                  {service.title}
                </h3>

                <div
                  className={`text-slate-600 text-sm leading-relaxed transition-all duration-500 ${
                    isOpen ? "max-h-96" : "max-h-16 overflow-hidden"
                  }`}
                >
                  {isOpen ? service.full : service.short}
                </div>

                <button
                  onClick={() =>
                    setExpanded(isOpen ? null : index)
                  }
                  className="mt-4 flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-800 transition"
                >
                  {isOpen ? "Show Less" : "Read More"}
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Services;
