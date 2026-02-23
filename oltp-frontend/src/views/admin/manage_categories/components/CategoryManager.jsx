import React, { useContext, useEffect, useState, useCallback } from "react";
import { FaTrashAlt, FaPencilAlt, FaCheck, FaTimes, FaPlus, FaMinus, FaRegFolderOpen } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import Card from "components/card";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, message } from "antd";
import { AuthContext } from "components/Auth-context";

const CategoryManager = () => {
  const auth = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("categories");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // add category states
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [addingCat, setAddingCat] = useState(false);

  // inline edit category states
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [editingCatDesc, setEditingCatDesc] = useState("");

  // subject states
  const [addingSubjectFor, setAddingSubjectFor] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [editingSubject, setEditingSubject] = useState(null); 
  const [editingSubjectName, setEditingSubjectName] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/category/get/all`);
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      message.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const filtered = categories.filter((c) =>
    !search.trim() || c.name.toLowerCase().includes(search.toLowerCase())
  );

  const createCategory = async () => {
    const name = newCatName.trim();
    if (!name) { message.warning("Category name is required"); return; }
    setAddingCat(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/category/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify({ name, description: newCatDesc }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Error");
      message.success("Category created successfully");
      setNewCatName("");
      setNewCatDesc("");
      setActiveTab("categories"); // Switch back to list after creation
      fetchCategories();
    } catch (err) {
      message.error(err.message || "Failed to create category");
    } finally {
      setAddingCat(false);
    }
  };

  const saveEditCategory = async (id) => {
    if (!editingCatName.trim()) { message.warning("Name cannot be empty"); return; }
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/category/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify({ name: editingCatName.trim(), description: editingCatDesc }),
      });
      if (!res.ok) throw new Error();
      message.success("Category updated");
      setEditingCatId(null);
      fetchCategories();
    } catch {
      message.error("Failed to update category");
    }
  };

  const deleteCategory = (id, name, subjectCount) => {
    Modal.confirm({
      title: `Delete category "${name}"?`,
      content: subjectCount > 0 ? `This will permanently remove ${subjectCount} subject(s) associated with this category.` : "This action cannot be undone.",
      icon: <ExclamationCircleOutlined />,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/category/delete/${id}`, {
            method: "DELETE",
            headers: { Authorization: "Bearer " + auth.token },
          });
          if (!res.ok) throw new Error();
          message.success("Category deleted");
          if (expandedId === id) setExpandedId(null);
          fetchCategories();
        } catch {
          message.error("Failed to delete category");
        }
      },
    });
  };

  const addSubject = async (catId) => {
    const subject = newSubjectName.trim();
    if (!subject) { message.warning("Subject name is required"); return; }
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/category/add-subject/${catId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify({ subject }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Error");
      message.success("Subject added");
      setAddingSubjectFor(null);
      setNewSubjectName("");
      fetchCategories();
    } catch (err) {
      message.error(err.message || "Failed to add subject");
    }
  };

  const removeSubject = (catId, subject) => {
    Modal.confirm({
      title: `Remove subject "${subject}"?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Remove",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/category/remove-subject/${catId}/${encodeURIComponent(subject)}`,
            { method: "DELETE", headers: { Authorization: "Bearer " + auth.token } }
          );
          if (!res.ok) throw new Error();
          message.success("Subject removed");
          fetchCategories();
        } catch {
          message.error("Failed to remove subject");
        }
      },
    });
  };

  const saveEditSubject = async (catId, oldSubject) => {
    const newName = editingSubjectName.trim();
    if (!newName) { message.warning("Subject name cannot be empty"); return; }
    if (newName === oldSubject) { setEditingSubject(null); return; }
    const cat = categories.find((c) => c._id === catId);
    if (!cat) return;
    const newSubjects = cat.subjects.map((s) => (s === oldSubject ? newName : s));
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/category/update/${catId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + auth.token },
        body: JSON.stringify({ subjects: newSubjects }),
      });
      if (!res.ok) throw new Error();
      message.success("Subject updated");
      setEditingSubject(null);
      fetchCategories();
    } catch {
      message.error("Failed to update subject");
    }
  };

  const allSubjectCount = categories.reduce((sum, c) => sum + (c.subjects?.length || 0), 0);

  return (
    <Card extra="w-full pb-10 p-6 h-full shadow-2xl">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-navy-700 dark:text-white flex items-center gap-2">
            <FaRegFolderOpen className="text-blue-500" /> Category Manager
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage educational categories and their specialized subjects.
          </p>
        </div>
        <div className="relative group">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-navy-600 dark:bg-navy-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm transition-all"
          />
        </div>
      </header>

      {/* Modern Tab Switcher */}
      <div className="flex p-1 mb-8 bg-gray-100 dark:bg-navy-800 rounded-2xl w-fit border border-gray-200 dark:border-navy-700">
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "categories"
              ? "bg-white dark:bg-navy-700 text-blue-600 shadow-md scale-105"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === "add"
              ? "bg-white dark:bg-navy-700 text-blue-600 shadow-md scale-105"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <FaPlus size={12} /> New Category
        </button>
      </div>

      {/* Stats Summary Bar */}
      {activeTab === "categories" && (
        <div className="mb-6 flex gap-4">
            <div className="px-4 py-2 bg-blue-50 dark:bg-navy-800 rounded-lg border border-blue-100 dark:border-navy-700">
                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Total Subjects</span>
                <p className="text-lg font-bold text-navy-700 dark:text-white leading-tight">{allSubjectCount}</p>
            </div>
        </div>
      )}

      {/* Add Category Form */}
      {activeTab === "add" && (
        <div className="mb-10 p-6 rounded-2xl border border-gray-200 bg-white dark:bg-navy-800 dark:border-navy-700 shadow-sm animate-fadeIn">
          <h3 className="text-lg font-bold text-navy-700 dark:text-white mb-6">Create New Category</h3>
          <div className="space-y-6">
            <div className="max-w-md">
              <label className="block text-sm font-bold text-navy-700 dark:text-gray-300 mb-2">Category Name</label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Engineering Entrance"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-600 dark:bg-navy-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-navy-700 dark:text-gray-300 mb-2">Description</label>
              <textarea
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Briefly describe what this category covers..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-navy-600 dark:bg-navy-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={createCategory}
                disabled={addingCat}
                className="px-8 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50"
              >
                {addingCat ? "Processing..." : "Create Category"}
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className="px-8 py-3 rounded-xl bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-white font-bold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 font-medium">Fetching categories...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-navy-700 rounded-3xl">
          <p className="text-gray-400 text-lg">
            {search ? "No categories match your search." : "Your category list is empty."}
          </p>
          {!search && (
              <button onClick={() => setActiveTab("add")} className="mt-4 text-blue-500 font-bold hover:underline">
                  Add your first category now
              </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((cat, index) => {
            const isExpanded = expandedId === cat._id;
            const isEditingCat = editingCatId === cat._id;
            // Generate a consistent color based on index
            const accentColors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500', 'bg-cyan-500'];
            const accentColor = accentColors[index % accentColors.length];

            return (
              <div
                key={cat._id}
                className={`group rounded-2xl border transition-all duration-300 ${
                  isExpanded 
                  ? "border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-navy-800 shadow-lg" 
                  : "border-gray-100 dark:border-navy-700 bg-white dark:bg-navy-800 hover:shadow-md"
                }`}
              >
                {/* Header Section */}
                <div className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <div className={`w-1.5 h-10 rounded-full ${accentColor} flex-shrink-0 shadow-sm`} />
                  
                  <div className="flex-1 min-w-0">
                    {isEditingCat ? (
                      <div className="space-y-2 animate-fadeIn">
                        <input
                          type="text"
                          value={editingCatName}
                          onChange={(e) => setEditingCatName(e.target.value)}
                          className="w-full max-w-xs px-3 py-1.5 text-sm font-bold rounded-lg border border-blue-400 bg-white dark:bg-navy-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={editingCatDesc}
                          onChange={(e) => setEditingCatDesc(e.target.value)}
                          placeholder="Edit description..."
                          className="w-full max-w-md px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-900 dark:text-white"
                        />
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-base font-bold text-navy-700 dark:text-white truncate">
                          {cat.name}
                        </h4>
                        {cat.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end mr-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subjects</span>
                        <span className="text-sm font-bold text-navy-700 dark:text-white">{cat.subjects?.length || 0}</span>
                    </div>

                    <div className="flex gap-1">
                        {isEditingCat ? (
                            <>
                                <button onClick={() => saveEditCategory(cat._id)} className="p-2 rounded-lg bg-green-500 text-white shadow-sm hover:bg-green-600 transition-colors">
                                    <FaCheck size={14} />
                                </button>
                                <button onClick={() => setEditingCatId(null)} className="p-2 rounded-lg bg-gray-400 text-white shadow-sm hover:bg-gray-500 transition-colors">
                                    <FaTimes size={14} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setExpandedId(isExpanded ? null : cat._id)}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                        isExpanded 
                                        ? "bg-blue-500 text-white shadow-md" 
                                        : "bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                                    }`}
                                >
                                    {isExpanded ? "Close" : "View Subjects"}
                                </button>
                                <button
                                    onClick={() => { setEditingCatId(cat._id); setEditingCatName(cat.name); setEditingCatDesc(cat.description || ""); }}
                                    className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-navy-900 transition-colors"
                                    title="Edit Category"
                                >
                                    <FaPencilAlt size={14} />
                                </button>
                                <button
                                    onClick={() => deleteCategory(cat._id, cat.name, cat.subjects?.length || 0)}
                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-navy-900 transition-colors"
                                    title="Delete Category"
                                >
                                    <FaTrashAlt size={14} />
                                </button>
                            </>
                        )}
                    </div>
                  </div>
                </div>

                {/* Expanded Subject Area */}
                {isExpanded && (
                  <div className="px-6 py-5 border-t border-blue-100 dark:border-navy-700 bg-white/50 dark:bg-navy-900/50 rounded-b-2xl animate-slideDown">
                    <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Subject Management</h5>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(cat.subjects || []).map((subject) => {
                        const isEditingSub = editingSubject?.catId === cat._id && editingSubject?.oldName === subject;
                        return (
                          <div 
                            key={subject} 
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border transition-all ${
                                isEditingSub 
                                ? "border-blue-400 bg-white ring-2 ring-blue-100" 
                                : "border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 hover:border-blue-300"
                            }`}
                          >
                            {isEditingSub ? (
                              <>
                                <input
                                  type="text"
                                  value={editingSubjectName}
                                  onChange={(e) => setEditingSubjectName(e.target.value)}
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveEditSubject(cat._id, subject);
                                    if (e.key === "Escape") setEditingSubject(null);
                                  }}
                                  className="text-sm font-medium bg-transparent outline-none w-24 dark:text-white"
                                />
                                <button onClick={() => saveEditSubject(cat._id, subject)} className="text-green-500"><FaCheck size={12} /></button>
                              </>
                            ) : (
                              <>
                                <span className="text-sm font-semibold text-navy-700 dark:text-white">{subject}</span>
                                <div className="flex items-center gap-1.5 ml-1 border-l pl-2 border-gray-100 dark:border-navy-700">
                                    <button
                                        onClick={() => { setEditingSubject({ catId: cat._id, oldName: subject }); setEditingSubjectName(subject); }}
                                        className="text-gray-400 hover:text-blue-500 transition-colors"
                                    >
                                        <FaPencilAlt size={10} />
                                    </button>
                                    <button
                                        onClick={() => removeSubject(cat._id, subject)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <FaMinus size={10} />
                                    </button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                      {(cat.subjects || []).length === 0 && (
                        <p className="text-sm text-gray-400 italic">No subjects added to this category yet.</p>
                      )}
                    </div>

                    {/* Quick Add Subject */}
                    <div className="mt-4 pt-4 border-l-4 border-blue-500 pl-4 bg-blue-50/50 dark:bg-navy-800 rounded-r-xl">
                        {addingSubjectFor === cat._id ? (
                        <div className="flex gap-2 max-w-md animate-fadeIn">
                            <input
                            type="text"
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                            placeholder="New subject name..."
                            autoFocus
                            onKeyDown={(e) => { if (e.key === "Enter") addSubject(cat._id); if (e.key === "Escape") setAddingSubjectFor(null); }}
                            className="flex-1 px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            />
                            <button onClick={() => addSubject(cat._id)} className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-bold shadow-md">Add</button>
                            <button onClick={() => setAddingSubjectFor(null)} className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-navy-700 text-gray-600 dark:text-white text-sm font-bold">Cancel</button>
                        </div>
                        ) : (
                        <button
                            onClick={() => { setAddingSubjectFor(cat._id); setNewSubjectName(""); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 shadow-md transition-all active:scale-95"
                        >
                            <FaPlus size={12} /> Add Subject
                        </button>
                        )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default CategoryManager;