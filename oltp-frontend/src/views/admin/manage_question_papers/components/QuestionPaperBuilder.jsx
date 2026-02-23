import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/card";
import { message } from "antd";
import { AuthContext } from "components/Auth-context";
import {
  MdCheck, MdArrowBack, MdArrowForward, MdSave, MdAutoAwesome,
  MdAdd, MdDelete, MdImage, MdClose, MdCheckBox, MdRadioButtonChecked,
  MdCalculate, MdOutlineQuiz,
} from "react-icons/md";
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const normImg = (p) => {
  if (!p) return null;
  const n = String(p).replace(/\\/g, "/").replace(/^\/+/, "");
  if (n.startsWith("http://") || n.startsWith("https://")) return n;
  return `${BACKEND}/${n}`;
};

const STEPS = ["Paper Details", "Marking Scheme", "Add Questions", "Settings & Review"];

const TYPE_META = {
  MCQ: { icon: MdRadioButtonChecked, label: "MCQ", desc: "Single correct" },
  MSQ: { icon: MdCheckBox, label: "MSQ", desc: "Multiple correct" },
  NAT: { icon: MdCalculate, label: "NAT", desc: "Numerical type" },
};

const emptyOption = () => ({
  text: "", imageFile: null, imagePreview: null, existingImage: null, clearImage: false,
});

const defaultQForm = () => ({
  text: "", type: "MCQ",
  options: [emptyOption(), emptyOption(), emptyOption(), emptyOption()],
  correctOption: "", correctOptions: [],
  natMin: "", natMax: "",
  marksPositive: "", marksNegative: "",
  topic: "", difficulty: "Medium",
  questionImageFile: null, questionImagePreview: null,
  existingQuestionImage: null, clearQuestionImage: false,
});

const inputCls = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

// ─── Shared sub-components ───────────────────────────────────────────────────

const StepIndicator = ({ current }) => (
  <div className="flex items-center gap-0 mb-8">
    {STEPS.map((label, i) => (
      <React.Fragment key={i}>
        <div className="flex flex-col items-center gap-1">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
            ${i < current ? "bg-blue-500 text-white" :
              i === current ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900" :
              "bg-gray-100 dark:bg-navy-700 text-gray-400"}`}>
            {i < current ? <MdCheck className="h-4 w-4" /> : i + 1}
          </div>
          <span className={`text-[10px] font-medium whitespace-nowrap
            ${i === current ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`}>
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all
            ${i < current ? "bg-blue-500" : "bg-gray-200 dark:bg-navy-600"}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

const Field = ({ label, required, children, hint }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
  </div>
);

const ImagePickerButton = ({ onSelect }) => {
  const ref = useRef();
  return (
    <>
      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) { message.error("Image must be under 5 MB"); return; }
          onSelect(file, URL.createObjectURL(file));
          e.target.value = "";
        }}
      />
      <button type="button" onClick={() => ref.current?.click()}
        className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition px-2 py-1 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100">
        <MdImage className="h-3.5 w-3.5" /> Upload image
      </button>
    </>
  );
};

const ImagePreview = ({ src, onClear, label = "Image" }) => (
  <div className="mt-1.5 flex items-start gap-2">
    <img src={src} alt={label}
      className="h-24 max-w-[180px] object-contain rounded-lg border border-gray-200 dark:border-navy-600 bg-gray-50 dark:bg-navy-700"
      onError={(e) => { e.currentTarget.style.display = "none"; }}
    />
    <button type="button" onClick={onClear}
      className="p-1 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition flex-shrink-0">
      <MdClose className="h-3.5 w-3.5" />
    </button>
  </div>
);

// ─── Inline Question Form ─────────────────────────────────────────────────────

const QuestionForm = ({ paperId, paper, editingId, initialForm, onSaved, onCancel }) => {
  const auth = useContext(AuthContext);
  const [form, setForm] = useState(initialForm || defaultQForm());
  const [submitting, setSubmitting] = useState(false);

  const setF = (u) => setForm((p) => typeof u === "function" ? u(p) : { ...p, ...u });

  const handleOptionChange = (i, val) =>
    setF((p) => { const o = [...p.options]; o[i] = { ...o[i], text: val }; return { ...p, options: o }; });

  const handleOptionImgSelect = (i, file, preview) =>
    setF((p) => { const o = [...p.options]; o[i] = { ...o[i], imageFile: file, imagePreview: preview, clearImage: false }; return { ...p, options: o }; });

  const handleOptionImgClear = (i) =>
    setF((p) => { const o = [...p.options]; o[i] = { ...o[i], imageFile: null, imagePreview: null, clearImage: !!o[i].existingImage }; return { ...p, options: o }; });

  const addOption = () => setF((p) => ({ ...p, options: [...p.options, emptyOption()] }));
  const removeOption = (i) => setF((p) => ({ ...p, options: p.options.filter((_, idx) => idx !== i) }));
  const toggleMSQ = (i) =>
    setF((p) => ({ ...p, correctOptions: p.correctOptions.includes(i) ? p.correctOptions.filter((x) => x !== i) : [...p.correctOptions, i] }));

  const qImgSrc = form.questionImagePreview
    || (form.existingQuestionImage && !form.clearQuestionImage ? normImg(form.existingQuestionImage) : null);

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
      if (form.type === "NAT") { fd.append("natMin", form.natMin); fd.append("natMax", form.natMax); }

      const opts = form.type !== "NAT"
        ? form.options.map((o) => ({ text: o.text, image: o.existingImage || undefined, clearImage: o.clearImage || undefined }))
        : [];
      fd.append("options", JSON.stringify(opts));

      if (form.questionImageFile) fd.append("questionImage", form.questionImageFile);
      else if (form.clearQuestionImage) fd.append("clearQuestionImage", "true");
      form.options.forEach((opt, i) => { if (opt.imageFile) fd.append(`optionImage_${i}`, opt.imageFile); });

      const url = editingId
        ? `${BACKEND}/api/v1/question/update/question/byid/${editingId}`
        : `${BACKEND}/api/v1/question/create/question`;

      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { Authorization: "Bearer " + auth.token },
        body: fd,
      });
      if (!res.ok) throw new Error((await res.json()).message || "Error");
      const data = await res.json();
      message.success(editingId ? "Question updated" : "Question added");
      onSaved(data.question, !!editingId);
    } catch (err) {
      message.error(err.message || "Failed to save question");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-navy-700">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-navy-700 dark:text-white">
          {editingId ? "Edit Question" : "Add New Question"}
        </h4>
        <button onClick={onCancel} className="text-xs text-gray-400 hover:text-gray-600 transition">Cancel</button>
      </div>

      {/* Type selector */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(TYPE_META).map(([t, meta]) => (
          <button key={t} onClick={() => setF({ type: t })}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition
              ${form.type === t
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "border-gray-200 dark:border-navy-600 text-gray-500 hover:border-gray-300"}`}>
            <meta.icon className="h-4 w-4" />
            {meta.label}
            <span className="hidden sm:inline text-xs opacity-70">— {meta.desc}</span>
          </button>
        ))}
      </div>

      {/* Question text */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Question Text <span className="text-red-400">*</span>
        </label>
        <textarea value={form.text} onChange={(e) => setF({ text: e.target.value })}
          rows={3} placeholder="Enter the question..." className={inputCls + " resize-none"} />
        <div className="mt-2 flex items-center gap-3">
          {!qImgSrc && (
            <ImagePickerButton onSelect={(file, preview) =>
              setF({ questionImageFile: file, questionImagePreview: preview, clearQuestionImage: false })} />
          )}
          {qImgSrc && (
            <ImagePreview src={qImgSrc} label="Question image"
              onClear={() => setF((p) => ({
                ...p, questionImageFile: null, questionImagePreview: null,
                clearQuestionImage: !!p.existingQuestionImage,
              }))} />
          )}
        </div>
      </div>

      {/* Options */}
      {form.type !== "NAT" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Options
              {form.type === "MSQ" && <span className="text-indigo-400 normal-case font-normal ml-1">(check all correct)</span>}
            </label>
            <button onClick={addOption} className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition">
              <MdAdd className="h-3.5 w-3.5" /> Add option
            </button>
          </div>
          <div className="space-y-3">
            {form.options.map((opt, i) => {
              const optImgSrc = opt.imagePreview || (opt.existingImage && !opt.clearImage ? normImg(opt.existingImage) : null);
              return (
                <div key={i} className="rounded-xl border border-gray-100 dark:border-navy-700 p-3">
                  <div className="flex items-center gap-2">
                    {form.type === "MCQ" ? (
                      <input type="radio" name="correctOption" checked={form.correctOption === i.toString()}
                        onChange={() => setF({ correctOption: i.toString() })} className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    ) : (
                      <input type="checkbox" checked={form.correctOptions.includes(i)}
                        onChange={() => toggleMSQ(i)} className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                    )}
                    <input type="text" value={opt.text} onChange={(e) => handleOptionChange(i, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + i)}`} className={inputCls + " flex-1"} />
                    {form.options.length > 2 && (
                      <button onClick={() => removeOption(i)} className="p-1.5 text-red-400 hover:text-red-500 transition flex-shrink-0">
                        <MdDelete className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="mt-2 pl-6">
                    {!optImgSrc ? (
                      <ImagePickerButton onSelect={(f, p) => handleOptionImgSelect(i, f, p)} />
                    ) : (
                      <ImagePreview src={optImgSrc} label={`Option ${String.fromCharCode(65 + i)} image`}
                        onClear={() => handleOptionImgClear(i)} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NAT */}
      {form.type === "NAT" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Min Value <span className="text-red-400">*</span></label>
            <input type="number" step="any" value={form.natMin} onChange={(e) => setF({ natMin: e.target.value })}
              placeholder="e.g. 9.8" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Max Value <span className="text-red-400">*</span></label>
            <input type="number" step="any" value={form.natMax} onChange={(e) => setF({ natMax: e.target.value })}
              placeholder="e.g. 10.2" className={inputCls} />
          </div>
        </div>
      )}

      {/* Marks / topic / difficulty */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100 dark:border-navy-700">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">+Marks Override</label>
          <input type="number" step="0.5" value={form.marksPositive} onChange={(e) => setF({ marksPositive: e.target.value })}
            placeholder={`Default (${paper?.marksPerQuestion ?? 4})`} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">−Marks Override</label>
          <input type="number" step="0.25" value={form.marksNegative} onChange={(e) => setF({ marksNegative: e.target.value })}
            placeholder={`Default`} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Topic</label>
          <input type="text" value={form.topic} onChange={(e) => setF({ topic: e.target.value })}
            placeholder="e.g. Mechanics" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Difficulty</label>
          <select value={form.difficulty} onChange={(e) => setF({ difficulty: e.target.value })} className={inputCls}>
            {["Easy", "Medium", "Hard"].map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={handleSubmit} disabled={submitting}
          className="flex items-center gap-2 px-5 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-60 transition">
          <MdSave className="h-4 w-4" />
          {submitting ? "Saving..." : editingId ? "Update Question" : "Add Question"}
        </button>
        <button onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition">
          Cancel
        </button>
      </div>
    </div>
  );
};

// ─── Questions Step ───────────────────────────────────────────────────────────

const QuestionsStep = ({ paperId, paper, questions, setQuestions }) => {
  const auth = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editInitial, setEditInitial] = useState(null);

  const openCreate = () => {
    setEditingId(null);
    setEditInitial(defaultQForm());
    setShowForm(true);
  };

  const openEdit = (q) => {
    setEditInitial({
      text: q.text || "", type: q.type || "MCQ",
      options: q.options?.length
        ? q.options.map((o) => ({ text: o.text || "", imageFile: null, imagePreview: null, existingImage: o.image || null, clearImage: false }))
        : [emptyOption(), emptyOption(), emptyOption(), emptyOption()],
      correctOption: q.correctOption?.toString() || "",
      correctOptions: q.correctOptions || [],
      natMin: q.natMin?.toString() || "", natMax: q.natMax?.toString() || "",
      marksPositive: q.marksPositive != null ? q.marksPositive.toString() : "",
      marksNegative: q.marksNegative != null ? q.marksNegative.toString() : "",
      topic: q.topic || "", difficulty: q.difficulty || "Medium",
      questionImageFile: null, questionImagePreview: null,
      existingQuestionImage: q.questionImage || null, clearQuestionImage: false,
    });
    setEditingId(q._id);
    setShowForm(true);
  };

  const handleSaved = (savedQ, wasEdit) => {
    setQuestions((prev) => wasEdit ? prev.map((q) => q._id === savedQ._id ? savedQ : q) : [...prev, savedQ]);
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = async (qId) => {
    try {
      const res = await fetch(`${BACKEND}/api/v1/question/delete/question/byid/${qId}`, {
        method: "DELETE", headers: { Authorization: "Bearer " + auth.token },
      });
      if (!res.ok) throw new Error();
      setQuestions((prev) => prev.filter((q) => q._id !== qId));
      message.success("Question deleted");
    } catch {
      message.error("Failed to delete question");
    }
  };

  const totalMarks = questions.reduce((s, q) => s + (q.marksPositive ?? paper?.marksPerQuestion ?? 4), 0);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 p-4 flex items-start gap-3">
        <MdOutlineQuiz className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Paper saved — add questions now</p>
          <p className="text-xs text-blue-600 dark:text-blue-500 mt-0.5">
            Questions are saved to the server immediately. You can skip ahead and add more later from the Question Manager.
          </p>
        </div>
        {questions.length > 0 && (
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{questions.length}</p>
            <p className="text-[10px] text-blue-500">questions</p>
            <p className="text-[10px] text-blue-500">{totalMarks} marks</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-navy-700 dark:text-white">
          Questions ({questions.length})
        </span>
        {!showForm && (
          <button onClick={openCreate}
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
            <FaPlus className="h-3 w-3" /> Add Question
          </button>
        )}
      </div>

      {showForm && (
        <div className="rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800 p-4">
          <QuestionForm
            paperId={paperId}
            paper={paper}
            editingId={editingId}
            initialForm={editInitial}
            onSaved={handleSaved}
            onCancel={() => { setShowForm(false); setEditingId(null); }}
          />
        </div>
      )}

      {questions.length === 0 && !showForm ? (
        <div className="py-12 flex flex-col items-center gap-3 text-gray-400 rounded-xl border border-dashed border-gray-200 dark:border-navy-600">
          <MdOutlineQuiz className="h-10 w-10 opacity-30" />
          <p className="text-sm">No questions yet</p>
          <button onClick={openCreate} className="text-sm text-blue-500 hover:underline">Add the first question</button>
        </div>
      ) : (
        <div className="space-y-2">
          {questions.map((q, idx) => (
            <div key={q._id}
              className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-navy-700 hover:border-gray-200 dark:hover:border-navy-600 transition bg-white dark:bg-navy-800">
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">{idx + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide
                    ${q.type === "MCQ" ? "bg-blue-100 text-blue-600" : q.type === "MSQ" ? "bg-indigo-100 text-indigo-600" : "bg-violet-100 text-violet-600"}`}>
                    {q.type}
                  </span>
                  <span className="text-[10px] bg-gray-100 dark:bg-navy-700 text-gray-500 px-1.5 py-0.5 rounded">
                    {q.difficulty || "Medium"}
                  </span>
                  {q.marksPositive != null && (
                    <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-medium">+{q.marksPositive}</span>
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
                    src={normImg(q.questionImage)}
                    alt="question"
                    className="mt-1 h-16 max-w-[120px] object-contain rounded-lg border border-gray-100"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
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
    </div>
  );
};

// ─── Main Builder ─────────────────────────────────────────────────────────────

const QuestionPaperBuilder = ({ mode = "create" }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingPaper, setLoadingPaper] = useState(mode === "edit");
  const [savingPaper, setSavingPaper] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [serverPaper, setServerPaper] = useState(null);
  const [paperPersistedOnce, setPaperPersistedOnce] = useState(mode === "edit");
  const [questions, setQuestions] = useState([]);

  const [form, setForm] = useState({
    paperId: "", paperName: "", category: "", subject: "", batch: "",
    difficulty: "Medium", marksPerQuestion: "4", negativeMarking: false,
    negativeFraction: "0.25", isActive: true, description: "",
  });

  useEffect(() => {
    const fetchMeta = async () => {
      setLoadingMeta(true);
      try {
        const [cRes, bRes] = await Promise.all([
          fetch(`${BACKEND}/api/v1/category/get/all`),
          fetch(`${BACKEND}/api/v1/batch/get/all/batches`),
        ]);
        setCategories((await cRes.json()).categories || []);
        setBatches((await bRes.json()).batches || []);
      } catch {
        message.error("Failed to load categories/batches");
      } finally {
        setLoadingMeta(false);
      }
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !id) return;
    const fetchPaper = async () => {
      setLoadingPaper(true);
      try {
        const res = await fetch(`${BACKEND}/api/v1/questionpaper/get/questionpaper/byid/${id}`,
          { headers: { Authorization: "Bearer " + auth.token } });
        const data = await res.json();
        const p = data.questionPaper;
        if (p) {
          setServerPaper(p);
          setForm({
            paperId: p.paperId || "",
            paperName: p.paperName || "",
            category: p.category || "",
            subject: (p.subjects || [])[0] || "",
            batch: p.batch || "",
            difficulty: p.difficulty || "Medium",
            marksPerQuestion: p.marksPerQuestion?.toString() || "4",
            negativeMarking: p.negativeMarking || false,
            negativeFraction: p.negativeFraction?.toString() || "0.25",
            isActive: p.isActive !== false,
            description: p.description || "",
          });
          const qRes = await fetch(`${BACKEND}/api/v1/question/get/questions/bypaperid/${p.paperId}`,
            { headers: { Authorization: "Bearer " + auth.token } });
          setQuestions((await qRes.json()).questions || []);
        }
      } catch {
        message.error("Failed to load question paper");
      } finally {
        setLoadingPaper(false);
      }
    };
    fetchPaper();
  }, [id, mode, auth.token]);

  const selectedCategory = categories.find((c) => c.name === form.category);
  const subjectOptions = selectedCategory?.subjects || [];

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "category" ? { subject: "" } : {}),
    }));
  }, []);

  const validateStep = (s) => {
    if (s === 0) {
      if (!form.paperName.trim()) { message.warning("Paper name is required"); return false; }
      if (mode === "create" && !form.paperId.trim()) { message.warning("Paper ID is required"); return false; }
      if (!form.category) { message.warning("Category is required"); return false; }
    }
    if (s === 1) {
      if (!form.marksPerQuestion) { message.warning("Marks per question is required"); return false; }
    }
    return true;
  };

  const persistPaper = async () => {
    const payload = {
      paperName: form.paperName.trim(),
      category: form.category,
      subjects: form.subject ? [form.subject] : [],
      batch: form.batch,
      difficulty: form.difficulty,
      marksPerQuestion: Number(form.marksPerQuestion),
      negativeMarking: form.negativeMarking,
      negativeFraction: Number(form.negativeFraction),
      isActive: form.isActive,
      description: form.description,
    };

    if (mode === "create" && !paperPersistedOnce) {
      payload.paperId = form.paperId.trim();
      const res = await fetch(`${BACKEND}/api/v1/questionpaper/create/questionpaper`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Error creating paper");
      const data = await res.json();
      setServerPaper(data.questionPaper);
      setPaperPersistedOnce(true);
      return data.questionPaper;
    } else {
      const targetId = serverPaper?._id || id;
      const res = await fetch(`${BACKEND}/api/v1/questionpaper/update/questionpaper/byid/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Error updating paper");
      const data = await res.json();
      setServerPaper(data.questionPaper);
      return data.questionPaper;
    }
  };

  const handleNext = async () => {
    if (!validateStep(step)) return;
    if (step === 1) {
      setSavingPaper(true);
      try {
        await persistPaper();
        setStep(2);
      } catch (err) {
        message.error(err.message || "Failed to save paper");
      } finally {
        setSavingPaper(false);
      }
      return;
    }
    setStep((s) => s + 1);
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      await persistPaper();
      message.success(`Question paper ${mode === "create" ? "created" : "updated"} successfully`);
      navigate("/admin/manage-question-papers");
    } catch (err) {
      message.error(err.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const activePaperId = serverPaper?.paperId || form.paperId;
  const activePaperObj = serverPaper || {
    marksPerQuestion: Number(form.marksPerQuestion),
    negativeFraction: Number(form.negativeFraction),
    negativeMarking: form.negativeMarking,
  };

  if (loadingPaper) {
    return (
      <Card extra="w-full p-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-sm">Loading paper...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card extra="w-full p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-400 transition">
          <MdArrowBack className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">
            {mode === "create" ? "Create Question Paper" : "Edit Question Paper"}
          </h2>
          {activePaperId && (
            <p className="text-xs text-gray-400 mt-0.5">
              <code className="bg-gray-100 dark:bg-navy-700 px-1.5 py-0.5 rounded">{activePaperId}</code>
              {questions.length > 0 && (
                <span className="ml-2 text-blue-500 font-medium">
                  {questions.length} question{questions.length !== 1 ? "s" : ""}
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      <StepIndicator current={step} />

      {/* ── Step 0: Paper Details ── */}
      {step === 0 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mode === "create" && (
              <Field label="Paper ID" required hint="Unique identifier — cannot be changed later">
                <input type="text" name="paperId" value={form.paperId} onChange={handleChange}
                  placeholder="e.g. NEET-2024-PHY" className={inputCls}
                  disabled={paperPersistedOnce} />
              </Field>
            )}
            <Field label="Paper Name" required>
              <input type="text" name="paperName" value={form.paperName} onChange={handleChange}
                placeholder="e.g. NEET 2024 Physics" className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category" required>
              <select name="category" value={form.category} onChange={handleChange}
                disabled={loadingMeta} className={inputCls}>
                <option value="">{loadingMeta ? "Loading..." : "Select category..."}</option>
                {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Subject">
              <select name="subject" value={form.subject} onChange={handleChange}
                disabled={!form.category} className={inputCls + " disabled:opacity-50"}>
                <option value="">{!form.category ? "Select category first" : "Select subject..."}</option>
                {form.subject && !subjectOptions.includes(form.subject) && (
                  <option value={form.subject}>{form.subject}</option>
                )}
                {subjectOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Batch">
              <select name="batch" value={form.batch} onChange={handleChange}
                disabled={loadingMeta} className={inputCls}>
                <option value="">All Batches</option>
                {batches.map((b) => <option key={b._id} value={b.batchName}>{b.batchName}</option>)}
              </select>
            </Field>
            <Field label="Difficulty">
              <select name="difficulty" value={form.difficulty} onChange={handleChange} className={inputCls}>
                {["Easy", "Medium", "Hard"].map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={3} placeholder="Optional notes or instructions for this paper..."
              className={inputCls + " resize-none"} />
          </Field>
        </div>
      )}

      {/* ── Step 1: Marking Scheme ── */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 p-4 flex items-start gap-3">
            <MdAutoAwesome className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Almost there</p>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-0.5">
                Clicking "Save & Add Questions" will create the paper in the system so you can add questions in the very next step.
              </p>
            </div>
          </div>

          <Field label="Marks Per Question" required hint="Default marks for a correct answer. Can be overridden per question.">
            <input type="number" name="marksPerQuestion" value={form.marksPerQuestion}
              onChange={handleChange} min="1" step="0.5" placeholder="e.g. 4"
              className={inputCls + " w-40"} />
          </Field>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="negativeMarking" checked={form.negativeMarking}
                  onChange={handleChange} className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-200 peer-checked:bg-blue-500 rounded-full peer-focus:ring-2 peer-focus:ring-blue-300 dark:bg-navy-600 transition after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
              </label>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Negative Marking</span>
            </div>

            {form.negativeMarking && (
              <div className="ml-13 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                <Field label="Default Deduction Per Wrong Answer" hint="Can be overridden per question">
                  <select name="negativeFraction" value={form.negativeFraction}
                    onChange={handleChange} className={inputCls + " w-40"}>
                    {[["0.25", "-¼ mark"], ["0.33", "-⅓ mark"], ["0.5", "-½ mark"], ["1", "-1 full mark"]].map(([v, l]) => (
                      <option key={v} value={v}>{l} ({v})</option>
                    ))}
                  </select>
                </Field>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Step 2: Add Questions ── */}
      {step === 2 && (
        <QuestionsStep
          paperId={activePaperId}
          paper={activePaperObj}
          questions={questions}
          setQuestions={setQuestions}
        />
      )}

      {/* ── Step 3: Settings & Review ── */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-navy-600">
            <div>
              <p className="text-sm font-semibold text-navy-700 dark:text-white">Paper Status</p>
              <p className="text-xs text-gray-400 mt-0.5">Active papers are visible to students during tests</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-checked:bg-green-500 rounded-full peer-focus:ring-2 peer-focus:ring-green-300 dark:bg-navy-600 transition after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {form.isActive ? "Active" : "Inactive"}
              </span>
            </label>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-navy-600 divide-y divide-gray-100 dark:divide-navy-600 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-navy-800">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Review Summary</p>
            </div>
            {[
              ["Paper ID", activePaperId || "—"],
              ["Paper Name", form.paperName || "—"],
              ["Category", form.category || "—"],
              ["Subject", form.subject || "All"],
              ["Batch", form.batch || "All Batches"],
              ["Difficulty", form.difficulty],
              ["Marks Per Question", form.marksPerQuestion],
              ["Negative Marking", form.negativeMarking ? `Yes (−${form.negativeFraction} per wrong)` : "No"],
              ["Questions Added", String(questions.length)],
              ["Total Marks", String(questions.reduce((s, q) => s + (q.marksPositive ?? Number(form.marksPerQuestion) ?? 4), 0))],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                <span className={`text-sm font-medium ${
                  label === "Questions Added" && parseInt(value) === 0
                    ? "text-amber-500"
                    : "text-navy-700 dark:text-white"
                }`}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {questions.length === 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-400">
              No questions added yet. You can go back or add questions later from the Question Manager.
            </div>
          )}
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-navy-600">
        <button
          type="button"
          onClick={() => step === 0 ? navigate(-1) : setStep((s) => s - 1)}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-navy-600 transition"
        >
          <MdArrowBack className="h-4 w-4" />
          {step === 0 ? "Cancel" : "Back"}
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={savingPaper}
            className="flex items-center gap-2 px-6 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-60 transition"
          >
            {savingPaper ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Saving paper...
              </>
            ) : (
              <>
                {step === 1 ? "Save & Add Questions" : "Next"}
                <MdArrowForward className="h-4 w-4" />
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-60 transition"
          >
            <MdSave className="h-4 w-4" />
            {submitting ? "Saving..." : mode === "create" ? "Finish & Go to Papers" : "Save Changes"}
          </button>
        )}
      </div>
    </Card>
  );
};

export default QuestionPaperBuilder;