import React, { useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { createFeature } from "@/api/super-admin-api/FeatureApi"; // API integration
import { toast } from "react-toastify";

interface AddFeatureProps {
  onClose: () => void; // Function to close the modal
  onReload: () => void; // Function to reload the feature m list
}

const AddFeature: React.FC<AddFeatureProps> = ({ onClose, onReload }) => {
  const [featureName, setFeatureName] = useState<string>(""); // State for feature name
  const [error, setError] = useState<string>(""); // State for error messages

  // Handle input change for feature name
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeatureName(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Clear previous error messages

    // Validate input
    if (!featureName.trim()) {
      setError("Please provide a feature name.");
      return;
    }

    // Prepare data for API
    const featureData = {
      name: featureName.trim(), // Map featureName to "name" as per the API structure
    };

    try {
      // Call API to create feature
      const response = await createFeature(featureData);

      // Handle success response
      if (response.success) {
        console.log("Feature  created:", response);
        toast.success(response.message || "Feature created successfully!");
      } else {
        // Handle API error response
        console.error("Error in API response:", response.message);
        toast.error(response.message || "Failed to create feature .");
        setError(response.message || "Failed to create feature .");
      }
      onReload(); // Reload the list after successful creation
      onClose(); // Close the modal
    } catch (error: any) {
      // Handle general errors
      console.error(error.message || "Error creating feature :", error);
      toast.error(
        error.message || "Failed to create feature . Please try again."
      );
      setError(error.message || "Failed to create feature . Please try again.");
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Add Feature</h2>
        <IoIosCloseCircleOutline
          className="text-3xl cursor-pointer"
          onClick={onClose}
        />
      </div>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Feature Name
          </label>
          <input
            value={featureName}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter feature name"
            required
          />
        </div>

        <div className="flex justify-end space-x-4 items-center">
          <div className="flex space-x-2">
            <button type="submit" className="submit-btn flex items-center">
              <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
              Submit
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
        </div>
      </form>
    </div>
  );
};

export default AddFeature;
