import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "assets/img/Logo/correct.png";

const VerifyEmailSent = () => {
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [resendError, setResendError] = useState("");

  const handleResend = async () => {
    if (!resendEmail.trim()) {
      setResendError("Please enter your email address");
      return;
    }
    setResendLoading(true);
    setResendError("");
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/v1/student/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        setResendSent(true);
      } else {
        setResendError(data.message || "Failed to resend. Please try again.");
      }
    } catch {
      setResendError("Network error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cyan-900 dark px-4">
      <div className="w-full max-w-md text-center">
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
        <h2 className="text-xl font-bold text-white">Check your inbox</h2>
        <p className="mt-3 text-sm text-white/70">
          A verification link has been sent to your email address. Click it to activate your account.
          The link expires in 24 hours.
        </p>
        <p className="mt-2 text-xs text-white/50">
          Can't find it? Check your spam or junk folder.
        </p>

        <div className="mt-6">
          <Link
            to="/auth/sign-in"
            className="inline-block rounded-xl bg-teal-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-teal-500"
          >
            Go to Login
          </Link>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-left">
          <p className="mb-2 text-sm font-medium text-white/90">Didn't receive it? Resend:</p>
          {resendSent ? (
            <p className="text-sm font-medium text-green-600">Sent! Check your inbox again.</p>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleResend()}
                  placeholder="Your email address"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-50"
                >
                  {resendLoading ? "…" : "Send"}
                </button>
              </div>
              {resendError && <p className="mt-1 text-xs text-red-500">{resendError}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailSent;