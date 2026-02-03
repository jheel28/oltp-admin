import InputField from "components/fields/InputField";
import { useContext, useState } from "react";
import { AuthContext } from "components/Auth-context";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import PasswordInputField from "components/fields/PasswordInputField";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // State to store the selected role
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
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
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/${role}/login`,
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

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      auth.login(data.userId, data.token, data.email, data.role);
      message.success("Logged in successfully");
      setTimeout(() => {
        navigate(`/${data.role.toLowerCase()}`);
      });
      console.log("Sign in successful");
    } catch (error) {
      message.error("Login Failed. Pleae check Email and Password Again.");
      console.error("Error signing in:", error.message);
    }
  };
  return (
    <div className="mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh -mt-1]  w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[450px]">
        <form onSubmit={handleSignIn} style={{ paddingTop: "130px" }}>
          <h1 className="mb-2.5 text-6xl font-bold text-navy-700 dark:text-white">
            Beta Classes
          </h1>
          <br />
          <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
            Sign In
          </h4>

          {/* <p className="mb-9 ml-1 text-base text-gray-600">
            Enter your email and password to sign in!
          </p>
          <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800">
            <div className="rounded-full text-xl">
              <FcGoogle />
            </div>
            <h5 className="text-sm font-medium text-navy-700 dark:text-white">
              Sign In with Google
            </h5>
          </div>
          <div className="mb-6 flex items-center  gap-3">
            <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
            <p className="text-base text-gray-600 dark:text-white"> or </p>
            <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          </div> */}
          {/* Email */}
          <InputField
            variant="auth"
            extra="mb-3"
            label="Email*"
            placeholder="mail@simmmple.com"
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
          <div className="mb-6 flex flex-row items-center">
            <label className="font-large mr-4 block text-base text-gray-700 dark:text-white">
              I am
            </label>
            <div className="flex flex-row items-center">
              <div className="mr-6">
                <input
                  type="radio"
                  id="superAdmin"
                  name="role"
                  value="superAdmin"
                  checked={role === "superAdmin"}
                  onChange={handleRoleChange}
                  className="mr-2"
                />
                <label
                  htmlFor="superAdmin"
                  className="mr-4 text-navy-700 dark:text-white"
                >
                  Super Admin
                </label>
              </div>
              <div className="mr-4">
                <input
                  type="radio"
                  id="admin"
                  name="role"
                  value="admin"
                  checked={role === "admin"}
                  onChange={handleRoleChange}
                  className="mr-2"
                />
                <label
                  htmlFor="admin"
                  className="mr-4 text-navy-700 dark:text-white"
                >
                  Admin
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="student"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={handleRoleChange}
                  className="mr-2"
                />
                <label
                  htmlFor="student"
                  className="mr-4 text-navy-700 dark:text-white"
                >
                  Student
                </label>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Sign In
          </button>
        </form>
        {/* <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
          </span>
          <a
            href=" "
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Create an account
          </a>
        </div> */}
      </div>
    </div>
  );
}
