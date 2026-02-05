import React, { useContext, useEffect, useMemo, useState } from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { Modal, message } from "antd";
import Card from "components/card";
import QuizForm from "./QuizForm";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import EditQuizForm from "./EditQuizForm";
import { AuthContext } from "components/Auth-context";

const TestTable = (props) => {
  const auth = useContext(AuthContext);
  const { tableData } = props;
  const [tests, setTests] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [isQuizFormVisible, setIsQuizFormVisible] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isEditTestFormVisible, setIsEditTestFormVisible] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/test/get/all/tests`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTests(data.tests);
      } catch (err) {
        message.error("Error fetching tests:", err.message);
      }
    };
    fetchTests();
  }, []);

  const data = useMemo(() => {
    if (!tests) return [];
    if (filterCategory === "All") return tests;
    return tests.filter((test) => test.course === filterCategory);
  }, [tests, filterCategory]);

  const categories = useMemo(() => {
    if (!tests) return ["All"];
    const uniqueCategories = [...new Set(tests.map((test) => test.course))];
    return ["All", ...uniqueCategories];
  }, [tests]);

  const handleEditTestClick = () => {
    setIsEditTestFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsEditTestFormVisible(false);
    setIsQuizFormVisible(false); // Also close QuizForm if open
  };

  const handleFormSubmit = (formData) => {
    console.log("General Form submitted:", formData);
    setIsEditTestFormVisible(false);
    setIsQuizFormVisible(false); // Close QuizForm after submission
  };

  const handleEditQuizClick = (test) => {
    setSelectedTest(test);
    setIsEditTestFormVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this test?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteTest(id);
      },
      onCancel() {},
    });
  };

  const deleteTest = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/test/delete/test/byid/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + auth.token },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setTests(tests.filter((test) => test.id !== id));
      message.success(`Test with ID ${id} deleted successfully.`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      message.error("Error deleting test:", error.message);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Test ID",
        accessor: "testId",
        Cell: ({ value }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {value}
          </p>
        ),
      },
      {
        Header: "Exam Title",
        accessor: "examName",
        Cell: ({ value }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {value}
          </p>
        ),
      },
      {
        Header: "Category",
        accessor: "course",
        Cell: ({ value }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {value}
          </p>
        ),
      },
      {
        Header: "Subjects",
        accessor: "subjects",
        Cell: ({ value }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {value}
          </p>
        ),
      },
      {
        Header: "Batch",
        accessor: "batchName",
        Cell: ({ value }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {value}
          </p>
        ),
      },
      {
        Header: "Schedule",
        id: "schedule",
        Cell: ({ row }) => (
          <div className="text-sm font-bold text-navy-700 dark:text-white">
            <p>{row.original.date}</p>
            <p className="text-[10px] text-gray-500">
              {row.original.startTime} - {row.original.endTime}
            </p>
          </div>
        ),
      },
      {
        Header: "Difficulty",
        accessor: "difficulty",
        Cell: ({ value }) => {
          let color = "bg-gray-100 text-gray-800";
          if (value === "Easy") color = "bg-green-100 text-green-800";
          if (value === "Medium") color = "bg-orange-100 text-orange-800";
          if (value === "Hard") color = "bg-red-100 text-red-800";
          return (
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${color}`}>
              {value || "Medium"}
            </span>
          );
        },
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <button
            className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            onClick={() => handleEditQuizClick(row.original)}
          >
            <FaEdit />
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
  const handleUpdate = (updatedTestData) => {
    console.log("Updated student data:", updatedTestData);
    setSelectedTest(null);
    setIsEditTestFormVisible(false);
  };

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
      {isQuizFormVisible ? (
        <QuizForm onSubmit={handleFormSubmit} onCancel={handleCancelForm} />
      ) : isEditTestFormVisible && selectedTest ? (
        <EditQuizForm
          testData={selectedTest}
          onUpdate={handleUpdate}
          onBack={() => {
            setSelectedTest(null);
            setIsEditTestFormVisible(false);
          }}
        />
      ) : (
        <>
          <header className="relative flex items-center justify-between">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              Manage Tests
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 dark:bg-navy-800">
                <span className="mr-2 text-xs font-bold text-gray-600 dark:text-gray-300">Category:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-transparent text-xs font-bold text-navy-700 dark:text-white outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <button
                className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                onClick={() => setIsQuizFormVisible(true)}
              >
                Add Test
              </button>
              <div className="rounded-full bg-blue-500 px-4 py-2 text-white">
                Rows per page:{" "}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                  className="rounded-full bg-blue-500 text-white"
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
        </>
      )}
    </Card>
  );
};

export default TestTable;
