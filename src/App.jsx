import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<div className="p-10 text-center"><h1 className="text-2xl font-bold text-primary-600">Login Page</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
        <Route path="/register" element={<div className="p-10 text-center"><h1 className="text-2xl font-bold text-primary-600">Register Page</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
