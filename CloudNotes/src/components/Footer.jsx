import React from 'react';
import { CloudLightning, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <CloudLightning size={24} className="text-indigo-600" />
            <span className="ml-2 text-lg font-bold text-gray-800">CloudNotes</span>
          </div>
          
          <div className="flex space-x-6">
            <a href="https://github.com/alikhan-devs" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">
              <Github size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">
              <Twitter size={20} />
            </a>
            <a href="https://linkedin.com/in/alikhan-devs" className="text-gray-500 hover:text-indigo-600 transition-colors duration-200">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CloudNotes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;