import { createGrade } from '@/api/admin-api/lookups-api/gradeApi';
import { AcademicYear, Classes, Division, ExamType, ExamTypeData, fetchAcademicYear, fetchClasses, fetchDdTotalMark, fetchDivisionsDD, fetchExamsDD, fetchExamTypeDataDD, getStudentsByClassDivisionAcademicYear, Student } from '@/api/common-api/commonDropDownApi';
import AcademicYearDropdown from '@/components/AcademicYearDropdown';
import Breadcrumb from '@/components/Breadcumb'
import React, { useEffect, useState } from 'react'
import { set } from 'react-datepicker/dist/date_utils';
import { FaCircleDot } from 'react-icons/fa6';
import { FcCancel } from 'react-icons/fc';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { TbArrowBackUp, TbPlus } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ExamEntry {
  exam: string;
  subject: string;
  subjectName: string;
  examType: string;
  examTypeName: string;
  totalMarks: number;
  marksObtained: number;
  remarks: string;
}

interface SelectedStudent {
  id: string;
  name: string;
  exams: ExamEntry[];
  totalMarksObtained: number;
  totalPercentage: number;
  grade: string;
}

interface SubjectItem {
  subject: {
    _id: string;
    name: string;
  };
  examType: {
    _id: string;
    name: string;
  };
  date: string;
  duration: string;
  marks: number;
  _id: string;
}

interface Exam {
  _id: string;
  name: string;
  class: string;
  division: string;
  academicYear: string;
  totalMarks: number;
  subjects: SubjectItem[];
  status: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

function AddGrade() {
  const [classOptions, setClassOptions] = useState<Classes[]>([]);
  const [academicOptions, setAcademicOptions] = useState<AcademicYear[]>([]);
  const [divisionOptions, setDivisionOptions] = useState<Division[]>([]);
  const [studentOptions, setStudentOptions] = useState<Student[]>([]);
  const [examOption, setExamOption] = useState<Exam[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<SelectedStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    academicYear: '',
    class: '',
    division: '',
  });

  const calculateGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  };

  const calculateStudentTotals = (student: SelectedStudent): SelectedStudent => {
    const totalMarks = student.exams.reduce((sum, exam) => sum + exam.totalMarks, 0);
    const totalMarksObtained = student.exams.reduce((sum, exam) => sum + exam.marksObtained, 0);
    const totalPercentage = totalMarks > 0 ? (totalMarksObtained / totalMarks) * 100 : 0;
    const grade = calculateGrade(totalPercentage);

    return {
      ...student,
      totalMarksObtained,
      totalPercentage,
      grade
    };
  };

  // Fetch dropdown data functions
  const getClassesDD = async () => {
    const response = await fetchClasses();
    if (response.success) {
      setClassOptions(response.data);
    } else {
      setClassOptions([]);
    }
  };

  const getAcademicYearDD = async () => {
    const response = await fetchAcademicYear();
    if (response.success) {
      setAcademicOptions(response.data);
    } else {
      setAcademicOptions([]);
    }
  };

  const getDivisionDD = async () => {
    const response = await fetchDivisionsDD();
    if (response.success) {
      setDivisionOptions(response.data);
    } else {
      setDivisionOptions([]);
    }
  };

  const getExamsDD = async () => {
    try {
      const response: any = await fetchExamsDD();
      if (response.success) {
        setExamOption(response.data);
      } else {
        setExamOption([]);
      }
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    }
  };

  const fetchStudents = async () => {
    if (formData.class && formData.division && formData.academicYear) {
      try {
        const response = await getStudentsByClassDivisionAcademicYear(
          formData.class,
          formData.division,
          formData.academicYear
        );

        if (response.success) {
          setStudentOptions(response.data);
        } else {
          setStudentOptions([]);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
        setStudentOptions([]);
      }
    } else {
      setStudentOptions([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [formData.class, formData.division, formData.academicYear]);

  useEffect(() => {
    getClassesDD();
    getAcademicYearDD();
    getDivisionDD();
    getExamsDD();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudents(prev => {
      // If the student is already selected, deselect them
      if (prev.some(s => s.id === student._id)) {
        return [];
      }

      // Otherwise, select only this student (replace any existing selection)
      return [
        {
          id: student._id,
          name: `${student.firstName} ${student.lastName}`,
          exams: [],
          totalMarksObtained: 0,
          totalPercentage: 0,
          grade: ''
        }
      ];
    });
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const handleExamChange = (studentIndex: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    if (!value) {
      // If no exam selected, clear the exams
      setSelectedStudents(prev => {
        const updated = [...prev];
        updated[studentIndex].exams = [];
        return updated.map(calculateStudentTotals);
      });
      return;
    }

    // Find the selected exam
    const selectedExam = examOption.find(exam => exam._id === value);
    if (!selectedExam) return;

    // Create exam entries for each subject in the selected exam
    const examEntries: ExamEntry[] = selectedExam.subjects.map(subject => ({
      exam: selectedExam._id,
      subject: subject.subject._id,
      subjectName: subject.subject.name,
      examType: subject.examType._id,
      examTypeName: subject.examType.name,
      totalMarks: subject.marks,
      marksObtained: 0,
      remarks: ""
    }));

    setSelectedStudents(prev => {
      const updated = [...prev];
      updated[studentIndex].exams = examEntries;
      return updated.map(calculateStudentTotals);
    });
  };

  const handleMarksChange = (studentIndex: number, examIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSelectedStudents(prev => {
      const updated = [...prev];
      updated[studentIndex].exams[examIndex] = {
        ...updated[studentIndex].exams[examIndex],
        [name]: Number(value)
      };
      return updated.map(calculateStudentTotals);
    });
  };

  const handleRemarksChange = (studentIndex: number, examIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setSelectedStudents(prev => {
      const updated = [...prev];
      updated[studentIndex].exams[examIndex] = {
        ...updated[studentIndex].exams[examIndex],
        remarks: value
      };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const grades = selectedStudents.map(student => ({
        student: student.id,
        exams: student.exams.map(exam => ({
          exam: exam.exam,
          subject: exam.subject,
          examType: exam.examType,
          totalMarks: exam.totalMarks,
          marksObtained: exam.marksObtained,
          remarks: exam.remarks
        })),
        totalMarksObtained: student.totalMarksObtained,
        totalPercentage: student.totalPercentage,
        grade: student.grade
      }));

      const payload: any = {
        academicYear: formData.academicYear,
        class: formData.class,
        division: formData.division,
        grades
      };

      const response = await createGrade(payload);
      if (response.success) {
        toast.success(response.message);
        navigate(-1);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to create grade");
      console.error(error);
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Grade", path: "/lookups/fee-structures" },
    { label: "Add Grade", path: "" },
  ];

  // Filter students based on search term
  const filteredStudents = studentOptions.filter(student => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const rollNumber = student.rollNumber?.toLowerCase() || '';
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      rollNumber.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto p-2">
    {/* Header Section */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Add Grade</h2>
          <div className="breadcrumb-section">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        <div className="mt-2">
          <button className="add-btn" onClick={() => navigate(-1)}>
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className='flex flex-col'>
          <div className="flex flex-wrap -mx-2 mt-4">
            {/* Academic Year - Full width on mobile, 1/3 on md+ */}
            <div className="w-full md:w-1/3 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Academic Year <span className="text-red-500">*</span>
              </label>
              {/* <select
                name="academicYear"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.academicYear}
                onChange={handleChange}
                required
              >
                <option value="">Select Year</option>
                {academicOptions.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.academicYear}
                  </option>
                ))}
              </select> */}
              <AcademicYearDropdown
                value={formData.academicYear}
                onChange={(value) => setFormData({ ...formData, academicYear: value })}
                required
               
              />
            </div>

            {/* Class - Full width on mobile, 1/3 on md+ */}
            <div className="w-full md:w-1/3 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                name="class"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.class}
                onChange={handleChange}
                required
              >
                <option value="">Select Class</option>
                {classOptions.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Division - Full width on mobile, 1/3 on md+ */}
            <div className="w-full md:w-1/3 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Division <span className="text-red-500">*</span>
              </label>
              <select
                name="division"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.division}
                onChange={handleChange}
                required
              >
                <option value="">Select Division</option>
                {divisionOptions.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {studentOptions.length > 0 && (
            <div className="mb-6 bg-white rounded-lg shadow-md p-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Select Students</h4>

              {/* Searchable dropdown */}
              <div className="relative mb-4">
                <div className="flex items-center border border-gray-300 rounded-lg p-2">
                  <input
                    type="text"
                    placeholder="Search students by name or roll number..."
                    className="flex-grow p-2 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsDropdownOpen(true)}
                  />
                  <button
                    type="button"
                    className="ml-2 p-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {isDropdownOpen ? '▲' : '▼'}
                  </button>
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <div
                          key={student._id}
                          className={`p-3 hover:bg-gray-100 cursor-pointer flex items-center ${selectedStudents.some(s => s.id === student._id) ? 'bg-blue-50' : ''
                            }`}
                          onClick={() => handleStudentSelect(student)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedStudents.some(s => s.id === student._id)}
                            readOnly
                            className="mr-3 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div>
                            <div className="font-medium">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Roll No: {student.rollNumber || 'N/A'}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500">No students found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected student display */}
              {selectedStudents.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium mb-2">Selected Student:</h5>
                  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium">
                      {selectedStudents[0].name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedStudents([])}
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedStudents.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Enter Exam Details</h4>
              {selectedStudents.map((student, studentIndex) => (
                <div key={student.id} className="mb-8 border border-gray-200 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="flex items-center gap-2 font-bold text-lg text-gray-800">
                      <FaCircleDot className="text-blue-500" /> {student.name}
                    </h5>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Exam <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={student.exams.length > 0 ? student.exams[0].exam : ''}
                      onChange={(e) => handleExamChange(studentIndex, e)}
                      required
                    >
                      <option value="">Select Exam</option>
                      {examOption.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {student.exams.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks Obtained</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {student.exams.map((exam, examIndex) => (
                            <tr key={examIndex}>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100"
                                  value={exam.subjectName}
                                  readOnly
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100"
                                  value={exam.examTypeName}
                                  readOnly
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100"
                                  value={exam.totalMarks}
                                  readOnly
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  name="marksObtained"
                                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  value={exam.marksObtained}
                                  onChange={(e) => handleMarksChange(studentIndex, examIndex, e)}
                                  required
                                  min="0"
                                  max={exam.totalMarks}
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  value={exam.remarks}
                                  onChange={(e) => handleRemarksChange(studentIndex, examIndex, e)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Total Marks Obtained</p>
                      <p className="text-xl font-semibold text-blue-700">{student.totalMarksObtained.toFixed(2)}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Total Percentage</p>
                      <p className="text-xl font-semibold text-green-700">{student.totalPercentage.toFixed(2)}%</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Grade</p>
                      <p className="text-xl font-semibold text-purple-700">{student.grade}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 items-center mt-6">
          <div className="flex space-x-2">
            <button
              type="button"
             className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm "
              onClick={() => navigate(-1)}
            >
              <FcCancel size={20} className="mr-2" />
              Cancel
            </button>
             <button
            type="submit"
            className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm hover:shadow-md cursor-pointer ${
              (selectedStudents.length === 0 || selectedStudents.some(s => s.exams.length === 0)) 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
            disabled={selectedStudents.length === 0 || selectedStudents.some(s => s.exams.length === 0)}
          >
            <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
            Submit
          </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddGrade;