import React from "react";
import { Outlet } from "react-router-dom";
import NavbarPartcipant from "../components/NavbarParticipant";

const MainParticipantLayout = () => {
  return (
    <>
      <div className="w-full">
        <NavbarPartcipant></NavbarPartcipant>
      </div>
      <div className="w-full">
        <Outlet></Outlet>
      </div>
    </>
  );
};

export default MainParticipantLayout;
