import React, { useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Button, notification, Form, Input, message } from "antd";
import axios from "axios";
import { useAuth } from "../../utils/auth";

import "./Login.css";
import logo from "../../assets/pmc_logo.png";

export default function Login() {
  const auth = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      auth.logout();
    }
  }, []);

  const openNotification = () => {
    notification.open({
      message: "Unsuccessful Login",
      description: "Try again",
    });
  };
  const onFinish = (values) => {
    axios({
      method: "post",
      url: "http://localhost:5000/api/v1/user/login",
      data: values,
    })
      .then((res) => {
        const { accesstoken } = res.data;
        console.log(res.data.IPv4);
        auth.login(accesstoken);
        navigate("/digitization", { replace: true });
      })
      .catch((err) => {
        openNotification();
      });
  };
  const onFinishFailed = (errorInfo) => {
    //!
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <div className="login-container">
        <div className="main-container">
          <div className="logo-container">
            <img className="login-logo" src={logo} alt="logo" />
            <h3 className="logo-items">PONDA MUNICIPAL COUNCIL</h3>
            <h4 className="logo-items">DIGITIZATION APPLICATION</h4>
          </div>
          <Form
            className="login-form"
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
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

            {/* <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
            >
            <Button type="primary" htmlType="submit">
            Submit
            </Button>
          </Form.Item> */}
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
