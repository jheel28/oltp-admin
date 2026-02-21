import { Route, Routes } from "react-router-dom";
import TestTable from "./components/testTable";
import TestFormWizard from "./components/TestFormWizard";

const ManageTests = () => {
  return (
    <div className="mt-3">
      <Routes>
        <Route index element={<TestTable />} />
        <Route path="create" element={<TestFormWizard mode="create" />} />
        <Route path="edit/:id" element={<TestFormWizard mode="edit" />} />
      </Routes>
    </div>
  );
};

export default ManageTests;