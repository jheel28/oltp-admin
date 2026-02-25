import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "layouts/admin";
import StudentLayout from "./layouts/student";
import { useAuth } from "components/auth-hook";
import { AuthContext } from "components/Auth-context";
import FetchInterceptor from "components/FetchInterceptor";
import { BeatLoader } from "react-spinners";
import LandingPage from "views/LandingPage";
import TestingScreen from "views/student/test/TestingPlatform/testingScreen";
import FeedbackScreen from "views/student/test/TestingPlatform/feedbackScreen";
import SignIn from "views/auth/SignIn";
import StudentRegister from "views/auth/StudentRegister";
import AdminRegister from "views/auth/AdminRegister";
import StudentResultsTable from "views/student/result/components/StudentResultTable";

const App = () => {
  const { login, logout, userId, token, email, role, initialized } = useAuth();

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <BeatLoader color="#1890ff" size={15} />
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
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  } else if (role === "Student") {
    routes = (
      <Routes>
        <Route path="student/*" element={<StudentLayout />} />
        <Route path="student/test/:id" element={<TestingScreen />} />
        <Route
          path="student/result/result-page/:testId/:paperId"
          element={<StudentResultsTable />}
        />
        <Route
          path="student/result/result-page/score/:scoreId"
          element={<StudentResultsTable />}
        />
        <Route
          path="student/feedbackscreen/:score/:maxscore"
          element={<FeedbackScreen />}
        />
        <Route path="/" element={<Navigate to="/student" replace />} />
        <Route path="/admin/*" element={<Navigate to="/student" replace />} />
        <Route path="/auth/*" element={<Navigate to="/student" replace />} />
        <Route path="*" element={<Navigate to="/student" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="auth/sign-in" element={<SignIn />} />
        <Route path="auth/register/student" element={<StudentRegister />} />
        <Route path="auth/register/admin" element={<AdminRegister />} />
        <Route path="auth/*" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, login, logout, userId, token, email, role }}
    >
      <FetchInterceptor>
        <main>{routes}</main>
      </FetchInterceptor>
    </AuthContext.Provider>
  );
};

export default App;