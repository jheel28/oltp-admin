import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import StudentLayout from "./layouts/student";
import SuperAdminLayout from "./layouts/super_admin";
import { useAuth } from "components/auth-hook";
import { AuthContext } from "components/Auth-context";
import StudentRoutes from "studentRoutes";
import { BeatLoader } from "react-spinners";
import LandingPage from "views/LandingPage";
import LoginRoleSelection from "views/auth/LoginRoleSelection";
import TestingPlatformHome from "views/student/test/TestingPlatform/testingPlatformHome";
import TestingScreen from "views/student/test/TestingPlatform/testingScreen";
import FeedbackScreen from "views/student/test/TestingPlatform/feedbackScreen";
import RoleSelection from "views/auth/RoleSelection";
import StudentRegister from "views/auth/StudentRegister";
import AdminRegister from "views/auth/AdminRegister";
import SuperAdminRegister from "views/auth/SuperAdminRegister";
import StudentResultsTable from "views/student/result/components/StudentResultTable";

const App = () => {
  const { login, logout, userId, token, email, role } = useAuth();
  const [loading, setLoading] = useState(true);
  console.log(process.env.BACKEND_URL);
  let routes;

  useEffect(() => {
    // Stop loading once we've checked for a role (either it's a string from login or it stays null)
    if (role !== undefined) {
      setLoading(false);
    }
  }, [role]);
  if (loading) {
    // Display a loading spinner while authentication is in progress
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <BeatLoader color="#1890ff" loading={loading} size={15} />
      </div>
    );
  }
  if (role === "SuperAdmin") {
    routes = (
      <Routes>
        <Route path="superadmin/*" element={<SuperAdminLayout />} />
        <Route path="/" element={<Navigate to="/superadmin" replace />} />
        {/* If user hits other roles while logged in as SuperAdmin, redirect to their home */}
        <Route path="/admin/*" element={<Navigate to="/superadmin" replace />} />
        <Route path="/student/*" element={<Navigate to="/superadmin" replace />} />
        <Route path="/auth/*" element={<Navigate to="/superadmin" replace />} />
      </Routes>
    );
  } else if (role === "Admin") {
    routes = (
      <Routes>
        <Route path="admin/*" element={<AdminLayout />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
        {/* If user hits other roles while logged in as Admin, redirect to their home */}
        <Route path="/superadmin/*" element={<Navigate to="/admin" replace />} />
        <Route path="/student/*" element={<Navigate to="/admin" replace />} />
        <Route path="/auth/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  } else if (role === "Student") {
    routes = (
      <React.Fragment>
        <Routes>
          <Route path="student/*" element={<StudentLayout />} />
          <Route path="student/test/:id" element={<TestingPlatformHome />} />
          <Route path="student/testingscreen/:id" element={<TestingScreen />} />
          <Route
            path="student/result/result-page/:testId/:questionPaperId"
            element={<StudentResultsTable />}
          />
          <Route
            path="student/feedbackscreen/:score/:maxscore"
            element={<FeedbackScreen />}
          />
          <Route path="/" element={<Navigate to="/student" replace />} />
          {/* If user hits other roles while logged in as Student, redirect to their home */}
          <Route path="/admin/*" element={<Navigate to="/student" replace />} />
          <Route path="/superadmin/*" element={<Navigate to="/student" replace />} />
          <Route path="/auth/*" element={<Navigate to="/student" replace />} />
        </Routes>
      </React.Fragment>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="auth/login-role" element={<LoginRoleSelection />} />
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="/admin/*"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/superadmin/*"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/student/*"
          element={<Navigate to="/" replace />}
        />
        <Route path="auth/register" element={<RoleSelection />} />
        <Route path="auth/register/student" element={<StudentRegister />} />
        <Route path="auth/register/admin" element={<AdminRegister />} />
        <Route path="auth/register/superadmin" element={<SuperAdminRegister />} />
      </Routes>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        login: login,
        logout: logout,
        userId: userId,
        token: token,
        email: email,
        role: role,
      }}
    >
      <main>{routes}</main>
    </AuthContext.Provider>
  );
};

export default App;