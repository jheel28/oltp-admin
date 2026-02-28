import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { MdSearch } from "react-icons/md";
import Card from "components/card";
import { message } from "antd";
import { AuthContext } from "components/Auth-context";

const avatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Admin")}&background=6366f1&color=fff&size=72&bold=true`;

const AdminsTable = () => {
  const auth = useContext(AuthContext);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  return (
    <Card extra="w-full pb-10 p-4 h-full">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">Manage Admins</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            {filtered.length} admin{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email, mobile..."
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
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-sm text-gray-400">
                    {search ? "No admins match your search" : "No admins found"}
                  </td>
                </tr>
              ) : (
                filtered.map((admin) => {
                  const isOwn = admin._id === auth.userId;
                  const imgSrc = admin.image
                    ? `${process.env.REACT_APP_BACKEND_URL}/${admin.image}`
                    : avatarUrl(`${admin.firstName} ${admin.lastName}`);
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
                            src={imgSrc}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = avatarUrl(`${admin.firstName} ${admin.lastName}`);
                            }}
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
                        <span className="text-sm text-gray-500">{admin.mobile || "—"}</span>
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