import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { FaTrashAlt, FaPencilAlt, FaCheck, FaTimes, FaCodeBranch, FaDownload } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import Card from "components/card";
import AddBatchForm from "./AddBatchForm";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, message } from "antd";
import { AuthContext } from "components/Auth-context";

const BatchTable = () => {
  const auth = useContext(AuthContext);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showMerge, setShowMerge] = useState(false);
  const [mergeSource, setMergeSource] = useState("");
  const [mergeTarget, setMergeTarget] = useState("");
  const [mergeBusy, setMergeBusy] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, sRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/beta/batch/get/all/batches`),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/beta/student/get/all/students`),
      ]);
      const bData = await bRes.json();
      const sData = await sRes.json();
      setBatches(bData.batches || []);
      setStudents(sData.students || []);
    } catch {
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const studentCountMap = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      map[s.batch] = (map[s.batch] || 0) + 1;
    });
    return map;
  }, [students]);

  const filtered = useMemo(() => {
    if (!search.trim()) return batches;
    const q = search.toLowerCase();
    return batches.filter((b) => b.batchName.toLowerCase().includes(q));
  }, [batches, search]);

  const paginated = useMemo(() => {
    const start = page * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

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
      setSelectedIds(new Set(paginated.map((b) => b._id)));
    }
  };

  const startEdit = (batch) => {
    setEditingId(batch._id);
    setEditingName(batch.batchName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = async (id) => {
    if (!editingName.trim()) { message.warning("Batch name cannot be empty"); return; }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/batch/update/batch/byid/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
          body: JSON.stringify({ batchName: editingName.trim() }),
        }
      );
      if (!res.ok) throw new Error();
      message.success("Batch renamed");
      setEditingId(null);
      fetchAll();
    } catch {
      message.error("Failed to rename batch");
    }
  };

  const deleteBatch = async (id) => {
    const count = studentCountMap[batches.find((b) => b._id === id)?.batchName] || 0;
    Modal.confirm({
      title: count > 0
        ? `This batch has ${count} student(s). Delete anyway?`
        : "Delete this batch?",
      icon: <ExclamationCircleOutlined />,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/beta/batch/delete/batch/byid/${id}`,
            { method: "DELETE", headers: { Authorization: "Bearer " + auth.token } }
          );
          if (!res.ok) throw new Error();
          message.success("Batch deleted");
          setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
          fetchAll();
        } catch {
          message.error("Failed to delete batch");
        }
      },
    });
  };

  const bulkDelete = () => {
    const ids = [...selectedIds];
    const withStudents = ids.filter((id) => {
      const b = batches.find((x) => x._id === id);
      return b && (studentCountMap[b.batchName] || 0) > 0;
    });
    Modal.confirm({
      title: `Delete ${ids.length} batch(es)?${withStudents.length > 0 ? ` (${withStudents.length} have students)` : ""}`,
      icon: <ExclamationCircleOutlined />,
      okText: "Delete All",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await Promise.all(
            ids.map((id) =>
              fetch(`${process.env.REACT_APP_BACKEND_URL}/api/beta/batch/delete/batch/byid/${id}`, {
                method: "DELETE",
                headers: { Authorization: "Bearer " + auth.token },
              })
            )
          );
          message.success(`${ids.length} batch(es) deleted`);
          setSelectedIds(new Set());
          fetchAll();
        } catch {
          message.error("Some deletions failed");
        }
      },
    });
  };

  const doMerge = async () => {
    if (!mergeSource || !mergeTarget || mergeSource === mergeTarget) {
      message.warning("Select different source and target batches");
      return;
    }
    setMergeBusy(true);
    try {
      const srcBatch = batches.find((b) => b._id === mergeSource);
      const tgtBatch = batches.find((b) => b._id === mergeTarget);
      const srcStudents = students.filter((s) => s.batch === srcBatch?.batchName);
      await Promise.all(
        srcStudents.map((s) =>
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/beta/student/update/student/byid/${s._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
            body: JSON.stringify({ batch: tgtBatch?.batchName }),
          })
        )
      );
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/batch/delete/batch/byid/${mergeSource}`,
        { method: "DELETE", headers: { Authorization: "Bearer " + auth.token } }
      );
      message.success(`Merged ${srcStudents.length} student(s) into "${tgtBatch?.batchName}" and deleted source batch`);
      setShowMerge(false);
      setMergeSource("");
      setMergeTarget("");
      fetchAll();
    } catch {
      message.error("Merge failed");
    } finally {
      setMergeBusy(false);
    }
  };

  const exportCSV = () => {
    const rows = [["Batch Name", "Student Count"]];
    batches.forEach((b) => rows.push([b.batchName, studentCountMap[b.batchName] || 0]));
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "batches.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (showAddForm) {
    return (
      <Card extra="w-full p-4">
        <AddBatchForm
          onSubmit={() => { setShowAddForm(false); fetchAll(); }}
          onCancel={() => setShowAddForm(false)}
        />
      </Card>
    );
  }

  return (
    <Card extra="w-full pb-10 p-4 h-full">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">Manage Batches</h2>
          <p className="text-xs text-gray-500 mt-0.5">{batches.length} batch(es) total</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search batches..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
          </div>
          {selectedIds.size > 0 && (
            <button
              onClick={bulkDelete}
              className="px-3 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 flex items-center gap-1"
            >
              <FaTrashAlt className="h-3 w-3" /> Delete ({selectedIds.size})
            </button>
          )}
          <button
            onClick={() => setShowMerge(true)}
            className="px-3 py-2 text-sm rounded-lg bg-purple-500 text-white hover:bg-purple-600 flex items-center gap-1"
          >
            <FaCodeBranch className="h-3 w-3" /> Merge
          </button>
          <button
            onClick={exportCSV}
            className="px-3 py-2 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 flex items-center gap-1"
          >
            <FaDownload className="h-3 w-3" /> Export
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-3 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            + Add Batch
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-navy-600">
                <th className="pb-3 pr-4 text-left w-8">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && selectedIds.size === paginated.length}
                    onChange={toggleAll}
                    className="rounded"
                  />
                </th>
                <th className="pb-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Batch Name</th>
                <th className="pb-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Students</th>
                <th className="pb-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
                    {search ? "No batches match your search" : "No batches yet"}
                  </td>
                </tr>
              ) : (
                paginated.map((batch) => {
                  const count = studentCountMap[batch.batchName] || 0;
                  const isEditing = editingId === batch._id;
                  const isSelected = selectedIds.has(batch._id);
                  return (
                    <tr
                      key={batch._id}
                      className={`border-b border-gray-100 dark:border-navy-700 transition-colors ${isSelected ? "bg-blue-50 dark:bg-navy-800" : "hover:bg-gray-50 dark:hover:bg-navy-800"}`}
                    >
                      <td className="py-3 pr-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(batch._id)}
                          className="rounded"
                        />
                      </td>
                      <td className="py-3 pr-6">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") saveEdit(batch._id); if (e.key === "Escape") cancelEdit(); }}
                            autoFocus
                            className="px-2 py-1 text-sm rounded border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white w-48"
                          />
                        ) : (
                          <span className="text-sm font-bold text-navy-700 dark:text-white">{batch.batchName}</span>
                        )}
                      </td>
                      <td className="py-3 pr-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${count > 0 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                          {count} student{count !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <button onClick={() => saveEdit(batch._id)} className="p-1.5 rounded bg-green-500 text-white hover:bg-green-600">
                                <FaCheck className="h-3 w-3" />
                              </button>
                              <button onClick={cancelEdit} className="p-1.5 rounded bg-gray-400 text-white hover:bg-gray-500">
                                <FaTimes className="h-3 w-3" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(batch)} className="p-1.5 rounded bg-blue-500 text-white hover:bg-blue-600">
                                <FaPencilAlt className="h-3 w-3" />
                              </button>
                              <button onClick={() => deleteBatch(batch._id)} className="p-1.5 rounded bg-red-500 text-white hover:bg-red-600">
                                <FaTrashAlt className="h-3 w-3" />
                              </button>
                            </>
                          )}
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
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
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

      <Modal
        title="Merge Batches"
        open={showMerge}
        onOk={doMerge}
        onCancel={() => { setShowMerge(false); setMergeSource(""); setMergeTarget(""); }}
        okText={mergeBusy ? "Merging..." : "Merge"}
        okButtonProps={{ disabled: mergeBusy, danger: true }}
        cancelButtonProps={{ disabled: mergeBusy }}
      >
        <p className="text-sm text-gray-500 mb-4">
          All students from the <strong>source</strong> batch will be moved to the <strong>target</strong> batch. The source batch will then be deleted.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Source Batch (will be deleted)</label>
          <select
            value={mergeSource}
            onChange={(e) => setMergeSource(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm dark:bg-navy-700"
          >
            <option value="">Select source...</option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>{b.batchName} ({studentCountMap[b.batchName] || 0} students)</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Target Batch (students will move here)</label>
          <select
            value={mergeTarget}
            onChange={(e) => setMergeTarget(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm dark:bg-navy-700"
          >
            <option value="">Select target...</option>
            {batches.filter((b) => b._id !== mergeSource).map((b) => (
              <option key={b._id} value={b._id}>{b.batchName}</option>
            ))}
          </select>
        </div>
      </Modal>
    </Card>
  );
};

export default BatchTable;