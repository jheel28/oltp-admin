import React, { useMemo, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Card from "components/card";
import AddUniversityForm from "./AddUniversityForm";
import EditUniversityForm from "./EditUniversityForm"; // Import the edit form component
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

import UniversityAvatar from "assets/img/avatars/avatar1.png"
import Dropdown from "components/dropdown";

const sampleUniversityData = [
  {
    image: UniversityAvatar,
    name: "Harvard University",
    location: "Cambridge, MA, USA",
    view: "View",
    // Add more fields if needed, such as email, address, batches, logo, etc.
  },
  {
    image: UniversityAvatar,
    name: "Stanford University",
    location: "Stanford, CA, USA",
    view: "View",
    // Add more fields if needed
  },
  {
    image: UniversityAvatar,
    name: "Massachusetts Institute of Technology (MIT)",
    location: "Cambridge, MA, USA",
    view: "View",
    // Add more fields if needed
  },
  // Add more sample university data as needed
];


const UniversitiesTable = (props) => {
  const { tableData } = props;
  const [isAddUniversityFormVisible, setIsAddUniversityFormVisible] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null); // Track the selected university for editing

  const handleAddUniversityClick = () => {
    setIsAddUniversityFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsAddUniversityFormVisible(false);
    setSelectedUniversity(null); // Clear the selected university when canceling
  };

  const handleFormSubmit = (formData) => {
    // Handle the university form submission logic here
    console.log("University Form submitted:", formData);
    setIsAddUniversityFormVisible(false);
    setSelectedUniversity(null); // Clear the selected university after submission
    // Show tick or any other success indication
  };

  const handleViewButtonClick = (university) => {
    setSelectedUniversity(university); // Set the selected university for editing
  };

  const data = useMemo(() => (tableData ? tableData : sampleUniversityData), [tableData]);

  const columns = useMemo(
    () => [
      {
        Header: "University Image",
        accessor: "image",
        Cell: ({ value }) => (
          <img src={value} alt="University" className="rounded-full h-10 w-10" />
        ),
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ value }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">{value}</p>
        ),
      },
      {
        Header: "Location",
        accessor: "location",
        Cell: ({ value }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">{value}</p>
        ),
      },
      {
        Header: "View",
        accessor: "view",
        Cell: ({ row }) => (
          <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700" onClick={() => handleViewButtonClick(row.original)}>
            View
          </button>
        ),
      },
      {
        Header: "Delete",
        accessor: "deleteButton",
        Cell: () => (
          <button className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-700">
            <FaTrashAlt />
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
        <AddUniversityForm onSubmit={handleFormSubmit} onCancel={handleCancelForm} />
      ) : selectedUniversity ? ( // Show edit form if a university is selected
        <EditUniversityForm
          universityData={selectedUniversity.original} // original contains the original data of the row
          onCancel={handleCancelForm}
          onSubmit={handleFormSubmit}
        />
      ) : (
        <>
          <header className="relative flex items-center justify-between">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              Universities List
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                onClick={handleAddUniversityClick}
              >
                Add University
              </button>
              <div className=" bg-blue-500 text-white px-4 py-2 rounded-full">
                Rows per page:{" "}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                  className=" bg-blue-500 text-white rounded-full"
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
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                          key={index}
                          className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700"
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
                            className="pt-[14px] pb-[20px] sm:text-[14px]"
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

            <div className="flex justify-between mt-4">
              <div>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                  {"<<"}
                </button>{" "}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                  {"<"}
                </button>{" "}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                  {">"}
                </button>{" "}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
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
