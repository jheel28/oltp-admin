import InputField from "components/fields/InputField";
import { useContext, useState } from "react";
import { AuthContext } from "components/Auth-context";
import { message } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import PasswordInputField from "components/fields/PasswordInputField";

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
    <div className="flex min-h-screen w-full flex-col justify-center xl:max-w-[420px]">
      <div className="">
        <h4 className="mb-1 text-3xl font-bold capitalize text-navy-700 dark:text-white">
          {isAdmin ? "Admin" : "Student"} Sign In
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your credentials to access your dashboard.
        </p>
      </div>

      <form onSubmit={handleSignIn}>
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email"
          placeholder="mail@example.com"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInputField
          variant="auth"
          extra="mb-6"
          label="Password"
          placeholder="Min. 6 characters"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="linear w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60 dark:bg-brand-400 dark:hover:bg-brand-300"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-5">
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
  );
}
