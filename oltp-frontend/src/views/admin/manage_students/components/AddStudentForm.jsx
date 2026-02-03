import { Select, message } from "antd";
import { AuthContext } from "components/Auth-context";
import React, { useContext, useEffect, useState } from "react";

const AddStudentForm = ({ onSubmit, onCancel }) => {
  const auth = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    fatherName: "",
    fatherNumber: "",
    motherName: "",
    motherNumber: "",
    email: "",
    password: "",
    batch: "",
    address: "",
    pincode: "",
    state: "",
    country: "",
    admissionDate: "",
    image: null,
  });
  const [batches, setBatches] = useState([]);
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/batch/get/all/batches`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setBatches(data.batches);
      } catch (err) {}
    };
    fetchBatches();
  }, [batches]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSelectChange = (value, option) => {
    setFormData((prevData) => ({
      ...prevData,
      batch: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
    message.success("Image added successfully, please submit the form");
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      for (let key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/student/create/student`,
        {
          method: "POST",
          body: formDataToSend,
          headers: { Authorization: "Bearer " + auth.token },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      message.success("Student created successfully");

      setFormData({
        firstName: "",
        lastName: "",
        studentId: "",
        fatherName: "",
        fatherNumber: "",
        motherName: "",
        motherNumber: "",
        email: "",
        password: "",
        batch: "",
        address: "",
        pincode: "",
        state: "",
        country: "",
        admissionDate: "",
        image: null,
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
        Add Student
      </h2>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
        style={{ color: "black" }}
        className="mb-4 w-full rounded-md border border-gray-300 p-3 text-white dark:bg-navy-700"
      />
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        style={{ color: "black" }}
        className="mb-4 w-full rounded-md border border-gray-300 p-3 text-white dark:bg-navy-700"
      />
      <input
        type="text"
        name="studentId"
        value={formData.studentId}
        onChange={handleChange}
        placeholder="Roll No"
        style={{ color: "black" }}
        className="mb-4 w-full rounded-md border border-gray-300 p-3 text-white dark:bg-navy-700"
      />
      <input
        type="text"
        name="fatherName"
        value={formData.fatherName}
        onChange={handleChange}
        placeholder="Father Name"
        style={{ color: "black" }}
        className="mb-4 w-full rounded-md border border-gray-300 p-3 text-white dark:bg-navy-700"
      />
      <input
        type="number"
        name="fatherNumber"
        value={formData.fatherNumber}
        onChange={handleChange}
        placeholder="Father Number"
        style={{ color: "black" }}
        className="mb-4 w-full rounded-md border border-gray-300 p-3 text-white dark:bg-navy-700"
      />
      <input
        type="text"
        name="motherName"
        value={formData.motherName}
        onChange={handleChange}
        placeholder="Mother Name"
        style={{ color: "black" }}
        className="mb-4 w-full rounded-md border border-gray-300 p-3 text-white dark:bg-navy-700"
      />
      <input
        type="number"
        name="motherNumber"
        value={formData.motherNumber}
        onChange={handleChange}
        placeholder="Mother Number"
        style={{ color: "black" }}
        className="mb-4 w-full rounded-md border border-gray-300 p-3 text-white dark:bg-navy-700"
      />
      <input
        type="text"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        style={{ color: "black" }}
        className="mb-4 w-full rounded-md border border-gray-300 p-3 text-white dark:bg-navy-700"
      />
      <input
        type="text"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        style={{ color: "black" }}
        className="mb-4 w-full rounded-md border border-gray-300 p-3 text-white dark:bg-navy-700"
      />

      <div className="mb-4">
        <strong>Batch:</strong>

        <br />
        <Select
          style={{ width: "100%" }}
          value={formData.batch}
          name="batch"
          onChange={handleSelectChange}
        >
          {batches.map((batch) => (
            <Select.Option value={batch.batchName}>
              {batch.batchName}
            </Select.Option>
          ))}
        </Select>
      </div>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        style={{ color: "black" }}
        className="mb-4 w-full rounded-md border border-gray-300 p-3 text-white dark:bg-navy-700"
      />
      <input
        type="text"
        name="pincode"
        value={formData.pincode}
        onChange={handleChange}
        placeholder="Pincode"
        style={{ color: "black" }}
        className="mb-4 w-full rounded-md border border-gray-300 p-3 text-white dark:bg-navy-700"
      />
      <input
        type="text"
        name="state"
        value={formData.state}
        onChange={handleChange}
        placeholder="State"
        style={{ color: "black" }}
        className="mb-4 w-full rounded-md border border-gray-300 p-3 text-white dark:bg-navy-700"
      />
      <input
        type="text"
        name="country"
        value={formData.country}
        onChange={handleChange}
        placeholder="Country"
        style={{ color: "black" }}
        className="mb-4 w-full rounded-md border border-gray-300 p-3 text-white dark:bg-navy-700"
      />
      <strong>Date of Admission:</strong>
      <input
        type="date"
        className="mb-4 w-full rounded-md border border-gray-300 p-3 text-white dark:bg-navy-700"
        name="admissionDate"
        value={formData.admissionDate}
        onChange={handleChange}
        style={{ color: "black" }}
        placeholder="Admission Date"
      />
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleImageChange}
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
