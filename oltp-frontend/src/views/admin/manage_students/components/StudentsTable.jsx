import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { FaTrashAlt, FaDownload } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import Card from "components/card";
import AddStudentForm from "./AddStudentForm";
import ViewEditStudent from "./viewEditStudent";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, message } from "antd";
import { AuthContext } from "components/Auth-context";

const isNewStudent = (admissionDate) => {
  if (!admissionDate) return false;
  const admitted = new Date(admissionDate);
  const now = new Date();
  const diffDays = (now - admitted) / (1000 * 60 * 60 * 24);
  return diffDays <= 30;
};

const StudentsTable = () => {
  const auth = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, bRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/student/get/all/students`),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/batch/get/all/batches`),
      ]);
      const sData = await sRes.json();
      const bData = await bRes.json();
      setStudents(sData.students || []);
      setBatches(bData.batches || []);
    } catch {
      message.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = useMemo(() => {
    let list = students;
    if (batchFilter !== "All") {
      list = list.filter((s) => s.batch === batchFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
          s.studentId?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.phoneNumber?.includes(q)
      );
    }
    return list;
  }, [students, search, batchFilter]);

  const paginated = useMemo(() => {
    return filtered.slice(page * pageSize, (page + 1) * pageSize);
  }, [filtered, page, pageSize]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((s) => s._id)));
    }
  };

  const deleteStudent = async (id) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/student/delete/student/byid/${id}`,
        { method: "DELETE", headers: { Authorization: "Bearer " + auth.token } }
      );
      if (!res.ok) throw new Error();
      message.success("Student deleted");
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      fetchAll();
    } catch {
      message.error("Failed to delete student");
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete this student?",
      icon: <ExclamationCircleOutlined />,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => deleteStudent(id),
    });
  };

  const bulkDelete = () => {
    const ids = [...selectedIds];
    Modal.confirm({
      title: `Delete ${ids.length} student(s)?`,
      content: "This action cannot be undone.",
      icon: <ExclamationCircleOutlined />,
      okText: "Delete All",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await Promise.all(
            ids.map((id) =>
              fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/student/delete/student/byid/${id}`, {
                method: "DELETE",
                headers: { Authorization: "Bearer " + auth.token },
              })
            )
          );
          message.success(`${ids.length} student(s) deleted`);
          setSelectedIds(new Set());
          fetchAll();
        } catch {
          message.error("Some deletions failed");
        }
      },
    });
  };

  const exportCSV = () => {
    const headers = ["Student ID", "First Name", "Last Name", "Email", "Phone", "Batch", "Admission Date", "State", "Country"];
    const rows = filtered.map((s) => [
      s.studentId, s.firstName, s.lastName, s.email,
      s.phoneNumber, s.batch, s.admissionDate, s.state, s.country,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c || ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${batchFilter !== "All" ? batchFilter + "_" : ""}${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (showAddForm) {
    return (
      <Card extra="w-full p-4">
        <AddStudentForm
          onSubmit={() => { setShowAddForm(false); fetchAll(); }}
          onCancel={() => setShowAddForm(false)}
        />
      </Card>
    );
  }

  if (selectedStudent) {
    return (
      <Card extra="w-full p-4">
        <ViewEditStudent
          studentData={selectedStudent}
          onUpdate={() => { setSelectedStudent(null); fetchAll(); }}
          onBack={() => setSelectedStudent(null)}
        />
      </Card>
    );
  }

  return (
    <Card extra="w-full pb-10 p-4 h-full">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">Manage Students</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {filtered.length} student{filtered.length !== 1 ? "s" : ""}
            {batchFilter !== "All" ? ` in ${batchFilter}` : " total"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search name, ID, email, phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />
          </div>
          <select
            value={batchFilter}
            onChange={(e) => { setBatchFilter(e.target.value); setPage(0); setSelectedIds(new Set()); }}
            className="py-2 px-3 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Batches</option>
            {batches.map((b) => (
              <option key={b._id} value={b.batchName}>{b.batchName}</option>
            ))}
          </select>
          {selectedIds.size > 0 && (
            <button
              onClick={bulkDelete}
              className="px-3 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 flex items-center gap-1"
            >
              <FaTrashAlt className="h-3 w-3" /> Delete ({selectedIds.size})
            </button>
          )}
          <button
            onClick={exportCSV}
            className="px-3 py-2 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 flex items-center gap-1"
          >
            <FaDownload className="h-3 w-3" /> Export CSV
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-3 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            + Add Student
          </button>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
              className="text-xs py-1 px-2 rounded border border-gray-200 dark:border-navy-600 dark:bg-navy-700"
            >
              {[10, 25, 50, 100].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-navy-600">
                <th className="pb-3 pr-3 text-left w-8">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && selectedIds.size === paginated.length}
                    onChange={toggleAll}
                    className="rounded"
                  />
                </th>
                <th className="pb-3 pr-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide"></th>
                <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Student ID</th>
                <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Phone</th>
                <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Batch</th>
                <th className="pb-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                    {search || batchFilter !== "All" ? "No students match your filters" : "No students yet"}
                  </td>
                </tr>
              ) : (
                paginated.map((student) => {
                  const isNew = isNewStudent(student.admissionDate);
                  const isSelected = selectedIds.has(student._id);
                  return (
                    <tr
                      key={student._id}
                      className={`border-b border-gray-100 dark:border-navy-700 transition-colors ${isSelected ? "bg-blue-50 dark:bg-navy-800" : "hover:bg-gray-50 dark:hover:bg-navy-800"}`}
                    >
                      <td className="py-3 pr-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(student._id)}
                          className="rounded"
                        />
                      </td>
                      <td className="py-3 pr-3">
                        <div className="relative">
                          <img
                            src={`${process.env.REACT_APP_BACKEND_URL}/${student.image}`}
                            alt=""
                            className="h-8 w-8 rounded-full object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/32"; }}
                          />
                          {isNew && (
                            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[8px] font-bold px-1 rounded-full">NEW</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-6">
                        <span className="text-sm font-bold text-navy-700 dark:text-white">{student.studentId}</span>
                      </td>
                      <td className="py-3 pr-6">
                        <span className="text-sm font-medium text-navy-700 dark:text-white">
                          {student.firstName} {student.lastName}
                        </span>
                      </td>
                      <td className="py-3 pr-6">
                        <span className="text-sm text-gray-500">{student.email}</span>
                      </td>
                      <td className="py-3 pr-6">
                        <span className="text-sm text-gray-500">{student.phoneNumber}</span>
                      </td>
                      <td className="py-3 pr-6">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                          {student.batch}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="px-3 py-1.5 text-xs rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600"
                          >
                            <FaTrashAlt className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-1">
            <button onClick={() => setPage(0)} disabled={page === 0} className="px-2 py-1 text-xs rounded border disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-navy-700">{"<<"}</button>
            <button onClick={() => setPage((p) => p - 1)} disabled={page === 0} className="px-2 py-1 text-xs rounded border disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-navy-700">{"<"}</button>
            <span className="px-3 py-1 text-xs">{page + 1} / {totalPages}</span>
            <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages - 1} className="px-2 py-1 text-xs rounded border disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-navy-700">{">"}</button>
            <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1} className="px-2 py-1 text-xs rounded border disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-navy-700">{">>"}</button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default StudentsTable;