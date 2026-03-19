import { message } from "antd";
import { AuthContext } from "components/Auth-context";
import React, { useContext, useState } from "react";

const AddBatchForm = ({ onSubmit, onCancel }) => {
  const auth = useContext(AuthContext);
  const [formData, setFormData] = useState({
    batchName: "",
    sectionName: [],
    studentId: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log("Original formData:", formData);

      // Prepare payload: split strings into arrays for sectionName and studentId
      const payload = {
        ...formData,
        sectionName: typeof formData.sectionName === 'string'
          ? formData.sectionName.split(',').map(s => s.trim()).filter(s => s !== "")
          : formData.sectionName,
        studentId: typeof formData.studentId === 'string'
          ? formData.studentId.split(',').map(s => s.trim()).filter(s => s !== "")
          : formData.studentId
      };

      console.log("Sending payload:", payload);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/batch/create/batch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      message.success("Batch created successfully");

      setFormData({
        batchName: "",
        sectionName: [],
        studentId: [],
      });
      onSubmit(responseData);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 dark:bg-navy-700 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
        Add New Batch
      </h2>
      <div className="mb-4">
        <label className="text-sm font-bold text-gray-700 dark:text-white">Batch Name</label>
        <input
          type="text"
          name="batchName"
          value={formData.batchName}
          onChange={handleChange}
          placeholder="e.g. 2024-CSE-A"
          className="mt-1 w-full rounded-md border border-gray-300 p-3 text-navy-700 dark:bg-navy-700 dark:text-white"
        />
      </div>
      <div className="mb-4">
        <label className="text-sm font-bold text-gray-700 dark:text-white">Sections (comma separated)</label>
        <input
          type="text"
          name="sectionName"
          value={formData.sectionName}
          onChange={handleChange}
          placeholder="e.g. A, B, C"
          className="mt-1 w-full rounded-md border border-gray-300 p-3 text-navy-700 dark:bg-navy-700 dark:text-white"
        />
      </div>
      <div className="mb-4">
        <label className="text-sm font-bold text-gray-700 dark:text-white">Student Roll Numbers (comma separated)</label>
        <input
          type="text"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          placeholder="e.g. 101, 102, 103"
          className="mt-1 w-full rounded-md border border-gray-300 p-3 text-navy-700 dark:bg-navy-700 dark:text-white"
        />
      </div>

      <div className="flex space-x-4">
        <button
          className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button
          className="rounded-full bg-red-500 px-4 py-2 text-white hover:bg-blue-700"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddBatchForm;
 