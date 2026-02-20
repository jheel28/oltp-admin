import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "components/card";
import { message } from "antd";
import { AuthContext } from "components/Auth-context";

const QuizForm = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const [form, setForm] = useState({
    testName: "",
    category: "",
    subject: "",
    batch: "",
    duration: "",
    totalMarks: "",
    passingMarks: "",
    negativeMarking: false,
    negativeFraction: "0.25",
    shuffleQuestions: false,
    instructions: "",
    startDate: "",
    endDate: "",
    isActive: true,
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
    if (!form.testName.trim()) { message.warning("Test name is required"); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/beta/test/create/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Error");
      message.success("Test created successfully");
      navigate("/admin/manage-tests");
    } catch (err) {
      message.error(err.message || "Failed to create test");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card extra="w-full p-6">
      <h2 className="text-xl font-bold text-navy-700 dark:text-white mb-6">Create New Test</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Test Name */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Test Name *</label>
            <input
              type="text"
              name="testName"
              value={form.testName}
              onChange={handleChange}
              required
              placeholder="e.g. NEET Physics Mock Test 1"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
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

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Subject</label>
            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              disabled={!form.category || subjectOptions.length === 0}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            >
              <option value="">{!form.category ? "Select category first" : subjectOptions.length === 0 ? "No subjects in this category" : "Select subject..."}</option>
              {subjectOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Batch */}
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

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              min="1"
              placeholder="e.g. 180"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Total Marks */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Total Marks</label>
            <input
              type="number"
              name="totalMarks"
              value={form.totalMarks}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 720"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Passing Marks */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Passing Marks</label>
            <input
              type="number"
              name="passingMarks"
              value={form.passingMarks}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 360"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Start / End Dates */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Start Date</label>
            <input
              type="datetime-local"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">End Date</label>
            <input
              type="datetime-local"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="negativeMarking" checked={form.negativeMarking} onChange={handleChange} className="rounded" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Negative Marking</span>
          </label>
          {form.negativeMarking && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Deduction:</label>
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
            <input type="checkbox" name="shuffleQuestions" checked={form.shuffleQuestions} onChange={handleChange} className="rounded" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Shuffle Questions</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="rounded" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
          </label>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Instructions</label>
          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            rows={4}
            placeholder="Enter test instructions for students..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Test"}
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

export default QuizForm;