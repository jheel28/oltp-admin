import BaseNavbar from "./BaseNavbar";

const Navbar = ({ onOpenSidenav, brandText }) => (
  <BaseNavbar
    onOpenSidenav={onOpenSidenav}
    brandText={brandText}
    fetchUrl="/api/v1/student/get/student/byid/"
  />
);

export default Navbar;