import React, { useState } from "react";
import { Steps, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import CustButton from "components/button";
import Footer from "components/footer/Footer";
import VectorImage from "assets/img/auth/College.jpg";

const { Step } = Steps;

const AdminRegister = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleNext = async () => {
    try {
      const stepFields = getStepFields(currentStep);
      await form.validateFields(stepFields);
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log("Step validation failed:", error);
      message.error("Please fill in all required fields correctly");
    }
  };

  const getStepFields = (step) => {
    switch (step) {
      case 0: return ["firstName", "lastName", "mobile"];
      case 1: return ["universityName", "address", "landmark", "pincode", "state", "country", "dateOfEstablishment"];
      case 2: return []; // Logo step
      case 3: return ["email", "password", "confirmPassword"];
      default: return [];
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // Append all form values
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'confirmPassword') {
          formData.append(key, value);
        }
      });

      // Append files
      if (logoFile) {
        formData.append("universityLogo", logoFile);
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

      const response = await fetch(`${backendUrl}/api/beta/admin/register`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        message.success("Registration successful! Please login.");
        setTimeout(() => {
          navigate("/auth/sign-in");
        }, 1500);
      } else {
        message.error(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-grow items-center justify-center">
        <div className="ml-4 mt-[6vh] flex w-full max-w-full flex-col items-center md:pl-4 xl:max-w-[750px]">
          <h4 className="mb-4 text-4xl font-bold text-navy-700 dark:text-white">
            Admin Registration
          </h4>
          <div className="mb-6 w-full px-4">
            <Steps current={currentStep} size="small">
              <Step title="Admin" />
              <Step title="University" />
              <Step title="Logo" />
              <Step title="Account" />
            </Steps>
          </div>
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            className="w-full px-4"
            preserve={true}
          >
            {/* Step 0: Admin Details */}
            <div style={{ display: currentStep === 0 ? "block" : "none" }}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="First Name" size="large" />
              </Form.Item>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="Last Name" size="large" />
              </Form.Item>
              <Form.Item
                name="mobile"
                label="Mobile Number"
                rules={[
                  { required: true, message: "Required" },
                  { len: 10, message: "Must be 10 digits" }
                ]}
              >
                <Input placeholder="Mobile Number (10 digits)" maxLength={10} size="large" />
              </Form.Item>
            </div>

            {/* Step 1: University Details */}
            <div style={{ display: currentStep === 1 ? "block" : "none" }}>
              <Form.Item
                name="universityName"
                label="University Name"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="University Name" size="large" />
              </Form.Item>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input placeholder="Address" size="large" />
                </Form.Item>
                <Form.Item
                  name="landmark"
                  label="Landmark"
                >
                  <Input placeholder="Landmark" size="large" />
                </Form.Item>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="pincode"
                  label="Pincode"
                  rules={[{ required: true, message: "Required" }, { len: 6, message: "6 digits" }]}
                >
                  <Input placeholder="Pincode" maxLength={6} size="large" />
                </Form.Item>
                <Form.Item
                  name="state"
                  label="State"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input placeholder="State" size="large" />
                </Form.Item>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="country"
                  label="Country"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input placeholder="Country" size="large" default="India" />
                </Form.Item>
                <Form.Item
                  name="dateOfEstablishment"
                  label="Date of Establishment"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input type="date" size="large" />
                </Form.Item>
              </div>
            </div>

            {/* Step 2: Uploads */}
            <div style={{ display: currentStep === 2 ? "block" : "none" }}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-white">
                  University Logo (Required)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-white">
                  Admin Profile Picture (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
              </div>
            </div>

            {/* Step 3: Account Details */}
            <div style={{ display: currentStep === 3 ? "block" : "none" }}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Required" },
                  { type: "email", message: "Invalid email" }
                ]}
              >
                <Input placeholder="Email" size="large" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Required" }, { min: 6, message: "Min 6 chars" }]}
              >
                <Input.Password placeholder="Password" size="large" />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                rules={[
                  { required: true, message: "Required" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm Password" size="large" />
              </Form.Item>
            </div>

            <div className="mb-8 mt-6 flex items-center justify-between">
              {currentStep > 0 && (
                <CustButton onClick={handlePrev} label="Previous" />
              )}
              {currentStep < 3 && (
                <CustButton
                  type="primary"
                  onClick={handleNext}
                  label="Next"
                  className="ml-auto"
                />
              )}
              {currentStep === 3 && (
                <CustButton
                  type="primary"
                  htmlType="submit"
                  label={loading ? "Registering..." : "Register"}
                  disabled={loading}
                  className="ml-auto"
                />
              )}
            </div>
          </Form>
          <div className="">
            <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
              Already have an account?
            </span>
            <a
              href="/auth/sign-in"
              className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            >
              Sign In
            </a>
          </div>
        </div>
        <div className="ml-10 hidden md:block mr-4">
          <img src={VectorImage} alt="Vector Image" className="max-w-[300px] rounded-2xl shadow-xl" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminRegister;