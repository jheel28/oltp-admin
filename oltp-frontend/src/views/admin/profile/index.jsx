import React, { useContext, useEffect, useState } from "react";
import banner from "assets/img/profile/banner.png";
import Card from "components/card";
import { AuthContext } from "components/Auth-context";
import { message } from "antd";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PhoneInput, { isValidPhoneNumber } from "components/PhoneInput";

const avatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Admin")}&background=6366f1&color=fff&size=128&bold=true`;

const AdminProfile = () => {
  const auth = useContext(AuthContext);
  const [admin, setAdmin] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [mobileError, setMobileError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwords, setPasswords] = useState({ password: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

  const passwordsMatch =
    passwords.newPassword !== "" && passwords.newPassword === passwords.confirmPassword;

  const fetchAdmin = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/get/admin/byid/${auth.userId}`,
        { headers: { Authorization: "Bearer " + auth.token } }
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setAdmin(data.admin);
      setEditedData(data.admin);
    } catch (err) {
      message.error("Error fetching admin data: " + err.message);
    }
  };

  useEffect(() => { fetchAdmin(); }, []);

  const handleInfoUpdate = async () => {
    if (!editedData.mobile || !isValidPhoneNumber(editedData.mobile)) {
      setMobileError(true);
      message.error("Please enter a valid mobile number");
      return;
    }
    setInfoLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/update/admin/byid/${admin._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          body: JSON.stringify({
            firstName: editedData.firstName,
            lastName: editedData.lastName,
            mobile: editedData.mobile,
            email: editedData.email,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        message.success("Profile updated successfully");
        setIsEditing(false);
        setMobileError(false);
        fetchAdmin();
      } else {
        message.error(data.message || "Could not update profile, please try again");
      }
    } catch {
      message.error("Network error, please try again");
    } finally {
      setInfoLoading(false);
    }
  };

  const handleImageUpdate = async () => {
    if (!profileImage) return;
    setImageLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", profileImage);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/update/image/byid/${auth.userId}`,
        { method: "PATCH", body: formData, headers: { Authorization: "Bearer " + auth.token } }
      );
      if (response.ok) {
        message.success("Profile image updated successfully");
        setProfileImage(null);
        fetchAdmin();
      } else {
        const data = await response.json();
        message.error(data.message || "Could not update profile image, please try again");
      }
    } catch {
      message.error("Network error, please try again");
    } finally {
      setImageLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.password) { message.error("Please enter your current password"); return; }
    if (!passwordsMatch) { message.error("New passwords do not match"); return; }
    if (passwords.newPassword.length < 6) { message.error("New password must be at least 6 characters"); return; }
    setPasswordLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/update/password/byemail/${auth.email}`,
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
        message.error(data.message || "Could not update password, please try again");
      }
    } catch {
      message.error("Network error, please try again");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const cancelEdit = () => { setEditedData(admin); setIsEditing(false); setMobileError(false); };

  const currentAvatarUrl = profileImage
    ? URL.createObjectURL(profileImage)
    : admin.image
    ? `${process.env.REACT_APP_BACKEND_URL}/${admin.image}`
    : avatarUrl(`${admin.firstName} ${admin.lastName}`);

  const inputClass = "w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white dark:bg-navy-800";

  return (
    <div className="flex w-full flex-col gap-5 mt-3">
      <Card extra="items-center w-full h-full p-[16px] bg-cover">
        <div
          className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
          style={{ backgroundImage: `url(${banner})` }}
        >
          <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-indigo-400 dark:!border-navy-700">
            <img
              className="h-full w-full rounded-full object-cover"
              src={currentAvatarUrl}
              alt=""
              onError={(e) => {
                e.target.src = avatarUrl(`${admin.firstName} ${admin.lastName}`);
              }}
            />
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            {admin.firstName} {admin.lastName}
          </h4>
          <p className="text-base font-normal text-gray-600">{admin.role}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card extra="w-full h-full p-6">
          <h4 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">General Information</h4>
          <div className="grid grid-cols-1 gap-4">
            {[
              { name: "firstName", label: "First Name" },
              { name: "lastName",  label: "Last Name"  },
              { name: "email",     label: "Email"       },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="text-sm text-gray-600">{label}</label>
                {isEditing ? (
                  <input
                    type={name === "email" ? "email" : "text"}
                    name={name}
                    value={editedData[name] || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                ) : (
                  <p className="text-base font-medium text-navy-700 dark:text-white">{admin[name] || "—"}</p>
                )}
              </div>
            ))}
            <div>
              <label className="text-sm text-gray-600">Mobile Number</label>
              {isEditing ? (
                <PhoneInput
                  value={editedData.mobile || ""}
                  onChange={(val) => {
                    setEditedData((prev) => ({ ...prev, mobile: val || "" }));
                    if (mobileError) setMobileError(false);
                  }}
                  showValidation={mobileError}
                  placeholder="Mobile number"
                />
              ) : (
                <p className="text-base font-medium text-navy-700 dark:text-white">{admin.mobile || "—"}</p>
              )}
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            {isEditing ? (
              <>
                <button onClick={handleInfoUpdate} disabled={infoLoading} className="rounded-full bg-green-500 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50">
                  {infoLoading ? "Saving..." : "Save"}
                </button>
                <button onClick={cancelEdit} disabled={infoLoading} className="rounded-full bg-gray-400 px-4 py-2 text-white hover:bg-gray-600 disabled:opacity-50">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
                Edit
              </button>
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          <Card extra="w-full p-6">
            <h4 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">Profile Image</h4>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0] || null)}
              className="mb-4 w-full rounded-md border border-gray-300 p-3 text-sm"
            />
            {profileImage && (
              <div className="flex items-center gap-4">
                <img src={URL.createObjectURL(profileImage)} alt="Preview" className="h-16 w-16 rounded-full object-cover" />
                <button onClick={handleImageUpdate} disabled={imageLoading} className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
                  {imageLoading ? "Uploading..." : "Update Image"}
                </button>
              </div>
            )}
          </Card>

          <Card extra="w-full p-6">
            <h4 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">Change Password</h4>
            {[
              { name: "password",        label: "Current Password", key: "current" },
              { name: "newPassword",     label: "New Password",     key: "new"     },
              { name: "confirmPassword", label: "Confirm Password", key: "confirm" },
            ].map(({ name, label, key }) => (
              <div key={name} className="relative mb-4">
                <input
                  type={showPassword[key] ? "text" : "password"}
                  name={name}
                  value={passwords[name]}
                  onChange={(e) => setPasswords((prev) => ({ ...prev, [name]: e.target.value }))}
                  placeholder={label}
                  className={`w-full rounded-md border p-3 pr-10 text-navy-700 dark:text-white dark:bg-navy-800 ${
                    name !== "password" && passwords.confirmPassword !== ""
                      ? passwordsMatch ? "border-green-500" : "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  onClick={() => setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }))}
                >
                  {showPassword[key] ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            ))}
            {passwords.confirmPassword !== "" && !passwordsMatch && (
              <p className="mb-3 text-sm text-red-500">Passwords do not match</p>
            )}
            <button
              onClick={handlePasswordUpdate}
              disabled={passwordLoading || !passwordsMatch || !passwords.password}
              className="rounded-full bg-green-500 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;