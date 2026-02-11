import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "assets/img/Logo/correct.png";
import { FaGraduationCap, FaUniversity, FaCheckCircle, FaChartLine, FaClock } from "react-icons/fa";
import { useEffect } from "react";

const LandingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const role = queryParams.get("role");
        if (role) {
            // Redirect to sign-in with the role preserved
            navigate(`/auth/sign-in?role=${role.toLowerCase()}`, { replace: true });
        }
    }, [location, navigate]);

    return (
        <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900">
            {/* Header/Navbar */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Correct Steps" className="h-10 w-auto" />
                        <span className="text-xl font-bold tracking-tight text-brand-500">Correct Steps</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 font-medium">
                        <a href="#features" className="hover:text-brand-500 transition-colors">Features</a>
                        <a href="#about" className="hover:text-brand-500 transition-colors">About</a>
                        <Link to="/auth/login-role" className="bg-brand-500 text-white px-6 py-2 rounded-full font-bold hover:bg-brand-600 transition-all shadow-lg hover:shadow-brand-200">
                            Login
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-navy-700 md:text-7xl">
                        Professional Online <br />
                        <span className="text-brand-500">Testing Platform</span>
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 md:text-xl">
                        The most robust, dynamic, and easy-to-use platform for Universities to conduct tests and Students to achieve excellence.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link to="/auth/login-role" className="w-full rounded-full bg-brand-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-brand-200 transition-all hover:bg-brand-600 hover:scale-105 sm:w-auto">
                            Get Started Now
                        </Link>
                        <Link to="/auth/register" className="w-full rounded-full border-2 border-brand-500 px-8 py-4 text-lg font-bold text-brand-500 transition-all hover:bg-brand-50 sm:w-auto">
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-gray-50 py-24">
                <div className="container mx-auto px-6">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-navy-700 md:text-4xl">Why Choose Correct Steps?</h2>
                        <div className="mx-auto h-1.5 w-20 rounded-full bg-brand-500"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                        <FeatureCard
                            icon={<FaClock className="text-brand-500" />}
                            title="Dynamic Timers"
                            description="Set custom durations for every test. Accurate to the second with automated submission."
                        />
                        <FeatureCard
                            icon={<FaChartLine className="text-brand-500" />}
                            title="Instant Results"
                            description="Real-time feedback and detailed score analysis for both students and universities."
                        />
                        <FeatureCard
                            icon={<FaCheckCircle className="text-brand-500" />}
                            title="Proctored Security"
                            description="Secure testing environment designed to maintain academic integrity and trust."
                        />
                    </div>
                </div>
            </section>

            {/* Role Sections */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col gap-16 md:flex-row">
                        <div className="flex-1 rounded-3xl bg-navy-700 p-12 text-white shadow-2xl transition-transform hover:-translate-y-2">
                            <FaUniversity className="mb-6 text-5xl text-brand-400" />
                            <h3 className="mb-4 text-3xl font-bold">For Universities</h3>
                            <p className="mb-8 text-navy-100 opacity-80">
                                Manage batches, create dynamic question papers, and monitor student performance with our advanced dashboard.
                            </p>
                            <Link to="/auth/register" className="inline-block font-bold text-brand-400 hover:text-brand-300">
                                Conduct a Test &rarr;
                            </Link>
                        </div>
                        <div className="flex-1 rounded-3xl bg-brand-500 p-12 text-white shadow-2xl transition-transform hover:-translate-y-2">
                            <FaGraduationCap className="mb-6 text-5xl" />
                            <h3 className="mb-4 text-3xl font-bold">For Students</h3>
                            <p className="mb-8 opacity-80">
                                Access assigned tests, practice with mock papers, and track your progress toward your career goals.
                            </p>
                            <Link to="/auth/register" className="inline-block font-bold hover:underline">
                                Start Learning &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-navy-800 py-12 text-white">
                <div className="container mx-auto px-6 text-center">
                    <img src={logo} alt="Correct Steps" className="mx-auto mb-6 h-12 w-auto grayscale brightness-200" />
                    <p className="mb-4 opacity-70">&copy; 2026 Correct Steps. All rights reserved.</p>
                    <div className="flex justify-center gap-6 opacity-50 text-sm">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Contact Us</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-lg transition-all hover:border-brand-500 hover:shadow-brand-100">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-3xl transition-colors group-hover:bg-brand-500 group-hover:text-white">
            {icon}
        </div>
        <h4 className="mb-3 text-xl font-bold text-navy-700">{title}</h4>
        <p className="text-gray-500">{description}</p>
    </div>
);

export default LandingPage;
