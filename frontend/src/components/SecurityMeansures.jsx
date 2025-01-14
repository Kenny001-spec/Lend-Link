import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Bell } from 'react-feather';

const securityMeasures = [
  { 
    icon: Shield, 
    title: 'Smart Contract Auditing', 
    description: 'Thorough testing and external audits to ensure the security of loan-related contracts. We engage external auditors to review the code and identify vulnerabilities.' 
  },
  { 
    icon: Lock, 
    title: 'Data Encryption and Privacy', 
    description: 'We ensure the confidentiality of user information and transaction data. Our system adheres to compliance requirements such as GDPR for data protection.' 
  },
  { 
    icon: Eye, 
    title: 'Transparent Ledger', 
    description: 'We maintain a transparent record of all loan activities on-chain, allowing users to verify loan-related data independently.' 
  },
  { 
    icon: FileText, 
    title: 'Compliance', 
    description: 'Our platform adheres to all relevant financial regulations and data protection laws to ensure a safe and compliant environment for all users.' 
  },
  { 
    icon: Bell, 
    title: 'Real-Time Alerts', 
    description: 'Users receive instant notifications about critical updates such as loan approval, repayment deadlines, or overdue payments via email, SMS, or in-app messages.' 
  },
];

const SecurityMeasures = () => {
  return (
    <section className="py-20 bg-blue-900 bg-opacity-50 relative z-10">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Security Measures and Transparency
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityMeasures.map((measure, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-blue-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-md"
            >
              <div className="flex items-center mb-4">
                <measure.icon className="w-8 h-8 text-blue-300 mr-3" />
                <h3 className="text-xl font-semibold">{measure.title}</h3>
              </div>
              <p className="text-blue-100">{measure.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecurityMeasures;

