import React, { useContext, useEffect, useState } from "react";
import banner from "assets/img/profile/banner.png";
import Card from "components/card";
import { AuthContext } from "components/Auth-context";
import { message } from "antd";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const avatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Student")}&background=4f46e5&color=fff&size=128&bold=true`;

const FIELD_CONFIG = [
  { key: "studentId", label: "Student ID", readonly: true },
  { key: "role", label: "Role", readonly: true },
  { key: "batch", label: "Batch", readonly: true },
  { key: "admissionDate", label: "Admission Date", readonly: true },
  { key: "email", label: "Email", required: true },
  { key: "firstName", label: "First Name", required: true },
  { key: "lastName", label: "Last Name", required: true },
  { key: "phoneNumber", label: "Phone Number", required: true },
  { key: "alternateNumber", label: "Alternate Number", required: false },
  { key: "fatherName", label: "Father's Name", optional: true },
  { key: "motherName", label: "Mother's Name", optional: true },
  { key: "address", label: "Address", required: true },
  { key: "pincode", label: "Pincode", required: true },
  { key: "state", label: "State", required: true },
  { key: "country", label: "Country", required: true },
];

const StudentProfile = () => {
  const auth = useContext(AuthContext);
  const [student, setStudent] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwords, setPasswords] = useState({ password: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

  const passwordsMatch =
    passwords.newPassword !== "" && passwords.newPassword === passwords.confirmPassword;

  const fetchStudent = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/student/get/student/byid/${auth.userId}`,
        { headers: { Authorization: "Bearer " + auth.token } }
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setStudent(data.student);
      setEditedData(data.student);
    } catch (err) {
      message.error("Error fetching profile: " + err.message);
    }
  };

  useEffect(() => { fetchStudent(); }, []);

  const handleInfoUpdate = async () => {
    setInfoLoading(true);
    try {
      const payload = new FormData();
      FIELD_CONFIG.filter((f) => !f.readonly).forEach((f) => {
        if (editedData[f.key] !== undefined && editedData[f.key] !== null) {
          payload.append(f.key, editedData[f.key]);
        }
      });

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/student/update/student/student/byid/${auth.userId}`,
        { method: "PATCH", body: payload, headers: { Authorization: "Bearer " + auth.token } }
      );

      const data = await response.json();
      if (response.ok) {
        message.success("Profile updated successfully");
        setIsEditing(false);
        fetchStudent();
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
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/student/update/image/byid/${auth.userId}`,
        { method: "PATCH", body: formData, headers: { Authorization: "Bearer " + auth.token } }
      );
      if (response.ok) {
        message.success("Profile image updated successfully");
        setProfileImage(null);
        fetchStudent();
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
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/student/update/password/byemail/${auth.email}`,
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

  const cancelEdit = () => { setEditedData(student); setIsEditing(false); };

  const currentAvatarUrl = profileImage
    ? URL.createObjectURL(profileImage)
    : student.image
      ? `${process.env.REACT_APP_BACKEND_URL}/${student.image}`
      : avatarUrl(`${student.firstName} ${student.lastName}`);

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
                e.target.src = avatarUrl(`${student.firstName} ${student.lastName}`);
              }}
            />
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            {student.firstName} {student.lastName}
          </h4>
          <p className="text-sm text-gray-500">{student.batch}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card extra="w-full h-full p-6">
          <h4 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">Student Information</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FIELD_CONFIG.map(({ key, label, readonly, required, optional }) => (
              <div key={key}>
                <label className="text-sm text-gray-600">
                  {label}
                  {required ? " *" : ""}
                  {optional ? <span className="ml-1 text-xs text-gray-400">(optional)</span> : ""}
                </label>
                {isEditing && !readonly ? (
                  <input
                    type={key === "email" ? "email" : "text"}
                    name={key}
                    value={editedData[key] || ""}
                    onChange={(e) => setEditedData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                    className={inputClass}
                  />
                ) : (
                  <p className="text-base font-medium text-navy-700 dark:text-white">
                    {editedData[key] || "—"}
                  </p>
                )}
              </div>
            ))}
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
              { name: "password", label: "Current Password", key: "current" },
              { name: "newPassword", label: "New Password", key: "new" },
              { name: "confirmPassword", label: "Confirm Password", key: "confirm" },
            ].map(({ name, label, key }) => (
              <div key={name} className="relative mb-4">
                <input
                  type={showPassword[key] ? "text" : "password"}
                  name={name}
                  value={passwords[name]}
                  onChange={(e) => setPasswords((prev) => ({ ...prev, [name]: e.target.value }))}
                  placeholder={label}
                  className={`w-full rounded-md border p-3 pr-10 text-navy-700 dark:text-white dark:bg-navy-800 ${name !== "password" && passwords.confirmPassword !== ""
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

export default StudentProfile;