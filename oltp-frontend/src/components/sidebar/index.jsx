/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";

import routes from "routes";
import avatar1 from "assets/img/avatars/avatar1.png";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "components/Auth-context";
import { message } from "antd";

const Sidebar = ({ open, onClose }) => {
  const auth = useContext(AuthContext);
  const [admin, setAdmin] = useState([]);
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/admin/get/admin/byid/${auth.userId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAdmin(data.admin);
      } catch (err) {
        message.error("Error fetching admin data:", err.message);
      }
    };
    fetchAdmin();
  }, []);
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[50px] flex items-center`}>
        {/* Image */}
        <img
          src={`${process.env.REACT_APP_BACKEND_URL}/${admin.image}`} // Replace with the actual path to your image
          alt="Image Description"
          className="ml-4 rounded-full" // Use rounded-full class to make the image round
          style={{ width: "80px", height: "80px" }} // Adjust width and height as needed
        />
      </div>
      <div className={`mx-[56px] mt-[10px] flex items-center`}>
        {/* Image */}
        <div className="ml-1 mt-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          Admin <span class="font-medium"></span>
        </div>
      </div>
      <div class="mb-7 mt-[58px] h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Links routes={routes} />
      </ul>

      {/* Nav item end */}
    </div>
  );
};

export default Sidebar;
