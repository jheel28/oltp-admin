import { Route, Routes } from "react-router-dom";
import TestsTable from "./components/TestTable";
import StudentResultsTable from "./components/StudentResultTable";

const Tables = () => {
  return (
    <div className="mt-5">
      <Routes>
        <Route index element={<TestsTable />} />
        <Route path="result-page/score/:scoreId" element={<StudentResultsTable />} />
      </Routes>
    </div>
  );
};

export default Tables;