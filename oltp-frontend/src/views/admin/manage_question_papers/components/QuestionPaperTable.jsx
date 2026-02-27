import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { MdSearch, MdLayers, MdQuiz, MdFilePresent, MdDownload } from "react-icons/md";
import { Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Card from "components/card";
import { AuthContext } from "components/Auth-context";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const normFile = (p) => {
  if (!p) return null;
  const n = String(p).replace(/\\/g, "/").replace(/^\/+/, "");
  if (n.startsWith("http://") || n.startsWith("https://")) return n;
  return `${BACKEND}/${n}`;
};

const difficultyStyles = {
  Easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const QuestionPaperTable = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND}/api/v1/questionpaper/get/all/questionpapers`);
        const data = await res.json();
        setPapers(data.questionPapers || []);
      } catch {
        message.error("Failed to load question papers");
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return papers;
    const q = search.toLowerCase();
    return papers.filter(
      (p) =>
        p.paperId?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [papers, search]);

  const handleDelete = (paper) => {
    Modal.confirm({
      title: `Delete paper "${paper.paperId}"?`,
      icon: <ExclamationCircleOutlined />,
      content: "This cannot be undone. Associated questions will still exist.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const res = await fetch(
            `${BACKEND}/api/v1/questionpaper/delete/questionpaper/byid/${paper._id}`,
            { method: "DELETE", headers: { Authorization: "Bearer " + auth.token } }
          );
          if (!res.ok) throw new Error();
          setPapers((prev) => prev.filter((p) => p._id !== paper._id));
          message.success("Question paper deleted");
        } catch {
          message.error("Failed to delete question paper");
        }
      },
    });
  };

  return (
    <Card extra="w-full p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">Question Papers</h2>
          <p className="text-xs text-gray-400 mt-0.5">{papers.length} paper{papers.length !== 1 ? "s" : ""} total</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search papers..."
              className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
            />
          </div>
          <button
            onClick={() => navigate("/admin/manage-question-papers/create")}
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition font-medium"
          >
            <FaPlus className="h-3 w-3" />
            New Paper
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
          <MdLayers className="h-10 w-10 opacity-40" />
          <p className="text-sm">{search ? "No papers match your search" : "No question papers yet"}</p>
          {!search && (
            <button
              onClick={() => navigate("/admin/manage-question-papers/create")}
              className="text-sm text-blue-500 hover:underline"
            >
              Create your first paper
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-navy-600">
                {["Paper ID", "Category", "Subject", "Batch", "Questions", "Total Marks", "Difficulty", "Answer Key", "Status", ""].map((h) => (
                  <th key={h} className="pb-3 pr-4 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((paper) => {
                const answerKeyUrl = normFile(paper.answerKeyFile);
                return (
                  <tr key={paper._id} className="border-b border-gray-50 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-800 transition">
                    <td className="py-3 pr-4">
                      <p className="text-sm font-semibold text-navy-700 dark:text-white">
                        <code className="bg-gray-100 dark:bg-navy-700 px-2 py-0.5 rounded text-sm">
                          {paper.paperId}
                        </code>
                      </p>
                      {paper.description && (
                        <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{paper.description}</p>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-600 dark:text-gray-300">{paper.category}</td>
                    <td className="py-3 pr-4 text-sm text-gray-500 dark:text-gray-400">
                      {(paper.subjects || []).join(", ") || "—"}
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-500 dark:text-gray-400">
                      {paper.batch || "All"}
                    </td>
                    <td className="py-3 pr-4 text-sm font-bold text-navy-700 dark:text-white text-center">
                      {paper.totalQuestions || "—"}
                    </td>
                    <td className="py-3 pr-4 text-sm font-bold text-navy-700 dark:text-white text-center">
                      {paper.totalMarks || "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${difficultyStyles[paper.difficulty] || difficultyStyles.Medium}`}>
                        {paper.difficulty || "Medium"}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {answerKeyUrl ? (
                        <a
                          href={answerKeyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium"
                          title="Download answer key"
                        >
                          <MdFilePresent className="h-3.5 w-3.5" />
                          <MdDownload className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${paper.isActive !== false ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {paper.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/manage-question-papers/edit/${paper._id}`)}
                          title="Edit paper"
                          className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition"
                        >
                          <FaEdit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/manage-question-papers/${paper.paperId}/questions`)}
                          title="Manage questions"
                          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 hover:bg-indigo-100 transition"
                        >
                          <MdQuiz className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(paper)}
                          title="Delete paper"
                          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition"
                        >
                          <FaTrashAlt className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default QuestionPaperTable;