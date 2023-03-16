import React from "react";
import Logo from "../../assets/pmc_logo.png";
import { NavLink } from "react-router-dom";
const Navbar = () => {
  const navLinkStyles = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "normal",
      textDecoration: isActive ? "underline" : "none",
      textUnderlineOffset: isActive ? "10px" : "none",
    };
  };
  return (
    <nav className="navbar">
      {/*Child 1: Logo Text*/}
      <div className=".navbar">
        <img src={Logo} alt="logo" className="h-50 w-55 mr-2" />
        <h2 className="font-bold text-4xl">Ponda Muncip al Council</h2>
      </div>

      <div className="flex text-white text-2xl">
        <NavLink
          style={navLinkStyles}
          className="inline-block p-3"
          to="/digitization/search"
          end
        >
          Search
        </NavLink>
        <NavLink
          style={navLinkStyles}
          className="inline-block p-3"
          to="/digitization/add"
        >
          Add
        </NavLink>
        <NavLink
          style={navLinkStyles}
          className="inline-block p-3"
          to="/digitization/help"
        >
          Help
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
