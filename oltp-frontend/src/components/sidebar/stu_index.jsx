import BaseSidebar from "./BaseSidebar";
import routes from "studentRoutes";

const StudentSidebar = ({ open, onClose }) => (
  <BaseSidebar
    open={open}
    onClose={onClose}
    routes={routes.filter((r) => r.layout === "/student")}
    fetchUrl="/api/v1/student/get/student/byid/"
    renderMeta={(user) =>
      user?.studentId ? (
        <p className="truncate text-xs text-white">
          {user.studentId}
          {user.batch && (
            <span className="ml-2 inline-flex items-center rounded-md bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-400">
              {user.batch}
            </span>
          )}
        </p>
      ) : null
    }
  />
);

export default StudentSidebar;