import { Route, Routes } from "react-router-dom";
import ResultsDashboard from "./components/ResultsDashboard";
import TestMonitor from "./components/TestMonitor";

const Results = () => {
  return (
    <div className="mt-3">
      <Routes>
        <Route index element={<ResultsDashboard />} />
        <Route path="live/:testId" element={<TestMonitor />} />
      </Routes>
    </div>
  );
};

export default Results;