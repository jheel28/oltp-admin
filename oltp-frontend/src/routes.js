import React, { useContext } from "react";

import MainDashboard from "views/admin/default";
import AdminProfile from "views/admin/profile";
import ManageStudents from "views/admin/manage_students";
import ManageAdmins from "views/admin/manage_admins";
import ManageTests from "views/admin/manage_tests";
import ManageQuestionPapers from "views/admin/manage_question_papers";
import Results from "views/admin/results";
import CategoryManager from "views/admin/manage_categories/components/CategoryManager";
import Batch from "views/admin/batches";

import { IoDocumentsSharp, IoDocuments } from "react-icons/io5";
import {
  MdGroups,
  MdHome,
  MdManageAccounts,
  MdPerson,
  MdCategory,
  MdBarChart,
  MdAdminPanelSettings,
} from "react-icons/md";
import { AuthContext } from "components/Auth-context";
import { Button, Card, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const LogoutCard = ({ onConfirm }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.logout();
    message.success("Logged out successfully");
    setTimeout(() => navigate("/auth/sign-in?role=admin"), 200);
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
    name: "Manage Categories",
    layout: "/admin",
    path: "manage-categories",
    icon: <MdCategory className="h-6 w-6" />,
    component: <CategoryManager />,
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
    name: "Manage Admins",
    layout: "/admin",
    path: "manage-admins",
    icon: <MdAdminPanelSettings className="h-6 w-6" />,
    component: <ManageAdmins />,
  },
  {
    name: "Manage Tests",
    layout: "/admin",
    path: "manage-tests/*",
    icon: <IoDocumentsSharp className="h-6 w-6" />,
    component: <ManageTests />,
  },
  {
    name: "Question Papers",
    layout: "/admin",
    path: "manage-question-papers/*",
    icon: <IoDocuments className="h-6 w-6" />,
    component: <ManageQuestionPapers />,
    secondary: true,
  },
  {
    name: "Results",
    layout: "/admin",
    path: "results/*",
    icon: <MdBarChart className="h-6 w-6" />,
    component: <Results />,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <AdminProfile />,
  },
  {
    name: "Logout",
    path: "logout",
    layout: "/admin",
    icon: <LogoutOutlined className="h-6 w-6" />,
    component: <LogoutCard onConfirm={() => {}} />,
  },
];

export default routes;
