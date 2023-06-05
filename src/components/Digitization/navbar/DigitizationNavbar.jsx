import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../utils/auth";
import { Dropdown, Button, Drawer, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
// import { LogoutOutlined } from "@ant-design/icons";

import NavbarStyles from "./Navbar.module.css";

import Logo from "../../../assets/logo.png";
import Logout from "../../../assets/logout.svg";

import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import { checkPermission } from "../../../utils/fns";
import jwtDecode from "jwt-decode";

const Navbar = () => {
  const auth = useAuth();

  const allDocTypes = [
    "municipality_property_records",
    "birth_records",
    "construction_license_records",
    "death_records",
    "house_tax_records",
    "trade_license_records",
  ];

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
    checkPermission(
      jwtDecode(auth.user.accesstoken).perms,
      ["municipality_property_records"],
      "viewer"
    ) && {
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
    checkPermission(
      jwtDecode(auth.user.accesstoken).perms,
      ["construction_license_records"],
      "viewer"
    ) && {
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
    checkPermission(
      jwtDecode(auth.user.accesstoken).perms,
      ["house_tax_records"],
      "viewer"
    ) && {
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
    checkPermission(
      jwtDecode(auth.user.accesstoken).perms,
      ["birth_records"],
      "viewer"
    ) && {
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
    checkPermission(
      jwtDecode(auth.user.accesstoken).perms,
      ["death_records"],
      "viewer"
    ) && {
      key: "5",
      label: (
        <NavLink
          to="/digitization/search/DeathRecord"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          Death Records
        </NavLink>
      ),
    },
    checkPermission(
      jwtDecode(auth.user.accesstoken).perms,
      ["trade_license_records"],
      "viewer"
    ) && {
      key: "6",
      label: (
        <NavLink
          to="/digitization/search/TradeLicenseRecord"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          Trade Licenses
        </NavLink>
      ),
    },
  ].filter(Boolean);

  const addItems = [
    checkPermission(
      jwtDecode(auth.user.accesstoken).perms,
      ["municipality_property_records"],
      "editor"
    ) && {
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
    checkPermission(
      jwtDecode(auth.user.accesstoken).perms,
      ["construction_license_records"],
      "editor"
    ) && {
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
    checkPermission(
      jwtDecode(auth.user.accesstoken).perms,
      ["house_tax_records"],
      "editor"
    ) && {
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
    checkPermission(
      jwtDecode(auth.user.accesstoken).perms,
      ["birth_records"],
      "editor"
    ) && {
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
    checkPermission(
      jwtDecode(auth.user.accesstoken).perms,
      ["death_records"],
      "editor"
    ) && {
      key: "a5",
      label: (
        <NavLink
          to="/digitization/add/DeathRecord"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          Death Records
        </NavLink>
      ),
    },
    checkPermission(
      jwtDecode(auth.user.accesstoken).perms,
      ["trade_license_records"],
      "editor"
    ) && {
      key: "a6",
      label: (
        <NavLink
          to="/digitization/add/TradeLicenseRecord"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          Trade Licenses
        </NavLink>
      ),
    },
  ].filter(Boolean);

  const miniMenuItems = [
    {
      // type: "group", //? comment this to convert to dropdown
      label: "Search",
      children: searchItems,
    },
    { type: "divider" },
    checkPermission(
      jwtDecode(auth.user.accesstoken).perms,
      allDocTypes,
      "editor"
    ) && {
      // type: "group",
      label: "Add",
      children: addItems,
    },
    { type: "divider" },
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
              // defaultSelectedKeys={["4"]}
              items={miniMenuItems}
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
          <CustomDropdown menu={searchItems}>
            <p style={{ navLinkStyles }} className={NavbarStyles.navLink}>
              Search
            </p>
          </CustomDropdown>

          {checkPermission(
            jwtDecode(auth.user.accesstoken).perms,
            allDocTypes,
            "editor"
          ) && (
            <CustomDropdown menu={addItems}>
              <p style={{ navLinkStyles }} className={NavbarStyles.navLink}>
                Add
              </p>
            </CustomDropdown>
          )}

          {/* 
            //! antd dropdown causes page links to freeze, replaced with custom dropdown. 
            //! Don't delete antd dropdown code.  
            //! Test before confirming migration to new antd version     
            //! Current version antd v5.5.3     
          */}

          {/* 
            <Dropdown
              menu={{
                items: searchItems,
              }}
              placement="bottom"
              arrow={{
                pointAtCenter: true,
              }}
              trigger={"click"}
            >
              <p style={{ navLinkStyles }} className={NavbarStyles.navLink}>
                Search
              </p>
            </Dropdown> 
            {(auth.user.role == "admin" || auth.user.role == "editor") && (
              <Dropdown
                menu={{
                  items: addItems,
                }}
                placement="bottom"
                arrow={{
                  pointAtCenter: true,
                }}
              >
                <p style={{ navLinkStyles }} className={NavbarStyles.navLink}>
                  Add
                </p>
              </Dropdown>
            )}

            {auth.user.role == "admin" && (
              <Dropdown
                menu={{
                  items: adminItems,
                }}
                placement="bottom"
                arrow={{
                  pointAtCenter: true,
                }}
              >
                <p style={{ navLinkStyles }} className={NavbarStyles.navLink}>
                  Admin
                </p>
              </Dropdown>
            )} 
          */}
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
