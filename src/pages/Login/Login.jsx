import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Button, notification, Form, Input } from "antd";
import axios from "axios";
import { useAuth } from "../../utils/auth";

//TODO login needs css module file! backgroound needs margin and padding = 0
import "./Login.css";
import logo from "../../assets/pmc_logo.png";
import { getEnv } from "../../utils/getEnv";

export default function Login() {
  const auth = useAuth();

  const navigate = useNavigate();

  const openNotification = () => {
    notification.error({
      message: "Unsuccessful Login!",
      description: "Try again",
    });
  };
  const onFinish = (values) => {
    axios({
      method: "post",
      url: `${getEnv("VITE_API_STRING")}/api/v1/user/login`,
      data: values,
      withCredentials: true,
    })
      .then((res) => {
        auth.login(res.data);
        auth.setLoading(false);
        navigate("/AppGallery", { replace: true });
      })
      .catch((err) => {
        openNotification();
      });
  };
  return (
    <>
      <div className="login-container">
        <div className="main-container">
          <div className="logo-container">
            <img className="login-logo" src={logo} alt="logo" />
            <h3 className="logo-items">PONDA MUNICIPAL COUNCIL</h3>
            <h4 className="logo-items">E-OFFICE APPLICATION</h4>
          </div>
          <Form
            className="login-form"
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            labelCol={{
              span: 10,
            }}
            wrapperCol={{
              span: 26,
            }}
          >
            {/* <h2 style={{ margin: "0 auto" }}>L O G I N</h2> */}
            <h2>W E L C O M E</h2>
            <Form.Item
              name="username"
              style={{ marginTop: "30px" }}
              rules={[
                {
                  required: true,
                  message: "Please enter your username!",
                },
              ]}
            >
              <Input
                className="login-form-input"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password!",
                },
              ]}
            >
              <Input.Password
                className="login-form-input"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item style={{ marginTop: "10px" }}>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}
