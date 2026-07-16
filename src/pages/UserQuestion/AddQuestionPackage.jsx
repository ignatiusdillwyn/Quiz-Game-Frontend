import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { addQuestion, getAllQuestionsPackageCode } from '../../services/questionAPI';

const AddQuestionPackage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: '',
    });
    const [questionList, setQuestionList] = useState([]);
    const [questionCount, setQuestionCount] = useState(0);
    const [isSubmittingAll, setIsSubmittingAll] = useState(false);

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

    const handleAddQuestion = async (e) => {
        e.preventDefault();

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

        if (questionCount >= 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Max Limit Reached',
                text: 'You can only add up to 10 questions!',
                confirmButtonColor: '#7c3aed',
            });
            return;
        }

        const newQuestion = {
            id: Date.now(),
            question_text: formData.question_text,
            options: [...formData.options],
            correct_answer: formData.correct_answer,
        };

        setQuestionList(prev => [...prev, newQuestion]);
        setQuestionCount(prev => prev + 1);

        Swal.fire({
            icon: 'success',
            title: 'Question Added! ✅',
            text: `Question #${questionCount + 1} added`,
            timer: 1000,
            showConfirmButton: false,
        });

        setFormData({
            question_text: '',
            options: ['', '', '', ''],
            correct_answer: '',
        });
    };

    // Handle edit langsung di list
    const handleEditQuestion = (id, field, value) => {
        setQuestionList(prev => prev.map(q => {
            if (q.id === id) {
                if (field === 'question_text') {
                    return { ...q, question_text: value };
                } else if (field === 'correct_answer') {
                    return { ...q, correct_answer: value };
                } else if (field.startsWith('option_')) {
                    const index = parseInt(field.split('_')[1]);
                    const newOptions = [...q.options];
                    newOptions[index] = value;
                    return { ...q, options: newOptions };
                }
            }
            return q;
        }));
    };

    const handleRemoveQuestion = (id) => {
        Swal.fire({
            title: 'Remove Question?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#7c3aed',
            confirmButtonText: 'Yes, Remove!',
        }).then((result) => {
            if (result.isConfirmed) {
                setQuestionList(prev => prev.filter(q => q.id !== id));
                setQuestionCount(prev => prev - 1);
            }
        });
    };

    const handleClearAll = () => {
        if (questionList.length === 0) return;
        Swal.fire({
            title: 'Clear All Questions?',
            text: `Remove all ${questionList.length} questions?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#7c3aed',
            confirmButtonText: 'Yes, Clear All!',
        }).then((result) => {
            if (result.isConfirmed) {
                setQuestionList([]);
                setQuestionCount(0);
                setFormData({
                    question_text: '',
                    options: ['', '', '', ''],
                    correct_answer: '',
                    code: ''
                });
            }
        });
    };

    const handleSubmitAll = async () => {
        if (questionList.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No Questions',
                text: 'Please add at least one question!',
                confirmButtonColor: '#7c3aed',
            });
            return;
        }

        const confirm = await Swal.fire({
            title: `Submit ${questionList.length} Questions?`,
            text: `Save all questions to package ${questionList[0]?.code}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#7c3aed',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Submit All!',
        });

        if (!confirm.isConfirmed) return;

        try {
            setIsSubmittingAll(true);
            const token = localStorage.getItem('token');

            let allPackageCodeinDB = await getAllQuestionsPackageCode(token);

            //Checking duplicate code & create random package code
            let code = '';
            let found = false
            do {
                for (let i = 0; i < 4; i++) {
                    // Kode ASCII A=65 sampai Z=90
                    const randomAscii = Math.floor(Math.random() * 26) + 65;
                    code += String.fromCharCode(randomAscii);
                }
                found = allPackageCodeinDB.data.find(item => item.code === code);
            } while (found)

            console.log('Unique code generated:', code);
            
            let successCount = 0;
            for (let i = 0; i < questionList.length; i++) {
                const q = questionList[i];
                await addQuestion({
                    question_text: q.question_text,
                    options: q.options,
                    correct_answer: q.correct_answer,
                    code: code
                }, token);
                successCount++;
            }

            Swal.fire({
                icon: 'success',
                title: 'All Questions Submitted! 🎉',
                text: `Successfully added ${successCount} questions`,
                confirmButtonColor: '#7c3aed',
            }).then(() => {
                setQuestionList([]);
                setQuestionCount(0);
                setFormData({
                    question_text: '',
                    options: ['', '', '', ''],
                    correct_answer: '',
                    code: ''
                });
                navigate('/user-question/home/list-package-questions');
            });

        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: error.response?.data?.message || 'Something went wrong.',
                confirmButtonColor: '#7c3aed',
            });
        } finally {
            setIsSubmittingAll(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <button
                        onClick={() => navigate('/user-question/home/list-package-questions')}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">➕ Add Questions</h1>
                </div>
                <p className="text-gray-500 text-sm">
                    Add up to 10 questions | Added: {questionCount}/10
                </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">📝 Question Form</h2>
                
                <form onSubmit={handleAddQuestion}>
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
                            rows="2"
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
                                        value={formData.options[index]}
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
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correct Answer <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="correct_answer"
                            value={formData.correct_answer}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select the correct answer</option>
                            {formData.options.map((option, index) => (
                                option && (
                                    <option key={index} value={option}>
                                        {String.fromCharCode(65 + index)}. {option}
                                    </option>
                                )
                            ))}
                        </select>
                    </div>

                    {/* Add Button */}
                    <button
                        type="submit"
                        disabled={questionCount >= 10}
                        className={`w-full py-2.5 px-4 rounded-lg text-white font-medium transition duration-200 ${
                            questionCount >= 10
                                ? 'bg-purple-400 cursor-not-allowed' 
                                : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                    >
                        {questionCount >= 10 ? 'Max 10 Questions' : '➕ Add to Queue'}
                    </button>
                </form>

                {/* Tips */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                        💡 <span className="font-semibold">Tips:</span> 
                        Add up to 10 questions, then click "Submit All" to save everything at once!
                        You can edit questions directly in the queue below.
                    </p>
                </div>
            </div>

            {/* Question Queue - Editable List */}
            {questionList.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            📋 Question Queue ({questionCount}/10)
                        </h2>
                        <button
                            onClick={handleClearAll}
                            className="text-sm text-red-600 hover:text-red-800 hover:underline"
                        >
                            Clear All
                        </button>
                    </div>

                    {/* List Questions - Editable */}
                    <div className="space-y-4">
                        {questionList.map((q, index) => (
                            <div
                                key={q.id}
                                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 space-y-3">
                                        {/* Header */}
                                        <div className="flex items-center gap-2">
                                            <span className="bg-purple-100 text-purple-700 font-semibold text-xs px-2 py-0.5 rounded-full">
                                                #{index + 1}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                Code: {q.code}
                                            </span>
                                        </div>

                                        {/* Question Text - Editable */}
                                        <div>
                                            <label className="text-xs font-medium text-gray-500">Question:</label>
                                            <input
                                                type="text"
                                                value={q.question_text}
                                                onChange={(e) => handleEditQuestion(q.id, 'question_text', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                            />
                                        </div>

                                        {/* Options - Editable */}
                                        <div>
                                            <label className="text-xs font-medium text-gray-500">Options:</label>
                                            <div className="grid grid-cols-2 gap-2 mt-1">
                                                {q.options.map((option, optIndex) => (
                                                    <div key={optIndex} className="flex items-center gap-1">
                                                        <span className="text-xs font-semibold text-gray-600 w-4">
                                                            {String.fromCharCode(65 + optIndex)}.
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) => handleEditQuestion(q.id, `option_${optIndex}`, e.target.value)}
                                                            className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Correct Answer - Editable */}
                                        <div>
                                            <label className="text-xs font-medium text-gray-500">Correct Answer:</label>
                                            <select
                                                value={q.correct_answer}
                                                onChange={(e) => handleEditQuestion(q.id, 'correct_answer', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                            >
                                                <option value="">Select correct answer</option>
                                                {q.options.map((option, optIndex) => (
                                                    option && (
                                                        <option key={optIndex} value={option}>
                                                            {String.fromCharCode(65 + optIndex)}. {option}
                                                        </option>
                                                    )
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemoveQuestion(q.id)}
                                        className="text-red-400 hover:text-red-600 transition duration-200 flex-shrink-0 mt-1"
                                    >
                                        ✕ Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit All Button */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                            onClick={handleSubmitAll}
                            disabled={isSubmittingAll}
                            className={`w-full py-2.5 px-4 rounded-lg text-white font-medium transition duration-200 ${
                                isSubmittingAll
                                    ? 'bg-green-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {isSubmittingAll ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </div>
                            ) : (
                                `✅ Submit All ${questionList.length} Questions`
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddQuestionPackage;