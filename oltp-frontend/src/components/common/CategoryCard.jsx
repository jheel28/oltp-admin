import { Link } from "react-router-dom";

const CategoryCard = ({ imgSrc, title, link }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-1">
    <div className="aspect-[16/10] overflow-hidden relative border-b border-gray-100 bg-gray-50">
      <img
        src={imgSrc}
        alt={title}
        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
    </div>
    <div className="p-3 sm:p-4 flex flex-col flex-grow items-center text-center">
      <h3 className="font-bold text-base sm:text-[16px] text-gray-900 mb-1 sm:mb-1.5 leading-tight flex items-center justify-center min-h-[2.8rem]">
        {title}
      </h3>
      <div className="mt-0 pb-1">
        <Link
          to={link}
          className="inline-flex items-center gap-1.5 text-teal-600 text-[12px] font-bold hover:text-teal-400 transition-colors tracking-wider group/link"
        >
          PRACTICE{" "}
          <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  </div>
);

export default CategoryCard;