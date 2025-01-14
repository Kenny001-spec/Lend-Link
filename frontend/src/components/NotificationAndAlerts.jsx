import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, MessageSquare, Smartphone } from 'react-feather';

const NotificationsAndAlerts = () => {
  const alertTypes = [
    { icon: Bell, title: 'In-App Notifications', description: 'Receive instant updates within the platform.' },
    { icon: Mail, title: 'Email Alerts', description: 'Get important notifications directly to your inbox.' },
    { icon: MessageSquare, title: 'SMS Notifications', description: 'Stay informed with text message alerts.' },
    { icon: Smartphone, title: 'Mobile Push Notifications', description: 'Instant alerts on your mobile device.' },
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
          Notifications and Alerts
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {alertTypes.map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-blue-700 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-md"
            >
              <alert.icon className="w-12 h-12 text-blue-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{alert.title}</h3>
              <p className="text-blue-100">{alert.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NotificationsAndAlerts;

