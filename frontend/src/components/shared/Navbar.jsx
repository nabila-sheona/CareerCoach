import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // ✅ Import your auth hook

const Navbar = () => {
  const { user, isAuthenticated } = useAuth(); // ✅ Destructure authentication state

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold text-blue-600 cursor-pointer">CareerCoach</div>
              <div className="text-sm text-gray-500 ml-2">Empowering Bangladesh's Future</div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-blue-600 font-medium">Home</Link>
            <Link to="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link to="/success-stories" className="text-gray-600 hover:text-gray-900">Success Stories</Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            {isAuthenticated && (
              <Link to="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
            )}
          </nav>

          {/* User Info & Buttons */}
          <div className="flex items-center space-x-4">
            {/* Show buttons based on authentication status */}
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                    Login
                  </button>
                </Link>

                <Link to="/register">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                    Register
                  </button>
                </Link>
              </>
            ) : (
              <>
                {/* Profile Picture Circle */}
                <Link to="/profile" className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                    {user?.profilePicture ? (
                      <img 
                        src={user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:8080${user.profilePicture}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-white font-semibold text-sm">
                        {(user?.name || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </Link>
                
                <button 
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
