import React, { useState, useEffect } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import {
  fetchFeatureById,
  updateFeatureById,
  fetchFeatureModule,
  FeatureModuleData,
} from "@/api/super-admin-api/FeatureModuleApi"; // Adjust import path if necessary
import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";

interface EditFeatureModuleProps {
  onClose: () => void;
  featureId: string; // The ID of the feature to edit
  onReload:()=>void;
  
  
}

const EditFeatureModule: React.FC<EditFeatureModuleProps> = ({featureId, onClose ,onReload}) => {
  const [featureName, setFeatureName] = useState<string>("");
  const [featureCode, setFeatureCode] = useState<string>("");
  const [, setCategories] = useState<FeatureModuleData[]>([]);
  const [error, setError] = useState<string>("");
  // const { id } = useParams<{ id: string }>();
  // const featureId = id;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchFeatureModule();
        setCategories(response.feature); // Ensure this matches your API response structure
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const loadFeatureData = async () => {
      try {
        const response = await fetchFeatureById(featureId);
        console.log(response, "data in edit");
        if (response.feature) {
          const feature: any = response.feature;
          setFeatureName(feature.name);
          setFeatureCode(feature.code);
        }
      } catch (error) {
        console.error("Error fetching feature data:", error);
      }
    };

    loadCategories();
    loadFeatureData();
  }, [featureId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeatureName(e.target.value);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeatureCode(e.target.value);
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!featureName || !featureCode) {
      setError("Name and Code are required.");
      return;
    }

    const updatedData = {
      name: featureName,
      code: featureCode,
    };

    try {
      const response:any = await updateFeatureById(featureId, updatedData);
      if(response.success){
        toast.success(response.message || "Feature module updated successfully!");
        onReload();
      }else{
        toast.error(response.message || "Failed to update feature module. Please try again.");
      }
    } catch (error:any) {
      console.error(error.message ||"Error updating feature module:", error);
      toast.error(error.message ||"Failed to update feature module. Please try again.");
      setError(
        error.message || "Failed to update feature module. Please try again."
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-4">Edit Feature Module</h2>
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
            type="text"
            value={featureName}
            onChange={handleNameChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter feature name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Feature Code
          </label>
          <input
            type="text"
            value={featureCode}
            onChange={handleCodeChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter feature code"
            disabled
          />
        </div>
        <div className="mb-4">
      
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

export default EditFeatureModule;
