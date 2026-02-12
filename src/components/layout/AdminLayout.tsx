import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Users,
  SearchCode,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/admin/create-job", label: "Create Job", icon: <PlusCircle size={20} /> },
    { to: "/admin/jobs", label: "All Jobs", icon: <Briefcase size={20} /> },
    { to: "/admin/candidates", label: "Screening", icon: <Users size={20} /> },
    { to: "/admin/screening", label: "Generate Offers", icon: <SearchCode size={20} /> },
    { to: "/admin/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const NavItem = ({ item, mobile = false }: { item: any; mobile?: boolean }) => (
    <Link
      to={item.to}
      onClick={() => mobile && setIsMobileMenuOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
        pathname === item.to
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {item.icon}
      {item.label}
    </Link>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* 🖥️ Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
            ♋️
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-800">
            Zyncly<span className="text-indigo-600">Admin</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* 📱 Modern Floating Mobile Header (Removed the black line) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 p-4">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-lg border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] px-6 py-3 flex justify-between items-center"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs">
              ♋️
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-800">Zyncly</span>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 bg-slate-50 text-slate-600 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.div>
      </div>

      {/* 📱 Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] lg:hidden"
            />
            
            {/* Sliding Sidebar Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-[300px] bg-white z-[60] shadow-2xl p-8 flex flex-col lg:hidden"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-2xl font-black text-indigo-600">
                  Zyncly
                </span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <nav className="space-y-2 flex-1">
                {menuItems.map((item) => (
                  <NavItem key={item.to} item={item} mobile />
                ))}
              </nav>

              <button
                onClick={handleLogout}
                className="mt-8 flex items-center gap-3 px-4 py-4 text-red-500 font-bold bg-red-50 rounded-2xl transition"
              >
                <LogOut size={20} /> Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 🏠 Main Content */}
      <main className="flex-1 overflow-y-auto pt-24 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;