import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "components/card";
import { message } from "antd";
import { AuthContext } from "components/Auth-context";

const QuestionPaperForm = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const [form, setForm] = useState({
    questionPaperId: "",   // required by backend
    category: "",
    subjects: [],          // backend expects array
    subject: "",           // UI helper — gets turned into subjects array on submit
    difficulty: "Medium",
    noOfQuestions: "",     // backend field name
    score: "",             // backend field name (total marks)
    marksPerQuestion: "4",
    negativeMarking: false,
    negativeFraction: "0.25",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMeta = async () => {
      setLoadingMeta(true);
      try {
        const [cRes, bRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/beta/category/get/all`),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/beta/batch/get/all/batches`),
        ]);
        const cData = await cRes.json();
        const bData = await bRes.json();
        setCategories(cData.categories || []);
        setBatches(bData.batches || []);
      } catch {
        message.error("Failed to load categories/batches");
      } finally {
        setLoadingMeta(false);
      }
    };
    fetchMeta();
  }, []);

  const selectedCategory = categories.find((c) => c.name === form.category);
  const subjectOptions = selectedCategory?.subjects || [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "category" ? { subject: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.questionPaperId.trim()) { message.warning("Paper ID is required"); return; }
    if (!form.category) { message.warning("Category is required"); return; }
    setSubmitting(true);
    try {
      const payload = {
        questionPaperId: form.questionPaperId.trim(),
        category: form.category,
        subjects: form.subject ? [form.subject] : [],
        difficulty: form.difficulty,
        noOfQuestions: form.noOfQuestions,
        score: form.score,
        marksPerQuestion: form.marksPerQuestion,
        negativeMarking: form.negativeMarking,
        negativeFraction: form.negativeFraction,
        description: form.description,
      };
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/beta/questionpaper/create/questionpaper`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Error");
      message.success("Question paper created successfully");
      navigate("/admin/manage-question-papers");
    } catch (err) {
      message.error(err.message || "Failed to create question paper");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card extra="w-full p-6">
      <h2 className="text-xl font-bold text-navy-700 dark:text-white mb-6">Create Question Paper</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Paper Name *</label>
            <input
              type="text"
              name="paperName"
              value={form.paperName}
              onChange={handleChange}
              required
              placeholder="e.g. NEET 2024 Physics Paper"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={loadingMeta}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{loadingMeta ? "Loading..." : "Select category..."}</option>
              {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Subject</label>
            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              disabled={!form.category || subjectOptions.length === 0}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            >
              <option value="">{!form.category ? "Select category first" : subjectOptions.length === 0 ? "No subjects available" : "Select subject..."}</option>
              {subjectOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Batch</label>
            <select
              name="batch"
              value={form.batch}
              onChange={handleChange}
              disabled={loadingMeta}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{loadingMeta ? "Loading..." : "All batches"}</option>
              {batches.map((b) => <option key={b._id} value={b.batchName}>{b.batchName}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Total Questions</label>
            <input
              type="number"
              name="totalQuestions"
              value={form.totalQuestions}
              onChange={handleChange}
              min="1"
              placeholder="e.g. 45"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Marks per Question</label>
            <input
              type="number"
              name="marksPerQuestion"
              value={form.marksPerQuestion}
              onChange={handleChange}
              min="1"
              placeholder="e.g. 4"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Total Marks</label>
            <input
              type="number"
              name="totalMarks"
              value={form.totalMarks}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 180"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="negativeMarking" checked={form.negativeMarking} onChange={handleChange} className="rounded" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Negative Marking</span>
          </label>
          {form.negativeMarking && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Deduction per wrong:</label>
              <select
                name="negativeFraction"
                value={form.negativeFraction}
                onChange={handleChange}
                className="px-2 py-1 text-sm rounded border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none"
              >
                {["0.25", "0.33", "0.5", "1"].map((v) => <option key={v} value={v}>-{v}</option>)}
              </select>
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="rounded" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Optional description or notes..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Paper"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 text-sm rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
};

export default QuestionPaperForm;