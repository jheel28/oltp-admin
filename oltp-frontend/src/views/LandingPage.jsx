import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState, useCallback, useRef, memo } from "react";
import logo from "assets/img/Logo/correct.png";
import hero9 from "assets/img/hero/L9.jpg";
import hero10 from "assets/img/hero/L10.jpg";
import hero11 from "assets/img/hero/L11.jpg";
import hero13 from "assets/img/hero/L13.jpg";
import hero14 from "assets/img/hero/A1.jpg";
import T1 from "assets/img/hero/T1.jpg";
import T2 from "assets/img/hero/T2.jpg";
import T3 from "assets/img/hero/T3.jpg";
import T4 from "assets/img/hero/T4.jpg";
import T5 from "assets/img/hero/T5.jpg";
import {
  FaFacebook,
  FaYoutube,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { mechanicalSubjects } from "views/subjects/subjectData";
import CategoryCard from "components/common/CategoryCard";

const ROUTES = {
  COMMUNICATION: "/subjects/communication-aptitude",
};

const SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1280&q=60",
  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1280&q=60",
  "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1280&q=60",
  "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1280&q=60",
];

const SOCIAL_LINKS = [
  { href: "https://www.facebook.com/share/1CUY5UXzuV/", Icon: FaFacebook, label: "Facebook", hover: "hover:text-blue-400" },
  { href: "https://www.instagram.com/thecorrectsteps_official/", Icon: FaInstagram, label: "Instagram", hover: "hover:text-pink-400" },
  { href: "https://www.linkedin.com/company/the-correct-steps-official/", Icon: FaLinkedin, label: "LinkedIn", hover: "hover:text-blue-300" },
  { href: "https://youtube.com/@thecorrectsteps", Icon: FaYoutube, label: "YouTube", hover: "hover:text-red-400" },
  { href: "https://wa.me/919958800754", Icon: FaWhatsapp, label: "WhatsApp", hover: "hover:text-green-400" },
];

const NAV_LINKS = [
  { href: "#mechanical", label: "Mechanical Engineering" },
  { href: "#tests", label: "Aptitude Tests" },
  { href: "https://bingelearning.in", label: "Binge Learning", external: true },
  { href: "/news", label: "Articles and News" },
  { href: "#contact", label: "Contact Us" },
];

const OTHER_TESTS = [
  { title: "Verbal Ability", img: hero9 },
  { title: "Data Interpretation and Logical Reasoning", img: hero10 },
  { title: "Quantitative Aptitude", img: hero11 },
];

const RESEARCH_PAPERS = [
  { title: "Physics of Design", img: T1, slug: "physics-of-design" },
  { title: "Origami Art in Robotics", img: T2, slug: "origami-art-in-robotics" },
  { title: "Mathematics", img: T3, slug: "mathematics" },
  { title: "Flexure Joints and Mechanisms", img: T4, slug: "flexure-joints-and-mechanisms" },
  { title: "Chemistry for Materials Science", img: T5, slug: "chemistry-for-materials-science" },
];

const LATEST_ARTICLES = [
  {
    title: "How Employers Use Mechanical Aptitude Tests in Hiring",
    date: "March 4, 2026",
    excerpt: "If you are applying for a technical or mechanical job, you may be asked to take a mechanical aptitude test as part of the hiring process...",
    img: hero13
  },
  {
    title: "The Importance of Visual-Spatial Reasoning",
    date: "February 28, 2026",
    excerpt: "Visual-spatial reasoning is the ability to mentally manipulate 2D and 3D figures. It is a critical skill for engineers and architects...",
    img: hero9
  },
  {
    title: "Mastering Data Interpretation for Competitive Exams",
    date: "February 15, 2026",
    excerpt: "Data interpretation is more than just reading charts—it's about extracting meaningful insights under time pressure...",
    img: hero10
  }
];

const preloadImages = (srcs) => {
  srcs.forEach((src) => {
    const img = new window.Image();
    img.src = src;
  });
};

const NavLink = memo(({ href, label, onClick, external }) => {
  if (external) {
    return (
      <a
        href={href}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-teal-300 transition-colors uppercase tracking-wider"
      >
        {label}
      </a>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a
        href={href}
        onClick={onClick}
        className="hover:text-teal-300 transition-colors uppercase tracking-wider"
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      to={href}
      onClick={onClick}
      className="hover:text-teal-300 transition-colors uppercase tracking-wider"
    >
      {label}
    </Link>
  );
});

const SocialLink = memo(({ href, Icon, label, hover }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className={"text-gray-100 transition-colors text-xl " + hover}
  >
    <Icon />
  </a>
));

const WhyCard = memo(({ num, title, desc }) => (
  <div className="flex gap-6 items-start">
    <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded bg-transparent border-2 border-white/30 text-white font-bold text-2xl">
      {num}
    </div>
    <div>
      <h3 className="mb-3 text-[22px] font-bold text-white">{title}</h3>
      <p className="text-gray-200 leading-relaxed text-[15px]">{desc}</p>
    </div>
  </div>
));

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentArticle, setCurrentArticle] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const intervalRef = useRef(null);
  const articleIntervalRef = useRef(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get("role");
    if (role) {
      navigate("/auth/sign-in?role=" + role.toLowerCase(), { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    // Only preload the first image to drastically speed up initial paint
    preloadImages([SLIDER_IMAGES[0]]);
    
    // Defer downloading the other 3 massive slides until main page finishes
    const deferLoad = setTimeout(() => {
      preloadImages(SLIDER_IMAGES.slice(1));
    }, 4500);

    return () => clearTimeout(deferLoad);
  }, []);

  const startAutoplay = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 5000);
  }, []);

  useEffect(() => {
    startAutoplay();
    articleIntervalRef.current = setInterval(() => {
      setCurrentArticle((prev) => (prev + 1) % LATEST_ARTICLES.length);
    }, 6000);
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(articleIntervalRef.current);
    };
  }, [startAutoplay]);

  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > 8;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrolled]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((v) => !v), []);

  const goToSlide = useCallback(
    (index) => {
      setCurrentSlide(index);
      startAutoplay();
    },
    [startAutoplay]
  );

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen font-sans text-aptText bg-white">

      <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? "shadow-lg bg-white/95 backdrop-blur-sm" : "shadow-none bg-white"}`}>
        <div className="border-b border-gray-100">
          <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-2">
            <Link to="/" className="flex items-center gap-3 sm:gap-4 hover:opacity-90 transition-opacity">
              <img
                src={logo}
                alt="Correct Steps"
                className="h-10 sm:h-14 w-auto"
                fetchPriority="high"
              />
              <span className="font-bold text-lg sm:text-2xl text-gray-800 tracking-tight leading-tight">
                THE CORRECT STEPS
              </span>
            </Link>
            <div className="flex items-center gap-1.5 sm:gap-8">
              <div className="flex items-center gap-3 sm:gap-8 text-base md:text-lg lg:text-[18px] font-bold whitespace-nowrap">
                <Link 
                  to="/auth/user/sign-in" 
                  className="text-gray-800 hover:text-teal-600 transition-colors px-2 py-2"
                >
                  Log in
                </Link>
                <Link 
                  to="/auth/register/student" 
                  className="rounded-full bg-teal-600 hover:bg-teal-500 transition-all shadow-md px-5 sm:px-8 py-2 sm:py-3 text-white transform hover:-translate-y-0.5 active:translate-y-0 text-base md:text-lg lg:text-[19px]"
                >
                  Sign Up
                </Link>
              </div>
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-gray-700 hover:text-teal-600 transition-colors rounded"
                aria-label="Toggle Menu"
                aria-expanded={isMenuOpen}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className={`bg-cyan-900 overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 md:max-h-none opacity-0 md:opacity-100"}`}>
          <div className="container mx-auto px-6">
            <nav className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:gap-10 text-white text-base md:text-lg lg:text-[17px] font-bold py-6 md:py-4">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} onClick={closeMenu} external={link.external} />
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─────────────────────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden bg-gray-900"
        style={{ height: "80vh", minHeight: "500px", maxHeight: "800px" }}
      >
        {/* Slide backgrounds */}
        {SLIDER_IMAGES.map((img, index) => (
          <div
            key={index}
            aria-hidden={index !== currentSlide}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url(" + img + ")",
              backgroundSize: "cover",
              backgroundPosition: "center 25%",
              opacity: index === currentSlide ? 1 : 0,
              transition: "opacity 1.2s ease-in-out",
              willChange: "opacity",
            }}
          />
        ))}

        {/* Layered overlay: dark base + left-weighted gradient */}
        <div className="absolute inset-0 z-10" style={{ background: "rgba(8,24,32,0.4)" }} />
        <div
          className="absolute inset-0 z-10"
          style={{
            background: "linear-gradient(105deg, rgba(8,24,32,0.95) 0%, rgba(8,24,32,0.8) 35%, rgba(8,24,32,0.3) 65%, transparent 100%)",
          }}
        />
        {/* Mobile-only center overlay for better text contrast */}
        <div className="md:hidden absolute inset-0 z-10 bg-black/20" />

        {/* Content */}
        <div className="relative z-20 h-full container mx-auto px-6 sm:px-10 flex items-center justify-center md:justify-start text-center md:text-left">
          <div className="w-full md:w-[60%] max-w-2xl flex flex-col gap-0">

            <h1 className="mb-5 text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-lg">
              Smart Testing Platform<br className="hidden sm:block" /> for Serious Aspirants
            </h1>

            <p className="mb-2 text-lg sm:text-xl text-gray-100 font-medium leading-relaxed drop-shadow-md">
              Advanced test series with real-time analysis and performance insights.
            </p>
            <p className="mb-10 text-base sm:text-lg text-gray-200 leading-relaxed drop-shadow-md">
              Start with 2 free tests. Unlock full potential with premium access.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Link
                to="/auth/sign-in?role=student"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-teal-500 hover:bg-teal-400 transition-all duration-200 px-10 py-4 font-bold text-white text-sm tracking-widest uppercase shadow-xl hover:-translate-y-1 transform"
              >
                Get Started Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Slide indicators — repositioned to bottom-left aligned with content */}
        <div className="absolute bottom-8 left-0 right-0 z-30">
          <div className="container mx-auto px-6 sm:px-10 flex items-center gap-3">
            {SLIDER_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={"Go to slide " + (index + 1)}
                style={{ transition: "width 0.3s ease, opacity 0.3s ease" }}
                className={"h-[3px] rounded-full " + (index === currentSlide ? "bg-teal-400 w-10 opacity-100" : "bg-white/35 w-5 hover:bg-white/60")}
              />
            ))}

            {/* Slide counter removed */}
          </div>
        </div>
      </section>

      {/* Featured Topics */}
      <section className="py-20 bg-white border-t border-gray-200" id="research">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
            Featured Topics
          </h2>
          {/* Centered container with limited width to force 3+2 layout while keeping card size standard */}
          <div className="flex flex-wrap justify-center gap-6 max-w-[1000px] mx-auto">
            {RESEARCH_PAPERS.map((topic) => (
              <div
                key={topic.slug}
                className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[300px]"
              >
                <CategoryCard
                  imgSrc={topic.img}
                  title={topic.title}
                  link={`/subjects/mechanical/${topic.slug}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mechanical Engineering Tests */}
      <section className="py-20 bg-gray-50 border-t border-gray-200" id="mechanical">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
            Mechanical Engineering Practice Tests
          </h2>
          <div className="flex flex-wrap justify-center gap-6 max-w-[1280px] mx-auto">
            {mechanicalSubjects.map((subject) => (
              <div
                key={subject.slug}
                className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] max-w-[300px]"
              >
                <CategoryCard
                  imgSrc={subject.image || "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=500&q=60"}
                  title={subject.displayTitle}
                  link={"/subjects/mechanical/" + subject.slug}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interview and Exams Preparation */}
      <section className="py-20 bg-gray-50 border-t border-gray-200" id="tests">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
            Interview and Exams Preparation
          </h2>
          <div className="flex flex-wrap justify-center gap-6 max-w-[1280px] mx-auto">
            {OTHER_TESTS.map((test) => (
              <div
                key={test.title}
                className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] max-w-[300px]"
              >
                <CategoryCard
                  imgSrc={test.img}
                  title={test.title}
                  link={ROUTES.COMMUNICATION}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-cyan-900 text-white py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Why Choose THE CORRECT STEPS?
            </h2>
            <div className="w-20 h-1 bg-teal-400 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 max-w-5xl mx-auto">
            <WhyCard num="1" title="Realistic Practice Tests" desc="Our tests are designed to mimic the real-world assessments used by top employers globally, ensuring you are fully prepared for actual test conditions." />
            <WhyCard num="2" title="Detailed Solutions" desc="Every question comes with a step-by-step explanation to ensure you understand the underlying concepts and learn from your mistakes." />
            <WhyCard num="3" title="Track Your Progress" desc="Identify your strengths and weaknesses with our comprehensive performance analytics, helping you target areas that need improvement." />
            <WhyCard num="4" title="Constantly Updated Content" desc="Our database is regularly updated to reflect the latest testing trends and formats, so you always practice with relevant material." />
          </div>
        </div>
      </section>

      {/* Latest Articles Slider */}
      <section className="bg-gray-100 py-20 lg:py-24" id="news">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 uppercase tracking-wider">
              Latest Articles
            </h2>
            <Link to="/news" className="text-teal-600 font-bold hover:text-teal-700 flex items-center gap-2 transition-all">
              View All 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          
          <div className="relative max-w-7xl mx-auto min-h-[500px]">
            {LATEST_ARTICLES.map((article, index) => (
              <div 
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === currentArticle ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12 pointer-events-none"}`}
              >
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row h-full">
                  <div className="md:w-5/12 lg:w-1/2 h-64 md:h-auto overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img 
                      src={article.img} 
                      alt={article.title} 
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <div className="md:w-7/12 lg:w-1/2 p-8 md:p-14 flex flex-col justify-center">
                    <span className="text-teal-600 font-bold text-sm tracking-widest uppercase mb-4">
                      {article.date}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <Link 
                      to="/news" 
                      className="inline-flex items-center text-gray-900 font-bold border-b-2 border-teal-500 pb-1 self-start hover:text-teal-600 transition-colors"
                    >
                      Read Full Article
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3">
              {LATEST_ARTICLES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentArticle(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentArticle ? "bg-teal-600 w-8" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prep Access */}
      <section className="relative flex flex-col md:flex-row w-full min-h-[450px] bg-teal-600 overflow-hidden" id="prep">
        {/* Mobile Background (integrated) */}
        <div 
          className="md:hidden absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: "url(" + hero14 + ")",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 text-white relative z-10">
          <div className="max-w-md w-full text-center md:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
              Unlock Your Full Potential
            </h2>
            <p className="text-lg md:text-xl text-teal-50 mb-10 leading-relaxed font-medium">
              Get full access to all our practice tests, interview guides, and
              assessment center exercises. Build your confidence and land your
              dream job.
            </p>
            <div>
              <Link
                to="/auth/register/student"
                className="inline-block w-full sm:w-auto rounded-lg bg-white px-10 py-4 font-bold text-teal-600 hover:bg-gray-100 transition-all shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
              >
                GET PREP ACCESS
              </Link>
            </div>
          </div>
        </div>
        
        {/* Desktop Image Panel */}
        <div
          className="hidden md:block w-full md:w-1/2 min-h-[350px] md:min-h-full"
          style={{
            backgroundImage: "url(" + hero14 + ")",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="bg-cyan-900 text-gray-100 border-t border-white/10 relative overflow-hidden" id="contact">
        <div className="container mx-auto px-6 md:px-12 pt-20 pb-10 relative z-10">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 border-b border-white/10 pb-12 mb-8">
            
            {/* Column 1: Brand & About */}
            <div className="flex flex-col gap-6 lg:pr-6">
              <div className="flex items-center gap-4 mb-2">
                <img src={logo} alt="Correct Steps" className="h-12 w-auto drop-shadow-md" />
                <span className="font-extrabold text-white text-2xl tracking-tight leading-none">
                  THE CORRECT STEPS
                </span>
              </div>
              <p className="text-[15px] leading-relaxed text-gray-200 font-medium max-w-[320px] text-justify">
                A premium smart testing platform built for serious aspirants preparing for technical and aptitude assessments under competitive time constraints.
              </p>
              <div className="flex items-center gap-4 mt-6">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all hover:scale-110 shadow-lg"
                  >
                    <link.Icon className="text-lg" />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="flex flex-col gap-6">
              <h4 className="text-white font-extrabold text-base uppercase tracking-widest mb-2 border-b border-white/20 pb-4 inline-block self-start">Platform</h4>
              <nav className="flex flex-col gap-4">
                <a href="#mechanical" className="text-gray-200 hover:text-white transition-all flex items-center gap-2 group font-medium text-[15px]"><span className="text-teal-400 opacity-0 transform -translate-x-3 group-hover:translate-x-0 group-hover:opacity-100 transition-all font-bold">→</span> Mechanical Engineering</a>
                <a href="#tests" className="text-gray-200 hover:text-white transition-all flex items-center gap-2 group font-medium text-[15px]"><span className="text-teal-400 opacity-0 transform -translate-x-3 group-hover:translate-x-0 group-hover:opacity-100 transition-all font-bold">→</span> Aptitude Tests</a>
                <a href="https://bingelearning.in" target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-white transition-all flex items-center gap-2 group font-medium text-[15px]"><span className="text-teal-400 opacity-0 transform -translate-x-3 group-hover:translate-x-0 group-hover:opacity-100 transition-all font-bold">→</span> Binge Learning</a>
                <Link to="/news" className="text-gray-200 hover:text-white transition-all flex items-center gap-2 group font-medium text-[15px]"><span className="text-teal-400 opacity-0 transform -translate-x-3 group-hover:translate-x-0 group-hover:opacity-100 transition-all font-bold">→</span> Articles & News</Link>
              </nav>
            </div>

            {/* Column 3: Support */}
            <div className="flex flex-col gap-6">
              <h4 className="text-white font-extrabold text-base uppercase tracking-widest mb-2 border-b border-white/20 pb-4 inline-block self-start">Support</h4>
              <nav className="flex flex-col gap-4">
                <Link to="/auth/user/sign-in" className="text-gray-200 hover:text-white transition-all flex items-center gap-2 group font-medium text-[15px]"><span className="text-teal-400 opacity-0 transform -translate-x-3 group-hover:translate-x-0 group-hover:opacity-100 transition-all font-bold">→</span> Student Login</Link>
                <Link to="/auth/register/student" className="text-gray-200 hover:text-white transition-all flex items-center gap-2 group font-medium text-[15px]"><span className="text-teal-400 opacity-0 transform -translate-x-3 group-hover:translate-x-0 group-hover:opacity-100 transition-all font-bold">→</span> Create Account</Link>
                <a href="mailto:support@thecorrectsteps.com" className="text-gray-200 hover:text-white transition-all flex items-center gap-2 group font-medium text-[15px]"><span className="text-teal-400 opacity-0 transform -translate-x-3 group-hover:translate-x-0 group-hover:opacity-100 transition-all font-bold">→</span> Email Support</a>
              </nav>
            </div>

            {/* Column 4: Legal */}
            <div className="flex flex-col gap-6">
              <h4 className="text-white font-extrabold text-base uppercase tracking-widest mb-2 border-b border-white/20 pb-4 inline-block self-start">Legal</h4>
              <nav className="flex flex-col gap-4">
                <Link to="/terms" className="text-gray-200 hover:text-white transition-all flex items-center gap-2 group font-medium text-[15px]"><span className="text-teal-400 opacity-0 transform -translate-x-3 group-hover:translate-x-0 group-hover:opacity-100 transition-all font-bold">→</span> Terms & Conditions</Link>
                <Link to="/privacy" className="text-gray-200 hover:text-white transition-all flex items-center gap-2 group font-medium text-[15px]"><span className="text-teal-400 opacity-0 transform -translate-x-3 group-hover:translate-x-0 group-hover:opacity-100 transition-all font-bold">→</span> Privacy Policy</Link>
                <Link to="/refund" className="text-gray-200 hover:text-white transition-all flex items-center gap-2 group font-medium text-[15px]"><span className="text-teal-400 opacity-0 transform -translate-x-3 group-hover:translate-x-0 group-hover:opacity-100 transition-all font-bold">→</span> Refund & Cancellation Policy</Link>
              </nav>
            </div>

          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-xs text-gray-300 font-medium">
              &copy; {new Date().getFullYear()} THE CORRECT STEPS. All rights reserved.
            </p>
            <p className="text-xs text-gray-300 font-medium">
              Designed for Excellence.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 w-11 h-11 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-300 shadow-lg border border-gray-600 ${scrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

    </div>
  );
};

export default LandingPage;