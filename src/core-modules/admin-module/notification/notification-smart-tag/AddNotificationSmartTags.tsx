import React, { useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { createSmartTag } from "@/api/super-admin-api/notifications/notificationSmartTagsApi";
interface AddModuleProps {
    onClose: () => void;
    tableData: () => void;
}

const AddNotificationSmartTags: React.FC<AddModuleProps> = ({ onClose, tableData }) => {
    const [error, setError] = useState<string | null>(null);
    const [funtionalityName, setFunctionalityName] = useState<string>("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const functionalityData: any = {
                name: funtionalityName,
            };
            const response = await createSmartTag(functionalityData);
            if (response.success) {
                toast.success(response.message || "Notification smart tags created successfully!");
                onClose();
                tableData();
            } else {
                toast.error(response.message || "Failed to create notification smart tags!", {

                })
            }

        } catch (error: any) {
            console.error(error.message || "Error creating smart tags:", error);
            toast.error(error.message || "Failed to create notification smart tags. Please try again.");
            // setError("Error creating smart tags. Please try again.");
        }
    };

    // Handle error state
    // if (error) {
    //   return (
    //     <div className="flex flex-col items-center">
    //       <p className="text-red-500">{error}</p>
    //       <button type="button" onClick={onClose} className="cancel-btn mt-2">
    //         <FcCancel size={20} className="mr-2" />
    //         Close
    //       </button>
    //     </div>
    //   );
    // }

    return (
        <div>
            <div className="flex justify-between">
                <h2 className="text-xl font-bold mb-4">Add Smart Tags</h2>
                <IoIosCloseCircleOutline className="text-3xl" onClick={onClose} />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Smart Tag Name
                    </label>
                    <input
                        type="text"
                        value={funtionalityName}
                        onChange={(e) => setFunctionalityName(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Smart Tag Name"
                        required
                    />
                </div>

                <div className="flex justify-end space-x-4 items-center">
                    <div className="flex space-x-2">
                        <button type="submit" className="submit-btn">
                            <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
                            Submit
                        </button>
                        <button type="button" onClick={onClose} className="cancel-btn">
                            <FcCancel size={20} className="mr-2" />
                            Close
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddNotificationSmartTags;
