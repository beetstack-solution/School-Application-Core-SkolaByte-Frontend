import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FcCancel } from "react-icons/fc";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { RiExportFill } from "react-icons/ri";
import {
    fetchSubjects,
    createSubject,
    SubjectData,
} from "@/api/admin-api/lookups-api/subjectApi";
import { fetchAcademicYear } from "@/api/common-api/commonDropDownApi";
import AcademicYearDropdown from "@/components/AcademicYearDropdown";

interface ExportSubjectModalProps {
    onClose: () => void;
    onSuccess: () => void;
    initialSelectedSubjects?: string[];
}

interface AcademicYear {
    academicYear: string;
    _id: string;
    year: string;
}

interface ApiSubjectData {
    _id: string;
    name: string;
    code: string;
    academicYear: {
        id?: string;
        academicYear?: string;
        startMonth?: number;
        endMonth?: number;
    };
    status: boolean;
    createdBy: {
        name: string;
        email: string;
    };
    createdAt: string;
    updatedBy: Record<string, unknown>;
}

interface NewSubject {
    name: string;
    code: string;
    academicYear: string;
}

const ExportSubjectModal = ({
    onClose,
    onSuccess,
    initialSelectedSubjects = [],
}: ExportSubjectModalProps) => {
    const [sourceAcademicYear, setSourceAcademicYear] = useState("");
    const [targetAcademicYear, setTargetAcademicYear] = useState("");
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [sourceSubjects, setSourceSubjects] = useState<any[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState("");
    const [newSubjectCode, setNewSubjectCode] = useState("");
    const [newSubjects, setNewSubjects] = useState<NewSubject[]>([]);
    const [notes, setNotes] = useState("");

    const loadSubjects = async () => {
        try {
            const response: any = await fetchSubjects(0, Number.MAX_SAFE_INTEGER);
            setSourceSubjects(response.subjects);
        } catch (error) {
            console.error("Error fetching subjects:", error);
            toast.error("Failed to fetch subjects. Please try again.");
        }
    };


    useEffect(() => {
        loadSubjects();
        // loadAcademicYears();
    }, []);

    useEffect(() => {
        if (sourceAcademicYear) {
            const filtered = sourceSubjects.filter(subject =>
                subject.academicYear?.id === sourceAcademicYear
            );
            setFilteredSubjects(filtered);
        } else {
            setFilteredSubjects(sourceSubjects);
        }
    }, [sourceAcademicYear, sourceSubjects]);

    const handleSubjectSelect = (subjectName: string) => {
        setSelectedSubjects((prev: any) => {
            const isSelected = prev.includes(subjectName);
            if (isSelected) {
                return prev.filter((name: string) => name !== subjectName);
            } else {
                return [...prev, subjectName];
            }
        });
    };

    const handleAddNewSubject = () => {
        if (!newSubjectName || !targetAcademicYear) {
            toast.warning("Please fill subject name and select academic year");
            return;
        }

        const newSubject: NewSubject = {
            name: newSubjectName,
            code: newSubjectCode || newSubjectName.substring(0, 3).toUpperCase(),
            academicYear: targetAcademicYear
        };

        setNewSubjects(prev => [...prev, newSubject]);
        setNewSubjectName("");
        setNewSubjectCode("");
    };

    const handleRemoveNewSubject = (index: number) => {
        setNewSubjects(prev => prev.filter((_, i) => i !== index));
    };

    const handleExport = async () => {
        if (!targetAcademicYear) {
            toast.error("Please select target academic year");
            return;
        }

        // Add the currently typed subject if it has a name
        if (newSubjectName && !newSubjects.some(sub => sub.name === newSubjectName)) {
            const newSubject: NewSubject = {
                name: newSubjectName,
                code: newSubjectCode || newSubjectName.substring(0, 3).toUpperCase(),
                academicYear: targetAcademicYear
            };
            setNewSubjects(prev => [...prev, newSubject]);
            setNewSubjectName("");
        }

        if (selectedSubjects.length === 0 && newSubjects.length === 0) {
            toast.error("Please select subjects to export or add new subjects");
            return;
        }

        setIsExporting(true);
        try {
            const subjectsToExport: any = [
                ...selectedSubjects.map(name => ({
                    name: name,
                    academicYear: targetAcademicYear,
                })),
                ...newSubjects
            ];

            const createPromises = subjectsToExport.map((subject: any) =>
                createSubject({
                    name: subject.name,
                    academicYear: subject.academicYear,
                })
            );

            await Promise.all(createPromises);
            toast.success("Subjects exported successfully!");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error exporting subjects:", error);
            toast.error("Failed to export subjects. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Clone Subjects</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <IoIosCloseCircleOutline className="text-2xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Source Subjects Column */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Clone Subjects</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter by Academic Year
                                </label>
                                <AcademicYearDropdown
                                    value={sourceAcademicYear}
                                    onChange={setSourceAcademicYear}
                                />
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <div className="bg-gray-100 p-2 border-b flex justify-between items-center">
                                    <p className="text-sm font-medium text-gray-700">
                                        {selectedSubjects.length} of {filteredSubjects.length} selected
                                    </p>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedSubjects.length === filteredSubjects.length && filteredSubjects.length > 0}
                                            onChange={() => {
                                                if (selectedSubjects.length === filteredSubjects.length) {
                                                    setSelectedSubjects([]);
                                                } else {
                                                    // Map filteredSubjects to just their names
                                                    setSelectedSubjects(filteredSubjects.map(subject => subject.name));
                                                }
                                            }}
                                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Select All</span>
                                    </label>
                                </div>
                                <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto rounded-lg border border-gray-200 shadow-sm">
                                    {filteredSubjects.map((subject) => (
                                        <li
                                            key={subject._id}
                                            className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between
                ${selectedSubjects.includes(subject.name)
                                                    ? 'bg-blue-50 border-l-4 border-blue-500'
                                                    : 'hover:bg-gray-50'
                                                }`}
                                            onClick={() => handleSubjectSelect(subject.name)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubjects.includes(subject.name)}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        handleSubjectSelect(subject.name);
                                                    }}
                                                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <span className="text-sm font-medium text-gray-800">
                                                    {subject.name}
                                                </span>
                                            </div>
                                            {subject.academicYear?.academicYear && (
                                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                    {subject.academicYear.academicYear}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Export Action Column */}
                        <div className="flex flex-col items-center justify-center space-y-6">
                            <div className="text-center">
                                <RiExportFill className="mx-auto text-4xl text-blue-500 mb-2" />
                                <h3 className="text-lg font-medium text-gray-800">Cloned Subjects</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {selectedSubjects.length} subjects selected
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {newSubjects.length} new subjects to add
                                </p>

                            </div>



                        </div>

                        {/* Target Configuration Column */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Cloned Subjects</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Target Academic Year
                                </label>
                                <AcademicYearDropdown
                                    value={targetAcademicYear}
                                    onChange={setTargetAcademicYear}
                                />
                            </div>

                            <div className="mb-4 w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Add New Subject
                                </label>
                                <div className="flex flex-col gap-2 mb-2 w-full">
                                    <input
                                        type="text"
                                        value={newSubjectName}
                                        onChange={(e) => setNewSubjectName(e.target.value)}
                                        placeholder="Subject name"
                                        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />

                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAddNewSubject}
                                        disabled={!newSubjectName || !targetAcademicYear}
                                        className={`px-3 py-1 rounded text-sm ${!newSubjectName || !targetAcademicYear
                                            ? 'bg-gray-200 cursor-not-allowed'
                                            : 'bg-gray-200 hover:bg-gray-300'}`}
                                    >
                                        Add Subject
                                    </button>
                                    {newSubjectName && (
                                        <span className="text-sm text-gray-500 self-center">
                                            Will be added on submit
                                        </span>
                                    )}
                                </div>
                            </div>

                            {newSubjects.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">New Subjects to Add</h4>
                                    <ul className="border rounded-md divide-y">
                                        {newSubjects.map((subject, index) => (
                                            <li key={index} className="p-2 flex justify-between items-center">
                                                <span>
                                                    {subject.name}
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveNewSubject(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ×
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}


                            {(selectedSubjects.length > 0 || newSubjects.length > 0) && (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <h4 className="font-medium text-blue-800 mb-2">Cloned Summary</h4>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>{selectedSubjects.length} subject(s) to copy</li>
                                        <li>{newSubjects.length} new subject(s) to create</li>
                                        {/* {targetAcademicYear && (
                                            <li>
                                                Target Year: {academicYears.find(ay => ay._id === targetAcademicYear)?.academicYear || targetAcademicYear}
                                            </li>
                                        )} */}
                                    </ul>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
                    <button
                        onClick={handleExport}
                        disabled={(!selectedSubjects.length && !newSubjects.length) || !targetAcademicYear || isExporting}
                        className={`flex items-center justify-center px-6 py-3 rounded-md text-white transition-colors ${(selectedSubjects.length || newSubjects.length) && targetAcademicYear
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isExporting ? (
                            "Exporting..."
                        ) : (
                            <>
                                <IoCheckmarkDoneCircleOutline className="mr-2" size={18} />
                                Submit
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                        <FcCancel size={18} />
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportSubjectModal;