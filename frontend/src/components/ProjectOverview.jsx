import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Target, Users, Shield } from 'react-feather';

const ProjectOverview = () => {
  const goals = [
    { icon: FileText, text: 'Smart Contract Development' },
    { icon: Users, text: 'User Account System' },
    { icon: Target, text: 'Loan Management Features' },
    { icon: Shield, text: 'Transparency and Security' },
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
          Project Overview
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold mb-4">About LENDLINK</h3>
            <p className="text-lg mb-6">
              LENDLINK is a decentralized platform that facilitates small-scale loans to individuals and businesses, ensuring transparency, security, and accessibility. By leveraging blockchain technology, we allow borrowers to access micro-loans seamlessly, while lenders can earn interest on their contributions.
            </p>
            <p className="text-lg">
              Our platform addresses the challenges of traditional lending systems, such as high fees, slow processing times, and lack of inclusivity, by creating a secure, trustless environment for peer-to-peer micro-loan transactions on the CrossFI blockchain.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold mb-4">Project Goals</h3>
            <ul className="space-y-4">
              {goals.map((goal, index) => (
                <motion.li 
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <goal.icon className="text-blue-300 h-6 w-6" />
                  <span>{goal.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectOverview;

