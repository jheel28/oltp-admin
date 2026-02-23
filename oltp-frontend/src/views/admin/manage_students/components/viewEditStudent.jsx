import { message, Select } from "antd";
import { AuthContext } from "components/Auth-context";
import React, { useContext, useState, useEffect } from "react";
import { FaPencilAlt, FaCheck } from "react-icons/fa";

const { Option } = Select;

const ViewEditStudent = ({ studentData, onUpdate, onBack }) => {
  const auth = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...studentData });
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(editedData).forEach((key) => {
        if (editedData[key] !== null && editedData[key] !== undefined) {
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

  const inputClass = "w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white";

  const Field = ({ label, name, type = "text", children }) => (
    <div className="mb-3">
      <label className="text-sm text-gray-600">{label}</label>
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
    <div className="flex">
      <div className="w-1/3 bg-white p-6 dark:bg-navy-700">
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
            <label htmlFor="image" className="absolute bottom-0 right-0 cursor-pointer text-blue-500">
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
      </div>

      <div className="w-2/3 bg-white p-6 dark:bg-navy-700">
        <h2 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">Student Details</h2>

        <Field label="First Name *" name="firstName" />
        <Field label="Last Name *" name="lastName" />
        <Field label="Student ID *" name="studentId" />
        <Field label="Phone Number *" name="phoneNumber" />
        <Field label="Alternate Number *" name="alternateNumber" />
        <Field label="Father's Name" name="fatherName" />
        <Field label="Mother's Name" name="motherName" />
        <Field label="Email *" name="email" type="email" />

        <div className="mb-3">
          <label className="text-sm text-gray-600">Batch</label>
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
          <label className="text-sm text-gray-600">Admission Date</label>
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
        <Field label="Pincode" name="pincode" />
        <Field label="State" name="state" />
        <Field label="Country" name="country" />

        {isEditing && (
          <div className="mb-3">
            <label className="text-sm text-gray-600">New Password (leave blank to keep current)</label>
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

        <div className="flex space-x-4 mt-4">
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
                onClick={() => { setIsEditing(false); setEditedData({ ...studentData }); }}
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
            className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
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