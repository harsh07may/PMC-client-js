import React, { useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";
const { Item } = Form;

// const layout = {
//   labelCol: { span: 8 },
//   wrapperCol: { span: 16 },
// };

// const tailLayout = {
//   wrapperCol: { offset: 8, span: 16 },
// };

const layout = {
  labelCol: {
    // xs: { span: 24 },
    // sm: { span: 12 },
    // md: { span: 8 },
    // lg: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 2 },
    // sm: { span: 12 },
    // md: { span: 14 },
    // lg: { span: 16 },
  },
};
const tailLayout = {
  wrapperCol: {
    xs: { offset: 12 },
    sm: { span: 1, offset: 12 },
    // md: { span: 1, offset: 8 },
    md: { span: 1 },
    // lg: { span: 12, offset: 8 },
  },
};

const AdminDashboard = () => {
  return (
    // <Form {...layout}>
    //   <Item label="Name" name="username" style={{ backgroundColor: "blue" }}>
    //     {" "}
    //     <Input type="text" />{" "}
    //   </Item>
    //   <Item
    //     label="Password"
    //     name="password"
    //     style={{ backgroundColor: "blue" }}
    //   >
    //     {" "}
    //     <Input type="password" />{" "}
    //   </Item>
    //   <Item {...tailLayout} style={{ backgroundColor: "blue" }}>
    //     <Button htmlType="submit" type="primary">
    //       {" "}
    //       Submit{" "}
    //     </Button>
    //   </Item>
    // </Form>
    <Row align="middle" justify="center">
      <Col xs={24} sm={20} md={16} lg={12}>
        <Form>
          <Form.Item label="Username">
            <Input />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default AdminDashboard;
