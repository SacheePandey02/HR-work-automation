const Location = () => {
  return (
    <section id="location" className="py-24 bg-gray-100 px-6">
      <div className="max-w-5xl mx-auto text-center">

        <h2 className="text-4xl font-bold mb-8">
          Our Location
        </h2>

        <iframe
          src="https://www.google.com/maps?q=Gwalior&output=embed"
          className="w-full h-[400px] rounded-3xl shadow-xl"
          loading="lazy"
        ></iframe>

      </div>
    </section>
  );
};

export default Location;
