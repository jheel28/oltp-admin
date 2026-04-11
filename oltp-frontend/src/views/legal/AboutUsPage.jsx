import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "assets/img/Logo/correct.png";
import { FaRocket, FaEye, FaUsers, FaHistory } from "react-icons/fa";

const AboutUsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 transition-all duration-200 shadow-lg bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src={logo} alt="Logo" className="h-10 sm:h-12 w-auto" />
            <span className="font-bold text-xl sm:text-2xl text-gray-800 tracking-tight">
              THE CORRECT STEPS
            </span>
          </Link>
          <Link 
            to="/"
            className="text-teal-600 font-bold hover:text-teal-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-cyan-900 text-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400 blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400 blur-[120px]"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight italic">
            Empowering Aspirants <br className="hidden md:block" /> with Every Step.
          </h1>
          <p className="text-xl md:text-2xl text-cyan-50 max-w-3xl mx-auto leading-relaxed font-medium">
            At THE CORRECT STEPS, we believe that the right preparation can bridge the gap between dreams and reality.
          </p>
        </div>
      </section>

      {/* Placeholder Content Section */}
      <main className="flex-grow container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto space-y-24">
          
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center text-3xl mb-6">
                <FaRocket />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed italic">
                [Awaiting Mission Statement] - To provide high-quality, smart testing solutions that help technical aspirants master their subjects and ace competitive exams with confidence.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center text-3xl mb-6">
                <FaEye />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed italic">
                [Awaiting Vision Statement] - To become the most trusted global platform for technical assessment and career guidance, fostering a community of lifelong learners.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <section className="text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-16 underline decoration-teal-500 decoration-4 underline-offset-8">
              Why We Exist
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: FaUsers, label: "Community Driven", desc: "Built for students, by experts." },
                { icon: FaHistory, label: "Proven Methodology", desc: "Scientific approach to testing." },
                { icon: FaRocket, label: "Innovation", desc: "Constantly evolving technology." },
                { icon: FaEye, label: "Transparency", desc: "Clear tracking and honest feedback." }
              ].map((value, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-800 mb-4 border border-gray-200">
                    <value.icon />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{value.label}</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">{value.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CEO Placeholder */}
          <section className="bg-cyan-900 rounded-[3rem] p-10 md:p-20 text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center text-white/50 relative overflow-hidden shrink-0 shadow-inner">
               <FaUsers className="text-6xl opacity-30" />
               <div className="absolute inset-0 flex items-center justify-center text-xs font-bold uppercase tracking-widest bg-black/40 text-white backdrop-blur-sm">
                 CEO Photo Placeholder
               </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">[CEO Full Name]</h3>
              <h4 className="text-teal-400 font-bold uppercase tracking-widest text-sm mb-6">Founder & CEO, THE CORRECT STEPS</h4>
              <p className="text-lg md:text-xl leading-relaxed italic opacity-90 max-w-2xl">
                "[Awaiting CEO Bio/Quote] - We are committed to providing the most accurate and efficient tools for students to realize their full potential in technical fields."
              </p>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-cyan-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <img src={logo} alt="Logo" className="h-12 w-auto mx-auto mb-6 opacity-80" />
          <p className="text-gray-200 max-w-md mx-auto mb-8">
            Empowering students with smart testing and career resources.
          </p>
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} THE CORRECT STEPS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUsPage;
