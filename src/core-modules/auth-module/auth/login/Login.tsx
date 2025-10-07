import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../../redux/slices/adminSlice";
import { useNavigate } from "react-router-dom";
import SpinnerLoader from "@/components/SpinnerLoader";
import logo from "@/assets/images/Skolabyte Logo.png";
import beatstack from "@/assets/images/Beetstack Logo.png";
import { MdOutlineSupportAgent } from "react-icons/md";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPostLoginLoader, setShowPostLoginLoader] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { loading, error, currentSchoolAdmin } = useSelector(
    (state: any) => state.user
  );

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("rememberedEmail");
    const savedPassword = sessionStorage.getItem("rememberedPassword");

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  if (rememberMe && currentSchoolAdmin?.token) {
    sessionStorage.setItem("authToken", currentSchoolAdmin.token);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(false);
    setIsAuthenticating(true);
    try {
      await dispatch(loginUser({ email, password }));
      if (rememberMe) {
        sessionStorage.setItem("rememberedEmail", email);
        sessionStorage.setItem("rememberedPassword", password);
      } else {
        sessionStorage.removeItem("rememberedEmail");
        sessionStorage.removeItem("rememberedPassword");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    if (currentSchoolAdmin) {
      navigate("/");
    }
  }, [currentSchoolAdmin, navigate]);

  useEffect(() => {
    if (currentSchoolAdmin) {
      setShowPostLoginLoader(true);
      const timer = setTimeout(() => {
        navigate("/");
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [currentSchoolAdmin, navigate]);

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);

    if (!isChecked) {
      sessionStorage.removeItem("rememberedEmail");
      sessionStorage.removeItem("authToken");
    }
  };

  return (
    <>
      {showPostLoginLoader && <SpinnerLoader />}

      {/* Main container with overflow control */}
      <div
        className={`fixed inset-0 flex items-center justify-center p-4 ${
          showPostLoginLoader ? "opacity-0" : "opacity-100"
        }`}
        style={{ overflow: "hidden" }}
      >
        {/* Enhanced background */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1c75bc] via-[#eee6e8] to-[#eaf4c2]"></div>

          {/* Background elements */}
          <div className="absolute top-20 left-20 w-80 h-80 bg-[#a21f3c]/5 rounded-full filter blur-[100px] animate-float-slow"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#1c75bc]/5 rounded-full filter blur-[120px] animate-float-medium"></div>

          {/* Texture */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
              linear-gradient(to bottom, transparent 95%, #a21f3c10 95%),
              linear-gradient(to right, #1c75bc10 1px, transparent 1px)
            `,
              backgroundSize: "100% 40px, 40px 100%",
            }}
          ></div>

          {/* Floating school icons */}
          <div className="absolute top-1/4 left-1/5 text-[#a21f3c]/10 text-6xl animate-float-xslow">
            📚
          </div>
          <div className="absolute bottom-1/3 right-1/4 text-[#1c75bc]/10 text-7xl animate-float-medium">
            🏫
          </div>
          <div className="absolute top-1/3 right-1/5 text-[#90a63b]/10 text-5xl animate-float-fast">
            ✏️
          </div>
        </div>

        {/* Support Button - Fixed at bottom right */}
        <button
          onClick={() => setShowSupportPopup(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
    fixed bottom-6 right-6
    flex items-center justify-center gap-2
    bg-[#1c75bc] hover:bg-[#155a8a] text-white
    p-4 rounded-full shadow-lg hover:shadow-xl
    transition-all duration-300 ease-in-out
    z-50
    ${isHovered ? "md:pr-6" : ""}
  `}
          aria-label="Support"
        >
          <MdOutlineSupportAgent className="text-lg" size={20} />
          {isHovered && (
            <span className="hidden md:inline text-sm font-medium">Help</span>
          )}
        </button>

        {/* Support Popup */}
        {showSupportPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative">
              <button
                onClick={() => setShowSupportPopup(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close support popup"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h3 className="text-2xl font-bold text-[#1c75bc] mb-6">
                Support Center
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#a21f3c] mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Phone Support
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      +91 6282345226
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#a21f3c] mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Email Support
                    </p>
                    <a
                      href="mailto:support.skolabyte@gmail.com"
                      className="text-lg font-semibold text-gray-800"
                    >
                      support.skolabyte@gmail.com
                    </a>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled
                    className="w-full py-3 px-4 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed"
                  >
                    Raise a Ticket (Coming Soon)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content container */}
        <div
          className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          style={{ maxHeight: "90vh" }}
        >
          {/* Branding section */}
          <div className="hidden lg:flex flex-col items-start space-y-10 p-8 bg-white/20 rounded-3xl shadow-lg border border-white/20 backdrop-blur-md animate-float-slow overflow-y-auto h-[80vh]">
            <div className="flex items-center justify-center">
              <img src={logo} alt="Skolabyte Logo" className="w-52 h-auto" />
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight text-gray-800">
                <span className="text-[#a21f3c]">Smart School</span> Management
                Simplified
              </h1>

              <p className="text-xl text-gray-700 font-medium">
                The complete digital solution for modern educational
                institutions
              </p>

              <div className="space-y-5">
                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 mt-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#1c75bc] animate-pulse group-hover:bg-[#a21f3c] transition-colors flex items-center justify-center">
                      <span className="text-white text-xs">1</span>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 font-medium group-hover:text-[#1c75bc] transition-colors">
                    Easy Attendance System
                  </p>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 mt-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#a21f3c] animate-pulse group-hover:bg-[#90a63b] transition-colors flex items-center justify-center">
                      <span className="text-white text-xs">2</span>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 font-medium group-hover:text-[#a21f3c] transition-colors">
                    Smart Timetable Management
                  </p>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 mt-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#90a63b] animate-pulse group-hover:bg-[#1c75bc] transition-colors flex items-center justify-center">
                      <span className="text-white text-xs">3</span>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 font-medium group-hover:text-[#90a63b] transition-colors">
                    Substitute Teacher Allocation
                  </p>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 mt-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#1c75bc] animate-pulse group-hover:bg-[#a21f3c] transition-colors flex items-center justify-center">
                      <span className="text-white text-xs">4</span>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 font-medium group-hover:text-[#1c75bc] transition-colors">
                    Admin Dashboard & Analytics
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Login card */}
          <div
            className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/30 transform hover:scale-[1.01] transition-all duration-500 overflow-y-auto"
            style={{ maxHeight: "80vh" }}
          >
            <div className="p-5">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Welcome Back!
                </h2>
                <p className="text-lg text-gray-600 font-medium">
                  Access your institution's management dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="space-y-2">
                  <label
                    className="block text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    htmlFor="email"
                  >
                    Email or Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="school@domain.edu"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c75bc]/60 focus:border-transparent transition-all bg-white/70"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className="block text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    htmlFor="password"
                  >
                    Password
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
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1c75bc]/60 focus:border-transparent transition-all bg-white/70"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5 text-gray-500 hover:text-[#1c75bc]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-gray-500 hover:text-[#1c75bc]"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                            clipRule="evenodd"
                          />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                      className="h-5 w-5 text-[#1c75bc] focus:ring-[#1c75bc] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-3 block text-sm text-gray-700 font-medium"
                    >
                      Remember this device
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className={`w-full flex justify-center items-center px-6 py-4 rounded-xl font-bold text-white ${
                    isAuthenticating
                      ? "bg-[#90a63b]"
                      : "bg-[#869937] hover:bg-[#6a7b27]"
                  } shadow-lg transition-all duration-300 transform hover:scale-[1.01]`}
                >
                  {isAuthenticating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
                      Accessing Portal...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Enter School Portal
                    </>
                  )}
                </button>

                {/* Footer section */}
                <div className="pt-6 text-center space-y-1">
                  <p className="text-xs text-gray-500">
                    Powered by{" "}
                    <span>
                      <img
                        src={beatstack}
                        alt="beatstack logo"
                        className="inline-block w-28 h-9 object-fit-cover"
                      />
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    © {new Date().getFullYear()} All rights reserved
                  </p>
                </div>
              </form>

              {error && (
                <div className="mt-8 p-4 bg-red-50/90 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Access Denied
                      </h3>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        .animate-float-slow { animation: float 8s ease-in-out infinite; }
        .animate-float-medium { animation: float 6s ease-in-out infinite; }
        .animate-float-fast { animation: float 4s ease-in-out infinite; }
        .animate-float-xslow { animation: float 10s ease-in-out infinite; }
      `}</style>
    </>
  );
};

export default Login;
