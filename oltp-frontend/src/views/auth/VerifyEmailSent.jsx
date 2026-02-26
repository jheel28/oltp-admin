import React from "react";
import { Link } from "react-router-dom";
import logo from "assets/img/Logo/correct.png";

const VerifyEmailSent = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F4F7FE] dark:!bg-navy-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl dark:bg-navy-800 text-center">
        <img
          src={logo}
          alt="The Correct Steps"
          className="mx-auto mb-6 h-16 object-contain"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-navy-700 dark:text-white">Check your inbox</h2>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          We sent a verification link to your email address. Click the link to activate your account.
          The link expires in 24 hours.
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Didn't receive it? Check your spam folder or request a new link from the login page.
        </p>
        <Link
          to="/auth/sign-in"
          className="mt-6 inline-block rounded-xl bg-brand-500 px-8 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailSent;