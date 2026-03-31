import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import logo from "assets/img/Logo/correct.png";
import hero10 from "assets/img/hero/L10.jpg";

const CommunicationAptitudePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bgImageFromState = location.state?.bgImage;
  const heroBgImage = bgImageFromState || hero10;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen font-sans text-aptText bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <Link to="/" className="flex items-center gap-3 sm:gap-4">
            <img src={logo} alt="Correct Steps" className="h-10 sm:h-12 w-auto" />
            <span className="font-bold text-lg sm:text-2xl text-gray-800 tracking-tight">
              THE CORRECT STEPS
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-6 text-sm sm:text-base font-bold">
              <Link 
                to="/auth/user/sign-in" 
                className="text-gray-800 hover:text-teal-600 transition-colors px-1 py-2"
              >
                Log in
              </Link>
              <Link 
                to="/auth/register/student" 
                className="rounded-full bg-teal-600 hover:bg-teal-500 transition-all shadow-md px-5 sm:px-8 py-2 sm:py-3 text-white transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section 
        className="relative py-16 md:py-24 text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${heroBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-sm text-teal-300 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-teal-400">
            Interview & Exams Preparation 
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            Communication, Aptitude &amp; Career Development Program
          </h1>
          <p className="text-xl text-gray-100 mb-3 max-w-2xl">
            Build communication excellence, analytical thinking, and job-ready personality.
          </p>
          <p className="text-base text-gray-300 max-w-2xl">
            Develop the essential skills required to succeed in interviews, professional
            environments, and competitive career paths. This program is designed to transform
            students into confident communicators, logical thinkers, and industry-ready
            professionals.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/auth/register/student"
              className="inline-block rounded bg-teal-500 hover:bg-teal-400 transition-colors px-8 py-3 font-bold text-white text-sm tracking-wide text-center shadow"
            >
              START YOUR JOURNEY
            </Link>
            <Link
              to="/auth/user/sign-in"
              className="inline-block rounded border-2 border-white/40 hover:border-white transition-colors px-8 py-3 font-bold text-white text-sm tracking-wide text-center"
            >
              LOG IN TO CONTINUE
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <SectionHeading>About the Program</SectionHeading>
          <p className="mt-4 text-gray-900 text-base leading-relaxed font-medium">
            This program is a comprehensive blend of Verbal Ability, Quantitative Aptitude,
            Logical Reasoning, English Proficiency, and Personality Development, designed
            specifically to help students crack interviews and secure job opportunities.
          </p>
          <p className="mt-3 text-gray-900 text-base leading-relaxed font-medium">
            In today's competitive environment, technical skills alone are not sufficient.
            Employers look for candidates who can communicate effectively, think critically,
            and present themselves confidently. This program bridges that gap by combining
            analytical training with real-world communication, structured practice, and expert
            mentorship.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <SectionHeading>Core Learning Areas</SectionHeading>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <CoreAreaCard
              number="1"
              title="Verbal Ability"
              description="Develop strong command over the English language to communicate effectively in professional environments."
              points={[
                "Reading comprehension and interpretation",
                "Vocabulary building and contextual usage",
                "Sentence correction and structure",
                "Para jumbles and logical sequencing",
                "Verbal reasoning and communication clarity",
              ]}
            />
            <CoreAreaCard
              number="2"
              title="Data Interpretation & Logical Reasoning"
              description="Enhance your ability to analyze data, identify patterns, and solve real-world logical problems."
              points={[
                "Data analysis using charts, graphs, and tables",
                "Logical puzzles and pattern recognition",
                "Analytical and critical reasoning",
                "Case-based problem solving",
                "Decision-making frameworks",
              ]}
            />
            <CoreAreaCard
              number="3"
              title="Quantitative Aptitude"
              description="Strengthen mathematical and analytical skills required for problem-solving in interviews and professional roles."
              points={[
                "Arithmetic (Percentages, Profit & Loss, Time & Work)",
                "Algebra and equations",
                "Number systems",
                "Ratio and proportion",
                "Speed, time, and distance",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <SectionHeading>Additional Skill Development Modules</SectionHeading>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <ModuleCard
              title="English Grammar & Communication"
              items={[
                "Grammar fundamentals and sentence formation",
                "Spoken English and fluency improvement",
                "Professional communication (emails, meetings, presentations)",
                "Business communication and workplace interaction",
              ]}
            />
            <ModuleCard
              title="Personality Development"
              items={[
                "Confidence building and self-presentation",
                "Body language and professional etiquette",
                "Public speaking and articulation",
                "Leadership and interpersonal skills",
                "Time management and productivity",
              ]}
            />
            <ModuleCard
              title="Literature & Language Understanding"
              items={[
                "Understanding tone, context, and expression",
                "Analytical reading skills",
                "Interpretation of written communication",
                "Enhancing clarity, articulation, and depth in communication",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <SectionHeading>Interview Preparation &amp; Career Support</SectionHeading>
          <p className="mt-3 text-gray-900 text-sm font-medium">
            This program is strongly focused on real interview readiness and placement success.
          </p>
          <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Resume and CV building",
              "HR and technical interview preparation",
              "Communication-based interview training",
              "Real-world interview scenarios",
              "Confidence and personality assessment",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white text-[10px] font-bold">
                  ✓
                </span>
                <span className="text-sm text-gray-900 font-semibold">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <SectionHeading>Mock Interviews with Industry Mentors &amp; Professors</SectionHeading>
          <p className="mt-4 text-gray-900 text-base leading-relaxed font-medium">
            One-on-one mock interviews conducted by industry professionals and experienced
            professors. These mock interviews simulate actual placement environments, ensuring
            students are fully prepared and confident.
          </p>
          <ul className="mt-5 flex flex-col gap-2">
            {[
              "Exposure to real hiring scenarios and expectations",
              "Personalized feedback on communication, technical responses, and personality",
              "Evaluation based on industry standards",
              "Continuous improvement through multiple interview rounds",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                <span className="text-sm text-gray-900 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <SectionHeading>Test Series Structure</SectionHeading>
              <ul className="mt-5 flex flex-col gap-3">
                {[
                  "MCQs: Concept-based assessment",
                  "MSQs: Multi-dimensional thinking",
                  "Numerical Problems: Analytical problem-solving",
                  "Section-wise tests for Verbal, Aptitude, and Reasoning",
                  "Full-length mock tests simulating real interview environments",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-600" />
                    <span className="text-sm text-gray-900 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeading>Platform Features</SectionHeading>
              <ul className="mt-5 flex flex-col gap-3">
                {[
                  "Real-time performance analytics",
                  "Detailed solutions and explanations",
                  "Progress tracking and improvement insights",
                  "Interview-oriented question patterns",
                  "Industry-relevant scenarios",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                    <span className="text-sm text-gray-900 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <SectionHeading>Who Should Enroll</SectionHeading>
          <ul className="mt-5 flex flex-col gap-2">
            {[
              "Students preparing for placements",
              "Fresh graduates seeking job opportunities",
              "Individuals aiming to improve communication skills",
              "Candidates preparing for aptitude-based interviews",
              "Anyone looking to build a strong professional personality",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-600" />
                <span className="text-sm text-gray-900 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-teal-600 py-16">
        <div className="container mx-auto px-6 max-w-3xl text-center text-white">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-200">
            Subscription
          </p>
          <h2 className="text-4xl font-extrabold mb-2">₹199/month</h2>
          <p className="text-teal-100 text-sm mb-8">(approximately $2.1 USD)</p>
          <p className="text-lg font-medium text-white mb-8 max-w-xl mx-auto">
            Develop communication skills, sharpen your analytical abilities, gain real interview
            exposure through expert mentorship, and build the confidence required to secure your
            career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth/register/student"
              className="rounded bg-white text-teal-700 hover:bg-gray-100 transition-colors px-10 py-4 font-bold uppercase text-sm tracking-wider shadow"
            >
              Start Your Learning Journey Now
            </Link>
            <Link
              to="/"
              className="rounded border-2 border-white hover:bg-white hover:text-teal-700 transition-colors px-10 py-4 font-bold text-white uppercase text-sm tracking-wider"
            >
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-cyan-900 py-12 text-gray-300">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <img src={logo} alt="Correct Steps" className="h-10 sm:h-12 w-auto" />
            <span className="font-bold text-white text-lg sm:text-2xl uppercase tracking-tight">
              THE CORRECT STEPS
            </span>
          </div>
          <p className="text-sm font-medium">
            &copy; {new Date().getFullYear()} THE CORRECT STEPS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const SectionHeading = ({ children }) => (
  <h2 className="text-2xl font-extrabold text-gray-900">{children}</h2>
);

const CoreAreaCard = ({ number, title, description, points }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-900 text-white font-bold text-lg">
        {number}
      </div>
      <h3 className="font-bold text-gray-900 text-base">{title}</h3>
    </div>
    <p className="text-sm text-gray-800 font-medium">{description}</p>
    <ul className="flex flex-col gap-1.5">
      {points.map((p, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
          <span className="text-sm text-gray-800">{p}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ModuleCard = ({ title, items }) => (
  <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
    <h3 className="font-bold text-gray-900 text-sm mb-3">{title}</h3>
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600" />
          <span className="text-sm text-gray-800">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default CommunicationAptitudePage;