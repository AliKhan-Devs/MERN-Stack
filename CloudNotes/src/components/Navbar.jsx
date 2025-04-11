import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, CloudLightning, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-indigo-600"
              >
                <CloudLightning size={28} />
              </motion.div>
              <span className="ml-2 text-xl font-bold text-gray-800">CloudNotes</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-all duration-200">
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-all duration-200">
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 transition-all duration-200"
                  >
                    <LogOut size={16} className="mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-all duration-200">
                    Login
                  </Link>
                  <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          className="sm:hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50"
                >
                  <LogOut size={16} className="mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;