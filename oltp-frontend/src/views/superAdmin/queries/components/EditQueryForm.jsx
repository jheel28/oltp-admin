import React, { useState } from "react";
import { FaCheckCircle, FaClock, FaBan } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";


const EditQueryForm = ({ onSubmit, onCancel }) => {
  const [status, setStatus] = useState("Pending");

  const handleSave = () => {
    // Add logic to save the updated information
    onSubmit({ status });
  };

  const getStatusIcon = () => {
    switch (status.toLowerCase()) {
      case "pending":
        return <FaClock className="text-xl text-yellow-500" />;
      case "rejected":
        return <TiDelete className="text-xl text-red-500" />;
      case "in progress":
        return <FaClock className="text-xl text-blue-500" />;
      case "resolved":
        return <FaCheckCircle className="text-xl text-green-500" />;
      default:
        return <FaBan className="text-xl text-gray-500" />;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit Query</h2>

      {/* Other form fields go here */}

      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-600">
          Status:
        </label>
        <div className="flex items-center">
          {getStatusIcon()}
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="ml-2 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-blue-500 dark:text-white"
          >
            <option value="Pending">Pending</option>
            <option value="Resolved">Rejected</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditQueryForm;
