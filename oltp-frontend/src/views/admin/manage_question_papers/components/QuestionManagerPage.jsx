import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/card";
import { message } from "antd";
import { AuthContext } from "components/Auth-context";
import {
  MdAdd, MdDelete, MdArrowBack, MdSave, MdInfo,
  MdCheckBox, MdRadioButtonChecked, MdCalculate,
} from "react-icons/md";
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";

const inputCls = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

const TYPE_META = {
  MCQ: { icon: MdRadioButtonChecked, label: "MCQ", desc: "Single correct answer", color: "blue" },
  MSQ: { icon: MdCheckBox, label: "MSQ", desc: "Multiple correct answers", color: "indigo" },
  NAT: { icon: MdCalculate, label: "NAT", desc: "Numerical answer type", color: "violet" },
};

const emptyOption = () => ({ text: "" });

const defaultForm = {
  text: "",
  type: "MCQ",
  options: [emptyOption(), emptyOption(), emptyOption(), emptyOption()],
  correctOption: "",
  correctOptions: [],
  natMin: "",
  natMax: "",
  marksPositive: "",
  marksNegative: "",
  topic: "",
  difficulty: "Medium",
};

const QuestionManagerPage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { paperId } = useParams();

  const [paper, setPaper] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [paperRes, qRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/beta/questionpaper/get/questionpaper/bypaperid/${paperId}`),
          fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/beta/question/get/questions/bypaperid/${paperId}`,
            { headers: { Authorization: "Bearer " + auth.token } }
          ),
        ]);
        const paperData = await paperRes.json();
        const qData = await qRes.json();
        setPaper(paperData.questionPaper);
        setQuestions(qData.questions || []);
      } catch {
        message.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [paperId, auth.token]);

  const openCreate = () => {
    setForm(defaultForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (q) => {
    setForm({
      text: q.text || "",
      type: q.type || "MCQ",
      options: q.options?.length ? q.options.map((o) => ({ text: o.text || "" })) : [emptyOption(), emptyOption(), emptyOption(), emptyOption()],
      correctOption: q.correctOption?.toString() || "",
      correctOptions: q.correctOptions || [],
      natMin: q.natMin?.toString() || "",
      natMax: q.natMax?.toString() || "",
      marksPositive: q.marksPositive != null ? q.marksPositive.toString() : "",
      marksNegative: q.marksNegative != null ? q.marksNegative.toString() : "",
      topic: q.topic || "",
      difficulty: q.difficulty || "Medium",
    });
    setEditingId(q._id);
    setShowForm(true);
  };

  const handleOptionChange = (i, value) => {
    setForm((prev) => {
      const opts = [...prev.options];
      opts[i] = { text: value };
      return { ...prev, options: opts };
    });
  };

  const addOption = () => setForm((prev) => ({ ...prev, options: [...prev.options, emptyOption()] }));
  const removeOption = (i) => setForm((prev) => ({ ...prev, options: prev.options.filter((_, idx) => idx !== i) }));

  const toggleMSQOption = (i) => {
    setForm((prev) => {
      const co = prev.correctOptions.includes(i)
        ? prev.correctOptions.filter((x) => x !== i)
        : [...prev.correctOptions, i];
      return { ...prev, correctOptions: co };
    });
  };

  const handleSubmit = async () => {
    if (!form.text.trim()) { message.warning("Question text is required"); return; }
    if (form.type === "MCQ" && form.correctOption === "") { message.warning("Select the correct option"); return; }
    if (form.type === "MSQ" && form.correctOptions.length === 0) { message.warning("Select at least one correct option"); return; }
    if (form.type === "NAT" && (form.natMin === "" || form.natMax === "")) { message.warning("NAT range is required"); return; }

    setSubmitting(true);
    try {
      const payload = {
        paperId,
        text: form.text.trim(),
        type: form.type,
        options: form.type !== "NAT" ? form.options.filter((o) => o.text.trim()) : [],
        correctOption: form.type === "MCQ" ? form.correctOption : undefined,
        correctOptions: form.type === "MSQ" ? JSON.stringify(form.correctOptions) : undefined,
        natMin: form.type === "NAT" ? form.natMin : undefined,
        natMax: form.type === "NAT" ? form.natMax : undefined,
        marksPositive: form.marksPositive !== "" ? form.marksPositive : undefined,
        marksNegative: form.marksNegative !== "" ? form.marksNegative : undefined,
        topic: form.topic,
        difficulty: form.difficulty,
      };

      const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));
      cleanPayload.options = JSON.stringify(cleanPayload.options || []);

      const url = editingId
        ? `${process.env.REACT_APP_BACKEND_URL}/api/beta/question/update/question/byid/${editingId}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/beta/question/create/question`;
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify({ ...cleanPayload, options: payload.options }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Error");
      const data = await res.json();

      if (editingId) {
        setQuestions((prev) => prev.map((q) => q._id === editingId ? data.question : q));
      } else {
        setQuestions((prev) => [...prev, data.question]);
      }

      const paperRes = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/questionpaper/get/questionpaper/bypaperid/${paperId}`
      );
      const paperData = await paperRes.json();
      if (paperData.questionPaper) setPaper(paperData.questionPaper);

      message.success(editingId ? "Question updated" : "Question added");
      setShowForm(false);
    } catch (err) {
      message.error(err.message || "Failed to save question");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (qId) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/question/delete/question/byid/${qId}`,
        { method: "DELETE", headers: { Authorization: "Bearer " + auth.token } }
      );
      if (!res.ok) throw new Error();
      setQuestions((prev) => prev.filter((q) => q._id !== qId));

      const paperRes = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/questionpaper/get/questionpaper/bypaperid/${paperId}`
      );
      const paperData = await paperRes.json();
      if (paperData.questionPaper) setPaper(paperData.questionPaper);

      message.success("Question deleted");
    } catch {
      message.error("Failed to delete question");
    }
  };

  if (loading) {
    return (
      <Card extra="w-full p-12 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card extra="w-full p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-400 transition">
              <MdArrowBack className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-navy-700 dark:text-white">{paper?.paperName || paperId}</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                <code className="bg-gray-100 dark:bg-navy-700 px-1.5 py-0.5 rounded text-gray-500">{paper?.paperId}</code>
                <span className="mx-2">·</span>{paper?.category}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Questions", value: paper?.totalQuestions ?? questions.length },
              { label: "Total Marks", value: paper?.totalMarks ?? "—" },
              { label: "Marks/Q", value: paper?.marksPerQuestion ?? "—" },
              { label: "Neg. Marking", value: paper?.negativeMarking ? `−${paper.negativeFraction}` : "Off" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{value}</p>
                <p className="text-[11px] text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {showForm && (
        <Card extra="w-full p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-navy-700 dark:text-white">
              {editingId ? "Edit Question" : "Add New Question"}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-sm text-gray-400 hover:text-gray-600 transition">
              Cancel
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              {Object.entries(TYPE_META).map(([t, meta]) => (
                <button
                  key={t}
                  onClick={() => setForm((prev) => ({ ...prev, type: t }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition
                    ${form.type === t
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "border-gray-200 dark:border-navy-600 text-gray-500 hover:border-gray-300"}`}
                >
                  <meta.icon className="h-4 w-4" />
                  {meta.label}
                  <span className="hidden sm:inline text-xs opacity-70">— {meta.desc}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Question Text <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.text}
                onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
                rows={3}
                placeholder="Enter the question..."
                className={inputCls + " resize-none"}
              />
            </div>

            {form.type !== "NAT" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Options {form.type === "MSQ" && <span className="text-indigo-400 normal-case">(select all correct)</span>}
                  </label>
                  <button onClick={addOption} className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition">
                    <MdAdd className="h-3.5 w-3.5" /> Add option
                  </button>
                </div>
                <div className="space-y-2">
                  {form.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {form.type === "MCQ" ? (
                        <input
                          type="radio"
                          name="correctOption"
                          checked={form.correctOption === i.toString()}
                          onChange={() => setForm((prev) => ({ ...prev, correctOption: i.toString() }))}
                          className="h-4 w-4 text-blue-500"
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={form.correctOptions.includes(i)}
                          onChange={() => toggleMSQOption(i)}
                          className="h-4 w-4 text-indigo-500"
                        />
                      )}
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        className={inputCls + " flex-1"}
                      />
                      {form.options.length > 2 && (
                        <button onClick={() => removeOption(i)} className="p-1.5 text-red-400 hover:text-red-500 transition">
                          <MdDelete className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {form.type === "NAT" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Min Acceptable Value <span className="text-red-400">*</span>
                  </label>
                  <input type="number" step="any" value={form.natMin}
                    onChange={(e) => setForm((prev) => ({ ...prev, natMin: e.target.value }))}
                    placeholder="e.g. 9.8" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Max Acceptable Value <span className="text-red-400">*</span>
                  </label>
                  <input type="number" step="any" value={form.natMax}
                    onChange={(e) => setForm((prev) => ({ ...prev, natMax: e.target.value }))}
                    placeholder="e.g. 10.2" className={inputCls} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100 dark:border-navy-700">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  +Marks Override
                </label>
                <input type="number" step="0.5" value={form.marksPositive}
                  onChange={(e) => setForm((prev) => ({ ...prev, marksPositive: e.target.value }))}
                  placeholder={`Default (${paper?.marksPerQuestion ?? "paper"})`}
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  −Marks Override
                </label>
                <input type="number" step="0.25" value={form.marksNegative}
                  onChange={(e) => setForm((prev) => ({ ...prev, marksNegative: e.target.value }))}
                  placeholder={`Default (${paper?.negativeFraction ?? "paper"})`}
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Topic</label>
                <input type="text" value={form.topic}
                  onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
                  placeholder="e.g. Mechanics" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Difficulty</label>
                <select value={form.difficulty}
                  onChange={(e) => setForm((prev) => ({ ...prev, difficulty: e.target.value }))}
                  className={inputCls}>
                  {["Easy", "Medium", "Hard"].map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-60 transition"
              >
                <MdSave className="h-4 w-4" />
                {submitting ? "Saving..." : editingId ? "Update Question" : "Add Question"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </Card>
      )}

      <Card extra="w-full p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-navy-700 dark:text-white">
            Questions ({questions.length})
          </h3>
          {!showForm && (
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              <FaPlus className="h-3 w-3" />
              Add Question
            </button>
          )}
        </div>

        {questions.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-3 text-gray-400">
            <MdCalculate className="h-10 w-10 opacity-30" />
            <p className="text-sm">No questions yet</p>
            <button onClick={openCreate} className="text-sm text-blue-500 hover:underline">Add the first question</button>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={q._id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-navy-700 hover:border-gray-200 dark:hover:border-navy-600 transition">
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide
                      ${q.type === "MCQ" ? "bg-blue-100 text-blue-600" :
                        q.type === "MSQ" ? "bg-indigo-100 text-indigo-600" :
                        "bg-violet-100 text-violet-600"}`}>
                      {q.type}
                    </span>
                    <span className="text-[10px] bg-gray-100 dark:bg-navy-700 text-gray-500 px-1.5 py-0.5 rounded">
                      {q.difficulty || "Medium"}
                    </span>
                    {q.marksPositive != null && (
                      <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-medium">
                        +{q.marksPositive}
                      </span>
                    )}
                    {q.marksNegative != null && (
                      <span className="text-[10px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded font-medium">
                        −{q.marksNegative}
                      </span>
                    )}
                    {q.topic && <span className="text-[10px] text-gray-400">{q.topic}</span>}
                  </div>
                  <p className="text-sm text-navy-700 dark:text-white line-clamp-2">{q.text}</p>
                  {q.type !== "NAT" && q.options?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {q.options.map((o, oi) => (
                        <span key={oi} className={`text-[11px] px-2 py-0.5 rounded
                          ${(q.type === "MCQ" && q.correctOption === oi.toString()) ||
                            (q.type === "MSQ" && q.correctOptions?.includes(oi))
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium"
                            : "bg-gray-100 dark:bg-navy-700 text-gray-500"}`}>
                          {String.fromCharCode(65 + oi)}. {o.text}
                        </span>
                      ))}
                    </div>
                  )}
                  {q.type === "NAT" && (
                    <p className="text-xs text-gray-400 mt-1">Range: {q.natMin} — {q.natMax}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => openEdit(q)}
                    className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 transition">
                    <FaEdit className="h-3 w-3" />
                  </button>
                  <button onClick={() => handleDelete(q._id)}
                    className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-100 transition">
                    <FaTrashAlt className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default QuestionManagerPage;