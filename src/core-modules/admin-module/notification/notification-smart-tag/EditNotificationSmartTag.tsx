import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { fetchSmartById, Notification, updateSmartTagById } from "@/api/super-admin-api/notifications/notificationSmartTagsApi";

interface EditFunctionalityProps {
    functionalityId: string;
    onClose: () => void;
    tableData: () => void;
}

const EditNotificationSmartTag: React.FC<EditFunctionalityProps> = ({
    functionalityId,
    onClose,
    tableData,
}) => {
    const [error, setError] = useState<string | null>(null);
    const [functionality, setFunctionality] =
        useState<Notification | null>(null);

    const getFunctionalityById = async (moduleId: string) => {
        try {
            const responseData = await fetchSmartById(moduleId);
            if (responseData.success) {
                setFunctionality(responseData.notification);
            } else {
                setError("Module not found.");
            }
        } catch (error) {
            console.error("Error fetching modules:", error);
            setError("Error fetching module");
        } finally {
        }
    };

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!functionality?.name) {
            setError("Please fill out the functionality name.");
            return;
        }

        try {
            const updatedFunctionalityData: any = {
                name: functionality.name, // Use functionality name directly
            };

            const response = await updateSmartTagById(functionalityId, updatedFunctionalityData);
            if (response.success) {
                toast.success(response.message || "Smart tag updated successfully!");
                onClose();
                tableData();
            } else {
                toast.error(
                    response.message || "Failed to update smart tag!"
                )
                onClose();
                setError(null);
                // throw new Error( "Error updating smart tag");
            }
        } catch (error: any) {
            console.error(error.message || "Error updating smart tag:", error);
            setError(error.message || "Error updating smart tag. Please try again.");
            toast.error(error.message || "Error updating module. Please try again.");
        }
    };

    useEffect(() => {
        if (functionalityId) {
            getFunctionalityById(functionalityId);
        }
    }, [functionalityId]);

    return (
        <div>
            <div className="flex justify-between">
                <h2 className="text-xl font-bold mb-4">Edit Smart Tag </h2>
                <IoIosCloseCircleOutline
                    className="text-3xl cursor-pointer"
                    onClick={onClose}
                />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Smart Tag Name
                    </label>
                    <input
                        type="text"
                        value={functionality?.name || ""} // Bind to functionality name
                        onChange={(e) => {
                            if (functionality) {
                                setFunctionality({ ...functionality, name: e.target.value }); // Update functionality name
                            }
                        }}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Module name"
                    />
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <div className="flex justify-end space-x-4 items-center">
                    <button type="submit" className="submit-btn flex items-center">
                        <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="cancel-btn flex items-center"
                    >
                        <FcCancel size={20} className="mr-2" />
                        Close
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditNotificationSmartTag;
