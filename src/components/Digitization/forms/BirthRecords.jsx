import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Row, Col, Button, message } from "antd";

import { formInputStyles } from "./styles/AddForm.module.css";

//! test imports (start)
// ?  test imports for upload
import { UploadOutlined } from "@ant-design/icons";
import {
  // Button,
  // Form,
  // message,
  Upload,
} from "antd";
//! test imports (end)

const BirthRecords = () => {
  //! test states (start)

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    console.log(fileList);
  }, [fileList]);
  //! test states (end)

  //* Old States
  const [form] = Form.useForm();
  const [data, setData] = useState({
    file: null,
  });
  const [pdfFile, setPdfFile] = useState(null);
  //* Old lStates

  //! test functions (start)
  function onRemove(file) {
    setFileList([]);
    console.log("on remove");
    //* old code
    setPdfFile(null);
    //* old code
  }

  //* beforeUpload() is basically handleFileChange()
  function beforeUpload(file) {
    console.log(file);
    setFileList([file]);
    // console.log(fileList);

    //* old code from handleFileChange
    const dataObjFile = file;
    const reader = new FileReader();
    reader.readAsText(dataObjFile);

    if (dataObjFile.type === "application/pdf") {
      console.log(dataObjFile);
      setData({ ...data, file: dataObjFile });

      //for preview button

      //const files = e.target.files; // check file array AKA FileList
      // fileList.length > 0 &&
      setPdfFile(URL.createObjectURL(file));
    } else {
      setFileList([]);
      setPdfFile(null);
      message.warning("File is not a PDF", 1.5);
    }
    return false;
  }
  //! test funcs (end)

  //functions
  const handleFileChange = (e) => {
    const dataObjFile = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(dataObjFile);

    if (dataObjFile.type === "application/pdf") {
      // console.log(dataObjFile);
      setData({ ...data, file: dataObjFile });

      //for preview button
      const files = e.target.files;
      files.length > 0 && setFile(URL.createObjectURL(files[0]));
    } else {
      e.target.value = "";
      setFile(null);
      message.warning("File is not a PDF", 1.5);
    }
  };

  //API Calls
  const onFinish = async (values) => {
    values = { ...values, file: data.file, type: "birth_record" };

    //! test area

    //! test area

    console.log(values);
    await axios
      .post("http://localhost:5000/api/v1/digitization/upload", values, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.status == 200) {
          insertData(values, res.data.fileLink);
        }
      })
      .catch((error) => {
        message.error("File Uploaded Failed", 1.5);
        // console.log(error)
      })
      .finally();
  };

  const insertData = async (formValues, fileLink) => {
    // console.log({ formValues: formValues });
    let jsonObject = {
      Month: formValues.month,
      Year: formValues.year,
      FileLink: fileLink,
    };

    await axios
      .post(
        "http://localhost:5000/api/v1/digitization/insert?type=birth_record",
        jsonObject
      )
      .then((res) => {
        if (res.status == 200) {
          // console.log({ jsonobj: jsonObject });
          message.success("File Uploaded Successfully", 1.5);
          form.resetFields();
        }
      })
      .catch((error) => {
        message.error("File Uploaded Failed", 1.5);
        // console.log(error)
      });
  };

  return (
    <>
      <h1>BIRTH RECORDS</h1>
      <Form
        style={{ marginTop: "10px" }}
        onFinish={onFinish}
        onFinishFailed={() => console.log("failed")}
        form={form}
      >
        <Row gutter={30}>
          <Col span={6}>
            <Form.Item name="month" required>
              <Input
                autoComplete="off"
                required
                size="large"
                placeholder="Month"
                className={formInputStyles}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="year" required>
              <Input
                autoComplete="off"
                required
                size="large"
                placeholder="Year"
                className={formInputStyles}
              />
            </Form.Item>
          </Col>
        </Row>
        {/* <Form.Item name="title" required wrapperCol={{ span: 16 }}>
          <Input
            required
            status=""
            size="large"
            placeholder="Title"
            className={formInputStyles}
          />
        </Form.Item> */}
        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 6,
          }}
        >
          {/* <Form.Item required>
            <input
              autoComplete="off"
              type="file"
              accept="application/pdf, .pdf"
              onChange={handleFileChange}
              required
              style={{ maxWidth: "230px" }}
            />
          </Form.Item> */}
          //! test upload
          <Form.Item
            required
            name="upload"
            // label="Upload"
            valuePropName="fileList"
            // getValueFromEvent={normFile}
            // extra="longgggggggggggggggggggggggggggggggggg"
          >
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
          //! test upload
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
    </>
  );
};

export default BirthRecords;
