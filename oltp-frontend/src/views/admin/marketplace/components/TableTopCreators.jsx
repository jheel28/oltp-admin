import Card from "components/card";
import Progress from "components/progress";
import React, { useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

function TopCreatorTable(props) {
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/student/get/all/students`
        );
        if (!studentsResponse.ok) {
          throw new Error(`HTTP error! Status:${studentsResponse.status}`);
        }
        const studentsData = await studentsResponse.json();

        const scoresResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/score/get/all/scores`
        );
        if (!scoresResponse.ok) {
          throw new Error(`HTTP error! Status:${scoresResponse.status}`);
        }
        const scoresData = await scoresResponse.json();

        // Calculate total scores for each student
        const studentsWithTotalScores = studentsData.students.map((student) => {
          const studentScores = scoresData.scores.filter(
            (score) => score.studentId === student.studentId
          );

          // Convert marks from string to number and sum them up
          const totalScore = studentScores.reduce(
            (acc, curr) => acc + parseInt(curr.marks, 10),
            0
          );

          return { ...student, totalScore };
        });

        setStudents(studentsWithTotalScores);
        setScores(scoresData.scores);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const data = useMemo(
    () => students.filter((student) => student.totalScore > 0),
    [students]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: (row) => [`${row.firstName} ${row.lastName}`, row.image],
        sortType: "basic",
      },
      {
        Header: "Total Score",
        accessor: "totalScore",
        sortType: "basic",
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: "totalScore",
            desc: true,
          },
        ],
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    tableInstance;

  return (
    <Card extra={"h-[350px] w-full"}>
      {/* Top Creator Header */}
      <div className="flex h-fit w-full items-center justify-between rounded-t-2xl bg-white px-4 pb-[20px] pt-4 shadow-2xl shadow-gray-100 dark:!bg-navy-700 dark:shadow-none">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          Top Students
        </h4>
        <button className="linear rounded-[20px] bg-lightPrimary px-4 py-2 text-base font-medium text-brand-500 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:active:bg-white/20">
          See all
        </button>
      </div>

      {/* Top Creator Heading */}
      <div className="w-full overflow-x-scroll px-4 md:overflow-x-hidden">
        <table
          {...getTableProps()}
          className="w-full min-w-[100px] overflow-x-scroll"
        >
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={index}
                  >
                    <div className="flex items-center justify-between  pb-2 pt-4 text-start uppercase tracking-wide text-gray-600 sm:text-xs lg:text-xs">
                      {column.render("Header")}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()} className="px-4">
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let data = "";
                    if (cell.column.Header === "Name") {
                      data = (
                        <div className="items-left flex">
                          <div className="h-[30px] w-[30px] rounded-full">
                            <img
                              src={`${process.env.REACT_APP_BACKEND_URL}/${cell.value[1]}`}
                              className="h-full w-full rounded-full"
                              alt=""
                            />
                          </div>
                          &nbsp;&nbsp;
                          <p className="text-sm font-medium text-navy-700 dark:text-white">
                            {cell.value[0]}
                          </p>
                        </div>
                      );
                    } else if (cell.column.Header === "Total Score") {
                      data = (
                        <p className="text-md font-bold  dark:text-white">
                          {cell.value}
                        </p>
                      );
                    } else if (cell.column.Header === "Total Score") {
                      data = (
                        <div class="mx-2 flex font-bold">
                          <Progress width="w-16" value={cell.value} />
                        </div>
                      );
                    }
                    return (
                      <td
                        className="py-3 text-sm"
                        {...cell.getCellProps()}
                        key={index}
                      >
                        {data}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default TopCreatorTable;
