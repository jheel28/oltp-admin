import React, { useState, useEffect } from "react";
import { Steps, Form, Input, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import Footer from "components/footer/Footer";
import logo from "assets/img/Logo/correct.png";

const { Step } = Steps;
const { Option } = Select;

const StudentRegister = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageAttempted, setImageAttempted] = useState(false);
  const [batches, setBatches] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const backendUrl =
          process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
        const response = await fetch(
          `${backendUrl}/api/v1/batch/get/all/batches`
        );
        if (!response.ok) throw new Error("Failed to fetch batches");
        const data = await response.json();
        setBatches(data.batches || []);
      } catch (err) {
        message.error("Could not load batches. Please refresh the page.");
      }
    };
    fetchBatches();
  }, []);

  const getStepFields = (step) => {
    switch (step) {
      case 0:
        return [
          "firstName",
          "lastName",
          "email",
          "password",
          "confirmPassword",
        ];
      case 1:
        return ["studentId", "batch", "admissionDate"];
      case 2:
        return ["address", "pincode", "state", "country"];
      case 3:
        return ["fatherName", "fatherNumber", "motherName", "motherNumber"];
      default:
        return [];
    }
  };

  const handleNext = async () => {
    try {
      await form.validateFields(getStepFields(currentStep));
      setCurrentStep((s) => s + 1);
    } catch {
      message.error("Please fill in all required fields correctly");
    }
  };

  const handlePrev = () => setCurrentStep((s) => s - 1);

  const onFinish = async (values) => {
    if (!imageFile) {
      setImageAttempted(true);
      message.error("A profile photo is required. Please upload one.");
      setCurrentStep(4);
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
      formData.append(
        "admissionDate",
        values.admissionDate || new Date().toISOString().split("T")[0]
      );
      formData.append("address", values.address);
      formData.append("pincode", values.pincode);
      formData.append("state", values.state);
      formData.append("country", values.country);
      formData.append("fatherName", values.fatherName);
      formData.append("motherName", values.motherName);
      formData.append("phoneNumber", values.fatherNumber);
      formData.append("alternateNumber", values.motherNumber);
      formData.append("image", imageFile);

      const backendUrl =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/v1/student/signup`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        message.success("Registration successful! You can now login.");
        setTimeout(() => navigate("/auth/sign-in"), 1500);
      } else {
        message.error(data.message || "Registration failed. Please try again.");
      }
    } catch {
      message.error("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col dark:!bg-navy-900">
      <div className="flex flex-grow">
        <div className="flex w-full flex-col items-center justify-center px-6 py-12 md:w-[55%] lg:w-[50%]">
          <div className="w-full max-w-[480px]">
            <div className="mb-6">
              <h4 className="mb-1 text-3xl font-bold text-navy-700 dark:text-white">
                Student Registration
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create your student account to access tests and results.
              </p>
            </div>

            <div className="mb-8">
              <Steps current={currentStep} size="small" responsive={false}>
                <Step title="Personal" />
                <Step title="Academic" />
                <Step title="Address" />
                <Step title="Parents" />
                <Step title="Photo" />
              </Steps>
            </div>

            <Form
              form={form}
              name="student-register"
              onFinish={onFinish}
              layout="vertical"
              preserve
            >
              <div style={{ display: currentStep === 0 ? "block" : "none" }}>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input placeholder="First name" size="large" />
                  </Form.Item>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input placeholder="Last name" size="large" />
                  </Form.Item>
                </div>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Required" },
                    { type: "email", message: "Invalid email address" },
                  ]}
                >
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: "Required" },
                    { min: 6, message: "Minimum 6 characters" },
                  ]}
                >
                  <Input.Password
                    placeholder="Min. 6 characters"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  rules={[
                    { required: true, message: "Required" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Passwords do not match")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Repeat your password"
                    size="large"
                  />
                </Form.Item>
              </div>

              <div style={{ display: currentStep === 1 ? "block" : "none" }}>
                <Form.Item
                  name="studentId"
                  label="Student ID"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input placeholder="Your student ID" size="large" />
                </Form.Item>
                <Form.Item
                  name="batch"
                  label="Batch"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Select placeholder="Select your batch" size="large">
                    {batches.map((batch) => (
                      <Option key={batch._id} value={batch.batchName}>
                        {batch.batchName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="admissionDate"
                  label="Admission Date"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input type="date" size="large" />
                </Form.Item>
              </div>

              <div style={{ display: currentStep === 2 ? "block" : "none" }}>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[
                    { required: true, message: "Required" },
                    { min: 2, message: "Too short" },
                  ]}
                >
                  <Input.TextArea placeholder="Full address" rows={3} />
                </Form.Item>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name="pincode"
                    label="Pincode"
                    rules={[
                      { required: true, message: "Required" },
                      { pattern: /^\d{6}$/, message: "Must be 6 digits" },
                    ]}
                  >
                    <Input
                      placeholder="6-digit pincode"
                      maxLength={6}
                      size="large"
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) e.preventDefault();
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="state"
                    label="State"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input placeholder="State" size="large" />
                  </Form.Item>
                </div>
                <Form.Item
                  name="country"
                  label="Country"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input placeholder="Country" size="large" />
                </Form.Item>
              </div>

              <div style={{ display: currentStep === 3 ? "block" : "none" }}>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name="fatherName"
                    label="Father's Name"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input placeholder="Father's name" size="large" />
                  </Form.Item>
                  <Form.Item
                    name="fatherNumber"
                    label="Father's Phone"
                    rules={[
                      { required: true, message: "Required" },
                      { pattern: /^\d{10}$/, message: "Must be 10 digits" },
                    ]}
                  >
                    <Input
                      placeholder="10-digit number"
                      maxLength={10}
                      size="large"
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) e.preventDefault();
                      }}
                    />
                  </Form.Item>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name="motherName"
                    label="Mother's Name"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input placeholder="Mother's name" size="large" />
                  </Form.Item>
                  <Form.Item
                    name="motherNumber"
                    label="Mother's Phone"
                    rules={[
                      { required: true, message: "Required" },
                      { pattern: /^\d{10}$/, message: "Must be 10 digits" },
                    ]}
                  >
                    <Input
                      placeholder="10-digit number"
                      maxLength={10}
                      size="large"
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) e.preventDefault();
                      }}
                    />
                  </Form.Item>
                </div>
              </div>

              <div style={{ display: currentStep === 4 ? "block" : "none" }}>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-navy-700 dark:text-white">
                    Profile Photo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) => setImageFile(e.target.files[0] || null)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                  />
                  {imageFile ? (
                    <p className="mt-1 text-xs text-green-600">
                      Selected: {imageFile.name}
                    </p>
                  ) : imageAttempted ? (
                    <p className="mt-1 text-xs text-red-500">
                      A profile photo is required
                    </p>
                  ) : null}
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-navy-600 dark:bg-navy-700">
                  <p className="text-sm font-semibold text-navy-700 dark:text-white">
                    Almost done!
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Upload your photo then click &quot;Create Account&quot; to
                    complete registration.
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
                {currentStep < 4 ? (
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
              <a
                href="/auth/sign-in"
                className="font-bold text-brand-500 hover:text-brand-600 dark:text-white"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>

        <div className="hidden items-center justify-center bg-[#F4F7FE] dark:bg-navy-900 md:flex md:w-[45%] lg:w-[50%]">
          <img
            src={logo}
            alt="The Correct Steps"
            className="max-h-[420px] max-w-[420px] object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentRegister;
