import React, { useState } from "react";
import { Steps, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import CustButton from "components/button";
import Footer from "components/footer/Footer";
import VectorImage from "assets/img/auth/2.svg";

const { Step } = Steps;

const StudentRegister = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleNext = async () => {
    try {
      // Validate current step fields before proceeding
      // We only validate the fields in the current step to avoid blocking navigation
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
      case 0: return ["firstName", "lastName", "email", "password"];
      case 1: return ["studentId", "batch", "admissionDate"];
      case 2: return ["address", "pincode", "state", "country"];
      case 3: return ["fatherName", "fatherNumber", "motherName", "motherNumber"];
      default: return [];
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const onFinish = async (values) => {
    console.log("Form values captured in onFinish:", values);
    setLoading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add all form fields
      // Using Object.entries ensures we capture everything currently in the values object
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Special handling for admissionDate if it's missing (though it should be the current date usually)
      if (!values.admissionDate) {
        formData.append("admissionDate", new Date().toISOString().split('T')[0]);
      }

      // Add image if provided
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5005";
      console.log("Sending payload to:", `${backendUrl}/api/beta/student/register`);

      const response = await fetch(`${backendUrl}/api/beta/student/register`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        message.success("Registration successful! You can now login.");
        setTimeout(() => {
          navigate("/auth/sign-in");
        }, 1500);
      } else {
        console.error("Backend error response:", data);
        message.error(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration request error:", error);
      message.error("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-grow items-center justify-center">
        <div className="ml-4 mt-[6vh] flex w-full max-w-full flex-col items-center md:pl-4 xl:max-w-[750px]">
          <h4 className="mb-4 text-4xl font-bold text-navy-700 dark:text-white">
            Student Registration
          </h4>
          <div className="mb-2 w-full">
            <Steps current={currentStep}>
              <Step title="Personal Info" />
              <Step title="Academic Details" />
              <Step title="Address" />
              <Step title="Parent Details" />
              <Step title="Final Step" />
            </Steps>
          </div>
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            className="w-full"
            preserve={true}
          >
            {/* 
              Using display: none instead of conditional rendering to ensure 
              Ant Design Form keeps track of all fields and values throughout the wizard steps.
            */}

            {/* Step 0: Personal Info */}
            <div style={{ display: currentStep === 0 ? "block" : "none" }}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: "Please enter your first name" }]}
              >
                <Input placeholder="First Name" size="large" />
              </Form.Item>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: "Please enter your last name" }]}
              >
                <Input placeholder="Last Name" size="large" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" }
                ]}
              >
                <Input type="email" placeholder="Email" size="large" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter your password" },
                  { min: 6, message: "Password must be at least 6 characters" }
                ]}
              >
                <Input.Password placeholder="Password (min 6 characters)" size="large" />
              </Form.Item>
            </div>

            {/* Step 1: Academic Details */}
            <div style={{ display: currentStep === 1 ? "block" : "none" }}>
              <Form.Item
                name="studentId"
                label="Student ID"
                rules={[{ required: true, message: "Please enter your student ID" }]}
              >
                <Input placeholder="Student ID" size="large" />
              </Form.Item>
              <Form.Item
                name="batch"
                label="Batch"
                rules={[{ required: true, message: "Please enter your batch" }]}
              >
                <Input placeholder="Batch (e.g., 2024 or Batch A)" size="large" />
              </Form.Item>
              <Form.Item name="admissionDate" label="Admission Date">
                <Input type="date" size="large" />
              </Form.Item>
            </div>

            {/* Step 2: Address */}
            <div style={{ display: currentStep === 2 ? "block" : "none" }}>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: "Please enter your address" }]}
              >
                <Input.TextArea placeholder="Address" rows={3} size="large" />
              </Form.Item>
              <Form.Item
                name="pincode"
                label="Pincode"
                rules={[
                  { required: true, message: "Please enter your pincode" },
                  { len: 6, message: "Pincode must be 6 digits" }
                ]}
              >
                <Input placeholder="Pincode (6 digits)" maxLength={6} size="large" />
              </Form.Item>
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: "Please enter your state" }]}
              >
                <Input placeholder="State" size="large" />
              </Form.Item>
              <Form.Item
                name="country"
                label="Country"
                rules={[{ required: true, message: "Please enter your country" }]}
              >
                <Input placeholder="Country" size="large" />
              </Form.Item>
            </div>

            {/* Step 3: Parent Details */}
            <div style={{ display: currentStep === 3 ? "block" : "none" }}>
              <Form.Item
                name="fatherName"
                label="Father's Name"
                rules={[{ required: true, message: "Please enter your father's name" }]}
              >
                <Input placeholder="Father's Name" size="large" />
              </Form.Item>
              <Form.Item
                name="fatherNumber"
                label="Father's Phone Number"
                rules={[
                  { required: true, message: "Please enter your father's number" },
                  { len: 10, message: "Phone number must be 10 digits" }
                ]}
              >
                <Input placeholder="Father's Phone (10 digits)" maxLength={10} size="large" />
              </Form.Item>
              <Form.Item
                name="motherName"
                label="Mother's Name"
                rules={[{ required: true, message: "Please enter your mother's name" }]}
              >
                <Input placeholder="Mother's Name" size="large" />
              </Form.Item>
              <Form.Item
                name="motherNumber"
                label="Mother's Phone Number"
                rules={[
                  { required: true, message: "Please enter your mother's number" },
                  { len: 10, message: "Phone number must be 10 digits" }
                ]}
              >
                <Input placeholder="Mother's Phone (10 digits)" maxLength={10} size="large" />
              </Form.Item>
            </div>

            {/* Step 4: Final Step */}
            <div style={{ display: currentStep === 4 ? "block" : "none" }}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-white">
                  Profile Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
                {imageFile && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {imageFile.name}
                  </p>
                )}
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-800">
                <h5 className="mb-2 font-semibold text-navy-700 dark:text-white">
                  Almost Done!
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please review all your details. If everything looks correct, click "Register" to create your account.
                </p>
              </div>
            </div>

            <div className="mb-8 mt-6 flex items-center justify-between">
              {currentStep > 0 && (
                <CustButton onClick={handlePrev} label="Previous" />
              )}
              {currentStep < 4 && (
                <CustButton
                  type="primary"
                  onClick={handleNext}
                  label="Next"
                  className="ml-auto"
                />
              )}
              {currentStep === 4 && (
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
        <div className="ml-10 hidden md:block">
          <img src={VectorImage} alt="Vector Image" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentRegister;
