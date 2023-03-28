import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../utils/auth";
import { Button, Tooltip } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import "./Navbar.css";

import Logo from "../../../assets/logo.png";
import Logout from "../../../assets/logout.svg";

const Navbar = () => {
  const navLinkStyles = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "normal",
      textDecoration: isActive ? "underline" : "none",
      textUnderlineOffset: isActive ? "10px" : "none",
    };
  };
  const auth = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };
  return (
    <>
      <nav className="navbar">
        {/*Child 1: Logo Text*/}
        <div className="nav-items">
          <Link to="/AppGallery">
            <img src={Logo} alt="logo" className="logo" />
          </Link>
          <h2 className="heading-text">Ponda Municipal Council</h2>
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
          <img
            src={Logout}
            style={{
              height: "32px",
              margin: "5px",
              padding: "7px",
              cursor: "pointer",
            }}
            onClick={handleLogout}
          />
          {/* <button onClick={handleLogout}>Logout</button> */}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
