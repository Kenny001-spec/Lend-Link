import React from 'react';
import './config/connection';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import LoanSystem from './components/LoanSystem';
import HowItWorks from './components/HowItWorks';
import ProjectOverview from './components/ProjectOverview';
import SecurityMeasures from './components/SecurityMeansures';
import NotificationsAndAlerts from './components/NotificationAndAlerts';
import CTA from './components/CTA';
import Footer from './components/Footer';


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/features" element={<Features />} />
            <Route path="/loan-system" element={<LoanSystem />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/project-overview" element={<ProjectOverview />} />
            <Route path="/security-measures" element={<SecurityMeasures />} />
            <Route path="/notifications" element={<NotificationsAndAlerts />} />
            <Route path="/cta" element={<CTA />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
