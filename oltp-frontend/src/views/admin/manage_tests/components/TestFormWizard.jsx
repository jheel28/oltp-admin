import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/card";
import { message } from "antd";
import { AuthContext } from "components/Auth-context";
import {
  MdArrowBack, MdArrowForward, MdSave, MdCheck,
  MdSchedule, MdGroup, MdAssignment, MdPublish,
} from "react-icons/md";

const STEPS = ["Test Details", "Schedule", "Review & Publish"];

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

const PaperSummaryCard = ({ paperId }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!paperId?.trim()) { setSummary(null); setNotFound(false); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/questionpaper/get/questionpaper/summary/${paperId.trim()}`
        );
        if (res.status === 404) { setNotFound(true); setSummary(null); return; }
        const data = await res.json();
        setSummary(data.summary);
      } catch {
        setSummary(null);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [paperId]);

  if (!paperId?.trim()) return null;

  if (loading) {
    return (
      <div className="mt-2 p-3 rounded-lg border border-gray-200 dark:border-navy-600 flex items-center gap-2 text-gray-400 text-xs">
        <div className="h-4 w-4 rounded-full border border-blue-400 border-t-transparent animate-spin" />
        Looking up paper...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mt-2 p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-500 text-xs flex items-center gap-2">
        <span className="font-bold">!</span> No paper found with ID "{paperId}"
      </div>
    );
  }

  if (!summary) return null;

  const diffBreakdown = summary.difficultyBreakdown || {};
  const typeBreakdown = summary.typeBreakdown || {};
  const isReadyForTest = summary.questionsLoaded >= summary.totalQuestions;

  return (
    <div className={`mt-2 rounded-xl border p-4 transition-all ${isReadyForTest
      ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"
      : "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10"}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-bold text-navy-700 dark:text-white">{summary.paperName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{summary.category} · {(summary.subjects || []).join(", ") || "All subjects"}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {isReadyForTest ? (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
              <MdCheck className="h-3 w-3" /> Ready
            </span>
          ) : (
            <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
              {summary.questionsLoaded}/{summary.totalQuestions} questions loaded
            </span>
          )}
          {!summary.isActive && (
            <span className="text-[10px] font-bold bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Inactive</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-3">
        {[
          { label: "Questions", value: summary.totalQuestions },
          { label: "Total Marks", value: summary.totalMarks },
          { label: "Marks/Q", value: summary.marksPerQuestion },
          { label: "Neg. Marking", value: summary.negativeMarking ? `−${summary.negativeFraction}` : "Off" },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-base font-bold text-navy-700 dark:text-white">{value}</p>
            <p className="text-[10px] text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 text-[11px]">
        <div>
          <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">By Difficulty</p>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(diffBreakdown).map(([k, v]) => v > 0 && (
              <span key={k} className={`px-1.5 py-0.5 rounded font-medium
                ${k === "Easy" ? "bg-green-100 text-green-600" : k === "Medium" ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"}`}>
                {k}: {v}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-400 uppercase tracking-wider mb-1">By Type</p>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(typeBreakdown).map(([k, v]) => v > 0 && (
              <span key={k} className={`px-1.5 py-0.5 rounded font-medium
                ${k === "MCQ" ? "bg-blue-100 text-blue-600" : k === "MSQ" ? "bg-indigo-100 text-indigo-600" : "bg-violet-100 text-violet-600"}`}>
                {k}: {v}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TestFormWizard = ({ mode = "create" }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [step, setStep] = useState(0);
  const [batches, setBatches] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingTest, setLoadingTest] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    testId: "",
    testName: "",
    paperId: "",
    batchName: "",
    course: "",
    date: "",
    startTime: "",
    endTime: "",
    duration: "180",
    isPublished: false,
  });

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/beta/batch/get/all/batches`);
        const data = await res.json();
        setBatches(data.batches || []);
      } catch {
        message.error("Failed to load batches");
      } finally {
        setLoadingMeta(false);
      }
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !id) return;
    const fetchTest = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/test/get/test/byid/${id}`,
          { headers: { Authorization: "Bearer " + auth.token } }
        );
        const data = await res.json();
        const t = data.test;
        if (t) {
          setForm({
            testId: t.testId || "",
            testName: t.testName || "",
            paperId: t.paperId || "",
            batchName: t.batchName || "",
            course: t.course || "",
            date: t.date || "",
            startTime: t.startTime || "",
            endTime: t.endTime || "",
            duration: t.duration?.toString() || "180",
            isPublished: t.isPublished || false,
          });
        }
      } catch {
        message.error("Failed to load test");
      } finally {
        setLoadingTest(false);
      }
    };
    fetchTest();
  }, [id, mode, auth.token]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }, []);

  const validateStep = (s) => {
    if (s === 0) {
      if (mode === "create" && !form.testId.trim()) { message.warning("Test ID is required"); return false; }
      if (!form.testName.trim()) { message.warning("Test name is required"); return false; }
      if (!form.paperId.trim()) { message.warning("Question Paper ID is required"); return false; }
      if (!form.batchName) { message.warning("Batch is required"); return false; }
    }
    if (s === 1) {
      if (!form.date) { message.warning("Date is required"); return false; }
      if (!form.startTime) { message.warning("Start time is required"); return false; }
      if (!form.endTime) { message.warning("End time is required"); return false; }
      if (!form.duration) { message.warning("Duration is required"); return false; }
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
        ...(mode === "create" ? { testId: form.testId.trim() } : {}),
        testName: form.testName.trim(),
        paperId: form.paperId.trim(),
        batchName: form.batchName,
        course: form.course,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        duration: Number(form.duration),
        isPublished: form.isPublished,
      };

      const url = mode === "create"
        ? `${process.env.REACT_APP_BACKEND_URL}/api/beta/test/create/test`
        : `${process.env.REACT_APP_BACKEND_URL}/api/beta/test/update/test/byid/${id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Error");
      message.success(`Test ${mode === "create" ? "created" : "updated"} successfully`);
      navigate("/admin/manage-tests");
    } catch (err) {
      message.error(err.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingTest) {
    return (
      <Card extra="w-full p-12 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </Card>
    );
  }

  return (
    <Card extra="w-full p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-400 transition">
          <MdArrowBack className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold text-navy-700 dark:text-white">
          {mode === "create" ? "Create Test" : "Edit Test"}
        </h2>
      </div>

      <StepIndicator current={step} />

      {step === 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mode === "create" && (
              <Field label="Test ID" required hint="Unique identifier">
                <input type="text" name="testId" value={form.testId} onChange={handleChange}
                  placeholder="e.g. NEET-2024-01" className={inputCls} />
              </Field>
            )}
            <Field label="Test Name" required>
              <input type="text" name="testName" value={form.testName} onChange={handleChange}
                placeholder="e.g. NEET Full Syllabus Mock 1" className={inputCls} />
            </Field>
          </div>

          <Field label="Question Paper ID" required hint="Enter the Paper ID and a summary will load automatically">
            <input type="text" name="paperId" value={form.paperId} onChange={handleChange}
              placeholder="e.g. NEET-2024-PHY" className={inputCls} />
            <PaperSummaryCard paperId={form.paperId} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Batch" required>
              <select name="batchName" value={form.batchName} onChange={handleChange}
                disabled={loadingMeta} className={inputCls}>
                <option value="">{loadingMeta ? "Loading..." : "Select batch..."}</option>
                {batches.map((b) => <option key={b._id} value={b.batchName}>{b.batchName}</option>)}
              </select>
            </Field>
            <Field label="Course / Exam Name">
              <input type="text" name="course" value={form.course} onChange={handleChange}
                placeholder="e.g. NEET, JEE Main" className={inputCls} />
            </Field>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Date" required>
              <input type="date" name="date" value={form.date} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Start Time" required>
              <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="End Time" required>
              <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className={inputCls} />
            </Field>
          </div>
          <Field label="Duration (minutes)" required>
            <input type="number" name="duration" value={form.duration} onChange={handleChange}
              min="10" placeholder="e.g. 180" className={inputCls + " w-40"} />
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-navy-600">
            <div>
              <p className="text-sm font-semibold text-navy-700 dark:text-white">Publish Test</p>
              <p className="text-xs text-gray-400 mt-0.5">Published tests are visible and accessible to students</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-checked:bg-green-500 rounded-full transition after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 dark:bg-navy-600" />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {form.isPublished ? "Published" : "Draft"}
              </span>
            </label>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-navy-600 divide-y divide-gray-100 dark:divide-navy-600 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-navy-800">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Review Summary</p>
            </div>
            {[
              ["Test ID", form.testId || "—"],
              ["Test Name", form.testName],
              ["Question Paper", form.paperId],
              ["Batch", form.batchName],
              ["Course", form.course || "—"],
              ["Date", form.date],
              ["Time", `${form.startTime} — ${form.endTime}`],
              ["Duration", `${form.duration} minutes`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-sm font-medium text-navy-700 dark:text-white">{value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-navy-600 p-4">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Linked Paper Validation</p>
            <PaperSummaryCard paperId={form.paperId} />
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
            Next <MdArrowForward className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-60 transition"
          >
            <MdSave className="h-4 w-4" />
            {submitting ? "Saving..." : mode === "create" ? "Create Test" : "Save Changes"}
          </button>
        )}
      </div>
    </Card>
  );
};

export default TestFormWizard;