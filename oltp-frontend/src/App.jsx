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
import VerifyEmail from "views/auth/VerifyEmail";
import VerifyEmailSent from "views/auth/VerifyEmailSent";
import ForgotPassword from "views/auth/ForgotPassword";
import ResetPassword from "views/auth/ResetPassword";
import MechanicalSubjectPage from "views/subjects/MechanicalSubjectPage";
import CommunicationAptitudePage from "views/subjects/CommunicationAptitudePage";
import NewsArticlesPage from "views/NewsArticlesPage";
import RefundPolicyPage from "views/legal/RefundPolicyPage";
import PrivacyPolicyPage from "views/legal/PrivacyPolicyPage";
import TermsAndConditionsPage from "views/legal/TermsAndConditionsPage";
import ContactPage from "views/legal/ContactPage";
import AboutUsPage from "views/legal/AboutUsPage";

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
        <Route path="subjects/mechanical/:slug" element={<MechanicalSubjectPage />} />
        <Route path="subjects/communication-aptitude" element={<CommunicationAptitudePage />} />
        <Route path="auth/sign-in" element={<SignIn />} />
        <Route path="auth/register/student" element={<StudentRegister />} />
        <Route path="auth/register/admin" element={<AdminRegister />} />
        <Route path="auth/verify-email/:token" element={<VerifyEmail />} />
        <Route path="auth/verify-email-sent" element={<VerifyEmailSent />} />
        <Route path="auth/forgot-password" element={<ForgotPassword />} />
        <Route path="auth/reset-password/:token" element={<ResetPassword />} />
        <Route path="/news" element={<NewsArticlesPage />} />
        <Route path="/refund" element={<RefundPolicyPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsAndConditionsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="auth/*" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, login, logout, userId, token, email, role }}>
      <FetchInterceptor>
        <div className="min-h-screen w-full">{routes}</div>
      </FetchInterceptor>
    </AuthContext.Provider>
  );
};

export default App;