// import { useEffect, useState } from "react";
// import { FcCancel } from "react-icons/fc";
// import { IoIosArrowDown, IoIosCloseCircleOutline } from "react-icons/io";
// import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
// import { fetchLookupCodeById, updateLookupCodeById } from "../../api/lookupCodeApi";

// interface EditLookupCodeProps {
//   lookupCodeId: string;
//   onClose: () => void;
// }

// const EditLookupCode: React.FC<EditLookupCodeProps> = ({ lookupCodeId, onClose }) => {
//   const [lookupCode, setLookupCode] = useState({
//     name: "",
//     type: "",
//     code: "",
//     firstNumber: 0,
//     lastNumber: 0,
//     status: "active",
//   });
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch lookup code by ID
//   useEffect(() => {
//     const getLookupCodeById = async () => {
//       try {
//         setLoading(true);
//         const response = await fetchLookupCodeById(lookupCodeId);
//         if (response.success) {
//           setLookupCode(response.lookupCode);
//         } else {
//           setError("Lookup code not found.");
//         }
//       } catch (error) {
//         console.error("Error fetching lookup code:", error);
//         setError("Error fetching lookup code");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (lookupCodeId) {
//       getLookupCodeById();
//     }
//   }, [lookupCodeId]);

//   // Handle form submission
//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     if (!lookupCode.name || !lookupCode.type || !lookupCode.code) {
//       setError("Please fill in all required fields.");
//       return;
//     }

//     try {
//       await updateLookupCodeById(lookupCodeId, lookupCode);
//       setError(null);
//       onClose();
//     } catch (error) {
//       console.error("Error updating lookup code:", error);
//       setError("Error updating lookup code. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between">
//         <h2 className="text-xl font-bold mb-4">Edit Lookup Code</h2>
//         <IoIosCloseCircleOutline className="text-3xl cursor-pointer" onClick={onClose} />
//       </div>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
//           <input
//             type="text"
//             value={lookupCode.name}
//             onChange={(e) => setLookupCode({ ...lookupCode, name: e.target.value })}
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter name"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Code</label>
//           <input
//             type="text"
//             value={lookupCode.code}
//             onChange={(e) => setLookupCode({ ...lookupCode, code: e.target.value })}
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter code"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
//           <input
//             type="text"
//             value={lookupCode.type}
//             onChange={(e) => setLookupCode({ ...lookupCode, type: e.target.value })}
//             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter type"
//           />
//         </div>
//         {error && <p className="text-red-500">{error}</p>}

//         <div className="flex justify-end space-x-4 items-center">
//           <button type="submit" className="submit-btn flex items-center">
//             <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
//             Save
//           </button>
//           <button type="button" onClick={onClose} className="cancel-btn flex items-center">
//             <FcCancel size={20} className="mr-2" />
//             Close
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditLookupCode;

import { useEffect, useState } from "react";
import { FcCancel } from "react-icons/fc";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import {
  fetchLookupCodeById,
  updateLookupCodeById,
} from "@/api/super-admin-api/authority-setting-api/lookupCodeApi";
import { toast } from "react-toastify";

interface EditLookupCodeProps {
  lookupCodeId: string;
  onClose: () => void; // Function to close the modal
  onReload: () => void; // Function to reload the lookup code list
}

const EditLookupCode: React.FC<EditLookupCodeProps> = ({
  lookupCodeId,
  onClose,
  onReload,
}) => {
  const [lookupCode, setLookupCode] = useState({
    name: "",
    type: "",
    code: "",
    firstNumber: 0,
    lastNumber: 0,
    status: "active",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lookup code by ID
  useEffect(() => {
    const getLookupCodeById = async () => {
      try {
        setLoading(true);
        const response = await fetchLookupCodeById(lookupCodeId);
        if (response.success) {
          setLookupCode(response.lookupCode);
        } else {
          setError("Lookup code not found.");
        }
      } catch (error) {
        console.error("Error fetching lookup code:", error);
        setError("Error fetching lookup code");
      } finally {
        setLoading(false);
      }
    };

    if (lookupCodeId) {
      getLookupCodeById();
    }
  }, [lookupCodeId]);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!lookupCode.name || !lookupCode.type || !lookupCode.code) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const response = await updateLookupCodeById(lookupCodeId, lookupCode);
      if (response.success) {
        toast.success("Lookup code updated successfully!");
        onClose(); // Close the modal
        onReload(); // Reload the lookup code list
      } else {
        setError(response.message || "Failed to update lookup code.");
      }
    } catch (error) {
      console.error("Error updating lookup code:", error);
      setError("Error updating lookup code. Please try again.");
    }
  };

  // Handle close button click
  const handleClose = () => {
    onClose(); // Call the onClose function to close the modal
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold mb-4">Edit Lookup Code</h2>
        {/* Close button with onClick handler */}
        <IoIosCloseCircleOutline
          className="text-3xl cursor-pointer"
          onClick={handleClose}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleClose()}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            value={lookupCode.name}
            onChange={(e) =>
              setLookupCode({ ...lookupCode, name: e.target.value })
            }
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Code
          </label>
          <input
            type="text"
            value={lookupCode.code}
            onChange={(e) =>
              setLookupCode({ ...lookupCode, code: e.target.value })
            }
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter code"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Type
          </label>
          <input
            type="text"
            value={lookupCode.type}
            onChange={(e) =>
              setLookupCode({ ...lookupCode, type: e.target.value })
            }
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter type"
            required
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
            onClick={handleClose}
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

export default EditLookupCode;
