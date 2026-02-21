import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/card";
import { message } from "antd";
import { AuthContext } from "components/Auth-context";
import {
  MdCheck, MdArrowBack, MdArrowForward, MdLayers,
  MdSettings, MdSave, MdCalculate,
} from "react-icons/md";

const STEPS = ["Paper Details", "Marking Scheme", "Settings & Review"];

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

const inputCls = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
const selectCls = inputCls;

const QuestionPaperBuilder = ({ mode = "create" }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingPaper, setLoadingPaper] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    paperId: "",
    paperName: "",
    category: "",
    subject: "",
    batch: "",
    difficulty: "Medium",
    totalQuestions: "",
    marksPerQuestion: "4",
    totalMarks: "",
    negativeMarking: false,
    negativeFraction: "0.25",
    isActive: true,
    description: "",
  });

  const computedTotalMarks = form.totalQuestions && form.marksPerQuestion
    ? (Number(form.totalQuestions) * Number(form.marksPerQuestion)).toString()
    : "";

  const isManualTotal = form.totalMarks !== "" && form.totalMarks !== computedTotalMarks;

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

  useEffect(() => {
    if (mode !== "edit" || !id) return;
    const fetchPaper = async () => {
      setLoadingPaper(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/questionpaper/get/questionpaper/byid/${id}`,
          { headers: { Authorization: "Bearer " + auth.token } }
        );
        const data = await res.json();
        const p = data.questionPaper;
        if (p) {
          setForm({
            paperId: p.paperId || "",
            paperName: p.paperName || "",
            category: p.category || "",
            subject: (p.subjects || [])[0] || "",
            batch: p.batch || "",
            difficulty: p.difficulty || "Medium",
            totalQuestions: p.totalQuestions?.toString() || "",
            marksPerQuestion: p.marksPerQuestion?.toString() || "4",
            totalMarks: p.totalMarks?.toString() || "",
            negativeMarking: p.negativeMarking || false,
            negativeFraction: p.negativeFraction?.toString() || "0.25",
            isActive: p.isActive !== false,
            description: p.description || "",
          });
        }
      } catch {
        message.error("Failed to load question paper");
      } finally {
        setLoadingPaper(false);
      }
    };
    fetchPaper();
  }, [id, mode, auth.token]);

  useEffect(() => {
    if (!isManualTotal && computedTotalMarks) {
      setForm((prev) => ({ ...prev, totalMarks: computedTotalMarks }));
    }
  }, [form.totalQuestions, form.marksPerQuestion]);

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
      if (!form.totalQuestions) { message.warning("Total questions is required"); return false; }
      if (!form.marksPerQuestion) { message.warning("Marks per question is required"); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...(mode === "create" ? { paperId: form.paperId.trim() } : {}),
        paperName: form.paperName.trim(),
        category: form.category,
        subjects: form.subject ? [form.subject] : [],
        batch: form.batch,
        difficulty: form.difficulty,
        totalQuestions: Number(form.totalQuestions),
        marksPerQuestion: Number(form.marksPerQuestion),
        totalMarks: Number(form.totalMarks || computedTotalMarks),
        negativeMarking: form.negativeMarking,
        negativeFraction: Number(form.negativeFraction),
        isActive: form.isActive,
        description: form.description,
      };

      const url = mode === "create"
        ? `${process.env.REACT_APP_BACKEND_URL}/api/beta/questionpaper/create/questionpaper`
        : `${process.env.REACT_APP_BACKEND_URL}/api/beta/questionpaper/update/questionpaper/byid/${id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Error");
      message.success(`Question paper ${mode === "create" ? "created" : "updated"} successfully`);
      navigate("/admin/manage-question-papers");
    } catch (err) {
      message.error(err.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
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

  const effectiveTotalMarks = form.totalMarks || computedTotalMarks;

  return (
    <Card extra="w-full p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-400 transition">
          <MdArrowBack className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">
            {mode === "create" ? "Create Question Paper" : "Edit Question Paper"}
          </h2>
          {mode === "edit" && form.paperId && (
            <p className="text-xs text-gray-400 mt-0.5">ID: {form.paperId}</p>
          )}
        </div>
      </div>

      <StepIndicator current={step} />

      {step === 0 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mode === "create" && (
              <Field label="Paper ID" required hint="Unique identifier, cannot be changed later">
                <input type="text" name="paperId" value={form.paperId} onChange={handleChange}
                  placeholder="e.g. NEET-2024-PHY" className={inputCls} />
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
                disabled={loadingMeta} className={selectCls}>
                <option value="">{loadingMeta ? "Loading..." : "Select category..."}</option>
                {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Subject">
              <select name="subject" value={form.subject} onChange={handleChange}
                disabled={!form.category} className={selectCls + " disabled:opacity-50"}>
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
                disabled={loadingMeta} className={selectCls}>
                <option value="">All Batches</option>
                {batches.map((b) => <option key={b._id} value={b.batchName}>{b.batchName}</option>)}
              </select>
            </Field>
            <Field label="Difficulty">
              <select name="difficulty" value={form.difficulty} onChange={handleChange} className={selectCls}>
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

      {step === 1 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Total Questions" required>
              <input type="number" name="totalQuestions" value={form.totalQuestions}
                onChange={handleChange} min="1" placeholder="e.g. 45" className={inputCls} />
            </Field>
            <Field label="Marks Per Question" required>
              <input type="number" name="marksPerQuestion" value={form.marksPerQuestion}
                onChange={handleChange} min="1" step="0.5" placeholder="e.g. 4" className={inputCls} />
            </Field>
            <Field label="Total Marks" hint={!isManualTotal ? "Auto-calculated" : "Manual override"}>
              <div className="relative">
                <input type="number" name="totalMarks" value={form.totalMarks || computedTotalMarks}
                  onChange={handleChange} min="0" className={inputCls}
                  style={{ paddingRight: !isManualTotal ? "2.5rem" : undefined }} />
                {!isManualTotal && (
                  <MdCalculate className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                )}
              </div>
            </Field>
          </div>

          <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Live Preview</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Questions", value: form.totalQuestions || "—" },
                { label: "Marks / Q", value: form.marksPerQuestion || "—" },
                { label: "Total Marks", value: effectiveTotalMarks || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{value}</p>
                  <p className="text-[11px] text-blue-400 dark:text-blue-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="negativeMarking" checked={form.negativeMarking}
                  onChange={handleChange} className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-200 peer-checked:bg-blue-500 rounded-full peer-focus:ring-2 peer-focus:ring-blue-300 dark:bg-navy-600 transition after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Negative Marking</span>
            </div>

            {form.negativeMarking && (
              <div className="ml-13 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                <Field label="Default Deduction Per Wrong Answer" hint="Can be overridden per question">
                  <select name="negativeFraction" value={form.negativeFraction}
                    onChange={handleChange} className={selectCls + " w-40"}>
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

      {step === 2 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-navy-600">
            <div>
              <p className="text-sm font-semibold text-navy-700 dark:text-white">Paper Status</p>
              <p className="text-xs text-gray-400 mt-0.5">Active papers are visible to students during tests</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-checked:bg-green-500 rounded-full peer-focus:ring-2 peer-focus:ring-green-300 dark:bg-navy-600 transition after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
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
              ["Paper ID", form.paperId || "—"],
              ["Paper Name", form.paperName || "—"],
              ["Category", form.category || "—"],
              ["Subject", form.subject || "All"],
              ["Batch", form.batch || "All Batches"],
              ["Difficulty", form.difficulty],
              ["Total Questions", form.totalQuestions || "—"],
              ["Marks Per Question", form.marksPerQuestion],
              ["Total Marks", effectiveTotalMarks || "—"],
              ["Negative Marking", form.negativeMarking ? `Yes (−${form.negativeFraction} per wrong)` : "No"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-sm font-medium text-navy-700 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
            className="flex items-center gap-2 px-6 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Next
            <MdArrowForward className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-60 transition"
          >
            <MdSave className="h-4 w-4" />
            {submitting ? "Saving..." : mode === "create" ? "Create Paper" : "Save Changes"}
          </button>
        )}
      </div>
    </Card>
  );
};

export default QuestionPaperBuilder;