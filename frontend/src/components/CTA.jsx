import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-indigo-900 to-violet-900" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_500px_at_50%_50%,#3b82f6,transparent)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative inline-block mb-6">
            <motion.div
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.98, 1, 0.98]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 blur-xl opacity-50"
            />
            <h2 className="text-4xl md:text-5xl font-bold relative">
              Transform Your Financial Future
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block ml-3"
              >
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </motion.span>
            </h2>
          </div>

          <motion.p
            className="text-xl mb-12 text-blue-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Join LENDLINK today and experience the future of decentralized micro-loans on the CrossFI blockchain.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl text-lg font-medium overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 transition-opacity opacity-0 group-hover:opacity-100" />
              <span className="relative flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-transparent border border-white/20 rounded-xl text-lg font-medium overflow-hidden hover:border-white/40"
            >
              <div className="absolute inset-0 bg-white/5 transition-opacity opacity-0 group-hover:opacity-100" />
              <span className="relative">Learn More</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;