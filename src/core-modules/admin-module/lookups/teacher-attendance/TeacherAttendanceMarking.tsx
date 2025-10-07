import { attendanceType, Class } from '@/api/admin-api/student-management/students-api/studentsApi'
import { AttendanceDTO, createAttendance, fetchAttendance } from '@/api/admin-api/lookups-api/teachersAttendanceApi'
import { AttendanceStatusType, AttendanceType, Division, fetchAcademicYear, fetchAttendanceStatusDd, fetchAttendanceTypeDd, fetchClasses, fetchDivisionsDD, fetchTeachers, getStudentsByClassDivisionAcademicYear } from '@/api/common-api/commonDropDownApi'
import Breadcrumb from '@/components/Breadcumb'
import React, { useEffect, useState } from 'react'
import { AiFillCaretUp } from 'react-icons/ai'
import { RiPlayListAddFill } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import MessagePopup, { MessageType } from "@/components/MessagePopup";
import AcademicYearDropdown from '@/components/AcademicYearDropdown'
interface PeriodwiseField {
  period: number;
  time: string;
  subject: string;
  teacher: string;
}


interface AttendanceMarked  {
  morning: boolean;
  afternoon: boolean;
}
interface teacherStatus {
  status: AttendanceStatusType | null;
  code?: string; // Add roll number to the status object
}
type teacherStatusMapType = {
  [teacherId: string]: teacherStatus | null;
};


const TeacherAttendanceMarking: React.FC = () => {
  const ATTENDANCE_TYPE_MAP = {
    FULL_DAY: 'fullday',
    HALF_DAY: 'halfday',
    PERIODWISE: 'periodwise'
  };


  interface AttendanceRecord {
  _id: string;
  halfDayTimes?: {
    firstHalf?: string;
    secondHalf?: string;
  };
  teachers: Array<{
    firstHalfStatus: string | null;
    secondHalfStatus: string | null;
  }>;
  date: string;
}




  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [attendanceTypes, setAttendanceTypes] = useState<AttendanceType[]>([]);
  const [attendanceStatuses, setAttendanceStatuses] = useState<AttendanceStatusType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [teacherStatusMap, setteacherStatusMap] = useState<teacherStatusMapType>({});
  const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});
  const [halfDaySelection, setHalfDaySelection] = useState("")
  const [teacherRemarks, setteacherRemarks] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    academicYear: "",
    // class: "",
    // division: "",
    attendanceType: "",
    date: "",
    halfDayTimes: {
      firstHalf: "morning",
      secondHalf: "",
    },
    periodwiseFields: [] as PeriodwiseField[]
  });
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [existingAttendance, setExistingAttendance] = useState<AttendanceRecord[]>([]);
const [attendanceMarked, setAttendanceMarked] = useState<AttendanceMarked>({
  morning: false,
  afternoon: false
});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Teacher Attendance Marking", path: "" },
  ];


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [academicYearData, classesData, divisionsData, attendanceTypeData, attendanceStatusData] = await Promise.all([
          fetchAcademicYear(),
          fetchClasses(),
          fetchDivisionsDD(),
          fetchAttendanceTypeDd(),
          fetchAttendanceStatusDd(),
          fetchTeachers()
        ]);
        setAcademicYears(academicYearData.data);
        setClasses(classesData.data);
        setDivisions(divisionsData.data);
        setAttendanceTypes(attendanceTypeData.data);
        setAttendanceStatuses(attendanceStatusData.data);

        
        
//         if (academicYearData.data?.length) {
//           const currentYear = academicYearData.data.find((year) => {
//             if (!year.academicYear) return false;
//             return year.academicYear.includes(new Date().getFullYear().toString());
//           });
//  console.log("setAttendanceList",setAttendanceList);
//           if (currentYear?._id) {
//             setFormData(prev => ({
//               ...prev,
//               academicYear: currentYear._id
//             }));
//           }
//         }
      } catch (error) {
        console.error("Failed to load required data:", error);
      }
    }
    fetchData();
  }, []);


  const handleFilter = async () => {
    // if (!formData.class || !formData.division || !formData.academicYear) {
    //   setMessage({
    //     text: "Please select both class and division",
    //     type: "error",
    //   });
    //   return;
    // }
    setFormSubmitted(true);
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchTeachers();
      const attendanceData = response.data || [];
      setAttendanceList(attendanceData);
    } catch (err: any) {
      console.error("Failed to fetch timetable", err);
      setError(err.message || "Failed to fetch timetable");
      setAttendanceList([]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleAttendanceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const type = attendanceTypes.find(t => t._id === selectedId);


    setFormData({
      ...formData,
      attendanceType: selectedId,
      halfDayTimes: { firstHalf: "", secondHalf: "" },
      periodwiseFields: []
    });
  };


  const handleHalfDayTimeChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'firstHalf' | 'secondHalf') => {
    setFormData({
      ...formData,
      halfDayTimes: {
        ...formData.halfDayTimes,
        [field]: e.target.value
      }
    });
  };


  // const handleHalfDaySelect = (teacherId, part, status) => {
  //   setteacherStatusMap((prev) => ({
  //     ...prev,
  //     [teacherId]: {
  //       ...prev[teacherId],
  //       [part]: prev[teacherId]?.[part]?._id === status._id ? null : status,
  //     },
  //   }));
  // };




  const addPeriodwiseField = () => {
    setFormData({
      ...formData,
      periodwiseFields: [
        ...formData.periodwiseFields,
        { period: formData.periodwiseFields.length + 1, time: "", subject: "", teacher: "" }
      ]
    });
  };


  const handlePeriodwiseChange = (index: number, field: keyof PeriodwiseField, value: string) => {
    const updatedFields = [...formData.periodwiseFields];
    updatedFields[index] = {
      ...updatedFields[index],
      [field]: field === 'period' ? parseInt(value) : value
    };
    setFormData({
      ...formData,
      periodwiseFields: updatedFields
    });
  };


  const removePeriodwiseField = (index: number) => {
    const updatedFields = formData.periodwiseFields.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      periodwiseFields: updatedFields
    });
  };


  const getCurrentAttendanceType = () => {
    return attendanceTypes.find(t => t._id === formData.attendanceType);
  };


  const handleRemarksChange = (teacherId: string, remarks: string) => {
    setteacherRemarks(prev => ({
      ...prev,
      [teacherId]: remarks
    }));
  };




  console.log("Payload teachers with Remarks:", attendanceList.map(teacher => ({
    teacher: teacher._id,
    code: teacher.code,
    attendanceRemarks: teacherRemarks[teacher._id] || '',
  })));


 const handleSingleSelect = (teacherId: string | number, status: AttendanceStatusType) => {
  const teacher = attendanceList.find(s => s._id === teacherId);
  setteacherStatusMap((prev) => ({
    ...prev,
    [teacherId]: {
      status: prev[teacherId]?.status?._id === status._id ? null : status,
      code: teacher?.code
    },
  }));
};


  const handleHalfDayChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      halfDayTimes: {
        ...prev.halfDayTimes, 
  firstHalf: value === 'morning' ? 'morning' : '',
      secondHalf: value === 'afternoon' ? 'afternoon' : '',
      }
    }));
  };




  const [message, setMessage] = useState<{
    text: string;
    type: MessageType;
  } | null>(null);


  const handleSubmit = async () => {
    if (!formData.academicYear || !formData.date || !formData.attendanceType) {
      setMessage({
        text: "Please fill all required fields",
        type: "error",
      });
      return;
    }

 const selectedType = attendanceTypes.find(t => t._id === formData.attendanceType);
    if (!selectedType) {
      setMessage({
        text: "Invalid attendance type selected",
        type: "error",
      });
      return;
    }
     if (selectedType.nameAlias === ATTENDANCE_TYPE_MAP.HALF_DAY) {
      if (formData.halfDayTimes.firstHalf && formData.halfDayTimes.secondHalf) {
        setMessage({
          text: "Please select only one half (either first or second) for half-day attendance",
          type: "error",
        });
        return;
      }
      
      if (!formData.halfDayTimes.firstHalf && !formData.halfDayTimes.secondHalf) {
        setMessage({
          text: "Please select either first or second half for half-day attendance",
          type: "error",
        });
        return;
      }
    }


    const submissionData: AttendanceDTO = {
      academicYear: formData.academicYear,
    //   class: formData.class,
    //   division: formData.division,
      attendanceType: selectedType._id,
      date: formData.date,
      teachers: attendanceList.map(teacher => {
        const baseData = {
          teacher: teacher._id,
          code: teacher.code,
          attendanceRemarks: remarksMap[String(teacher._id)] || "",
          remarks: remarksMap[teacher._id] || "",
        }


        if (selectedType.nameAlias === ATTENDANCE_TYPE_MAP.HALF_DAY) {
          if (formData.halfDayTimes.firstHalf === 'morning') {
            return {
              ...baseData,
              firstHalfStatus: teacherStatusMap[teacher._id]?.status?._id || undefined,
              secondHalfStatus: undefined
            }
          } else if (formData.halfDayTimes.secondHalf === 'afternoon') {
            return {
              ...baseData,
              firstHalfStatus: undefined,
              secondHalfStatus: teacherStatusMap[teacher._id]?.status?._id || undefined
            }
          }
        }

   
        return {
          ...baseData,
          fullDayStatus: teacherStatusMap[teacher._id]?.status?._id || undefined
        }
      }),
      ...(selectedType.nameAlias === ATTENDANCE_TYPE_MAP.HALF_DAY && {
        halfDayTimes: {
          firstHalf: formData.halfDayTimes.firstHalf === 'morning' ? 'morning' : undefined,
          secondHalf: formData.halfDayTimes.secondHalf === 'afternoon' ? 'afternoon' : undefined
        }
      }),
      createdBy: '',
      data: undefined
    };


    try {
      const response = await createAttendance(submissionData);
      setMessage({
        text: response.message || "Attendance created successfully",
        type: "success",
      });
      setFormData({
        academicYear: "",
        // class: "",
        // division: "",
        attendanceType: "",
        date: "",
        halfDayTimes: {
          firstHalf: "",
          secondHalf: "",
        },
        periodwiseFields: [],
      });
      setteacherStatusMap({});
      setAttendanceList([]);
      setteacherRemarks({});
      setRemarksMap({});
      setSelectedStatus(null);
      setSelectedStatuses([]);
    } catch (error) {
      setMessage({
        text: "Failed to submit attendance",
        type: "error",
      });
    }
  };


  useEffect(() => {
    let isMounted = true;
   
    const checkAttendance = async () => {
      if (!formData.date ) return;
     
      try {
        setIsLoading(true);
        setError(null);
       
        const existingResponse = await fetchAttendance(
        //   formData.class,
        //   formData.division,
          formData.date,
          formData.date
        );


        if (!isMounted) return;


        const existingRecords = existingResponse.data?.data || [];


          setExistingAttendance(existingRecords);


         const hasMorningRecord = existingRecords.some((record: { halfDayTimes: { firstHalf: string }; teachers: any[] }) =>
        record.halfDayTimes?.firstHalf === 'morning' &&
        record.teachers.some((teacher: { firstHalfStatus: null }) => teacher.firstHalfStatus !== null)
      );


      const hasAfternoonRecord = existingRecords.some((record: { halfDayTimes: { secondHalf: string }; teachers: any[] }) =>
        record.halfDayTimes?.secondHalf === 'afternoon' &&
        record.teachers.some((teacher: { secondHalfStatus: null }) => teacher.secondHalfStatus !== null)
      );


      setAttendanceMarked({
        morning: hasMorningRecord,
        afternoon: hasAfternoonRecord
      });


    } catch (err) {
      if (isMounted) {
        setError('Failed to check existing attendance');
        console.error("Error checking attendance:", err);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };


  checkAttendance();


    return () => {
      isMounted = false;
    };
  }, [formData.date]);


  const bothMarked = attendanceMarked.morning && attendanceMarked.afternoon;

const areAllPresent = () => {
  if (attendanceList.length === 0) return false;
  
  const presentStatus = attendanceStatuses.find(s => s.name.toLowerCase() === 'present');
  if (!presentStatus) return false;

  return attendanceList.every(teacher => 
    teacherStatusMap[teacher._id]?.status?._id === presentStatus._id
  );
};

const handleMarkAllPresent = (e: React.ChangeEvent<HTMLInputElement>) => {
  const presentStatus = attendanceStatuses.find(s => s.name.toLowerCase() === 'present');
  if (!presentStatus) return;

  const newStatusMap = {...teacherStatusMap};
  const newRemarksMap = {...remarksMap};

  if (e.target.checked) {
    attendanceList.forEach(teacher => {
      newStatusMap[teacher._id] = {
        status: presentStatus,
        code: teacher.code 
      };
      delete newRemarksMap[teacher._id];
    });
  } else {
    attendanceList.forEach(teacher => {
      delete newStatusMap[teacher._id];
    });
  }

  setteacherStatusMap(newStatusMap);
  setRemarksMap(newRemarksMap);
};


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {message && (
        <MessagePopup
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
          duration={4000}
        />
      )}
      <div className="flex flex-col md:flex-row justify-start items-center px-1 mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Teacher Attendance Marking</h2>
          <div className="mt-1">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
      </div>


      <div className="flex flex-wrap gap-4 mb-4">
        {/* Academic Year Dropdown */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Academic Year <span className="text-red-500">*</span>
          </label>
          {/* <select
            style={{ padding: "10.5px" }}
            value={formData.academicYear}
            onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Academic Year</option>
            {academicYears.map((academic) => (
              <option key={academic._id} value={academic._id}>
                {academic.academicYear}
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


        {/* Class Dropdown */}
        {/* <div className="flex-1 min-w-[200px]">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Class <span className="text-red-500">*</span>
          </label>
          <select
            style={{ padding: "10.5px" }}
            value={formData.class}
            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
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


        {/* Division Dropdown */}
        {/* <div className="flex-1 min-w-[200px]">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Division <span className="text-red-500">*</span>
          </label>
          <select
            style={{ padding: "10.5px" }}
            value={formData.division}
            onChange={(e) => setFormData({ ...formData, division: e.target.value })}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Division</option>
            {divisions.map((division) => (
              <option key={division._id} value={division._id}>
                {division.name}
              </option>
            ))}
          </select>
        </div>  */}


        {/* Date Input */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
             max={new Date().toISOString().split('T')[0]}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ padding: "10.5px" }}
            required
          />
        </div>


        {/* Attendance Type Dropdown */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Attendance Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.attendanceType}
            onChange={handleAttendanceTypeChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
            style={{ padding: "10.5px" }}
            required
          >
            <option value="">Select Type</option>
            {attendanceTypes.slice(1, 2).map((type) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>


        {/* Go Button */}
        <div className="flex items-end">
          <button
  className={`px-4 py-4 rounded text-white transition
    ${bothMarked ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`}
  onClick={handleFilter}
  disabled={bothMarked}
>
  Go
</button>
        </div>
      </div>


      {/* Half Day Fields */}
      {formSubmitted && getCurrentAttendanceType()?.nameAlias === ATTENDANCE_TYPE_MAP.HALF_DAY && (
  <div className="mb-6 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
    <div className="flex items-center mb-4">
      <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-semibold text-gray-800">Select Half Day</h3>
    </div>


   
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Morning Option */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">First Half</label>
        <label className={`flex items-center p-4 space-x-3 min-h-[100px] border-2 rounded-lg cursor-pointer transition-all duration-200 ${formData.halfDayTimes?.firstHalf === 'morning' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
          <div className={`p-2 rounded-full ${formData.halfDayTimes?.firstHalf === 'morning' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <span className="block font-medium text-gray-800">Morning</span>
            <span className="block text-xs text-gray-500 mt-1">8:00 AM - 12:00 PM</span>
            {attendanceMarked.morning && (
                <span className="block text-xs text-red-500 mt-1">Already marked</span>
              )}
          </div>
          <input
            type="radio"
            name="halfDay"
            value="morning"
            checked={formData.halfDayTimes?.firstHalf === 'morning'}
            onChange={() => handleHalfDayChange('morning')}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500"
            disabled={attendanceMarked.morning}
          />
        </label>
      </div>


      {/* Afternoon Option */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Second Half</label>
        <label className={`flex items-center p-4 space-x-3 min-h-[100px] border-2 rounded-lg cursor-pointer transition-all duration-200 ${formData.halfDayTimes?.secondHalf === 'afternoon' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
          <div className={`p-2 rounded-full ${formData.halfDayTimes?.secondHalf === 'afternoon' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <div className="flex-1">
            <span className="block font-medium text-gray-800">Afternoon</span>
            <span className="block text-xs text-gray-500 mt-1">1:00 PM - 5:00 PM</span>
            {attendanceMarked.afternoon && (
                <span className="block text-xs text-red-500 mt-1">Already marked</span>
              )}
          </div>
          <input
            type="radio"
            name="halfDay"
            value="afternoon"
            checked={formData.halfDayTimes?.secondHalf === 'afternoon'}
            onChange={() => handleHalfDayChange('afternoon')}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500"
            disabled={attendanceMarked.afternoon}
          />
        </label>
      </div>
    </div>
  </div>
)}
<div className='flex justify-end mb-4'>
<div className="flex items-center gap-3 p-1.5 pl-2 pr-3 bg-white border border-green-500 rounded-lg shadow-xs hover:bg-gray-50 transition-colors cursor-pointer">
  <input
    type="checkbox"
    checked={areAllPresent()}
    onChange={handleMarkAllPresent}
    className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-500 rounded cursor-pointer"
  />
  <div className="flex items-center gap-1.5 group">
    <span className="text-sm font-medium text-green-700 group-hover:text-gray-900">
      All present
    </span>
    <AiFillCaretUp className="text-green-500 text-xs transition-transform group-hover:translate-y-[-1px]" />
  </div>
</div>
            </div>
      {/* Periodwise Fields
        {getCurrentAttendanceType()?.code === ATTENDANCE_TYPE_MAP.PERIODWISE && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Periodwise Attendance</h3>
              <button
                type="button"
                onClick={addPeriodwiseField}
                className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
              >
                + Add Period
              </button>
            </div>


            {formData.periodwiseFields.map((field, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md relative">
                <button
                  type="button"
                  onClick={() => removePeriodwiseField(index)}
                  className="absolute top-2 right-2 text-red-500 text-sm"
                >
                  × Remove
                </button>
               
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Period</label>
                    <input
                      type="number"
                      value={field.period}
                      onChange={(e) => handlePeriodwiseChange(index, 'period', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Time</label>
                    <input
                      type="time"
                      value={field.time}
                      onChange={(e) => handlePeriodwiseChange(index, 'time', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
               
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Subject</label>
                    <input
                      type="text"
                      value={field.subject}
                      onChange={(e) => handlePeriodwiseChange(index, 'subject', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Teacher</label>
                    <input
                      type="text"
                      value={field.teacher}
                      onChange={(e) => handlePeriodwiseChange(index, 'teacher', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          */}






      {/* Attendance Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50 sticky top-0 z-10">
      <tr>
        {[
          { name: "Sl No.", width: "w-16" },
          { name: "Code" },
          { name: "Name" },
          { name: "Attendance",
           },
          { name: "Remarks" }
        ].map((header) => (
          <th
            key={header.name}
            className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.width || ''}`}
          >
            <div className="flex items-center gap-1">
              {header.name}
              <AiFillCaretUp className="text-gray-400 text-xs" />
            </div>
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
  {bothMarked ? (
    <tr>
      <td colSpan={6} className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 font-medium">
          Attendance has already been marked for both morning and afternoon on this date.
        </p>
      </td>
    </tr>
  ) : isLoading ? (
    <tr>
      <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        </div>
      </td>
    </tr>
  ) : error ? (
    <tr>
      <td colSpan={6} className="px-4 py-4 text-center text-red-500 font-medium">
        {error}
      </td>
    </tr>
  ) : attendanceList.length === 0 ? (
    <tr>
      <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
        Please provide admission year, class and division
      </td>
    </tr>
  ) : (
    attendanceList.map((teacher, index) => (
      <tr key={teacher._id}>
        <td className="px-4 py-3 text-sm text-gray-500">
          {index + 1}
        </td>
        <td className="px-4 py-3 text-sm font-medium text-gray-900">
          {teacher.code}
        </td>
        <td className="px-4 py-3 text-sm text-gray-900 capitalize">
          {teacher.name}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          <div className="flex flex-wrap gap-2">
            {attendanceStatuses.map((status) => {
              const isSelected = teacherStatusMap[teacher._id]?.status?._id === status._id;
              const isAbsent = status.name.toLowerCase() === 'absent';


              return (
                <button
                  key={`${teacher._id}_${status._id}`}
                  type="button"
                  onClick={() => handleSingleSelect(teacher._id, status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 border
                    ${isSelected
                      ? isAbsent
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-green-600 text-white border-green-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                >
                  {status.name}
                </button>
              );
            })}
          </div>
        </td>
        <td>
          {teacherStatusMap[teacher._id]?.status?.name.toLowerCase() === 'absent' && (
            <input
              type="text"
              className="border p-1 rounded w-full"
              value={remarksMap[teacher._id] || ''}
              onChange={(e) =>
                setRemarksMap((prev) => ({
                  ...prev,
                  [teacher._id]: e.target.value,
                }))
              }
            />
          )}
        </td>
      </tr>
    ))
  )}
</tbody>
  </table>
</div>
      {/* Submit Button */}
      <div className="flex justify-end mt-4">
      <button
    onClick={() => {
      // Reset form or navigate away
      setFormData({
        academicYear: "",
        attendanceType: "",
        date: "",
        halfDayTimes: {
          firstHalf: "",
          secondHalf: "",
        },
        periodwiseFields: [],
      });
      setteacherStatusMap({});
      setAttendanceList([]);
      setteacherRemarks({});
      setRemarksMap({});
      setSelectedStatus(null);
      setSelectedStatuses([]);
    }}
    className="px-6 py-2 me-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
  >
    Cancel
  </button>
  <button
    onClick={handleSubmit}
    className={`px-6 py-2 me-2 rounded ${
      formData.academicYear &&
    //   formData.class &&
    //   formData.division &&
      formData.date &&
      formData.attendanceType &&
       !bothMarked
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-gray-400 text-gray-700 cursor-not-allowed'
    }`}
  disabled={
  !(formData.academicYear &&
    formData.date &&
    formData.attendanceType)
  || bothMarked
}
  >
    Submit Attendance
  </button>
</div>
    </div>
  );
};


export default TeacherAttendanceMarking;
