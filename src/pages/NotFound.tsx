const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-100">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl text-slate-700 mb-6">
        Page Not Found
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Go to Home
      </a>
    </div>
  );
};

export default NotFound;

