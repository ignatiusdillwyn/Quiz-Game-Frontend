import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import MainParticipantLayout from "../layouts/MainParticipantLayout";
import MainUserQuestionLayout from "../layouts/MainUserQuestionLayout";

import ParticipantLogin from "../pages/Participant/ParticipantLogin";
import ParticipantRegister from "../pages/Participant/ParticipantRegister";
import ParticipantHome from "../pages/Participant/ParticipantHome";

import UserQuestionLogin from "../pages/UserQuestion/UserQuestionLogin";
import UserQuestionRegister from "../pages/UserQuestion/UserQuestionRegister";
import UserQuestionHome from "../pages/UserQuestion/UserQuestionHome";

const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            {
                path: "/participant/login",
                element: <ParticipantLogin />,
            },
            {
                path: "/participant/register",
                element: <ParticipantRegister />,
            },
            {
                path: "/user-question/login",
                element: <UserQuestionLogin />,
            },
            {
                path: "/user-question/register",
                element: <UserQuestionRegister />,
            },
        ],
    },

    {
        element: <MainParticipantLayout />,
        children: [
            // {
            //     path: "/participant/login",
            //     element: <ParticipantLogin />,
            // }
        ]
    },

    {
        element: <MainUserQuestionLayout />,
        children: [
            // {
            //     path: "/user-question/login",
            //     element: <UserQuestionLogin />,
            // }
        ]
    }
])

export default router;