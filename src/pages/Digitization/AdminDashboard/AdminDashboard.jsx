import React, { useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";
const { Item } = Form;

const AdminDashboard = () => {
  return (
    <>
      <Row
        justify="space-evenly"
        align={"middle"}
        style={{ background: "grey" }}
      >
        <Col xs={24} md={{ span: 12, order: 4 }} lg={{ span: 6, order: 1 }}>
          <div
            style={{ height: "200px", width: "200px", backgroundColor: "red" }}
          />
        </Col>
        <Col xs={24} md={{ span: 12, order: 3 }} lg={{ span: 6, order: 2 }}>
          <div
            style={{ height: "200px", width: "200px", backgroundColor: "blue" }}
          />
        </Col>
        <Col xs={24} md={{ span: 12, order: 2 }} lg={{ span: 6, order: 3 }}>
          <div
            style={{
              height: "200px",
              width: "200px",
              backgroundColor: "green",
            }}
          />
        </Col>
        <Col xs={24} md={{ span: 12, order: 1 }} lg={{ span: 6, order: 4 }}>
          <div
            style={{
              height: "200px",
              width: "200px",
              backgroundColor: "purple",
            }}
          />
        </Col>
      </Row>
      <Row style={{ background: "pink" }} justify="space-evenly">
        <Col span={4}>col-4</Col>
        <Col span={4}>col-4</Col>
        <Col span={4}>col-4</Col>
        <Col span={4}>col-4</Col>
      </Row>
      <Row style={{ background: "pink" }} justify="center">
        <Col span={4}>col-4</Col>
        <Col span={4}>col-4</Col>
        <Col span={4}>col-4</Col>
        <Col span={4}>col-4</Col>
      </Row>
      <Row style={{ background: "pink" }} justify="end">
        <Col span={4} style={{ textAlign: "center" }}>
          col-4
        </Col>
        <Col span={4}>col-4</Col>
        <Col span={4}>col-4</Col>
        <Col span={4}>col-4</Col>
      </Row>
      <Row style={{ background: "pink" }} justify="space-between">
        <Col span={4}>col-4</Col>
        <Col span={4}>col-4</Col>
        <Col span={4}>col-4</Col>
        <Col span={4}>col-4</Col>
      </Row>
    </>
  );
};

export default AdminDashboard;
