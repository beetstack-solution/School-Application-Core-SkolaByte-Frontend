import React from "react";
// Assuming fetchAcademicYear is correctly imported from your project structure
import { fetchAcademicYear } from "@/api/common-api/commonDropDownApi";
// Assuming toast is correctly imported and configured
import { toast } from "react-toastify";

// Interface for the structure of individual academic year data from the API
interface AcademicYearData {
    _id: string;
    code: string;
    academicYear: string; 
    startMonth: number;   
    endMonth: number;
    academicYearAlias: string;
    status: boolean;
    isDeleted: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    userUpdatedBy?: string;
    userUpdatedDate?: string;
}

// Interface for the props of the AcademicYearDropdown component
interface AcademicYearDropdownProps {
    value: any; // The currently selected academic year ID
    onChange: (value: string) => void; // Callback function when selection changes
    required?: boolean; // Is the dropdown selection required?
    disabled?: boolean; // Is the dropdown disabled?
}

const AcademicYearDropdown: React.FC<AcademicYearDropdownProps> = ({
    value,
    onChange,
    required = false,
    disabled = false,
}) => {
    // State to store the list of academic years fetched from the API
    const [academicYears, setAcademicYears] = React.useState<AcademicYearData[]>([]);
    // State to manage the loading status while fetching data
    const [loading, setLoading] = React.useState(true);

    // Get the current year and month (1-indexed for month)
    const currentSystemYear = new Date().getFullYear();
    const currentSystemMonth = new Date().getMonth() + 1;

    console.log("currentSystemYear", currentSystemYear, "currentSystemMonth", currentSystemMonth);

    React.useEffect(() => {
        const loadAcademicYears = async () => {
            try {
                const response = await fetchAcademicYear();
                if (response.success) {
                    const fetchedYears: any[] = response.data;
                    setAcademicYears(fetchedYears);

                    if (value === "" && fetchedYears.length > 0) {
                        let defaultSelectedYearId = "";

                        // Variables to store the best candidates for each scenario
                        let currentYearMatchId: string | null = null;
                        let currentYearMatchStartMonth: number = -1; // Store startMonth to pick the "latest starting" current year

                        let previousYearMatchId: string | null = null;
                        let previousYearMatchStartMonth: number = 13; // Store startMonth to pick the "earliest starting" (but still future) previous year

                        for (const yearData of fetchedYears) {
                            const academicYearStringParts = yearData.academicYear.split('-');
                            if (academicYearStringParts.length === 2) {
                                const academicStartYear = parseInt(academicYearStringParts[0], 10);
                                const apiStartMonth = yearData.startMonth;

                                // Scenario 1: Current year is the academic start year, and current month is >= academic start month
                                // This is the preferred scenario.
                                // e.g., Current: May 2025. Academic Year: 2025-2026, Start Month: May (or earlier like Jan)
                                if (academicStartYear === currentSystemYear && currentSystemMonth >= apiStartMonth) {
                                    // If this is a better match for the "current year" scenario (e.g., starts later but still valid)
                                    if (!currentYearMatchId || apiStartMonth > currentYearMatchStartMonth) {
                                        currentYearMatchId = yearData._id;
                                        currentYearMatchStartMonth = apiStartMonth;
                                    }
                                }
                                // Scenario 2: Previous year is the academic start year, and current month is < academic start month
                                // This is the fallback scenario.
                                // e.g., Current: May 2025. Academic Year: 2024-2025, Start Month: June
                                else if (academicStartYear === currentSystemYear - 1 && currentSystemMonth < apiStartMonth) {
                                    // If this is a better match for the "previous year" scenario (e.g., starts earlier but still valid)
                                    if (!previousYearMatchId || apiStartMonth < previousYearMatchStartMonth) {
                                        previousYearMatchId = yearData._id;
                                        previousYearMatchStartMonth = apiStartMonth;
                                    }
                                }
                            }
                        }

                        // Prioritize the current year match
                        if (currentYearMatchId) {
                            defaultSelectedYearId = currentYearMatchId;
                        } else if (previousYearMatchId) { // Fallback to previous year match
                            defaultSelectedYearId = previousYearMatchId;
                        }

                        if (defaultSelectedYearId) {
                            onChange(defaultSelectedYearId);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching academic years:", error);
        
            } finally {
                setLoading(false);
            }
        };

        loadAcademicYears();
    }, [value, onChange, currentSystemYear, currentSystemMonth]); // Added dependencies that are used inside useEffect
    // Note: currentSystemYear and currentSystemMonth are stable during component lifecycle unless remounted.
    // `value` is included because the condition `value === ""` depends on it.
    // `onChange` is included as it's a callback from props.

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={required}
            disabled={disabled || loading}
        >
            <option value="">Select Academic Year</option>
            {academicYears.map((year) => (
                <option key={year._id} value={year._id}>
                    {year.academicYear}
                </option>
            ))}
        </select>
    );
};

export default AcademicYearDropdown;
