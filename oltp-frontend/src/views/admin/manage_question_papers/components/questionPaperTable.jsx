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
import QuestionPaperForm from "./QuestionPaperForm";
import EditQuestionPaper from "./EditQuestionPaperForm";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { AuthContext } from "components/Auth-context";

const TestTable = (props) => {
  const auth = useContext(AuthContext);
  const { tableData } = props;
  const [questionPapers, setQuestionsPapers] = useState([]);
  const [selectedQuestionPaper, setSelectedQuestionPaper] = useState(null);
  const [isEditQuestionPaperFormVisible, setIsEditQuestionPaperFormVisible] =
    useState(false);

  useEffect(() => {
    const fetchQuestionPapers = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/questionpaper/get/all/questionpapers`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setQuestionsPapers(data.questionPapers);
      } catch (err) {
        message.error("Error fetching question papers:", err.message);
      }
    };
    fetchQuestionPapers();
  }, []);

  const data = useMemo(
    () => (questionPapers ? questionPapers : []),
    [questionPapers]
  );

  const handleEditQuestionPaperClick = (questionPaper) => {
    setSelectedQuestionPaper(questionPaper);
    setIsEditQuestionPaperFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsEditQuestionPaperFormVisible(false);
  };

  const handleViewClick = (questionPaper) => {
    setSelectedQuestionPaper(questionPaper);
  };

  const handleFormSubmit = (formData) => {
    console.log("General Form submitted:", formData);
    setIsEditQuestionPaperFormVisible(false);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this question paper?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        // Proceed with deletion
        deleteQuestionPaper(id);
      },
      onCancel() {
        // Do nothing if user cancels
      },
    });
  };

  const deleteQuestionPaper = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/questionpaper/delete/questionpaper/byid/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + auth.token },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setQuestionsPapers(
        questionPapers.filter((questionPaper) => questionPaper.id !== id)
      );
      message.success(`Question Paper with ID ${id} deleted successfully.`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      message.error("Error deleting question paper:", error.message);
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Question Paper ID",
        accessor: "questionPaperId",
        Cell: ({ value }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {value}
          </p>
        ),
      },
      {
        Header: "Max Marks",
        accessor: "score",
        Cell: ({ value }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {value}
          </p>
        ),
      },
      {
        Header: "Questions",
        accessor: "noOfQuestions",
        Cell: ({ value }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {value}
          </p>
        ),
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: ({ value }) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {value}
          </p>
        ),
      },
      // {
      //   Header: "Action",
      //   accessor: "action",
      //   Cell: ({ row }) => (
      //     <button
      //       className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
      //       onClick={() => handleEditQuestionPaperClick(row.original)} // Pass the selected question paper to handleEditQuestionPaperClick
      //     >
      //       <FaEdit />
      //     </button>
      //   ),
      // },
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
      {isEditQuestionPaperFormVisible ? (
        <QuestionPaperForm
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      ) : selectedQuestionPaper ? (
        <EditQuestionPaper
          questionPaper={selectedQuestionPaper}
          onCancel={handleCancelForm}
        />
      ) : (
        <>
          <header className="relative flex items-center justify-between">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              Test History
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                onClick={() => setIsEditQuestionPaperFormVisible(true)}
              >
                Add Question Paper
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
