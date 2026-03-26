import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "assets/img/Logo/correct.png";
import handshake from "assets/img/hero/handshake.jpg";
import newImage from "assets/img/hero/1.jpg";
import { useEffect, useState } from "react";
import {
  FaCalculator,
  FaComments,
  FaChartLine,
  FaCog,
  FaBullseye,
} from "react-icons/fa";
import { mechanicalSubjects } from "views/subjects/subjectData";
import CategoryCard from "components/common/CategoryCard";

const ROUTES = {
  COMMUNICATION: "/subjects/communication-aptitude",
};

const otherTests = [
  { title: "Verbal ability" },
  { title: "Data interpretation and logical reasoning" },
  { title: "Quantitative aptitude" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get("role");
    if (role) {
      navigate(`/auth/sign-in?role=${role.toLowerCase()}`, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen font-sans text-aptText bg-white">
      <header className="relative z-50">
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src={logo} alt="Correct Steps" className="h-8 sm:h-10 w-auto" />
              <span className="font-bold text-lg sm:text-xl text-gray-800 tracking-tight">Correct Steps</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-4 text-xs sm:text-sm font-semibold">
                <Link to="/auth/user/sign-in" className="text-gray-800 hover:text-teal-600 transition-colors px-2 py-2">Log in</Link>
                <Link to="/auth/register/student" className="rounded-full bg-teal-600 hover:bg-teal-400 transition-colors shadow-sm px-4 sm:px-6 py-2 sm:py-2.5 text-white font-bold">Sign Up</Link>
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-800 hover:text-teal-600 transition-colors"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>

              <a href="#recruiting" className="text-black hover:text-teal-600 transition-colors hidden lg:block border border-gray-300 rounded-full px-4 py-1.5 text-[13px] font-medium tracking-wide">Recruiting?</a>
            </div>
          </div>
        </div>

        <div className={`bg-cyan-900 overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-[400px]" : "max-h-0 md:max-h-none"}`}>
          <div className="container mx-auto px-6">
            <nav className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:gap-10 text-white text-[13px] font-semibold py-6 md:py-4">
              <a href="#mechanical" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-300 transition-colors uppercase tracking-wider">
                Mechanical Engineering
              </a>
              <a href="#tests" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-300 transition-colors uppercase tracking-wider">
                Aptitude Tests
              </a>
              <a href="#prep" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-300 transition-colors uppercase tracking-wider">
                Prep Access
              </a>
              <a href="#news" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-300 transition-colors uppercase tracking-wider">
                Articles & News
              </a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="hover:text-gray-300 transition-colors uppercase tracking-wider">
                Contact Us
              </a>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative py-10 md:py-32 lg:py-40 flex items-center" style={{ minHeight: "auto" }}>
        <div
          className="absolute inset-0 z-0 bg-white"
          style={{
            backgroundImage: `linear-gradient(rgba(244, 246, 248, 0.9), rgba(244, 246, 248, 0.9)), url(${handshake})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="hidden md:block absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(90deg, #f4f6f8 0%, #f4f6f8 40%, rgba(244, 246, 248, 0.8) 50%, rgba(244, 246, 248, 0) 65%), url(${handshake})`,
            backgroundSize: "cover",
            backgroundPosition: "center right",
          }}
        />

        <div className="container mx-auto px-6 relative z-10 w-full mt-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="w-full md:w-3/5 max-w-2xl py-6 md:py-10">
              <h1 className="mb-4 text-2xl sm:text-3xl md:text-5xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                Smart Testing Platform for Serious Aspirants
              </h1>
              <p className="mb-6 text-xl text-gray-800">
                Advanced test series with real-time analysis and performance insights.
              </p>
              <p className="mb-8 text-lg text-gray-700">
                Start with 2 free tests. Unlock full potential with premium access.
              </p>
              <div>
                <Link to="/auth/sign-in?role=student" className="inline-block rounded shadow-md bg-teal-600 hover:bg-teal-400 transition-colors px-10 py-4 font-bold text-white text-[15px] tracking-wide">
                  GET STARTED NOW
                </Link>
              </div>
            </div>

            <div className="hidden md:block w-full md:w-80 shadow-2xl rounded-lg overflow-hidden bg-white border-t-4 border-teal-400 shrink-0">
              <div className="p-8 text-center">
                <h3 className="text-[22px] font-bold text-gray-900 mb-2">Recruiting?</h3>
                <p className="text-[15px] text-gray-700 mb-6">We help you choose the right talent.</p>
                <div className="w-12 h-1 bg-gray-300 mx-auto mb-6"></div>
                <button className="w-full rounded bg-teal-600 hover:bg-teal-400 transition-colors px-4 py-3 font-bold text-white uppercase text-sm tracking-wide">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-cyan-900 text-white py-4 relative z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-16">
            <a href="#numerical" className="flex flex-col items-center text-sm transform transition-transform hover:-translate-y-1 min-w-[60px]">
              <FaCalculator className="text-3xl md:text-4xl mb-1 md:mb-2" />
              <span className="text-[10px] md:text-xs font-semibold text-center">Numerical Tests</span>
            </a>
            <a href="#verbal" className="flex flex-col items-center text-sm transform transition-transform hover:-translate-y-1 min-w-[60px]">
              <FaComments className="text-3xl md:text-4xl mb-1 md:mb-2" />
              <span className="text-[10px] md:text-xs font-semibold text-center">Verbal Tests</span>
            </a>
            <a href="#nonverbal" className="flex flex-col items-center text-sm transform transition-transform hover:-translate-y-1 min-w-[60px]">
              <FaChartLine className="text-3xl md:text-4xl mb-1 md:mb-2" />
              <span className="text-[10px] md:text-xs font-semibold text-center">Non-verbal Tests</span>
            </a>
            <a href="#mechanical" className="flex flex-col items-center text-sm transform transition-transform hover:-translate-y-1 min-w-[60px]">
              <FaCog className="text-3xl md:text-4xl mb-1 md:mb-2" />
              <span className="text-[10px] md:text-xs font-semibold text-center">Mechanical Tests</span>
            </a>
            <a href="#publisher" className="flex flex-col items-center text-sm transform transition-transform hover:-translate-y-1 min-w-[60px]">
              <FaBullseye className="text-3xl md:text-4xl mb-1 md:mb-2" />
              <span className="text-[10px] md:text-xs font-semibold text-center">Tests by Publisher</span>
            </a>
          </div>
        </div>
      </div>

      <section className="py-20 bg-gray-50 border-t border-gray-200" id="mechanical">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Mechanical Engineering Practice Tests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mechanicalSubjects.map((subject) => (
              <CategoryCard
                key={subject.slug}
                imgSrc={newImage}
                title={subject.displayTitle}
                link={`/subjects/mechanical/${subject.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 border-t border-gray-200" id="tests">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Other Practice Tests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherTests.map((test) => (
              <CategoryCard
                key={test.title}
                imgSrc={newImage}
                title={test.title}
                link={ROUTES.COMMUNICATION}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cyan-900 text-white py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Why Choose Correct Steps?</h2>
            <div className="w-20 h-1 bg-teal-400 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 max-w-5xl mx-auto">
            <WhyCard
              num="1"
              title="Realistic Practice Tests"
              desc="Our tests are designed to mimic the real-world assessments used by top employers globally, ensuring you are fully prepared for actual test conditions."
            />
            <WhyCard
              num="2"
              title="Detailed Solutions"
              desc="Every question comes with a step-by-step explanation to ensure you understand the underlying concepts and learn from your mistakes."
            />
            <WhyCard
              num="3"
              title="Track Your Progress"
              desc="Identify your strengths and weaknesses with our comprehensive performance analytics, helping you target areas that need improvement."
            />
            <WhyCard
              num="4"
              title="Constantly Updated Content"
              desc="Our database is regularly updated to reflect the latest testing trends and formats, so you always practice with relevant material."
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16 lg:py-24" id="news">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-700 tracking-wide uppercase">Latest News</h2>
          </div>
          <div className="max-w-3xl mx-auto flex flex-col items-start text-left bg-transparent">
            <div className="w-full mb-6 relative">
              <img src={newImage} alt="Latest News" className="w-full h-auto object-cover shadow-sm" style={{ maxHeight: "420px" }} />
            </div>

            <div className="w-full">
              <h3 className="text-xl md:text-[22px] font-bold text-gray-900 mb-1">
                New: Prepare for the DAT Next Generation
              </h3>
              <p className="text-[12px] text-gray-600 mb-4 font-medium">October 13, 2025</p>

              <p className="text-[14px] text-gray-800 leading-relaxed mb-6 font-medium">
                Are you getting ready for the DAT Next Generation and want to perform at your absolute best? Aptitude-Test.com offers specialized practice materials that help you master every aspect of this modern cognitive ability assessment. The DAT Next Generation (Differential Aptitude Test) is an advanced cognitive ability assessment used by employers and public institutions to evaluate how well candidates can think logically, learn new concepts, and solve problems efficiently...
              </p>

              <a href="#" className="font-bold text-[14px] text-teal-600 hover:text-teal-400 transition-colors">
                Continue reading
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col md:flex-row w-full min-h-[450px] bg-teal-600">
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 text-white">
          <div className="max-w-md w-full">
            <h2 className="text-3xl md:text-[40px] leading-tight font-extrabold mb-6">Unlock Your Full Potential</h2>
            <p className="text-lg mb-10 leading-relaxed text-gray-100">
              Get full access to all our practice tests, interview guides, and assessment center exercises. Build your confidence and land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/auth/register/student" className="text-center rounded shadow-md bg-white text-teal-600 hover:bg-gray-100 transition-colors px-8 py-4 font-bold uppercase text-[13px] tracking-wider">
                Get Prep Access
              </Link>
              <button className="text-center rounded border-[3px] border-white hover:bg-white hover:text-teal-900 transition-colors px-8 py-4 font-bold text-white uppercase text-[13px] tracking-wider">
                Learn More
              </button>
            </div>
          </div>
        </div>
        <div
          className="w-full md:w-1/2 min-h-[350px] md:min-h-full"
          style={{
            backgroundImage: `url(${handshake})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </section>

      <footer className="bg-cyan-900 py-14 text-gray-100">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-teal-900 pb-10 mb-10">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Correct Steps" className="h-10 w-auto" />
              <div className="font-bold text-white text-xl uppercase tracking-wider">Correct Steps</div>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-[11px] font-bold uppercase tracking-wider text-gray-300">
              <a href="#" className="hover:text-white transition-colors">Affiliates</a>
              <a href="#" className="hover:text-white transition-colors">Terms and Conditions</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Links</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-gray-300 font-medium">
              &copy; {new Date().getFullYear()} Correct Steps. All rights reserved.
            </div>
            <div className="flex gap-3 opacity-60 text-2xl">
              <div className="flex items-center gap-2">
                <span className="w-12 h-8 bg-gray-500 rounded flex items-center justify-center text-[10px] text-white font-bold shadow-sm">VISA</span>
                <span className="w-12 h-8 bg-gray-500 rounded flex items-center justify-center text-[10px] text-white font-bold shadow-sm">MC</span>
                <span className="w-12 h-8 bg-gray-500 rounded flex items-center justify-center text-[10px] text-white font-bold shadow-sm">AMEX</span>
                <span className="w-12 h-8 bg-gray-500 rounded flex items-center justify-center text-[10px] text-white font-bold shadow-sm">PAYPAL</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors shadow-lg border border-gray-600 z-50"
        >
          <span className="transform -rotate-90 text-lg">➜</span>
        </button>
      </footer>
    </div>
  );
};

const WhyCard = ({ num, title, desc }) => (
  <div className="flex gap-6 items-start">
    <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded bg-transparent border-2 border-white/30 text-white font-bold text-2xl shadow-sm">
      {num}
    </div>
    <div>
      <h3 className="mb-3 text-[22px] font-bold text-white">{title}</h3>
      <p className="text-gray-200 leading-relaxed text-[15px]">{desc}</p>
    </div>
  </div>
);

export default LandingPage;