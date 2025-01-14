// import React from 'react';
// import { motion } from 'framer-motion';
// import { Twitter, Linkedin, GitHub, MessageCircle } from 'react-feather';

// const Footer = () => {
//   return (
//     <footer className="bg-blue-900 bg-opacity-50 py-12 relative z-10">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-wrap justify-between">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="w-full md:w-1/3 mb-8 md:mb-0"
//           >
//             <h3 className="text-2xl font-bold mb-4">LENDLINK</h3>
//             <p className="text-blue-100">Empowering financial inclusion through blockchain technology on CrossFI.</p>
//           </motion.div>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//             className="w-full md:w-1/3 mb-8 md:mb-0"
//           >
//             <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
//             <ul className="space-y-2">
//               <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Home</a></li>
//               <li><a href="#" className="text-blue-100 hover:text-white transition-colors">About</a></li>
//               <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Features</a></li>
//               <li><a href="#" className="text-blue-100 hover:text-white transition-colors">How It Works</a></li>
//             </ul>
//           </motion.div>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="w-full md:w-1/3"
//           >
//             <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
//             <div className="flex space-x-4">
//               <a href="#" className="text-blue-100 hover:text-white transition-colors">
//                 <Twitter className="w-6 h-6" />
//               </a>
//               <a href="#" className="text-blue-100 hover:text-white transition-colors">
//                 <Linkedin className="w-6 h-6" />
//               </a>
//               <a href="#" className="text-blue-100 hover:text-white transition-colors">
//                 <GitHub className="w-6 h-6" />
//               </a>
//               <a href="#" className="text-blue-100 hover:text-white transition-colors">
//                 <MessageCircle className="w-6 h-6" />
//               </a>
//             </div>
//           </motion.div>
//         </div>
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//           className="mt-12 pt-8 border-t border-blue-700 text-center"
//         >
//           <p className="text-blue-100">&copy; {new Date().getFullYear()} LENDLINK. All rights reserved.</p>
//         </motion.div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;



// New UI
import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Github, Linkedin, MessageSquare, Wallet } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: MessageSquare, href: '#', label: 'Discord' },
  ];

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Security', href: '/security' },
  ];

  return (
    <footer className="relative pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-indigo-950 to-violet-950" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_500px_at_50%_100%,#3b82f6,transparent)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-violet-500 p-2 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                LENDLINK
              </span>
            </div>
            <p className="text-blue-100">
              Empowering financial inclusion through blockchain technology on CrossFI.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-blue-100 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
              Contact Us
            </h4>
            <p className="text-blue-100 mb-4">
              Have questions? Reach out to our support team anytime.
            </p>
            <a
              href="mailto:support@lendlink.com"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              support@lendlink.com
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
              Connect With Us
            </h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/5 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <social.icon className="h-5 w-5 text-blue-100" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8 border-t border-white/10 text-center"
        >
          <p className="text-blue-100">
            &copy; {new Date().getFullYear()} LENDLINK. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

