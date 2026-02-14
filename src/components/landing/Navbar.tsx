import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
        <h1 className="text-2xl font-bold tracking-wide">
          OM Advance
        </h1>

        <div className="flex gap-8 text-sm font-medium items-center">

          {/* Landing Scroll Links */}
          <a href="#home" className="hover:text-indigo-300 transition">
            Home
          </a>

          <a href="#services" className="hover:text-indigo-300 transition">
            Services
          </a>

          <a href="#location" className="hover:text-indigo-300 transition">
            Location
          </a>

          <a href="#contact" className="hover:text-indigo-300 transition">
            Contact
          </a>

          {/* Career Page Route */}
          <Link
            to="/careers"
            className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Careers
          </Link>

        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
