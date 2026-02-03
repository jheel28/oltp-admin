import { message } from "antd";
import Card from "components/card";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "components/Auth-context";
const General = ({ adminData, onUpdate, onBack }) => {
  const initialData = {
    name: "Medona",
    university: "JK Lakshmipat University",
    mobile: 1234567890,
    email: "medona@gmail.com",
    address: "Hyderabad",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...initialData });
  const [superAdmin, setSuperAdmin] = useState([]);
  const auth = useContext(AuthContext);
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/superadmin/get/superadmin/byid/${auth.userId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setSuperAdmin(data.superAdmin);
        setEditedData(data.superAdmin);
      } catch (err) {
        message.error("Error fetching admin data:", err.message);
      }
    };
    fetchAdmin();
  }, []);
  const handleEditClick = async () => {
    setIsEditing(true);
  };
  const onFinish = async (values) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/superadmin/update/superadmin/byid/${superAdmin._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify(values),
        }
      );

      if (response.status === 201) {
        message.success("Super admin updated Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        message.error(
          "Could not update the super admin, please check and try again"
        );
      }
    } catch (err) {
      message.error(
        "Could not update the super admin, please check and try again"
      );
    }
  };

  const handleUpdateClick = async () => {
    try {
      await onFinish(editedData);
      console.log("Data updated:", editedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating super admin:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];

      setEditedData((prevData) => ({
        ...prevData,
        image: file,
      }));
    } else {
      // For other input fields
      setEditedData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <Card extra={"w-full h-full p-3"}>
      {/* Header */}
      <div className="mb-8 mt-2 w-full">
        <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
          General Information
        </h4>
      </div>
      {/* Cards/ Form */}
      <form className="grid grid-cols-2 gap-4 px-2">
        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">First Name</p>
          {isEditing ? (
            <input
              type="text"
              name="firstName"
              value={editedData.firstName}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
            />
          ) : (
            <p className="text-base font-medium text-navy-700 dark:text-white">
              {editedData.firstName}
            </p>
          )}
        </div>
        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">Last Name</p>
          {isEditing ? (
            <input
              type="text"
              name="lastName"
              value={editedData.lastName}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
            />
          ) : (
            <p className="text-base font-medium text-navy-700 dark:text-white">
              {editedData.lastName}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">Mobile Number</p>
          {isEditing ? (
            <input
              type="text"
              name="mobile"
              value={editedData.mobile}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
            />
          ) : (
            <p className="text-base font-medium text-navy-700 dark:text-white">
              {editedData.mobile}
            </p>
          )}
        </div>
        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">Email</p>
          {isEditing ? (
            <input
              type="text"
              name="email"
              value={editedData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
            />
          ) : (
            <p className="text-base font-medium text-navy-700 dark:text-white">
              {editedData.email}
            </p>
          )}
        </div>

        <div className="col-span-2 flex justify-end">
          {isEditing ? (
            <button
              type="button"
              className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
              onClick={handleUpdateClick}
            >
              Update
            </button>
          ) : (
            <button
              type="button"
              className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
              onClick={handleEditClick}
            >
              Edit
            </button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default General;
