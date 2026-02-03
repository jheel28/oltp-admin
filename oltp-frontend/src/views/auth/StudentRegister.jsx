import React, { useState } from "react";
import { Steps, Form, Input, Select, Button, message } from "antd";
import InputField from "components/fields/InputField";
import CustButton from "components/button";
import Footer from "components/footer/Footer";
import VectorImage from "assets/img/auth/2.svg"; // Import your vector image

const { Step } = Steps;
const { Option } = Select;

const StudentRegister = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm(); // Add this line to create a form instance

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = (values) => {
    // Handle form submission here
    console.log("Received values:", values);
    message.success("Registration Successful");
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-grow items-center justify-center">
        <div className="ml-4 mt-[6vh] flex w-full max-w-full flex-col items-center md:pl-4 xl:max-w-[750px]">
          <h4 className="mb-4 text-4xl font-bold text-navy-700 dark:text-white">
            Register
          </h4>
          <div className="mb-2 w-full">
            <Steps current={currentStep}>
              <Step title="Personal Information" />
              <Step title="Academic Details" />
              <Step title="Address Details" />
              <Step title="Other Details" />
              <Step title="Upload Image" />
            </Steps>
          </div>
          <Form
            form={form} // Add this line to bind the form instance
            name="register"
            onFinish={onFinish}
            initialValues={{ remember: true }}
            className="w-full"
          >
            {currentStep === 0 && (
              <>
                <InputField
                  placeholder="Full Name"
                  className="mb-4"
                  autoFocus
                />
                <InputField placeholder="Student ID" className="mb-4" />
                <InputField type="email" placeholder="Email" className="mb-4" />
                <InputField
                  type="password"
                  placeholder="Password"
                  className="mb-4"
                />
              </>
            )}
            {currentStep === 1 && (
              <>
                <Form.Item name="college">
                  {" "}
                  {/* Wrap with Form.Item */}
                  <Select placeholder="Select College" className="mb-4 w-full">
                    <Option value="college1">College 1</Option>
                    <Option value="college2">College 2</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
                {/* Additional InputField for entering College Name if "Other" is selected */}
                {/* Conditionally render this field based on selection */}
                {form.getFieldValue("college") === "other" && (
                  <InputField
                    placeholder="Enter College Name"
                    className="mb-4"
                  />
                )}
                <InputField placeholder="Batch" className="mb-4" />
              </>
            )}
            {currentStep === 2 && (
              <>
                <InputField placeholder="Address" className="mb-4" />
                <InputField placeholder="Pincode" className="mb-4" />
                <InputField placeholder="State" className="mb-4" />
                <InputField placeholder="Country" className="mb-4" />
              </>
            )}
            {currentStep === 3 && (
              <>
                <InputField placeholder="Mother's Name" className="mb-4" />
                <InputField placeholder="Mother's Number" className="mb-4" />
                <InputField placeholder="Father's Name" className="mb-4" />
                <InputField placeholder="Father's Number" className="mb-4" />
              </>
            )}
            {currentStep === 4 && (
              <>
                <Input
                  type="file"
                  placeholder="Upload Image"
                  className="mb-4"
                />
                <InputField placeholder="Admission Date" className="mb-4" />
              </>
            )}
            <div className="mb-8 flex items-center justify-between">
              {currentStep > 0 && (
                <CustButton onClick={handlePrev} label="Previous" />
              )}
              {currentStep < 4 && (
                <CustButton type="primary" onClick={handleNext} label="Next" />
              )}
              {currentStep === 4 && (
                <CustButton type="primary" htmlType="submit" label="Register" />
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
          {/* Add your vector image here */}
          <img src={VectorImage} alt="Vector Image" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentRegister;
