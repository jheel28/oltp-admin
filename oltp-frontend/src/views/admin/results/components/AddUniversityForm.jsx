import React, { useState } from "react";

const AddUniversityForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    universityName: "",
    email: "",
    address: "",
    batches: "",
    logo: null,
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation logic if needed

    // Call the onSubmit prop with the form data
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-4 rounded shadow-md dark:bg-navy-600">
      <h1 className="text-lg font-bold mb-4">Add University</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="universityName" className="block text-sm font-bold mb-2 dark:bg-navy-600">
            University Name
          </label>
          <input
            type="text"
            id="universityName"
            name="universityName"
            value={formData.universityName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-navy-600"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-bold mb-2 dark:bg-navy-600 ">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-navy-600"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-bold mb-2 dark:bg-navy-600">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-navy-600"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="batches" className="block text-sm font-bold mb-2 dark:bg-navy-600">
            Batches (comma separated)
          </label>
          <input
            type="text"
            id="batches"
            name="batches"
            value={formData.batches}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-navy-600"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="logo" className="block text-sm font-bold mb-2 dark:bg-navy-600">
            Logo
          </label>
          <input
            type="file"
            id="logo"
            name="logo"
            onChange={handleChange}
            accept="image/*"
            className="w-full px-3 py-2 border rounded dark:bg-navy-600"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-bold mb-2 dark:bg-navy-600">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-navy-600"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-bold mb-2 dark:bg-navy-600">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded dark:bg-navy-600"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded-full mr-2"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-full">
            Add University
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUniversityForm;
