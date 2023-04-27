import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Row, Col, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useAuth } from "../../../utils/auth";
import { formInputStyles } from "./styles/AddForm.module.css";

const AddConstuctionLicense = () => {
  //States
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState({
    file: null,
  });
  const [pdfFile, setPdfFile] = useState(null);

  function onRemove(file) {
    setFileList([]);
    console.log("on remove");
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
      .post("http://localhost:5000/api/v1/digitization/upload", values, {
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
        console.log(error.name);
        if (error.name == "AuthenticationError") {
          message.error("You are not logged in", 1.5);
          console.log("ok");
        }
      })
      .finally();
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
                  name="subDivNo"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a sub-division number!",
                    },
                  ]}
                >
                  <Input
                    autoComplete="off"
                    size="large"
                    placeholder="Sub Division No."
                    className={formInputStyles}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="year"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a year!",
                    },
                    // TODO add regex for year, 4 digits
                  ]}
                >
                  <Input
                    autoComplete="off"
                    size="large"
                    placeholder="Year"
                    className={formInputStyles}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a title!",
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
