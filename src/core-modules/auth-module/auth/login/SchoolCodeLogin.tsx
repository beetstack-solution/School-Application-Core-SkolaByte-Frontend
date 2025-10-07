import { schoolCodeLoginApi } from "@/api/auth-api/schoolCodeLoginApi";
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/images/Skolabyte Logo.png";
import beatstack from "@/assets/images/Beetstack Logo.png"; // Assuming you have a beatstack image in your assets

function SchoolCodeLogin() {
  const navigate = useNavigate();
  const [schoolCode, setSchoolCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSchoolCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSchoolCode(event.target.value);
  };

  const handleSchoolCodeSubmit = async () => {
    if (!schoolCode.trim()) {
      alert("Please enter a school code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await schoolCodeLoginApi(schoolCode.toLowerCase(), "");
      if (response.success) {
        localStorage.setItem("schoolCode", schoolCode);
        localStorage.setItem("x-school-apikey", response.data.schoolApiKey);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c75bc] to-[#90a63b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#a21f3c] opacity-10 mix-blend-multiply"></div>
      <div className="absolute -bottom-40 -right-20 w-80 h-80 rounded-full bg-[#90a63b] opacity-10 mix-blend-multiply"></div>
      <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-[#1c75bc] opacity-10 mix-blend-multiply"></div>

      {/* Main card */}
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden z-10">
        <div className="flex flex-col md:flex-row">
          {/* Visual section */}
          <div className="w-full md:w-2/5 bg-gradient-to-b from-purple-100 to-[#1c75bc] p-8 flex flex-col justify-center items-center text-[#90a63b]">
            <div className="absolute -top-48 left-8 w-72 h-72 rounded-full bg-[#96caf5] opacity-20 mix-blend-multiply"></div>
            <div className="absolute -bottom-36 left-4 w-80 h-80 rounded-full bg-[#2d82c8] opacity-10 mix-blend-multiply"></div>
            <div className="mb-6">
              <img src={logo} alt="Skolabyte Logo" className="h-20 w-60" />
            </div>
            <h1 className="text-4xl font-bold mb-6 text-center text-white">
              Welcome
            </h1>
            <p className="text-white/80 text-center">
              Your gateway to seamless school management
            </p>
            <div className="mt-8 w-full max-w-xs">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#2873af] rounded-full w-3/4"></div>
              </div>
            </div>
          </div>

          {/* Form section */}
          <div className="w-full md:w-3/5 p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                School Access
              </h2>
              <p className="text-gray-600">
                Enter your institution's unique code
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="schoolCode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  School Identifier
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="schoolCode"
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1c75bc] focus:border-transparent transition-all capitalize"
                    placeholder="e.g. SCH12345"
                    value={schoolCode}
                    onChange={handleSchoolCodeChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <button
                  onClick={handleSchoolCodeSubmit}
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-lg font-medium text-white bg-[#90a63b] hover:bg-[#7e9131] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a21f3c] transition-all ${
                    isLoading ? "opacity-90" : "shadow-md hover:shadow-lg"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    "Continue to Login"
                  )}
                </button>
              </div>
              <div className="pt-4 border-t border-gray-200"></div>
            </div>

            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">
                Secure access powered by{" "}
                <span className="text-[#1c75bc] font-medium">
                  <img
                    src={beatstack}
                    alt="beatstack logo"
                    className="inline-block w-24 h-9 mr-1"
                  />
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchoolCodeLogin;
