import { message } from "antd";
import { AuthContext } from "components/Auth-context";
import React, { useContext, useState } from "react";

const AddStudentForm = ({ onSubmit, onCancel }) => {
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
      const formDataToSend = new FormData();
      for (let key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      console.log(formData);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/batch/create/batch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify(formData),
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
    <div className="text-black bg-black rounded-lg p-6 dark:bg-navy-700">
      <h2 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
        Add Batch
      </h2>
      <input
        type="text"
        name="batchName"
        value={formData.batchName}
        onChange={handleChange}
        placeholder="Batch Name"
        style={{ color: "black" }}
        className="mb-4 w-full rounded-md border border-gray-300 p-3 text-white dark:bg-navy-700"
      />
      <input
        type="text"
        name="sectionName"
        value={formData.sectionName}
        onChange={handleChange}
        placeholder="Sections "
        style={{ color: "black" }}
        className="mb-4 w-full rounded-md border border-gray-300 p-3 text-white dark:bg-navy-700"
      />
      <input
        type="text"
        name="studentId"
        value={formData.studentId}
        onChange={handleChange}
        placeholder="Student's Roll numbers"
        style={{ color: "black" }}
        className="mb-4 w-full rounded-md border border-gray-300 p-3 text-white dark:bg-navy-700"
      />

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

export default AddStudentForm;
