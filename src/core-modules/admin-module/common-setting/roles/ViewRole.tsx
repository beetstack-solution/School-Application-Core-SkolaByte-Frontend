import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchRoleById, Roles } from "@/api/admin-api/common-setting-api/roleApi";
import { useEffect, useState } from "react";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { formatDateOnly } from "@/helpers/helper";

function ViewRole() {
  const { id } = useParams<{ id: string }>(); // Get role ID from URL
  const [role, setRole] = useState<Roles | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const getRoleById = async (paramId: string) => {
    try {
      const responseData = await fetchRoleById(paramId);
      if (responseData.success) {
        console.log("role by id:", responseData.role); // Log the role object directly
        setRole(responseData.role); // Set the role to the nested role object
      } else {
        setError("Role not found.");
      }
    } catch (error) {
      console.error("Error fetching role:", error);
      setError("Error fetching role");
    } finally {
      setLoading(false); // Set loading state to false once done
    }
  };

  useEffect(() => {
    if (id) {
      getRoleById(id);
    }
  }, [id]);

  if (loading) return <div className="text-center">Loading...</div>; // Loading state
  if (error) return <div className="text-center text-red-500">{error}</div>; // Error state
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Roles", path: "/roles" },
    { label: "View Role", path: "" },
  ];
  const onReturn = () => {
    navigate("/roles");
  };
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center px-1 mb-3">
      <div>
        <h3 className="text-xl font-semibold mb-4">View Fee Structure</h3>
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
      {role && (
        <div className="flex justify-between mt-4">
          <div className="w-full md:w-4/5">
            <table className="min-w-full border-collapse">
              <tbody>
                {/* Row 1 */}
                <tr>
                  <td className="border px-4 py-2 font-semibold">Code</td>
                  <td className="border px-4 py-2">{role.code}</td>
                </tr>

                <tr>
                  <td className="border px-4 py-2 font-semibold">Name</td>
                  <td className="border px-4 py-2">{role.name}</td>
                </tr>

                {/* Row 2 */}
                <tr>
                  <td className="border px-4 py-2 font-semibold">
                    Permitted Module Types
                  </td>
                  <td className="border px-4 py-2">
                    <ul>
                      {role.permittedModuleTypes.map((moduleType) => (
                        <li key={moduleType._id}>{moduleType.name}</li> // This should work now
                      ))}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-semibold">Role Alias</td>
                  <td className="border px-4 py-2">{role.roleAlias}</td>
                </tr>
                <tr>
                <td className="border px-4 py-2 font-semibold">Created By</td>
                <td className="border px-4 py-2">{role.createdBy?.name || "N/A"}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewRole;
