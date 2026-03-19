import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

import Widget from "components/widget/Widget";
import Banner1 from "../marketplace/components/Banner";
import TopCreatorTable from "../marketplace/components/TableTopCreators";
import { tableColumnsTopCreators } from "../marketplace/variables/tableColumnsTopCreators";
import tableDataTopCreators from "views/admin/marketplace/variables/tableDataTopCreators.json";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTests: 0,
    jeeStudents: 50,
    neetStudents: 100,
    upcomingTests: 0,
    regionalTests: 145
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/dashboard/admin`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err.message);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
        <div className="col-span-1 mt-3 h-fit w-full xl:col-span-1 2xl:col-span-2">
          <Banner1 />
        </div>
        {/* <MiniCalendar /> */}
        <TopCreatorTable
          extra="mb-1"
          tableData={tableDataTopCreators}
          columnsData={tableColumnsTopCreators}
        />
      </div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<FaUsers className="h-7 w-7" />}
          title={"No.of Students"}
          subtitle={stats.totalStudents}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"No.of Tests Completed"}
          subtitle={stats.totalTests}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"JEE Students"}
          subtitle={stats.jeeStudents}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"NEET Students"}
          subtitle={stats.neetStudents}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Regional test"}
          subtitle={stats.regionalTests}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Upcoming Tests"}
          subtitle={stats.upcomingTests}
        />
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* <TotalSpent /> */}
        <PieChartCard className="md:grid-cols-2" />
        <MiniCalendar className="md:grid-cols-2" />
      </div>
    </div>
  );
};

export default Dashboard;
 
// update: 2026-03-19