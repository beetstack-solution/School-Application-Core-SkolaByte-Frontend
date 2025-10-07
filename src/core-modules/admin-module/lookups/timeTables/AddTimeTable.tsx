import { createTimetable } from "@/api/admin-api/lookups-api/timeTableApi";
import { Class } from "@/api/admin-api/student-management/students-api/studentsApi";
import {
  AcademicYear,
  Division,
  fetchAcademicYear,
  fetchClasses,
  fetchDivisionsDD,
  fetchSubjects,
  fetchTeachers,
  subjects,
  Teacher,
} from "@/api/common-api/commonDropDownApi";
import AcademicYearDropdown from "@/components/AcademicYearDropdown";
import Breadcrumb from "@/components/Breadcumb";
import React, { useEffect, useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { TbArrowBackUp } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddTimeTable: React.FC = () => {
  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Time Table", path: "/lookups/time-tables" },
    { label: "Add Timetable", path: "" },
  ];

  const [subjects, setSubjects] = useState<subjects[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
 const [classes, setClasses] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  interface SubjectEntry {
    subject: string;
    teacher: string;
    startTime: string;
    endTime: string;
  }
  interface DaySchedule {
    day: string;
    subjects: SubjectEntry[];
  }

  const [formData, setFormData] = useState<{
    [x: string]: any;
    academicYear: string;
    class: string;
    division: string;
    timeTableSchedule: DaySchedule[];
  }>({
    academicYear: "",
    class: "",
    division: "",
    timeTableSchedule: [
      {
        day: "Monday",
        subjects: [
          {
            subject: "",
            teacher: "",
            startTime: "",
            endTime: "",
          },
        ],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          yearsData,
          classesData,
          divisionsData,
          teachersData,
          subjectData,
        ] = await Promise.all([
          fetchAcademicYear(),
          fetchClasses(),
          fetchDivisionsDD(),
          fetchTeachers(),
          fetchSubjects(),
        ]);
        setAcademicYears(yearsData.data);
        setClasses(classesData.data);
        setDivisions(divisionsData.data);
        setTeachers(teachersData.data);
        setSubjects(subjectData.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchData();
  }, []);

  const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handleDayChange = (index: number, value: string) => {
    const updated = [...formData.timeTableSchedule];
    updated[index].day = value;
    setFormData({ ...formData, timeTableSchedule: updated });
  };

  const getNextAvailableDay = () => {
    const usedDays = formData.timeTableSchedule.map(day => day.day);
    return DAYS_OF_WEEK.find(day => !usedDays.includes(day)) || "";
  };


  const addDaySchedule = () => {
    const nextDay = getNextAvailableDay();
  if (!nextDay) {
    toast.warning("All days of the week have been added");
    return;
  }
    setFormData((prev) => ({
      ...prev,
      timeTableSchedule: [
        ...prev.timeTableSchedule,
        {
          day: nextDay,
          subjects: [
            {
              subject: "",
              teacher: "",
              startTime: "",
              endTime: "",
            },
          ],
        },
      ],
    }));
  };

  const removeDaySchedule = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.timeTableSchedule];
      updated.splice(index, 1);
      return { ...prev, timeTableSchedule: updated };
    });
  };

  const addSubjectEntry = (dayIndex: number) => {
    setFormData((prev) => {
      const updatedDays = [...prev.timeTableSchedule];
      const newSubject = {
        subject: "",
        teacher: "",
        startTime: "",
        endTime: "",
      };

      updatedDays[dayIndex] = {
        ...updatedDays[dayIndex],
        subjects: [...updatedDays[dayIndex].subjects, newSubject],
      };

      return { ...prev, timeTableSchedule: updatedDays };
    });
  };

  const removeSubjectEntry = (dayIndex: number, subjectIndex: number) => {
    setFormData((prev) => {
      const updated = [...prev.timeTableSchedule];
      updated[dayIndex].subjects.splice(subjectIndex, 1);
      return { ...prev, timeTableSchedule: updated };
    });
  };
  const handleSubjectChange = (
    dayIndex: number,
    subjectIndex: number,
    field: keyof SubjectEntry,
    value: string
  ) => {
    setFormData((prev) => {
      const updatedDays = [...prev.timeTableSchedule];
      updatedDays[dayIndex] = {
        ...updatedDays[dayIndex],
        subjects: updatedDays[dayIndex].subjects.map((subject, idx) =>
          idx === subjectIndex ? { ...subject, [field]: value } : subject
        ),
      };
      return { ...prev, timeTableSchedule: updatedDays };
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (): boolean => {
    // Validate top-level fields
    if (!formData.academicYear) {
      toast.error("Please select an academic year.");
      return false;
    }

    if (!formData.class) {
      toast.error("Please select a class.");
      return false;
    }

    if (!formData.division) {
      toast.error("Please select a division.");
      return false;
    }

    if (formData.timeTableSchedule.length === 0) {
      toast.error("Please add at least one day schedule.");
      return false;
    }

    for (
      let dayIndex = 0;
      dayIndex < formData.timeTableSchedule.length;
      dayIndex++
    ) {
      const daySchedule = formData.timeTableSchedule[dayIndex];

      if (!daySchedule.day) {
        toast.error(`Please select a day for schedule #${dayIndex + 1}.`);
        return false;
      }

      if (daySchedule.subjects.length === 0) {
        toast.error(
          `Please add at least one subject entry for ${
            daySchedule.day || "this day"
          }.`
        );
        return false;
      }

      for (
        let subjectIndex = 0;
        subjectIndex < daySchedule.subjects.length;
        subjectIndex++
      ) {
        const entry = daySchedule.subjects[subjectIndex];

        if (!entry.subject) {
          toast.error(
            `Please select a subject for ${daySchedule.day} (entry #${
              subjectIndex + 1
            }).`
          );
          return false;
        }
        if (!entry.teacher) {
          toast.error(
            `Please select a teacher for ${daySchedule.day} (entry #${
              subjectIndex + 1
            }).`
          );
          return false;
        }
        if (!entry.startTime) {
          toast.error(
            `Please enter a start time for ${daySchedule.day} (entry #${
              subjectIndex + 1
            }).`
          );
          return false;
        }
        if (!entry.endTime) {
          toast.error(
            `Please enter an end time for ${daySchedule.day} (entry #${
              subjectIndex + 1
            }).`
          );
          return false;
        }

        if (
          entry.startTime &&
          entry.endTime &&
          entry.startTime >= entry.endTime
        ) {
          toast.error(
            `End time must be after start time for ${daySchedule.day} (entry #${
              subjectIndex + 1
            }).`
          );
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const timetableData = {
        academicYear: formData.academicYear,
        class: formData.class,
        division: formData.division,
        timeTableSchedule: formData.timeTableSchedule.map((daySchedule) => ({
          day: daySchedule.day,
          subjects: daySchedule.subjects.map((entry) => ({
            subject: entry.subject,
            teacher: entry.teacher,
            startTime: entry.startTime,
            endTime: entry.endTime,
          })),
        })),
      };

      const response = await createTimetable(timetableData);

      if (response.success) {
        toast.success(response.message || "Timetable created successfully");
        navigate("/lookups/time-tables");
      } else {
        toast.error(response.message || "Failed to create timetable");
      }
    } catch (error: any) {
      console.error("Error creating timetable:", error);
      toast.error(
        error.message || "An error occurred while creating timetable"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4">
      <div className="flex flex-col md:flex-row justify-between items-center px-1 mb-3">
        <div>
          <h3 className="text-xl font-semibold mb-4">Add Time Table</h3>
          <div className="breadcrumb-section">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        <div className="header-btns">
          <button
            className="add-btn"
            onClick={() => navigate("/lookups/time-tables")}
          >
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
  <div className="flex flex-wrap -mx-2 mb-6">
    <div className="w-full md:w-1/3 px-2 mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Academic year <span className="text-red-500">*</span>
      </label>
      {/* <select
        name="academicYear"
        value={formData.academicYear}
        onChange={(e) =>
          setFormData({ ...formData, academicYear: e.target.value })
        }
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select Academic Year</option>
        {academicYears.map((year) => (
          <option key={year._id} value={year._id}>
            {year.academicYear}
          </option>
        ))}
      </select> */}
      <AcademicYearDropdown
        value={formData.academicYear}
        onChange={(value) => setFormData({ ...formData, academicYear: value })}
        required={true}
        disabled={false}
        />
    </div>
    <div className="w-full md:w-1/3 px-2 mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Class <span className="text-red-500">*</span>
      </label>
      <select
        name="class"
        value={formData.class}
        onChange={(e) =>
          setFormData({ ...formData, class: e.target.value })
        }
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select Class</option>
        {classes.map((cls) => (
          <option key={cls._id} value={cls._id}>
            {cls.name}
          </option>
        ))}
      </select>
    </div>
    <div className="w-full md:w-1/3 px-2 mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Division <span className="text-red-500">*</span>
      </label>
      <select
        name="division"
        value={formData.division}
        onChange={(e) =>
          setFormData({ ...formData, division: e.target.value })
        }
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select Division</option>
        {divisions.map((division) => (
          <option key={division._id} value={division._id}>
            {division.name}
          </option>
        ))}
      </select>
    </div>

    {formData.timeTableSchedule.map((daySchedule, dayIndex) => (
      <div key={dayIndex} className="w-full border border-gray-200 p-4 rounded-lg mb-6 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
        <div className="w-full md:w-1/2 px-2 mb-4">
  <label className="block text-gray-700 text-sm font-bold mb-2">
    Day <span className="text-red-500">*</span>
  </label>
  <div className="w-full p-3 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center space-x-3">
    <div className="p-2 bg-white rounded-lg shadow-xs">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    </div>
    <span className="font-medium text-indigo-900">
      {daySchedule.day}
    </span>
  </div>
</div>
<button
  type="button"
  onClick={() => removeDaySchedule(dayIndex)}
  className="flex items-center justify-center gap-2 bg-white border border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-600 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out shadow-sm hover:shadow-md active:scale-95"
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5" 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
  <span className="font-medium">Remove Day</span>
</button>
        </div>

        {daySchedule.subjects.map((entry, subjectIndex) => (
          <div
            key={subjectIndex}
            className="w-full border border-gray-200 p-4 rounded-lg mb-4 relative bg-white"
          >
        <div className="flex flex-col md:flex-row gap-4 mb-4">
  <div className="w-full md:w-1/3">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      Subject <span className="text-red-500">*</span>
    </label>
    <select
      value={entry.subject}
      onChange={(e) =>
        handleSubjectChange(
          dayIndex,
          subjectIndex,
          "subject",
          e.target.value
        )
      }
      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">Select Subject</option>
      {subjects.map((subject) => (
        <option key={subject._id} value={subject._id}>
          {subject.name}
        </option>
      ))}
    </select>
  </div>

  <div className="w-full md:w-1/3 ">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      Teacher <span className="text-red-500">*</span>
    </label>
    <select
      value={entry.teacher}
      onChange={(e) =>
        handleSubjectChange(
          dayIndex,
          subjectIndex,
          "teacher",
          e.target.value
        )
      }
      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">Select Teacher</option>
      {teachers.map((teacher) => (
        <option key={teacher._id} value={teacher._id}>
          {teacher.name}
        </option>
      ))}
    </select>
  </div>
</div>

            <div className="flex gap-4 mb-2">
              <div className="w-full md:w-1/3">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={entry.startTime}
                  onChange={(e) =>
                    handleSubjectChange(
                      dayIndex,
                      subjectIndex,
                      "startTime",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="w-full md:w-1/3">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={entry.endTime}
                  onChange={(e) =>
                    handleSubjectChange(
                      dayIndex,
                      subjectIndex,
                      "endTime",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
  type="button"
  onClick={() => removeSubjectEntry(dayIndex, subjectIndex)}
  className="absolute top-3 right-3 bg-transparent hover:bg-red-50 text-red-500 border border-red-500 hover:border-red-600 hover:text-red-600 rounded-full p-1 transition-colors duration-200"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
</button>
          </div>
        ))}
<button
  type="button"
  onClick={() => addSubjectEntry(dayIndex)}
  className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-400/30 active:scale-95"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
  <span className="font-semibold">Next Subject</span>
</button>
      </div>
    ))}

    <div className="w-full flex justify-between mt-4 me-4">
      <button
        type="button"
        onClick={addDaySchedule}
        className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-200 me-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add Next Day
      </button>
    </div>
  </div>

  <div className="flex justify-end space-x-4 items-center mt-6">
    <div className="flex space-x-3">
      <Link to={"/lookups/time-tables"}>
        <button
        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
        <FcCancel size={18} />
        Cancel
        </button>
      </Link>
      <button
        type="submit"
         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm hover:shadow-md disabled:opacity-70">
        <IoCheckmarkDoneCircleOutline size={18} />
        Submit
      </button>
    </div>
  </div>
</form>
    </div>
  );
};

export default AddTimeTable;
