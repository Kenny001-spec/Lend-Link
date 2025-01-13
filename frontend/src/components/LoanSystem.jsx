import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, Clock, CheckCircle } from 'react-feather';

const LoanSystem = () => {
  const steps = [
    { icon: FileText, title: 'Submit Request', description: 'Borrowers specify loan amount, interest rate, and repayment duration.' },
    { icon: Users, title: 'Automatic Matching', description: 'Smart contracts match lenders with borrowers based on criteria.' },
    { icon: Clock, title: 'Interest Calculation', description: 'Automated interest accrual based on agreed-upon terms.' },
    { icon: CheckCircle, title: 'Loan Approval', description: 'Quick processing and approval of matching loan requests.' },
  ];

  return (
    <section className="py-20 bg-blue-800 bg-opacity-50 relative z-10">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Blockchain-Powered Loan System
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-blue-700 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-md"
            >
              <step.icon className="w-12 h-12 text-blue-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-blue-100">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoanSystem;

