import React, { useState } from 'react';
import { Steps, Form, Input, Select, Button, message } from 'antd';
import InputField from 'components/fields/InputField';
import CustButton from 'components/button';
import Footer from 'components/footer/Footer';
import VectorImage from 'assets/img/auth/College.jpg'; 

const { Step } = Steps;
const { Option } = Select;

const AdminRegister = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm(); 

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = (values) => {
    // Handle form submission here
    console.log('Received values:', values);
    message.success('Registration Successful');
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow flex items-center justify-center">
        <div className="mt-[6vh] ml-4 flex flex-col items-center w-full max-w-full md:pl-4 xl:max-w-[750px]">
          <h4 className="mb-4 text-4xl font-bold text-navy-700 dark:text-white">
            University Registration
          </h4>
          <div className="w-full mb-2">
            <Steps current={currentStep} >
              <Step title="Admin Details" />
              <Step title="University Details" />
              <Step title="Upload Logo" />
              <Step title="Account Details" />
            </Steps>
          </div>
          <Form
            form={form} // Add this line to bind the form instance
            name="register"
            onsubmit={onFinish}
            initialValues={{ remember: true }}
            className="w-full"
          >
            {currentStep === 0 && (
              <>
                <InputField
                  placeholder="First Name"
                  className="mb-4"
                  autoFocus
                />
                <InputField
                  placeholder="Last Name"
                  className="mb-4"
                />
                <InputField
                  placeholder="Mobile Number"
                  className="mb-4"
                />
              </>
            )}
            {currentStep === 1 && (
              <>
                <InputField
                  placeholder="University Name"
                  className="mb-4"
                />
                <InputField
                  placeholder="Address"
                  className="mb-4"
                />
                <InputField
                  placeholder="Landmark"
                  className="mb-4"
                />
                <InputField
                  placeholder="Pincode"
                  className="mb-4"
                />
                <InputField
                  placeholder="State"
                  className="mb-4"
                />
                <InputField
                  placeholder="Country"
                  className="mb-4"
                />
                <InputField
                  placeholder="Date of Establishment"
                  className="mb-4"
                />
              </>
            )}
            {currentStep === 2 && (
              <>
                <Input
                  type="file"
                  placeholder="Upload University Logo"
                  className="mb-4"
                />
              </>
            )}
            {currentStep === 3 && (
              <>
                <InputField
                  type="email"
                  placeholder="Email"
                  className="mb-4"
                />
                <InputField
                  type="password"
                  placeholder="Password"
                  className="mb-4"
                />
                <InputField
                  type="password"
                  placeholder="Confirm Password"
                  className="mb-4"
                />
              </>
            )}
            <div className="flex justify-between items-center mb-8">
              {currentStep > 0 && (
                <CustButton onClick={handlePrev} label="Previous" />
              )}
              {currentStep < 3 && (
                <CustButton type="primary" onClick={handleNext} label="Next" />
              )}
              {currentStep === 3 && (
                <CustButton type="primary" htmlType="submit" label="Register"/>
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
        <div className="hidden md:block ml-10 mr-4">
          {/* Add your vector image here */}
          <img src={VectorImage} alt="Vector Image" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminRegister;
