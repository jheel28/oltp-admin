const Footer = () => {
  return (
    <div className="flex w-full items-center justify-between px-1 pb-8 pt-3 lg:px-8 flex-row">
      <p className="text-center text-[10px] font-medium text-gray-600 md:text-sm whitespace-nowrap">
        ©{new Date().getFullYear()} The Correct Steps. All Rights Reserved.
      </p>
      <ul className="flex items-center justify-center gap-2 md:gap-6 ml-4">
        <li className="shrink-0">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="mailto:hello@simmmple.com"
            className="text-[10px] font-medium text-gray-600 hover:text-blue-500 md:text-sm whitespace-nowrap"
          >
            Support
          </a>
        </li>
        <li className="shrink-0">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://simmmple.com/licenses"
            className="text-[10px] font-medium text-gray-600 hover:text-blue-500 md:text-sm whitespace-nowrap"
          >
            License
          </a>
        </li>
        <li className="shrink-0">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://simmmple.com/terms-of-service"
            className="text-[10px] font-medium text-gray-600 hover:text-blue-500 md:text-sm whitespace-nowrap"
          >
            Terms of Use
          </a>
        </li>
        <li className="shrink-0">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://blog.horizon-ui.com/"
            className="text-[10px] font-medium text-gray-600 hover:text-blue-500 md:text-sm whitespace-nowrap"
          >
            Blog
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
