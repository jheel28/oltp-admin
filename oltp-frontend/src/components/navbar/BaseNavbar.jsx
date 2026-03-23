import React, { useContext, useEffect, useState } from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { AuthContext } from "components/Auth-context";

const avatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=0d9488&color=fff&size=80&bold=true`;

const BaseNavbar = ({ onOpenSidenav, brandText, onSearch, fetchUrl }) => {
  const [darkmode, setDarkmode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  const auth = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (darkmode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkmode]);

  useEffect(() => {
    if (!auth.userId) return;
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}${fetchUrl}${auth.userId}`,
          { headers: { Authorization: "Bearer " + auth.token } }
        );
        if (!res.ok) return;
        const data = await res.json();
        setUser(data.admin || data.student || null);
      } catch (_) {}
    };
    load();
  }, [auth.userId, fetchUrl]);

  useEffect(() => {
    setImgError(false);
  }, [user?.image]);

  const displayName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "";
  const avatarSrc =
    user?.image && !imgError
      ? `${(process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "")}/${user.image.replace(/^\//, "")}`
      : avatarUrl(displayName);

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-cyan-700/50">
      <div className="ml-[6px]">
        <p className="shrink text-[33px] capitalize text-cyan-900 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-cyan-900 dark:hover:text-teal-400"
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] items-center justify-end gap-3 rounded-full bg-white px-4 py-2 shadow-xl shadow-shadow-500 dark:!bg-cyan-800 dark:shadow-none">
        {onSearch && (
          <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-cyan-900 dark:text-white xl:w-[225px]">
            <p className="pl-3 pr-2 text-xl">
              <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
            </p>
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch(e.target.value)}
              className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-cyan-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
            />
          </div>
        )}

        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>

        <div
          className="cursor-pointer text-gray-600"
          onClick={() => setDarkmode(!darkmode)}
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
              className="h-10 w-10 cursor-pointer rounded-full object-cover"
              src={avatarSrc}
              alt={displayName || "User"}
              onError={() => setImgError(true)}
            />
          }
          classNames="py-2 top-8 -left-[180px] w-max"
        />
      </div>
    </nav>
  );
};

export default BaseNavbar;