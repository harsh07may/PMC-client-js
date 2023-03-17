import React from "react";
import Logo from "../../assets/logo.png";
import { NavLink, Outlet } from "react-router-dom";
import "./Navbar.css";
const Navbar = () => {
  const navLinkStyles = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "normal",
      textDecoration: isActive ? "underline" : "none",
      textUnderlineOffset: isActive ? "10px" : "none",
    };
  };
  return (
    <>
      <nav className="navbar">
        {/*Child 1: Logo Text*/}
        <div className="nav-items">
          <img src={Logo} alt="logo" className="logo" />
          <h2 className="heading-text">Ponda Muncipal Council</h2>
        </div>

        <div className="nav-links">
          <NavLink
            style={navLinkStyles}
            className="nav-link"
            to="/digitization/search"
            end
          >
            Search
          </NavLink>
          <NavLink
            style={navLinkStyles}
            className="nav-link"
            to="/digitization/add"
          >
            Add
          </NavLink>
          <NavLink
            style={navLinkStyles}
            className="nav-link"
            to="/digitization/help"
          >
            Help
          </NavLink>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
