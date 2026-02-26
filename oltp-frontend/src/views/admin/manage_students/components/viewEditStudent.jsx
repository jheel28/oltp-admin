import { message, Select } from "antd";
import { AuthContext } from "components/Auth-context";
import React, { useContext, useState, useEffect } from "react";
import { FaPencilAlt, FaCheck } from "react-icons/fa";
import PhoneInput, { isValidPhoneNumber } from "components/PhoneInput";

const { Option } = Select;

const ViewEditStudent = ({ studentData, onUpdate, onBack }) => {
  const auth = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...studentData });
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/batch/get/all/batches`
        );
        const data = await response.json();
        setBatches(data.batches || []);
      } catch (error) {
        message.error("Failed to load batches");
      }
    };
    fetchBatches();
  }, []);

  const handleEditClick = () => setIsEditing(true);

  const handleUpdateClick = async () => {
    setShowValidation(true);

    if (editedData.phoneNumber && !isValidPhoneNumber(editedData.phoneNumber)) {
      message.error("Please enter a valid phone number");
      return;
    }
    if (editedData.alternateNumber && !isValidPhoneNumber(editedData.alternateNumber)) {
      message.error("Please enter a valid alternate number");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(editedData).forEach((key) => {
        if (
          editedData[key] !== null &&
          editedData[key] !== undefined &&
          key !== "_id" &&
          key !== "__v" &&
          key !== "isVerified" &&
          key !== "role"
        ) {
          formData.append(key, editedData[key]);
        }
      });

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/student/update/student/byid/${editedData._id}`,
        {
          method: "PATCH",
          body: formData,
          headers: { Authorization: "Bearer " + auth.token },
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        message.success("Student updated successfully");
        setIsEditing(false);
        setShowValidation(false);
        onUpdate(responseData);
      } else {
        message.error(responseData.message || "Could not update the student, please check and try again");
      }
    } catch (err) {
      message.error("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedData((prev) => ({ ...prev, image: file }));
    }
  };

  const inputClass = "w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white dark:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const Field = ({ label, name, type = "text", children }) => (
    <div className="mb-3">
      <label className="text-sm text-gray-600 dark:text-gray-400">{label}</label>
      {children || (
        isEditing ? (
          <input
            type={type}
            name={name}
            value={editedData[name] || ""}
            onChange={handleChange}
            className={inputClass}
            disabled={loading}
          />
        ) : (
          <p className="text-base font-medium text-navy-700 dark:text-white">
            {editedData[name] || "—"}
          </p>
        )
      )}
    </div>
  );

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="w-full sm:w-1/3 bg-white p-6 dark:bg-navy-700">
        <div className="relative mb-4 h-40 w-40 rounded-full bg-gray-300">
          <img
            src={
              editedData.image instanceof File
                ? URL.createObjectURL(editedData.image)
                : `${process.env.REACT_APP_BACKEND_URL}/${editedData.image}`
            }
            alt="Student"
            className="h-40 w-40 rounded-full object-cover"
          />
          {isEditing && (
            <label htmlFor="image" className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-white p-1 shadow text-blue-500">
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <FaPencilAlt />
            </label>
          )}
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">Student ID</p>
          <p className="font-bold text-navy-700 dark:text-white">{editedData.studentId}</p>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">Status</p>
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${
            editedData.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          }`}>
            {editedData.isVerified ? "Verified" : "Unverified"}
          </span>
        </div>
      </div>

      <div className="w-full sm:w-2/3 bg-white p-6 dark:bg-navy-700">
        <h2 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">Student Details</h2>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <Field label="First Name *" name="firstName" />
          <Field label="Last Name *" name="lastName" />
          <Field label="Father's Name" name="fatherName" />
          <Field label="Mother's Name" name="motherName" />
          <Field label="Email *" name="email" type="email" />
          <Field label="Student ID *" name="studentId" />
        </div>

        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <div className="mb-3">
            <label className="text-sm text-gray-600 dark:text-gray-400">Phone Number *</label>
            {isEditing ? (
              <PhoneInput
                value={editedData.phoneNumber}
                onChange={(val) => setEditedData((prev) => ({ ...prev, phoneNumber: val || "" }))}
                disabled={loading}
                showValidation={showValidation}
              />
            ) : (
              <p className="text-base font-medium text-navy-700 dark:text-white">{editedData.phoneNumber || "—"}</p>
            )}
          </div>

          <div className="mb-3">
            <label className="text-sm text-gray-600 dark:text-gray-400">Alternate Number *</label>
            {isEditing ? (
              <PhoneInput
                value={editedData.alternateNumber}
                onChange={(val) => setEditedData((prev) => ({ ...prev, alternateNumber: val || "" }))}
                disabled={loading}
                showValidation={showValidation}
              />
            ) : (
              <p className="text-base font-medium text-navy-700 dark:text-white">{editedData.alternateNumber || "—"}</p>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="text-sm text-gray-600 dark:text-gray-400">Batch</label>
          {isEditing ? (
            <Select
              value={editedData.batch}
              onChange={(value) => setEditedData((prev) => ({ ...prev, batch: value }))}
              className="w-full"
              disabled={loading}
            >
              {batches.map((batch) => (
                <Option key={batch._id} value={batch.batchName}>
                  {batch.batchName}
                </Option>
              ))}
            </Select>
          ) : (
            <p className="text-base font-medium text-navy-700 dark:text-white">{editedData.batch || "—"}</p>
          )}
        </div>

        <div className="mb-3">
          <label className="text-sm text-gray-600 dark:text-gray-400">Admission Date</label>
          {isEditing ? (
            <input
              type="date"
              name="admissionDate"
              value={editedData.admissionDate || ""}
              onChange={handleChange}
              className={inputClass}
              disabled={loading}
            />
          ) : (
            <p className="text-base font-medium text-navy-700 dark:text-white">{editedData.admissionDate || "—"}</p>
          )}
        </div>

        <Field label="Address" name="address" />

        <div className="grid grid-cols-3 gap-x-4">
          <Field label="Pincode" name="pincode" />
          <Field label="State" name="state" />
          <Field label="Country" name="country" />
        </div>

        {isEditing && (
          <div className="mb-3">
            <label className="text-sm text-gray-600 dark:text-gray-400">New Password (leave blank to keep current)</label>
            <input
              type="password"
              name="password"
              value={editedData.password || ""}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter new password or leave blank"
              disabled={loading}
            />
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                className="flex items-center rounded-full bg-green-500 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                onClick={handleUpdateClick}
                disabled={loading}
              >
                <FaCheck className="mr-2" /> {loading ? "Updating..." : "Update"}
              </button>
              <button
                type="button"
                className="rounded-full bg-gray-400 px-4 py-2 text-white hover:bg-gray-600 disabled:opacity-50"
                onClick={() => { setIsEditing(false); setEditedData({ ...studentData }); setShowValidation(false); }}
                disabled={loading}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
              onClick={handleEditClick}
            >
              Edit
            </button>
          )}
          <button
            type="button"
            className="rounded-full bg-gray-500 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
            onClick={onBack}
            disabled={loading}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEditStudent;