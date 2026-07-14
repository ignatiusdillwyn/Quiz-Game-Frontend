import { NavLink, Link } from "react-router-dom";
import { FaBook, FaInfoCircle, FaPhoneAlt, FaSignInAlt } from "react-icons/fa";

const NavbarPartcipant = () => {
  const navClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition
     ${
       isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
     }`;

  return (
    <nav className="w-full border-b px-8 py-4 flex items-center bg-white">
      {/* LEFT - LOGO */}
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          📚 <span>Quiz Game</span>
        </Link>
      </div>

      {/* CENTER - MENU */}
      <div className="flex gap-4 flex-1 justify-center">
        <NavLink to="/user-question/home/list-package-questions" className={navClass}>
          <FaBook />
          Questions
        </NavLink>

        <NavLink to="/about" className={navClass}>
          <FaInfoCircle />
          About
        </NavLink>

        <NavLink to="/contact" className={navClass}>
          <FaPhoneAlt />
          Profile
        </NavLink>
      </div>

      {/* RIGHT - LOGOUT */}
      <div className="flex-1 flex justify-end">
        <NavLink
          to="/user-question/login"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg transition
            ${isActive ? "bg-blue-600 text-white" : "border hover:bg-gray-100"}`
          }
        >
          <FaSignInAlt />
          Logout
        </NavLink>
      </div>
    </nav>
  );
};

export default NavbarPartcipant;
