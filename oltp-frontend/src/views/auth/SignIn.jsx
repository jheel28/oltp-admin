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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
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
      message.error(error.message || "Login Failed.");
    }
  };

  return (
    <div className="mb-16 flex h-full w-full items-center justify-center px-2">
      <div className="mt-[8vh] w-full max-w-full flex-col items-center xl:max-w-[450px]">
        <div className="flex flex-col">
          <h1 className="mb-2 text-4xl font-extrabold text-navy-700 dark:text-white">
            The Correct Steps
          </h1>
          <p className="mb-8 text-sm font-medium text-gray-400">
            Professional Online Testing Platform
          </p>
          <h4 className="mb-6 text-2xl font-bold capitalize text-navy-700 dark:text-white">
            {roleFromUrl} Login
          </h4>
        </div>
        <form onSubmit={handleSignIn} className="w-full">
          <InputField
            variant="auth"
            extra="mb-3"
            label="Email*"
            placeholder="mail@example.com"
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInputField
            variant="auth"
            extra="mb-3"
            label="Password*"
            placeholder="Min. 8 characters"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="linear mt-4 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6">
          <p className="text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
            <Link
              to={
                roleFromUrl === "admin"
                  ? "/auth/register/admin"
                  : "/auth/register/student"
              }
              className="ml-1 font-bold text-brand-500 hover:text-brand-600"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
