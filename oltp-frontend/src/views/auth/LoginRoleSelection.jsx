import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaSchool, FaArrowLeft } from 'react-icons/fa';
import { Card } from 'antd';
import logo from "assets/img/Logo/correct.png";

const LoginRoleSelection = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const navigate = useNavigate();

    const handleRoleSelection = (role) => {
        setSelectedRole(role);
    };

    const handleContinue = () => {
        if (selectedRole === 'student') {
            navigate('/auth/sign-in?role=student');
        } else if (selectedRole === 'university') {
            navigate('/auth/sign-in?role=admin');
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
            <div className="mb-10 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <img src={logo} alt="Correct Steps" className="h-12 w-auto" />
                    <span className="text-2xl font-bold text-brand-500">Correct Steps</span>
                </div>
                <h1 className="text-3xl font-extrabold text-navy-700">Choose Login Type</h1>
                <p className="mt-2 text-gray-500">Select how you want to access the platform</p>
            </div>

            <div className="grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
                <Card
                    className={`cursor-pointer border-2 transition-all duration-300 hover:shadow-xl ${selectedRole === 'student' ? 'border-brand-500 bg-brand-50/20' : 'border-transparent'}`}
                    onClick={() => handleRoleSelection('student')}
                >
                    <div className="flex flex-col items-center p-6">
                        <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full text-4xl shadow-inner ${selectedRole === 'student' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <FaUserGraduate />
                        </div>
                        <h2 className="text-xl font-bold text-navy-700">Student</h2>
                        <p className="mt-2 text-center text-sm text-gray-500">Write tests, view results, and track progress.</p>
                    </div>
                </Card>

                <Card
                    className={`cursor-pointer border-2 transition-all duration-300 hover:shadow-xl ${selectedRole === 'university' ? 'border-brand-500 bg-brand-50/20' : 'border-transparent'}`}
                    onClick={() => handleRoleSelection('university')}
                >
                    <div className="flex flex-col items-center p-6">
                        <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full text-4xl shadow-inner ${selectedRole === 'university' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <FaSchool />
                        </div>
                        <h2 className="text-xl font-bold text-navy-700">University</h2>
                        <p className="mt-2 text-center text-sm text-gray-500">Conduct tests, manage batches, and students.</p>
                    </div>
                </Card>
            </div>

            <div className="mt-12 flex flex-col items-center gap-4">
                <button
                    className={`rounded-full px-12 py-3 text-lg font-bold text-white transition-all shadow-lg ${selectedRole ? 'bg-brand-500 hover:bg-brand-600 hover:shadow-brand-200' : 'bg-gray-300 cursor-not-allowed text-gray-400'}`}
                    onClick={handleContinue}
                    disabled={!selectedRole}
                >
                    Continue to Login
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-500 transition-colors"
                >
                    <FaArrowLeft className="text-xs" /> Back to Homepage
                </button>
            </div>
        </div>
    );
};

export default LoginRoleSelection;
