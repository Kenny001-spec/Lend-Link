import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bell, Hexagon } from 'lucide-react';

const AppHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-orange-500/10">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-blue-300 p-2 rounded-lg"
            >
              <Hexagon className="h-5 w-5 text-black" />
            </motion.div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-300">
              LENDLINK
            </span>
          </Link>
        </div>

        {/* Centered Navigation Links */}
        <div className="flex items-center justify-center space-x-6">
          <Link to="/app" className="text-gray-300  hover:text-blue-200 transition-colors">
            Dashboard
          </Link>
          <Link to="/app/lend" className="text-gray-300  hover:text-blue-200 transition-colors ">
            Lend
          </Link>
          <Link to="/app/borrow" className="text-gray-300 hover:text-blue-200 transition-colors">
            Borrow
          </Link>
        </div>

        {/* Right-side Actions */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-orange-500/10"
          >
            <Bell className="h-5 w-5 text-gray-400" />
          </motion.button>
            <appkit-button />
         
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
