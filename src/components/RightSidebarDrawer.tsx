import React from "react";
import { FaWindowClose } from "react-icons/fa";
import { IoFilterSharp } from "react-icons/io5";
import CustomDatePicker from "../components/CustomDatePicker";

interface RightSidebarDrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  handleFromDateChanges: any;
  handleToDateChanges: any;
  handleFilterWithDate:any
}

const RightSidebarDrawer: React.FC<RightSidebarDrawerProps> = ({
  isOpen,
  toggleDrawer,
  handleFromDateChanges,
  handleToDateChanges,
  handleFilterWithDate,
}) => {
  return (
    <div>
      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-700 text-white transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-40`}
      >
        {/* Sidebar Header with Close Button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-500">
          <h2 className="text-xl font-bold flex items-center  ">
            Filter{" "}
            <IoFilterSharp
              title="FILTER"
              size={24}
              color="white"
              className="ml-2"
            />
          </h2>
          <button onClick={toggleDrawer} className="focus:outline-none">
            <FaWindowClose size={24} color="white" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-2">
          <ul>
            <li className="mb-2 hover:bg-gray-700 p-2 rounded">
              <CustomDatePicker
                label={""}
                handleFromDateChanges={handleFromDateChanges}
                handleToDateChanges={handleToDateChanges}
                handleFilterWithDate={handleFilterWithDate}
              />
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={toggleDrawer}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        ></div>
      )}
    </div>
  );
};

export default RightSidebarDrawer;
