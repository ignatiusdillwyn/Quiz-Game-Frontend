import axios from "axios";

const URL = import.meta.env.VITE_LEADERBORD_API;

const insertScore = async (payload, token) => {
    const response = await axios.post(`${URL}/insertScore`, payload, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data;
};

const getScoreLeaderbordByQuestionCode = async (token, code) => {
    const response = await axios.get(`${URL}/getLeaderbordScoreByQuestionCode?code=${code}`, {
        headers: {
            'Content-Type': 'application/json',
            'access_token': token
        }
    });
    return response.data; 
};

export { insertScore, getScoreLeaderbordByQuestionCode };