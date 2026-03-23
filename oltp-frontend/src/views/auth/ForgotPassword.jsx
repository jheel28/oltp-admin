import React, { useState } from "react";
import { message } from "antd";
import { Link } from "react-router-dom";
import Footer from "components/footer/Footer";
import logo from "assets/img/Logo/correct.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      message.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/v1/student/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        setSent(true);
        message.success("Reset link sent! Check your email.");
      } else {
        message.error(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      message.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-cyan-900">
      <div className="flex flex-grow">
        <div className="flex w-full flex-col items-center justify-center px-6 py-12 md:w-[55%] lg:w-[50%]">
          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <h4 className="mb-2 text-3xl font-bold text-white">
                Forgot Password
              </h4>
              <p className="text-sm text-white/70">
                Enter your registered email address and we'll send you a link to reset your password.
              </p>
            </div>

            {sent ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                  Reset link sent!
                </p>
                <p className="mt-2 text-xs text-green-700 dark:text-green-400">
                  If an account with that email exists, you'll receive a password reset link shortly.
                  Please check your inbox (and spam folder).
                </p>
                <p className="mt-4 text-xs text-gray-500">
                  Didn't receive it?{" "}
                  <button
                    onClick={() => setSent(false)}
                    className="font-semibold text-brand-500 hover:underline"
                  >
                    Try again
                  </button>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="reset-email"
                    className="mb-1 ml-1 text-sm font-medium text-white"
                  >
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    placeholder="mail@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="linear mt-2 w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-teal-500 active:bg-teal-700 disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}

            <p className="mt-6 text-sm font-medium text-white/70">
              Remember your password?{" "}
              <Link
                to="/auth/sign-in"
                className="font-bold text-teal-400 hover:text-teal-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden items-center justify-center bg-white/5 md:flex md:w-[45%] lg:w-[50%]">
          <img
            src={logo}
            alt="The Correct Steps"
            className="max-h-[420px] max-w-[420px] object-contain"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
