import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { FcCancel } from "react-icons/fc";
import { TbArrowBackUp } from "react-icons/tb";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { updateExamById, fetchExamById } from "@/api/admin-api/lookups-api/examApi";
import {
  fetchSubjects,
  fetchClasses,
  fetchAcademicYear,
  fetchExamTypeDD,
  fetchDivisionsDD,
} from "@/api/common-api/commonDropDownApi";
import Breadcrumb from "@/components/Breadcumb";
import AcademicYearDropdown from "@/components/AcademicYearDropdown";

interface SubjectEntry {
  subject: string;
  examType: string;
  date: string;
  duration: string;
  durationUnit: "hour" | "minutes";
  marks: string;
  _id?: string;
}

const EditExam = () => {
  const { id } = useParams<{ id: string }>();
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
  const [subjectEntries, setSubjectEntries] = useState<SubjectEntry[]>([]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

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
        toast.error("Failed to load dropdown data");
        console.error("Error loading data", error);
      }
    };

    fetchData();
  }, []);

  const getExamData = async () => {
    try {
      if (!id) {
        throw new Error("Exam ID is missing.");
      }
      const response = await fetchExamById(id);
      if (response.success) {
        const examData = response.data;
        setExamName(examData.name);
        setSelectedClass(examData.class.id);
        setSelectedDivision(examData.division.id);
        setSelectedAcademicYear(examData.academicYear.id);
        setTotalMarks(examData.totalMarks.toString());

        // Format subject entries
        const formattedEntries = examData.subjects.map((subject: any) => {
          const [durationValue, durationUnit] = subject.duration.split(" ");
          return {
            subject: subject.subject.id,
            examType: subject.examType.id,
            date: subject.date.split('T')[0], // Format date to YYYY-MM-DD
            duration: durationValue,
            durationUnit: durationUnit as "hour" | "minutes",
            marks: subject.marks.toString(),
            _id: subject._id
          };
        });

        setSubjectEntries(formattedEntries);
      }
    } catch (error) {
      setError("Error fetching exam");
      console.error("Error fetching exam:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getExamData();
    }
  }, [id]);

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

    const examData:any = {
      id,
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
        _id: entry._id // Include the existing _id for updates
      })),
    };

    try {
      if (!id) {
        setError("Exam ID is missing.");
        return;
      }
      const response = await updateExamById(id, examData);
      if (response.success) {
        toast.success("Exam updated successfully!");
        navigate("/lookups/exams");
      } else {
        setError(response.message || "Failed to update exam.");
      }
    } catch (error) {
      toast.error("Failed to update exam. Please try again.");
      setError("Failed to update exam. Please try again.");
      console.error("Error updating exam:", error);
    }
  };

  const handleDurationChange = (index: number, value: string) => {
    const updatedEntries = [...subjectEntries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      duration: value,
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
    { label: "Edit Exam", path: "" },
  ];

  return (
    <div className="mt-2">
      <div className="flex flex-col md:flex-row justify-between items-center px-1 mb-3">
        <div>
          <h3 className="text-xl font-semibold mb-4">Edit Exam</h3>
          <div className="breadcrumb-section">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        <div className="header-btns">
          <Link to="/lookups/exams">
            <button className="add-btn">
              <TbArrowBackUp size={20} className="mr-2" />
              Back
            </button>
          </Link>
        </div>
      </div>

      {error && <div className="mb-4 text-red-500">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <AcademicYearDropdown
              value={selectedAcademicYear}
              onChange={setSelectedAcademicYear}
              required={true}
              disabled={false}
            />
          </div>

          <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Exam Name <span className="text-red-500">*</span>
            </label>
            <input
              value={examName}
              onChange={handleInputChange(setExamName)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter exam name"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Class <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedClass}
              onChange={handleSelectChange(setSelectedClass)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Division <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedDivision}
              onChange={handleSelectChange(setSelectedDivision)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Total Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={totalMarks}
              onChange={handlePositiveIntegerChange(setTotalMarks)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter total marks"
              required
              readOnly
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Subject Details</h4>
            <button
              type="button"
              onClick={addSubjectEntry}
              className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              <FiPlus className="mr-1" /> Add Subject
            </button>
          </div>

          {subjectEntries.map((entry, index) => (
            <div
              key={entry._id}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 border rounded-lg bg-gray-50 relative"
            >
              {subjectEntries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSubjectEntry(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Remove subject"
                >
                  <FiTrash2 size={18} />
                </button>
              )}

              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  value={entry.subject}
                  onChange={(e) =>
                    handleSubjectEntryChange(index, "subject", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Exam Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={entry.examType}
                  onChange={(e) =>
                    handleSubjectEntryChange(index, "examType", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Exam Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={entry.date}
                  onChange={(e) =>
                    handleSubjectEntryChange(index, "date", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Duration <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={entry.duration}
                    onChange={(e) => handleDurationChange(index, e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter duration"
                    required
                  />
                  <select
                    value={entry.durationUnit}
                    onChange={(e) => handleDurationUnitChange(index, e.target.value as "hour" | "minutes")}
                    className="ml-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hour">Hours</option>
                    <option value="minutes">Minutes</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Marks <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={entry.marks}
                  onChange={(e) =>
                    handleSubjectEntryChange(index, "marks", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="50"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4 items-center mt-4">
          <button type="submit" className="submit-btn flex items-center">
            <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
            Update
          </button>
          <button
            type="button"
            className="cancel-btn flex items-center"
            onClick={() => navigate("/lookups/exams")}
          >
            <FcCancel size={20} className="mr-2" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExam;