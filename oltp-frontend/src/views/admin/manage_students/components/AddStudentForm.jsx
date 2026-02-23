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
    motherName: "",
    phoneNumber: "",
    alternateNumber: "",
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/batch/get/all/batches`
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setBatches(data.batches || []);
      } catch (err) {
        message.error("Failed to load batches");
      }
    };
    fetchBatches();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, batch: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      message.success("Image selected");
    }
  };

  const handleSubmit = async () => {
    if (!formData.image) {
      message.error("Please upload a student image");
      return;
    }
    if (!formData.batch) {
      message.error("Please select a batch");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      for (let key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/student/create/student`,
        {
          method: "POST",
          body: formDataToSend,
          headers: { Authorization: "Bearer " + auth.token },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        message.error(responseData.message || "Failed to create student");
        return;
      }

      message.success("Student created successfully");
      setFormData({
        firstName: "",
        lastName: "",
        studentId: "",
        fatherName: "",
        motherName: "",
        phoneNumber: "",
        alternateNumber: "",
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
    } catch (error) {
      message.error("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "mb-4 w-full rounded-md border border-gray-300 p-3 dark:bg-navy-700";

  return (
    <div className="text-black bg-black rounded-lg p-6 dark:bg-navy-700">
      <h2 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
        Add Student
      </h2>
      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name *" required style={{ color: "black" }} className={inputClass} disabled={loading} />
      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name *" required style={{ color: "black" }} className={inputClass} disabled={loading} />
      <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="Student ID *" required style={{ color: "black" }} className={inputClass} disabled={loading} />
      <input type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number *" required style={{ color: "black" }} className={inputClass} disabled={loading} />
      <input type="number" name="alternateNumber" value={formData.alternateNumber} onChange={handleChange} placeholder="Alternate Number *" required style={{ color: "black" }} className={inputClass} disabled={loading} />
      <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Father's Name" style={{ color: "black" }} className={inputClass} disabled={loading} />
      <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Mother's Name" style={{ color: "black" }} className={inputClass} disabled={loading} />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email *" style={{ color: "black" }} className={inputClass} disabled={loading} />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password *" style={{ color: "black" }} className={inputClass} disabled={loading} />

      <div className="mb-4">
        <strong className="text-white">Batch * :</strong>
        <br />
        <Select
          style={{ width: "100%" }}
          value={formData.batch || undefined}
          placeholder="Select a batch"
          onChange={handleSelectChange}
          disabled={loading}
        >
          {batches.map((batch) => (
            <Select.Option key={batch._id} value={batch.batchName}>
              {batch.batchName}
            </Select.Option>
          ))}
        </Select>
      </div>

      <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address *" style={{ color: "black" }} className={inputClass} disabled={loading} />
      <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode *" style={{ color: "black" }} className={inputClass} disabled={loading} />
      <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State *" style={{ color: "black" }} className={inputClass} disabled={loading} />
      <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country *" style={{ color: "black" }} className={inputClass} disabled={loading} />

      <strong className="text-white">Date of Admission * :</strong>
      <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} style={{ color: "black" }} className={inputClass} disabled={loading} />

      <input type="file" name="image" accept="image/*" onChange={handleImageChange} className={inputClass} disabled={loading} />

      <div className="flex space-x-4">
        <button
          className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Submit"}
        </button>
        <button
          className="rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddStudentForm;