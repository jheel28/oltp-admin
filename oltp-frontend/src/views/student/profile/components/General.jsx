import React, { useContext, useEffect, useState } from "react";
import { message } from "antd";
import Card from "components/card";
import { AuthContext } from "components/Auth-context";

const General = () => {
  const initialData = {
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    fatherNumber: "",
    motherNumber: "",
    role: "",
    admissionDate: "",
    batch: "",
    address: "",
    pincode: "",
    state: "",
    country: "",
    email: "",
    studentId: "",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...initialData });
  const auth = useContext(AuthContext);

  useEffect(() => {
    // Fetch student data from backend and populate editedData
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      // Make API call to fetch student data based on user ID or any identifier
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/student/get/student/byid/${auth.userId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // Exclude _id and image from fetched data
      const { _id, image, ...studentData } = data.student;
      setEditedData(studentData);
    } catch (error) {
      message.error("Error fetching student data:", error.message);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = async () => {
    try {
      // Make API call to update student data
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/student/update/student/student/byid/${auth.userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify(editedData),
        }
      );

      if (response.status === 201) {
        message.success("Student updated successfully");
        // Reload data or update state as needed
        fetchStudentData();
        setIsEditing(false);
      } else {
        message.error("Could not update the student, please try again");
      }
    } catch (error) {
      message.error("Could not update the student, please try again");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Card extra={"w-full h-full p-3"}>
      {/* Header */}
      <div className="mb-8 mt-2 w-full">
        <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
          Student Information
        </h4>
      </div>
      {/* Form */}
      <form className="grid grid-cols-2 gap-4 px-2">
        {/* Render input fields for each data attribute */}
        {Object.entries(editedData).map(([key, value]) => {
          if (
            key === "_id" ||
            key === "image" ||
            key === "email" ||
            key === "studentId"
          ) {
            return (
              <div
                key={key}
                className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
              >
                <p className="text-sm text-gray-600">{key}</p>
                <p className="text-base font-medium text-navy-700 dark:text-white">
                  {value}
                </p>
              </div>
            );
          }
          return (
            <div
              key={key}
              className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
            >
              <p className="text-sm text-gray-600">{key}</p>
              {isEditing ? (
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 p-2 text-base font-medium text-navy-700 dark:text-white"
                />
              ) : (
                <p className="text-base font-medium text-navy-700 dark:text-white">
                  {value}
                </p>
              )}
            </div>
          );
        })}
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
