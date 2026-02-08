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
import AdminUserTable from './components/AdminUserTable';
import VerificationRequests from './components/VerificationRequests';
import FoodManagement from './components/FoodManagement';
import VolunteerManagement from './components/VolunteerManagement';
import NGOManagement from './components/NGOManagement';

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

        {/* Admin User Table */}
        <Route path="/admin-users" element={<AdminUserTable />} />

        {/* Verification Requests */}
        <Route path="/verification-requests" element={<VerificationRequests />} />

        {/* Food Management */}
        <Route path="/food-management" element={<FoodManagement />} />

        {/* Volunteer Management */}
        <Route path="/volunteer-management" element={<VolunteerManagement />} />

        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
