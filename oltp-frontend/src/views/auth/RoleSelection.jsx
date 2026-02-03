import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaSchool } from 'react-icons/fa';
import { Card } from 'antd';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole === 'student') {
      navigate('/auth/register/student');
    } else if (selectedRole === 'university') {
      navigate('/auth/register/admin');
    }
  };

  return (
    <div className="mt-10 container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">Please select your role</h1>
      <p className="text-gray-600 text-center mb-8">Are you want to write a test or conduct a test. If you want to attempt a test select Student. If you want to conduct test select University.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card className={selectedRole === 'student' ? 'selected-card bg-blue-500 text-white' : 'border-3'} onClick={() => handleRoleSelection('student')}>
          <div className="text p-4 rounded hover:cursor-pointer flex flex-col items-center justify-center">
            <FaUserGraduate className="text-3xl mb-2" />
            <p className="text-lg font-semibold text-center">Student</p>
          </div>
        </Card>
        <Card className={selectedRole === 'university' ? 'selected-card bg-blue-500 text-white' : 'border-3'} onClick={() => handleRoleSelection('university')}>
          <div className="text p-4 rounded hover:cursor-pointer flex flex-col items-center justify-center">
            <FaSchool className="text-3xl mb-2" />
            <p className="text-lg font-semibold text-center">University</p>
          </div>
        </Card>
      </div>
      <div className="text-center mt-8">
        <button className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700" onClick={handleContinue}>Continue</button>
      </div>
    </div>
  );
};

export default RoleSelection;
