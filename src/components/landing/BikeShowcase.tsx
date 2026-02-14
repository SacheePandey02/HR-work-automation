import { useState, useEffect } from "react";

const bikes = [
  { name: "KTM Duke", image: "/images/bike.jpeg" },
  { name: "Bajaj Pulsar", image: "/images/bike2.jpeg" },
  { name: "Chetak Electric", image: "/images/bike3.jpeg" },
  { name: "Apache RTR", image: "/images/bike4.jpeg" }
];

const BikeShowcase = () => {
  const [current, setCurrent] = useState(0);

  // ✅ Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bikes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const next = () => {
    setCurrent((prev) => (prev + 1) % bikes.length);
  };

  const prev = () => {
    setCurrent((prev) =>
      prev === 0 ? bikes.length - 1 : prev - 1
    );
  };

  return (
    <section id="bikes" className="py-24 bg-slate-900 text-white px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">
          Our Currently Available Bikes
        </h2>
      </div>

      <div className="relative max-w-4xl mx-auto">

        {/* Fade Effect */}
        <div className="relative h-[450px] overflow-hidden rounded-3xl shadow-2xl">
          {bikes.map((bike, index) => (
            <img
              key={index}
              src={bike.image}
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        <h3 className="text-center mt-6 text-2xl font-bold text-indigo-400">
          {bikes[current].name}
        </h3>

        {/* Navigation Buttons */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/40 transition"
        >
          ◀
        </button>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/40 transition"
        >
          ▶
        </button>
      </div>
    </section>
  );
};

export default BikeShowcase;
