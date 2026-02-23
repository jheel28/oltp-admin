import { HiX } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import routes from "routes";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "components/Auth-context";
import { MdLogout } from "react-icons/md";
import DashIcon from "components/icons/DashIcon";

const Sidebar = ({ open, onClose }) => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const [admin, setAdmin] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!auth.userId) return;
    const fetchAdmin = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/get/admin/byid/${auth.userId}`
        );
        if (!res.ok) return;
        const data = await res.json();
        setAdmin(data.admin);
      } catch (_) {}
    };
    fetchAdmin();
  }, [auth.userId]);

  const isActive = (path) => location.pathname.includes(path.replace("/*", ""));

  const navRoutes = routes.filter((r) => r.layout === "/admin" && r.icon && r.path !== "logout");

  const initials = admin
    ? `${admin.firstName?.[0] || ""}${admin.lastName?.[0] || ""}`.toUpperCase()
    : "A";

  return (
    <div
      className={`fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-gray-200 bg-white transition-transform duration-200 dark:border-navy-700 dark:bg-navy-800 xl:translate-x-0 xl:z-10 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button
        onClick={onClose}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 xl:hidden"
      >
        <HiX className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-4 dark:border-navy-700">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-blue-600">
          {admin?.image && !imgError ? (
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/${admin.image}`}
              alt="Admin"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
              {initials}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {admin ? `${admin.firstName} ${admin.lastName}` : "Admin"}
          </p>
          <p className="text-xs font-medium text-blue-600">Administrator</p>
        </div>
        <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-navy-700">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          The Correct Steps
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="flex flex-col gap-0.5">
          {navRoutes.map((route, i) => {
            const active = isActive(route.path);
            return (
              <li key={i}>
                <Link
                  to={route.layout + "/" + route.path.replace("/*", "")}
                  onClick={() => { if (window.innerWidth < 1280) onClose(); }}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-400 dark:hover:bg-navy-700 dark:hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors [&>svg]:h-4 [&>svg]:w-4 ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-navy-700"
                    }`}
                  >
                    {route.icon || <DashIcon />}
                  </span>
                  {route.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-200 px-3 py-3 dark:border-navy-700">
        <button
          onClick={auth.logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-navy-700">
            <MdLogout className="h-4 w-4" />
          </span>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;