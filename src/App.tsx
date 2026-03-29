import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Stats from './components/Stats';
import Majors from './components/Majors';
import MajorDetail from './components/MajorDetail';
import About from './components/About';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import News from './components/News';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import AdminDashboard from './components/AdminDashboard';
import Registration from './components/Registration';
import StudentDashboard from './components/StudentDashboard';

import FAQ from './components/FAQ';

function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Stats />
      <Majors />
      <About />
      <Gallery />
      <Testimonials />
      <News />
      <FAQ />
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/majors" element={<Majors />} />
            <Route path="/majors/:id" element={<MajorDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
          </Routes>
        </main>
        <Footer />
        <AIChat />
      </div>
    </Router>
  );
}
