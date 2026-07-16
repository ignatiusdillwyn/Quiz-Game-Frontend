import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { updateQuestion, getListQuestionsbyCode } from '../../services/questionAPI';

const UpdateQuestionPackage = () => {
    const navigate = useNavigate();
    const { code } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [questionList, setQuestionList] = useState([]);
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [formData, setFormData] = useState({
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: '',
        code: code || ''
    });

    // Ambil data questions berdasarkan code
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setFetching(true);
                const token = localStorage.getItem('token');
                const response = await getListQuestionsbyCode(token, code);
                console.log('Questions by code:', response.data);
                
                if (response.data && response.data.length > 0) {
                    setQuestionList(response.data);
                    // Set question pertama sebagai default
                    const firstQuestion = response.data[0];
                    setSelectedQuestionId(firstQuestion.id);
                    
                    // Mapping option_1, option_2, option_3, option_4 ke array options
                    const options = [
                        firstQuestion.option_1 || '',
                        firstQuestion.option_2 || '',
                        firstQuestion.option_3 || '',
                        firstQuestion.option_4 || ''
                    ];
                    
                    setFormData({
                        question_text: firstQuestion.question_text || '',
                        options: options,
                        correct_answer: firstQuestion.correct_answer || '',
                        code: firstQuestion.code || code
                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Questions Found',
                        text: `No questions found for code: ${code}`,
                        confirmButtonColor: '#7c3aed',
                    }).then(() => {
                        navigate('/user-question/list-questions');
                    });
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load questions data',
                    confirmButtonColor: '#7c3aed',
                }).then(() => {
                    navigate('/user-question/list-questions');
                });
            } finally {
                setFetching(false);
            }
        };

        if (code) {
            fetchQuestions();
        }
    }, [code, navigate]);

    // Handle pilih question dari list
    const handleSelectQuestion = (questionId) => {
        const selected = questionList.find(q => q.id === questionId);
        if (selected) {
            setSelectedQuestionId(selected.id);
            
            const options = [
                selected.option_1 || '',
                selected.option_2 || '',
                selected.option_3 || '',
                selected.option_4 || ''
            ];
            
            setFormData({
                question_text: selected.question_text || '',
                options: options,
                correct_answer: selected.correct_answer || '',
                code: selected.code || code
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData(prev => ({
            ...prev,
            options: newOptions
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedQuestionId) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Please select a question to update!',
                confirmButtonColor: '#7c3aed',
            });
            return;
        }

        if (!formData.question_text) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Question text is required!',
                confirmButtonColor: '#7c3aed',
            });
            return;
        }

        if (formData.options.some(opt => opt === '')) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'All options must be filled!',
                confirmButtonColor: '#7c3aed',
            });
            return;
        }

        if (!formData.correct_answer) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Please select the correct answer!',
                confirmButtonColor: '#7c3aed',
            });
            return;
        }

        if (!formData.code) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Package code is required!',
                confirmButtonColor: '#7c3aed',
            });
            return;
        }

        const confirm = await Swal.fire({
            title: 'Update Question?',
            text: 'Are you sure you want to update this question?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#7c3aed',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Update!',
            cancelButtonText: 'Cancel',
        });

        if (!confirm.isConfirmed) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const payload = {
                question_text: formData.question_text,
                options: formData.options,
                correct_answer: formData.correct_answer,
                code: formData.code
            };

            await updateQuestion(selectedQuestionId, payload, token);

            Swal.fire({
                icon: 'success',
                title: 'Question Updated! ✅',
                text: 'Question has been updated successfully',
                timer: 1500,
                showConfirmButton: false,
            });

            // Refresh data setelah update
            const response = await getListQuestionsbyCode(token, code);
            if (response.data) {
                setQuestionList(response.data);
                // Update form dengan data terbaru dari question yang sama
                const updated = response.data.find(q => q.id === selectedQuestionId);
                if (updated) {
                    const options = [
                        updated.option_1 || '',
                        updated.option_2 || '',
                        updated.option_3 || '',
                        updated.option_4 || ''
                    ];
                    setFormData({
                        question_text: updated.question_text || '',
                        options: options,
                        correct_answer: updated.correct_answer || '',
                        code: updated.code || code
                    });
                }
            }

        } catch (error) {
            console.error('Error updating question:', error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.response?.data?.message || 'Something went wrong. Please try again.',
                confirmButtonColor: '#7c3aed',
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading questions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <button
                        onClick={() => navigate('/user-question/home/list-package-questions')}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">✏️ Update Questions</h1>
                </div>
                <p className="text-gray-500 text-sm">
                    Package Code: <span className="font-mono font-semibold text-purple-600">{code}</span>
                    <span className="ml-4">Total Questions: <span className="font-semibold">{questionList.length}</span></span>
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: List Questions */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-4">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">📋 Select Question</h2>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {questionList.map((q, index) => (
                            <button
                                key={q.id}
                                onClick={() => handleSelectQuestion(q.id)}
                                className={`w-full text-left px-3 py-3 rounded-lg text-sm transition duration-200 ${
                                    selectedQuestionId === q.id
                                        ? 'bg-purple-100 border-2 border-purple-500 text-purple-700'
                                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">#{index + 1}</span>
                                    <span className="text-xs text-gray-500 truncate max-w-[150px]">
                                        {q.question_text ? q.question_text.substring(0, 20) + '...' : 'No question text'}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Form Update */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        {selectedQuestionId ? `✏️ Editing Question #${questionList.findIndex(q => q.id === selectedQuestionId) + 1}` : 'Select a question to edit'}
                    </h2>

                    {selectedQuestionId ? (
                        <form onSubmit={handleSubmit}>
                            {/* Package Code */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Package Code <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        placeholder="e.g. WNSC (4 capital letters)"
                                        maxLength="4"
                                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                                            let newCode = '';
                                            for (let i = 0; i < 4; i++) {
                                                newCode += chars.charAt(Math.floor(Math.random() * chars.length));
                                            }
                                            setFormData(prev => ({ ...prev, code: newCode }));
                                        }}
                                        className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
                                    >
                                        🎲 Random
                                    </button>
                                </div>
                            </div>

                            {/* Question Text */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Question Text <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="question_text"
                                    value={formData.question_text}
                                    onChange={handleChange}
                                    placeholder="Enter your question here..."
                                    rows="3"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    required
                                />
                            </div>

                            {/* Options */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Options <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-2">
                                    {['A', 'B', 'C', 'D'].map((label, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <span className="w-6 font-semibold text-gray-600">{label}.</span>
                                            <input
                                                type="text"
                                                value={formData.options[index] || ''}
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                placeholder={`Option ${label}`}
                                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Correct Answer */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Correct Answer <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="correct_answer"
                                    value={formData.correct_answer || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select the correct answer</option>
                                    {formData.options.map((option, index) => (
                                        option && option.trim() !== '' && (
                                            <option key={index} value={option}>
                                                {String.fromCharCode(65 + index)}. {option}
                                            </option>
                                        )
                                    ))}
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 py-2.5 px-4 rounded-lg text-white font-medium transition duration-200 ${
                                        loading 
                                            ? 'bg-purple-400 cursor-not-allowed' 
                                            : 'bg-purple-600 hover:bg-purple-700'
                                    }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </div>
                                    ) : (
                                        '💾 Update Question'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/user-question/list-questions')}
                                    className="px-6 py-2.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <p className="text-2xl mb-2">👈</p>
                            <p>Select a question from the list to edit</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateQuestionPackage;