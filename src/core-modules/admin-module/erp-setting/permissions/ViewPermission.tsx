import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { getModulePermissionById } from "@/api/admin-api/erp-setting-api/authortity-setting-api/permissionApi";
import { formatDateOnly } from "@/helpers/helper";
import { ModulePermissionByIdData } from "@/api/admin-api/erp-setting-api/authortity-setting-api/permissionApi";

function ViewPermission() {
  const { id } = useParams<{ id: string }>(); // Get module permission ID from URL
  const [modulePermission, setModulePermission] =
    useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModulePermission = async (paramId: string) => {
    try {
      const responseData = await getModulePermissionById(paramId);
      if (responseData.data.success && responseData.data.permissionData) {
        setModulePermission(responseData.data.permissionData);
      } else {
        setError("Module Permission not found.");
      }
    } catch (error) {
      console.error("Error fetching module permission:", error);
      setError("Error fetching module permission");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchModulePermission(id);
    }
  }, [id]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Module Permissions", path: "/module-permissions" },
    { label: "View Module Permission", path: "" },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">View Module Permission</h3>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="header-btns">
        <Link to={"/module-permissions"}>
          <button className="add-btn">
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </Link>
      </div>
      {modulePermission && (
        <div className="flex justify-between mt-4">
          <div className="w-full md:w-4/5">
            <table className="min-w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border px-4 py-2 font-semibold">Code</td>
                  <td className="border px-4 py-2">{modulePermission.code}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-semibold">
                    Module Name
                  </td>
                  <td className="border px-4 py-2">
                    {modulePermission.module.name}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-semibold">
                    Access List
                  </td>
                  <td className="border px-4 py-2">
                    <ul>
                      {modulePermission.accessList.map((access: any, index: number) => (
                        <li key={index}>
                          {access.moduleRef} - Actions:{" "}
                          {access.actionList.join(", ")}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-semibold">Status</td>
                  <td className="border px-4 py-2">
                    {modulePermission.status ? "Active" : "Inactive"}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-semibold">Created At</td>
                  <td className="border px-4 py-2">
                    {formatDateOnly(modulePermission?.createdAt || "")}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-semibold">Updated At</td>
                  <td className="border px-4 py-2">
                    {formatDateOnly(modulePermission?.updatedAt || "")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewPermission;
