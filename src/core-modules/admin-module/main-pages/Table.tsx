import React, { useState } from "react";
import { AiFillCaretUp } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { GrOverview } from "react-icons/gr";
import { IoMdDownload } from "react-icons/io";
// import SearchBar from "../components/SearchBar";

interface TableRow {
  slno: number;
  actions: string;
  status: string;
  name: string;
  email: string;
  address: string;
  createdBy: string;
}

const Table: React.FC = () => {
  const data: TableRow[] = [
    {
      slno: 1,
      actions: "string",
      status: "string",
      name: "Johns Doe",
      email: "john.doe@example.com",
      address: "1234 Elm Street",
      createdBy: "string",
    },
    {
      slno: 1,
      actions: "string",
      status: "string",
      name: "aohns Doe",
      email: "qohn.doe@example.com",
      address: "6234 Elm Street",
      createdBy: "string",
    },
    {
      slno: 1,
      actions: "string",
      status: "string",
      name: "aohns Doe",
      email: "john.doe@example.com",
      address: "1234 Elm Street",
      createdBy: "string",
    },
    {
      slno: 1,
      actions: "string",
      status: "string",
      name: "iohns Doe",
      email: "john.doe@example.com",
      address: "1234 Elm Street",
      createdBy: "string",
    },
    {
      slno: 1,
      actions: "string",
      status: "string",
      name: "bohns Doe",
      email: "john.doe@example.com",
      address: "1234 Elm Street",
      createdBy: "string",
    },
    {
      slno: 1,
      actions: "string",
      status: "string",
      name: "cohns Doe",
      email: "john.doe@example.com",
      address: "1234 Elm Street",
      createdBy: "string",
    },
    {
      slno: 1,
      actions: "string",
      status: "string",
      name: "dohns Doe",
      email: "john.doe@example.com",
      address: "1234 Elm Street",
      createdBy: "string",
    },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [sortState, setSortState] = useState({
    column: "slno",
    order: "ascending",
  });

  const sortedData = [...data].sort((a, b) => {
    if (
      a[sortState.column as keyof TableRow] <
      b[sortState.column as keyof TableRow]
    ) {
      return sortState.order === "ascending" ? -1 : 1;
    }
    if (
      a[sortState.column as keyof TableRow] >
      b[sortState.column as keyof TableRow]
    ) {
      return sortState.order === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);
  // Get the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle sorting
  const changeSort = (column: keyof TableRow) => {
    let order = "ascending";
    if (sortState.column === column && sortState.order === "ascending") {
      order = "descending";
    }
    setSortState({ column, order });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
      <div className="flex flex-col md:flex-row justify-end items-center px-1">
        {/* <SearchBar/> */}
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-96">
        <table className="min-w-full data_table">
          {/* Table Header */}
          <thead className="bg-gray-700 text-white">
            <tr>
              <th
                onClick={() => changeSort("slno")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Sl No.
                  {sortState.column === "slno" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th>Actions</th>
              <th
                onClick={() => changeSort("status")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Status
                  {sortState.column === "status" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                onClick={() => changeSort("name")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Name
                  {sortState.column === "name" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                onClick={() => changeSort("email")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Email
                  {sortState.column === "email" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                onClick={() => changeSort("address")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Address
                  {sortState.column === "address" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
              <th
                onClick={() => changeSort("createdBy")}
                style={{ cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  Created By
                  {sortState.column === "createdBy" &&
                    sortState.order === "ascending" && <AiFillCaretUp />}
                </div>
              </th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody className="text-gray-700">
            {currentItems.map((row) => (
              <tr key={row.slno} className="border">
                <td>{row.slno}</td>
                <td className="action-icons">
                  <GrOverview size={25} title="View" className="view-icon" />
                  <CiEdit size={28} title="Edit" className="edit-icon" />
                </td>
                <td>
                  <button className="active-btn" title="Active">
                    Active
                  </button>
                  <button className="inactive-btn" title="Inactive">
                    Inactive
                  </button>
                </td>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Total Count */}
      <div className="flex flex-col md:flex-row justify-between items-center px-1">
        <div className="total-count">
          <span className="flex flex-col md:flex-row justify-around items-center m-2">
            <div>
              Total Count: <span className="bold">{data.length}</span>
            </div>
            <div className="ml-2">
              <button className="export-btn" title="Export">
                <IoMdDownload size={18} />
              </button>
            </div>
          </span>
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`pagination-btn ${currentPage === index + 1 ? "active" : ""
                }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Table;
