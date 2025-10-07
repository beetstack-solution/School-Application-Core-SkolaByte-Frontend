import React, { useState } from "react";
import Pagination from "@/components/Pagination"; // Adjust the path as necessary

interface TableRow {
  _id: number;
  status: boolean;
  code: string;
  role: string;
  createdBy: string;
  createdAt: string;
}

const dummyRoles: TableRow[] = Array.from({ length: 20 }, (_, index) => ({
  _id: index + 1,
  status: index % 2 === 0,
  code: `CODE${index + 1}`,
  role: `Role ${index + 1}`,
  createdBy: `User ${index + 1}`,
  createdAt: new Date().toISOString(),
}));

const Permission: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const totalPages = Math.ceil(dummyRoles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dummyRoles.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div>
      <table className="min-w-full data_table">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th>Sl No.</th>
            <th>Status</th>
            <th>Code</th>
            <th>Role</th>
            <th>Created By</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {currentItems.map((role, index) => (
            <tr key={role._id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{role.status ? "Active" : "Inactive"}</td>
              <td>{role.code}</td>
              <td>{role.role}</td>
              <td>{role.createdBy}</td>
              <td>{role.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Permission;
