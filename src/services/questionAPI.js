import axios from "axios";

const URL_QUESTION = import.meta.env.VITE_QUESTION_API;

const addQuestion = async (payload, token) => {
    const response = await axios.post(`${URL_QUESTION}/create`, payload, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data;
};

//Ini untuk nampilin paket - paket soal di halaman user question
const getAllQuestionPackagebyUserId = async (token) => {
    const response = await axios.get(`${URL_QUESTION}/getAllQuestionPackagebyUserId`, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data; // Returns { status, message, products }
};

//Ini untuk nampilin semua pertanyaan di satu paket soal
const getListQuestionsbyCode = async (token, code) => {
    const response = await axios.get(`${URL_QUESTION}/getListQuestionByCode?code=${code}`, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data; // Returns { status, message, products }
};

//Ini untuk ambil semua code soal di db, nanti buat checking duplikasi code di frontend
const getAllQuestionsPackageCode = async (token, code) => {
    const response = await axios.get(`${URL_QUESTION}/getAllCode`, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data; // Returns { status, message, products }
};

const updateQuestion = async (id, payload, token) => {
    const response = await axios.put(`${URL_QUESTION}/editQuestion/${id}`, payload, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data;
};

const deleteQuestionbyID = async (id, token) => {
    const response = await axios.delete(`${URL_QUESTION}/deleteQuestion/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data;
};

//Delete all question in on package
const deleteQuestionBatch = async (id, token) => {
    const response = await axios.delete(`${URL_QUESTION}/deleteBatchQuestion?code=${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data;
};

export { addQuestion, getAllQuestionPackagebyUserId, getAllQuestionsPackageCode, getListQuestionsbyCode, updateQuestion, deleteQuestionBatch, deleteQuestionbyID };