import { fetchTimeTableById, UpdateTimeTable } from "@/api/admin-api/lookups-api/timeTableApi";
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
import { time } from "console";
import React, { useEffect, useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { TbArrowBackUp } from "react-icons/tb";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditTimeTable: React.FC = () => {

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();



  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "TimeTable", path: "/lookups/time-tables" },
    { label: "Add Timetable", path: "" },
  ];

  const [subjects, setSubjects] = useState<subjects[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [timetableData, setTimetableData] = useState<any>(null);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
const [isDataLoaded, setIsDataLoaded] = useState(false);


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
        day: "",
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
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // First fetch all dropdown data
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
      
      // Only then fetch the timetable data if ID exists
      if (id) {
        const response = await fetchTimeTableById(id);
        const timetable:any = response.data;
        setTimetableData(timetable);

        // Update formData with the fetched data
        setFormData({
          academicYear: timetable.academicYear.id,
          class: timetable.class.id,
          division: timetable.division.id,
          timeTableSchedule: timetable.timeTableSchedule.map((day: any) => ({
            day: day.day,
            subjects: day.subjects.map((subject: any) => ({
              subject: subject.subject._id,
              teacher: subject.teacher._id,
              startTime: subject.startTime,
              endTime: subject.endTime
            }))
          }))
        });
      }
      
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAllData();
}, [id]); 
  const handleDayChange = (index: number, value: string) => {
    const updated = [...formData.timeTableSchedule];
    updated[index].day = value;
    setFormData({ ...formData, timeTableSchedule: updated });
  };

  const addDaySchedule = () => {
    setFormData((prev) => ({
      ...prev,
      timeTableSchedule: [
        ...prev.timeTableSchedule,
        {
          day: "",
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
          `Please add at least one subject entry for ${daySchedule.day || "this day"
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
            `Please select a subject for ${daySchedule.day} (entry #${subjectIndex + 1
            }).`
          );
          return false;
        }
        if (!entry.teacher) {
          toast.error(
            `Please select a teacher for ${daySchedule.day} (entry #${subjectIndex + 1
            }).`
          );
          return false;
        }
        if (!entry.startTime) {
          toast.error(
            `Please enter a start time for ${daySchedule.day} (entry #${subjectIndex + 1
            }).`
          );
          return false;
        }
        if (!entry.endTime) {
          toast.error(
            `Please enter an end time for ${daySchedule.day} (entry #${subjectIndex + 1
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
            `End time must be after start time for ${daySchedule.day} (entry #${subjectIndex + 1
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

    if (!id) {
      toast.error("Timetable ID is missing.");
      return;
    }

    setLoading(true);

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

      const response = await UpdateTimeTable(id, timetableData);

      if (response.success) {
        toast.success(response.message || "Timetable Updated Successfully");
        navigate("/lookups/time-tables");
      } else {
        toast.error(response.message || "Failed to updated timetable");
      }
    } catch (error: any) {
      console.error("Error updated timetable:", error);
      toast.error(
        error.message || "An error occurred while updated timetable"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4">
      <div className="flex flex-col md:flex-row justify-between items-center px-1 mb-3">
        <div>
          <h3 className="text-xl font-semibold mb-4">Edit Time Table</h3>
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
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow">
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
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onChange={(value) =>
                setFormData({ ...formData, academicYear: value })
              }
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
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div key={dayIndex} className="w-full border p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Day <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={daySchedule.day}
                    onChange={(e) => handleDayChange(dayIndex, e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeDaySchedule(dayIndex)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                  style={{
                    borderRadius: "5px",
                    padding: "5px 10px",
                    height: "fit-content",
                  }}
                >
                  Remove Day
                </button>
              </div>

              {daySchedule.subjects.map((entry, subjectIndex) => (
                <div
                  key={subjectIndex}
                  className="w-full border p-4 rounded-lg mb-4 relative"
                >
                  <div className="mb-2">
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
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-2">
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
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-1/2">
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
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>

                    <div className="w-1/2">
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
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubjectEntry(dayIndex, subjectIndex)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      borderRadius: "5px",
                      padding: "2px 6px",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addSubjectEntry(dayIndex)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                + Add Subject to this Day
              </button>
            </div>
          ))}

          <div className="w-full flex justify-between mt-4">
            <button
              type="button"
              onClick={addDaySchedule}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              + Add Another Day
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-4 items-center">
          <div className="flex space-x-2">
            <button type="submit" className="submit-btn flex items-center">
              <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
              Submit
            </button>
            <Link to={"/lookups/time-tables"}>
              <button type="button" className="cancel-btn flex items-center">
                <FcCancel size={20} className="mr-2" />
                Cancel
              </button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditTimeTable;
