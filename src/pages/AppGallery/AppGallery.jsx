// Icons taken from https://www.svgrepo.com
import React from "react";
import { PoweroffOutlined } from "@ant-design/icons";
import { Card, Button, Row, Col } from "antd";
const { Meta } = Card;

import { NavLink, Link, Outlet, useNavigate, redirect } from "react-router-dom";
import { useAuth } from "../../utils/auth";

import styles from "./AppGallery.module.css";

import documentLogo from "../../assets/document2.svg";
import userLogo from "../../assets/user.svg";
import compassLogo from "../../assets/compass.svg";
import calenderLogo from "../../assets/calender.svg";
import { checkPermission } from "../../utils/fns";
import jwtDecode from "jwt-decode";

export default function AppGallery() {
  const allDocTypes = [
    "municipality_property_records",
    "birth_records",
    "construction_license_records",
    "death_records",
    "house_tax_records",
    "trade_license_records",
  ];
  const auth = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };
  return (
    <>
      <div className={styles.appGalleryContainer}>
        <Button
          onClick={handleLogout}
          type="primary"
          danger
          icon={<PoweroffOutlined />}
          style={{ position: "absolute", right: 10, top: 10 }}
        >
          Logout
        </Button>
        <div className={styles.heading}>
          <h1>Select a Service</h1>
        </div>

        <div className={styles.gallery}>
          <Row className={styles.antRow} gutter={[50, 50]} justify={"center"}>
            {checkPermission(
              jwtDecode(auth.user.accesstoken).perms,
              allDocTypes,
              "viewer"
            ) && (
              <Col xs={24} lg={{ span: 12, order: 4 }} xl={{ span: 6 }}>
                <Card
                  className={styles.expandCard}
                  onClick={() => navigate("/digitization")}
                  hoverable
                  cover={<img src={documentLogo} className={styles.cardLogo} />}
                >
                  <Meta
                    title="File Digitization"
                    description="Digitize your files"
                  />
                </Card>
              </Col>
            )}
            <Col xs={24} lg={{ span: 12, order: 4 }} xl={{ span: 6 }}>
              <Card
                className={styles.expandCard}
                onClick={() => navigate("/leavemanagement")}
                hoverable
                cover={<img src={calenderLogo} className={styles.cardLogo} />}
              >
                <Meta
                  title="Leave Management"
                  description="Manage your leaves"
                />
              </Card>
            </Col>
            <Col xs={24} lg={{ span: 12, order: 4 }} xl={{ span: 6 }}>
              <Card
                className={styles.expandCard}
                onClick={() => console.log("3")}
                hoverable
                cover={<img src={compassLogo} className={styles.cardLogo} />}
              >
                <Meta
                  title="File Tracking"
                  description="Track your files in-office"
                />
              </Card>
            </Col>
            {checkPermission(
              jwtDecode(auth.user.accesstoken).perms,
              ["admin"],
              true
            ) && (
              <Col xs={24} lg={{ span: 12, order: 4 }} xl={{ span: 6 }}>
                <Card
                  onClick={() => navigate("/administration")}
                  className={styles.expandCard}
                  hoverable
                  cover={<img src={userLogo} className={styles.cardLogo} />}
                >
                  <Meta
                    title="Administration"
                    description="Manage user accounts"
                  />
                </Card>
              </Col>
            )}
          </Row>
        </div>
      </div>
    </>
  );
}
