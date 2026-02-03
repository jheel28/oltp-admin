import React, { useContext } from "react";

// Student Imports
import StudentMainDashboard from "views/student/default";
import UpcomingTests from "views/student/test";

// Auth Imports
import SignIn from "views/auth/SignIn";
import { IoDocumentsSharp ,IoDocuments} from "react-icons/io5";
import ProfileOverview from "views/student/profile";


// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
  MdSettings,
  MdScore,
  MdAssessment,
} from "react-icons/md";
import { AuthContext } from "components/Auth-context";
import { Button, Card, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import StudentSettings from "views/student/settings";
import Result from "views/student/result";
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
    name: "Student Main Dashboard",
    layout: "/student",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <StudentMainDashboard />,
  },
  {
    name: "Upcoming Tests",
    layout: "/student",
    path: "upcoming-tests",
    icon: <IoDocumentsSharp className="h-6 w-6" />,
    component: <UpcomingTests />,
    secondary: true,
  },
  {
    name: "Result",
    layout: "/student",
    path: "result",
    icon: <MdAssessment className="h-6 w-6" />,
    component: <Result />,
  },
  {
    name: "Profile",
    layout: "/student",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <ProfileOverview />,
  },
  {
    name: "Settings",
    layout: "/student",
    path: "settings",
    icon: <MdSettings className="h-6 w-6" />,
    component: <StudentSettings />,
  },

  {
    name: "Logout",
    path: "logout",
    layout: "/student",
    icon: <LogoutOutlined className="h-6 w-6" />,
    component: (
      <LogoutCard
        onConfirm={() => {
          console.log("Logout confirmed");
        }}
      />
    ),
  },
];
export default routes;
