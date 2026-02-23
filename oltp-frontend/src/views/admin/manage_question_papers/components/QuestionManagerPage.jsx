import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/card";
import { message } from "antd";
import { AuthContext } from "components/Auth-context";
import {
  MdAdd, MdDelete, MdArrowBack, MdSave, MdImage, MdClose,
  MdCheckBox, MdRadioButtonChecked, MdCalculate,
} from "react-icons/md";
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";

const inputCls = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

const TYPE_META = {
  MCQ: { icon: MdRadioButtonChecked, label: "MCQ", desc: "Single correct", color: "blue" },
  MSQ: { icon: MdCheckBox, label: "MSQ", desc: "Multiple correct", color: "indigo" },
  NAT: { icon: MdCalculate, label: "NAT", desc: "Numerical type", color: "violet" },
};

const emptyOption = () => ({ text: "", imageFile: null, imagePreview: null, existingImage: null, clearImage: false });

const defaultForm = () => ({
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
  questionImageFile: null,
  questionImagePreview: null,
  existingQuestionImage: null,
  clearQuestionImage: false,
});

const ImagePickerButton = ({ onSelect }) => {
  const ref = useRef();
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) {
            message.error("Image must be under 5 MB");
            return;
          }
          const preview = URL.createObjectURL(file);
          onSelect(file, preview);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition px-2 py-1 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100"
      >
        <MdImage className="h-3.5 w-3.5" /> Upload image
      </button>
    </>
  );
};

const ImagePreview = ({ src, onClear, label = "Image" }) => (
  <div className="mt-1.5 flex items-start gap-2">
    <img
      src={src}
      alt={label}
      className="h-24 max-w-[180px] object-contain rounded-lg border border-gray-200 dark:border-navy-600 bg-gray-50 dark:bg-navy-700"
    />
    <button
      type="button"
      onClick={onClear}
      className="p-1 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition flex-shrink-0"
      title="Remove image"
    >
      <MdClose className="h-3.5 w-3.5" />
    </button>
  </div>
);

const QuestionManagerPage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { paperId } = useParams();

  const [paper, setPaper] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm());
  const [submitting, setSubmitting] = useState(false);

  const BACKEND = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [paperRes, qRes] = await Promise.all([
          fetch(`${BACKEND}/api/v1/questionpaper/get/questionpaper/bypaperid/${paperId}`),
          fetch(`${BACKEND}/api/v1/question/get/questions/bypaperid/${paperId}`, {
            headers: { Authorization: "Bearer " + auth.token },
          }),
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
  }, [paperId, auth.token, BACKEND]);

  const refreshPaper = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/v1/questionpaper/get/questionpaper/bypaperid/${paperId}`);
      const data = await res.json();
      if (data.questionPaper) setPaper(data.questionPaper);
    } catch (_) {}
  };

  const openCreate = () => {
    setForm(defaultForm());
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (q) => {
    setForm({
      text: q.text || "",
      type: q.type || "MCQ",
      options: q.options?.length
        ? q.options.map((o) => ({
            text: o.text || "",
            imageFile: null,
            imagePreview: null,
            existingImage: o.image || null,
            clearImage: false,
          }))
        : [emptyOption(), emptyOption(), emptyOption(), emptyOption()],
      correctOption: q.correctOption?.toString() || "",
      correctOptions: q.correctOptions || [],
      natMin: q.natMin?.toString() || "",
      natMax: q.natMax?.toString() || "",
      marksPositive: q.marksPositive != null ? q.marksPositive.toString() : "",
      marksNegative: q.marksNegative != null ? q.marksNegative.toString() : "",
      topic: q.topic || "",
      difficulty: q.difficulty || "Medium",
      questionImageFile: null,
      questionImagePreview: null,
      existingQuestionImage: q.questionImage || null,
      clearQuestionImage: false,
    });
    setEditingId(q._id);
    setShowForm(true);
  };

  const setF = (updater) => setForm((prev) => typeof updater === "function" ? updater(prev) : { ...prev, ...updater });

  const handleOptionChange = (i, value) => {
    setF((prev) => {
      const opts = [...prev.options];
      opts[i] = { ...opts[i], text: value };
      return { ...prev, options: opts };
    });
  };

  const handleOptionImageSelect = (i, file, preview) => {
    setF((prev) => {
      const opts = [...prev.options];
      opts[i] = { ...opts[i], imageFile: file, imagePreview: preview, clearImage: false };
      return { ...prev, options: opts };
    });
  };

  const handleOptionImageClear = (i) => {
    setF((prev) => {
      const opts = [...prev.options];
      const hadExisting = !!opts[i].existingImage;
      opts[i] = { ...opts[i], imageFile: null, imagePreview: null, clearImage: hadExisting };
      return { ...prev, options: opts };
    });
  };

  const addOption = () => setF((prev) => ({ ...prev, options: [...prev.options, emptyOption()] }));

  const removeOption = (i) => {
    setF((prev) => ({ ...prev, options: prev.options.filter((_, idx) => idx !== i) }));
  };

  const toggleMSQOption = (i) => {
    setF((prev) => {
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
      const fd = new FormData();
      fd.append("paperId", paperId);
      fd.append("text", form.text.trim());
      fd.append("type", form.type);
      fd.append("topic", form.topic);
      fd.append("difficulty", form.difficulty);

      if (form.marksPositive !== "") fd.append("marksPositive", form.marksPositive);
      if (form.marksNegative !== "") fd.append("marksNegative", form.marksNegative);

      if (form.type === "MCQ") fd.append("correctOption", form.correctOption);
      if (form.type === "MSQ") fd.append("correctOptions", JSON.stringify(form.correctOptions));
      if (form.type === "NAT") {
        fd.append("natMin", form.natMin);
        fd.append("natMax", form.natMax);
      }

      const filteredOptions = form.type !== "NAT"
        ? form.options.map((o) => ({
            text: o.text,
            image: o.existingImage || undefined,
            clearImage: o.clearImage || undefined,
          }))
        : [];
      fd.append("options", JSON.stringify(filteredOptions));

      if (form.questionImageFile) {
        fd.append("questionImage", form.questionImageFile);
      } else if (form.clearQuestionImage) {
        fd.append("clearQuestionImage", "true");
      }

      form.options.forEach((opt, i) => {
        if (opt.imageFile) {
          fd.append(`optionImage_${i}`, opt.imageFile);
        }
      });

      const url = editingId
        ? `${BACKEND}/api/v1/question/update/question/byid/${editingId}`
        : `${BACKEND}/api/v1/question/create/question`;
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: "Bearer " + auth.token },
        body: fd,
      });
      if (!res.ok) throw new Error((await res.json()).message || "Error");
      const data = await res.json();

      if (editingId) {
        setQuestions((prev) => prev.map((q) => q._id === editingId ? data.question : q));
      } else {
        setQuestions((prev) => [...prev, data.question]);
      }

      await refreshPaper();
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
      const res = await fetch(`${BACKEND}/api/v1/question/delete/question/byid/${qId}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + auth.token },
      });
      if (!res.ok) throw new Error();
      setQuestions((prev) => prev.filter((q) => q._id !== qId));
      await refreshPaper();
      message.success("Question deleted");
    } catch {
      message.error("Failed to delete question");
    }
  };

  const questionImageSrc = form.questionImagePreview
    || (form.existingQuestionImage && !form.clearQuestionImage
      ? `${BACKEND}/${form.existingQuestionImage}` : null);

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
            <div className="flex gap-2 flex-wrap">
              {Object.entries(TYPE_META).map(([t, meta]) => (
                <button
                  key={t}
                  onClick={() => setF({ type: t })}
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
                onChange={(e) => setF({ text: e.target.value })}
                rows={3}
                placeholder="Enter the question..."
                className={inputCls + " resize-none"}
              />
              <div className="mt-2 flex items-center gap-3">
                {!questionImageSrc && (
                  <ImagePickerButton
                    onSelect={(file, preview) =>
                      setF({ questionImageFile: file, questionImagePreview: preview, clearQuestionImage: false })
                    }
                  />
                )}
                {questionImageSrc && (
                  <ImagePreview
                    src={questionImageSrc}
                    label="Question image"
                    onClear={() =>
                      setF((prev) => ({
                        ...prev,
                        questionImageFile: null,
                        questionImagePreview: null,
                        clearQuestionImage: !!prev.existingQuestionImage,
                      }))
                    }
                  />
                )}
              </div>
            </div>

            {form.type !== "NAT" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Options{" "}
                    {form.type === "MSQ" && <span className="text-indigo-400 normal-case font-normal">(check all correct)</span>}
                  </label>
                  <button onClick={addOption} className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition">
                    <MdAdd className="h-3.5 w-3.5" /> Add option
                  </button>
                </div>
                <div className="space-y-3">
                  {form.options.map((opt, i) => {
                    const optImgSrc = opt.imagePreview
                      || (opt.existingImage && !opt.clearImage
                        ? `${BACKEND}/${opt.existingImage}` : null);
                    return (
                      <div key={i} className="rounded-xl border border-gray-100 dark:border-navy-700 p-3">
                        <div className="flex items-center gap-2">
                          {form.type === "MCQ" ? (
                            <input
                              type="radio"
                              name="correctOption"
                              checked={form.correctOption === i.toString()}
                              onChange={() => setF({ correctOption: i.toString() })}
                              className="h-4 w-4 text-blue-500 flex-shrink-0"
                            />
                          ) : (
                            <input
                              type="checkbox"
                              checked={form.correctOptions.includes(i)}
                              onChange={() => toggleMSQOption(i)}
                              className="h-4 w-4 text-indigo-500 flex-shrink-0"
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
                            <button onClick={() => removeOption(i)} className="p-1.5 text-red-400 hover:text-red-500 transition flex-shrink-0">
                              <MdDelete className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="mt-2 pl-6">
                          {!optImgSrc ? (
                            <ImagePickerButton
                              onSelect={(file, preview) => handleOptionImageSelect(i, file, preview)}
                            />
                          ) : (
                            <ImagePreview
                              src={optImgSrc}
                              label={`Option ${String.fromCharCode(65 + i)} image`}
                              onClear={() => handleOptionImageClear(i)}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                    onChange={(e) => setF({ natMin: e.target.value })}
                    placeholder="e.g. 9.8" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Max Acceptable Value <span className="text-red-400">*</span>
                  </label>
                  <input type="number" step="any" value={form.natMax}
                    onChange={(e) => setF({ natMax: e.target.value })}
                    placeholder="e.g. 10.2" className={inputCls} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100 dark:border-navy-700">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">+Marks Override</label>
                <input type="number" step="0.5" value={form.marksPositive}
                  onChange={(e) => setF({ marksPositive: e.target.value })}
                  placeholder={`Default (${paper?.marksPerQuestion ?? "paper"})`}
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">−Marks Override</label>
                <input type="number" step="0.25" value={form.marksNegative}
                  onChange={(e) => setF({ marksNegative: e.target.value })}
                  placeholder={`Default (${paper?.negativeFraction ?? "paper"})`}
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Topic</label>
                <input type="text" value={form.topic}
                  onChange={(e) => setF({ topic: e.target.value })}
                  placeholder="e.g. Mechanics" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Difficulty</label>
                <select value={form.difficulty}
                  onChange={(e) => setF({ difficulty: e.target.value })}
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
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                    {q.questionImage && (
                      <span className="text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <MdImage className="h-2.5 w-2.5" /> img
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-navy-700 dark:text-white line-clamp-2">{q.text}</p>
                  {q.questionImage && (
                    <img
                      src={`${BACKEND}/${q.questionImage}`}
                      alt="question"
                      className="mt-1.5 h-16 max-w-[120px] object-contain rounded-lg border border-gray-100"
                    />
                  )}
                  {q.type !== "NAT" && q.options?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {q.options.map((o, oi) => {
                        const isCorrect =
                          (q.type === "MCQ" && q.correctOption === oi.toString()) ||
                          (q.type === "MSQ" && q.correctOptions?.includes(oi));
                        return (
                          <span key={oi} className={`text-[11px] px-2 py-0.5 rounded inline-flex items-center gap-1
                            ${isCorrect
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium"
                              : "bg-gray-100 dark:bg-navy-700 text-gray-500"}`}>
                            {String.fromCharCode(65 + oi)}. {o.text}
                            {o.image && <MdImage className="h-2.5 w-2.5 opacity-60" />}
                          </span>
                        );
                      })}
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