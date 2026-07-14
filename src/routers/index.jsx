import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import MainParticipantLayout from "../layouts/MainParticipantLayout";
import MainUserQuestionLayout from "../layouts/MainUserQuestionLayout";

import ParticipantLogin from "../pages/Participant/ParticipantLogin";
import ParticipantRegister from "../pages/Participant/ParticipantRegister";
import ParticipantHome from "../pages/Participant/ParticipantHome";
import ListChallenges from "../pages/Participant/ListChallenges";

import UserQuestionLogin from "../pages/UserQuestion/UserQuestionLogin";
import UserQuestionRegister from "../pages/UserQuestion/UserQuestionRegister";
import UserQuestionHome from "../pages/UserQuestion/UserQuestionHome";
import ListPackageQuestions from "../pages/UserQuestion/ListPackageQuestions";
import AddQuestionPackage from "../pages/UserQuestion/AddQuestionPackage";

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
            {
                path: "/participant/home",
                element: <ParticipantHome />,
            }
        ]
    },

    {
        element: <MainUserQuestionLayout />,
        children: [
            {
                path: "/user-question/home",
                element: <UserQuestionHome />,
            }, 
            {
                path: "/user-question/home/list-package-questions",
                element: <ListPackageQuestions />,
            }, 
            {
                path: "/user-question/home/add-questions",
                element: <AddQuestionPackage />,
            }, 
        ]
    }
])

export default router;