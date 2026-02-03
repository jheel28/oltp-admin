import React, { useMemo, useState } from "react";
import { FaBackward, FaTrashAlt } from "react-icons/fa";
import Card from "components/card";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table"; // Import the StudentResultsTable component
import Button from "components/button";

const sampleTestData = [
  {
    testName: "Mathematics",
    subject: "Math",
    score: 90,
    student: {
      name: "John Doe",
      id: "123456",
      batch: "2023",
    },
  },
  {
    testName: "Science",
    subject: "Physics",
    score: 85,
    student: {
      name: "Jane Smith",
      id: "789012",
      batch: "2022",
    },
  },
  // Add more sample test data as needed
];

const StudentResultsTable = ({setShowResultPage}) => { // Track the selected student for viewing results
  const data = useMemo(() => sampleTestData, []);

  const columns = useMemo(
    () => [
      {
        Header: "Student Name",
        accessor: "testName",
      },
      {
        Header: "Batch",
        accessor: "subject",
      },
      {
        Header: "Average Score",
        accessor: "score",
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
            <header className="relative flex items-center justify-between">
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Tests Results
              </div>
              <div>
                <Button label={"Back"} icon={<FaBackward/>} onClick={() => setShowResultPage(false)}/>
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
          
    </Card>
  )
};

export default StudentResultsTable;

