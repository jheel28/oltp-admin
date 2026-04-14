import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 px-4 pb-8 pt-3 md:flex-row lg:px-8">
      <p className="text-center text-[10px] font-medium text-white/60 md:text-sm">
        ©{new Date().getFullYear()} THE CORRECT STEPS. All Rights Reserved.
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        <li>
          <Link
            to="/contact"
            className="text-[10px] font-medium text-white/60 hover:text-teal-400 md:text-sm"
          >
            Support
          </Link>
        </li>
        <li>
          <Link
            to="/privacy"
            className="text-[10px] font-medium text-white/60 hover:text-teal-400 md:text-sm"
          >
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link
            to="/terms"
            className="text-[10px] font-medium text-white/60 hover:text-teal-400 md:text-sm"
          >
            Terms of Use
          </Link>
        </li>
        <li>
          <Link
            to="/refund"
            className="text-[10px] font-medium text-white/60 hover:text-teal-400 md:text-sm"
          >
            Refund Policy
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
