import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import PublicLayout from "../components/layout/PublicLayout";
import ProtectedRoute from "./ProtectedRoute";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import CandidateLogin from "../pages/auth/CandidateAuth";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import CreateJob from "../pages/admin/CreateJob";
import Jobs from "../pages/admin/Jobs";
import Candidates from "../pages/admin/Candidates";
// import Templates from "../pages/admin/Templates";
import Settings from "../pages/admin/Settings";
import Screening from "../pages/admin/Screening";

// Public/Candidate Pages
import JobsList from "../pages/public/JobsList";
import ApplyJob from "../pages/public/ApplyJob";
import TestPortal from "../pages/public/TestPortal";
import Success from "../pages/public/Success";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES (No Login Needed) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<JobsList />} />
      </Route>
      
      {/* 2. CANDIDATE FLOW (Publicly accessible but managed by candidate_token) */}
      <Route path="/apply/:id" element={<ApplyJob />} />
      <Route path="/test/:id" element={<TestPortal />} />
      <Route path="/success" element={<Success />} />
      <Route path="/candidate/login" element={<CandidateLogin />} />

      {/* 3. HR AUTHENTICATION */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 4. PROTECTED ADMIN DASHBOARD (HR Only) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/create-job" element={<CreateJob />} />
          <Route path="/admin/jobs" element={<Jobs />} />
          <Route path="/admin/candidates" element={<Candidates />} />
          <Route path="/admin/screening" element={<Screening />} />
          {/* <Route path="/admin/templates" element={<Templates />} /> */}
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;