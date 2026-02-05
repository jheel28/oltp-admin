import React, { useState } from "react";
import { Steps, Form, Input, Select, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import InputField from "components/fields/InputField";
import CustButton from "components/button";
import Footer from "components/footer/Footer";
import VectorImage from "assets/img/auth/College.jpg";
import { useNavigate } from "react-router-dom";

const { Step } = Steps;
const { Option } = Select;

const AdminRegister = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm(); 
  const navigate = useNavigate();

  const handleNext = () => {
    // Define which fields to validate for each step
    const fieldsToValidate = [
      ['firstName', 'lastName', 'mobile'], // Step 0
      ['email', 'password', 'image'], // Step 1
    ];

    form
      .validateFields(fieldsToValidate[currentStep])
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch((error) => {
        console.log("Validation Failed:", error);
      });
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = async () => {
    const values = form.getFieldsValue(true);
    console.log("Submitting Admin values:", values);
    
    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("mobile", values.mobile);
    formData.append("email", values.email);
    formData.append("password", values.password);

    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0].originFileObj);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/admin/create/admin`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      message.success("Registration Successful");
      navigate("/auth/admin-login");
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-grow items-center justify-center">
        <div className="ml-4 mt-[6vh] flex w-full max-w-full flex-col items-center md:pl-4 xl:max-w-[750px]">
          <h4 className="mb-4 text-4xl font-bold text-navy-700 dark:text-white">
            Mentor Registration
          </h4>
          <div className="mb-2 w-full">
            <Steps current={currentStep}>
              <Step title="Personal Info" />
              <Step title="Account" />
            </Steps>
          </div>
          <Form
            form={form}
            name="admin-register"
            onFinish={onFinish}
            initialValues={{ remember: true }}
            className="w-full"
            layout="vertical"
            preserve={true}
          >
            <div style={{ display: currentStep === 0 ? "block" : "none" }}>
              <Form.Item
                name="firstName"
                rules={[{ required: true, message: "First Name is required" }]}
              >
                <InputField placeholder="First Name" />
              </Form.Item>
              <Form.Item
                name="lastName"
                rules={[{ required: true, message: "Last Name is required" }]}
              >
                <InputField placeholder="Last Name" />
              </Form.Item>
              <Form.Item
                name="mobile"
                rules={[
                  { required: true, message: "Mobile Number is required" },
                  { pattern: /^\d{10}$/, message: "Invalid mobile number" },
                ]}
              >
                <InputField placeholder="Mobile Number" />
              </Form.Item>
            </div>

            <div style={{ display: currentStep === 1 ? "block" : "none" }}>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <InputField type="email" placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 6, message: "Min 6 characters" },
                ]}
              >
                <InputField type="password" placeholder="Password" />
              </Form.Item>
              <Form.Item
                name="image"
                label="Mentor Photo"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[{ required: true }]}
              >
                <Upload maxCount={1} beforeUpload={() => false} listType="picture">
                  <Button icon={<UploadOutlined />}>Upload Photo</Button>
                </Upload>
              </Form.Item>
            </div>

            <div className="mb-8 mt-4 flex items-center justify-between">
              {currentStep > 0 && (
                <CustButton type="button" onClick={handlePrev} label="Previous" />
              )}
              {currentStep < 1 && (
                <CustButton type="button" onClick={handleNext} label="Next" />
              )}
              {currentStep === 1 && (
                <CustButton type="submit" label="Register" />
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
