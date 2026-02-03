import { message } from "antd";
import { AuthContext } from "components/Auth-context";
import React, { useContext, useState } from "react";
import { FaPencilAlt, FaCheck } from "react-icons/fa";

const ViewEditUniversity = ({ universityData, onUpdate, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...universityData });
  const auth = useContext(AuthContext);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = async () => {
    try {
      const formData = new FormData();

      // Append all other form data
      Object.keys(editedData).forEach((key) => {
        formData.append(key, editedData[key]);
      });

      // Append the image file

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/admin/update/admin/superadmin/byid/${editedData._id}`,
        {
          method: "PATCH",
          body: formData,
          headers: { Authorization: "Bearer " + auth.token },
        }
      );

      if (response.status === 201) {
        message.success("University updated Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        message.error(
          "Could not update the university, please check and try again"
        );
      }
    } catch (err) {
      message.error(
        "Could not update the university, please check and try again"
      );
    }
  };

  const handleBackClick = () => {
    onBack();
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];

      setEditedData((prevData) => ({
        ...prevData,
        image: file,
      }));
    } else {
      // For other input fields
      setEditedData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
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
            alt="University"
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
                onChange={handleChange}
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
          University Details
        </h2>
        <div className="mb-4">
          <label className="text-sm text-gray-600">University Name</label>
          {isEditing ? (
            <input
              type="text"
              name="universityName"
              value={editedData.universityName}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
            />
          ) : (
            <p className="text-base font-medium text-navy-700 dark:text-white">
              {editedData.universityName}
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
          <label className="text-sm text-gray-600">Landmark</label>
          {isEditing ? (
            <input
              type="text"
              name="landmark"
              value={editedData.landmark}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
            />
          ) : (
            <p className="text-base font-medium text-navy-700 dark:text-white">
              {editedData.landmark}
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
          <label className="text-sm text-gray-600">Date of Establishment</label>
          {isEditing ? (
            <input
              type="date"
              className="block w-full rounded-lg border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 dark:bg-navy-700"
              id="dateOfEstablishment"
              name="dateOfEstablishment"
              value={editedData.dateOfEstablishment}
              onChange={handleChange}
              required
            />
          ) : (
            <p className="text-base font-medium text-navy-700 dark:text-white">
              {editedData.dateOfEstablishment}
            </p>
          )}

          <label className="text-sm text-gray-600">Admin First Name</label>
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
          <label className="text-sm text-gray-600">Admin Last Name</label>
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
          <label className="text-sm text-gray-600">Mobile</label>
          {isEditing ? (
            <input
              type="text"
              name="mobile"
              value={editedData.mobile}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
            />
          ) : (
            <p className="text-base font-medium text-navy-700 dark:text-white">
              {editedData.mobile}
            </p>
          )}
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

export default ViewEditUniversity;
