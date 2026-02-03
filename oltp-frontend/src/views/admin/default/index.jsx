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
  const [students, setStudents] = useState([]);
  const [tests, setTests] = useState([]);
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/student/get/all/students`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setStudents(data.students);
      } catch (err) {
        console.error("Error fetching students:", err.message);
      }
    };
    fetchStudents();
    const fetchTests = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/test/get/all/tests`
        );
        if (!response) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTests(data.tests);
      } catch (err) {
        console.log("Error fetching tests:", err.message);
      }
    };
    fetchTests();
  }, []);
  console.log(process.env.BACKEND_URL);
  const numberOfStudents = students.length;
  const numberOfTests = tests.length;

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
          subtitle={numberOfStudents}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"No.of Tests Completed"}
          subtitle={numberOfTests}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"JEE Students"}
          subtitle={"50"}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"NEET Students"}
          subtitle={"100"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Regional test"}
          subtitle={"145"}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Upcoming Tests"}
          subtitle={"3"}
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
