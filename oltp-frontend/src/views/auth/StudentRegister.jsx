import React, { useState } from "react";
import { Steps, Form, Input, Select, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import InputField from "components/fields/InputField";
import CustButton from "components/button";
import Footer from "components/footer/Footer";
import VectorImage from "assets/img/auth/2.svg";
import { useNavigate } from "react-router-dom";

const { Step } = Steps;
const { Option } = Select;

const StudentRegister = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleNext = () => {
    form
      .validateFields()
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
    console.log("Submitting with all values:", values);
    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("studentId", values.studentId);
    formData.append("batch", values.batch);
    formData.append("admissionDate", values.admissionDate);
    formData.append("address", values.address);
    formData.append("pincode", values.pincode);
    formData.append("state", values.state);
    formData.append("country", values.country);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("alternateNumber", values.alternateNumber);
    formData.append("fatherName", values.fatherName);
    formData.append("motherName", values.motherName);
    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0].originFileObj);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/student/signup`,
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
      navigate("/auth/sign-in");
    } catch (error) {
      message.error(error.message);
    }
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
              <Step title="Personal" />
              <Step title="Academic" />
              <Step title="Address" />
              <Step title="Family" />
              <Step title="Upload" />
            </Steps>
          </div>
          <Form
            form={form}
            name="register"
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
                <InputField placeholder="First Name *" />
              </Form.Item>
              <Form.Item
                name="lastName"
                rules={[{ required: true, message: "Last Name is required" }]}
              >
                <InputField placeholder="Last Name *" />
              </Form.Item>
              <Form.Item
                name="studentId"
                rules={[{ required: true, message: "Student ID is required" }]}
              >
                <InputField placeholder="Student ID *" />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Invalid email" },
                ]}
              >
                <InputField type="email" placeholder="Email *" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <InputField type="password" placeholder="Password *" />
              </Form.Item>
            </div>

            <div style={{ display: currentStep === 1 ? "block" : "none" }}>
              <Form.Item name="batch" rules={[{ required: true }]}>
                <InputField placeholder="Batch *" />
              </Form.Item>
              <Form.Item name="admissionDate" rules={[{ required: true }]}>
                <InputField placeholder="Admission Date *" />
              </Form.Item>
            </div>

            <div style={{ display: currentStep === 2 ? "block" : "none" }}>
              <Form.Item name="address" rules={[{ required: true }]}>
                <InputField placeholder="Address *" />
              </Form.Item>
              <Form.Item name="pincode" rules={[{ required: true }]}>
                <InputField placeholder="Pincode *" />
              </Form.Item>
              <Form.Item name="state" rules={[{ required: true }]}>
                <InputField placeholder="State *" />
              </Form.Item>
              <Form.Item name="country" rules={[{ required: true }]}>
                <InputField placeholder="Country *" />
              </Form.Item>
            </div>

            <div style={{ display: currentStep === 3 ? "block" : "none" }}>
              <Form.Item name="phoneNumber" rules={[{ required: true, message: "Phone Number is required" }]}>
                <InputField placeholder="Phone Number *" />
              </Form.Item>
              <Form.Item name="alternateNumber" rules={[{ required: true, message: "Alternate Number is required" }]}>
                <InputField placeholder="Alternate Number *" />
              </Form.Item>
              <Form.Item name="fatherName">
                <InputField placeholder="Father's Name" />
              </Form.Item>
              <Form.Item name="motherName">
                <InputField placeholder="Mother's Name" />
              </Form.Item>
            </div>

            <div style={{ display: currentStep === 4 ? "block" : "none" }}>
              <Form.Item
                name="image"
                rules={[{ required: true, message: "Please upload an image" }]}
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e && e.fileList;
                }}
              >
                <Upload
                  maxCount={1}
                  beforeUpload={() => false}
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>
                    Click to Upload Image
                  </Button>
                </Upload>
              </Form.Item>
            </div>

            <div className="mb-8 mt-4 flex items-center justify-between">
              {currentStep > 0 && (
                <CustButton type="button" onClick={handlePrev} label="Previous" />
              )}
              {currentStep < 4 && (
                <CustButton type="button" onClick={handleNext} label="Next" />
              )}
              {currentStep === 4 && (
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
        <div className="ml-10 hidden md:block">
          <img src={VectorImage} alt="Vector Image" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentRegister;
