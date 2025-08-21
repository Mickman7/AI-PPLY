import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import LandingPage from "../pages/LandingPage";
import AuthPage from "../pages/AuthPage";
import Dashboard from "../pages/Dashboard";
import ResumeUploadPage from "../pages/ResumeUploadPage";
import Resultspage from "../pages/Resultspage";
import SettingsPage from "../pages/SettingsPage";
import ResumeListPage from "../pages/ResumeListPage";

// Layout wrapper that includes Navbar and conditionally includes Sidebar
const Layout = () => {
  const location = useLocation();
  const hideSidebar = ["/login", "/"].includes(location.pathname);

  return (
    <>
      <Navbar />
      <div style={{ display: "flex"}}>
        {!hideSidebar && <Sidebar />}
        <div style={{ flex: 1, padding: "16px"}}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<ResumeUploadPage />} />
          <Route path="/results" element={<Resultspage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/resumes" element={<ResumeListPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;

