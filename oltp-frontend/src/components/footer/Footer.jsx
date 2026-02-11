const Footer = () => {
  return (
    <div className="flex w-full flex-col items-start justify-start px-1 pb-10 pt-3 lg:px-0 xl:flex-row xl:items-center xl:gap-8">
      <p className="mb-2 text-left text-sm font-medium text-gray-400 sm:mb-0 md:text-base">
        ©{new Date().getFullYear()} Correct Steps Consultancy. All Rights Reserved.
      </p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <a
          href="#"
          className="text-xs font-medium text-gray-400 hover:text-brand-500 transition-colors duration-200 md:text-sm"
        >
          Support
        </a>
        <a
          href="#"
          className="text-xs font-medium text-gray-400 hover:text-brand-500 transition-colors duration-200 md:text-sm"
        >
          License
        </a>
        <a
          href="#"
          className="text-xs font-medium text-gray-400 hover:text-brand-500 transition-colors duration-200 md:text-sm"
        >
          Terms of Use
        </a>
        <a
          href="#"
          className="text-xs font-medium text-gray-400 hover:text-brand-500 transition-colors duration-200 md:text-sm"
        >
          Blog
        </a>
      </div>
    </div>
  );
};

export default Footer;
