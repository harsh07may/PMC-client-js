import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Upload,
  Form,
  Input,
  Row,
  Col,
  Button,
  message,
  DatePicker,
} from "antd";
import { useAuth } from "../../../utils/auth";
import * as formInputStyles from "./styles/AddForm.module.css";
import { UploadOutlined } from "@ant-design/icons";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const BirthRecords = () => {
  const auth = useAuth();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [form] = Form.useForm();
  const [data, setData] = useState({
    file: null,
  });
  const [pdfFile, setPdfFile] = useState(null);

  function onRemove() {
    setFileList([]);
    console.log("on remove");
    setPdfFile(null);
  }

  function beforeUpload(file) {
    console.log(file);
    setFileList([file]);
    const dataObjFile = file;
    const reader = new FileReader();
    reader.readAsText(dataObjFile);

    if (dataObjFile.type === "application/pdf") {
      console.log(dataObjFile);
      setData({ ...data, file: dataObjFile });

      //for preview button
      setPdfFile(URL.createObjectURL(file));
    } else {
      setFileList([]);
      setPdfFile(null);
      message.warning("File is not a PDF", 1.5);
    }
    return false;
  }

  const onFinish = async (values) => {
    let month = dayjs(values.month).format("MMM");
    let year = dayjs(values.month).format("YYYY");

    values = { month, year, file: data.file, type: "birth_record" };
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
          setUploading(false);
        }
      })
      .finally();
  };

  return (
    <>
      <br />
      <h3 style={{ textAlign: "center" }}>BIRTH RECORDS</h3>
      <br />
      <Row align="middle" justify="center">
        <Col xs={22} sm={20} md={16} lg={14} xl={10}>
          <Form
            style={{ marginTop: "10px", overflow: "hidden" }}
            onFinish={onFinish}
            onFinishFailed={() => console.log("failed")}
            form={form}
          >
            <Row>
              <Col xs={24} sm={24} align="middle">
                <Form.Item
                  name="month"
                  rules={[{ required: true, message: "Please select month!" }]}
                >
                  <DatePicker
                    className={`${formInputStyles.monthPicker}`}
                    picker="month"
                    format="MMMM YYYY"
                    size="large"
                  />
                </Form.Item>
              </Col>
              {/* <Col xs={24} sm={12}>
                <Form.Item name="month" required>
                  <Input
                    autoComplete="off"
                    required
                    size="large"
                    placeholder="Month"
                    className={formInputStyles}
                  />
                </Form.Item>
              </Col> */}
              {/* <Col xs={24} sm={12}>
                <Form.Item name="year" required>
                  <Input
                    autoComplete="off"
                    required
                    size="large"
                    placeholder="Year"
                    className={formInputStyles}
                  />
                </Form.Item>
              </Col> */}
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
              {pdfFile ? (
                <>
                  <Button
                    type="primary"
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
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginLeft: 10 }}
                disabled={fileList.length === 0}
                loading={uploading}
              >
                {uploading ? "Uploading" : "Submit"}
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default BirthRecords;
