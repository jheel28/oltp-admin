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
import LandingPage from "views/LandingPage";

const App = () => {
  const { login, logout, userId, token, email, role } = useAuth();
  const [loading, setLoading] = useState(true);
  console.log(process.env.REACT_APP_BACKEND_URL);
  let routes;

  useEffect(() => {
    // Once we have a checked the auth state (even if null), stop loading
    setLoading(false);
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
      </Routes>
    );
  } else if (role === "Admin") {
    routes = (
      <Routes>
        <Route path="admin/*" element={<AdminLayout />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  } else if (role === "Student") {
    routes = (
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
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="auth/*" element={<AuthLayout />} />
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
