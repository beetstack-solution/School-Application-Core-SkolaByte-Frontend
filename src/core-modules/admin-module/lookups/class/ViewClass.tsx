import {
  ClassesDetailResponse,
  fetchClassById,
} from "@/api/admin-api/lookups-api/classApi";
import Breadcrumb from "@/components/Breadcumb";
import React, { useEffect, useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import { Link, useNavigate, useParams } from "react-router-dom";

function ViewClass() {
  const { id } = useParams<{ id: string }>(); // Get class ID from URL
  const [classData, setClassData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const Navigate = useNavigate();
  const getClassById = async (id: string) => {
    try {
      const responseData = await fetchClassById(id);
      if (responseData.success) {
        setClassData(responseData?.data);
      } else {
        setError("Class module data not found");
      }
    } catch (error: any) {
      console.error("Error fetching class module data:", error);
      setError(
        error.response?.data?.message || "Error fetching class module data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getClassById(id);
    }
  }, [id]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const onReturn = () => {
    Navigate("/lookups/classes");
  };
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Class", path: "/lookups/classes" },
    { label: "View Class", path: "" },
  ];
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center px-1 mb-3">
        <div>
          <h3 className="text-xl font-semibold mb-4">View Class</h3>
          <div className="breadcrumb-section">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        <div className="header-btns flex gap-2 ">
          <div>
            <button className="add-btn" onClick={onReturn}>
              <TbArrowBackUp size={20} className="mr-2" />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Display Class Information */}
      {classData && (
        <div className="w-full md:w-4/5 mt-5">
          <table className="min-w-full border-collapse">
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-semibold">Code</td>
                <td className="border px-4 py-2">{classData?.code || "N/A"}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Name</td>
                <td className="border px-4 py-2">{classData?.name || "N/A"}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Display Name</td>
                <td className="border px-4 py-2">{classData?.displayName || "N/A"}</td>
              </tr>
              {classData.nameAlias && (
                <tr>
                  <td className="border px-4 py-2 font-semibold">Alias</td>
                  <td className="border px-4 py-2">{classData?.nameAlias}</td>
                </tr>
              )}
              <tr>
                <td className="border px-4 py-2 font-semibold">Status</td>
                <td className="border px-4 py-2">
                  {classData.status ? "Active" : "Inactive"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Created By</td>
                <td className="border px-4 py-2">
                  {classData?.createdBy?.name || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Created At</td>
                <td className="border px-4 py-2">
                  {new Date(classData?.createdAt).toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Updated At</td>
                <td className="border px-4 py-2">
                  {new Date(classData.userUpdatedDate).toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Updated By</td>
                <td className="border px-4 py-2">
                  {classData?.updatedBy?.name || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewClass;
