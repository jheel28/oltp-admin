import { message } from "antd";
import { AuthContext } from "components/Auth-context";
import React, { useContext, useState } from "react";
import { FaPencilAlt, FaCheck } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PhoneInput, { isValidPhoneNumber } from "components/PhoneInput";

const avatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Admin")}&background=6366f1&color=fff&size=128&bold=true`;

const ViewAdmin = ({ adminData, isOwnProfile, onUpdate, onBack }) => {
  const auth = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...adminData });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [mobileError, setMobileError] = useState(false);
  const [passwords, setPasswords] = useState({ password: "", newPassword: "", confirmPassword: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const passwordsMatch = passwords.newPassword !== "" && passwords.newPassword === passwords.confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleUpdate = async () => {
    if (isEditing && (!editedData.mobile || !isValidPhoneNumber(editedData.mobile))) {
      setMobileError(true);
      message.error("Please enter a valid mobile number");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", editedData.firstName || "");
      formData.append("lastName", editedData.lastName || "");
      formData.append("mobile", editedData.mobile || "");
      formData.append("email", editedData.email || "");
      if (imageFile) formData.append("image", imageFile);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/update/admin/byid/${editedData._id}`,
        {
          method: "PATCH",
          body: formData,
          headers: { Authorization: "Bearer " + auth.token },
        }
      );

      const data = await response.json();

      if (response.ok) {
        message.success("Profile updated successfully");
        setIsEditing(false);
        setImageFile(null);
        setMobileError(false);
        onUpdate(data);
      } else {
        message.error(data.message || "Could not update profile");
      }
    } catch {
      message.error("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.password) {
      message.error("Please enter your current password");
      return;
    }
    if (!passwordsMatch) {
      message.error("New passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      message.error("New password must be at least 6 characters");
      return;
    }
    setPasswordLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/update/password/byemail/${editedData.email}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          body: JSON.stringify({ password: passwords.password, newPassword: passwords.newPassword }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        message.success("Password updated successfully");
        setPasswords({ password: "", newPassword: "", confirmPassword: "" });
      } else {
        message.error(data.message || "Could not update password");
      }
    } catch {
      message.error("Network error, please try again");
    } finally {
      setPasswordLoading(false);
    }
  };

  const inputClass = "w-full rounded-md border border-gray-300 p-2.5 text-sm text-navy-700 dark:text-white dark:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const displayImage = imageFile
    ? URL.createObjectURL(imageFile)
    : editedData.image
    ? `${process.env.REACT_APP_BACKEND_URL}/${editedData.image}`
    : avatarUrl(`${editedData.firstName} ${editedData.lastName}`);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="text-xl font-bold text-navy-700 dark:text-white">
          {isOwnProfile ? "My Profile" : `${adminData.firstName} ${adminData.lastName}`}
        </h2>
        {!isOwnProfile && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-navy-700 dark:text-gray-400">
            View only — you cannot edit another admin's profile
          </span>
        )}
      </div>

      {isOwnProfile && (
        <div className="mb-4 flex gap-2 border-b border-gray-200 dark:border-navy-600">
          {["info", "password"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "info" ? "Profile Info" : "Change Password"}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="flex-shrink-0">
          <div className="relative h-32 w-32">
            <img
              src={displayImage}
              alt="Admin"
              className="h-32 w-32 rounded-full object-cover"
              onError={(e) => {
                e.target.src = avatarUrl(`${editedData.firstName} ${editedData.lastName}`);
              }}
            />
            {isOwnProfile && isEditing && (
              <label htmlFor="admin-image" className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-white p-1.5 shadow-md text-blue-500">
                <FaPencilAlt className="h-3 w-3" />
                <input type="file" id="admin-image" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
          {imageFile && (
            <p className="mt-1 text-xs text-green-600 text-center">New image selected</p>
          )}
        </div>

        <div className="flex-1">
          {(!isOwnProfile || activeTab === "info") && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { name: "firstName", label: "First Name" },
                { name: "lastName", label: "Last Name" },
                { name: "email", label: "Email" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
                  {isOwnProfile && isEditing ? (
                    <input
                      type={name === "email" ? "email" : "text"}
                      name={name}
                      value={editedData[name] || ""}
                      onChange={handleChange}
                      className={inputClass}
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-sm font-medium text-navy-700 dark:text-white">{editedData[name] || "—"}</p>
                  )}
                </div>
              ))}

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">Mobile Number</label>
                {isOwnProfile && isEditing ? (
                  <PhoneInput
                    value={editedData.mobile}
                    onChange={(val) => {
                      setEditedData((prev) => ({ ...prev, mobile: val || "" }));
                      if (mobileError) setMobileError(false);
                    }}
                    disabled={loading}
                    showValidation={mobileError}
                    placeholder="Mobile number"
                  />
                ) : (
                  <p className="text-sm font-medium text-navy-700 dark:text-white">{editedData.mobile || "—"}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">Role</label>
                <span className="inline-block rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-bold text-indigo-700">
                  {editedData.role}
                </span>
              </div>
            </div>
          )}

          {isOwnProfile && activeTab === "info" && (
            <div className="mt-5 flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <FaCheck /> {loading ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    onClick={() => { setIsEditing(false); setEditedData({ ...adminData }); setImageFile(null); setMobileError(false); }}
                    disabled={loading}
                    className="rounded-full bg-gray-400 px-4 py-2 text-sm text-white hover:bg-gray-600 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-full bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          )}

          {isOwnProfile && activeTab === "password" && (
            <div className="max-w-sm">
              {[
                { name: "password", label: "Current Password", key: "current" },
                { name: "newPassword", label: "New Password", key: "new" },
                { name: "confirmPassword", label: "Confirm New Password", key: "confirm" },
              ].map(({ name, label, key }) => (
                <div key={name} className="relative mb-3">
                  <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
                  <input
                    type={showPasswords[key] ? "text" : "password"}
                    name={name}
                    value={passwords[name]}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, [name]: e.target.value }))}
                    className={`${inputClass} pr-10 ${
                      name !== "password" && passwords.confirmPassword !== ""
                        ? passwordsMatch ? "border-green-500" : "border-red-500"
                        : ""
                    }`}
                    placeholder={label}
                    disabled={passwordLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }))}
                    className="absolute bottom-2.5 right-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords[key] ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              ))}
              {passwords.confirmPassword && !passwordsMatch && (
                <p className="mb-2 text-xs text-red-500">Passwords do not match</p>
              )}
              <button
                onClick={handlePasswordUpdate}
                disabled={passwordLoading || !passwordsMatch || !passwords.password}
                className="mt-2 rounded-full bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {passwordLoading ? "Updating…" : "Update Password"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAdmin;