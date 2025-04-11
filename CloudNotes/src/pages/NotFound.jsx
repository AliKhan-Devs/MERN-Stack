import React from 'react';
import { Link } from 'react-router-dom';
import { CloudOff } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CloudOff size={80} className="mx-auto text-indigo-600" />
        <h1 className="mt-6 text-4xl font-extrabold text-gray-900">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mt-2">Page Not Found</h2>
        <p className="mt-4 text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="btn-primary inline-block">
              Go back home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;