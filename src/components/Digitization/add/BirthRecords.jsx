import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
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
import { UploadOutlined } from "@ant-design/icons";
import { useAuth } from "../../../utils/auth";
import { getIndexOfMonth } from "../../../utils/fns";
import * as formInputStyles from "./styles/AddForm.module.css";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getEnv } from "../../../utils/getEnv";
dayjs.extend(customParseFormat);

const BirthRecords = () => {
  const auth = useAuth();
  let { state } = useLocation();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [form] = Form.useForm();
  const [data, setData] = useState({
    file: null,
  });
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    if (state) {
      const month = state.month;
      const year = state.year;

      const formattedDate = dayjs().month(getIndexOfMonth(month)).year(year);

      //* fill in the month and year
      form.setFieldsValue({
        month: formattedDate,
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

  const onFinish = async (values) => {
    console.log(values);
    let Month = dayjs(values.month).format("MMM");
    let Year = dayjs(values.month).format("YYYY");
    let Title = values.title;

    values = { Month, Year, Title, file: data.file, type: "birth_record" };
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
                  rules={[
                    { required: true, message: "Please select a month!" },
                  ]}
                >
                  <DatePicker
                    className={`${formInputStyles.monthPicker}`}
                    picker="month"
                    format="MMMM YYYY"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} sm={24} align="middle">
                <Form.Item
                  name="title"
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
                    className={`${formInputStyles.formInputStyles}`}
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

export default BirthRecords;
