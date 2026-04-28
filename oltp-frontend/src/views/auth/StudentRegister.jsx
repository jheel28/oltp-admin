import React, { useState, useEffect } from "react";
import { Steps, Form, Input, message, Select } from "antd";
import { useNavigate, Link } from "react-router-dom";
import Footer from "components/footer/Footer";
import logo from "assets/img/Logo/correct.png";
import PhoneInput, { isValidPhoneNumber } from "components/PhoneInput";

const { Option } = Select;

const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const CONTACT_NUMBER = "9958800754";

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const ErrorBanner = ({ title, detail, showContact }) => (
  <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20">
        <svg className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-red-300">{title}</p>
        {detail && <p className="mt-0.5 text-xs text-red-300/80">{detail}</p>}
        {showContact && (
          <p className="mt-2 text-xs text-white/60">
            Need help? Contact us at{" "}
            <a
              href={`tel:${CONTACT_NUMBER}`}
              className="font-bold text-teal-400 hover:text-teal-300 underline underline-offset-2"
            >
              {CONTACT_NUMBER}
            </a>
          </p>
        )}
      </div>
    </div>
  </div>
);

const ImageUploadField = ({ imageFile, onFileChange }) => {
  const [dragOver, setDragOver] = useState(false);
  const isTooBig = imageFile && imageFile.size > MAX_IMAGE_BYTES;

  const handleFile = (file) => {
    if (!file) return;
    onFileChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-white/90">
        Profile Photo <span className="text-teal-400">*</span>
      </label>

      <label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={[
          "group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 text-center transition-all duration-200",
          dragOver
            ? "border-teal-400 bg-teal-500/10"
            : isTooBig
            ? "border-red-500/60 bg-red-500/5 hover:border-red-400"
            : imageFile
            ? "border-teal-500/60 bg-teal-500/5 hover:border-teal-400"
            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8",
        ].join(" ")}
      >
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {imageFile ? (
          <>
            <div
              className={[
                "flex h-10 w-10 items-center justify-center rounded-full",
                isTooBig ? "bg-red-500/20" : "bg-teal-500/20",
              ].join(" ")}
            >
              <svg
                className={["h-5 w-5", isTooBig ? "text-red-400" : "text-teal-400"].join(" ")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                {isTooBig ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                )}
              </svg>
            </div>

            <div>
              <p
                className={[
                  "max-w-[220px] truncate text-sm font-medium",
                  isTooBig ? "text-red-300" : "text-teal-300",
                ].join(" ")}
                title={imageFile.name}
              >
                {imageFile.name}
              </p>
              <p className={["text-xs", isTooBig ? "text-red-400" : "text-white/40"].join(" ")}>
                {formatBytes(imageFile.size)}
              </p>
            </div>

            {isTooBig && (
              <div className="w-full rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
                <p className="text-xs font-semibold text-red-300">
                  File too large — maximum allowed size is {formatBytes(MAX_IMAGE_BYTES)}
                </p>
                <p className="mt-0.5 text-xs text-red-300/70">
                  Your file is {formatBytes(imageFile.size)}. Please compress or choose a smaller image.
                </p>
              </div>
            )}

            <p className="text-xs text-white/40">Click to change</p>
          </>
        ) : (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-white/10">
              <svg className="h-5 w-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white/70">Click or drag to upload</p>
              <p className="text-xs text-white/30">PNG, JPG, JPEG up to {formatBytes(MAX_IMAGE_BYTES)}</p>
            </div>
          </>
        )}
      </label>
    </div>
  );
};

const StudentRegister = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [batches, setBatches] = useState([]);
  const [phones, setPhones] = useState({ phoneNumber: "", alternateNumber: "" });
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
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
    setRegistrationError(null);

    if (!imageFile) {
      setRegistrationError({ title: "Profile photo is required.", detail: "Please upload a profile photo to continue.", showContact: false });
      return;
    }
    if (imageFile.size > MAX_IMAGE_BYTES) {
      setRegistrationError({
        title: `Image is too large (${formatBytes(imageFile.size)}).`,
        detail: `Please upload an image smaller than ${formatBytes(MAX_IMAGE_BYTES)}. Try compressing it using a tool like TinyPNG.`,
        showContact: false,
      });
      return;
    }
    if (!isValidPhoneNumber(phones.phoneNumber)) {
      setRegistrationError({ title: "Invalid phone number.", detail: "Please enter a valid phone number in international format.", showContact: false });
      return;
    }
    if (phones.alternateNumber && phones.alternateNumber.trim() && !isValidPhoneNumber(phones.alternateNumber)) {
      setRegistrationError({ title: "Invalid alternate number.", detail: "Please enter a valid alternate number or leave it blank.", showContact: false });
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
      formData.append("image", imageFile);

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
        const errorMsg = data.message || "Registration failed. Please try again.";
        const isServerError = response.status >= 500;
        setRegistrationError({
          title: errorMsg,
          detail: isServerError ? "There was a problem on our end." : null,
          showContact: true,
        });
      }
    } catch {
      setRegistrationError({
        title: "Unable to connect to the server.",
        detail: "Please check your internet connection and try again.",
        showContact: true,
      });
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
              <Steps current={currentStep} size="small" responsive={true} className="dark-steps">
                <Steps.Step title={<span className="text-white/70">Personal</span>} />
                <Steps.Step title={<span className="text-white/70">Academic</span>} />
                <Steps.Step title={<span className="text-white/70">Contact</span>} />
              </Steps>
            </div>

            <Form form={form} name="student-register" onFinish={onFinish} layout="vertical" preserve className="auth-form">
              <div style={{ display: currentStep === 0 ? "block" : "none" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <Form.Item name="fatherName" label={<span className="text-white/90">Father's Name</span>}>
                    <Input placeholder="Father's name" size="large" />
                  </Form.Item>
                  <Form.Item name="motherName" label={<span className="text-white/90">Mother's Name</span>}>
                    <Input placeholder="Mother's name" size="large" />
                  </Form.Item>
                </div>

                <ImageUploadField imageFile={imageFile} onFileChange={setImageFile} />

                <div className="rounded-xl bg-white/5 p-3 mb-2">
                  <p className="text-xs text-white/60">A verification email will be sent upon registration.</p>
                </div>

                {registrationError && (
                  <ErrorBanner
                    title={registrationError.title}
                    detail={registrationError.detail}
                    showContact={registrationError.showContact}
                  />
                )}
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
                    disabled={loading || (imageFile && imageFile.size > MAX_IMAGE_BYTES)}
                    className="ml-auto rounded-xl bg-teal-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
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