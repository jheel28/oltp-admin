import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "assets/img/Logo/correct.png";
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube, 
  FaWhatsapp,
  FaPaperPlane
} from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Thank you for reaching out! We will get back to you soon.");
    setFormData({ name: "", email: "", mobile: "", subject: "", message: "" });
  };

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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 v-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-cyan-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400 blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400 blur-[120px]"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            Get In Touch
          </h1>
          <p className="text-lg md:text-xl text-cyan-50 max-w-2xl mx-auto leading-relaxed">
            Have questions about our tests or platform? We're here to help you every step of the way.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 -mt-12 md:-mt-20 pb-20 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">
            
            {/* Left Column: Contact Info */}
            <div className="lg:w-5/12 bg-cyan-900 p-8 md:p-14 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 italic">Contact Information</h2>
              
              <div className="space-y-10">
                <div className="flex items-start gap-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 text-teal-300 text-xl border border-white/20">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-300 uppercase tracking-widest text-xs mb-1">Our Office</h4>
                    <p className="text-lg leading-relaxed">
                      A-308, 4th Floor, Orchid Estate,<br />
                      Bisrakh, Sector 1, Greater Noida,<br />
                      Uttar Pradesh - 201318
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 text-teal-300 text-xl border border-white/20">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-300 uppercase tracking-widest text-xs mb-1">Call Us</h4>
                    <p className="text-lg">+91 9958800754</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 text-teal-300 text-xl border border-white/20">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-300 uppercase tracking-widest text-xs mb-1">Email Support</h4>
                    <p className="text-lg">thecorrectsteps@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-12 border-t border-white/10">
                <h4 className="font-bold text-gray-300 uppercase tracking-widest text-xs mb-6">Follow Our Socials</h4>
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: FaFacebook, href: "https://www.facebook.com/share/1CUY5UXzuV/", label: "Facebook", bg: "bg-[#1877F2]" },
                    { icon: FaInstagram, href: "https://www.instagram.com/thecorrectsteps_official/", label: "Instagram", bg: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" },
                    { icon: FaLinkedin, href: "https://www.linkedin.com/company/the-correct-steps-official/", label: "LinkedIn", bg: "bg-[#0077b5]" },
                    { icon: FaYoutube, href: "https://youtube.com/@thecorrectsteps", label: "YouTube", bg: "bg-[#FF0000]" },
                    { icon: FaWhatsapp, href: "https://wa.me/919958800754", label: "WhatsApp", bg: "bg-[#25D366]" }
                  ].map((social, i) => (
                    <a 
                      key={i} 
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white transition-all transform hover:scale-110 border border-white/10 hover:brightness-110 ${social.bg}`}
                      aria-label={social.label}
                    >
                      <social.icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:w-7/12 p-8 md:p-14 bg-white">
              <div className="max-w-md mx-auto">
                <h3 className="text-3xl font-extrabold text-gray-900 mb-2">Send us a message</h3>
                <p className="text-gray-500 mb-10">We usually respond within 24 hours.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-bold text-gray-700 uppercase tracking-wide">Full Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        placeholder="e.g. Rahul Kumar"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                       <label htmlFor="mobile" className="text-sm font-bold text-gray-700 uppercase tracking-wide">Mobile Number</label>
                       <input 
                        type="tel" 
                        id="mobile" 
                        placeholder="e.g. +91 XXXXX XXXXX"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-bold text-gray-700 uppercase tracking-wide">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-bold text-gray-700 uppercase tracking-wide">Your Message</label>
                    <textarea 
                      id="message" 
                      rows="4" 
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50 resize-none"
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full mt-4 bg-teal-600 hover:bg-teal-500 text-white font-bold py-5 rounded-xl shadow-lg shadow-teal-600/20 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 text-lg"
                  >
                    <span>Send Message</span>
                    <FaPaperPlane className="text-sm" />
                  </button>
                </form>
              </div>
            </div>

          </div>
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

export default ContactPage;
