import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "assets/img/Logo/correct.png";

const TermsAndConditionsPage = () => {

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
            Terms and Conditions
          </h1>

          <div className="space-y-8 text-gray-800 leading-relaxed text-[17px]">
            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. INTRODUCTION</h2>
              <p>
                These Terms and Conditions (“Terms”) govern access to and use of the OLTP platform operated by The Correct Steps. Accessing, browsing, registering on, or transacting through the platform constitutes acceptance of these Terms and establishes a legally binding agreement between the user and the Company. If these Terms are not accepted, access to the platform must be discontinued.
              </p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. NATURE OF SERVICES</h2>
              <p className="mb-4 text-gray-800 font-medium">The OLTP platform provides digital educational and assessment services, including but not limited to:</p>
              <ul className="space-y-3 pl-2">
                {["Online courses and training modules", "Test series and mock examinations", "Skill development programs", "Academic and professional learning content", "Certifications (where applicable)"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4">The Company reserves the right to modify, suspend, or discontinue any service or feature at its sole discretion without prior notice.</p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. ELIGIBILITY</h2>
              <p className="mb-4">Use of the platform is permitted only to individuals who:</p>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  Are legally competent to enter into binding contracts under applicable law
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  Provide accurate and complete registration details
                </li>
              </ul>
              <p className="mt-4">Minors may access the platform only under the supervision of a parent or legal guardian.</p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. USER ACCOUNT</h2>
              <p className="mb-4">To access certain services, registration may be required.</p>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  All information provided must be accurate and up to date
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  The account holder is solely responsible for maintaining confidentiality of login credentials
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  Any activity conducted through a registered account shall be deemed to be authorized by the account holder
                </li>
              </ul>
              <p className="mt-4">The Company reserves the right to suspend or terminate accounts in case of misuse or violation of these Terms.</p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. PAYMENT TERMS</h2>
              <div className="space-y-6">
                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 bg-teal-500 rounded-full"></span>
                    5.1 Payment Processing
                  </h3>
                  <p className="text-sm">All payments on the platform are processed through authorized third-party payment gateway providers. The Company does not store or process sensitive financial information such as card details.</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="h-2 w-2 bg-teal-500 rounded-full"></span>
                    5.2 Accepted Payment Methods
                  </h3>
                  <div className="flex flex-wrap gap-3 pl-4">
                    {["Credit Cards", "Debit Cards", "UPI", "Net Banking", "Digital Wallets"].map((item, i) => (
                      <span key={i} className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold border border-teal-100">
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-gray-400 italic pl-4">Availability is subject to the payment gateway provider.</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="h-2 w-2 bg-teal-500 rounded-full"></span>
                    5.3 Pricing
                  </h3>
                  <ul className="space-y-2 pl-4">
                    <li className="text-sm">● All fees are displayed in Indian Rupees (INR)</li>
                    <li className="text-sm">● Prices are subject to change at the Company’s discretion</li>
                    <li className="text-sm font-bold text-gray-800">● Applicable taxes, including GST, shall be charged as per prevailing laws</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. PAYMENT CONFIRMATION</h2>
              <p>
                Upon successful completion of a transaction, a confirmation shall be generated electronically. In case of failed transactions where funds are debited, resolution and refund processing shall be handled by the respective payment gateway or financial institution as per their policies.
              </p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. REFUND AND CANCELLATION</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3">7.1 General Policy</h3>
                  <p className="text-sm mb-4">All purchases made on the platform are for digital services. As such:</p>
                  <ul className="space-y-2">
                    <li className="text-sm text-red-600 font-bold">● Refunds are not permitted once access is granted</li>
                    <li className="text-sm">● Refunds may be considered in exceptional cases</li>
                  </ul>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">7.2 Processing Timeline</h3>
                    <p className="text-sm">Where approved, refunds are credited to the original method within 5–7 business days.</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-1">7.3 Cancellation</h3>
                    <p className="text-sm">Must be made prior to activation or access of the service.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. USER CONDUCT</h2>
              <p className="mb-4">The following activities are strictly prohibited:</p>
              <ul className="space-y-3 pl-2">
                {["Sharing or distributing account credentials", "Copying, reproducing, or redistributing platform content", "Engaging in fraudulent, unlawful, or abusive activities", "Attempting unauthorized access, hacking, or reverse engineering"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-red-400 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-gray-400 italic">Violation may result in suspension or permanent termination of access.</p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. INTELLECTUAL PROPERTY</h2>
              <p className="mb-4">All content available on the platform, including study material, test questions, designs, and graphics, are the exclusive intellectual property of The Correct Steps.</p>
              <div className="bg-teal-50 border border-teal-100 p-4 rounded-lg text-teal-800 font-bold text-sm text-center">
                UNAUTHORIZED USE, REPRODUCTION, OR DISTRIBUTION IS STRICTLY PROHIBITED.
              </div>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. LIMITATION OF LIABILITY</h2>
              <ul className="space-y-3 pl-2">
                {["Any indirect, incidental, or consequential damages", "Interruption or unavailability of the platform", "Loss arising from technical issues or internet failures"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-gray-300 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. THIRD-PARTY SERVICES</h2>
              <p>
                The platform may integrate third-party services. Such services operate under their own terms, and the Company shall not be responsible for their actions or performance.
              </p>
            </section>

            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. PRIVACY AND DATA PROTECTION</h2>
              <p>
                All personal information collected is handled in accordance with the Company’s Privacy Policy and applicable Indian laws.
              </p>
            </section>

            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. CHARGEBACKS AND DISPUTES</h2>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  Any transaction disputes must first be raised with the Company
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  Unauthorized or fraudulent chargebacks may result in account suspension
                </li>
              </ul>
            </section>

            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. TERMINATION</h2>
              <p className="mb-4 text-gray-800 font-medium italic">The Company reserves the right to suspend or terminate access:</p>
              <ul className="space-y-3 pl-2 text-sm">
                <li>● Without prior notice</li>
                <li>● In case of violation of these Terms</li>
                <li>● In case of suspected fraudulent activity</li>
              </ul>
            </section>

            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. GOVERNING LAW AND JURISDICTION</h2>
              <p className="bg-gray-50 p-4 rounded-lg border border-gray-100 font-bold text-center text-gray-800">
                Subject to the exclusive jurisdiction of the courts located in Ghaziabad / Delhi NCR, India.
              </p>
            </section>

            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. AMENDMENTS</h2>
              <p>
                The Company reserves the right to revise these Terms at any time. Updated Terms shall become effective immediately upon publication.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">17. CONTACT INFORMATION</h2>
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
              <p className="mt-8 font-bold text-center text-teal-700">All communications shall be addressed within a reasonable timeframe.</p>
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

export default TermsAndConditionsPage;
