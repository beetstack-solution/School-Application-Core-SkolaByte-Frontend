import { FaRegUser } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import profileImg from "@/assets/images/login/profile.png";
import { useSelector } from "react-redux";
import { fetchuserById, SingleUserDataResponse, UserData } from "@/api/admin-api/base-api/userApi";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchRoles, RolesResponse } from "@/api/admin-api/common-setting-api/roleApi";
import { toast } from "react-toastify";

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<SingleUserDataResponse>();
  const [roleDD, setRoleDD] = useState<RolesResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get user from Redux store
  const currentUser = useSelector((state: { user: { currentSchoolAdmin: any } }) => state.user.currentSchoolAdmin);
  

  const { id } = useParams<{ id: string }>();
  const userId = id || currentUser?._id;

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetchuserById(userId);
      if (response.success) {
        setUserData(response); 
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

    const getRoleName = () => {
      if (!userData?.data.role || !roleDD.length) return "";
      const foundRole = roleDD.find(role => role._id === userData.data.role);
      return foundRole ? foundRole.name : "";
    };

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    } else {
      setLoading(false);
      setError("No user ID available");
    }
  }, [userId]);

  const handleCancel = () => {
    navigate("/users");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading user data...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!userData) {
    return <div className="flex justify-center items-center h-screen">No user data available</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4">
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
      {/* Top Bar with Edit Button */}
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-bold text-gray-800">User Profile</h3>
        <Link to={`/profile/edit-profile/${userData.data.id}`}>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm">
            <FaRegUser size={16} className="mr-2" />
            Edit Profile
          </button>
        </Link>
      </div>
  
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Image - Left Aligned */}
        <div className="flex flex-col items-center md:items-start">
          <div className="relative">
            <img
              src={profileImg}
              alt="Profile"
              className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-white shadow-lg"
            />
            <div className="absolute inset-0 rounded-full border-2 border-blue-100 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
  
        {/* Profile Form */}
        <div className="flex-1 space-y-6">
          <form className="space-y-6">
            {/* Email - Full Width */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  readOnly
                  value={userData.data.email || ""}
                  className="block w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
              </div>
            </div>
  
            {/* Name and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  readOnly
                  value={userData.data.name || ""}
                  className="block w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  readOnly
                  value={userData.data.phone || ""}
                  className="block w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
              </div>
            </div>
  
            {/* Role and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  name="role"
                  readOnly
                  value={getRoleName()}
                  className="block w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  readOnly
                  value={userData.data.address?.city || ""}
                  className="block w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
              </div>
            </div>
  
            {/* State and Street */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  name="state"
                  readOnly
                  value={userData.data.address?.state || ""}
                  className="block w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Street</label>
                <input
                  type="text"
                  name="street"
                  readOnly
                  value={userData.data.address?.street || ""}
                  className="block w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
              </div>
            </div>
  
            {/* Zip Code and District */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  readOnly
                  value={userData.data.address?.zipCode || ""}
                  className="block w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">District</label>
                <input
                  type="text"
                  name="district"
                  readOnly
                  value={userData.data.address?.district || ""}
                  className="block w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                />
              </div>
            </div>
  
            {/* Cancel Button (now at bottom) */}
            <div className="flex justify-end pt-6">
              <button 
                onClick={handleCancel}
                className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
              >
                <FcCancel size={18} className="mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Profile;