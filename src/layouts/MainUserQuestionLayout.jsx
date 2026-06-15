import React from "react";
import { Outlet } from "react-router-dom";
import NavbarUserQuestion from "../components/NavbarUserQuestion";

const MainUserQuestionLayout = () => {
  return (
    <>
      <div className="w-full">
        <NavbarUserQuestion></NavbarUserQuestion>
      </div>
      <div className="w-full">
        <Outlet></Outlet>
      </div>
    </>
  );
};

export default MainUserQuestionLayout;
