import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'react-feather';

const features = [
  {
    title: 'Project Logo',
    description: 'Our distinctive logo represents trust and innovation in decentralized finance.',
    image: '/placeholder.svg?height=300&width=300'
  },
  {
    title: 'Collateral Management',
    description: 'Efficiently manage and track collateral for secure, transparent lending.',
    image: '/placeholder.svg?height=300&width=300'
  },
  {
    title: 'Borrowing',
    description: 'Access quick and flexible loans tailored to your needs.',
    image: '/placeholder.svg?height=300&width=300'
  },
  {
    title: 'Marketplace Access',
    description: 'Explore a vibrant ecosystem of lending and borrowing opportunities.',
    image: '/placeholder.svg?height=300&width=300'
  },
  {
    title: 'Portfolio Management',
    description: 'Track and optimize your lending and borrowing activities in real-time.',
    image: '/placeholder.svg?height=300&width=300'
  }
];

const FeatureSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + features.length) % features.length);
  };

  return (
    <section className="py-20 bg-blue-800 bg-opacity-50 relative z-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Discover real-time lending and borrowing opportunities at your fingertips.
        </h2>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center justify-center"
            >
              <img
                src={features[currentIndex].image}
                alt={features[currentIndex].title}
                className="w-64 h-64 object-cover rounded-lg shadow-lg mb-8 md:mb-0 md:mr-8"
              />
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-4">{features[currentIndex].title}</h3>
                <p className="text-lg">{features[currentIndex].description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-500 p-2 rounded-full text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-500 p-2 rounded-full text-white"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="flex justify-center mt-8">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full mx-1 ${
                index === currentIndex ? 'bg-blue-500' : 'bg-blue-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSlider;

