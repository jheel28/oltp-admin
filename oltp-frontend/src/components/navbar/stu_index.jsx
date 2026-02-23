import React from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link } from "react-router-dom";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "components/Auth-context";
import { message } from "antd";

const Navbar = (props) => {
  const { onOpenSidenav, brandText, onSearch } = props;
  const [darkmode, setDarkmode] = React.useState(false);
  const auth = useContext(AuthContext);
  const [student, setStudent] = useState([]);
  useEffect(() => {
    if (!auth.userId) return;
    const fetchStudent = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/student/get/student/byid/${auth.userId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setStudent(data.student);
      } catch (err) {
        message.error("Error fetching student data: " + err.message);
      }
    };
    fetchStudent();
  }, [auth.userId]);
  const handleSearch = (event) => {
    const searchText = event.target.value;
    if (onSearch) {
      onSearch(searchText);
    }
  };
  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-max items-center justify-end gap-8 rounded-full bg-white px-8 py-4 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none">
        {" "}
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>
        <Dropdown
          button={
            <img
              className="h-10 w-10 rounded-full"
              src={
                student?.image
                  ? `${process.env.REACT_APP_BACKEND_URL}/${student.image}`
                  : ""
              }
              alt="Image Description"
            />
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
