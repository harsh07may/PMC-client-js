import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Row, Col, Button, message, Upload } from "antd";
import { useAuth } from "../../../utils/auth";
import { formInputStyles } from "./NewApplication.module.css";
import { getEnv } from "../../../utils/getEnv";

const NewApplication = () => {
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();

  const auth = useAuth();
  //API Calls
  const onFinish = async (values) => {
    // console.log(values);
    for (const key in values) {
      values[key] = values[key].trim();
    }
    setUploading(true);

    await axios
      .post(
        `${getEnv("VITE_API_STRING")}/api/v1/application/createApplication`,
        values,
        {
          headers: {
            //   "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${auth.user.accesstoken}`,
          },
        }
      )
      .then((res) => {
        message.success("Application Created Successfully", 1.5);
        form.resetFields();
        setUploading(false);
      })
      .catch((err) => {
        setUploading(false);
        console.log(err);
        if (err.response.data?.name == "BadRequestError") {
          message.error(`${err.response.data?.message}`, 3.5);
        }
        if (err.response.data.error?.name == "AuthenticationError") {
          message
            .error("You need to reload the page and try again!", 3.5)
            .then(() => window.location.reload(true));
        }
      });
  };

  return (
    <>
      <br />
      <h3 style={{ textAlign: "center" }}>NEW APPLICATION</h3>
      <br />

      <Row align="middle" justify="center">
        <Col xs={22} sm={20} md={16} lg={12}>
          <Form
            style={{ marginTop: "10px", overflow: "hidden" }}
            onFinish={onFinish}
            // onFinishFailed={() => console.log("failed")}
            form={form}
          >
            <Row gutter={24}>
              <Col xs={24} md={24}>
                <Form.Item
                  name="ref_id"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a reference number!",
                    },
                    {
                      pattern: new RegExp(/^.{1,50}$/),
                      message:
                        "Reference number should be at least 1 characters long!",
                    },
                    {
                      pattern: new RegExp(/^(?!\s)(.*\S)?(?<!\s)$/),
                      message:
                        "Reference number should not start/end with a whitespace character!",
                    },
                  ]}
                >
                  <Input
                    autoComplete="off"
                    size="large"
                    placeholder="Reference No."
                    className={formInputStyles}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24} md={24}>
                <Form.Item
                  name="inward_no"
                  initialValue={""}
                  rules={[
                    {
                      pattern: new RegExp(/^.{1,50}$/),
                      message:
                        "Inward number should be at least 1 characters long!",
                    },
                    {
                      pattern: new RegExp(/^(?!\s)(.*\S)?(?<!\s)$/),
                      message:
                        "Inward number should not start/end with a whitespace character!",
                    },
                  ]}
                >
                  <Input
                    autoComplete="off"
                    size="large"
                    placeholder="Inward No. (Not Mandatory)"
                    className={formInputStyles}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="applicant"
              wrapperCol={{ xs: { span: 20 }, sm: { span: 24 } }}
              rules={[
                {
                  required: true,
                  message: "Please enter an applicant!",
                },
                {
                  pattern: new RegExp(/^.{5,250}$/),
                  message: "Applicant should be at least 5 characters long!",
                },
                {
                  pattern: new RegExp(/^(?!\s)(.*\S)?(?<!\s)$/),
                  message:
                    "Applicant should not start/end with a whitespace character!",
                },
              ]}
            >
              <Input
                autoComplete="off"
                status=""
                size="large"
                placeholder="Applicant"
                className={formInputStyles}
              />
            </Form.Item>
            <Form.Item
              name="title"
              wrapperCol={{ xs: { span: 20 }, sm: { span: 24 } }}
              rules={[
                {
                  required: true,
                  message: "Please enter a title!",
                },
                {
                  pattern: new RegExp(/^.{5,250}$/),
                  message: "Title should be at least 5 characters long!",
                },
                {
                  pattern: new RegExp(/^(?!\s)(.*\S)?(?<!\s)$/),
                  message:
                    "Title should not start/end with a whitespace character!",
                },
              ]}
            >
              <Input
                autoComplete="off"
                status=""
                size="large"
                placeholder="Subject"
                className={formInputStyles}
              />
            </Form.Item>
            <Row xs={24} md={24} justify="center">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  //   style={{ marginLeft: 10 }}
                  //   disabled={fileList.length === 0}
                  loading={uploading}
                >
                  {uploading ? "Creating" : "Create"}
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default NewApplication;
