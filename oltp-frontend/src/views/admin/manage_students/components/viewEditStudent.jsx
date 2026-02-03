import { message } from "antd";
import { AuthContext } from "components/Auth-context";
import React, { useContext, useState } from "react";
import { FaPencilAlt, FaCheck } from "react-icons/fa";

const ViewEditStudent = ({ studentData, onUpdate, onBack }) => {
  const auth = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...studentData });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = async () => {
    try {
      const formData = new FormData();

      Object.keys(editedData).forEach((key) => {
        formData.append(key, editedData[key]);
      });

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/student/update/student/byid/${editedData._id}`,
        {
          method: "PATCH",
          body: formData,
          headers: { Authorization: "Bearer " + auth.token },
        }
      );

      if (response.status === 201) {
        message.success("Student updated Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        message.error(
          "Could not update the student, please check and try again"
        );
      }
    } catch (err) {
      message.error("Could not update the student, please check and try again");
    }
  };

  const handleBackClick = () => {
    onBack();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setEditedData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  return (
    <div className="flex">
      {/* Left side with image */}
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
            <label
              htmlFor="image"
              className="absolute bottom-0 right-0 cursor-pointer text-blue-500"
            >
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

      {/* Right side with form fields */}
      <div className="w-2/3 bg-white p-6 dark:bg-navy-700">
        <h2 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
          Student Details
        </h2>
        <div className="mb-4">
          <div className="mb-4">
            <label className="text-sm text-gray-600">First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={editedData.firstName}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
              />
            ) : (
              <p className="text-base font-medium text-navy-700 dark:text-white">
                {editedData.firstName}
              </p>
            )}
            <label className="text-sm text-gray-600">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={editedData.lastName}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
              />
            ) : (
              <p className="text-base font-medium text-navy-700 dark:text-white">
                {editedData.lastName}
              </p>
            )}
            <label className="text-sm text-gray-600">Roll No</label>
            {isEditing ? (
              <input
                type="text"
                name="studentId"
                value={editedData.studentId}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
              />
            ) : (
              <p className="text-base font-medium text-navy-700 dark:text-white">
                {editedData.studentId}
              </p>
            )}
            <label className="text-sm text-gray-600">Father Name</label>
            {isEditing ? (
              <input
                type="text"
                name="fatherName"
                value={editedData.fatherName}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
              />
            ) : (
              <p className="text-base font-medium text-navy-700 dark:text-white">
                {editedData.fatherName}
              </p>
            )}
            <label className="text-sm text-gray-600">Father Number</label>
            {isEditing ? (
              <input
                type="text"
                name="fatherNumber"
                value={editedData.fatherNumber}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
              />
            ) : (
              <p className="text-base font-medium text-navy-700 dark:text-white">
                {editedData.fatherNumber}
              </p>
            )}
            <label className="text-sm text-gray-600">Mother Name</label>
            {isEditing ? (
              <input
                type="text"
                name="motherName"
                value={editedData.motherName}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
              />
            ) : (
              <p className="text-base font-medium text-navy-700 dark:text-white">
                {editedData.motherName}
              </p>
            )}
            <label className="text-sm text-gray-600">Mother Number</label>
            {isEditing ? (
              <input
                type="text"
                name="motherNumber"
                value={editedData.motherNumber}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
              />
            ) : (
              <p className="text-base font-medium text-navy-700 dark:text-white">
                {editedData.motherNumber}
              </p>
            )}
            <label className="text-sm text-gray-600">Email</label>
            {isEditing ? (
              <input
                type="text"
                name="email"
                value={editedData.email}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
              />
            ) : (
              <p className="text-base font-medium text-navy-700 dark:text-white">
                {editedData.email}
              </p>
            )}
            <label className="text-sm text-gray-600">Batch</label>
            {isEditing ? (
              <input
                type="text"
                name="batch"
                value={editedData.batch}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
              />
            ) : (
              <p className="text-base font-medium text-navy-700 dark:text-white">
                {editedData.batch}
              </p>
            )}
            <label className="text-sm text-gray-600">Admission Date</label>
            {isEditing ? (
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
                name="admissionDate"
                value={editedData.admissionDate}
                onChange={handleChange}
                style={{ color: "black" }}
              />
            ) : (
              <p className="text-base font-medium text-navy-700 dark:text-white">
                {editedData.admissionDate}
              </p>
            )}
            <label className="text-sm text-gray-600">Address</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={editedData.address}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
              />
            ) : (
              <p className="text-base font-medium text-navy-700 dark:text-white">
                {editedData.address}
              </p>
            )}
            <label className="text-sm text-gray-600">Pincode</label>
            {isEditing ? (
              <input
                type="text"
                name="pincode"
                value={editedData.pincode}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
              />
            ) : (
              <p className="text-base font-medium text-navy-700 dark:text-white">
                {editedData.pincode}
              </p>
            )}
            <label className="text-sm text-gray-600">State</label>
            {isEditing ? (
              <input
                type="text"
                name="state"
                value={editedData.state}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
              />
            ) : (
              <p className="text-base font-medium text-navy-700 dark:text-white">
                {editedData.state}
              </p>
            )}
            <label className="text-sm text-gray-600">Country</label>
            {isEditing ? (
              <input
                type="text"
                name="country"
                value={editedData.country}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
              />
            ) : (
              <p className="text-base font-medium text-navy-700 dark:text-white">
                {editedData.country}
              </p>
            )}
          </div>
          {/* Include other form fields similarly */}
          {/* ... */}
        </div>
        <div className="flex space-x-6">
          {isEditing ? (
            <button
              type="button"
              className="flex items-center rounded-full bg-green-500 px-4 py-2 text-white hover:bg-green-700"
              onClick={handleUpdateClick}
            >
              <FaCheck className="mr-2" /> Update
            </button>
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
            className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            onClick={handleBackClick}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEditStudent;
