import React, { useState } from "react";
import { message } from "antd";
import { useParams, Link, useNavigate } from "react-router-dom";
import Footer from "components/footer/Footer";
import logo from "assets/img/Logo/correct.png";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordsMatch = newPassword !== "" && newPassword === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      message.error("Password must be at least 6 characters");
      return;
    }
    if (!passwordsMatch) {
      message.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/v1/student/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        message.success("Password reset successfully!");
        setTimeout(() => navigate("/auth/sign-in"), 3000);
      } else {
        message.error(data.message || "Failed to reset password. Please try again.");
      }
    } catch {
      message.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col dark:!bg-navy-900">
      <div className="flex flex-grow">
        <div className="flex w-full flex-col items-center justify-center px-6 py-12 md:w-[55%] lg:w-[50%]">
          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <h4 className="mb-2 text-3xl font-bold text-navy-700 dark:text-white">
                Reset Password
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your new password below.
              </p>
            </div>

            {success ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                  Password reset successful!
                </p>
                <p className="mt-2 text-xs text-green-700 dark:text-green-400">
                  Your password has been updated. You will be redirected to the sign-in page shortly.
                </p>
                <Link
                  to="/auth/sign-in"
                  className="mt-4 inline-block text-sm font-bold text-brand-500 hover:text-brand-600"
                >
                  Go to Sign In →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="new-password"
                    className="mb-1 ml-1 text-sm font-medium text-navy-700 dark:text-white"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-navy-700 outline-none transition focus:border-brand-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white dark:focus:border-brand-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="confirm-password"
                    className="mb-1 ml-1 text-sm font-medium text-navy-700 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy-700 outline-none transition dark:bg-navy-700 dark:text-white ${
                      confirmPassword !== ""
                        ? passwordsMatch
                          ? "border-green-500 focus:border-green-500"
                          : "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-brand-500 dark:border-navy-600 dark:focus:border-brand-400"
                    }`}
                  />
                  {confirmPassword !== "" && !passwordsMatch && (
                    <p className="mt-1 ml-1 text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !passwordsMatch}
                  className="linear mt-2 w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-400 dark:hover:bg-brand-300"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            <p className="mt-6 text-sm font-medium text-navy-700 dark:text-gray-500">
              Remember your password?{" "}
              <Link
                to="/auth/sign-in"
                className="font-bold text-brand-500 hover:text-brand-600 dark:text-white"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden items-center justify-center bg-[#F4F7FE] dark:bg-navy-900 md:flex md:w-[45%] lg:w-[50%]">
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
