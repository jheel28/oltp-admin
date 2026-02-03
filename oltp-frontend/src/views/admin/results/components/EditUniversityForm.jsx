import React, { useState } from "react";

const EditUniversityForm = ({ universityData, onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    universityName: universityData.name,
    email: "", 
    address: "", 
    batches: "",
    logo: null, 
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    // Handle logo change if needed
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation logic can be added here
    onSubmit(formData);
  };

  return (
    <div>
      <h2>Edit University</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="universityName">University Name:</label>
          <input
            type="text"
            id="universityName"
            name="universityName"
            value={formData.universityName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="batches">Batches:</label>
          <input
            type="text"
            id="batches"
            name="batches"
            value={formData.batches}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="logo">Logo:</label>
          <input
            type="file"
            id="logo"
            name="logo"
            onChange={handleLogoChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditUniversityForm;
