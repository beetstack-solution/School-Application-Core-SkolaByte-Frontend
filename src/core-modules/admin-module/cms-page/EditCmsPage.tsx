import { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Modal, Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { updatePage, fetchPageById } from "@/api/super-admin-api/cms-page-api/cmsPageApi";
import Breadcrumb from "@/components/Breadcumb";
import { TbArrowBackUp } from "react-icons/tb";

interface Page {
    _id: string;
    name: string;
    pageCode: string;
}

interface MetaData {
    metaTitle: string;
    metaDescription: string;
    metaAuthor: string;
    metaKeywords: string;
}

interface FormData {
    pageUrl: string;
    pageTitle: string;
    name: string;
    shortDescription: string;
    description: string;
    content: string;
    meta: MetaData;
    metaTags: string;
    pageBannerImage: File | null;
    brochure: File | null;
    headerText: string;
    headerSubText: string;
}

const EditCmsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [file, setFile] = useState<File | null>(null);
    const [showSourceModal, setShowSourceModal] = useState(false);
    const [sourceCode, setSourceCode] = useState("");
    const [pageNames, setPageNames] = useState<Page[]>([]);
    const [pageBannerPreview, setPageBannerPreview] = useState<string | null>(null);
    const [brochurePreview, setBrochurePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        pageUrl: "",
        pageTitle: "",
        name: "",
        shortDescription: "",
        description: "",
        content: "",
        meta: {
            metaTitle: "",
            metaDescription: "",
            metaAuthor: "",
            metaKeywords: "",
        },
        metaTags: "",
        pageBannerImage: null,
        brochure: null,
        headerText: "",
        headerSubText: "",
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = event.target;
        if (files && files.length > 0) {
            const file = files[0];
            setFormData((prev) => ({
                ...prev,
                [name]: file,
            }));

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            if (name === 'pageBannerImage') {
                setPageBannerPreview(previewUrl);
            } else if (name === 'brochure') {
                setBrochurePreview(previewUrl);
            }
        }
    };
    useEffect(() => {
        return () => {
            // Clean up preview URLs when component unmounts
            if (pageBannerPreview) URL.revokeObjectURL(pageBannerPreview);
            if (brochurePreview) URL.revokeObjectURL(brochurePreview);
        };
    }, [pageBannerPreview, brochurePreview]);
    const handleSourceCode = () => {
        setShowSourceModal(true);
        setSourceCode(formData.content);
    };

    const handleSaveSourceCode = () => {
        setFormData({
            ...formData,
            content: sourceCode,
        });
        setShowSourceModal(false);
    };

    const modules = {
        toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
            ],
            ["link", "image"],
            ["clean"],
        ],
    };

    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.startsWith("meta.")) {
            const metaField = name.split(".")[1];
            setFormData((prevData) => ({
                ...prevData,
                meta: {
                    ...prevData.meta,
                    [metaField]: value,
                },
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleContentChange = (content: string) => {
        setFormData((prevData) => ({
            ...prevData,
            content,
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formDataToSend: any = new FormData();

        Object.keys(formData).forEach((key) => {
            if (key === "meta") {
                const metaArray = [
                    {
                        metaTitle: formData.meta.metaTitle,
                        metaDescription: formData.meta.metaDescription,
                        metaAuthor: formData.meta.metaAuthor,
                        metaKeywords: formData.meta.metaKeywords
                            .split(",")
                            .map((keyword) => keyword.trim()),
                    },
                ];

                metaArray.forEach((meta, index) => {
                    Object.keys(meta).forEach((metaKey) => {
                        formDataToSend.append(`meta[${index}][${metaKey}]`, meta[metaKey as keyof typeof meta]);
                    });
                });
            } else {
                const value = formData[key as keyof FormData];
                if (value !== null) {
                    formDataToSend.append(key, value as string | Blob);
                }
            }
        });

        try {
            if (!id) {
                toast.error("Invalid page ID.");
                return;
            }
            const response: any = await updatePage(id, formDataToSend);

            if (response.success) {
                toast.success("Page added successfully!");
                setTimeout(() => {
                    navigate("/page");
                }, 1000);
                setFormData({
                    pageUrl: "",
                    pageTitle: "",
                    name: "",
                    shortDescription: "",
                    description: "",
                    content: "",
                    meta: {
                        metaTitle: "",
                        metaDescription: "",
                        metaAuthor: "",
                        metaKeywords: "",
                    },
                    metaTags: "",
                    pageBannerImage: null,
                    brochure: null,
                    headerText: "",
                    headerSubText: ""
                });
            } else {
                console.error("Failed to create page:", response.message);
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Error during page creation:", error);
            toast.error("An error occurred while creating the page");
        }
    };
const  fetchPageData = async () => {
        if (!id) {
            toast.error("Invalid page ID.");
            return;
        }

        try {
            const response: any = await fetchPageById(id);

            if (response.success) {
                const pageData = response.page;
                setFormData({
                    pageUrl: pageData.pageUrl,
                    pageTitle: pageData.pageTitle,
                    name: pageData.name,
                    shortDescription: pageData.shortDescription,
                    description: pageData.description,
                    content: pageData.content,
                    meta: {
                        metaTitle: pageData.meta[0].metaTitle,
                        metaDescription: pageData.meta[0].metaDescription,
                        metaAuthor: pageData.meta[0].metaAuthor,
                        metaKeywords: pageData.meta[0].metaKeywords.join(", "),
                    },
                    metaTags: pageData.metaTags.join(", "),
                    pageBannerImage: null, // File input will not be pre-filled
                    brochure: null, // File input will not be pre-filled
                    headerText: pageData.headerText,
                    headerSubText: pageData.headerSubText
                });
                // Set preview URLs if files exist
                if (pageData.pageBannerImage) {
                    setPageBannerPreview(pageData.pageBannerImage); // URL to the existing image
                }
                if (pageData.brochure) {
                    setBrochurePreview(pageData.brochure); // URL to the existing PDF
                }
            } else {
                toast.error("Failed to fetch CMS Page data.");
            }
        } catch (error) {
            console.error("Error fetching CMS Page data:", error);
            toast.error("An error occurred while fetching the CMS Page data.");
        }
    }
    useEffect(() => {
        fetchPageData();
    }, []);

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "CMS Page", path: "/page" },
        { label: "Edit Page", path: "" },
    ];

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Edit CMS Page</h2>
                        <div className="mt-2">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                    </div>
                    <button
                        className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                        onClick={() => navigate(-1)}
                    >
                        <TbArrowBackUp size={20} className="mr-2" />
                        Back
                    </button>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Page Name & Title */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Page Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="pageTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                Page Title
                            </label>
                            <input
                                type="text"
                                id="pageTitle"
                                name="pageTitle"
                                value={formData.pageTitle}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Short Description & Description */}
                        <div>
                            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                Short Description
                            </label>
                            <textarea
                                id="shortDescription"
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Page URL & Banner Image */}
                        <div>
                            <label htmlFor="pageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                Page URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="pageUrl"
                                name="pageUrl"
                                value={formData.pageUrl}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="pageBannerImage" className="block text-sm font-medium text-gray-700 mb-1">
                                Page Banner Image
                            </label>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="file"
                                    id="pageBannerImage"
                                    name="pageBannerImage"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                                />
                                {pageBannerPreview ? (
                                    <div className="mt-2">
                                        <img
                                            src={pageBannerPreview}
                                            alt="Banner preview"
                                            className="max-h-40 rounded-md border border-gray-200"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Image Preview</p>
                                    </div>
                                ) : formData.pageBannerImage ? (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">Existing image will be replaced</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {/* Meta Title & Description */}
                        <div>
                            <label htmlFor="meta.metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Title
                            </label>
                            <input
                                type="text"
                                id="meta.metaTitle"
                                name="meta.metaTitle"
                                value={formData.meta.metaTitle}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="meta.metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Description
                            </label>
                            <input
                                type="text"
                                id="meta.metaDescription"
                                name="meta.metaDescription"
                                value={formData.meta.metaDescription}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Meta Author & Brochure */}
                        <div>
                            <label htmlFor="meta.metaAuthor" className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Author
                            </label>
                            <input
                                type="text"
                                id="meta.metaAuthor"
                                name="meta.metaAuthor"
                                value={formData.meta.metaAuthor}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="brochure" className="block text-sm font-medium text-gray-700 mb-1">
                                Brochure
                            </label>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="file"
                                    id="brochure"
                                    name="brochure"
                                    onChange={handleFileChange}
                                    accept=".pdf"
                                    className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                                />
                                {brochurePreview ? (
                                    <div className="mt-2">
                                        <iframe
                                            src={brochurePreview}
                                            title="Brochure preview"
                                            className="w-full h-40 rounded-md border border-gray-200"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">PDF Preview</p>
                                    </div>
                                ) : formData.brochure ? (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">Existing PDF will be replaced</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {/* Meta Keywords & Tags */}
                        <div>
                            <label htmlFor="meta.metaKeywords" className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Keywords (comma separated)
                            </label>
                            <input
                                type="text"
                                id="meta.metaKeywords"
                                name="meta.metaKeywords"
                                value={formData.meta.metaKeywords}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="metaTags" className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                id="metaTags"
                                name="metaTags"
                                value={formData.metaTags}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Header Text & Subtext */}
                        <div>
                            <label htmlFor="headerText" className="block text-sm font-medium text-gray-700 mb-1">
                                Header Text
                            </label>
                            <textarea
                                id="headerText"
                                name="headerText"
                                value={formData.headerText}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="headerSubText" className="block text-sm font-medium text-gray-700 mb-1">
                                Header Sub Text
                            </label>
                            <textarea
                                id="headerSubText"
                                name="headerSubText"
                                value={formData.headerSubText}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Rich Text Editor */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                        </label>
                        <div className="border border-gray-300 rounded-md">
                            <ReactQuill
                                value={formData.content}
                                onChange={handleContentChange}
                                modules={modules}
                                formats={formats}
                                placeholder="Write your content here..."
                                className="h-64"
                            />
                        </div>
                    </div>

                    {/* Source Code Button */}
                    <div>
                        <button
                            type="button"
                            onClick={handleSourceCode}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Source Code
                        </button>
                    </div>

                    {/* Form Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {/* Source Code Modal */}
                <Modal show={showSourceModal} onHide={() => setShowSourceModal(false)}>
                    {showSourceModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                                <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Edit Source Code</h3>
                                    <button
                                        onClick={() => setShowSourceModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        &times;
                                    </button>
                                </div>
                                <div className="p-6">
                                    <textarea
                                        rows={10}
                                        value={sourceCode}
                                        onChange={(e) => setSourceCode(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                    />
                                </div>
                                <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                                    <button
                                        onClick={() => setShowSourceModal(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={handleSaveSourceCode}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </div>
    );
};

export default EditCmsPage;