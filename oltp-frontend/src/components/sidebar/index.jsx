import BaseSidebar from "./BaseSidebar";
import routes from "routes";

const Sidebar = ({ open, onClose }) => (
  <BaseSidebar
    open={open}
    onClose={onClose}
    routes={routes.filter((r) => r.layout === "/admin")}
    fetchUrl="/api/v1/admin/get/admin/byid/"
    renderMeta={() => (
      <p className="text-xs font-medium text-teal-600">Administrator</p>
    )}
  />
);

export default Sidebar;