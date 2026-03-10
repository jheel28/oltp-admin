import { Select, message } from "antd";
import { AuthContext } from "components/Auth-context";
import React, { useContext, useEffect, useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "components/PhoneInput";

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
  const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/batch/get/all/batches`
        );
        if (!response.ok) throw new Error();
        const data = await response.json();
        setBatches(data.batches || []);
      } catch {
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
      if (file.size > MAX_IMAGE_BYTES) {
        message.error("Student Photo must be 5MB or smaller");
        e.target.value = null;
        setFormData((prev) => ({ ...prev, image: null }));
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const validateForm = () => {
    const missing = [];

    if (!formData.phoneNumber) {
      missing.push("Phone Number");
    } else if (!isValidPhoneNumber(formData.phoneNumber)) {
      missing.push("Phone Number (invalid format)");
    }

    if (formData.alternateNumber && formData.alternateNumber.trim()) {
      if (!isValidPhoneNumber(formData.alternateNumber)) {
        missing.push("Alternate Number (invalid format)");
      }
    }

    if (!formData.batch) missing.push("Batch");

    if (!formData.image) missing.push("Student Photo");

    if (formData.image && formData.image.size > MAX_IMAGE_BYTES) {
      missing.push("Student Photo (must be <= 5MB)");
    }

    if (missing.length > 0) {
      message.error(`Please fix: ${missing.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = new FormData();
      for (let key in formData) {
        const val = formData[key];
        // Skip empty alternateNumber – let it default to null on the server
        if (key === "alternateNumber" && (!val || !val.trim())) continue;
        if (val !== null && val !== undefined && val !== "") {
          payload.append(key, val);
        }
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/student/create/student`,
        {
          method: "POST",
          body: payload,
          headers: { Authorization: "Bearer " + auth.token },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        message.error(responseData.message || "Failed to create student");
        return;
      }

      message.success("Student created successfully");
      onSubmit(responseData);
    } catch {
      message.error("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mb-4 w-full rounded-md border border-gray-300 p-3 text-black dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="rounded-lg bg-white p-6 dark:bg-navy-700">
      <h2 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">Add Student</h2>

      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name *"
          required
          className={inputClass}
          disabled={loading}
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name *"
          required
          className={inputClass}
          disabled={loading}
        />
      </div>

      <input
        type="text"
        name="studentId"
        value={formData.studentId}
        onChange={handleChange}
        placeholder="Student ID *"
        required
        className={inputClass}
        disabled={loading}
      />

      <PhoneInput
        label="Phone Number"
        required
        value={formData.phoneNumber}
        onChange={(val) => setFormData((prev) => ({ ...prev, phoneNumber: val || "" }))}
        disabled={loading}
        showValidation={submitted}
        placeholder="Phone number *"
      />

      <div className="mb-4">
        <PhoneInput
          label={
            <span>
              Alternate Number{" "}
              <span className="ml-1 text-xs font-normal text-gray-400">(optional)</span>
            </span>
          }
          value={formData.alternateNumber}
          onChange={(val) => setFormData((prev) => ({ ...prev, alternateNumber: val || "" }))}
          disabled={loading}
          showValidation={
            submitted &&
            !!formData.alternateNumber &&
            !!formData.alternateNumber.trim()
          }
          placeholder="Alternate number (optional)"
        />
      </div>

      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
        <input
          type="text"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
          placeholder="Father's Name (optional)"
          className={inputClass}
          disabled={loading}
        />
        <input
          type="text"
          name="motherName"
          value={formData.motherName}
          onChange={handleChange}
          placeholder="Mother's Name (optional)"
          className={inputClass}
          disabled={loading}
        />
      </div>

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email *"
        className={inputClass}
        disabled={loading}
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password *"
        className={inputClass}
        disabled={loading}
      />

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
          Batch <span className="text-red-500">*</span>
        </label>
        <Select
          style={{ width: "100%" }}
          value={formData.batch || undefined}
          placeholder="Select a batch"
          onChange={handleSelectChange}
          disabled={loading}
          status={submitted && !formData.batch ? "error" : ""}
        >
          {batches.map((batch) => (
            <Select.Option key={batch._id} value={batch.batchName}>
              {batch.batchName}
            </Select.Option>
          ))}
        </Select>
        {submitted && !formData.batch && (
          <p className="mt-1 text-xs text-red-500">Batch is required</p>
        )}
      </div>

      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address *"
        className={inputClass}
        disabled={loading}
      />

      <div className="grid grid-cols-1 gap-0 sm:grid-cols-3 sm:gap-4">
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="Pincode *"
          className={inputClass}
          disabled={loading}
        />
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State *"
          className={inputClass}
          disabled={loading}
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country *"
          className={inputClass}
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
          Date of Admission <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="admissionDate"
          value={formData.admissionDate}
          onChange={handleChange}
          className={inputClass}
          disabled={loading}
        />
      </div>

      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
          Student Photo <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className={`w-full rounded-md border p-3 text-sm ${
            submitted && !formData.image ? "border-red-500" : "border-gray-300"
          }`}
          disabled={loading}
        />
        <p className="mt-1 text-xs text-gray-500">Max file size: 5 MB. JPG/PNG only.</p>
        {submitted && !formData.image && (
          <p className="mt-1 text-xs text-red-500">Student Photo is required</p>
        )}
        {formData.image && (
          <p className="mt-1 text-xs text-green-600">Selected: {formData.image.name}</p>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          className="rounded-full bg-blue-500 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Submit"}
        </button>
        <button
          className="rounded-full bg-red-500 px-6 py-2 text-white hover:bg-red-700 disabled:opacity-50"
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