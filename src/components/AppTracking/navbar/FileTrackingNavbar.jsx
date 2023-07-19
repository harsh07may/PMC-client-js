import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../utils/auth";
import { Button, Drawer, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import jwtDecode from "jwt-decode";
import { checkPermission } from "../../../utils/fns";
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

  const fileItems = [
    checkPermission(
      jwtDecode(auth.user.accesstoken).perms,
      ["application_tracking"],
      "central"
    ) && {
      key: "1",
      label: (
        <NavLink
          to="/apptracking/file/new"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          New Application
        </NavLink>
      ),
    },
    {
      key: "2",
      label: (
        <NavLink
          to="/apptracking/file/tracking"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          Tracking
        </NavLink>
      ),
    },
  ].filter(Boolean);

  const inboxItems = [
    {
      key: "a1",
      label: (
        <NavLink
          to="/apptracking/inbox/pending"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          Pending
        </NavLink>
      ),
    },
    {
      key: "a2",
      label: (
        <NavLink
          to="/apptracking/inbox/holding"
          onClick={onSmallMenuClick}
          reloadDocument
          end
        >
          Holding
        </NavLink>
      ),
    },
  ];

  const miniItems = [
    {
      // type: "group", //? comment this to convert to dropdown
      label: "File",
      children: fileItems,
    },
    { type: "divider" },
    {
      // type: "group",
      label: "Inbox",
      children: inboxItems,
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
              items={miniItems}
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
          <CustomDropdown menu={fileItems}>
            <p style={{ navLinkStyles }} className={NavbarStyles.navLink}>
              File
            </p>
          </CustomDropdown>

          <NavLink
            className={NavbarStyles.navLink}
            style={navLinkStyles}
            to="./inbox"
            reloadDocument
            end
          >
            Inbox
          </NavLink>

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
