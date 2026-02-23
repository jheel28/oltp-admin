import { Route, Routes } from "react-router-dom";
import ResultsDashboard from "./components/ResultsDashboard";
import LiveMonitorDashboard from "./components/LiveMonitorDashboard";

const Results = () => {
  return (
    <div className="mt-3">
      <Routes>
        <Route index element={<ResultsDashboard />} />
        <Route path="live/:testId" element={<LiveMonitorDashboard />} />
      </Routes>
    </div>
  );
};

export default Results;