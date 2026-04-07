import React from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "assets/img/Logo/correct.png";
import hero13 from "assets/img/hero/L13.jpg";
import hero9 from "assets/img/hero/L9.jpg";
import hero10 from "assets/img/hero/L10.jpg";
import hero11 from "assets/img/hero/L11.jpg";

const ARTICLES = [
  {
    id: 1,
    title: "How Employers Use Mechanical Aptitude Tests in Hiring",
    date: "March 4, 2026",
    image: hero13,
    excerpt: "If you are applying for a technical or mechanical job, you may be asked to take a mechanical aptitude test as part of the hiring process. For many candidates, this comes as a surprise. Unlike interviews or résumé reviews, these tests measure something different: your ability to understand how mechanical systems work...",
  },
  {
    id: 2,
    title: "The Importance of Visual-Spatial Reasoning",
    date: "February 28, 2026",
    image: hero9,
    excerpt: "Visual-spatial reasoning is the ability to mentally manipulate 2D and 3D figures. It is a critical skill for engineers, architects, and designers. In this article, we explore why this skill is highly valued and how you can develop it to excel in your career...",
  },
  {
    id: 3,
    title: "Mastering Data Interpretation for Competitive Exams",
    date: "February 15, 2026",
    image: hero10,
    excerpt: "Data interpretation is more than just reading charts—it's about extracting meaningful insights under time pressure. Whether it's GRE, GMAT, or a professional assessment, mastering these techniques can be a total game-changer for your final score...",
  },
  {
    id: 4,
    title: "Quantitative Aptitude: Beyond Basic Mathematics",
    date: "January 30, 2026",
    image: hero11,
    excerpt: "Many students confuse quantitative aptitude with simple arithmetic. However, it's actually a measure of logical thinking and numerical efficiency. We break down the most common types of problems and the shortcuts used by top performers...",
  },
];

const NewsArticlesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
            <span className="font-bold text-xl text-gray-800 tracking-tight">
              THE CORRECT STEPS
            </span>
          </Link>
          <button 
            onClick={() => navigate("/")}
            className="text-teal-600 font-bold hover:text-teal-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 text-center">
            Latest Articles & News
          </h1>
          <p className="text-lg text-gray-600 mb-12 text-center">
            Insights, updates, and guides to help you succeed in your career and assessments.
          </p>

          <div className="space-y-12">
            {ARTICLES.map((article) => (
              <article key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col md:flex-row hover:shadow-xl transition-shadow duration-300">
                <div className="md:w-5/12 lg:w-1/2 h-64 md:h-auto relative overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-contain p-2 transform hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="md:w-7/12 lg:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                  <span className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-2">
                    {article.date}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 text-base leading-relaxed mb-6 flex-grow">
                    {article.excerpt}
                  </p>
                  <button className="self-start text-gray-900 font-bold border-b-2 border-teal-500 hover:text-teal-600 transition-colors pb-1">
                    Read Full Article
                  </button>
                </div>
              </article>
            ))}
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

export default NewsArticlesPage;
