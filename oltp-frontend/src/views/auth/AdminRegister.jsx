import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import Footer from "components/footer/Footer";
import logo from "assets/img/Logo/correct.png";
import PhoneInput, { isValidPhoneNumber } from "components/PhoneInput";

const AdminRegister = () => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageTooLarge, setImageTooLarge] = useState(false);
  const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    if (!phone || !isValidPhoneNumber(phone)) {
      setPhoneError(true);
      message.error("Please enter a valid mobile number");
      return;
    }

    if (imageFile && imageFile.size > MAX_IMAGE_BYTES) {
      message.error("Profile image must be 5MB or smaller");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("mobile", phone);
      formData.append("email", values.email);
      formData.append("password", values.password);
      if (imageFile) formData.append("image", imageFile);

      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/v1/admin/create/admin`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        message.success("Account created! You can now log in.");
        setTimeout(() => navigate("/auth/sign-in?role=admin"), 1500);
      } else {
        message.error(data.message || "Registration failed. Please try again.");
      }
    } catch {
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-cyan-900 dark">
      <div className="flex flex-grow">
        <div className="flex w-full flex-col items-center justify-center px-6 py-12 md:w-[55%] lg:w-[50%]">
          <div className="w-full max-w-[480px]">
            <div className="mb-8">
              <div className="mb-2 inline-flex items-center rounded-full bg-white/10 px-3 py-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">Admin Registration</span>
              </div>
              <h4 className="mb-2 text-3xl font-bold text-white">Create your account</h4>
              <p className="text-sm text-white/70">
                Fill in your details to register as an administrator.
              </p>
            </div>

            <Form form={form} name="admin-register" onFinish={onFinish} layout="vertical" preserve>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Form.Item
                  name="firstName"
                  label={<span className="text-white/90">First Name</span>}
                  rules={[{ required: true, message: "Required" }, { min: 2, max: 255, message: "2–255 characters" }]}
                >
                  <Input placeholder="First name" size="large" />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  label={<span className="text-white/90">Last Name</span>}
                  rules={[{ required: true, message: "Required" }, { min: 2, max: 255, message: "2–255 characters" }]}
                >
                  <Input placeholder="Last name" size="large" />
                </Form.Item>
              </div>

              <PhoneInput
                label={<span className="text-white/90">Mobile Number</span>}
                required
                value={phone}
                onChange={(val) => {
                  setPhone(val || "");
                  if (phoneError) setPhoneError(false);
                }}
                showValidation={phoneError}
                placeholder="Your mobile number"
              />

              <Form.Item
                name="email"
                label={<span className="text-white/90">Email</span>}
                rules={[{ required: true, message: "Required" }, { type: "email", message: "Invalid email address" }]}
              >
                <Input placeholder="admin@example.com" size="large" />
              </Form.Item>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Form.Item
                  name="password"
                  label={<span className="text-white/90">Password</span>}
                  rules={[{ required: true, message: "Required" }, { min: 6, message: "Minimum 6 characters" }]}
                >
                  <Input.Password placeholder="Min. 6 characters" size="large" />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label={<span className="text-white/90">Confirm Password</span>}
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
                  <Input.Password placeholder="Repeat your password" size="large" />
                </Form.Item>
              </div>

              <div className="mb-6">
                <label className="mb-1 block text-sm font-medium text-white/90">
                  Profile Photo{" "}
                  <span className="text-gray-400 font-normal">(optional — you can add this later)</span>
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => {
                    const file = e.target.files[0] || null;
                    if (file && file.size > MAX_IMAGE_BYTES) {
                      setImageFile(file);
                      setImageTooLarge(true);
                    } else {
                      setImageFile(file);
                      setImageTooLarge(false);
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500">Max file size: 5 MB. JPG/PNG only.</p>
                {imageTooLarge && (
                  <p className="mt-1 text-xs text-red-500">Selected image exceeds 5 MB limit</p>
                )}
                {imageFile && !imageTooLarge && (
                  <p className="mt-1 text-xs text-green-600">Selected: {imageFile.name}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="linear w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </Form>

            <p className="mt-6 text-sm font-medium text-white/70">
              Already have an account?{" "}
              <Link to="/auth/sign-in?role=admin" className="font-bold text-teal-400 hover:text-teal-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden items-center justify-center bg-gradient-to-br from-cyan-950 via-teal-950 to-cyan-900 md:flex md:w-[45%] lg:w-[50%] relative overflow-hidden">
          {/* Decorative radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
          
          <div className="relative z-10 flex flex-col items-center text-center p-12">
            <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
              <img
                src={logo}
                alt="The Correct Steps"
                className="max-h-[300px] w-auto object-contain drop-shadow-[0_20px_50px_rgba(20,184,166,0.3)]"
              />
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Admin Portal</h2>
            <p className="text-teal-400/80 text-lg font-medium max-w-sm">
              Manage your institution with powerful tools and real-time insights.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminRegister;