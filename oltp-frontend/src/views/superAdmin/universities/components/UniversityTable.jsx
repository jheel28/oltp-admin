import React, { useContext, useEffect, useMemo, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Card from "components/card";
import AddUniversityForm from "./AddUniversityForm";
import EditUniversityForm from "./ViewEditUniversity"; // Import the edit form component
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import UniversityAvatar from "assets/img/avatars/avatar1.png";
import Dropdown from "components/dropdown";
import { Modal, message } from "antd";
import { AuthContext } from "components/Auth-context";

const UniversitiesTable = (props) => {
  const { tableData } = props;
  const auth = useContext(AuthContext);
  const [universities, setUniversities] = useState([]);
  const [isAddUniversityFormVisible, setIsAddUniversityFormVisible] =
    useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/admin/get/all/admins`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUniversities(data.admins);
      } catch (err) {
        message.error(
          "error fetching universities, please try again",
          err.message
        );
      }
    };
    fetchUniversities();
  }, []);
  const handleAddUniversityClick = () => {
    setIsAddUniversityFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsAddUniversityFormVisible(false);
    // Clear the selected university when canceling
  };

  const handleFormSubmit = (formData) => {
    // Handle the university form submission logic here
    console.log("University Form submitted:", formData);
    setIsAddUniversityFormVisible(false);
    // Clear the selected university after submission
    // Show tick or any other success indication
  };

  const handleViewButtonClick = (university) => {
    setSelectedUniversity(university); // Set the selected university for editing
  };
  const handleUpdate = (updatedUniversityData) => {
    setSelectedUniversity(null);
  };
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this university?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        // Proceed with deletion
        deleteUniversity(id);
      },
      onCancel() {
        // Do nothing if user cancels
      },
    });
  };

  const deleteUniversity = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/admin/delete/admin/byid/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // If deletion is successful, update the state or perform any other action
      // For example, you can filter out the deleted student from the students array
      setUniversities(universities.filter((admin) => admin.id !== id));
      message.success(`University with ID ${id} deleted successfully.`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      message.error("Error deleting university:", error.message);
    }
  };
  const data = useMemo(
    () => (universities ? universities : []),
    [universities]
  );

  const columns = useMemo(
    () => [
      {
        Header: "University Image",
        accessor: "universityLogo",
        Cell: ({ value }) => (
          <img
            src={`${process.env.REACT_APP_BACKEND_URL}/${value}`}
            alt="University"
            className="h-10 w-10 rounded-full"
          />
        ),
      },
      {
        Header: "University Name",
        accessor: "universityName",
        Cell: ({ value }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {value}
          </p>
        ),
      },
      {
        Header: "Location",
        accessor: "address",
        Cell: ({ value }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {value}
          </p>
        ),
      },
      {
        Header: "View",
        accessor: "view",
        Cell: ({ row }) => (
          <button
            className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            onClick={() => handleViewButtonClick(row.original)}
          >
            View
          </button>
        ),
      },
      {
        Header: "Delete",
        accessor: "deleteButton",
        Cell: ({ row }) => (
          <button className="rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-700">
            <FaTrashAlt onClick={() => handleDelete(row.original._id)} />
          </button>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      {isAddUniversityFormVisible ? (
        <AddUniversityForm
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      ) : selectedUniversity ? ( // Show edit form if a university is selected
        <EditUniversityForm
          universityData={selectedUniversity} // original contains the original data of the row
          onUpdate={handleUpdate}
          onBack={() => setSelectedUniversity(null)}
        />
      ) : (
        <>
          <header className="relative flex items-center justify-between">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              Universities List
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                onClick={handleAddUniversityClick}
              >
                Add University
              </button>
              <div className=" rounded-full bg-blue-500 px-4 py-2 text-white">
                Rows per page:{" "}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                  className=" rounded-full bg-blue-500 text-white"
                >
                  {[3, 5, 10, 20, 30].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </header>
          <div>
            <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
              <table {...getTableProps()} className="w-full">
                <thead>
                  {headerGroups.map((headerGroup, index) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                      {headerGroup.headers.map((column, index) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          key={index}
                          className="border-b border-gray-200 pb-[10px] pr-14 text-start dark:!border-navy-700"
                        >
                          <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                            {column.render("Header")}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row, index) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} key={index}>
                        {row.cells.map((cell, index) => (
                          <td
                            className="pb-[20px] pt-[14px] sm:text-[14px]"
                            {...cell.getCellProps()}
                            key={index}
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between">
              <div>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                  {"<<"}
                </button>{" "}
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  {"<"}
                </button>{" "}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                  {">"}
                </button>{" "}
                <button
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  {">>"}
                </button>{" "}
              </div>
              <div>
                Page{" "}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{" "}
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default UniversitiesTable;
 