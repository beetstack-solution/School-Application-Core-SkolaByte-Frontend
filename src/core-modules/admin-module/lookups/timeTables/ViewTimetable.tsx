// ViewTimetable.tsx
import { fetchTimeTableById, fetchTimeTablePdfById } from "@/api/admin-api/lookups-api/timeTableApi";
import Breadcrumb from "@/components/Breadcumb";
import ExportExcelButton from "@/components/ExcelExportButton";
import ExportPdfButton from "@/components/ExportPdfButton";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FiBook, FiCalendar, FiClock, FiUser, FiUsers } from "react-icons/fi";

const ViewTimetable: React.FC = () => {
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Time Table", path: "/lookups/time-tables" },
    { label: "View Timetable", path: "" },
  ];

  const { id } = useParams();
  const [timetableData, setTimetableData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getTimetable = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const data = await fetchTimeTableById(id);
        setTimetableData(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getTimetable();
  }, [id]);

  const exportToExcel = async () => {
    setIsLoading(true);
    if (!id) {
      console.log("No timetable ID provided.");
      setIsLoading(false);
      return;
    }
    try {
      const response: any = await fetchTimeTableById(id);
      const timetableData = response.data;

      if (!timetableData || !timetableData.timeTableSchedule || timetableData.timeTableSchedule.length === 0) {
        console.log("No timetable data available to export.");
        return;
      }

      const dataToExport: any[] = [];
      let slNo = 1;

      const academicYear = timetableData.academicYear?.academicYear || 'N/A';
      const className = timetableData.class?.name || 'N/A';
      const divisionName = timetableData.division?.name || 'N/A';

      timetableData.timeTableSchedule.forEach((daySchedule: any) => {
        const day = daySchedule.day || 'N/A';

        daySchedule.subjects.forEach((subjectDetail: any) => {
          dataToExport.push({
            "Sl No": slNo++,
            "Academic Year": academicYear,
            "Class": className,
            "Division": divisionName,
            "Day": day,
            "Subject": subjectDetail.subject?.name || "N/A",
            "Teacher": subjectDetail.teacher?.name || "N/A",
            "Start Time": subjectDetail.startTime || "N/A",
            "End Time": subjectDetail.endTime || "N/A"
          });
        });
      });

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Timetable");

      const fileName = `Timetable_${className}_${divisionName}_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFileName = () => {
    if (!timetableData) return "timetable";
    const className = timetableData.class?.name || '';
    const divisionName = timetableData.division?.name || '';
    return `Timetable_${className}_${divisionName}_${new Date().toISOString().split('T')[0]}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
      <div className="flex flex-col md:flex-row justify-between items-center px-1 mb-4">
        <div className="page-header">
          <h3 className="flex items-center gap-2 text-lg font-semibold "><FiCalendar /> View Time Table</h3>
        </div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <ExportPdfButton
            fileName={`Timetable_${generateFileName()}`}
            onBeforeExport={() => console.log("Starting timetable PDF export...")}
            onAfterExport={() => console.log("Timetable PDF export completed!")}
            fetchPdf={() => fetchTimeTablePdfById(id!)}
            disabled={!id}
          />
          <ExportExcelButton
            onExport={exportToExcel}
            isLoading={isLoading}
          />
        </div>
      </div>

      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-8">
        {loading ? (
          <p className="text-gray-500">Loading timetable data...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : timetableData?.timeTableSchedule?.length > 0 ? (
          <>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <FiCalendar className="text-gray-400" /> Academic Year
                  </p>
                  <p className="font-medium">{timetableData.academicYear?.academicYear || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <FiBook className="text-gray-400" /> Class
                  </p>
                  <p className="font-medium">{timetableData.class?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <FiUsers className="text-gray-400" /> Division
                  </p>
                  <p className="font-medium">{timetableData.division?.name || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto shadow-lg rounded-2xl">
              <table className="min-w-full text-sm border border-gray-200 rounded-2xl">
                <thead className="bg-gray-200 text-gray-800">
                  <tr>
                    <th className="border px-6 py-3 text-center w-1/6">Day</th>
                    {/* <th className="border px-6 py-3 text-center">Sl No.</th> */}
                    <th className="border px-6 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <FiBook /> Subject
                      </div>
                    </th>
                    <th className="border px-6 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <FiUser /> Teacher
                      </div>
                    </th>
                    <th className="border px-6 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <FiClock /> Start Time
                      </div>
                    </th>
                    <th className="border px-6 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <FiClock /> End Time
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {timetableData.timeTableSchedule.map((scheduleItem: any, index: number) => (
                    scheduleItem.subjects?.map((subjectItem: any, subjIndex: number) => (
                      <tr key={`${index}-${subjIndex}`} className="hover:bg-gray-50">
                        {subjIndex === 0 ? (
                          <td
                            className="border px-6 py-2 font-semibold text-blue-600 text-center"
                            rowSpan={scheduleItem.subjects.length}
                          >
                            {scheduleItem.day}
                          </td>
                        ) : null}
                        {/* <td className="border px-6 py-2 text-center">{subjIndex + 1}</td> */}
                        <td className="border px-6 py-2 text-center">{subjectItem?.subject?.name || "N/A"}</td>
                        <td className="border px-6 py-2 text-center">{subjectItem?.teacher?.name || "N/A"}</td>
                        <td className="border px-6 py-2 text-center">{subjectItem?.startTime || "N/A"}</td>
                        <td className="border px-6 py-2 text-center">{subjectItem?.endTime || "N/A"}</td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No timetable data available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewTimetable;