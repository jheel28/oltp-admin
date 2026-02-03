import { message } from "antd";
import { AuthContext } from "components/Auth-context";
import React, { useState, useRef, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SettingsScreen = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);

  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const auth = useContext(AuthContext);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };
  const handleProfileImageUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("image", profileImage);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/admin/update/image/byid/${auth.userId}`,
        {
          method: "PATCH", // Change the method to PATCH
          body: formData,
          headers: { Authorization: "Bearer " + auth.token },
        }
      );

      if (response.status === 201) {
        message.success("Profile image updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        message.error("Could not update profile image, please try again");
      }
    } catch (err) {
      console.log(err);
      message.error("Could not update profile image, please try again");
    }
  };

  const handleBannerImageUpdate = () => {
    // Your logic for updating the banner image
    console.log("Banner Image updated:", bannerImage);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "newPassword" || name === "confirmPassword") {
      setPasswordMatch(value === formData.newPassword);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordMatch) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/admin/update/password/byemail/${auth.email}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            },
            body: JSON.stringify(formData),
          }
        );
        if (response.status === 200) {
          message.success("Admin password updated successfully");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          message.error("Could not update admin password, please try again");
        }
      } catch (err) {
        message.error("Could not update admin password, please try again");
      }
    } else {
      message.error("Passwords do not match");
    }
  };

  const togglePasswordVisibility = (passwordType) => {
    if (passwordType === "password") {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (passwordType === "newPassword") {
      setShowNewPassword(!showNewPassword);
    } else if (passwordType === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 text-navy-700 shadow-md dark:bg-navy-700">
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold dark:text-white">
          Profile Update
        </h2>
        {/* Profile Image */}
        <input
          type="file"
          name="profileImage"
          accept="image/*"
          onChange={(e) => handleImageChange(e, setProfileImage)}
          className="mb-4 w-full rounded-md border border-gray-300 p-3"
        />
        {profileImage && (
          <div className="mb-4">
            <img
              src={URL.createObjectURL(profileImage)}
              alt="Profile"
              className="mb-2 h-16 w-16 rounded-full"
            />
            <button
              className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
              onClick={handleProfileImageUpdate}
            >
              Update Profile Image
            </button>
          </div>
        )}
      </div>

      {/* <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold dark:text-white">
          Banner Update
        </h2>

        <input
          type="file"
          name="bannerImage"
          accept="image/*"
          onChange={(e) => handleImageChange(e, setBannerImage)}
          className="mb-4 w-full rounded-md border border-gray-300 p-3"
        />
        {bannerImage && (
          <div className="mb-4">
            <img
              src={URL.createObjectURL(bannerImage)}
              alt="Banner"
              className="mb-2 w-full rounded-md"
            />
            <button
              className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
              onClick={handleBannerImageUpdate}
            >
              Update Banner Image
            </button>
          </div>
        )}
      </div> */}

      <div>
        <h2 className="mb-4 text-xl font-bold dark:text-white">
          Password Change
        </h2>
        {/* Current Password */}
        <div className="relative mb-4">
          <input
            type={showCurrentPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Current Password"
            className="w-full rounded-md border border-gray-300 p-3 pr-10"
          />
          <div
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2"
            onClick={() => togglePasswordVisibility("password")}
          >
            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        {/* New Password */}
        <div className="relative mb-4">
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="New Password"
            className={`w-full rounded-md border border-gray-300 p-3 pr-10 ${
              formData.newPassword === formData.confirmPassword &&
              formData.confirmPassword !== ""
                ? "border-green-500"
                : ""
            }`}
          />
          <div
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-2"
            onClick={() => togglePasswordVisibility("newPassword")}
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        {/* Confirm Password */}
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={`w-full rounded-md border border-gray-300 p-3 pr-10 ${
              formData.newPassword === formData.confirmPassword &&
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
        {/* Password Match Error */}
        {!passwordMatch && (
          <p className="text-red-500">
            New password and confirm password do not match.
          </p>
        )}
        {/* Update Password Button */}
        <button
          className={`${
            passwordMatch ? "bg-green-500" : "bg-red-500"
          } rounded-full px-4 py-2 text-white hover:bg-green-700`}
          onClick={handlePasswordChange}
        >
          {passwordMatch ? "Update Password" : "Passwords Do Not Match"}
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;
