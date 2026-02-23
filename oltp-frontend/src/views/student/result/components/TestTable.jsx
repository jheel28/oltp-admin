import React, { useContext, useEffect, useMemo, useState } from "react";
import Card from "components/card";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { AuthContext } from "components/Auth-context";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const TestsTable = () => {
  const [scores, setScores] = useState([]);
  const [tests, setTests] = useState([]);
  const [student, setStudent] = useState({});
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const studentResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/student/get/student/byid/${auth.userId}`
        );
        if (!studentResponse.ok) {
          throw new Error(`HTTP error! Status: ${studentResponse.status}`);
        }
        const studentData = await studentResponse.json();
        setStudent(studentData.student);

        const scoreResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/score/get/attempted/tests/bystudentid/${studentData.student.studentId}`
        );
        if (!scoreResponse.ok) {
          throw new Error(`HTTP error! Status: ${scoreResponse.status}`);
        }
        const scoreData = await scoreResponse.json();
        setScores(scoreData.tests);

        const testResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/test/get/all/tests`
        );
        if (!testResponse.ok) {
          throw new Error(`HTTP error! Status: ${testResponse.status}`);
        }
        const testData = await testResponse.json();
        setTests(testData.tests);
      } catch (err) {
        message.error("Error fetching scores and tests: " + err.message);
      }
    };
    fetchScores();
  }, [auth.userId]);

  const handleViewResults = (testId, paperId) => {
    navigate(`result-page/${testId}/${paperId}`);
  };

  const data = useMemo(() => {
    if (!scores || !tests) return [];

    const scoreTestIds = scores.map((score) => score.testId);
    const filteredTests = tests.filter((test) =>
      scoreTestIds.includes(test.testId)
    );

    return filteredTests.map((test) => {
      const score = scores.find((s) => s.testId === test.testId);
      return {
        ...test,
        marksObtained: score ? score.marksObtained : null,
      };
    });
  }, [scores, tests]);

  const columns = useMemo(
    () => [
      {
        Header: "Test ID",
        accessor: "testId",
      },
      {
        Header: "Test Name",
        accessor: "testName",
      },
      {
        Header: "Marks",
        accessor: "marksObtained",
      },
      {
        Header: "Max Marks",
        accessor: "totalMarks",
      },
      {
        Header: "Paper ID",
        accessor: "paperId",
      },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "View",
        accessor: "viewButton",
        Cell: ({ row }) => (
          <button
            className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            onClick={() =>
              handleViewResults(
                row.original.testId,
                row.original.paperId
              )
            }
          >
            View
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
    state: { pageIndex },
  } = tableInstance;

  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Tests Results
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
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
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
    </Card>
  );
};

export default TestsTable;