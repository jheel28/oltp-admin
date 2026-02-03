import React, { useContext, useEffect, useState } from "react";
import avatar from "assets/img/avatars/avatar11.png";
import banner from "assets/img/profile/banner.png";
import Card from "components/card";
import { AuthContext } from "components/Auth-context";
import { message } from "antd";

const Banner = () => {
  const [admin, setAdmin] = useState([]);
  const auth = useContext(AuthContext);
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
    <Card extra={"items-center w-full h-full p-[16px] bg-cover"}>
      {/* Background and profile */}
      <div
        className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
          <img
            className="h-full w-full rounded-full"
            src={`${process.env.REACT_APP_BACKEND_URL}/${admin.image}`}
            alt=""
          />
        </div>
      </div>

      {/* Name and position */}
      <div className="mt-16 flex flex-col items-center">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {admin.firstName + " " + admin.lastName}
        </h4>
        <p className="text-base font-normal text-gray-600">{admin.role}</p>
      </div>
    </Card>
  );
};

export default Banner;
