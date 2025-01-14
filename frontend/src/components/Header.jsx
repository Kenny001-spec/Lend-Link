import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Wallet } from "lucide-react";

const Header = () => {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Features", path: "/features" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "Security", path: "/security" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-blue-950/80 to-blue-950/20 backdrop-blur-md border-b border-white/10">
      <nav className="container mx-auto px-4 h-20">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-violet-500 p-2 rounded-lg"
            >
              <Wallet className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
              LENDLINK
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-blue-100 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <appkit-button />
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-blue-950/95 backdrop-blur-lg border-b border-white/10 md:hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col space-y-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-blue-100 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}

                <appkit-button />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
