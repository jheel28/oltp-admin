import { message } from "antd";
import { AuthContext } from "components/Auth-context";
import React, { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AddUniversityForm = ({ onSubmit, onCancel }) => {
  const auth = useContext(AuthContext);
  const [formData, setFormData] = useState({
    universityName: "",
    address: "",
    landmark: "",
    pincode: "",
    state: "",
    country: "",
    dateOfEstablishment: "",
    universityLogo: null,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    image: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
    if (name === "password" || name === "confirmPassword") {
      setPasswordMatch(value === formData.password);
    }
  };
  const togglePasswordVisibility = (passwordType) => {
    if (passwordType === "password") {
      setShowPassword(!showPassword);
    } else if (passwordType === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordMatch) {
      try {
        const formDataToSend = new FormData();
        for (let key in formData) {
          formDataToSend.append(key, formData[key]);
        }
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/admin/create/admin`,
          {
            method: "POST",
            body: formDataToSend,
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        if (!response.ok) {
          throw new Error(
            "Something went wrong while creating the university",
            response.status
          );
        }
        const responseData = await response.json();
        message.success("Admin created successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        setFormData({
          universityName: "",
          address: "",
          landmark: "",
          pincode: "",
          state: "",
          country: "",
          dateOfEstablishment: "",
          universityLogo: null,
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          mobile: "",
          image: null,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (err) {}
      e.preventDefault();

      onSubmit(formData);
    } else {
      message.error("Passwords do not match");
    }
  };

  return (
    <div className="rounded bg-white p-4 shadow-md dark:bg-navy-600">
      <h1 className="mb-4 text-lg font-bold">Add University</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="universityName"
            className="mb-2 block text-sm font-bold dark:bg-navy-600"
          >
            University Name
          </label>
          <input
            type="text"
            id="universityName"
            name="universityName"
            value={formData.universityName}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 dark:bg-navy-600"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-bold dark:bg-navy-600"
          >
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 dark:bg-navy-600"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="landmark"
            className="mb-2 block text-sm font-bold dark:bg-navy-600"
          >
            Landmark
          </label>
          <input
            type="text"
            id="landmark"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 dark:bg-navy-600"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="pincode"
            className="mb-2 block text-sm font-bold dark:bg-navy-600"
          >
            Pincode
          </label>
          <input
            type="number"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 dark:bg-navy-600"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="state"
            className="mb-2 block text-sm font-bold dark:bg-navy-600"
          >
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 dark:bg-navy-600"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="country"
            className="mb-2 block text-sm font-bold dark:bg-navy-600"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 dark:bg-navy-600"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="dateOfEstablishment"
            className="mb-2 block text-sm font-bold dark:bg-navy-600"
          >
            Date of Establishment
          </label>
          <input
            type="date"
            className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
            id="dateOfEstablishment"
            name="dateOfEstablishment"
            value={formData.dateOfEstablishment}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="universityLogo"
            className="mb-2 block text-sm font-bold dark:bg-navy-600"
          >
            University Logo
          </label>
          <input
            type="file"
            id="universityLogo"
            name="universityLogo"
            onChange={handleChange}
            accept="image/*"
            className="w-full rounded border px-3 py-2 dark:bg-navy-600"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="mb-2 block text-sm font-bold dark:bg-navy-600"
          >
            Admin First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 dark:bg-navy-600"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="mb-2 block text-sm font-bold dark:bg-navy-600"
          >
            Admin Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 dark:bg-navy-600"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-bold dark:bg-navy-600 "
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 dark:bg-navy-600"
            required
          />
        </div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-bold dark:bg-navy-600 "
        >
          Password
        </label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full rounded-md border border-gray-300 p-3 pr-10 ${
              formData.password === formData.confirmPassword &&
              formData.confirmPassword !== ""
                ? "border-green-500"
                : ""
            }`}
          />
          <div
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2"
            onClick={() => togglePasswordVisibility("password")}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        {/* Confirm Password */}
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-bold dark:bg-navy-600 "
        >
          Confirm Password
        </label>
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={`w-full rounded-md border border-gray-300 p-3 pr-10 ${
              formData.password === formData.confirmPassword &&
              formData.confirmPassword !== ""
                ? "border-green-500"
                : "border-red-500"
            }`}
          />
          <div
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2"
            onClick={() => togglePasswordVisibility("confirmPassword")}
          >
            {showConfirmPassword ? (
              <FaEyeSlash
                className={!passwordMatch ? "text-red-500" : "text-green-500"}
              />
            ) : (
              <FaEye
                className={!passwordMatch ? "text-red-500" : "text-green-500"}
              />
            )}
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="mobile"
            className="mb-2 block text-sm font-bold dark:bg-navy-600"
          >
            Mobile
          </label>
          <input
            type="number"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 dark:bg-navy-600"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="image"
            className="mb-2 block text-sm font-bold dark:bg-navy-600"
          >
            Admin Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="w-full rounded border px-3 py-2 dark:bg-navy-600"
            required
          />
        </div>

        {!passwordMatch && (
          <p className="text-red-500">
            Password and confirm password do not match.
          </p>
        )}
        {/* Update Password Button */}
        <button
          type="submit"
          className={`${
            passwordMatch ? "bg-green-500" : "bg-red-500"
          } rounded-full px-4 py-2 text-white hover:bg-green-700`}
        >
          {passwordMatch ? "Add University" : "Passwords Do Not Match"}
        </button>
      </form>
    </div>
  );
};

export default AddUniversityForm;
