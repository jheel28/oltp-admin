import BaseNavbar from "./BaseNavbar";

const Navbar = ({ onOpenSidenav, brandText, onSearch }) => (
  <BaseNavbar
    onOpenSidenav={onOpenSidenav}
    brandText={brandText}
    onSearch={onSearch}
    fetchUrl="/api/v1/admin/get/admin/byid/"
  />
);

export default Navbar;