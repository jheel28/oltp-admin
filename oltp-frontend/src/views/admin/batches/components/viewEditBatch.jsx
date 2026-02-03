import { message } from "antd";
import { AuthContext } from "components/Auth-context";
import React, { useContext, useState } from "react";
import { FaPencilAlt, FaCheck } from "react-icons/fa";

const ViewEditBatch = ({ batchData, onUpdate, onBack }) => {
  const auth = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...batchData });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = async () => {
    try {
      await onFinish(editedData);
      onUpdate(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating batch:", error);
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
    } else if (name === "studentId" || name === "sectionName") {
      // Remove any leading or trailing whitespace and split the input value by commas into an array
      const valuesArray = value
        .trim()
        .split(",")
        .map((item) => item.trim());

      setEditedData((prevData) => ({
        ...prevData,
        [name]: [`${valuesArray.join(",")}`], // Wrap the values in square brackets and convert to a single string
      }));
    } else {
      // For other input fields
      setEditedData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const onFinish = async (values) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/batch/update/batch/byid/${editedData._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify(values),
        }
      );
      console.log(response.status);

      if (response.status === 200) {
        message.success("batch updated Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 200);
      } else {
        message.error("Could not update the batch, please check and try again");
      }
      console.log(values);
    } catch (err) {
      console.log(err);
      message.error("Could not update the batch, please check and try again");
    }
  };

  return (
    <div className="flex">
      <div className="w-2/3 bg-white p-6 dark:bg-navy-700">
        <h2 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
          Batch Details
        </h2>
        <div className="mb-4">
          <label className="text-sm text-gray-600">Batch Name</label>
          {isEditing ? (
            <input
              type="text"
              name="batchName"
              value={editedData.batchName}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
            />
          ) : (
            <p className="text-base font-medium text-navy-700 dark:text-white">
              {editedData.batchName}
            </p>
          )}
          <label className="text-sm text-gray-600">Section Names</label>
          {isEditing ? (
            <input
              type="text"
              name="sectionName"
              value={editedData.sectionName}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
            />
          ) : (
            <p className="text-base font-medium text-navy-700 dark:text-white">
              {editedData.sectionName}
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
        </div>{" "}
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

export default ViewEditBatch;
