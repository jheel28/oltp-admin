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
  const [imageTooLarge, setImageTooLarge] = useState(false);
  const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
  const [batches, setBatches] = useState([]);
  const [phones, setPhones] = useState({ phoneNumber: "", alternateNumber: "" });
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
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
    ["batch", "admissionDate", "city", "pincode", "state", "country"],
  ];

  const phonesValid =
    isValidPhoneNumber(phones.phoneNumber) &&
    (!phones.alternateNumber ||
      !phones.alternateNumber.trim() ||
      isValidPhoneNumber(phones.alternateNumber));

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
    setPhoneSubmitted(true);
    if (!imageFile) { message.error("Please provide a profile photo"); return; }
    if (imageFile && imageFile.size > MAX_IMAGE_BYTES) { message.error("Profile image must be 5MB or smaller"); return; }
    if (!isValidPhoneNumber(phones.phoneNumber)) { message.error("Please enter a valid phone number"); return; }
    if (phones.alternateNumber && phones.alternateNumber.trim() && !isValidPhoneNumber(phones.alternateNumber)) {
      message.error("Please enter a valid alternate number or leave it blank");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("batch", values.batch);
      formData.append("admissionDate", values.admissionDate || new Date().toISOString().split("T")[0]);
      formData.append("city", values.city);
      formData.append("pincode", values.pincode);
      formData.append("state", values.state);
      formData.append("country", values.country);
      formData.append("phoneNumber", phones.phoneNumber);
      if (phones.alternateNumber && phones.alternateNumber.trim()) {
        formData.append("alternateNumber", phones.alternateNumber);
      }
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
          message.success("Registration successful! Please check your email.");
          setTimeout(() => navigate("/auth/verify-email-sent"), 1500);
        } else {
          message.success("Registration successful! You can now log in.");
          setTimeout(() => navigate("/auth/sign-in"), 1500);
        }
      } else {
        message.error(data.message || "Registration failed.");
      }
    } catch {
      message.error("An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-cyan-900 dark">
      <div className="flex flex-grow">
        <div className="flex w-full flex-col items-center justify-center px-6 py-12 md:w-[55%] lg:w-[50%]">
          <div className="w-full max-w-[520px]">
            <div className="mb-6">
              <div className="mb-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">Student Registration</span>
              </div>
              <h4 className="mb-2 text-4xl font-bold text-white">Create your account</h4>
              <p className="text-sm text-white/70">Fill in your details to register as a student.</p>
            </div>

            <div className="mb-8">
              <Steps current={currentStep} size="small" responsive={false} className="dark-steps">
                <Steps.Step title={<span className="text-white/70">Personal</span>} />
                <Steps.Step title={<span className="text-white/70">Academic</span>} />
                <Steps.Step title={<span className="text-white/70">Contact</span>} />
              </Steps>
            </div>

            <Form form={form} name="student-register" onFinish={onFinish} layout="vertical" preserve className="auth-form">
              <div style={{ display: currentStep === 0 ? "block" : "none" }}>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item name="firstName" label={<span className="text-white/90">First Name</span>} rules={[{ required: true }]}>
                    <Input placeholder="First name" size="large" />
                  </Form.Item>
                  <Form.Item name="lastName" label={<span className="text-white/90">Last Name</span>} rules={[{ required: true }]}>
                    <Input placeholder="Last name" size="large" />
                  </Form.Item>
                </div>
                <Form.Item name="email" label={<span className="text-white/90">Email</span>} rules={[{ required: true, type: "email" }]}>
                  <Input type="email" placeholder="you@example.com" size="large" />
                </Form.Item>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item name="password" label={<span className="text-white/90">Password</span>} rules={[{ required: true, min: 6 }]}>
                    <Input.Password placeholder="Min. 6 characters" size="large" />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    label={<span className="text-white/90">Confirm Password</span>}
                    rules={[
                      { required: true },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) return Promise.resolve();
                          return Promise.reject(new Error("Mismatch"));
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Repeat password" size="large" />
                  </Form.Item>
                </div>
              </div>

              <div style={{ display: currentStep === 1 ? "block" : "none" }}>
                <Form.Item name="batch" label={<span className="text-white/90">Batch</span>} rules={[{ required: true }]}>
                  <Select placeholder="Select batch" size="large">
                    {batches.map((b) => <Option key={b._id} value={b.batchName}>{b.batchName}</Option>)}
                  </Select>
                </Form.Item>
                <Form.Item name="admissionDate" label={<span className="text-white/90">Admission Date</span>} rules={[{ required: true }]}>
                  <Input type="date" size="large" />
                </Form.Item>
                <Form.Item name="city" label={<span className="text-white/90">City</span>} rules={[{ required: true }]}>
                  <Input placeholder="City" size="large" />
                </Form.Item>
                <div className="grid grid-cols-3 gap-4">
                  <Form.Item name="pincode" label={<span className="text-white/90">Pincode / Zipcode</span>} rules={[{ required: true }]}>
                    <Input placeholder="Pincode / Zipcode" size="large" />
                  </Form.Item>
                  <Form.Item name="state" label={<span className="text-white/90">State</span>} rules={[{ required: true }]}>
                    <Input placeholder="State" size="large" />
                  </Form.Item>
                  <Form.Item name="country" label={<span className="text-white/90">Country</span>} rules={[{ required: true }]}>
                    <Input placeholder="Country" size="large" />
                  </Form.Item>
                </div>
              </div>

              <div style={{ display: currentStep === 2 ? "block" : "none" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PhoneInput
                    label={<span className="text-white/90">Phone Number</span>}
                    required
                    value={phones.phoneNumber}
                    onChange={(val) => setPhones(p => ({ ...p, phoneNumber: val || "" }))}
                    showValidation={phoneSubmitted}
                    placeholder="Phone"
                  />
                  <PhoneInput
                    label={<span className="text-white/90">Alternate Number (optional)</span>}
                    value={phones.alternateNumber}
                    onChange={(val) => setPhones(p => ({ ...p, alternateNumber: val || "" }))}
                    placeholder="Alternate"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Form.Item name="fatherName" label={<span className="text-white/90">Father's Name</span>}>
                    <Input placeholder="Father's name" size="large" />
                  </Form.Item>
                  <Form.Item name="motherName" label={<span className="text-white/90">Mother's Name</span>}>
                    <Input placeholder="Mother's name" size="large" />
                  </Form.Item>
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-white/90">
                    Profile Photo <span className="text-teal-400">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files[0];
                      setImageFile(f);
                      setImageTooLarge(f && f.size > MAX_IMAGE_BYTES);
                    }}
                    className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-white"
                  />
                  {imageFile && !imageTooLarge && (
                    <p className="mt-1 text-xs text-teal-400">Selected: {imageFile.name}</p>
                  )}
                </div>
                <div className="rounded-xl bg-white/5 p-3 mb-4">
                  <p className="text-xs text-white/60">Verification email will be sent upon registration.</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Back
                  </button>
                )}
                {currentStep < 2 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto rounded-xl bg-teal-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-teal-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-auto rounded-xl bg-teal-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-60"
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </button>
                )}
              </div>
            </Form>

            <p className="mt-6 text-sm text-white/70">
              Already have an account?{" "}
              <Link to="/auth/sign-in" className="font-bold text-teal-400 hover:text-teal-300">Sign in</Link>
            </p>
          </div>
        </div>

        <div className="hidden bg-gradient-to-br from-cyan-950 via-teal-950 to-cyan-900 md:flex md:w-[45%] lg:w-[50%] items-center justify-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
          <div className="relative z-10 flex flex-col items-center text-center p-12">
            <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
              <img
                src={logo}
                alt="Logo"
                className="max-h-[280px] object-contain drop-shadow-[0_20px_50px_rgba(20,184,166,0.25)]"
              />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Begin Your Journey</h2>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentRegister;