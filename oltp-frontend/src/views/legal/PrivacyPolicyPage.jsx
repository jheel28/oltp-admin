import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "assets/img/Logo/correct.png";

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

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

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 text-center border-b pb-6">
            Privacy Policy
          </h1>

          <div className="space-y-8 text-gray-800 leading-relaxed text-[17px]">
            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. INTRODUCTION</h2>
              <p>
                This Privacy Policy describes the manner in which “The Correct Steps” collects, uses, processes, stores, and protects personal information of individuals accessing or using the OLTP platform. By accessing or using the platform, consent is deemed to have been provided for the collection and use of information in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. SCOPE</h2>
              <p className="mb-4">This Privacy Policy applies to:</p>
              <ul className="space-y-3 pl-2">
                {["Visitors of the website", "Registered users", "Individuals making payments for services", "Participants in courses, tests, and programs"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. INFORMATION COLLECTED</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 bg-teal-500 rounded-full"></span>
                    3.1 Personal Information
                  </h3>
                  <ul className="space-y-2">
                    {["Full name", "Email address", "Contact number", "Educational details", "Billing and transaction details"].map((item, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <span className="text-teal-500">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 bg-teal-500 rounded-full"></span>
                    3.2 Technical Information
                  </h3>
                  <ul className="space-y-2">
                    {["IP address", "Browser type and device information", "Operating system", "Usage data and interaction logs"].map((item, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <span className="text-teal-500">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-8 bg-amber-50/30 p-6 rounded-xl border border-amber-100">
                <h3 className="font-bold text-gray-900 mb-2">3.3 Payment Information</h3>
                <p className="text-sm mb-4">Payments are processed through secure third-party payment gateways. The Company does not collect or store sensitive financial data such as:</p>
                <div className="flex flex-wrap gap-4">
                  {["Card numbers", "CVV", "Net banking credentials"].map((item, i) => (
                    <span key={i} className="bg-white px-3 py-1 rounded-full text-xs font-bold text-amber-700 border border-amber-200">
                      NO {item.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. PURPOSE OF DATA COLLECTION</h2>
              <ul className="space-y-3 pl-2">
                {["Account creation and management", "Providing access to courses and test series", "Processing transactions and payments", "Sending notifications, updates, and confirmations", "Improving platform performance and user experience", "Ensuring compliance with legal and regulatory obligations"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. LEGAL BASIS FOR PROCESSING</h2>
              <ul className="space-y-3 pl-2">
                {["Consent provided by the user", "Performance of contractual obligations", "Compliance with applicable laws and regulations"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-400 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. DATA SHARING AND DISCLOSURE</h2>
              <p className="mb-4">The Company does not sell or rent personal information. Information may be shared with:</p>
              <ul className="space-y-3 pl-2">
                {["Payment gateway providers for transaction processing", "Technology service providers for hosting and analytics", "Government or regulatory authorities where required by law"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 italic">All such disclosures are made under strict confidentiality obligations.</p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. DATA RETENTION</h2>
              <ul className="space-y-3 pl-2">
                {["Fulfillment of services", "Legal and regulatory compliance", "Dispute resolution and enforcement of agreements"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4">Upon expiry of the retention period, data shall be securely deleted or anonymized.</p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. DATA SECURITY</h2>
              <p className="mb-4">The Company implements appropriate technical and organizational measures to protect personal data, including:</p>
              <ul className="space-y-3 pl-2">
                {["Secure servers and encryption practices", "Access control mechanisms", "Regular system monitoring"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-green-400 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-gray-400 italic">However, no system can guarantee absolute security, and transmission of data is at inherent risk.</p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. USER RIGHTS</h2>
              <ul className="space-y-3 pl-2">
                {["Access personal information", "Request correction of inaccurate data", "Request deletion of data (where permissible)", "Withdraw consent for processing"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4">Requests may be submitted through the contact details provided below.</p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. COOKIES AND TRACKING TECHNOLOGIES</h2>
              <ul className="space-y-3 pl-2">
                {["Enhance user experience", "Analyze website traffic", "Store user preferences"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4">Users may modify browser settings to decline cookies; however, certain functionalities may be affected.</p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. THIRD-PARTY LINKS</h2>
              <p>
                The platform may contain links to third-party websites or services. The Company is not responsible for the privacy practices or content of such external platforms. Users are advised to review their respective policies.
              </p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. CHILDREN’S PRIVACY</h2>
              <p>
                The platform is not intended for use by individuals below 18 years of age without parental supervision. The Company does not knowingly collect personal data from minors without appropriate consent.
              </p>
            </section>

            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. CROSS-BORDER DATA TRANSFER</h2>
              <p>
                In the course of providing services, data may be processed or stored on servers located outside India by authorized service providers. Appropriate safeguards shall be implemented to ensure data protection.
              </p>
            </section>

            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. CHANGES TO THIS POLICY</h2>
              <p>
                The Company reserves the right to update or modify this Privacy Policy at any time. Updated versions shall be effective upon publication on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. CONTACT INFORMATION</h2>
              <p className="mb-6">For any queries, concerns, or grievances:</p>
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 rounded-2xl border border-teal-100 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-1">Company</h4>
                      <p className="text-gray-900 font-bold text-lg">The Correct Steps</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-1">Email</h4>
                      <a href="mailto:thecorrectsteps@gmail.com" className="text-gray-900 font-bold hover:text-teal-600 transition-colors">thecorrectsteps@gmail.com</a>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-1">Phone</h4>
                      <p className="text-gray-900 font-bold">+91 9958800754</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-1">Registered Address</h4>
                    <p className="text-gray-700 leading-relaxed text-[16px]">
                      A-308, 4th Floor, Orchid Estate<br />
                      Bisrakh, Sector 1, Greater Noida<br />
                      Gautambuddha Nagar, Uttar Pradesh<br />
                      PIN Code: 201318<br />
                      <span className="text-sm italic text-gray-500 mt-2 block">Landmark: Opposite Baljai Parking</span>
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-8 font-bold text-center text-teal-700">All requests shall be addressed within a reasonable timeframe.</p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-cyan-900 text-white py-12">
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

export default PrivacyPolicyPage;
