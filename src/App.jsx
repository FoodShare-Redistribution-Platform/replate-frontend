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
import Impact from './pages/Impact';
import TrackingMap from "./pages/TrackingMap";
import AdminFleetMap from "./pages/admin/AdminFleetMap";
import DonorLiveMap from "./pages/DonorLiveMap";
import NgoLiveMap from "./pages/NgoLiveMap";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Persistent Layout Wrapper */}
        <Route element={<DashboardLayoutProvider />}>
          {/* Main Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/impact" element={<Impact />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/food" element={<FoodManagement />} />
          <Route path="/admin/assignments" element={<AdminAssignments />} />
          <Route path="/admin/analytics" element={<Analytics />} />

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
        </Route>

        {/* 🔴 LIVE MAP ROUTE (No Sidebar Layout) */}
        <Route
          path="/live-map/:assignmentId"
          element={<VolunteerMap />}
        />
        <Route path="/tracking/:assignmentId" element={<TrackingMap />} />
        <Route path="/admin/live-map" element={<AdminFleetMap />} />
         <Route path="/donor/live-map" element={<DonorLiveMap />} />
        <Route path="/ngo/live-map" element={<NgoLiveMap />} />





      </Routes>
    </BrowserRouter>
  );
}

export default App;
