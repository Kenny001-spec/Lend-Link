import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Hexagon } from 'lucide-react';

const LandingHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-orange-500/10">
      <nav className="container mx-auto px-4 h-20">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-blue-300 p-2 rounded-lg"
            >
              <Hexagon className="h-6 w-6 text-black" />
            </motion.div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-300">
              LENDLINK
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/docs" className="text-gray-300 hover:text-blue-200 transition-colors">
              Docs
            </Link>
            <Link to="/how-it-works" className="text-gray-300 hover:text-blue-200 transition-colors">
              How It Works
            </Link>
            <Link
              to="/app"
              className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-blue-300 px-8 text-sm font-medium text-black transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-400"
            >
              Open dApp
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default LandingHeader;

