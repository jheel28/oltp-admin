import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { mechanicalSubjects } from "./subjectData";
import CategoryCard from "components/common/CategoryCard";
import logo from "assets/img/Logo/correct.png";
import newImage from "assets/img/hero/1.jpg";

const MechanicalSubjectPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const subject = mechanicalSubjects.find((s) => s.slug === slug);
  const related = mechanicalSubjects.filter((s) => s.slug !== slug).slice(0, 4);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (!subject) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-700">Subject not found.</p>
        <Link to="/" className="mt-4 text-teal-600 underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-aptText bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <img src={logo} alt="Correct Steps" className="h-8 sm:h-10 w-auto" />
            <span className="font-bold text-lg sm:text-xl text-gray-800 tracking-tight">
              Correct Steps
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/auth/user/sign-in"
              className="text-gray-700 hover:text-teal-600 transition-colors text-sm font-semibold px-2 py-2"
            >
              Log in
            </Link>
            <Link
              to="/auth/register/student"
              className="rounded-full bg-teal-600 hover:bg-teal-500 transition-colors px-5 py-2 text-white text-sm font-bold shadow-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-cyan-900 py-16 md:py-24 text-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-sm text-teal-300 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-teal-400">
            Mechanical Engineering Practice Tests
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3">
            {subject.title}
          </h1>
          {subject.subtitle && (
            <p className="text-lg text-teal-200 mb-4">{subject.subtitle}</p>
          )}
          <p className="text-xl text-gray-100 mb-4 max-w-2xl">{subject.hero}</p>
          <p className="text-base text-gray-300 max-w-2xl">{subject.heroSub}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/auth/register/student"
              className="inline-block rounded bg-teal-500 hover:bg-teal-400 transition-colors px-8 py-3 font-bold text-white text-sm tracking-wide text-center shadow"
            >
              START PRACTICE NOW
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
          <SectionHeading>About the Subject</SectionHeading>
          <p className="text-gray-700 text-base leading-relaxed mt-4">{subject.about}</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <SectionHeading>What You Will Master</SectionHeading>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subject.masterPoints.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white text-[10px] font-bold">
                  ✓
                </span>
                <span className="text-sm text-gray-700 font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <SectionHeading>Topics Covered</SectionHeading>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {subject.topics.map((topic, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                <span className="text-sm text-gray-700">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <SectionHeading>Test Series Structure</SectionHeading>
              <ul className="mt-5 flex flex-col gap-3">
                {subject.testStructure.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-600" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeading>Platform Features</SectionHeading>
              <ul className="mt-5 flex flex-col gap-3">
                {subject.platformFeatures.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                    <span className="text-sm text-gray-700">{item}</span>
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
          <p className="mt-4 text-gray-700 text-base">{subject.whoShouldEnroll}</p>
        </div>
      </section>

      <section className="bg-teal-600 py-16">
        <div className="container mx-auto px-6 max-w-3xl text-center text-white">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-200">
            Subscription
          </p>
          <h2 className="text-4xl font-extrabold mb-2">{subject.price}</h2>
          <p className="text-teal-100 text-sm mb-8">(approximately $3.6 USD)</p>
          <p className="text-lg font-medium text-white mb-8 max-w-xl mx-auto">{subject.cta}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth/register/student"
              className="rounded bg-white text-teal-700 hover:bg-gray-100 transition-colors px-10 py-4 font-bold uppercase text-sm tracking-wider shadow"
            >
              Start Your Test Series Now
            </Link>
            <Link
              to="/"
              className="rounded border-2 border-white hover:bg-white hover:text-teal-700 transition-colors px-10 py-4 font-bold text-white uppercase text-sm tracking-wider"
            >
              View All Subjects
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8">More Subjects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((s) => (
                <CategoryCard
                  key={s.slug}
                  imgSrc={newImage}
                  title={s.displayTitle}
                  link={`/subjects/mechanical/${s.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="bg-cyan-900 py-10 text-gray-300">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Correct Steps" className="h-8 w-auto" />
            <span className="font-bold text-white text-base uppercase tracking-wide">
              Correct Steps
            </span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Correct Steps. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const SectionHeading = ({ children }) => (
  <h2 className="text-2xl font-extrabold text-gray-900">{children}</h2>
);

export default MechanicalSubjectPage;