import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Form, Input, Row, Col, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useAuth } from "../../../utils/auth";
import { formInputStyles } from "./styles/AddForm.module.css";
import { getEnv } from "../../../utils/getEnv";

const AddConstuctionLicense = () => {
  //States
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  let { state } = useLocation();
  const [data, setData] = useState({
    file: null,
  });
  const [pdfFile, setPdfFile] = useState(null);

  function checkError(err) {
    if (err.response.data.error?.name == "AuthenticationError") {
      message
        .error("You need to reload the page and try again!", 3.5)
        .then(() => window.location.reload(true));
    } else if (err.response.data.error?.name == "BadRequestError") {
      message.error(`${err.response.data.error?.message}`, 3.5);
    } else if (err.response.data.error?.name == "AccessDeniedError") {
      message.error(`${err.response.data.error?.message}`, 3.5);
    } else {
      message.error("File Upload failed", 3.5);
    }
  }

  useEffect(() => {
    if (state) {
      console.log(state);
      const licenseNo = state.licenseNo;
      const surveyNo = state.surveyNo;

      //* fill in the form
      form.setFieldsValue({
        licenseNo: licenseNo,
        surveyNo: surveyNo,
      });
    }
  }, [state]);

  function onRemove() {
    setFileList([]);
    setPdfFile(null);
  }

  function beforeUpload(file) {
    setFileList([file]);
    const dataObjFile = file;
    const reader = new FileReader();
    reader.readAsText(dataObjFile);

    if (dataObjFile.type === "application/pdf") {
      setData({ ...data, file: dataObjFile });
      setPdfFile(URL.createObjectURL(file));
    } else {
      setFileList([]);
      setPdfFile(null);
      message.warning("File is not a PDF", 1.5);
    }
    return false;
  }

  const auth = useAuth();
  const onFinish = async (values) => {
    values = {
      ...values,
      file: data.file,
      type: "construction_license_record",
    };
    setUploading(true);
    await axios
      .post(`${getEnv("VITE_API_STRING")}/api/v1/digitization/upload`, values, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.user.accesstoken}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          message.success("File Uploaded Successfully", 1.5);
          form.resetFields();
          setFileList([]);
          setPdfFile(null);
          setUploading(false);
        }
      })
      .catch((error) => {
        // message.error("File Uploaded Failed", 1.5);
        setUploading(false);
        checkError(error);
      });
  };

  return (
    <>
      <br />
      <h3 style={{ textAlign: "center" }}>CONSTRUCTION LICENSE RECORDS</h3>
      <br />

      <Row align="middle" justify="center">
        <Col xs={22} sm={20} md={16} lg={12}>
          <Form
            style={{ marginTop: "10px", overflow: "hidden" }}
            onFinish={onFinish}
            onFinishFailed={() => console.log("failed")}
            form={form}
          >
            <Row gutter={24}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="licenseNo"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a license number!",
                    },
                    {
                      pattern: new RegExp(/^.{5,250}$/),
                      message:
                        "License number should be at least 5 characters long!",
                    },
                    {
                      pattern: new RegExp(/^(?!\s)(.*\S)?(?<!\s)$/),
                      message:
                        "License number should not start/end with a whitespace character!",
                    },
                  ]}
                >
                  <Input
                    autoComplete="off"
                    size="large"
                    placeholder="License No."
                    className={formInputStyles}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="surveyNo"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a survey number!",
                    },
                    {
                      pattern: new RegExp(/^.{5,250}$/),
                      message:
                        "Survey number should be at least 5 characters long!",
                    },
                    {
                      pattern: new RegExp(/^(?!\s)(.*\S)?(?<!\s)$/),
                      message:
                        "Survey number should not start/end with a whitespace character!",
                    },
                  ]}
                >
                  <Input
                    autoComplete="off"
                    size="large"
                    placeholder="Survey No."
                    className={formInputStyles}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="location"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a location!",
                    },
                    {
                      pattern: new RegExp(/^.{5,250}$/),
                      message: "Location should be at least 5 characters long!",
                    },
                    {
                      pattern: new RegExp(/^(?!\s)(.*\S)?(?<!\s)$/),
                      message:
                        "Location should not start/end with a whitespace character!",
                    },
                  ]}
                >
                  <Input
                    autoComplete="off"
                    size="large"
                    placeholder="Location"
                    className={formInputStyles}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="title"
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
                  wrapperCol={{ xs: { span: 20 }, sm: { span: 24 } }}
                >
                  <Input
                    autoComplete="off"
                    status=""
                    size="large"
                    placeholder="Title"
                    className={formInputStyles}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item wrapperCol={{ xs: { span: 20 }, sm: { span: 14 } }}>
              <Form.Item required name="upload" valuePropName="fileList">
                <>
                  <Upload
                    fileList={fileList}
                    accept="application/pdf, .pdf"
                    maxCount={1}
                    onRemove={onRemove}
                    beforeUpload={beforeUpload}
                  >
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                </>
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={fileList.length === 0}
                loading={uploading}
              >
                {uploading ? "Uploading" : "Submit"}
              </Button>
              {pdfFile ? (
                <>
                  <Button
                    style={{ marginLeft: 10 }}
                    onClick={() => {
                      window.open(pdfFile);
                    }}
                  >
                    Preview File
                  </Button>
                </>
              ) : (
                <></>
              )}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default AddConstuctionLicense;
