import InputField from "components/fields/InputField";
import { useContext, useState } from "react";
import { AuthContext } from "components/Auth-context";
import { message } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import PasswordInputField from "components/fields/PasswordInputField";
import Footer from "components/footer/Footer";
import logo from "assets/img/Logo/correct.png";

export default function SignIn() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roleFromUrl = (queryParams.get("role") || "student").toLowerCase();
  const isAdmin = roleFromUrl === "admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/${roleFromUrl}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      auth.login(data.userId, data.token, data.email, data.role);
      message.success("Logged in successfully");
      navigate(`/${data.role.toLowerCase()}`);
    } catch (error) {
      message.error(error.message || "Login failed.");
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
              <div className="mb-2 inline-flex items-center rounded-full bg-brand-50 px-3 py-1 dark:bg-navy-700">
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 dark:text-brand-400">
                  {isAdmin ? "Admin Portal" : "Student Portal"}
                </span>
              </div>
              <h4 className="mb-2 text-4xl font-bold text-navy-700 dark:text-white">
                Welcome back
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sign in to your {isAdmin ? "admin" : "student"} account to
                continue.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              <InputField
                variant="auth"
                label="Email"
                placeholder="mail@example.com"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PasswordInputField
                variant="auth"
                label="Password"
                placeholder="Min. 6 characters"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="submit"
                disabled={loading}
                className="linear mt-2 w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60 dark:bg-brand-400 dark:hover:bg-brand-300"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 space-y-3">
              <p className="text-sm font-medium text-navy-700 dark:text-gray-500">
                Don&apos;t have an account?{" "}
                <Link
                  to={isAdmin ? "/auth/register/admin" : "/auth/register/student"}
                  className="font-bold text-brand-500 hover:text-brand-600 dark:text-white"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="hidden items-center justify-center bg-[#F4F7FE] dark:bg-navy-900 md:flex md:w-[45%] lg:w-[50%]">
          <img
            src={logo}
            alt="The Correct Steps"
            className="max-h-[420px] max-w-[420px] object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}