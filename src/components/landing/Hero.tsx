
// const Hero = () => {
//   return (
//     <section
//       id="home"
//       className="relative h-screen flex items-center justify-center text-white text-center"
//       style={{
//         backgroundImage: "url('/images/bike.jpeg')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>

//       {/* Content */}
//       <div className="relative z-10 max-w-3xl px-6 flex flex-col items-center">
//         <h1 className="text-4xl md:text-6xl font-extrabold mb-4 md:mb-6 animate-fadeInDown">
//           Ride Beyond Limits
//         </h1>

//         <p className="text-lg md:text-2xl text-gray-200 mb-6 animate-fadeInUp">
//           Authorized Dealer – <span className="text-orange-500">KTM</span> | <span className="text-orange-500">Bajaj</span> | <span className="text-orange-500">Chetak</span>
//         </p>

//         {/* Call to Action Buttons */}
//         <div className="flex flex-col md:flex-row gap-4 mb-6">
//           <a
//             href="#bikes"
//             className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition duration-300"
//           >
//             View Bikes
//           </a>
//           <a
//             href="#test-ride"
//             className="px-6 py-3 bg-transparent border border-indigo-500 hover:bg-indigo-500 hover:text-white rounded-lg font-semibold transition duration-300"
//           >
//             Book a Test Ride
//           </a>
//         </div>

//         {/* Opening Hours Badge */}
//         <div className="bg-black/50 rounded-full px-4 py-2 text-sm md:text-base text-gray-200 font-medium">
//           Open Daily: <span className="text-indigo-400">9:00 AM – 10:00 PM</span>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;
const Hero = () => {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center text-white text-center"
      style={{
        backgroundImage: "url('/images/bike.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-6 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 md:mb-6 animate-fadeInDown">
          Ride Beyond Limits
        </h1>

        <p className="text-lg md:text-2xl text-gray-200 mb-6 animate-fadeInUp">
          Authorized Dealer – <span className="text-orange-500">KTM</span> | <span className="text-orange-500">Bajaj</span> | <span className="text-orange-500">Chetak</span>
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <a
            href="#bikes"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition duration-300"
          >
            View Bikes
          </a>

          {/* Instagram Button */}
          <a
            href="https://www.instagram.com/omadvance.automobile/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 hover:scale-105 transform transition duration-300 rounded-lg font-semibold flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm8.25 2a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5zm-4.25 1a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/>
            </svg>
            Follow Us
          </a>
        </div>

        {/* Opening Hours Badge */}
        <div className="bg-black/50 rounded-full px-4 py-2 text-sm md:text-base text-gray-200 font-medium">
          Open Daily: <span className="text-indigo-400">9:00 AM – 10:00 PM</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
