import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Admin/Dashboard";
import InstitutesList from "./components/Admin/InstitutesList";
import InstituteDashboard from "./components/Admin/InstituteDashboard";
import EditInstitute from "./components/Admin/EditInstitute";
import StudentsList from "./components/Admin/StudentsList";
import StudentDashboard from "./components/Admin/StudentDashboard";
import EditStudent from "./components/Admin/EditStudent";
import ReviewsList from "./components/Admin/ReviewsList";
import EditReview from "./components/Admin/EditReview";
import JobsList from "./components/Admin/JobsList";
import JobDetails from "./components/Admin/JobDetails";
import EditJob from "./components/Admin/EditJob";
import TeamList from "./components/Admin/TeamList";
import TeamMemberDetails from "./components/Admin/TeamMemberDetails";
import EditTeamMember from "./components/Admin/EditTeamMember";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import AllAdmins from "./components/Admin/AllAdmins";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/admin/login" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/institutes" element={<ProtectedRoute><InstitutesList /></ProtectedRoute>} />
      <Route path="/admin/institutes/dashboard/:id" element={<ProtectedRoute><InstituteDashboard /></ProtectedRoute>} />
      <Route path="/admin/institutes/edit/:id" element={<ProtectedRoute><EditInstitute /></ProtectedRoute>} />
      <Route path="/admin/institutes/add" element={<ProtectedRoute><EditInstitute /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute><StudentsList /></ProtectedRoute>} />
      <Route path="/admin/students/:id" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
      <Route path="/admin/students/edit/:id" element={<ProtectedRoute><EditStudent /></ProtectedRoute>} />
      <Route path="/admin/students/add" element={<ProtectedRoute><EditStudent /></ProtectedRoute>} />
      <Route path="/admin/reviews" element={<ProtectedRoute><ReviewsList /></ProtectedRoute>} />
      <Route path="/admin/reviews/edit/:id" element={<ProtectedRoute><EditReview /></ProtectedRoute>} />
      <Route path="/admin/reviews/add" element={<ProtectedRoute><EditReview /></ProtectedRoute>} />
      <Route path="/admin/jobs" element={<ProtectedRoute><JobsList /></ProtectedRoute>} />
      <Route path="/admin/jobs/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
      <Route path="/admin/jobs/edit/:id" element={<ProtectedRoute><EditJob /></ProtectedRoute>} />
      <Route path="/admin/jobs/add" element={<ProtectedRoute><EditJob /></ProtectedRoute>} />
      <Route path="/admin/team" element={<ProtectedRoute><TeamList /></ProtectedRoute>} />
      <Route path="/admin/team/:certificateNo" element={<ProtectedRoute><TeamMemberDetails /></ProtectedRoute>} />
      <Route path="/admin/team/edit/:certificateNo" element={<ProtectedRoute><EditTeamMember /></ProtectedRoute>} />
      <Route path="/admin/team/add" element={<ProtectedRoute><EditTeamMember /></ProtectedRoute>} />
      <Route path="/admin/all-admins" element={<ProtectedRoute><AllAdmins /></ProtectedRoute>} />
    </Routes>
  );
};

export default App;
