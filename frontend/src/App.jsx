import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CompleteProfile from "./pages/auth/CompleteProfile";

import DonorDashboard from "./pages/donor/DonorDashboard";
import CreateDonation from "./pages/donor/CreateDonation";
import MyDonations from "./pages/donor/MyDonations";

import NGODashboard from "./pages/ngo/NGODashboard";
import AvailableDonations from "./pages/ngo/AvailableDonations";
import ManagePickups from "./pages/ngo/ManagePickups";

import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import VolunteerPickups from "./pages/volunteer/VolunteerPickups";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import NGOApproval from "./pages/admin/NGOApproval";
import VolunteerManagement from "./pages/admin/VolunteerManagement";
import ReportsDashboard from "./pages/reports/ReportsDashboard";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute allowedRoles={["NGO", "VOLUNTEER"]} />}>
            <Route path="/complete-profile" element={<CompleteProfile />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/ngos" element={<NGOApproval />} />
              <Route path="/admin/volunteers" element={<VolunteerManagement />} />
              <Route path="/admin/reports" element={<ReportsDashboard />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["DONOR"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/donor" element={<DonorDashboard />} />
              <Route path="/donor/donations/new" element={<CreateDonation />} />
              <Route path="/donor/donations" element={<MyDonations />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["NGO"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/ngo" element={<NGODashboard />} />
              <Route path="/ngo/donations" element={<AvailableDonations />} />
              <Route path="/ngo/pickups" element={<ManagePickups />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["VOLUNTEER"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/volunteer" element={<VolunteerDashboard />} />
              <Route path="/volunteer/pickups" element={<VolunteerPickups />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
