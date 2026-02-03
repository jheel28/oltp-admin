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
import SignIn from "views/auth/SignIn";
import TestingPlatformHome from "views/student/test/TestingPlatform/testingPlatformHome";
import TestingScreen from "views/student/test/TestingPlatform/testingScreen";
import FeedbackScreen from "views/student/test/TestingPlatform/feedbackScreen";
import Register from "views/auth/Register";
import RoleSelection from "views/auth/RoleSelection";
import StudentRegister from "views/auth/StudentRegister";
import AdminRegister from "views/auth/AdminRegister";
import StudentResultsTable from "views/student/result/components/StudentResultTable";

const App = () => {
  const { login, logout, userId, token, email, role } = useAuth();
  const [loading, setLoading] = useState(true);
  console.log(process.env.BACKEND_URL);
  let routes;

  useEffect(() => {
    // Check if authentication information is available
    if (role === null) {
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
      </Routes>
    );
  } else if (role === "Admin") {
    routes = (
      <Routes>
        <Route path="admin/*" element={<AdminLayout />} />
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
        </Routes>
      </React.Fragment>
    );
  } else {
    routes = (
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
        <Route
          path="/admin/*"
          element={<Navigate to="/auth/sign-in" replace />}
        />
        <Route
          path="/superadmin/*"
          element={<Navigate to="/auth/sign-in" replace />}
        />
        <Route
          path="/student/*"
          element={<Navigate to="/auth/sign-in" replace />}
        />
        <Route path="auth/register" element={<RoleSelection />} />
        <Route path="auth/register/student" element={<StudentRegister />} />
        <Route path="auth/register/admin" element={<AdminRegister />} />
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
