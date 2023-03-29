import React from "react";
import { PoweroffOutlined } from "@ant-design/icons";
import { Card, Button } from "antd";
const { Meta } = Card;

import { NavLink, Outlet, useNavigate, redirect } from "react-router-dom";
import { useAuth } from "../../utils/auth";

import "./AppGallery.css";

// import documentLogo from "../assets/document.svg";
import documentLogo from "../../assets/document2.svg";
import userLogo from "../../assets/user.svg";
import compassLogo from "../../assets/compass.svg";
import calenderLogo from "../../assets/calender.svg";

export default function AppGallery() {
  const auth = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };
  return (
    <>
      <div className="appGalleryContainer">
        <Button
          onClick={handleLogout}
          type="primary"
          danger
          icon={<PoweroffOutlined />}
          style={{ position: "absolute", right: 10, top: 10 }}
        >
          Logout
        </Button>
        <div className="heading" style={{ color: "white" }}>
          <h1>Select a Service</h1>
        </div>

        <div className="gallery">
          <Card
            className="expand-card"
            onClick={() => navigate("/digitization")}
            hoverable
            style={{ width: 220 }}
            cover={<img src={documentLogo} style={{ height: 200 }} />}
          >
            <Meta title="File Digitization" description="Digitize your files" />
          </Card>
          <Card
            className="expand-card"
            onClick={() => console.log("2")}
            hoverable
            style={{ width: 220 }}
            cover={<img src={calenderLogo} style={{ height: 200 }} />}
          >
            <Meta title="Leave Management" description="Manage your leaves" />
          </Card>
          <Card
            className="expand-card"
            onClick={() => console.log("3")}
            hoverable
            style={{ width: 220 }}
            cover={<img src={compassLogo} style={{ height: 200 }} />}
          >
            <Meta
              title="File Tracking"
              description="Track your files in-office"
            />
          </Card>
          <Card
            onClick={() => console.log("4")}
            className="expand-card"
            hoverable
            style={{ width: 220 }}
            cover={<img src={userLogo} style={{ height: 200 }} />}
          >
            <Meta title="User Managemnt" description="Manage user accounts" />
          </Card>
        </div>
      </div>
    </>
  );
}
