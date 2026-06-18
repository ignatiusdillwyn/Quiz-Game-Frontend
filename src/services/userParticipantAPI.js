import axios from "axios";

const URL_PARTICIPANT = import.meta.env.VITE_USER_PARTICIPANT_API;

const registerParticipant = async (payload) => {
    console.log('Register payload:', payload); // Debugging line
    const response = await axios.post(`${URL_PARTICIPANT}/create`, payload, {
        headers: {
            'Content-Type': 'application/json', // Tentukan content type
        }
    });
    return response.data;
};

const loginParticipant = async (payload) => {
    console.log('Login payload:', payload); // Debugging line
    const response = await axios.post(`${URL_PARTICIPANT}/login`, payload, {
        headers: {
            'Content-Type': 'application/json', // Tentukan content type
        }
    });
    return response.data;
};

export { registerParticipant, loginParticipant };
