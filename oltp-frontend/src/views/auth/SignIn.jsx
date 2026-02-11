import InputField from "components/fields/InputField";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "components/Auth-context";
import { message } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import PasswordInputField from "components/fields/PasswordInputField";

export default function SignIn() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get("role") || "student";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(initialRole);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // Update role if query parameter changes
  useEffect(() => {
    const roleParam = queryParams.get("role");
    if (roleParam) {
      setRole(roleParam);
    }
  }, [location.search]);
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!role) {
      message.error("Please select a role");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/${role.toLowerCase()}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Login failed with status: ${response.status}`);
      }

      auth.login(data.userId, data.token, data.email, data.role);
      message.success("Logged in successfully");
      setTimeout(() => {
        navigate(`/${data.role.toLowerCase()}`);
      });
      console.log("Sign in successful");
    } catch (error) {
      message.error(error.message || "Login Failed. Please check Email and Password Again.");
      console.error("Error signing in:", error.message);
    }
  };
  const roleFromUrl = (queryParams.get("role") || "student").toLowerCase();
  const isStudentOnly = roleFromUrl === "student";
  const isAdminOnly = roleFromUrl === "admin";
  const isSuperAdminOnly = roleFromUrl === "superadmin";
  const isSpecificRole = isStudentOnly || isAdminOnly || isSuperAdminOnly;

  return (
    <div className="mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[8vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[450px]">
        <div className="flex flex-col">
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-navy-700 dark:text-white md:text-5xl">
            Correct Steps
          </h1>
          <p className="mb-8 text-sm font-medium text-gray-400 dark:text-gray-500 md:text-base">
            Professional Online Testing Platform
          </p>
          <h4 className="mb-6 text-2xl font-bold text-navy-700 dark:text-white">
            {isStudentOnly ? "Student Login" : isAdminOnly ? "University Login" : isSuperAdminOnly ? "Super Admin Login" : "Sign In"}
          </h4>
        </div>
        <form onSubmit={handleSignIn} className="w-full">

          {/* Email */}
          <InputField
            variant="auth"
            extra="mb-3"
            label="Email*"
            placeholder="mail@example.com"
            id="email"
            type="text"
            value={email}
            onChange={handleEmailChange}
          />

          {/* Password */}
          <PasswordInputField
            variant="auth"
            extra="mb-3"
            label="Password*"
            placeholder="Min. 8 characters"
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          {/* Checkbox */}
          <div className="mb-4 flex items-center justify-between px-2">
            <a
              className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              href=" "
            >
              Forgot Password?
            </a>
          </div>


          {/* Role Selection - Only show if NO specific role is provided */}
          {!isSpecificRole && (
            <div className="mb-6 flex flex-col">
              <label className="mb-3 block text-sm font-medium text-navy-700 dark:text-white">
                Login as:
              </label>
              <div className="flex flex-wrap gap-4">
                <label className={`flex cursor-pointer items-center rounded-xl border-2 px-4 py-2 transition-all duration-200 ${role === 'admin' ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-400/10' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={role === "admin"}
                    onChange={handleRoleChange}
                    className="hidden"
                  />
                  <span className={`text-sm font-medium ${role === 'admin' ? 'text-brand-500' : 'text-gray-600'}`}>Admin</span>
                </label>

                <label className={`flex cursor-pointer items-center rounded-xl border-2 px-4 py-2 transition-all duration-200 ${role === 'superAdmin' ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-400/10' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="superAdmin"
                    checked={role === "superAdmin"}
                    onChange={handleRoleChange}
                    className="hidden"
                  />
                  <span className={`text-sm font-medium ${role === 'superAdmin' ? 'text-brand-500' : 'text-gray-600'}`}>Super Admin</span>
                </label>

                <label className={`flex cursor-pointer items-center rounded-xl border-2 px-4 py-2 transition-all duration-200 ${role === 'student' ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-400/10' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === "student"}
                    onChange={handleRoleChange}
                    className="hidden"
                  />
                  <span className={`text-sm font-medium ${role === 'student' ? 'text-brand-500' : 'text-gray-600'}`}>Student</span>
                </label>
              </div>
            </div>
          )}
          <button
            type="submit"
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 flex flex-col items-start gap-1">
          <p className="text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
            <Link
              to={isStudentOnly ? "/auth/register/student" : isAdminOnly ? "/auth/register/admin" : isSuperAdminOnly ? "/auth/register/superadmin" : "/auth/register"}
              className="ml-1 font-bold text-brand-500 hover:text-brand-600 transition-colors duration-200 dark:text-white"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
