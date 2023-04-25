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

  const [collapsed, setCollapsed] = useState(true);
  const [current, setCurrent] = useState("mail");
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
          to="/digitization/search/MunicipalPropertyR ecord"
          onClick={onSmallMenuClick}
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
          end
        >
          Birth Records
        </NavLink>
      ),
    },
  ];

  const adminItems = [
    {
      key: "c1",
      label: (
        <NavLink
          to="/digitization/admin/AuditLog"
          onClick={onSmallMenuClick}
          end
        >
          Audit Log
        </NavLink>
      ),
    },
    {
      key: "c2",
      label: (
        <NavLink
          to="/digitization/admin/CreateAccount"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          Create Account
        </NavLink>
      ),
    },
    {
      key: "c3",
      label: (
        <NavLink
          to="/digitization/admin/ManageAccounts"
          onClick={onSmallMenuClick}
          end
        >
          Manage Accounts
        </NavLink>
      ),
    },
  ];

  const miniAdminItems = [
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
    { type: "divider" },
    {
      label: "Admin",
      children: adminItems,
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
          <img src={Logo} alt="logo" className={NavbarStyles.smallLogo} />
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
                  ? miniAdminItems
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
            <img src={Logo} alt="logo" className={NavbarStyles.logo} />
          </Link>
          <h2 className={NavbarStyles.headingText}>Ponda Municipal Council</h2>
        </div>

        <div className={NavbarStyles.navLinkParent}>
          <CustomDropdown menu={searchItems}>
            <p style={{ navLinkStyles }} className={NavbarStyles.navLink}>
              Search
            </p>
          </CustomDropdown>

          {(auth.user.role == "admin" || auth.user.role == "editor") && (
            <CustomDropdown menu={addItems}>
              <p style={{ navLinkStyles }} className={NavbarStyles.navLink}>
                Add
              </p>
            </CustomDropdown>
          )}
          {auth.user.role == "admin" && (
            <CustomDropdown menu={adminItems}>
              <p style={{ navLinkStyles }} className={NavbarStyles.navLink}>
                Admin
              </p>
            </CustomDropdown>
          )}

          {/* 
            //! antd dropdown causes page links to freeze, replaced with custom dropdown. 
            //! Don't delete antd dropdown code.  
            //! Test before migrating to new antd version     
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
          />
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
