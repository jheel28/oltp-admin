import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import Card from "components/card";
import ViewAdmin from "./ViewAdmin";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, message } from "antd";
import { AuthContext } from "components/Auth-context";

const AdminsTable = () => {
  const auth = useContext(AuthContext);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/get/all/admins`,
        { headers: { Authorization: "Bearer " + auth.token } }
      );
      const data = await res.json();
      setAdmins(data.admins || []);
    } catch {
      message.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const filtered = useMemo(() => {
    if (!search.trim()) return admins;
    const q = search.toLowerCase();
    return admins.filter(
      (a) =>
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        String(a.mobile)?.includes(q)
    );
  }, [admins, search]);

  const deleteAdmin = async (id) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/delete/admin/byid/${id}`,
        { method: "DELETE", headers: { Authorization: "Bearer " + auth.token } }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Delete failed");
      }
      message.success("Admin deleted");
      fetchAdmins();
    } catch (err) {
      message.error(err.message || "Failed to delete admin");
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete this admin?",
      content: "This action cannot be undone.",
      icon: <ExclamationCircleOutlined />,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => deleteAdmin(id),
    });
  };

  if (selectedAdmin) {
    return (
      <Card extra="w-full p-4">
        <ViewAdmin
          adminData={selectedAdmin}
          isOwnProfile={selectedAdmin._id === auth.userId}
          onUpdate={() => { setSelectedAdmin(null); fetchAdmins(); }}
          onBack={() => setSelectedAdmin(null)}
        />
      </Card>
    );
  }

  return (
    <Card extra="w-full pb-10 p-4 h-full">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">Manage Admins</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            {filtered.length} admin{filtered.length !== 1 ? "s" : ""} — you can only edit your own profile
          </p>
        </div>
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 dark:bg-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
          />
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-navy-600">
                <th className="pb-3 pr-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500"></th>
                <th className="pb-3 pr-6 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Name</th>
                <th className="pb-3 pr-6 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Email</th>
                <th className="pb-3 pr-6 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Mobile</th>
                <th className="pb-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                    {search ? "No admins match your search" : "No admins found"}
                  </td>
                </tr>
              ) : (
                filtered.map((admin) => {
                  const isOwn = admin._id === auth.userId;
                  return (
                    <tr
                      key={admin._id}
                      className={`border-b border-gray-100 transition-colors dark:border-navy-700 ${
                        isOwn ? "bg-blue-50 dark:bg-navy-800/60" : "hover:bg-gray-50 dark:hover:bg-navy-800"
                      }`}
                    >
                      <td className="py-3 pr-3">
                        <div className="relative">
                          <img
                            src={`${process.env.REACT_APP_BACKEND_URL}/${admin.image}`}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/36"; }}
                          />
                          {isOwn && (
                            <span className="absolute -top-1 -right-1 rounded-full bg-blue-500 px-1 text-[8px] font-bold text-white">YOU</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-6">
                        <span className="text-sm font-medium text-navy-700 dark:text-white">
                          {admin.firstName} {admin.lastName}
                        </span>
                      </td>
                      <td className="py-3 pr-6">
                        <span className="text-sm text-gray-500">{admin.email}</span>
                      </td>
                      <td className="py-3 pr-6">
                        <span className="text-sm text-gray-500">{admin.mobile}</span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedAdmin(admin)}
                            className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs text-white hover:bg-blue-600"
                          >
                            {isOwn ? "View / Edit" : "View"}
                          </button>
                          {!isOwn && (
                            <button
                              onClick={() => handleDelete(admin._id)}
                              className="rounded-lg bg-red-500 p-1.5 text-white hover:bg-red-600"
                            >
                              <FaTrashAlt className="h-3 w-3" />
                            </button>
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
    </Card>
  );
};

export default AdminsTable;