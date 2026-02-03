import React, { useEffect, useMemo, useState } from "react";
import { FaTrashAlt, FaEdit, FaClock, FaCheckCircle } from "react-icons/fa";
import Card from "components/card";
import EditQueryForm from "./EditQueryForm";
import { TiDelete } from "react-icons/ti";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { message } from "antd";

const sampleQueryData = [
  {
    name: "Bob Smith",
    email: "bob.smith@example.com",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    status: "pending",
  },
  {
    name: "John Doe",
    email: "john.doe@example.com",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    status: "Rejected",
  },
  {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    status: "In Progress",
  },
  {
    name: "Bob Smith",
    email: "bob.smith@example.com",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    status: "Resolved",
  },

  // Add more sample queries as needed
];

const statusIcons = {
  approved: { icon: FaCheckCircle, colorClass: "text-green-500" },
  rejected: { icon: TiDelete, colorClass: "text-red-500" },
  pending: { icon: FaClock, colorClass: "text-yellow-500" },
  "in progress": { icon: FaClock, colorClass: "text-blue-500" },
  resolved: { icon: FaCheckCircle, colorClass: "text-green-500" },
  default: { icon: FaClock, colorClass: "text-gray-500" },
};

const QueriesTable = () => {
  const [isEditQueryFormVisible, setIsEditQueryFormVisible] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [queries, setQueries] = useState(null);
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/query/get/all/queries`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status ${response.status}`);
        }
        const data = await response.json();
        setQueries(data.queries);
      } catch (err) {
        message.error(
          "Something went wrong while fetching the queries",
          err.message
        );
      }
    };
    fetchQueries();
  }, []);
  const handleEditQueryClick = (query) => {
    setSelectedQuery(query);
    setIsEditQueryFormVisible(true);
  };

  const handleCancelForm = () => {
    setSelectedQuery(null);
    setIsEditQueryFormVisible(false);
  };

  const handleFormSubmit = (formData) => {
    // Handle the query form submission logic here
    console.log("Query Form submitted:", formData);
    setIsEditQueryFormVisible(false);
    // Show tick or any other success indication
  };

  const data = useMemo(() => (queries ? queries : []), [queries]);

  const columns = useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "email",
        accessor: "email",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => {
          const { icon: Icon, colorClass } =
            statusIcons[value.toLowerCase()] || statusIcons.default;
          return (
            <div className="flex items-center">
              <Icon className={`mr-2 text-xl ${colorClass}`} />
              <span className={`text-sm ${colorClass}`}>{value}</span>
            </div>
          );
        },
      },
      {
        Header: "Edit",
        accessor: "editButton",
        Cell: ({ row }) => (
          <button
            className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            onClick={() => handleEditQueryClick(row.original)}
          >
            <FaEdit />
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
      {isEditQueryFormVisible ? (
        <EditQueryForm
          query={selectedQuery}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      ) : (
        <>
          <header className="relative flex items-center justify-between">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              Queries List
            </div>
            <div className="flex items-center space-x-4">
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

export default QueriesTable;
