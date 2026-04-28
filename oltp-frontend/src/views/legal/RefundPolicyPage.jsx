import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "assets/img/Logo/correct.png";

const RefundPolicyPage = () => {

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
            Refund and Cancellation Policy
          </h1>

          <div className="space-y-8 text-gray-800 leading-relaxed text-[17px]">
            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. INTRODUCTION</h2>
              <p>
                This Refund and Cancellation Policy (“Policy”) outlines the terms governing cancellations, refunds, and related matters for services offered on the OLTP platform operated by The Correct Steps (“Company”). This Policy forms an integral part of the Terms and Conditions and must be read in conjunction with them.
              </p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. NATURE OF SERVICES</h2>
              <p className="mb-4">The platform provides digital educational services, including:</p>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  Online courses
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  Test series and mock examinations
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  Skill development programs
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  Certification-based training
                </li>
              </ul>
              <p className="mt-4">All services delivered through the platform are digital in nature.</p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. GENERAL REFUND POLICY</h2>
              <p className="mb-4 italic text-gray-500">Due to the nature of digital content and immediate access to services:</p>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-3 font-semibold text-gray-800">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-red-400 shrink-0"></span>
                  All purchases are generally non-refundable
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-red-400 shrink-0"></span>
                  No refunds shall be issued once access to the course, test series, or any digital content has been granted
                </li>
              </ul>
              <p className="mt-4">This policy is in accordance with standard digital product practices.</p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. ELIGIBILITY FOR REFUND</h2>
              <p className="mb-4">Refunds may be considered only under the following exceptional circumstances:</p>
              <ul className="space-y-3 pl-2">
                {["Duplicate payment made for the same service", "Payment deducted but service not activated or provided", "Technical error resulting in non-delivery of purchased service", "Cancellation request raised before access to the service has been granted (if applicable)"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4">All refund requests are subject to verification and approval by the Company.</p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. NON-REFUNDABLE SITUATIONS</h2>
              <p className="mb-4">Refunds shall not be provided in the following cases:</p>
              <ul className="space-y-3 pl-2">
                {["Change of mind after purchase", "Partial usage of course or test series", "Failure to attend live sessions or complete modules", "Lack of compatibility with user’s device or internet connectivity", "Dissatisfaction with content after access has been granted"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-gray-300 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. CANCELLATION POLICY</h2>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  Cancellation requests must be submitted prior to activation or access of the service
                </li>
                <li className="flex items-start gap-3 font-semibold text-gray-800">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-red-400 shrink-0"></span>
                  Once access credentials are issued or content is accessed, cancellation shall not be permitted
                </li>
              </ul>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. REFUND REQUEST PROCESS</h2>
              <p className="mb-4 text-gray-800 font-medium underline">To request a refund, the following steps must be followed:</p>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  Submit a request via email to the official support email of the Company
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  Include transaction details, registered email ID, and reason for request
                </li>
                <li className="flex items-start gap-3 font-bold text-teal-700">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  Requests must be made within 3 days of the transaction date
                </li>
              </ul>
              <p className="mt-4 italic">Incomplete or delayed requests may not be considered.</p>
            </section>

            <section className="border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. REFUND PROCESSING</h2>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  Approved refunds shall be processed within 5–7 business days
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  The refund shall be credited to the original payment method used for the transaction
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  Processing time may vary depending on the payment gateway or banking institution
                </li>
              </ul>
            </section>

            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. FAILED TRANSACTIONS</h2>
              <p className="mb-4">In case of failed transactions where the amount has been debited:</p>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  The amount is generally auto-reversed by the payment gateway or bank
                </li>
                <li className="flex items-start gap-3 font-medium">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  Timelines may vary between 5–10 business days depending on the financial institution
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  The Company shall provide assistance where required but is not responsible for delays caused by banks or payment gateways
                </li>
              </ul>
            </section>

            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. CHARGEBACKS</h2>
              <ul className="space-y-3 pl-2">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  Initiating a chargeback without contacting the Company may result in suspension of the account
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 shrink-0"></span>
                  The Company reserves the right to dispute chargebacks that are found to be fraudulent or unjustified
                </li>
              </ul>
            </section>

            <section className="border-b border-gray-50 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. MODIFICATIONS TO POLICY</h2>
              <p>
                The Company reserves the right to update or modify this Policy at any time. Any changes shall be effective immediately upon publication on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. CONTACT INFORMATION</h2>
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
              <p className="mt-8 font-bold text-center text-teal-700">All requests shall be reviewed and responded to within a reasonable timeframe.</p>
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

export default RefundPolicyPage;
