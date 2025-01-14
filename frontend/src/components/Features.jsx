import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  RefreshCw,
  Users,
  DollarSign,
  Bell,
  Lock,
  Eye,
  BarChart,
  Smartphone,
  FileText,
  Key,
} from 'react-feather';

const featureItems = [
  {
    icon: Shield,
    title: 'Blockchain-Powered Loan System',
    description: 'Smart contracts automatically match lenders with borrowers based on predefined criteria.',
  },
  {
    icon: DollarSign,
    title: 'Interest Calculation and Management',
    description: 'Automate interest accrual with both fixed and dynamic interest rate models.',
  },
  {
    icon: Users,
    title: 'Borrower and Lender Accounts',
    description: 'Separate dashboards for borrowers and lenders with loan history, schedules, and earnings.',
  },
  {
    icon: Key,
    title: 'Secure Authentication',
    description: 'Blockchain-based authentication with wallet-based logins (e.g., MetaMask) for enhanced security.',
  },
  {
    icon: RefreshCw,
    title: 'Real-Time Loan Monitoring',
    description: 'Track loan status, repayments, and interest accrual in real-time with detailed insights.',
  },
  {
    icon: Eye,
    title: 'Public Ledger for Transactions',
    description: 'Maintain a transparent on-chain record of all loan activities for independent verification.',
  },
  {
    icon: Bell,
    title: 'Loan Activity Alerts',
    description: 'Receive notifications about loan approval, repayment deadlines, or overdue payments via email, SMS, or in-app messages.',
  },
  {
    icon: FileText,
    title: 'Smart Contract Auditing',
    description: 'Thorough testing and external audits to ensure the security of loan-related contracts.',
  },
  {
    icon: Lock,
    title: 'Data Encryption and Privacy',
    description: 'Ensure confidentiality of user information and adhere to GDPR compliance.',
  },
  {
    icon: BarChart,
    title: 'Intuitive Dashboard',
    description: 'Simple interface with interactive charts and filters for enhanced usability.',
  },
  {
    icon: Smartphone,
    title: 'Multi-Device Compatibility',
    description: 'Responsive design for seamless access across desktop, mobile, and tablet devices.',
  },
  {
    icon: Zap,
    title: 'Fast and Cost-Effective',
    description: 'Utilize CrossFI blockchain for quick and affordable transactions.',
  },
];

const Features = () => {
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
    <section id="features" className="py-20 relative overflow-hidden">
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
          Key Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureItems.map((item, index) => (
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
                <item.icon className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 mb-2">
                {item.title}
              </h3>
              <p className="text-blue-100 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
