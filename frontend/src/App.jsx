import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Shared Components
import Navbar from './components/shared/Navbar.jsx';
import Footer from './components/shared/Footer.jsx';  // Import Footer

// Pages
import HomePage from './components/pages/HomePage.jsx';
import LoginPage from './components/pages/LoginPage.jsx';
import FeaturesPage from './components/pages/FeaturesPage.jsx';
import SuccessStoriesPage from './components/pages/SuccessStoriesPage.jsx';
import DashboardPage from './components/pages/DashboardPage.jsx';
import RegisterPage from './components/pages/RegisterPage.jsx'; 

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/success-stories" element={<SuccessStoriesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>

      <Footer /> {/* Add Footer here */}
    </>
  );
};

export default App;
