import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/card";
import { message } from "antd";
import { AuthContext } from "components/Auth-context";
import {
  MdArrowBack, MdArrowForward, MdSave, MdCheck,
} from "react-icons/md";
import { AiOutlineCalculator } from "react-icons/ai";
import { MdWaterDrop } from "react-icons/md";

const STEPS = ["Test Details", "Schedule", "Settings & Publish"];

const StepIndicator = ({ current }) => (
  <div className="flex items-center gap-0 mb-8">
    {STEPS.map((label, i) => (
      <React.Fragment key={i}>
        <div className="flex flex-col items-center gap-1">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
            ${i < current ? "bg-teal-500 text-white" :
              i === current ? "bg-teal-600 text-white ring-4 ring-teal-100 dark:ring-teal-900" :
              "bg-gray-100 dark:bg-navy-700 text-gray-400"}`}>
            {i < current ? <MdCheck className="h-4 w-4" /> : i + 1}
          </div>
          <span className={`text-[10px] font-medium whitespace-nowrap
            ${i === current ? "text-teal-600 dark:text-teal-400" : "text-gray-400"}`}>
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all
            ${i < current ? "bg-teal-500" : "bg-gray-200 dark:bg-navy-600"}`} />
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

const ToggleRow = ({ icon, title, hint, name, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-cyan-500">
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700 text-gray-500">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-navy-700 dark:text-white">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
      </div>
    </div>
    <label className="relative inline-flex items-center cursor-pointer ml-4">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-checked:bg-green-500 rounded-full transition after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 dark:bg-navy-600" />
      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-16">
        {checked ? "On" : "Off"}
      </span>
    </label>
  </div>
);

const inputCls = "w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-cyan-500 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition";

const formatTime = (d) => {
  if (isNaN(d.getTime())) return "";
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
};

const PaperInfoCard = ({ paper }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-teal-50 dark:bg-cyan-700 border border-teal-100 dark:border-cyan-500">
    {[
      ["Category", paper.category || "—"],
      ["Subject(s)", paper.subjects?.length ? paper.subjects.join(", ") : "—"],
      ["Total Marks", paper.totalMarks ?? "—"],
      ["Questions", paper.totalQuestions ?? "—"],
    ].map(([label, value]) => (
      <div key={label}>
        <p className="text-[10px] font-semibold text-teal-500 dark:text-teal-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-medium text-navy-700 dark:text-white truncate">{value}</p>
      </div>
    ))}
  </div>
);

const TestFormWizard = ({ mode = "create" }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [step, setStep] = useState(0);
  const [batches, setBatches] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingTest, setLoadingTest] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);

  const [isValidatingPaper, setIsValidatingPaper] = useState(false);
  const [paperStatus, setPaperStatus] = useState(null);
  const [paperDetails, setPaperDetails] = useState(null);

  const [form, setForm] = useState({
    testId: "",
    testName: "",
    paperId: "",
    batchName: "",
    isPermanent: false,
    date: "",
    startTime: "",
    endTime: "",
    duration: "180",
    passingPercentage: "35",
    isPublished: false,
    allowCalculator: true,
    allowWatermark: true,
  });

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/batch/get/all/batches`);
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
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/test/get/test/byid/${id}`,
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
            isPermanent: t.isPermanent || false,
            date: t.date || "",
            startTime: t.startTime || "",
            endTime: t.endTime || "",
            duration: t.duration?.toString() || "180",
            passingPercentage: t.passingPercentage?.toString() || "35",
            isPublished: t.isPublished || false,
            allowCalculator: t.allowCalculator !== false,
            allowWatermark: t.allowWatermark !== false,
          });
          setPaperStatus("valid");
          setPaperDetails({
            category: t.category || "",
            subjects: t.subjects || [],
            totalMarks: t.totalMarks ?? 0,
            totalQuestions: t.totalQuestions ?? 0,
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

  useEffect(() => {
    if (!form.paperId?.trim()) {
      setPaperStatus(null);
      setPaperDetails(null);
      return;
    }
    const timer = setTimeout(async () => {
      setIsValidatingPaper(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/questionpaper/get/questionpaper/bypaperid/${form.paperId.trim()}`
        );
        if (res.ok) {
          const data = await res.json();
          const p = data.questionPaper;
          setPaperStatus("valid");
          setPaperDetails({
            category: p.category || "",
            subjects: p.subjects || [],
            totalMarks: p.totalMarks ?? 0,
            totalQuestions: p.totalQuestions ?? 0,
          });
        } else {
          setPaperStatus("invalid");
          setPaperDetails(null);
        }
      } catch {
        setPaperStatus("invalid");
        setPaperDetails(null);
      } finally {
        setIsValidatingPaper(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [form.paperId]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setForm((prev) => {
      let nextForm = { ...prev, [name]: val };

      try {
        if (name === "startTime" && nextForm.duration && val) {
          const start = new Date(`1970-01-01T${val}:00`);
          start.setMinutes(start.getMinutes() + Number(nextForm.duration));
          nextForm.endTime = formatTime(start);
        } else if (name === "duration" && nextForm.startTime && val) {
          const start = new Date(`1970-01-01T${nextForm.startTime}:00`);
          start.setMinutes(start.getMinutes() + Number(val));
          nextForm.endTime = formatTime(start);
        } else if (name === "endTime" && nextForm.startTime && val) {
          const start = new Date(`1970-01-01T${nextForm.startTime}:00`);
          const end = new Date(`1970-01-01T${val}:00`);
          let diffMins = (end - start) / 60000;
          if (diffMins < 0) diffMins += 24 * 60;
          nextForm.duration = String(diffMins);
        }
      } catch (err) {
        console.error("Time synchronization error", err);
      }

      return nextForm;
    });
  }, []);

  const validateStep = (s) => {
    if (s === 0) {
      if (!form.testId.trim()) { message.warning("Test ID is required"); return false; }
      if (!form.testName.trim()) { message.warning("Test name is required"); return false; }
      if (!form.paperId.trim()) { message.warning("Question Paper ID is required"); return false; }
      if (paperStatus !== "valid") { message.warning("A valid Question Paper ID is required to proceed"); return false; }
    }

    if (s === 1) {
      if (!form.duration || Number(form.duration) <= 0) { message.warning("A valid duration is required"); return false; }

      if (!form.isPermanent) {
        if (!form.date) { message.warning("Date is required"); return false; }
        if (!form.startTime) { message.warning("Start time is required"); return false; }
        if (!form.endTime) { message.warning("End time is required"); return false; }

        const selectedDateTime = new Date(`${form.date}T${form.startTime}`);
        const now = new Date();
        if (selectedDateTime < now) {
          message.warning("The start date and time cannot be in the past.");
          return false;
        }
      }

      const passPct = Number(form.passingPercentage);
      if (isNaN(passPct) || passPct < 0 || passPct > 100) {
        message.warning("Passing percentage must be between 0 and 100");
        return false;
      }
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
        testId: form.testId.trim(),
        testName: form.testName.trim(),
        paperId: form.paperId.trim(),
        batchName: form.batchName || "",
        isPermanent: form.isPermanent,
        date: form.isPermanent ? "" : form.date,
        startTime: form.isPermanent ? "" : form.startTime,
        endTime: form.isPermanent ? "" : form.endTime,
        duration: Number(form.duration),
        passingPercentage: Number(form.passingPercentage),
        isPublished: form.isPublished,
        allowCalculator: form.allowCalculator,
        allowWatermark: form.allowWatermark,
      };

      const url = mode === "create"
        ? `${process.env.REACT_APP_BACKEND_URL}/api/v1/test/create/test`
        : `${process.env.REACT_APP_BACKEND_URL}/api/v1/test/update/test/byid/${id}`;
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
        <div className="h-8 w-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
      </Card>
    );
  }

  const batchDisplayLabel = form.batchName ? form.batchName : "All Batches";

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
            <Field label="Test ID" required hint={mode === "edit" ? "Changing this will unlink old student attempts" : "Unique identifier"}>
              <input type="text" name="testId" value={form.testId} onChange={handleChange}
                placeholder="e.g. NEET-2024-01" className={inputCls} />
            </Field>
            <Field label="Test Name" required>
              <input type="text" name="testName" value={form.testName} onChange={handleChange}
                placeholder="e.g. NEET Full Syllabus Mock 1" className={inputCls} />
            </Field>
          </div>

          <Field label="Question Paper ID" required hint="Must be an existing Paper ID to proceed">
            <div className="relative">
              <input
                type="text"
                name="paperId"
                value={form.paperId}
                onChange={handleChange}
                placeholder="e.g. NEET-2024-PHY"
                className={`${inputCls} pr-24`}
              />
              <div className="absolute right-3 top-2 flex items-center h-full">
                {isValidatingPaper && (
                  <span className="text-xs text-teal-500 font-medium">Checking...</span>
                )}
                {!isValidatingPaper && paperStatus === "valid" && (
                  <span className="flex items-center gap-1 text-[11px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    <MdCheck className="h-3 w-3" /> Exists
                  </span>
                )}
                {!isValidatingPaper && paperStatus === "invalid" && (
                  <span className="text-[11px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">
                    Not Found
                  </span>
                )}
              </div>
            </div>
          </Field>

          {paperStatus === "valid" && paperDetails && (
            <PaperInfoCard paper={paperDetails} />
          )}

          <Field
            label="Batch"
            hint="Leave as All Batches to make this test accessible to every student regardless of batch"
          >
            <select name="batchName" value={form.batchName} onChange={handleChange}
              disabled={loadingMeta} className={inputCls}>
              <option value="">{loadingMeta ? "Loading..." : "All Batches"}</option>
              {batches.map((b) => <option key={b._id} value={b.batchName}>{b.batchName}</option>)}
            </select>
          </Field>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <ToggleRow
            icon={<span className="font-bold text-xs">∞</span>}
            title="Permanent Test"
            hint="Always available — students can take it anytime. Timer starts when they begin."
            name="isPermanent"
            checked={form.isPermanent}
            onChange={handleChange}
          />

          {!form.isPermanent && (
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
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Duration (minutes)" required hint={form.isPermanent ? "How long students have once they start" : "Changing duration automatically updates End Time"}>
              <input type="number" name="duration" value={form.duration} onChange={handleChange}
                min="1" placeholder="e.g. 180" className={inputCls} />
            </Field>
            <Field label="Passing Percentage (%)" required hint="Minimum score required to pass (e.g. 35 means 35%)">
              <input
                type="number"
                name="passingPercentage"
                value={form.passingPercentage}
                onChange={handleChange}
                min="0"
                max="100"
                placeholder="e.g. 35"
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <ToggleRow
            icon={<span className="font-bold text-xs">PUB</span>}
            title="Publish Test"
            hint="Published tests are visible and accessible to students"
            name="isPublished"
            checked={form.isPublished}
            onChange={handleChange}
          />

          <ToggleRow
            icon={<AiOutlineCalculator className="h-4 w-4" />}
            title="Allow Calculator"
            hint="Students will have access to a built-in calculator during the exam"
            name="allowCalculator"
            checked={form.allowCalculator}
            onChange={handleChange}
          />

          <ToggleRow
            icon={<MdWaterDrop className="h-4 w-4" />}
            title="Enable Watermark"
            hint="Watermarks Student ID and Test ID across the exam screen to deter cheating"
            name="allowWatermark"
            checked={form.allowWatermark}
            onChange={handleChange}
          />

          <div className="rounded-xl border border-gray-200 dark:border-cyan-500 divide-y divide-gray-100 dark:divide-navy-600 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-cyan-700">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Review Summary</p>
            </div>
            {[
              ["Test ID", form.testId || "—"],
              ["Test Name", form.testName],
              ["Question Paper", form.paperId],
              ["Category", paperDetails?.category || "—"],
              ["Subject(s)", paperDetails?.subjects?.length ? paperDetails.subjects.join(", ") : "—"],
              ["Total Marks", paperDetails?.totalMarks ?? "—"],
              ["Questions", paperDetails?.totalQuestions ?? "—"],
              ["Batch", batchDisplayLabel],
              ["Permanent", form.isPermanent ? "Yes — Always Available" : "No"],
              ...(form.isPermanent ? [] : [["Date", form.date], ["Time", `${form.startTime} — ${form.endTime}`]]),
              ["Duration", `${form.duration} minutes`],
              ["Passing Percentage", `${form.passingPercentage}%`],
              ["Calculator", form.allowCalculator ? "Allowed" : "Disabled"],
              ["Watermark", form.allowWatermark ? "Enabled" : "Disabled"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-sm font-medium text-navy-700 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-cyan-500">
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
            className="flex items-center gap-2 px-6 py-2 text-sm rounded-lg bg-teal-500 text-white hover:bg-teal-500 transition"
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