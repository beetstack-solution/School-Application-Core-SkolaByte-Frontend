import { useParams, Link } from "react-router-dom";
import { Key, useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcumb";
import { fetchExamById, ExamData } from "@/api/admin-api/lookups-api/examApi";
import { TbArrowBackUp } from "react-icons/tb";

const ViewExam = () => {
  const { id } = useParams();
  const [exam, setExam] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getExamById = async (Id: string) => {
    try {
      setLoading(true);
      const responseData = await fetchExamById(Id);
      if (responseData.success) {
        setExam(responseData.data);
      }
    } catch (error) {
      setError("Error fetching exam");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getExamById(id);
    }
  }, [id]);

  if (loading) return <div className="text-center mt-6 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center mt-6 text-red-500">{error}</div>;

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Exams", path: "/lookups/exams" },
    { label: "View Exam", path: "" },
  ];

  const formatDuration = (durationInMinutes: number) => {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">View Exam</h1>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <Link to="/lookups/exams">
          <button className='add-btn'>
            <TbArrowBackUp size={20} />
            Back
          </button>
        </Link>
      </div>

      {/* Exam Details */}
      {exam && (
        <div className="bg-white rounded shadow p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <InfoRow label="Exam Name" value={exam.name} />
              <InfoRow label="Class" value={exam.class?.name || "N/A"} />
              <InfoRow label="Division" value={exam.division?.name || "N/A"} />
              <InfoRow label="Academic Year" value={exam.academicYear?.academicYear || "N/A"} />
              <InfoRow label="Total Marks" value={exam.totalMarks || "N/A"} />
            </div>
          </div>

          {/* Subjects */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Subjects</h2>
       {exam.subjects?.length ? (
  <div className="space-y-4">
    {exam.subjects.map(
      (
        subjectItem: {
          date: string | number | Date;
          subject: { name: string };
          examType: { name: string };
          marks: number;
          duration: number;
        },
        idx: number // ✅ explicitly declare idx as number
      ) => (
        <div
          key={idx}
          className={`border p-4 rounded ${
            idx % 2 === 0 ? "bg-gray-50" : "bg-blue-50"
          }`}
        >
          <p>
            <strong>Date:</strong>{" "}
            {subjectItem.date
              ? new Date(subjectItem.date).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Subject:</strong> {subjectItem.subject?.name || "N/A"}
          </p>
          <p>
            <strong>Exam Type:</strong> {subjectItem.examType?.name || "N/A"}
          </p>
          <p>
            <strong>Marks:</strong> {subjectItem.marks || "N/A"}
          </p>
          <p>
            <strong>Duration:</strong>{" "}
            {subjectItem.duration || "N/A"}
          </p>
        </div>
      )
    )}
  </div>
) : (
  <p className="text-gray-500">No subjects found.</p>
)}

          </div>

          {/* Audit Info */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Audit Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <InfoRow
                label="Created At"
                value={exam.createdAt ? new Date(exam.createdAt).toLocaleString() : "N/A"}
              />
              <InfoRow
                label="Created By"
                value={`${exam.createdBy?.name || "N/A"} (${exam.createdBy?.email || "N/A"})`}
              />
              {/* Uncomment if needed */}
              {/* <InfoRow label="Updated At" value={exam.updatedAt ? new Date(exam.updatedAt).toLocaleString() : "N/A"} /> */}
              {/* <InfoRow label="Updated By" value={exam.updatedBy?.name || "N/A"} /> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="text-gray-800">{value}</span>
  </div>
);

export default ViewExam;
