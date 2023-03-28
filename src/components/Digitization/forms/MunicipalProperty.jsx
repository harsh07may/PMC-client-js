import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Row, Col, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

//import Global vars
// import { FILE_UPLOAD_SIZE_LIMIT } from "../../../GLOBAL_VARS";

import { formInputStyles } from "./styles/AddForm.module.css";

const MunicipalProperty = () => {
  //States
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState({
    file: null,
  });
  const [pdfFile, setPdfFile] = useState(null);

  //functions
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
    values = { ...values, file: data.file, type: "municipal_property_record" };
    setUploading(true);

    await axios
      .post("http://localhost:5000/api/v1/digitization/upload", values, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        // console.log({ respose: res });
        // form.resetFields();
        if (res.status == 200) {
          insertData(values, res.data.fileLink);
        }
      })
      .catch((error) => {
        message.error("File Uploaded Failed", 1.5);
        setUploading(false);
        // console.log(error)
      })
      .finally();
  };

  const insertData = async (formValues, fileLink) => {
    // console.log({ formValues: formValues });
    let jsonObject = {
      WardNo: formValues.wardNo,
      SubDivNo: formValues.subDivNo,
      Title: formValues.title,
      type: "municipal_property_record",
      FileLink: fileLink,
    };

    await axios
      .post("http://localhost:5000/api/v1/digitization/insert", jsonObject)
      .then((res) => {
        if (res.status == 200) {
          message.success("File Uploaded Successfully", 1.5);
          form.resetFields();
        }
      })
      .catch((error) => {
        setUploading(false);
        message.error("File Uploaded Failed", 1.5);
        // console.log(error)
      });
  };

  return (
    <>
      <h1>MUNICIPAL PROPERTY RECORDS</h1>
      <Form
        style={{ marginTop: "10px" }}
        onFinish={onFinish}
        onFinishFailed={() => console.log("failed")}
        form={form}
      >
        <Row gutter={30}>
          <Col span={6}>
            <Form.Item name="wardNo" required>
              <Input
                autoComplete="off"
                required
                size="large"
                placeholder="Ward No."
                className={formInputStyles}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="subDivNo" required>
              <Input
                autoComplete="off"
                required
                size="large"
                placeholder="Sub Division No."
                className={formInputStyles}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="title" required wrapperCol={{ span: 16 }}>
          <Input
            autoComplete="off"
            required
            status=""
            size="large"
            placeholder="Title"
            className={formInputStyles}
          />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            span: 12,
            // offset: 6,
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
          </Form.Item>
          {file ? (
            <>
              <Button
                type="primary"
                onClick={() => {
                  window.open(file);
                }}
              >
                Preview File
              </Button>
            </>
          ) : (
            <></>
          )}

          <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>
            Submit
          </Button> */}
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
          {/* //! test upload (end) */}
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

export default MunicipalProperty;
