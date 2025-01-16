import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Coins, ArrowRight, Users, Zap, Lock, Sparkles } from 'lucide-react';

const Hero = () => {
  const floatingAnimation = {
    y: ['-10%', '10%'],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    },
  };

  const glowAnimation = {
    opacity: [0.4, 1, 0.4],
    scale: [0.98, 1, 0.98],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  return (
    <section className="pt-32 pb-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-950 via-orange-900 to-red-900" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_500px_at_50%_50%,#f97316,transparent)]" />
        <div className="absolute w-full h-full bg-[radial-gradient(circle_400px_at_80%_20%,#ea580c,transparent)]" />
        <div className="absolute w-full h-full bg-[radial-gradient(circle_300px_at_20%_80%,#c2410c,transparent)]" />
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 mb-10 lg:mb-0"
        >
          <div className="relative inline-block mb-6">
            <motion.div
              animate={glowAnimation}
              className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 blur-xl opacity-50"
            />
            <h1 className="relative text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-red-400">
              Decentralized
              <br />
              Micro-Loans
              <motion.span 
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block ml-2"
              >
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </motion.span>
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl mb-8 text-orange-100 leading-relaxed"
          >
            Experience the future of lending on LENDLINK. Secure, transparent, and lightning-fast micro-loans powered by smart contracts.
          </motion.p>

          <Link to="/app">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-lg font-medium overflow-hidden text-black"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 transition-opacity opacity-0 group-hover:opacity-100" />
              <span className="relative flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>
          </Link>

          <motion.div 
            className="mt-12 flex space-x-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { Icon: Lock, text: "Secure", color: "text-green-400" },
              { Icon: Zap, text: "Fast", color: "text-yellow-400" },
              { Icon: Users, text: "P2P", color: "text-orange-400" }
            ].map(({ Icon, text, color }, index) => (
              <motion.div 
                key={text}
                className="flex items-center"
                whileHover={{ scale: 1.1 }}
              >
                <Icon className={`${color} mr-2 filter drop-shadow-lg`} />
                <span className="text-orange-100">{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side with animated elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 relative"
        >
          <div className="relative w-full h-96 bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-2xl backdrop-blur-xl border border-orange-500/10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl"
            />
            
            {/* Floating icons */}
            {[Coins, Users, Lock, Zap].map((Icon, index) => (
              <motion.div
                key={index}
                className="absolute"
                style={{
                  top: `${25 * index}%`,
                  left: `${20 * (index % 3)}%`,
                }}
                animate={floatingAnimation}
                transition={{
                  delay: index * 0.2,
                  duration: 2 + index,
                }}
              >
                <Icon className="w-8 h-8 text-orange-100/70" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

