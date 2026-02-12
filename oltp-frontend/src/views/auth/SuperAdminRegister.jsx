import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import CustButton from "components/button";
import Footer from "components/footer/Footer";
import VectorImage from "assets/img/auth/College.jpg";

const SuperAdminRegister = () => {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

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

            // Append profile picture
            if (imageFile) {
                formData.append("image", imageFile);
            } else {
                message.error("Please upload a profile picture");
                setLoading(false);
                return;
            }

            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

            const response = await fetch(`${backendUrl}/api/beta/superadmin/create/superadmin`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                message.success("Super Admin registration successful! Please login.");
                setTimeout(() => {
                    navigate("/auth/sign-in?role=superadmin");
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
        <div className="flex h-screen flex-col bg-white">
            <div className="flex flex-grow items-center justify-center">
                <div className="ml-4 mt-[6vh] flex w-full max-w-full flex-col items-center md:pl-4 xl:max-w-[500px]">
                    <h4 className="mb-4 text-4xl font-bold text-navy-700 dark:text-white">
                        Super Admin Registration
                    </h4>
                    <p className="mb-8 text-gray-500">Create a privileged platform administrator account.</p>

                    <Form
                        form={form}
                        name="super_admin_register"
                        onFinish={onFinish}
                        layout="vertical"
                        className="w-full px-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>

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

                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-white">
                                Profile Picture (Required)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="w-full rounded-lg border border-gray-300 p-2"
                            />
                        </div>

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        <div className="mb-8 mt-6">
                            <CustButton
                                type="primary"
                                htmlType="submit"
                                label={loading ? "Registering..." : "Create Super Admin Account"}
                                disabled={loading}
                                className="w-full"
                            />
                        </div>
                    </Form>
                    <div className="mb-8">
                        <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
                            Already have an account?
                        </span>
                        <Link
                            to="/auth/sign-in?role=superadmin"
                            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
                <div className="ml-10 hidden md:block mr-4">
                    <img src={VectorImage} alt="Vector Image" className="max-w-[300px] rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300" />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SuperAdminRegister;