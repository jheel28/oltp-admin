import React, { useContext } from "react";

// Student Imports
import SuperMainDashboard from "views/superAdmin/default";
import Superprofile from "views/superAdmin/profile";
import Superuniversities from "views/superAdmin/universities";
import SuperStudents from "views/superAdmin/students";
import SuperWeb from "views/superAdmin/websiteInfo";
import SuperQuery from "views/superAdmin/queries";
import SuperSettings from "views/superAdmin/settings";
import SuperAdminSettings from "views/superAdmin/settings";
import SuperTest from "views/superAdmin/manage_tests";
import QuestionPaper from "views/superAdmin/manage_question_papers";
import SuperResult from "views/superAdmin/results";

import SuperNFTMarketplace from "views/superAdmin/marketplace";
import SuperDataTables from "views/superAdmin/tables";

// Auth Imports

// Icon Imports
import { TbReportAnalytics } from "react-icons/tb";

import {
  MdHome,
  MdPerson,
  MdHelpOutline,
  MdSettings,
  MdWeb,
  MdLock,
} from "react-icons/md";
import { IoDocuments } from "react-icons/io5";

import { FaUniversity, FaUser } from "react-icons/fa";
import { AuthContext } from "components/Auth-context";
import { Button, Card, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import SignIn from "views/auth/SignIn";
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
    layout: "/superadmin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <SuperMainDashboard />,
  },
  {
    name: "Manage Universities",
    layout: "/superadmin",
    path: "superadmin-manage-universities",
    icon: <FaUniversity className="h-6 w-6" />,
    component: <Superuniversities />,
    secondary: true,
  },
  {
    name: "Manage Students",
    layout: "/superadmin",
    path: "superadmin-manage-students",
    icon: <FaUser className="h-6 w-6" />,
    component: <SuperStudents />,
    secondary: true,
  },
  {
    name: "Manage Tests",
    layout: "/superadmin",
    path: "superadmin-manage-tests",
    icon: <IoDocuments className="h-6 w-6" />,
    component: <SuperTest />,
    secondary: true,
  },
  {
    name: "Manage Question Papers",
    layout: "/superadmin",
    path: "superadmin-question-papers",
    icon: <IoDocuments className="h-6 w-6" />,
    component: <QuestionPaper />,
    secondary: true,
  },
  {
    name: "Manage Results",
    layout: "/superadmin",
    path: "superadmin-manage-results",
    icon: <TbReportAnalytics className="h-6 w-6" />,
    component: <SuperResult />,
    secondary: true,
  },
  {
    name: "Manage Website Info",
    layout: "/superadmin",
    path: "superadmin-manage-website",
    icon: <MdWeb className="h-6 w-6" />,
    component: <SuperWeb />,
    secondary: true,
  },
  {
    name: "Queries",
    layout: "/superadmin",
    path: "superadmin-queries",
    icon: <MdHelpOutline className="h-6 w-6" />,
    component: <SuperQuery />,
    secondary: true,
  },

  {
    name: "Settings",
    layout: "/superadmin",
    path: "superadmin-settings",
    icon: <MdSettings className="h-6 w-6" />,
    component: <SuperAdminSettings />,
    secondary: true,
  },
  {
    name: "profile",
    layout: "/superadmin",
    path: "superadmin-profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Superprofile />,
    secondary: true,
  },

  {
    name: "Logout",
    path: "logout",
    layout: "/superadmin",
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
