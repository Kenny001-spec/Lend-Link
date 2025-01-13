import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, DollarSign, RefreshCw, Smartphone, BarChart } from 'react-feather';

const steps = [
  { icon: UserPlus, title: 'Create an Account', description: 'Sign up and verify your identity on the LENDLINK platform using secure blockchain-based authentication.' },
  { icon: Search, title: 'Browse Loans', description: 'Explore available loan offers or create a loan request with our intuitive dashboard.' },
  { icon: DollarSign, title: 'Lend or Borrow', description: 'Choose to lend funds or apply for a loan that suits your needs with flexible terms.' },
  { icon: RefreshCw, title: 'Manage Transactions', description: 'Track repayments, interest accrual, and loan status in real-time with detailed insights.' },
  { icon: BarChart, title: 'Interactive Dashboard', description: 'Access a simple and accessible interface with interactive charts and filters for enhanced usability.' },
  { icon: Smartphone, title: 'Multi-Device Access', description: 'Seamlessly access the platform across desktop, mobile, and tablet devices with our responsive design.' },
];

const HowItWorks = () => {
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
    <section
      id="how-it-works"
      className="py-20 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-indigo-900 to-violet-900" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_500px_at_50%_50%,#3b82f6,transparent)]" />
        <div className="absolute w-full h-full bg-[radial-gradient(circle_400px_at_80%_20%,#6366f1,transparent)]" />
        <div className="absolute w-full h-full bg-[radial-gradient(circle_300px_at_20%_80%,#8b5cf6,transparent)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-900/50 to-violet-900/50 rounded-lg p-6 shadow-xl backdrop-blur-md border border-white/10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <motion.div
                animate={glowAnimation}
                className="relative inline-block mb-4 p-4 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
              >
                <step.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 mb-2">
                {step.title}
              </h3>
              <p className="text-blue-100 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
