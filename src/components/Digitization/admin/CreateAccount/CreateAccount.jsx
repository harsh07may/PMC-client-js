import React, { useState } from "react";
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  message,
} from "antd";
const { Option } = Select;
import axios from "axios";
import { useAuth } from "../../../../utils/auth";

// import { formInputStyles } from "./createAccounts.module.css";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default function CreateAccount() {
  const auth = useAuth();
  const onFinish = (values) => {
    console.log(values);
    axios
      .post("http://localhost:5000/api/v1/user/register", values, {
        headers: {
          Authorization: `Bearer ${auth.user.accesstoken}`,
        },
      })
      .then((res) => {
        // console.log({ respose: res });
        if (res.status == 200) {
          message.success("Account Registered Successfully!", 1.5);
          form.resetFields();
        }
      })
      .catch((error) => {
        if (error.response.status == 400) {
          message.error("Username already registered!", 1.5);
        }
        console.log(error);
      })
      .finally();
  };

  const [form] = Form.useForm();

  return (
    <>
      <br />
      <h3 style={{ textAlign: "center" }}>MUNICIPAL PROPERTY RECORDS</h3>
      <br />

      <Row align="middle" justify="center">
        <Col xs={22} sm={20} md={16} lg={12}>
          <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            style={{
              maxWidth: 600,
            }}
            scrollToFirstError
          >
            <Form.Item
              name="fullname"
              label="Full Name"
              rules={[
                {
                  required: true,
                  message: "Please input your full name!",
                },
                {
                  max: 30,
                  message: "Name has to be less than 30 characters!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="username"
              label="Username"
              tooltip="A name to uniquely identify yourself"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                  whitespace: false,
                },
                {
                  pattern: new RegExp(/^(\w)+$/),
                  message:
                    "Whitespaces and special characters are not allowed!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                {
                  pattern: new RegExp(/^.{8,20}$/),
                  message: "Password should be at least 8 characters long!",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="designation"
              label="Designation"
              rules={[
                {
                  required: true,
                  message: "Please input your Designation!",
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="roles"
              label="Role"
              rules={[
                {
                  required: true,
                  message: "Please select a role!",
                },
              ]}
            >
              <Select placeholder="Role">
                <Option value="viewer">Viewer</Option>
                <Option value="editor">Editor</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                Create Account
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
