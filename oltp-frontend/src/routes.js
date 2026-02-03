import React, { useContext } from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import ManageStudents from "views/admin/manage_students";
import ManageTests from "views/admin/manage_tests";
import AdminSettings from "views/admin/settings";
import ManageQuestionPaper from "views/admin/manage_question_papers";
import SuperResult from "views/admin/results";

// Icon Imports
import { IoDocumentsSharp, IoDocuments } from "react-icons/io5";
import {
  MdGroups,
  MdHome,
  MdLock,
  MdManageAccounts,
  MdPerson,
  MdSettings,
} from "react-icons/md";
import SignIn from "views/auth/SignIn";
import { AuthContext } from "components/Auth-context";
import { Button, Card, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import Batch from "views/admin/batches";
import { useNavigate } from "react-router-dom";
import TestingPlatformHome from "views/student/test/TestingPlatform/testingPlatformHome";
import { TbReportAnalytics } from "react-icons/tb";
const LogoutCard = ({ onConfirm }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    // Call the auth.logout() function
    auth.logout();
    message.success("Logged out Successfully");
    setTimeout(() => {
      navigate("/");
    }, 200);
    onConfirm();
  };
  return (
    <Card
      title="Logout Confirmation"
      extra={
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      }
      style={{ marginTop: "100px" }}
    >
      <p>Are you sure you want to logout?</p>
    </Card>
  );
};
const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },

  {
    name: "Manage Batches",
    layout: "/admin",
    path: "manage-batches",
    icon: <MdGroups className="h-6 w-6" />,
    component: <Batch />,
    secondary: true,
  },
  {
    name: "Manage Students",
    layout: "/admin",
    path: "manage-students",
    icon: <MdManageAccounts className="h-6 w-6" />,
    component: <ManageStudents />,
    secondary: true,
  },
  {
    name: "Manage Tests",
    layout: "/admin",
    icon: <IoDocumentsSharp className="h-6 w-6" />,
    path: "manage-tests",
    component: <ManageTests />,
  },
  {
    name: "Manage Question Papers",
    layout: "/admin",
    path: "admin-question-papers",
    icon: <IoDocuments className="h-6 w-6" />,
    component: <ManageQuestionPaper />,
    secondary: true,
  },
  {
    name: "Manage Results",
    layout: "/admin",
    path: "admin-manage-results",
    icon: <TbReportAnalytics className="h-6 w-6" />,
    component: <SuperResult />,
    secondary: true,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Settings",
    layout: "/admin",
    path: "settings",
    icon: <MdSettings className="h-6 w-6" />,
    component: <AdminSettings />,
  },
  {
    name: "Testing Platform",
    layout: "/TestingPlatformHome",
    path: "testingPlatform",
    icon: <MdHome className="h-6 w-6" />,
    component: <TestingPlatformHome />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },

  {
    name: "Logout",
    path: "logout",
    layout: "/admin",
    icon: <LogoutOutlined className="h-6 w-6" />,
    component: (
      <LogoutCard
        onConfirm={() => {
          // Handle logout logic here
          console.log("Logout confirmed");
        }}
      />
    ),
  },
];
export default routes;
