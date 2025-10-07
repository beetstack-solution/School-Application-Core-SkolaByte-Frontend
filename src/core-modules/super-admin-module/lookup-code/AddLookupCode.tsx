import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { useState } from "react";
import { createLookupCode } from "@/api/super-admin-api/authority-setting-api/lookupCodeApi"; // Adjust the import if necessary
import { toast } from "react-toastify";

interface AddLookupProps {
  onClose: () => void;
  onReload: () => void;
}

const AddLookupCode: React.FC<AddLookupProps> = ({ onClose, onReload }) => {
  const [formData, setFormData] = useState<any>({
    type: "",
    name: "",
    code: "",
    firstNumber: "",
    lastNumber: "",
    status: "active",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (
      (name === "firstNumber" || name === "lastNumber") &&
      isNaN(Number(value))
    ) {
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const responseData = await createLookupCode(formData);
      if (responseData.success) {
        toast.success(`${responseData.message}`);
        setFormData({
          type: "",
          name: "",
          code: "",
          firstNumber: "",
          lastNumber: "",
          status: "active",
        });
      } else {
        toast.error(`${responseData.message}`);
      }
      onReload();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to create lookup code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Add New Lookup Code</h2>
        <IoIosCloseCircleOutline className="text-3xl" onClick={onClose} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Lookup Type
          </label>
          <input
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter lookup type"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Lookup Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter lookup name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Lookup Code
          </label>
          <input
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter lookup code"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            First Number
          </label>
          <input
            type="text"
            name="firstNumber"
            value={formData.firstNumber}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter first number"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Last Number
          </label>
          <input
            type="text"
            name="lastNumber"
            value={formData.lastNumber}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter last number"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className={`submit-btn flex items-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
            {loading ? "Submitting..." : "Submit"}
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

export default AddLookupCode;
