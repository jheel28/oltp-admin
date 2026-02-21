import { Route, Routes } from "react-router-dom";
import QuestionPaperTable from "./components/QuestionPaperTable";
import QuestionPaperBuilder from "./components/QuestionPaperBuilder";
import QuestionManagerPage from "./components/QuestionManagerPage";

const ManageQuestionPapers = () => {
  return (
    <div className="mt-3 space-y-4">
      <Routes>
        <Route index element={<QuestionPaperTable />} />
        <Route path="create" element={<QuestionPaperBuilder mode="create" />} />
        <Route path="edit/:id" element={<QuestionPaperBuilder mode="edit" />} />
        <Route path=":paperId/questions" element={<QuestionManagerPage />} />
      </Routes>
    </div>
  );
};

export default ManageQuestionPapers;