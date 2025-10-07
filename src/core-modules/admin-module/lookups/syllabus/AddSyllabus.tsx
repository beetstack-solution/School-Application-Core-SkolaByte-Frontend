import React, { useEffect, useState } from 'react'
import { createSyllabus, SyllabusListResponse } from '@/api/admin-api/lookups-api/syllabusApi'
import { AcademicYear, Classes, fetchAcademicYear, fetchClasses, fetchSubjects, subjects } from '@/api/common-api/commonDropDownApi'
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { MdOutlineCancel } from 'react-icons/md';
import { TbArrowBackUp } from 'react-icons/tb';
import Breadcrumb from '@/components/Breadcumb';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { FcCancel } from 'react-icons/fc';
import AcademicYearDropdown from '@/components/AcademicYearDropdown';

interface Topic {
    topicName: string;
    description: string;
}

interface SubjectEntry {
    subject: string;
    topics: Topic[];
}

const AddSyllabus: React.FC = () => {
    const navigate = useNavigate();
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [classes, setClasses] = useState<Classes[]>([]);
    const [subjects, setSubjects] = useState<subjects[]>([]);
    const [formData, setFormData] = useState({
        academicYear: '',
        class: '',
        subjects: [{ subject: '', topics: [{ topicName: '', description: '' }] }] as SubjectEntry[],
    });

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Syllabus", path: "/lookups/syllabuses" },
        { label: "Add Syllabus", path: "" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [yearsData, classesData, subjectsData] = await Promise.all([
                    fetchAcademicYear(),
                    fetchClasses(),
                    fetchSubjects(),
                ]);

                setAcademicYears(yearsData.data);
                setClasses(classesData.data);
                setSubjects(subjectsData.data);
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubjectChange = (subjectIndex: number, subjectId: string) => {
        const isSubjectAlreadySelected = formData.subjects.some(
            (subject, index) => index !== subjectIndex && subject.subject === subjectId
        );

        if (isSubjectAlreadySelected) {
            toast.error('This subject is already selected. Please choose another subject.');
            return;
        }

        const updatedSubjects = [...formData.subjects];
        updatedSubjects[subjectIndex].subject = subjectId;
        setFormData(prev => ({ ...prev, subjects: updatedSubjects }));
    };

    const handleTopicChange = (
        subjectIndex: number,
        topicIndex: number,
        field: keyof Topic,
        value: string
    ) => {
        const updatedSubjects = [...formData.subjects];
        const updatedTopics = [...updatedSubjects[subjectIndex].topics];
        updatedTopics[topicIndex][field] = value;
        updatedSubjects[subjectIndex].topics = updatedTopics;
        setFormData(prev => ({ ...prev, subjects: updatedSubjects }));
    };

    const addSubject = () => {
        setFormData(prev => ({
            ...prev,
            subjects: [...prev.subjects, { subject: '', topics: [{ topicName: '', description: '' }] }]
        }));
    };

    const removeSubject = (subjectIndex: number) => {
        const updatedSubjects = formData.subjects.filter((_, index) => index !== subjectIndex);
        setFormData(prev => ({ ...prev, subjects: updatedSubjects }));
    };

    const addTopic = (subjectIndex: number) => {
        const updatedSubjects = [...formData.subjects];
        updatedSubjects[subjectIndex].topics.push({ topicName: '', description: '' });
        setFormData(prev => ({ ...prev, subjects: updatedSubjects }));
    };

    const removeTopic = (subjectIndex: number, topicIndex: number) => {
        const updatedSubjects = [...formData.subjects];
        updatedSubjects[subjectIndex].topics = updatedSubjects[subjectIndex].topics.filter(
            (_, index) => index !== topicIndex
        );
        setFormData(prev => ({ ...prev, subjects: updatedSubjects }));
    };

    const validateForm = () => {
        if (!formData.academicYear || !formData.class) return false;
        if (formData.subjects.some(subject => !subject.subject || subject.topics.length === 0)) return false;
        if (formData.subjects.some(subject =>
            subject.topics.some(topic => !topic.topicName.trim())
        )) return false;
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check for duplicate topic names within the same subject
        const hasDuplicateTopics = formData.subjects.some(subject => {
            const topicNames = subject.topics.map(topic => topic.topicName.trim().toLowerCase());
            return new Set(topicNames).size !== topicNames.length;
        });

        if (hasDuplicateTopics) {
            toast.error('Duplicate topic names are not allowed within the same subject.');
            return;
        }

        // Validate other required fields
        if (!validateForm()) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            const response: SyllabusListResponse = await createSyllabus(formData as any);

            if (response.success) {
                toast.success(response.message || 'Syllabus created successfully');
                setFormData({
                    academicYear: '',
                    class: '',
                    subjects: [{ subject: '', topics: [{ topicName: '', description: '' }] }]
                });
                navigate('/lookups/syllabuses');
            } else {
                toast.error(response.message || 'Failed to create syllabus');
            }
        } catch (error) {
            console.error('Error creating syllabus:', error);
            toast.error('An error occurred while creating syllabus');
        }
    };


    return (
     <div className="px-4">
         <div className="flex flex-col md:flex-row justify-between items-center px-1 mb-3">
        <div>
            <h3 className="text-xl font-semibold mb-4">Add Syllabus</h3>
            <div className="breadcrumb-section">
            <Breadcrumb items={breadcrumbItems} />
            </div>
        </div>
        <div className="header-btns">
            <button 
            className="add-btn"
            onClick={() => navigate('/lookups/syllabuses')}
             >
            <TbArrowBackUp size={20} className="mr-2" />
            Back
            </button>
        </div>
        </div>
     <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
         <div className="flex flex-wrap -mx-2 mb-6">
             <div className="w-full md:w-1/3 px-2 mb-4">
                 <label className="block text-gray-700 text-sm font-bold mb-2">
                     Academic Year <span className='text-red-500'>*</span>
                 </label>
                 {/* <select
                     name="academicYear"
                     value={formData.academicYear}
                     onChange={handleInputChange}
                     className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                     required
                 >
                     <option value="">Select Academic Year</option>
                     {academicYears.map(year => (
                         <option key={year._id} value={year._id}>{year.academicYear}</option>
                     ))}
                 </select> */}
                 <AcademicYearDropdown
                 value={formData.academicYear}
                 onChange={(value) => setFormData(prev => ({ ...prev, academicYear: value }))}
              
                 />

             </div>

             <div className="w-full md:w-1/3 px-2 mb-4">
                 <label className="block text-gray-700 text-sm font-bold mb-2">
                     Class <span className='text-red-500'>*</span>
                 </label>
                 <select
                     name="class"
                     value={formData.class}
                     onChange={handleInputChange}
                     className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                     required
                 >
                     <option value="">Select Class</option>
                     {classes.map(cls => (
                         <option key={cls._id} value={cls._id}>{cls.name}</option>
                     ))}
                 </select>
             </div>
         </div>

         <div className="mt-8">
             <h4 className="text-lg font-semibold mb-4">Subjects & Topics <span className='text-red-500'>*</span></h4>

             <div className="overflow-x-auto">
                 <table className="table-auto w-full text-left border-collapse border border-gray-300">
                     <thead className="bg-gray-700 text-white">
                         <tr>
                             <th className="px-4 py-2 border border-gray-300">Subject</th>
                             <th className="px-4 py-2 border border-gray-300">Topics</th>
                             <th className="px-4 py-2 border border-gray-300">Remove</th>
                         </tr>
                     </thead>
                     <tbody>
                         {formData.subjects.map((subject, subjectIndex) => (
                             <React.Fragment key={subjectIndex}>
                                 <tr className="hover:bg-gray-50">
                                     <td className="px-4 py-2 border border-gray-300" rowSpan={subject.topics.length + 1}>
                                         <div className="flex items-center justify-between gap-2">
                                             <select
                                                 value={subject.subject}
                                                 onChange={(e) => handleSubjectChange(subjectIndex, e.target.value)}
                                                 className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                 required
                                             >
                                                 <option value="">Select Subject</option>
                                                 {subjects.map(sub => (
                                                     <option key={sub._id} value={sub._id}>{sub.name}</option>
                                                 ))}
                                             </select>
                                             <button
                                                 type="button"
                                                 onClick={() => removeSubject(subjectIndex)}
                                                 className="p-2 bg-red-200 hover:bg-red-300 rounded-full"
                                             >
                                                 <MdOutlineCancel size={22} className="text-gray-600" />
                                             </button>
                                         </div>
                                     </td>

                                 </tr>

                                 {subject.topics.map((topic, topicIndex) => (
                                     <tr key={topicIndex} className="hover:bg-gray-50">
                                         <td className="px-4 py-2 border border-gray-300">
                                             <input
                                                 type="text"
                                                 value={topic.topicName}
                                                 onChange={(e) => handleTopicChange(
                                                     subjectIndex,
                                                     topicIndex,
                                                     'topicName',
                                                     e.target.value
                                                 )}
                                                 className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                 placeholder="Topic Name"
                                                 required
                                             />
                                             <input
                                                 type="text"
                                                 value={topic.description}
                                                 onChange={(e) => handleTopicChange(
                                                     subjectIndex,
                                                     topicIndex,
                                                     'description',
                                                     e.target.value
                                                 )}
                                                 className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                 placeholder="Description"
                                             />
                                         </td>
                                         <td className="px-4 py-2 border border-gray-300">
                                             <button
                                                 type="button"
                                                 onClick={() => removeTopic(subjectIndex, topicIndex)}
                                                 className="p-2 bg-red-200 hover:bg-red-300 rounded-full"
                                             >
                                                 <MdOutlineCancel size={22} className="text-gray-600" />
                                             </button>
                                         </td>
                                     </tr>
                                 ))}

                                 <tr>
                                     <td className="px-4 py-2 border border-gray-300" colSpan={3}>
                                         <button
                                             type="button"
                                             onClick={() => addTopic(subjectIndex)}
                                             className="add-btn "
                                             style={{ width: "110px" }}
                                         >
                                             <IoMdAddCircleOutline size={22} className="mr-2" />
                                             Add Topic
                                         </button>
                                     </td>
                                 </tr>
                             </React.Fragment>
                         ))}
                     </tbody>
                 </table>
             </div>

             <div className="mt-4">
                 <button
                     type="button"
                     onClick={addSubject}
                     className="add-btn"
                     style={{ width: "115px" }}
                 >

                     <IoMdAddCircleOutline size={22} className="mr-2" />
                     Add Subject
                 </button>
             </div>
         </div>

           <div className="flex space-x-2 justify-end">
           <Link to={"/lookups/syllabuses"}>
              <button
               type="button"
               className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm"

                >
              <FcCancel size={20} className="mr-2" />
               Cancel
               </button>
             </Link>
             <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm hover:shadow-md disabled:opacity-70">
               <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
               Submit
             </button>
         
            
          </div>
     </form>
        </div>
    )
}
export default AddSyllabus
