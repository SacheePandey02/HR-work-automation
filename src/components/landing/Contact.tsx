const Contact = () => {
  return (
    <section
      id="contact"
      className="py-24 text-white px-6"
      style={{
        backgroundImage: "url('/images/service1.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="bg-black/75 max-w-4xl mx-auto p-12 rounded-3xl text-center">
        <h2 className="text-4xl font-bold mb-6">Contact Us</h2>

        <p className="mb-4 text-lg">📞 +91 79-47421011</p>
        <p className="mb-4 text-lg">📧 omadvance.social@gmail.com</p>
        <p className="text-gray-300">
          Lashkar, Gwalior, Madhya Pradesh
        </p>
      </div>
    </section>
  );
};

export default Contact;
