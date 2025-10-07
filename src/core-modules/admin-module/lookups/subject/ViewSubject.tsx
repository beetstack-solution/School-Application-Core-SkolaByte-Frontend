import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";
import Breadcrumb from "@/components/Breadcumb";
import { fetchSubjectById , SubjectData } from "@/api/admin-api/lookups-api/subjectApi";

const ViewSubject = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [subjectData, setsubjectData] = useState<SubjectData | null>(null);
  const [loading, setLoading] = useState(true);

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "subjects", path: "/lookups/subjects" },
    { label: "View subject", path: "" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.error("subject ID is missing");
        setLoading(false);
        return;
      }

      try {
        const response:any = await fetchSubjectById(id);
        if (response.success) {
          setsubjectData(response.data);
        }
      } catch (error) {
        console.error("Error fetching subject:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!subjectData) {
    return <div>subject not found</div>;
  }

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const onReturn = () => {
    navigate("/lookups/subjects");
  };

  return (
    <div className="container mx-auto p-4">
    <div className="flex flex-col md:flex-row justify-between items-center px-1 mb-3">
      <div>
        <h3 className="text-xl font-semibold mb-4">View Subject</h3>
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
  
    <div className="w-full md:w-4/5 mt-5">
      <table className="min-w-full border-collapse">
        <tbody>
          <tr>
            <td className="border px-4 py-2 font-semibold">Name</td>
            <td className="border px-4 py-2">{subjectData.name}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-semibold">Code</td>
            <td className="border px-4 py-2">{subjectData.code}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-semibold">Academic Year</td>
            <td className="border px-4 py-2">{subjectData.academicYear?.academicYear}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-semibold">Start Month</td>
            <td className="border px-4 py-2">{subjectData.academicYear?.startMonth}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-semibold">End Month</td>
            <td className="border px-4 py-2">{subjectData.academicYear?.endMonth}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-semibold">Status</td>
            <td className="border px-4 py-2">
              {subjectData.status ? "Active" : "Inactive"}
            </td>
          </tr>
  
          {/* Creation Details */}

          <tr>
            <td className="border px-4 py-2 font-semibold">Created By</td>
            <td className="border px-4 py-2">{subjectData.createdBy.name}</td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-semibold">Created At</td>
            <td className="border px-4 py-2">
              {formatDate(subjectData.createdAt)}
            </td>
          </tr>
  
          {/* Update Details */}

          <tr>
            <td className="border px-4 py-2 font-semibold">Last Updated By</td>
            <td className="border px-4 py-2">
              {subjectData.updatedBy?.name || "N/A"}
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2 font-semibold">Last Updated Date</td>
            <td className="border px-4 py-2">
              {subjectData.userUpdatedDate ? formatDate(subjectData.userUpdatedDate) : "N/A"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
  );
};

export default ViewSubject;