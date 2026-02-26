import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "assets/img/Logo/correct.png";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found.");
      return;
    }

    const verify = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
        const response = await fetch(`${backendUrl}/api/v1/student/verify/${token}`);
        const data = await response.json();
        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully.");
          setTimeout(() => navigate("/auth/sign-in"), 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. The link may have expired.");
        }
      } catch {
        setStatus("error");
        setMessage("A network error occurred. Please try again.");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F4F7FE] dark:!bg-navy-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl dark:bg-navy-800 text-center">
        <img
          src={logo}
          alt="The Correct Steps"
          className="mx-auto mb-6 h-16 object-contain"
          onError={(e) => { e.target.style.display = "none"; }}
        />

        {status === "loading" && (
          <>
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <h2 className="text-xl font-bold text-navy-700 dark:text-white">Verifying your email...</h2>
            <p className="mt-2 text-sm text-gray-500">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-green-600">Email Verified!</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p>
            <p className="mt-3 text-xs text-gray-400">Redirecting to login in 3 seconds...</p>
            <Link
              to="/auth/sign-in"
              className="mt-4 inline-block rounded-xl bg-brand-500 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-600">Verification Failed</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p>
            <div className="mt-6 space-y-2">
              <ResendVerification />
              <Link
                to="/auth/sign-in"
                className="block text-sm font-medium text-brand-500 hover:text-brand-600"
              >
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleResend = async () => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/v1/student/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        setSent(true);
      } else {
        setError(data.message || "Failed to resend. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <p className="text-sm text-green-600 font-medium">
        Verification email sent! Check your inbox.
      </p>
    );
  }

  return (
    <div className="mt-4">
      <p className="mb-2 text-sm text-gray-500">Resend the verification email:</p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleResend}
          disabled={loading}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default VerifyEmail;