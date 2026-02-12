import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './Login';
import Register from './Register';
import Profile from './pages/Profile';
import DonateFood from './pages/DonateFood';
import MyDonations from './pages/MyDonations';
import AvailableFood from './pages/AvailableFood';
import MyRequests from './pages/MyRequests';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import MyPickups from './pages/MyPickups';
import Availability from './pages/Availability';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import VolunteerLiveMapPage from "./pages/VolunteerMap";
import VolunteerMap from "./pages/VolunteerMap";







function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />

        {/* Donor Routes */}
        <Route path="/donate-food" element={<DonateFood />} />
        <Route path="/my-donations" element={<MyDonations />} />

        {/* NGO Routes */}
        <Route path="/available-food" element={<AvailableFood />} />
        <Route path="/my-requests" element={<MyRequests />} />

        {/* Volunteer Routes */}
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/my-pickups" element={<MyPickups />} />
        <Route path="/availability" element={<Availability />} />
        {/* 🔴 LIVE MAP ROUTE */}
        <Route
          path="/live-map/:assignmentId"
          element={<VolunteerMap />}
        />





      </Routes>
    </BrowserRouter>
  );
}

export default App;
