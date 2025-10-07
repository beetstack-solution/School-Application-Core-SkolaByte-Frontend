import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchRoles, RolesResponse } from "@/api/admin-api/common-setting-api/roleApi";
import { updateuserById, fetchuserById, UserData, SingleUserDataResponse } from "@/api/admin-api/base-api/userApi";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { FcCancel } from "react-icons/fc";
import { Link, useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "@/components/Breadcumb";
import { TbArrowBackUp } from "react-icons/tb";

const EditUsers: React.FC = () => {
  const { id } = useParams<{ id: any }>(); // Get person's ID from URL
  const [roleDD, setRoleDD] = useState<RolesResponse[]>([]);
  const [userData, setUserData] = useState<SingleUserDataResponse>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newPassword, setNewPassword] = useState<string>(""); // For storing new password
  const [newConfirmPassword, setNewConfirmPassword] = useState<string>("");
  const [updatingPassword, setUpdatingPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: {
      street: "",
      city: "",
      state: "",
      district: "",
      zipCode: "",
    },
    paymentAddress: {
      street: "",
      city: "",
      state: "",
      district: "",
      zipCode: "",
    },
    role: "",
    GSTNumber: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== newConfirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    // Password update logic will be moved to handleSubmit
    setUpdatingPassword(true); // Set flag to indicate we're updating password
    setIsModalOpen(false); // Close modal
    toast.success("Password set for submission!"); // Indicate password is ready for submission
  };
  useEffect(() => {
    const loadRoleDD = async () => {
      try {
        const response: any = await fetchRoles();
        setRoleDD(response.roles);
      } catch (error) {
        toast.error("Failed to load roles.");
      }
    };
    loadRoleDD();
  }, []);

  const getUserById = async (id: string) => {
    try {
      const response = await fetchuserById(id);
      if (response.success) {
        console.log("user :", response);
        setFormData(response);
      } else {
        setError("Tax slab data not found");
      }
    } catch (error: any) {
      console.error("Error fetching  Tax Slab data:", error);
      setError(error.response?.data?.message || "Error fetching Tax Slab data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      getUserById(id); // Fetch currency data when component mounts
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData: any) => {
      const [field, subField] = name.split(".");
      return subField
        ? {
          ...prevData,
          [field]: {
            ...(prevData[field as keyof UserData] as Record<string, any>),
            [subField]: value,
          },
        }
        : {
          ...prevData,
          [name]: value,
        };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== newConfirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (updatingPassword) {
      setFormData((prevData: any) => ({
        ...prevData,
        password: newPassword, // Update password here for submission
      }));
      setUpdatingPassword(false); // Reset password update state
    }

    try {
      await updateuserById(id, formData);
      toast.success("User updated successfully!");
      navigate("/users");
    } catch (error) {
      toast.error("Failed to update user.");
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Users", path: "/users" },
    { label: "Edit User", path: "" },
  ];
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Edit User</h3>
      <div className="flex flex-col md:flex-row justify-start items-center px-1">
        <div className="breadcrumb-section">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="header-btns ">
        <Link to={"/users"}>
          <button className="add-btn">
            <TbArrowBackUp size={20} className="mr-2" />
            Back
          </button>
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mt-5">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData?.data?.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.data?.phone}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight"
                  ) {
                    e.preventDefault(); // Prevents non-numeric characters
                  }
                }}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.data?.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                GSTIN Number
              </label>
              <input
                type="text"
                name="GSTNumber"
                value={formData.data?.GSTNumber}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight"
                  ) {
                    e.preventDefault(); // Prevents non-numeric characters
                  }
                }}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.data?.role}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a role</option>
                {roleDD.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <span style={{ color: "transparent" }}>password</span>
              </label>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Update Password
              </button>
            </div>
          </div>
          {/* <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                // value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
               type="password"
                    name="confirmPassword"
                // value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div> */}
        </div>
        <fieldset className="border border-gray-300 p-4 rounded-lg mt-5">
          <legend className="text-lg font-bold text-gray-700 px-2">
            Address
          </legend>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Street
              </label>
              <input
                type="text"
                name="address.street"
                value={formData?.data?.address?.street}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                City
              </label>
              <input
                type="text"
                name="address.city"
                value={formData?.data?.address?.city}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                District
              </label>
              <input
                type="text"
                name="address.district"
                value={formData?.data?.address?.district}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                State
              </label>
              <input
                type="text"
                name="address.state"
                value={formData?.data?.address?.state}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Zip Code
              </label>
              <input
                type="text"
                name="address.zipCode"
                value={formData?.data?.address?.zipCode}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight"
                  ) {
                    e.preventDefault(); // Prevents non-numeric characters
                  }
                }}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </fieldset>
        <fieldset className="border border-gray-300 p-4 rounded-lg mt-5">
          <legend className="text-lg font-bold text-gray-700 px-2">
            Payment Address
          </legend>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Street
              </label>
              <input
                type="text"
                name="paymentAddress.street"
                value={formData?.data?.user?.paymentAddress.street}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                City
              </label>
              <input
                type="text"
                name="paymentAddress.city"
                value={formData?.data?.user?.paymentAddress.city}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                District
              </label>
              <input
                type="text"
                name="paymentAddress.district"
                value={formData?.data?.user?.paymentAddress.district}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                State
              </label>
              <input
                type="text"
                name="paymentAddress.state"
                value={formData?.data?.user?.paymentAddress.state}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Zip Code
              </label>
              <input
                type="text"
                name="paymentAddress.zipCode"
                value={formData?.data?.user?.paymentAddress.zipCode}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight"
                  ) {
                    e.preventDefault(); // Prevents non-numeric characters
                  }
                }}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </fieldset>
        <div className="flex justify-end space-x-4 items-center mt-5">
          <div className="flex space-x-2">
            <button className="submit-btn">
              <IoCheckmarkDoneCircleOutline size={22} className="mr-2 " />
              Submit
            </button>
          </div>
        </div>
      </form>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h2 className="text-lg font-bold mb-4">Change Password</h2>
            <form onSubmit={handleUpdatePassword}>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} // Update new password state
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={newConfirmPassword}
                    onChange={(e) => setNewConfirmPassword(e.target.value)} // Update confirm password state
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {showConfirmation && (
        <div className="mt-4 text-green-600 font-semibold">
          Password updated successfully!
        </div>
      )}
    </div>
  );
};

export default EditUsers;
// function setError(arg0: string) {
//   throw new Error("Function not implemented.");
// }
