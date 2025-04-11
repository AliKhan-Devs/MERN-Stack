import React from 'react';
import { Link } from 'react-router-dom';
import { CloudLightning, BookOpen, Lock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              Your Notes, <span className="text-indigo-600">Everywhere</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              CloudNotes helps you capture your ideas and access them from any device. Simple, secure, and always in sync.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="btn-primary text-lg px-8 py-3">
                  Get Started
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="bg-gray-300 text-lg px-8 py-3 rounded-md">
                  Login
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CloudNotes?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform is designed to make note-taking simple, secure, and accessible.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -10 }}
          >
            <div className="bg-indigo-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <CloudLightning size={24} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cloud Sync</h3>
            <p className="text-gray-600">
              Your notes are automatically synced across all your devices, so you can access them anywhere, anytime.
            </p>
          </motion.div>
          
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -10 }}
          >
            <div className="bg-indigo-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Lock size={24} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Storage</h3>
            <p className="text-gray-600">
              Your data is encrypted and securely stored. Only you can access your notes with your account credentials.
            </p>
          </motion.div>
          
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -10 }}
          >
            <div className="bg-indigo-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Zap size={24} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Create, edit, and organize your notes with a beautiful and responsive interface that works at the speed of thought.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          className="bg-indigo-600 rounded-2xl p-8 md:p-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
            Join thousands of users who trust CloudNotes for their note-taking needs.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/register" className="inline-block bg-white text-indigo-600 font-medium px-8 py-3 rounded-md hover:bg-gray-100 transition-colors duration-200">
              Create Your Free Account
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;