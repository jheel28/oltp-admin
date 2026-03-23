import InputField from "components/fields/InputField";
import { useContext, useState } from "react";
import { AuthContext } from "components/Auth-context";
import { message } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Footer from "components/footer/Footer";
import logo from "assets/img/Logo/correct.png";

export default function SignIn() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roleFromUrl = (queryParams.get("role") || "student").toLowerCase();
  const isAdmin = roleFromUrl === "admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setUnverifiedEmail(null);
    setResendSent(false);

    if (!email.trim()) {
      message.error("Please enter your email");
      return;
    }
    if (!password) {
      message.error("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(
        `${backendUrl}/api/v1/${roleFromUrl}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 403 && data.message?.includes("verify your email")) {
          setUnverifiedEmail(email.trim());
        } else {
          throw new Error(data.message || "Login failed");
        }
        return;
      }
      auth.login(data.userId, data.token, data.email, data.role);
      message.success("Logged in successfully");
      navigate(`/${data.role.toLowerCase()}`);
    } catch (error) {
      message.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    setResendLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/v1/student/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: unverifiedEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        setResendSent(true);
        message.success("Verification email sent");
      } else {
        message.error(data.message || "Failed to resend");
      }
    } catch {
      message.error("Network error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-cyan-900">
      <div className="flex flex-grow">
        <div className="flex w-full flex-col items-center justify-center px-6 py-12 md:w-[55%] lg:w-[50%]">
          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <div className="mb-2 inline-flex items-center rounded-full bg-white/10 px-3 py-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">
                  {isAdmin ? "Admin Portal" : "Student Portal"}
                </span>
              </div>
              <h4 className="mb-2 text-4xl font-bold text-white">Welcome back</h4>
              <p className="text-sm text-white/70">
                Sign in to your {isAdmin ? "admin" : "student"} account to continue.
              </p>
            </div>

            {unverifiedEmail && (
              <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                <p className="text-sm font-semibold text-yellow-800">Email not verified</p>
                <p className="mt-1 text-xs text-yellow-700">
                  Please verify your email address before logging in. Check your inbox for the verification link.
                </p>
                {resendSent ? (
                  <p className="mt-2 text-xs font-medium text-green-600">Verification email sent! Check your inbox.</p>
                ) : (
                  <button
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="mt-2 text-xs font-semibold text-teal-400 hover:underline disabled:opacity-50"
                  >
                    {resendLoading ? "Sending..." : "Resend verification email"}
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              <InputField
                variant="auth"
                label="Email"
                placeholder="mail@example.com"
                id="email"
                type="email"
                extra="text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex flex-col">
                <label htmlFor="password" class="mb-1 ml-1 text-sm font-medium text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {!isAdmin && (
                <div className="flex justify-end">
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm font-medium text-teal-400 hover:text-teal-300"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="linear mt-2 w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-teal-500 active:bg-teal-700 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6">
              <p className="text-sm font-medium text-white/70">
                Don't have an account?{" "}
                <Link
                  to={isAdmin ? "/auth/register/admin" : "/auth/register/student"}
                  className="font-bold text-teal-400 hover:text-teal-300"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="hidden items-center justify-center bg-gradient-to-br from-cyan-950 via-teal-950 to-cyan-900 md:flex md:w-[45%] lg:w-[50%] relative overflow-hidden">
          {/* Decorative radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
          
          <div className="relative z-10 flex flex-col items-center text-center p-12">
            <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
              <img
                src={logo}
                alt="The Correct Steps"
                className="max-h-[320px] w-auto object-contain drop-shadow-[0_20px_50px_rgba(20,184,166,0.3)]"
              />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">The Correct Steps</h2>
            <p className="text-teal-400/80 text-lg font-medium max-w-sm">
              Empowering your journey to excellence with every step you take.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}