import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { addQuestion, deleteQuestionBatch, deleteQuestionbyID, getAllQuestionPackagebyUserId, getAllQuestionsPackageCode, getListQuestionsbyCode, updateQuestion } from '../../services/questionAPI';

const ListPackageQuestions = () => {
    const navigate = useNavigate();
    const [listPackageQuestions, setListPackageQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchPackageCode = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await getAllQuestionsPackageCode(token);
                console.log('packageCode', response);

                // Ambil data dari response.data
                setListPackageQuestions(response.data || []);
            } catch (error) {
                console.error('Error fetching package code:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load questions package',
                    confirmButtonColor: '#7c3aed',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPackageCode();
    }, []);

    // Handle delete package
    const handleDeletePackage = async (code, e) => {
        e.stopPropagation(); // Mencegah event bubbling ke card

        // Konfirmasi sebelum delete
        const confirm = await Swal.fire({
            title: 'Delete Package?',
            text: `Are you sure you want to delete package "${code}" and all its questions? This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#7c3aed',
            confirmButtonText: 'Yes, Delete!',
            cancelButtonText: 'Cancel',
        });

        if (!confirm.isConfirmed) return;

        try {
            setDeleting(true);
            const token = localStorage.getItem('token');
            
            // Panggil service delete dengan parameter code
            const response = await deleteQuestionBatch(code, token);
            console.log('Delete response:', response);

            Swal.fire({
                icon: 'success',
                title: 'Package Deleted! 🗑️',
                text: `Package "${code}" has been deleted successfully`,
                timer: 1500,
                showConfirmButton: false,
            });

            // Refresh list setelah delete
            const refreshResponse = await getAllQuestionsPackageCode(token);
            setListPackageQuestions(refreshResponse.data || []);

        } catch (error) {
            console.error('Error deleting package:', error);
            Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: error.response?.data?.message || 'Something went wrong. Please try again.',
                confirmButtonColor: '#7c3aed',
            });
        } finally {
            setDeleting(false);
        }
    };

    // Filter berdasarkan search (cari berdasarkan code)
    const filteredData = listPackageQuestions.filter(item =>
        item?.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading packages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">📦 Question Packages</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Total: {listPackageQuestions.length} packages
                    </p>
                </div>
                <button
                    onClick={() => navigate('/user-question/home/add-questions')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 flex items-center gap-2"
                >
                    <span>➕</span> Create New Package
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by package code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Grid Cards */}
            {filteredData.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 text-lg">No packages found</p>
                    <p className="text-gray-400 text-sm mt-1">Create your first question package!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredData.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(`/user-question/questions/${item.code}`)}
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">📋</span>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Package {item.code}
                                        </h3>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Code: <span className="font-mono font-medium text-purple-600">{item.code}</span>
                                    </p>
                                </div>
                                <div className="bg-purple-100 rounded-full px-3 py-1">
                                    <span className="text-sm font-medium text-purple-700">
                                        {item.total_question} Questions
                                    </span>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="mt-4 flex gap-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/user-question/home/update-questions/${item.code}`);
                                    }}
                                    className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition duration-200"
                                >
                                    View Questions
                                </button>
                                <button
                                    onClick={(e) => handleDeletePackage(item.code, e)}
                                    disabled={deleting}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition duration-200 ${
                                        deleting 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                                    }`}
                                >
                                    {deleting ? '...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListPackageQuestions;