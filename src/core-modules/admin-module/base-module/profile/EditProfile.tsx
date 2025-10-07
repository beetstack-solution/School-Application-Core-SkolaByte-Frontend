import { fetchuserById, updateuserById, UserData } from "@/api/admin-api/base-api/userApi";
import { fetchRoles, RolesResponse } from "@/api/admin-api/common-setting-api/roleApi";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { FcCancel } from "react-icons/fc"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";



function EditProfile() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [roleDD, setRoleDD] = useState<RolesResponse[]>([]);
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      district: "",
      zipCode: "",
    },
    role: "",
  });
  const [originalData, setOriginalData] = useState<any>({});
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log(id, "id");
  useEffect(() => {
    if (id) {
      getUserById(id);
    }
  }, [id]);

  const getUserById = async (id: string) => {
    try {
      const response = await fetchuserById(id);
      if (response.success) {
        setOriginalData(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          address: {
            street: response.data.address.street,
            city: response.data.address.city,
            state: response.data.address.state,
            district: response.data.address.district,
            zipCode: response.data.address.zipCode,
          },
          role: response.data.role,
        });
      } else {
        setError("User data not found");
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      setError(error.response?.data?.message || "Error fetching user data");
    } finally {
      setLoading(false);
    }
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) {
      toast.error("No user ID available");
      return;
    }

    const isChangingPassword = newPassword.trim() !== "" || newConfirmPassword.trim() !== "";

    if (isChangingPassword) {
      if (!newPassword || !newConfirmPassword) {
        toast.error("Please fill both password fields");
        return;
      }
      if (newPassword !== newConfirmPassword) {
        toast.error("Passwords don't match");
        return;
      }
      if (newPassword.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }
    }

    const submissionData = {
      ...formData,
      phone: formData.phone !== originalData.phone ? formData.phone : undefined,
      ...(isChangingPassword && {
        password: newPassword,
        confirmPassword: newConfirmPassword,
      }),
    };

    const cleanData = Object.fromEntries(
      Object.entries(submissionData).filter(([_, v]) => v !== undefined)
    );

    try {
      await updateuserById(id, cleanData);
      toast.success(
        isChangingPassword
          ? "Profile and password updated successfully!"
          : "Profile updated successfully!"
      );
      navigate("/profile/profile");
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleCancel = () => {
    navigate("/profile/profile"); 
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
      <div className="flex justify-between mt-4">
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-4/5 flex flex-col">
          {/* row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4">
            <div className="relative z-0 mb-6 group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <label
                htmlFor="firstName"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black-600 peer-placeholder-shown:scale-100 px-2 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                Name
              </label>
            </div>

            <div className="relative z-0 mb-6 group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <label
                htmlFor="lastName"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black-600 peer-placeholder-shown:scale-100 px-2 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                Email
              </label>
            </div>
          </div>
          {/* row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4">
            <div className="relative z-0 mb-6 group">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight"
                  ) {
                    e.preventDefault(); 
                  }
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <label
                htmlFor="firstName"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black-600 peer-placeholder-shown:scale-100 px-2 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                Phone
              </label>
            </div>


            <div className="relative z-0 mb-6 group">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
                required
              >
                <option value="">Select a role</option>
                {roleDD.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name}
                  </option>
                ))}
              </select>
              <label
                htmlFor="firstName"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black-600 peer-placeholder-shown:scale-100 px-2 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                Role
              </label>
            </div>
            <div className="relative z-0 mb-6 group">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <label
                htmlFor="firstName"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black-600 peer-placeholder-shown:scale-100 px-2 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                Password
              </label>
              <span className="text-xs text-gray-500 mt-1 block">Leave it blank to keep the current password.</span>
            </div>
            <div className="relative z-0 mb-6 group">
              <input
                type="password"
                value={newConfirmPassword}
                onChange={(e) => setNewConfirmPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <label
                htmlFor="firstName"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black-600 peer-placeholder-shown:scale-100 px-2 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                Confirm Password
              </label>
              <span className="text-xs text-gray-500 mt-1 block">Leave it blank to keep the current password.</span>
              {newPassword && newConfirmPassword && (
                <p className={`text-sm mt-1 ${newPassword === newConfirmPassword ? 'text-green-500' : 'text-red-500'
                  }`}>
                  {newPassword === newConfirmPassword ? '✓ Passwords match' : '✗ Passwords don\'t match'}
                </p>
              )}
            </div>
          </div>
          {/* row 3 ad*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4">
            <div className="relative z-0 mb-6 group">
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <label
                htmlFor="firstName"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black-600 peer-placeholder-shown:scale-100 px-2 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                City
              </label>
            </div>

            <div className="relative z-0 mb-6 group">
              <input
                type="text"
                name="address.district"
                value={formData.address.district}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <label
                htmlFor="lastName"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black-600 peer-placeholder-shown:scale-100 px-2 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                District
              </label>
            </div>
          </div>
          {/* row 4 ad*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4">
            <div className="relative z-0 mb-6 group">
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <label
                htmlFor="firstName"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black-600 peer-placeholder-shown:scale-100 px-2 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                State
              </label>
            </div>

            <div className="relative z-0 mb-6 group">
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <label
                htmlFor="lastName"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black-600 peer-placeholder-shown:scale-100 px-2 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                Street
              </label>
            </div>
          </div>
          {/* row  ad*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4">
            <div className="relative z-0 mb-6 group">
              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
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
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <label
                htmlFor="firstName"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black-600 peer-placeholder-shown:scale-100 px-2 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
              >
                Zip Code
              </label>
            </div>

            <div className="flex flex-col sm:flex-row  mt-2 gap-4">
              <button
                type="submit"
                className="edit-btn">
                <FaRegUser size={20} className="mr-2" />
                Edit Profile
              </button>
            </div>

          </div>

          {/* button */}

          <div className="flex flex-col sm:flex-row justify-end mt-4 gap-4">
            <button className="cancel-btn" onClick={handleCancel}>
              <FcCancel size={20} className="mr-2" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfile