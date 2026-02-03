import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/superAdmin/default/components/PieChartCard";
import { FaUniversity, FaUser } from "react-icons/fa";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard, MdHelpOutline } from "react-icons/md";

import Widget from "components/widget/Widget";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import { useEffect, useState } from "react";
import { message } from "antd";

const Dashboard = () => {
  const [universities, setUniversities] = useState([]);
  const [students, setStudents] = useState([]);
  const [tests, setTests] = useState([]);
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/admin/get/all/admins`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setUniversities(data.admins);
      } catch (err) {
        message.error("error fetching universities:", err.message);
      }
    };
    fetchUniversities();
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/student/get/all/students`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status ${response.status}`);
        }
        const data = await response.json();
        setStudents(data.students);
      } catch (err) {
        message.error("Error fetching students:", err.message);
      }
    };
    fetchStudents();
    const fetchTests = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/test/get/all/tests`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTests(data.tests);
      } catch (err) {
        message.error("Error fetching tests", err.message);
      }
    };
    fetchTests();
  }, []);

  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<FaUniversity className="h-6 w-6" />}
          title={"Universities"}
          subtitle={universities.length}
        />
        <Widget
          icon={<FaUser className="h-7 w-7" />}
          title={"Students"}
          subtitle={students.length}
        />
        <Widget
          icon={<IoDocuments className="h-7 w-7" />}
          title={"Tests"}
          subtitle={tests.length}
        />
        <Widget
          icon={<MdHelpOutline className="h-7 w-7" />}
          title={"Pending Queries"}
          subtitle={"2"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Resolved Queries"}
          subtitle={"340"}
        />

        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Total Queries"}
          subtitle={"342"}
        />
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div>

      {/* Tables & Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Traffic chart & Pie Chart */}

        <div className="mt-5 grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
        </div>

        {/* Task chart & Calendar */}

        <div className="mt-5 grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <PieChartCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
