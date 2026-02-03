import React, { useContext, useEffect, useMemo, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Card from "components/card";
import AddBatchForm from "./AddBatchForm";
import ViewEditBatch from "./viewEditBatch";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { Modal, message } from "antd";
import { AuthContext } from "components/Auth-context";

const StudentsTable = (props) => {
  const auth = useContext(AuthContext);
  const { tableData, searchText } = props;
  const [isAddBatchFormVisible, setIsAddBatchFormVisible] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/batch/get/all/batches`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setBatches(data.batches);
      } catch (err) {
        message.error("Error fetching batches:", err.message);
      }
    };
    fetchBatches();
  }, []);
  const handleAddBatchClick = () => {
    setIsAddBatchFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsAddBatchFormVisible(false);
  };

  const handleFormSubmit = (formData) => {
    console.log("Form submitted:", formData);
    setIsAddBatchFormVisible(false);
  };

  const handleViewClick = (batch) => {
    setSelectedBatch(batch);
  };

  const handleUpdate = (updatedBatchData) => {
    console.log("Updated batch data:", updatedBatchData);
    setSelectedBatch(null);
  };
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this batch?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteBatch(id);
      },
      onCancel() {},
    });
  };

  const deleteBatch = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/beta/batch/delete/batch/byid/${id}`,
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

      setBatches(batches.filter((batch) => batch.id !== id));
      message.success(`Batch with ID ${id} deleted successfully.`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      message.error("Error deleting batch:", error.message);
    }
  };

  const data = useMemo(() => (batches ? batches : []), [batches]);

  const columns = useMemo(
    () => [
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
        Header: "View",
        accessor: "view",
        Cell: ({ row }) => (
          <button
            className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            onClick={() => handleViewClick(row.original)}
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
      {isAddBatchFormVisible ? (
        <AddBatchForm onSubmit={handleFormSubmit} onCancel={handleCancelForm} />
      ) : selectedBatch ? (
        <ViewEditBatch
          batchData={selectedBatch}
          onUpdate={handleUpdate}
          onBack={() => setSelectedBatch(null)}
        />
      ) : (
        <>
          <header className="relative flex items-center justify-between">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              List of Batches
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                onClick={handleAddBatchClick}
              >
                Add Batch
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

export default StudentsTable;
