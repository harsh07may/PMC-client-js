import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, notification, Form, Input, message } from "antd";
import "./Login.css";
import axios from "axios";
import { useAuth } from "../../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
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
        auth.login(accesstoken);
        navigate("/digitization", { replace: true });
      })
      .catch((err) => {
        openNotification();
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <div className="main-container">
        <div className="second-container"></div>
        <Form
          className="form-container"
          name="basic"
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <h2 style={{ margin: "0 auto" }}>L O G I N</h2>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
