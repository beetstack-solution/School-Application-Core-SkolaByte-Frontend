import { fetchPageById } from '@/api/super-admin-api/cms-page-api/cmsPageApi';
import React, { useEffect, useState } from 'react';
import Breadcrumb from "@/components/Breadcumb";
import { TbArrowBackUp, TbLink, TbCode, TbCalendar, TbEdit, TbTags, TbLayout, TbFileDescription, TbDownload, TbPhoto } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';

function ViewCmsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchPage = async () => {
        try {
            const response: any = await fetchPageById(id as string);
            if (response.success) {
                setPage(response.page);
            } else {
                console.error("Failed to fetch CMS Page data:", response.message);
                setPage(null);
            }
        } catch (error) {
            console.error("Error fetching CMS Page data:", error);
            setPage(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPage();
    }, [id]);

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "CMS Pages", path: "/page" },
        { label: "View Page", path: "" },
    ];

    const handleDownloadBrochure = () => {
        const boundBrochureUrl = page.brochure;
        return boundBrochureUrl ? window.open(boundBrochureUrl, '_blank') : null;
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-12 w-12 bg-blue-100 rounded-full mb-4"></div>
                        <div className="h-4 bg-blue-100 rounded w-32"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!page) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
                    <p className="text-gray-600 mb-6">The page you requested could not be loaded.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">View CMS Page</h2>
                    <div className="mt-2">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>
                <button
                    className="flex items-center px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    onClick={() => navigate(-1)}
                >
                    <TbArrowBackUp size={18} className="mr-2" />
                    Back
                </button>
            </div>

            {/* Page Header with Banner Image */}
            <div className="relative rounded-2xl overflow-hidden mb-8 bg-gray-100">
                {page.pageBannerImage ? (
                    <div className="relative h-64 md:h-80 w-full">
                        <img
                            src={page.pageBannerImage}
                            alt={page.pageTitle}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{page.pageTitle}</h1>
                            <p className="text-lg text-gray-200">{page.headerSubText}</p>
                        </div>
                    </div>
                ) : (
                    <div className="h-64 md:h-80 w-full flex items-center justify-center bg-gray-200">
                        <div className="text-center text-gray-500">
                            <TbPhoto size={48} className="mx-auto mb-4" />
                            <p>No banner image available</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Page Info Ribbon */}
            <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                    <TbLink size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">{page.pageUrl}</span>
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                    <TbCode size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">{page.pageCode}</span>
                </div>
                <div className={`flex items-center px-4 py-2 rounded-lg ${page.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <span className="text-sm font-medium">{page.status ? 'Active' : 'Inactive'}</span>
                </div>
                
                    <button
                        onClick={handleDownloadBrochure}
                        className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors shadow-sm"
                    >
                        <TbDownload size={16} className="mr-2" />
                        <span className="text-sm font-medium">Download Brochure</span>
                    </button>
              
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Content Section */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-center mb-4">
                            <TbLayout className="text-blue-500 mr-2" size={20} />
                            <h3 className="text-xl font-semibold text-gray-800">Page Content</h3>
                        </div>
                        <div
                            className="prose max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    </div>

                    {/* Descriptions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center mb-4">
                                <TbFileDescription className="text-indigo-500 mr-2" size={20} />
                                <h3 className="text-xl font-semibold text-gray-800">Short Description</h3>
                            </div>
                            <p className="text-gray-600">{page.shortDescription}</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex items-center mb-4">
                                <TbFileDescription className="text-purple-500 mr-2" size={20} />
                                <h3 className="text-xl font-semibold text-gray-800">Full Description</h3>
                            </div>
                            <p className="text-gray-600">{page.description}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Meta Info */}
                <div className="space-y-6">
                    {/* Meta Information */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-center mb-4">
                            <TbEdit className="text-blue-500 mr-2" size={20} />
                            <h3 className="text-xl font-semibold text-gray-800">Meta Information</h3>
                        </div>
                        {page.meta && page.meta.length > 0 && (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Meta Title</h4>
                                    <p className="text-gray-800">{page.meta[0].metaTitle}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Meta Description</h4>
                                    <p className="text-gray-800">{page.meta[0].metaDescription}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Meta Author</h4>
                                    <p className="text-gray-800">{page.meta[0].metaAuthor}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Meta Keywords</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {page.meta[0].metaKeywords.map((keyword: string, index: number) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Additional Details */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-center mb-4">
                            <TbCalendar className="text-blue-500 mr-2" size={20} />
                            <h3 className="text-xl font-semibold text-gray-800">Page Details</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Created At</h4>
                                <p className="text-gray-800">
                                    {new Date(page.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Updated At</h4>
                                <p className="text-gray-800">
                                    {new Date(page.updatedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-center mb-4">
                            <TbTags className="text-blue-500 mr-2" size={20} />
                            <h3 className="text-xl font-semibold text-gray-800">Page Tags</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {page.metaTags.map((tag: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewCmsPage;