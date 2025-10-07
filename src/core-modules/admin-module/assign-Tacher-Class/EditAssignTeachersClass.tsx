import React, { useEffect, useState } from 'react'
import { updateAssignedTeacherClass, getAssignedTeacherById  } from '@/api/admin-api/lookups-api/assignTeachersClassApi'
import {
    AcademicYear,
    Division,
    fetchAcademicYear,
    fetchClasses,
    fetchDivisionsDD,
    fetchTeachers,
    fetchSubjects,
    subjects
} from "@/api/common-api/commonDropDownApi";
import Breadcrumb from '@/components/Breadcumb';
import { TbArrowBackUp } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import AcademicYearDropdown from '@/components/AcademicYearDropdown';
import { toast } from 'react-toastify';
import { MdOutlineCancel } from 'react-icons/md';
 
function EditAssignTeachersClass() {
    const navigate = useNavigate();
     const { id } = useParams();
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [allSubjects, setAllSubjects] = useState<subjects[]>([]);

    const [formData, setFormData] = React.useState({
        teacherId: "",
        academicYear: "",
        assignments: [{
            class: "",
            division: "",
            subjects: [] as string[],
            isClassTeacher: false
        }],
    });

 useEffect(() => {
        const fetchData = async () => {
            try {
                const [academicYearData, classesData, divisionsData, teachersData, subjectsData] = await Promise.all([
                    fetchAcademicYear(),
                    fetchClasses(),
                    fetchDivisionsDD(),
                    fetchTeachers(),
                    fetchSubjects()
                ]);
                setAcademicYears(academicYearData.data);
                setTeachers(teachersData.data);
                setClasses(classesData.data);
                setAllSubjects(subjectsData.data);
                setDivisions(divisionsData.data);

                let defaultAcademicYear = '';
                if (academicYearData.data?.length) {
                    const currentYear = academicYearData.data.find((year) => {
                        if (!year.academicYear) return false;
                        return year.academicYear.includes(new Date().getFullYear().toString());
                    });
                    defaultAcademicYear = currentYear?._id || '';
                }

                // Only after dropdown data is set, fetch the assigned teacher data if ID exists
                if (id) {
                    const response: any = await getAssignedTeacherById(id);
                    if (response.success) {
                        const data = response.data;
                        
                        // Find which assignment is the class teacher assignment
                        const assignments = data.assignments.map((assignment: any) => {
                            const isClassTeacher = data.isClassTeacher && 
                                assignment.class === data.classTeacherOf?.class?._id && 
                                assignment.division === data.classTeacherOf?.division?._id;
                            
                            return {
                                class: assignment.class._id || assignment.class,
                                division: assignment.division._id || assignment.division,
                                subjects: assignment.subjects.map((sub: any) => sub._id || sub),
                                isClassTeacher: isClassTeacher
                            };
                        });

                        setFormData({
                            teacherId: data.teacher._id,
                            academicYear: data.academicYear._id || defaultAcademicYear,
                            assignments: assignments
                        });
                    } else {
                        toast.error(response.message || "Failed to fetch assigned teacher data");
                        setFormData(prev => ({
                            ...prev,
                            academicYear: defaultAcademicYear
                        }));
                    }
                } else {
                    setFormData(prev => ({
                        ...prev,
                        academicYear: defaultAcademicYear
                    }));
                }
            } catch (error) {
                console.error("Failed to load data:", error);
                toast.error("Failed to load required data");
            }
        };
        
        fetchData();
    }, [id]);
 

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Teachers Classes", path: "/lookups/assign-teacher-class" },
        { label: "Edit Teachers Classes", path: "" },
    ];

    const handleAssignmentChange = (index: number, field: string, value: string | boolean) => {
        const updatedAssignments = [...formData.assignments];
        
        // If toggling class teacher, ensure only one assignment is marked as class teacher
        if (field === 'isClassTeacher' && value === true) {
            updatedAssignments.forEach((assignment, i) => {
                if (i !== index) {
                    assignment.isClassTeacher = false;
                }
            });
        }

        updatedAssignments[index] = {
            ...updatedAssignments[index],
            [field]: value
        };

        // Reset subjects when class or division changes
        if (field === 'class' || field === 'division') {
            updatedAssignments[index].subjects = [];
        }

        setFormData({
            ...formData,
            assignments: updatedAssignments
        });
    };

    const handleSubjectSelection = (index: number, subjectId: string) => {
        const updatedAssignments = [...formData.assignments];
        const assignment = updatedAssignments[index];

        // Toggle subject selection
        const subjectIndex = assignment.subjects.indexOf(subjectId);
        if (subjectIndex === -1) {
            assignment.subjects.push(subjectId);
        } else {
            assignment.subjects.splice(subjectIndex, 1);
        }

        setFormData({
            ...formData,
            assignments: updatedAssignments
        });
    };

    const addNewAssignment = () => {
        setFormData({
            ...formData,
            assignments: [
                ...formData.assignments,
                { class: "", division: "", subjects: [], isClassTeacher: false }
            ]
        });
    };

    const removeAssignment = (index: number) => {
        const updatedAssignments = [...formData.assignments];
        updatedAssignments.splice(index, 1);
        setFormData({
            ...formData,
            assignments: updatedAssignments
        });
    };

    const removeSubject = (assignmentIndex: number, subjectId: string) => {
        const updatedAssignments = [...formData.assignments];
        const subjects = updatedAssignments[assignmentIndex].subjects;
        const subjectIndex = subjects.indexOf(subjectId);

        if (subjectIndex !== -1) {
            subjects.splice(subjectIndex, 1);
            setFormData({
                ...formData,
                assignments: updatedAssignments
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form data
        if (!formData.teacherId || !formData.academicYear) {
            toast.error("Please fill all required fields");
            return;
        }

        if (formData.assignments.some(a => !a.class || !a.division || a.subjects.length === 0)) {
            toast.error("Please complete all assignment fields");
            return;
        }

        try {
            // Find the class teacher assignment if any
            const classTeacherAssignment = formData.assignments.find(a => a.isClassTeacher);
            
            const payload: any = {
                teacher: formData.teacherId,
                academicYear: formData.academicYear,
                assignments: formData.assignments.map(a => ({
                    class: a.class,
                    division: a.division,
                    subjects: a.subjects
                })),
                isClassTeacher: !!classTeacherAssignment,
                classTeacherOf: classTeacherAssignment ? {
                    class: classTeacherAssignment.class,
                    division: classTeacherAssignment.division
                } : undefined
            };

            const response = await updateAssignedTeacherClass(id ?? '', payload);
            if (response.success) {
                toast.success("Teacher assigned successfully!");
                navigate("/lookups/assign-teacher-class");
            } else {
                toast.error(response.message || "Failed to assign teacher");
            }
        } catch (error) {
            console.error("Error assigning teacher:", error);
            toast.error("An error occurred while assigning teacher");
        }
    };

    return (
        <div className="container mx-auto p-2">
            <div className="container mx-auto p-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Edit Assign Teacher to Class</h2>
                        <div className="mt-2">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                    </div>
                    <button
                        className="add-btn"
                        onClick={() => navigate("/lookups/assign-teacher-class")}
                    >
                        <TbArrowBackUp size={20} className="mr-2" />
                        Back
                    </button>
                </div>
            </div>
            <form className="bg-white p-6 rounded-lg shadow" onSubmit={handleSubmit}>
                <div className="flex flex-wrap -mx-2">
                    <div className="w-full md:w-1/2 px-2 mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Academic Year <span className="text-red-500">*</span>
                        </label>
                        <AcademicYearDropdown
                            value={formData.academicYear}
                            onChange={(value) => setFormData({ ...formData, academicYear: value })}
                            required={true}
                            disabled={false}
                        />
                    </div>

                    <div className="w-full md:w-1/2 px-2 mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Teacher <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.teacherId}
                            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Teacher</option>
                            {teachers.map((teacher) => (
                                <option key={teacher._id} value={teacher._id}>
                                    {teacher.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full px-2 mb-4">
                        <h3 className="text-lg font-semibold mb-2">Assign Classes</h3>
                        {formData.assignments.map((assignment, index) => (
                            <div key={index} className="mb-6 p-4 border rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center">
                                        <label className="block text-gray-700 text-sm font-bold mr-2">
                                            Class Teacher
                                        </label>
                                        <input
                                            type="checkbox"
                                            checked={assignment.isClassTeacher}
                                            onChange={(e) => handleAssignmentChange(index, 'isClassTeacher', e.target.checked)}
                                            className="h-5 w-5 text-blue-600"
                                        />
                                    </div>
                                    {formData.assignments.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeAssignment(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap -mx-2">
                                    <div className="w-full md:w-1/2 px-2 mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Class <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={assignment.class}
                                            onChange={(e) => handleAssignmentChange(index, 'class', e.target.value)}
                                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select Class</option>
                                            {classes.map((cls) => (
                                                <option key={cls._id} value={cls._id}>
                                                    {cls.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full md:w-1/2 px-2 mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Division <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={assignment.division}
                                            onChange={(e) => handleAssignmentChange(index, 'division', e.target.value)}
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
                                </div>
                                {assignment.class && assignment.division && (
                                    <div className="mt-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Subjects <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mb-4">
                                            <select
                                                value=""
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        handleSubjectSelection(index, e.target.value);
                                                    }
                                                }}
                                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Subject to Add</option>
                                                {allSubjects
                                                    .filter(sub => !assignment.subjects.includes(sub._id))
                                                    .map(sub => (
                                                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {assignment.subjects.map(subjectId => {
                                                const subject = allSubjects.find(s => s._id === subjectId);
                                                return subject ? (
                                                    <div key={subjectId} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                                                        <span>{subject.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSubject(index, subjectId)}
                                                            className="ml-2 text-red-500 hover:text-red-700"
                                                        >
                                                            <MdOutlineCancel size={16} />
                                                        </button>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addNewAssignment}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
                        >
                            + Add Another Class
                        </button>
                    </div>

                    <div className="w-full px-2 mt-6 flex justify-end gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            type="button"
                            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditAssignTeachersClass;