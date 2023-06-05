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

  const accountItems = [
    {
      key: "c2",
      label: (
        <NavLink
          to="/administration/accounts/CreateAccount"
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
          to="/administration/accounts/ManageAccounts"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          Manage Accounts
        </NavLink>
      ),
    },
  ];

  const miniAdminItems = [
    {
      // label: "Audit Logs",
      // children: adminItems,
      key: "c1",
      label: (
        <NavLink
          to="/administration/AuditLog"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          Audit Logs
        </NavLink>
      ),
    },
    { type: "divider" },
    {
      label: "Accounts",
      children: accountItems,
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
            <Menu theme="light" mode="inline" items={miniAdminItems} />
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
          <NavLink
            className={NavbarStyles.navLink}
            style={navLinkStyles}
            to="/administration/AuditLog"
            reloadDocument
            end
          >
            Audit Logs
          </NavLink>
          <CustomDropdown menu={accountItems}>
            <p style={{ navLinkStyles }} className={NavbarStyles.navLink}>
              Admin
            </p>
          </CustomDropdown>
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
