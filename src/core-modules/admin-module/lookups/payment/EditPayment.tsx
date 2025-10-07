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
import { createFeeInstallment } from "@/api/admin-api/lookups-api/feeInstallmentApi";
import { getPaymentById, updatePaymentById } from "@/api/admin-api/lookups-api/paymentApi";

interface Installment {
    feeInstallmentType: string;
    installmentName: string;
    noOfInstallments: number;
    name: string;
    feeAmount: number;
    discountAmount: number;
    payableAmount: number;
}

interface FormData {
    feeName: string;
    feeAmount: number;
    academicYear: string;
    class: string[];
    installments: Installment[];
    feeInstallmentType: string;
    noOfInstallment: number;
}

function EditPayment() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [feeInstallmentTypes, setFeeInstallmentTypes] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
    const [paymentData, setPaymentData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<any>({
        feeName: '',
        feeAmount: 0,
        academicYear: '',
        class: [],
        installments: [{
            feeInstallmentType: "",
            installmentName: "",
            noOfInstallments: 0,
            name: "",
            feeAmount: 0,
            discountAmount: 0,
            payableAmount: 0
        }]
    });

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

    const getClasses = async () => {
        try {
            const response = await fetchClasses();
            if (response.success) {
                setClasses(response.data);
            }
        } catch (error) {
            toast.error("Error fetching classes");
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
        getInstallmentTypes();
        getClasses();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (event.target instanceof Element && event.target.closest('.relative') === null) {
                setIsClassDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const fetchPaymentById = async (id: string) => {
        try {
            const responseData = await getPaymentById(id);
            if (responseData.success) {
                setPaymentData(responseData?.data);
                const payment = responseData.data;
                const transformedData = {
                    feeName: payment.feeName,
                    feeAmount: payment.feeAmount,
                    academicYear: payment.academicYear._id,
                    class: payment.class.map((c: any) => c._id),
                    installments: payment.installments.map((inst: any) => ({
                        _id: inst._id,
                        feeInstallmentType: inst.feeInstallmentType._id,
                        installmentName: inst.installmentName,
                        noOfInstallments: inst.noOfInstallments,
                        name: inst.name,
                        feeAmount: inst.feeAmount,
                        discountAmount: inst.discountAmount,
                        payableAmount: inst.payableAmount
                    }))
                };
                setFormData(transformedData);
            } else {
                setError("Payment data not found");
            }
        } catch (error: any) {
            console.error("Error fetching payment data:", error);
            setError(error.response?.data?.message || "Error fetching payment data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPaymentById(id);
        }
    }, [id]);
    const onReturn = () => {
        navigate("/lookups/payments");
    };

    const handleClassChange = (classId: string) => {
        setFormData((prev: { class: string[]; }) => {
            if (prev.class.includes(classId)) {
                return {
                    ...prev,
                    class: prev.class.filter((id: string) => id !== classId)
                };
            } else {
                return {
                    ...prev,
                    class: [...prev.class, classId]
                };
            }
        });
    };

    const handleInstallmentChange = (index: number, field: keyof Installment, value: string | number) => {
        const newInstallments = [...formData.installments];
        const updatedInstallment = {
            ...newInstallments[index],
            [field]: value,
        };

        // Auto-calculate payableAmount when feeAmount or discountAmount changes
        if (field === 'feeAmount' || field === 'discountAmount') {
            const fee = field === 'feeAmount' ? Number(value) : updatedInstallment.feeAmount;
            const discount = field === 'discountAmount' ? Number(value) : updatedInstallment.discountAmount;
            updatedInstallment.payableAmount = fee - discount;
        }

        newInstallments[index] = updatedInstallment;
        setFormData((prev: any) => ({
            ...prev,
            installments: newInstallments
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: name === 'feeAmount' || name === 'noOfInstallment' ? Number(value) : value,
        }));
    };

    const addInstallmentField = () => {
        setFormData((prev: { installments: any; }) => ({
            ...prev,
            installments: [
                ...prev.installments,
                {
                    feeInstallmentType: "",
                    installmentName: "",
                    noOfInstallments: 0,
                    name: "",
                    feeAmount: 0,
                    discountAmount: 0,
                    payableAmount: 0
                }
            ]
        }));
    };

    const removeInstallmentField = (index: number) => {
        if (formData.installments.length <= 1) return;

        const newInstallments = [...formData.installments];
        newInstallments.splice(index, 1);

        setFormData((prev: any) => ({
            ...prev,
            installments: newInstallments
        }));
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Payments", path: "/lookups/payments" },
        { label: "Edit Payment", path: "" },
    ];
    const totalFeeAmount = formData.installments.reduce(
        (sum: any, installment: { payableAmount: any; }) => sum + (installment.payableAmount || 0),
        0
    );
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                feeName: formData.feeName,
                feeAmount: totalFeeAmount,
                academicYear: formData.academicYear,
                class: formData.class,
                feeInstallmentType: formData.feeInstallmentType,
                noOfInstallment: formData.noOfInstallment,
                installments: formData.installments
            };
            if (!id) {
                toast.error("Invalid payment ID");
                return;
            }
            const response = await updatePaymentById(id, payload);
            if (response.success) {
                toast.success("Fee Installment created successfully!");
                navigate("/lookups/payments");
            } else {
                toast.error(response.message || "Failed to create fee installment");
            }
        } catch (error) {
            toast.error("Error creating fee installment");
        }
    };

    // Calculate total fee amount
    // Calculate total fee amount from payableAmount


    return (
        <div className="container mx-auto p-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
                        <h3 className="text-xl font-semibold mb-4">Edit Payment</h3>
                        <div className="breadcrumb-section">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                    </div>
               
           
                <div className="header-btns">
                    <button
                        type="button"
                        className="add-btn flex items-center"
                        onClick={onReturn}
                    >
                        <TbArrowBackUp size={20} className="mr-2" />
                        Back
                    </button>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium border-b pb-2 mb-4 p-2 bg-green-50">
            Basic Information
                    </h4>
                <div className="">
                    <div className="flex flex-wrap -mx-2">
                        <div className="w-full md:w-1/3 px-2 mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Fee Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="feeName"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.feeName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3 px-2 mb-4">
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

                        <div className="w-full md:w-1/3 px-2 mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Class<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex justify-between items-center"
                                    onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                                >
                                    {formData.class.length > 0
                                        ? `${formData.class.length} selected`
                                        : "Select classes"}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {isClassDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                        {classes.map(classData => (
                                            <label key={classData._id} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                                                    checked={formData.class.includes(classData._id)}
                                                    onChange={() => handleClassChange(classData._id)}
                                                />
                                                <span className="ml-2">{classData.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>
                

                    <div className="mt-4">
                    <div className="flex justify-between items-center mb-4 font-medium border-b pb-2 mb-4 p-2 bg-green-50">
                    <h4 className="text-lg font-semibold">Installments</h4>
                            <button
                                type="button"
                                onClick={addInstallmentField}
                                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg"
                            >
                                <IoMdAddCircleOutline className="mr-1" />
                                Add Installment
                            </button>
                        </div>

                        {formData.installments.map((installment: any, index: any) => (
                            <div key={index} className="flex flex-wrap -mx-2 mb-4 items-center border-b pb-4">
                                <div className="w-full md:w-1/3 px-2 mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Installment Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={installment.installmentName}
                                        onChange={(e) => handleInstallmentChange(index, 'installmentName', e.target.value)}
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-2 mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Installment Type<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={installment.feeInstallmentType}
                                        onChange={(e) => handleInstallmentChange(index, 'feeInstallmentType', e.target.value)}
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Installment Type</option>
                                        {feeInstallmentTypes.map(type => (
                                            <option key={type._id} value={type._id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full md:w-1/3 px-2 mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={installment.name}
                                        onChange={(e) => handleInstallmentChange(index, 'name', e.target.value)}
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-2 mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        No of Installments<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={installment.noOfInstallments}
                                        onChange={(e) => handleInstallmentChange(index, 'noOfInstallments', Number(e.target.value))}
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-2 mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Fee Amount<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={installment.feeAmount}
                                        onChange={(e) => handleInstallmentChange(index, 'feeAmount', Number(e.target.value))}
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-2 mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Discount Amount<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={installment.discountAmount}
                                        onChange={(e) => handleInstallmentChange(index, 'discountAmount', Number(e.target.value))}
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="w-full md:w-1/3 px-2 mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Payable Amount<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={installment.payableAmount}
                                        readOnly
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                                    />
                                </div>
                                <div className="w-full md:w-1/12 px-2 flex items-end ">
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
                    <div className="flex flex-col">
                        <div className="flex flex-wrap -mx-2 mt-4 justify-end">
                            <div className="w-full md:w-1/2 px-2 mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Total Fee Amount <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={totalFeeAmount.toFixed(2)}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    <div className="flex justify-end mt-6 space-x-3">
                        <div className="flex space-x-2">
                        <button
                                type="button"
                                onClick={onReturn}
                                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors shadow-sm"

                            >
                                <FcCancel size={20} className="mr-2" />
                                Cancel
                            </button>
                            <button type="submit"className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm hover:shadow-md disabled:opacity-70">
                                <IoCheckmarkDoneCircleOutline size={22} className="mr-2" />
                                Submit
                            </button>
                      
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditPayment;