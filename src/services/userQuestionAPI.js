import axios from "axios";

const URL_QUESTION = import.meta.env.VITE_USER_QUESTION_API;

const registerUserQuestion = async (payload) => {
    console.log('Register payload:', payload); // Debugging line
    const response = await axios.post(`${URL_QUESTION}/create`, payload, {
        headers: {
            'Content-Type': 'application/json', // Tentukan content type
        }
    });
    return response.data;
};

const loginUserQuestion = async (payload) => {
    console.log('Login payload:', payload); // Debugging line
    const response = await axios.post(`${URL_QUESTION}/login`, payload, {
        headers: {
            'Content-Type': 'application/json', // Tentukan content type
        }
    });
    console.log('Login response 23:', response.data); // Debugging line
    return response.data;
};

export { registerUserQuestion, loginUserQuestion };
