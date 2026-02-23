import PieChartCard from "views/admin/default/components/PieChartCard";
import StudentFocus from "views/admin/default/components/StudentFocus";
import MiniCalendar from "components/calendar/MiniCalendar";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard, MdGroups } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

import Widget from "components/widget/Widget";
import Banner1 from "../marketplace/components/Banner";
// import TopCreatorTable from "../marketplace/components/TableTopCreators";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [tests, setTests] = useState([]);
  const [batches, setBatches] = useState([]);
  const [calendarValue, setCalendarValue] = useState(new Date());

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/student/get/all/students`);
        if (!res.ok) return;
        const data = await res.json();
        setStudents(data.students || []);
      } catch { /* noop */ }
    };

    const fetchTests = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/test/get/all/tests`);
        if (!res.ok) return;
        const data = await res.json();
        setTests(data.tests || []);
      } catch { /* noop */ }
    };

    const fetchBatches = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/batch/get/all/batches`);
        if (!res.ok) return;
        const data = await res.json();
        setBatches(data.batches || []);
      } catch { /* noop */ }
    };

    fetchStudents();
    fetchTests();
    fetchBatches();
  }, []);

  // FIX: cast isPublished to boolean strictly
  const publishedTests = tests.filter((t) => t.isPublished === true).length;

  const today = new Date().toISOString().split("T")[0];
  const upcomingTests = tests.filter((t) => t.date >= today).length;

  const batchCounts = students.reduce((acc, s) => {
    const b = s.batch || "Unknown";
    acc[b] = (acc[b] || 0) + 1;
    return acc;
  }, {});
  const largestBatch = Object.entries(batchCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="flex flex-col gap-5">
      <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
        <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
          <Banner1 />
        </div>
        {/* <TopCreatorTable /> */}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget icon={<FaUsers className="h-7 w-7" />} title="Total Students" subtitle={students.length} />
        <Widget icon={<IoDocuments className="h-6 w-6" />} title="Total Tests" subtitle={tests.length} />
        <Widget icon={<MdGroups className="h-7 w-7" />} title="Total Batches" subtitle={batches.length} />
        <Widget icon={<MdDashboard className="h-6 w-6" />} title="Upcoming Tests" subtitle={upcomingTests} />
        <Widget icon={<MdBarChart className="h-7 w-7" />} title="Published Tests" subtitle={publishedTests} />
        <Widget
          icon={<FaUsers className="h-6 w-6" />}
          title={largestBatch ? `Largest: ${largestBatch[0]}` : "Batch Stats"}
          subtitle={largestBatch ? largestBatch[1] : 0}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <PieChartCard />
        <MiniCalendar value={calendarValue} onChange={setCalendarValue} exams={tests} />
      </div>

      <StudentFocus />
    </div>
  );
};

export default Dashboard;