import React, { useState, useEffect } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { createFeature } from "@/api/super-admin-api/FeatureModuleApi";
import { FeatureData, fetchFeatures } from "@/api/common-api/commonDropDownApi";
import { toast } from "react-toastify";

interface AddFeatureModuleProps {
  onClose: () => void; // Function to close the modal
  onReload: () => void; // Function to reload the feature module list
}

const AddFeatureModule: React.FC<AddFeatureModuleProps> = ({
  onClose,
  onReload,
}) => {
  const [featureSub, setfeature] = useState<string>(""); // State for feature module name
  const [selectedFeature, setSelectedFeature] = useState<string>(""); // State for selected feature ID
  const [featuresSub, setFeatures] = useState<FeatureData[]>([]); // State for feature options
  const [error, setError] = useState<string>(""); // State for error messages

  // Fetch features on component mount
  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const response = await fetchFeatures();
        if (response.success) {
          setFeatures(response.feature);
        } else {
          toast.error(response.message || "Failed to load features.");
        }
      } catch (error: any) {
        console.error("Error fetching features:", error.message);
        toast.error("Error fetching features. Please try again.");
      }
    };

    loadFeatures();
  }, []);

  // Handle input change for feature module name
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setfeature(e.target.value);
  };

  // Handle dropdown change for feature selection
  // const handleFeatureSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedFeature(e.target.value);
  // };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validate input
    if (!featureSub.trim()) {
      setError("Please provide a feature module name.");
      return;
    }

    if (!selectedFeature) {
      setError("Please select a feature.");
      return;
    }

    // Prepare data for API
    const moduleData = {
      name: featureSub.trim(),
      feature: selectedFeature,
    };

    try {
      // Call API to create feature module
      const response = await createFeature(moduleData);

      if (response.success) {
        toast.success("Feature module created successfully!");
      } else {
        toast.error(response.message || "Failed to create feature module.");
        setError(response.message || "Failed to create feature module.");
      }
      onReload(); // Reload the list after successful creation
      onClose(); // Close the modal
    } catch (error: any) {
      console.error(error.message || "Error creating feature module:", error);
      toast.error(
        error.message || "Failed to create feature module. Please try again."
      );
      setError(
        error.message || "Failed to create feature module. Please try again."
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Add Feature Module</h2>
        <IoIosCloseCircleOutline
          className="text-3xl cursor-pointer"
          onClick={onClose}
        />
      </div>
      <div>{error && <div className="mb-4 text-red-500">{error}</div>}</div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Feature
        </label>
        <select
          value={selectedFeature}
          onChange={(e) => {
            setSelectedFeature(e.target.value);
          }}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">-- Select a Feature --</option>
          {featuresSub.map((feature) => (
            <option key={feature._id} value={feature._id}>
              {feature.name}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Feature Module Name
          </label>
          <input
            value={featureSub}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter feature module name"
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

export default AddFeatureModule;
