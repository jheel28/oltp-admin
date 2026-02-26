import React, { useState, useEffect } from "react";
import { Steps, Form, Input, message, Select } from "antd";
import { useNavigate, Link } from "react-router-dom";
import Footer from "components/footer/Footer";
import logo from "assets/img/Logo/correct.png";
import PhoneInput, { isValidPhoneNumber } from "components/PhoneInput";

const { Option } = Select;

const StudentRegister = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [batches, setBatches] = useState([]);
  const [phones, setPhones] = useState({ phoneNumber: "", alternateNumber: "" });
  const [phoneErrors, setPhoneErrors] = useState({ phoneNumber: false, alternateNumber: false });
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
        const response = await fetch(`${backendUrl}/api/v1/batch/get/all/batches`);
        if (!response.ok) throw new Error("Failed to fetch batches");
        const data = await response.json();
        setBatches(data.batches || []);
      } catch {
        message.error("Could not load batches. Please refresh.");
      }
    };
    fetchBatches();
  }, []);

  const stepFields = [
    ["firstName", "lastName", "email", "password", "confirmPassword"],
    ["studentId", "batch", "admissionDate", "address", "pincode", "state", "country"],
  ];

  const validatePhones = () => {
    const errors = {
      phoneNumber: !phones.phoneNumber || !isValidPhoneNumber(phones.phoneNumber),
      alternateNumber: !phones.alternateNumber || !isValidPhoneNumber(phones.alternateNumber),
    };
    setPhoneErrors(errors);
    return !errors.phoneNumber && !errors.alternateNumber;
  };

  const handleNext = async () => {
    try {
      await form.validateFields(stepFields[currentStep] || []);
      setCurrentStep((s) => s + 1);
    } catch {
      message.error("Please fill in all required fields correctly");
    }
  };

  const handlePrev = () => setCurrentStep((s) => s - 1);

  const onFinish = async (values) => {
    if (!validatePhones()) {
      message.error("Please enter valid phone numbers");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("studentId", values.studentId);
      formData.append("batch", values.batch);
      formData.append("admissionDate", values.admissionDate || new Date().toISOString().split("T")[0]);
      formData.append("address", values.address);
      formData.append("pincode", values.pincode);
      formData.append("state", values.state);
      formData.append("country", values.country);
      formData.append("phoneNumber", phones.phoneNumber);
      formData.append("alternateNumber", phones.alternateNumber);
      if (values.fatherName) formData.append("fatherName", values.fatherName);
      if (values.motherName) formData.append("motherName", values.motherName);
      if (imageFile) formData.append("image", imageFile);

      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/v1/student/signup`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        if (data.requiresVerification) {
          message.success("Registration successful! Please check your email to verify your account.");
          setTimeout(() => navigate("/auth/verify-email-sent"), 1500);
        } else {
          message.success("Registration successful! You can now log in.");
          setTimeout(() => navigate("/auth/sign-in"), 1500);
        }
      } else {
        message.error(data.message || "Registration failed. Please try again.");
      }
    } catch {
      message.error("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full";

  return (
    <div className="flex min-h-screen flex-col dark:!bg-navy-900">
      <div className="flex flex-grow">
        <div className="flex w-full flex-col items-center justify-center px-6 py-12 md:w-[55%] lg:w-[50%]">
          <div className="w-full max-w-[520px]">
            <div className="mb-6">
              <h4 className="mb-1 text-3xl font-bold text-navy-700 dark:text-white">Student Registration</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create your account to access tests and results.
              </p>
            </div>

            <div className="mb-8">
              <Steps current={currentStep} size="small" responsive={false}>
                <Steps.Step title="Personal" />
                <Steps.Step title="Academic" />
                <Steps.Step title="Contact" />
              </Steps>
            </div>

            <Form form={form} name="student-register" onFinish={onFinish} layout="vertical" preserve>
              <div style={{ display: currentStep === 0 ? "block" : "none" }}>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: "Required" }]}>
                    <Input placeholder="First name" size="large" />
                  </Form.Item>
                  <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: "Required" }]}>
                    <Input placeholder="Last name" size="large" />
                  </Form.Item>
                </div>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: "Required" }, { type: "email", message: "Invalid email" }]}
                >
                  <Input type="email" placeholder="you@example.com" size="large" />
                </Form.Item>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: "Required" }, { min: 6, message: "Minimum 6 characters" }]}
                  >
                    <Input.Password placeholder="Min. 6 characters" size="large" />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    rules={[
                      { required: true, message: "Required" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) return Promise.resolve();
                          return Promise.reject(new Error("Passwords do not match"));
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Repeat password" size="large" />
                  </Form.Item>
                </div>
              </div>

              <div style={{ display: currentStep === 1 ? "block" : "none" }}>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item name="studentId" label="Student ID" rules={[{ required: true, message: "Required" }]}>
                    <Input placeholder="Your student ID" size="large" />
                  </Form.Item>
                  <Form.Item name="batch" label="Batch" rules={[{ required: true, message: "Required" }]}>
                    <Select placeholder="Select batch" size="large">
                      {batches.map((b) => (
                        <Option key={b._id} value={b.batchName}>{b.batchName}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <Form.Item name="admissionDate" label="Admission Date" rules={[{ required: true, message: "Required" }]}>
                  <Input type="date" size="large" />
                </Form.Item>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true, message: "Required" }, { min: 2, message: "Too short" }]}
                >
                  <Input.TextArea placeholder="Full address" rows={2} />
                </Form.Item>
                <div className="grid grid-cols-3 gap-4">
                  <Form.Item
                    name="pincode"
                    label="Pincode"
                    rules={[{ required: true, message: "Required" }, { pattern: /^\d{4,10}$/, message: "Invalid pincode" }]}
                  >
                    <Input placeholder="Pincode" size="large" />
                  </Form.Item>
                  <Form.Item name="state" label="State" rules={[{ required: true, message: "Required" }]}>
                    <Input placeholder="State" size="large" />
                  </Form.Item>
                  <Form.Item name="country" label="Country" rules={[{ required: true, message: "Required" }]}>
                    <Input placeholder="Country" size="large" />
                  </Form.Item>
                </div>
              </div>

              <div style={{ display: currentStep === 2 ? "block" : "none" }}>
                <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
                  <PhoneInput
                    label="Phone Number"
                    required
                    value={phones.phoneNumber}
                    onChange={(val) => {
                      setPhones((prev) => ({ ...prev, phoneNumber: val || "" }));
                      if (phoneErrors.phoneNumber) setPhoneErrors((prev) => ({ ...prev, phoneNumber: false }));
                    }}
                    showValidation={phoneErrors.phoneNumber}
                    placeholder="Your phone number"
                  />
                  <PhoneInput
                    label="Alternate Number"
                    required
                    value={phones.alternateNumber}
                    onChange={(val) => {
                      setPhones((prev) => ({ ...prev, alternateNumber: val || "" }));
                      if (phoneErrors.alternateNumber) setPhoneErrors((prev) => ({ ...prev, alternateNumber: false }));
                    }}
                    showValidation={phoneErrors.alternateNumber}
                    placeholder="Alternate number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Form.Item name="fatherName" label={<span>Father's Name <span className="text-gray-400 font-normal text-xs">(optional)</span></span>}>
                    <Input placeholder="Father's name" size="large" />
                  </Form.Item>
                  <Form.Item name="motherName" label={<span>Mother's Name <span className="text-gray-400 font-normal text-xs">(optional)</span></span>}>
                    <Input placeholder="Mother's name" size="large" />
                  </Form.Item>
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-navy-700 dark:text-white">
                    Profile Photo{" "}
                    <span className="text-gray-400 font-normal">(optional — you can add this later from your profile)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) => setImageFile(e.target.files[0] || null)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                  />
                  {imageFile && (
                    <p className="mt-1 text-xs text-green-600">Selected: {imageFile.name}</p>
                  )}
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 dark:border-navy-600 dark:bg-navy-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    After registering, a verification email will be sent to your address. Click the link to activate your account before logging in.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-800 dark:text-white dark:hover:bg-navy-700"
                  >
                    Back
                  </button>
                )}
                {currentStep < 2 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="linear ml-auto rounded-xl bg-brand-500 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="linear ml-auto rounded-xl bg-brand-500 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </button>
                )}
              </div>
            </Form>

            <p className="mt-6 text-sm font-medium text-navy-700 dark:text-gray-500">
              Already have an account?{" "}
              <Link to="/auth/sign-in" className="font-bold text-brand-500 hover:text-brand-600 dark:text-white">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden items-center justify-center bg-[#F4F7FE] dark:bg-navy-900 md:flex md:w-[45%] lg:w-[50%]">
          <img
            src={logo}
            alt="The Correct Steps"
            className="max-h-[420px] max-w-[420px] object-contain"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentRegister;