import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { IoCheckmarkDoneCircleOutline, IoInformationCircleOutline } from "react-icons/io5";
import { FcCancel } from "react-icons/fc";
import { TbArrowBackUp } from "react-icons/tb";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createExam } from "@/api/admin-api/lookups-api/examApi";
import {
  fetchSubjects,
  fetchClasses,
  fetchAcademicYear,
  fetchExamTypeDD,
  fetchDivisionsDD,
} from "@/api/common-api/commonDropDownApi";
import Breadcrumb from "@/components/Breadcumb";
import AcademicYearDropdown from "@/components/AcademicYearDropdown";
import { RiBook2Line } from "react-icons/ri";

interface SubjectEntry {
  subject: string;
  examType: string;
  date: string;
  duration: string;
  durationUnit: "hour" | "minutes";
  marks: string;
  _id?: string;
}

const AddExam = () => {
  const navigate = useNavigate();
  const [examName, setExamName] = useState("");
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [examTypes, setExamTypes] = useState<any[]>([]);
  const [totalMarks, setTotalMarks] = useState<string>("0");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [subjectEntries, setSubjectEntries] = useState<SubjectEntry[]>([
    {
      subject: "",
      examType: "",
      date: "",
      duration: "",
      durationUnit: "hour",
      marks: "",
      _id: Date.now().toString(),
    },
  ]);
  const [duration, setDuration] = useState<string>("");
  const [durationUnit, setDurationUnit] = useState<"hour" | "minutes">("hour");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          classesResponse,
          divisionsResponse,
          subjectsResponse,
          academicYearsResponse,
          examTypesResponse,
        ] = await Promise.all([
          fetchClasses(),
          fetchDivisionsDD(),
          fetchSubjects(),
          fetchAcademicYear(),
          fetchExamTypeDD(),

        ]);

        setClasses(classesResponse.data);
        setDivisions(divisionsResponse.data);
        setSubjects(subjectsResponse.data);
        setAcademicYears(academicYearsResponse.data);
        setExamTypes(examTypesResponse.data);
      } catch (error) {
        console.error("Error loading data", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<any>>) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
      };

  const handleSelectChange =
    (setter: React.Dispatch<React.SetStateAction<any>>) =>
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        setter(e.target.value);
      };

  const handlePositiveIntegerChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^[1-9]\d*$/.test(value) || value === "") {
          setter(value);
        }
      };

  const handleSubjectEntryChange = (
    index: number,
    field: keyof SubjectEntry,
    value: string
  ) => {
    const updatedEntries = [...subjectEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setSubjectEntries(updatedEntries);
  };

  const addSubjectEntry = () => {
    setSubjectEntries([
      ...subjectEntries,
      {
        subject: "",
        examType: "",
        date: "",
        duration: "",
        durationUnit: "hour",
        marks: "",
        _id: Date.now().toString(),
      },
    ]);
  };

  const removeSubjectEntry = (index: number) => {
    if (subjectEntries.length <= 1) return;
    const updatedEntries = [...subjectEntries];
    updatedEntries.splice(index, 1);
    setSubjectEntries(updatedEntries);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (
      !examName.trim() ||
      !selectedClass ||
      !selectedDivision ||
      !selectedAcademicYear ||
      !totalMarks
    ) {
      setError("Please fill in all required fields.");
      return;
    }


    for (const entry of subjectEntries) {
      if (
        !entry.subject ||
        !entry.examType ||
        !entry.date ||
        !entry.duration ||
        !entry.marks
      ) {
        setError("Please fill in all subject details.");
        return;
      }
    }

    const examData = {
      name: examName.trim(),
      class: selectedClass,
      division: selectedDivision,
      academicYear: selectedAcademicYear,
      totalMarks: parseInt(totalMarks),
      subjects: subjectEntries.map((entry) => ({
        subject: entry.subject,
        examType: entry.examType,
        date: new Date(entry.date).toISOString(),
        duration: `${entry.duration} ${entry.durationUnit}`,
        marks: parseInt(entry.marks),
      })),
    };

    try {
      const response = await createExam(examData as any);
      if (response.success) {
        toast.success("Exam created successfully!");
        navigate("/lookups/exams");
      } else {
        setError(response.message || "Failed to create exam.");
      }
    } catch (error) {
      toast.error("Failed to create exam. Please try again.");
      setError("Failed to create exam. Please try again.");
    }
  };


  const handleDurationChange = (index: number, value: string) => {
    const updatedEntries = [...subjectEntries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      duration: value,
      durationUnit: updatedEntries[index].durationUnit,
    };
    setSubjectEntries(updatedEntries);
  };

  const handleDurationUnitChange = (index: number, unit: "hour" | "minutes") => {
    const updatedEntries = [...subjectEntries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      durationUnit: unit,
    };
    setSubjectEntries(updatedEntries);
  };

  useEffect(() => {
    const total = subjectEntries.reduce((acc, entry) => {
      return acc + (parseInt(entry.marks) || 0);
    }, 0);
    setTotalMarks(total.toString());
  }, [subjectEntries]);




  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Exams", path: "/lookups/exams" },
    { label: "Add Exam", path: "" },
  ];

  return (
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  {/* Header Section */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New Exam</h2>
      <Breadcrumb items={breadcrumbItems} />
    </div>
    <button 
          onClick={() => navigate("/lookups/exams")}
     
       className="add-btn"
    >
      <TbArrowBackUp size={18} className="mr-2" />
      Back
        </button>
  </div>

  {error && (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
      {error}
    </div>
  )}

  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Basic Information Section */}
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <IoInformationCircleOutline className="text-blue-500 mr-2" size={20} />
        Basic Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Year */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Academic Year <span className="text-red-500">*</span>
          </label>
          <AcademicYearDropdown
            value={selectedAcademicYear}
            onChange={setSelectedAcademicYear}
            required={true}
            disabled={false}
          />
        </div>

        {/* Exam Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Exam Name <span className="text-red-500">*</span>
          </label>
          <input
            value={examName}
            onChange={handleInputChange(setExamName)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter exam name"
            required
          />
        </div>

        {/* Class */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Class <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedClass}
            onChange={handleSelectChange(setSelectedClass)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Class</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem._id}>
                {classItem.name}
              </option>
            ))}
          </select>
        </div>

        {/* Division */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Division <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedDivision}
            onChange={handleSelectChange(setSelectedDivision)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Division</option>
            {divisions.map((division) => (
              <option key={division._id} value={division._id}>
                {division.name}
              </option>
            ))}
          </select>
        </div>

        {/* Total Marks */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Total Marks <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={totalMarks}
            onChange={handlePositiveIntegerChange(setTotalMarks)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter total marks"
            required
          />
        </div>
      </div>
    </div>

    {/* Subject Details Section */}
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <RiBook2Line className="text-blue-500 mr-2" size={20} />
          Subject Details
        </h3>
        <button
          type="button"
          onClick={addSubjectEntry}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          <FiPlus className="mr-2" size={16} />
          Add Subject
        </button>
      </div>

      {subjectEntries.map((entry, index) => (
        <div
          key={entry._id}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-6 border border-gray-200 rounded-lg bg-white relative"
        >
          {subjectEntries.length > 1 && (
            <button
              type="button"
              onClick={() => removeSubjectEntry(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-200"
              title="Remove subject"
            >
              <FiTrash2 size={18} />
            </button>
          )}

          {/* Subject */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
              value={entry.subject}
              onChange={(e) =>
                handleSubjectEntryChange(index, "subject", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Exam Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Exam Type <span className="text-red-500">*</span>
            </label>
            <select
              value={entry.examType}
              onChange={(e) =>
                handleSubjectEntryChange(index, "examType", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Exam Type</option>
              {examTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Exam Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Exam Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={entry.date}
              onChange={(e) =>
                handleSubjectEntryChange(index, "date", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Duration <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <input
                type="text"
                value={entry.duration}
                onChange={(e) => handleSubjectEntryChange(index, "duration", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter duration"
                required
              />
              <select
                value={entry.durationUnit}
                onChange={(e) => handleDurationUnitChange(index, e.target.value as "hour" | "minutes")}
                className="px-3 py-2 border border-gray-300 border-l-0 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="hour">Hours</option>
                <option value="minutes">Minutes</option>
              </select>
            </div>
          </div>

          {/* Marks */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={entry.marks}
              onChange={(e) =>
                handleSubjectEntryChange(index, "marks", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="50"
              required
            />
          </div>
        </div>
      ))}
    </div>

    {/* Action Buttons */}
    <div className="flex justify-end space-x-4">
      <button
        type="button"
        onClick={() => navigate("/lookups/exams")}
        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center"
      >
        <FcCancel size={18} className="mr-2" />
        Cancel
      </button>
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center"
      >
        <IoCheckmarkDoneCircleOutline size={20} className="mr-2" />
        Submit Exam
      </button>
    </div>
  </form>
</div>
  );
};

export default AddExam;