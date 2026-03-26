import { Link } from "react-router-dom";

const CategoryCard = ({ imgSrc, title, link }) => (
  <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-1">
    <div className="h-44 overflow-hidden relative border-b border-gray-100">
      <img
        src={imgSrc}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
    </div>
    <div className="p-6 flex flex-col flex-grow items-center text-center">
      <h3 className="font-extrabold text-[17px] text-gray-900 mb-6">{title}</h3>
      <div className="mt-auto">
        <Link
          to={link}
          className="text-teal-600 text-[13px] font-bold flex items-center gap-2 group-hover:text-teal-400 tracking-wider"
        >
          PRACTICE{" "}
          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  </div>
);

export default CategoryCard;