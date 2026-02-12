import { motion } from "framer-motion";
import {
  User,
  Briefcase,
  Bell,
  Save,
  MapPin,
  Mail
} from "lucide-react";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Checkbox from "../../components/Checkbox";
import toast from "react-hot-toast";
import { useState } from "react";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    company: "",
    location: "",
  });

  const [preferences, setPreferences] = useState({
    defaultStatus: "active",
    autoShare: true,
    notifyOnApply: true,
  });

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-20"
    >
      {/* Header */}
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Manage your profile and job posting preferences.
        </p>
      </header>

     {/* Manage Profile */}
<section className="bg-white p-10 rounded-[2.75rem] border border-slate-100 shadow-sm">
  <div className="flex items-center justify-between mb-10">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
        <User size={22} />
      </div>
      <div>
        <h2 className="text-2xl font-black text-slate-900">
          Manage Profile
        </h2>
        <p className="text-slate-500 text-sm font-medium">
          Update your personal and company details
        </p>
      </div>
    </div>
  </div>

  {/* Profile Card */}
  <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
    {/* Avatar Section */}
    <div className="flex flex-col items-center text-center gap-4">
      <div className="relative">
        <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 text-4xl font-black">
          HR
        </div>
        <div className="absolute bottom-2 right-2 w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg">
          <User size={16} />
        </div>
      </div>

      <div>
        <p className="font-bold text-slate-800">HR Manager</p>
        <p className="text-xs text-slate-400">Profile picture coming soon</p>
      </div>
    </div>

    {/* Form Fields */}
    <div className="space-y-8">
      {/* Personal Info */}
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            placeholder="HR Manager"
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
          />

          <Input
            label="Email Address"
            placeholder="hr@company.com"
            icon={<Mail size={14} />}
            disabled
          />
        </div>
      </div>

      {/* Company Info */}
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
          Company Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Company Name"
            placeholder="Your Company"
            onChange={(e) =>
              setProfile({ ...profile, company: e.target.value })
            }
          />

          <Input
            label="Location"
            placeholder="Noida, India"
            icon={<MapPin size={14} />}
            onChange={(e) =>
              setProfile({ ...profile, location: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Post Preferences */}
      <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Briefcase size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Post Preferences
          </h2>
        </div>

        <div className="space-y-6">
          <Select
            label="Default Job Status"
            options={["active", "draft", "closed"]}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                defaultStatus: e.target.value,
              })
            }
          />

          <Checkbox
            label="Auto-share job links after publishing"
            checked={preferences.autoShare}
            onChange={() =>
              setPreferences({
                ...preferences,
                autoShare: !preferences.autoShare,
              })
            }
          />

          <Checkbox
            label="Notify me when candidates apply"
            checked={preferences.notifyOnApply}
            onChange={() =>
              setPreferences({
                ...preferences,
                notifyOnApply: !preferences.notifyOnApply,
              })
            }
          />
        </div>
      </section>

      {/* Notifications (Future Ready UI) */}
      <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
            <Bell size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Notifications
          </h2>
        </div>

        <div className="text-slate-400 text-sm font-medium">
          Advanced notification controls will be available soon.
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="group px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </motion.div>
  );
};

export default Settings;