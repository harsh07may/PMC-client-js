import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../utils/auth";
import { Button, Drawer, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
// import { LogoutOutlined } from "@ant-design/icons";

import NavbarStyles from "./Navbar.module.css";

import Logo from "../../../assets/logo.png";
import Logout from "../../../assets/logout.svg";

import CustomDropdown from "../../CustomDropdown/CustomDropdown";

const Navbar = () => {
  const auth = useAuth();
  // console.log(auth);

  const navLinkStyles = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "normal",
      textDecoration: isActive ? "underline" : "none",
      textUnderlineOffset: isActive ? "10px" : "none",
    };
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onSmallMenuClick = () => {
    setOpen(false);
  };

  const searchItems = [
    {
      key: "1",
      label: (
        <NavLink
          to="/digitization/search/MunicipalPropertyRecord"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          Municipal Properties
        </NavLink>
      ),
    },
    {
      key: "2",
      label: (
        <NavLink
          to="/digitization/search/ConstructionLicenseRecord"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          Construction Licenses
        </NavLink>
      ),
    },
    {
      key: "3",
      label: (
        <NavLink
          to="/digitization/search/HouseTaxRecord"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          House Tax Records
        </NavLink>
      ),
    },
    {
      key: "4",
      label: (
        <NavLink
          to="/digitization/search/BirthRecord"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          Birth Records
        </NavLink>
      ),
    },
  ];

  const addItems = [
    {
      key: "a1",
      label: (
        <NavLink
          to="/digitization/add/MunicipalPropertyRecord"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          Municipal Properties
        </NavLink>
      ),
    },
    {
      key: "a2",
      label: (
        <NavLink
          to="/digitization/add/ConstructionLicenseRecord"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          Construction Licenses
        </NavLink>
      ),
    },
    {
      key: "a3",
      label: (
        <NavLink
          to="/digitization/add/HouseTaxRecord"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          House Tax Records
        </NavLink>
      ),
    },
    {
      key: "a4",
      label: (
        <NavLink
          to="/digitization/add/BirthRecord"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          Birth Records
        </NavLink>
      ),
    },
  ];

  const miniEditorItems = [
    {
      // type: "group", //? comment this to convert to dropdown
      label: "Search",
      children: searchItems,
    },
    { type: "divider" },
    {
      // type: "group",
      label: "Add",
      children: addItems,
    },
    {
      key: "logout",
      label: (
        <p
          onClick={handleLogout}
          className={NavbarStyles.smallLogout}
          danger="true"
        >
          Logout
        </p>
      ),
    },
  ];
  const miniViewerItems = [
    {
      // type: "group", //? comment this to convert to dropdown
      label: "Search",
      children: searchItems,
    },
    {
      key: "logout",
      label: (
        <p
          onClick={handleLogout}
          className={NavbarStyles.smallLogout}
          danger="true"
        >
          Logout
        </p>
      ),
    },
  ];

  return (
    <>
      <nav className={NavbarStyles.smallNavbar}>
        <Link to="/AppGallery">
          <img
            src={Logo}
            alt="logo"
            className={NavbarStyles.smallLogo}
            title="Go to home"
          />
        </Link>
        <p className={NavbarStyles.smallHeadingText}>PMC</p>
        <>
          <Button
            className={NavbarStyles.smallMenuBtn}
            type="primary"
            shape="circle"
            size="large"
            icon={<MenuOutlined />}
            onClick={showDrawer}
          ></Button>
          <Drawer
            title={
              <p style={{ textAlign: "center" }}>PONDA MUNICIPAL COUNCIL</p>
            }
            placement="right"
            onClose={onClose}
            open={open}
          >
            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={["4"]}
              items={
                auth.user.role == "admin"
                  ? miniEditorItems
                  : auth.user.role == "editor"
                  ? miniEditorItems
                  : miniViewerItems
              }
            />
          </Drawer>
        </>
      </nav>

      <nav className={NavbarStyles.bigNavbar}>
        <div className={NavbarStyles.navItems}>
          <Link to="/AppGallery">
            <img
              src={Logo}
              alt="logo"
              className={NavbarStyles.logo}
              title="Go to home"
            />
          </Link>
          <h2 className={NavbarStyles.headingText}>Ponda Municipal Council</h2>
        </div>

        <div className={NavbarStyles.navLinkParent}>
          <p style={{ navLinkStyles }} className={NavbarStyles.navLink}>
            Dashboard
          </p>

          <p style={{ navLinkStyles }} className={NavbarStyles.navLink}>
            Calendar
          </p>

          <img
            src={Logout}
            className={NavbarStyles.logout}
            onClick={handleLogout}
            title="Logout"
          />
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
