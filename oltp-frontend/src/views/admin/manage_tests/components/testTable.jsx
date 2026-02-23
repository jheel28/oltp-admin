import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { FaTrashAlt, FaDownload, FaEdit } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Card from "components/card";
import AddTestForm from "./TestFormWizard";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, message } from "antd";
import { AuthContext } from "components/Auth-context";

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
  upcoming: "bg-blue-100 text-blue-700",
  expired: "bg-red-100 text-red-600",
};

const getTestStatus = (test) => {
  const now = new Date();
  if (!test.isPublished) return "inactive";

  const parseDT = (d, t) => {
    if (!d || !t) return null;
    const parts = d.split(/[-/]/).map(Number);
    let year, month, day;
    if (parts[0] > 1000) [year, month, day] = parts;
    else if (parts[2] > 1000) [day, month, year] = parts;
    else [year, month, day] = parts;
    const [h, m] = t.split(":").map(Number);
    return new Date(year, month - 1, day, h, m, 0);
  };

  const startDt = parseDT(test.date, test.startTime);
  const endDt = parseDT(test.date, test.endTime);

  if (startDt && startDt > now) return "upcoming";
  if (endDt && endDt < now) return "expired";
  return "active";
};

const TestTable = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [tRes, cRes, bRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/test/get/all/tests`),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/category/get/all`),
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/batch/get/all/batches`),
      ]);
      const tData = await tRes.json();
      const cData = await cRes.json();
      const bData = await bRes.json();
      setTests(tData.tests || []);
      setCategories(cData.categories || []);
      setBatches(bData.batches || []);
    } catch {
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const filtered = useMemo(() => {
    let list = tests;
    if (catFilter !== "All") list = list.filter((t) => t.category === catFilter);
    if (batchFilter !== "All") list = list.filter((t) => t.batch === batchFilter || (Array.isArray(t.batches) && t.batches.includes(batchFilter)));
    if (statusFilter !== "All") list = list.filter((t) => getTestStatus(t) === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.testName?.toLowerCase().includes(q) || t.subject?.toLowerCase().includes(q));
    }
    return list;
  }, [tests, search, catFilter, batchFilter, statusFilter]);

  const paginated = useMemo(() => filtered.slice(page * pageSize, (page + 1) * pageSize), [filtered, page, pageSize]);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleAll = () => {
    setSelectedIds(selectedIds.size === paginated.length ? new Set() : new Set(paginated.map((t) => t._id)));
  };

  const deleteTest = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/test/delete/test/byid/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + auth.token },
      });
      if (!res.ok) throw new Error();
      message.success("Test deleted");
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      fetchAll();
    } catch { message.error("Failed to delete test"); }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete this test?",
      icon: <ExclamationCircleOutlined />,
      okText: "Delete", okType: "danger", cancelText: "Cancel",
      onOk: () => deleteTest(id),
    });
  };

  const bulkDelete = () => {
    const ids = [...selectedIds];
    Modal.confirm({
      title: `Delete ${ids.length} test(s)?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Delete All", okType: "danger", cancelText: "Cancel",
      onOk: async () => {
        try {
          await Promise.all(ids.map((id) =>
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/test/delete/test/byid/${id}`, {
              method: "DELETE", headers: { Authorization: "Bearer " + auth.token },
            })
          ));
          message.success(`${ids.length} test(s) deleted`);
          setSelectedIds(new Set()); fetchAll();
        } catch { message.error("Some deletions failed"); }
      },
    });
  };

  const exportCSV = () => {
    const rows = [["Test Name", "Category", "Subject", "Duration (min)", "Total Marks", "Status", "Batch"]];
    filtered.forEach((t) => rows.push([
      t.testName, t.category || "", t.subject || "",
      t.duration || "", t.totalMarks || "",
      getTestStatus(t), t.batch || (t.batches || []).join("; "),
    ]));
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "tests.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (showAddForm) {
    return (
      <Card extra="w-full p-4">
        <AddTestForm onSubmit={() => { setShowAddForm(false); fetchAll(); }} onCancel={() => setShowAddForm(false)} />
      </Card>
    );
  }

  return (
    <Card extra="w-full pb-10 p-4 h-full">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">Manage Tests</h2>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} test{filtered.length !== 1 ? "s" : ""} shown</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search tests..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => { setCatFilter(e.target.value); setPage(0); }}
            className="py-2 px-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
          <select
            value={batchFilter}
            onChange={(e) => { setBatchFilter(e.target.value); setPage(0); }}
            className="py-2 px-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none"
          >
            <option value="All">All Batches</option>
            {batches.map((b) => <option key={b._id} value={b.batchName}>{b.batchName}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="py-2 px-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="expired">Expired</option>
            <option value="inactive">Inactive</option>
          </select>
          {selectedIds.size > 0 && (
            <button onClick={bulkDelete} className="px-3 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 flex items-center gap-1">
              <FaTrashAlt className="h-3 w-3" /> Delete ({selectedIds.size})
            </button>
          )}
          <button onClick={exportCSV} className="px-3 py-2 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 flex items-center gap-1">
            <FaDownload className="h-3 w-3" /> Export
          </button>
          <button onClick={() => setShowAddForm(true)} className="px-3 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600">
            + Add Test
          </button>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
            className="py-2 px-2 text-xs rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700"
          >
            {[10, 25, 50].map((s) => <option key={s} value={s}>{s} / page</option>)}
          </select>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-navy-600">
                <th className="pb-3 pr-3 w-8">
                  <input type="checkbox" checked={paginated.length > 0 && selectedIds.size === paginated.length} onChange={toggleAll} className="rounded" />
                </th>
                <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Test Name</th>
                <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Subject</th>
                <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Duration</th>
                <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Marks</th>
                <th className="pb-3 pr-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="pb-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                    No tests match your filters
                  </td>
                </tr>
              ) : (
                paginated.map((test) => {
                  const status = getTestStatus(test);
                  const isSelected = selectedIds.has(test._id);
                  return (
                    <tr key={test._id} className={`border-b border-gray-100 dark:border-navy-700 transition-colors ${isSelected ? "bg-blue-50 dark:bg-navy-800" : "hover:bg-gray-50 dark:hover:bg-navy-800"}`}>
                      <td className="py-3 pr-3">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(test._id)} className="rounded" />
                      </td>
                      <td className="py-3 pr-6">
                        <p className="text-sm font-bold text-navy-700 dark:text-white">{test.testName}</p>
                        {test.batch && <p className="text-xs text-gray-400">{test.batch}</p>}
                      </td>
                      <td className="py-3 pr-6">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{test.category || "—"}</span>
                      </td>
                      <td className="py-3 pr-6">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{test.subject || "—"}</span>
                      </td>
                      <td className="py-3 pr-6">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{test.duration ? `${test.duration} min` : "—"}</span>
                      </td>
                      <td className="py-3 pr-6">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{test.totalMarks || "—"}</span>
                      </td>
                      <td className="py-3 pr-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[status]}`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/manage-tests/edit/${test._id}`)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                            title="Edit test"
                          >
                            <FaEdit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(test._id)}
                            className="p-1.5 rounded-lg bg-red-50 text-white hover:bg-red-600"
                            title="Delete test"
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
          <p className="text-xs text-gray-500">Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}</p>
          <div className="flex gap-1">
            <button onClick={() => setPage(0)} disabled={page === 0} className="px-2 py-1 text-xs rounded border disabled:opacity-40">{"<<"}</button>
            <button onClick={() => setPage((p) => p - 1)} disabled={page === 0} className="px-2 py-1 text-xs rounded border disabled:opacity-40">{"<"}</button>
            <span className="px-3 py-1 text-xs">{page + 1} / {totalPages}</span>
            <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages - 1} className="px-2 py-1 text-xs rounded border disabled:opacity-40">{">"}</button>
            <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1} className="px-2 py-1 text-xs rounded border disabled:opacity-40">{">>"}</button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TestTable;