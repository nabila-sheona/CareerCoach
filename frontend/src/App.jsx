import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth'; 
import { ToastContainer } from 'react-toastify'; // Import ToastContainer

// Import shared components and pages
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer'; 
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import FeaturesPage from './components/pages/FeaturesPage';
import SuccessStoriesPage from './components/pages/SuccessStoriesPage';
import DashboardPage from './components/pages/DashboardPage';
import RegisterPage from './components/pages/RegisterPage';

const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/success-stories" element={<SuccessStoriesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
        <Footer />
        {/* Add ToastContainer here */}
        <ToastContainer />
      </div>
    </AuthProvider>
  );
};

export default App;
