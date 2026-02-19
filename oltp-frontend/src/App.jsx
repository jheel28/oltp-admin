import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import StudentLayout from "./layouts/student";
import { useAuth } from "components/auth-hook";
import { AuthContext } from "components/Auth-context";
import { BeatLoader } from "react-spinners";
import LandingPage from "views/LandingPage";
import TestingPlatformHome from "views/student/test/TestingPlatform/testingPlatformHome";
import TestingScreen from "views/student/test/TestingPlatform/testingScreen";
import FeedbackScreen from "views/student/test/TestingPlatform/feedbackScreen";
import StudentRegister from "views/auth/StudentRegister";
import AdminRegister from "views/auth/AdminRegister";
import StudentResultsTable from "views/student/result/components/StudentResultTable";

const App = () => {
  const { login, logout, userId, token, email, role } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== undefined) {
      setLoading(false);
    }
  }, [role]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <BeatLoader color="#1890ff" loading={loading} size={15} />
      </div>
    );
  }

  let routes;

  if (role === "Admin") {
    routes = (
      <Routes>
        <Route path="admin/*" element={<AdminLayout />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/student/*" element={<Navigate to="/admin" replace />} />
        <Route path="/auth/*" element={<Navigate to="/admin" replace />} />
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
        <Route path="/admin/*" element={<Navigate to="/student" replace />} />
        <Route path="/auth/*" element={<Navigate to="/student" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="auth/*" element={<AuthLayout />} />
        <Route path="auth/register/student" element={<StudentRegister />} />
        <Route path="auth/register/admin" element={<AdminRegister />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, login, logout, userId, token, email, role }}
    >
      <main>{routes}</main>
    </AuthContext.Provider>
  );
};

export default App;
