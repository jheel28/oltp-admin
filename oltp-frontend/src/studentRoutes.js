import React, { useContext } from "react";

import StudentMainDashboard from "views/student/default";
import UpcomingTests from "views/student/test";
import StudentProfile from "views/student/profile";
import Result from "views/student/result";

import { IoDocumentsSharp } from "react-icons/io5";
import { MdHome, MdPerson, MdAssessment } from "react-icons/md";
import { AuthContext } from "components/Auth-context";
import { Button, Card, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const LogoutCard = ({ onConfirm }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
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
    component: <StudentProfile />,
  },
  {
    name: "Logout",
    path: "logout",
    layout: "/student",
    icon: <LogoutOutlined className="h-6 w-6" />,
    component: <LogoutCard onConfirm={() => {}} />,
  },
];

export default routes;