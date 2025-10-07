import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchAcademicYear, fetchClasses, fetchFeeInstallmentTypeDD, fetchFeeTypes } from "@/api/common-api/commonDropDownApi";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { FcCancel } from "react-icons/fc";
import { TbArrowBackUp } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "@/components/Breadcumb";
import { MdOutlineCancel } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import { getFeeInstallmentById, updateFeeInstallmentById } from "@/api/admin-api/lookups-api/feeInstallmentApi";

function EditFeeInstallment() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [feeTypes, setFeeTypes] = useState<any[]>([]);
    const [feeInstallmentTypes, setFeeInstallmentTypes] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        academicYear: '',
        feeType: '',
        feeInstallmentType: '',
        noOfInstallment: 0,
        installments: [{ name: "", _id: "" }],
    });
    const fetcchFeeInstallmentById = async (id: string) => {
        try {
            const response: any = await getFeeInstallmentById(id);
            if (response.success) {
                setFormData({
                    academicYear: response.data.academicYear._id,
                    feeType: response.data.feeType._id,
                    feeInstallmentType: response.data.feeInstallmentType._id,
                    noOfInstallment: response.data.noOfInstallment,
                    installments: response.data.installments.map((installment: any) => ({
                        name: installment.name,
                    })),
                });
            } else {
                toast.error("Error fetching fee installment data");
            }
        }
        catch (error) {
            toast.error("Error fetching fee installment data");
        }
    };
    const getAcademicYears = async () => {
        try {
            const response = await fetchAcademicYear();
            if (response.success) {
                setAcademicYears(response.data);
            }
        } catch (error) {
            toast.error("Error fetching academic years");
        }
    };

    const getFeeTypes = async () => {
        try {
            const response = await fetchFeeTypes();
            if (response.success) {
                setFeeTypes(response.data);
            }
        } catch (error) {
            toast.error("Error fetching fee types");
        }
    };

    const getInstallmentTypes = async () => {
        try {
            const response = await fetchFeeInstallmentTypeDD();
            if (response.success) {
                setFeeInstallmentTypes(response.data);
            }
        } catch (error) {
            toast.error("Error fetching fee installment types");
        }
    };

    useEffect(() => {
        getAcademicYears();
        getFeeTypes();
        getInstallmentTypes();

    }, []);
    useEffect(() => {
        if (id) {
            fetcchFeeInstallmentById(id);
        }
    }, [id]);


    const onReturn = () => {
        navigate("/lookups/fee-installments");
    };

    const handleInstallmentChange = (index: number, value: string) => {
        const newInstallments = [...formData.installments];
        newInstallments[index] = { ...newInstallments[index], name: value };

        setFormData(prev => ({
            ...prev,
            installments: newInstallments,
            noOfInstallment: newInstallments.length
        }));
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addInstallmentField = () => {
        setFormData(prev => ({
            ...prev,
            installments: [...prev.installments, { name: "", _id: "" }],
            noOfInstallment: prev.installments.length + 1
        }));
    };

    const removeInstallmentField = (index: number) => {
        if (formData.installments.length <= 1) return;

        const newInstallments = [...formData.installments];
        newInstallments.splice(index, 1);

        setFormData(prev => ({
            ...prev,
            installments: newInstallments
        }));
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Fee Installments", path: "/lookups/fee-installments" },
        { label: "Edit Fee Installments", path: "" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!id) {
                toast.error("Invalid fee installment ID");
                return;
            }

            const payload:any = {
                academicYear: formData.academicYear,
                feeType: formData.feeType,
                feeInstallmentType: formData.feeInstallmentType,
                noOfInstallment: Number(formData.noOfInstallment),
                installments: formData.installments.map(installment => ({
                    name: installment.name,
                    ...(installment._id && { _id: installment._id }) // Only include _id if it exists
                })),
            };
            const response:any = await updateFeeInstallmentById(id, payload);
            if (response.success) {
                toast.success("Fee Installment updated successfully!");
                navigate("/lookups/fee-installments");
            } else {
                toast.error(response.message || "Failed to update fee installment");
            }
        } catch (error) {
            console.error("Error updating fee installment:", error);
            toast.error("Error updating fee installment");
        }
    };

    return (
        <div className="mt-2">
            <div className="flex flex-col md:flex-row justify-between items-center px-1 mb-3">
                <div>
                    <h3 className="text-xl font-semibold mb-4">Edit Fee Installments</h3>
                    <div className="breadcrumb-section">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>
                <div className="header-btns">
                    <button className="add-btn" onClick={onReturn}>
                        <TbArrowBackUp size={20} className="mr-2" />
                        Back
                    </button>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <div className="flex flex-wrap -mx-2 mt-4">
                        <div className="w-full md:w-1/2 px-2 mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Academic Year <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="academicYear"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.academicYear}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Academic Year</option>
                                {academicYears.map(year => (
                                    <option key={year._id} value={year._id}>
                                        {year.academicYear}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-2 mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Fee Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="feeType"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                value={formData.feeType}
                                onChange={handleChange}
                            >
                                <option value="">Select Fee type</option>
                                {feeTypes.map((type: any) => (
                                    <option key={type._id} value={type._id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-2 mt-4">
                        <div className="w-full md:w-1/2 px-2 mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Fee Installment Type<span className="text-red-500">*</span>
                            </label>
                            <select
                                name="feeInstallmentType"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.feeInstallmentType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Installment Type</option>
                                {feeInstallmentTypes.map(year => (
                                    <option key={year._id} value={year._id}>
                                        {year.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/2 px-2 mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                No of Installments<span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={formData.noOfInstallment}
                                    // readOnly
                                    name="noOfInstallment"
                                    onChange={handleChange}
                                    required
                                    onKeyDown={(e) => {
                                        if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                                            e.preventDefault();
                                        }
                                    }
                                    }
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold">Installment</h4>
                            <button
                                type="button"
                                onClick={addInstallmentField}
                                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg"
                            >
                                <IoMdAddCircleOutline className="mr-1" />
                                Add Installment
                            </button>
                        </div>

                        {formData.installments.map((installment, index) => (
                            <div key={index} className="flex flex-wrap -mx-2 mb-4 items-center">
                                <div className="w-full md:w-11/12 px-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Installment {index + 1} Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={installment.name}
                                        onChange={(e) => handleInstallmentChange(index, e.target.value)}
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="w-full md:w-1/12 px-2 flex items-end">
                                    {formData.installments.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeInstallmentField(index)}
                                            className="text-red-500 hover:text-red-700 p-2"
                                            title="Remove installment"
                                        >
                                            <MdOutlineCancel size={24} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-6 space-x-3">
                        <div className="flex space-x-2">
                            <button type="submit" className="submit-btn flex items-center">
                                <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={onReturn}
                                className="cancel-btn flex items-center"
                            >
                                <FcCancel size={20} className="mr-2" />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditFeeInstallment