import React from "react";
import { useState } from "react";
import axios from "axios";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Form, Input, Row, Col, Button, Upload, message } from "antd";
const { Dragger } = Upload;

//import Global vars
import { FILE_UPLOAD_SIZE_LIMIT } from "../../../GLOBAL_VARS";

import "./styles/MunicipalProperty.css";

const MunicipalProperty = () => {
  const dummyRequest = async ({ file, onSuccess }) => {
    console.log(file);
    console.log("in dummy");
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  //! Test
  const props = {
    name: "file", //
    maxCount: 1, //

    // customRequest: dummyRequest, //!

    beforeUpload(file) {
      //check file type
      console.log(file);
      console.log("checking file");
      const isPdf = file.type === "application/pdf";

      if (!isPdf) {
        message.error(`${file.name} is not a PDF file`);
      }

      const isLessThanUploadLimit =
        file.size / 1024 / 1024 < FILE_UPLOAD_SIZE_LIMIT;

      if (!isLessThanUploadLimit) {
        message.error(`File must smaller than ${FILE_UPLOAD_SIZE_LIMIT}MB!`);
      }

      return (isPdf && isLessThanUploadLimit) || Upload.LIST_IGNORE;
    },

    onRemove(file) {
      //? Change setPdfInViewer prop to null & unrender viewer
      // props.id ? setImage(originalImage) : setImage(RoomImage);
      // setIsDefaultImage(true);
    },

    onChange(info) {
      console.log("in onchange");
      console.log(info);

      const { status } = info.file;

      /*converting to base 64*/
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        // setIsDefaultImage(false);
        // getBase64(info.file.originFileObj);
        //* const file = info.file.originFileObj;

        // let data = new FormData();
        // data.append("fileName", file.name);
        // data.append("file", file);

        //! setPdfFile and create url
        // setImageFile(file);
        // setImage(URL.createObjectURL(file));
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }

      console.log(`leaving onchange. status = ${status}`);
    },

    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  //States
  const [data, setData] = useState({
    title: "",
    ward: "",
    subdiv: "",
    file: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInserted, setIsInserted] = useState(false);
  //Reset Form
  const resetFields = () => {
    setData({
      title: "",
      ward: "",
      subdiv: "",
      file: null,
    });
    setIsInserted(false);
  };

  //functions
  const handleFileChange = (event) => {
    const dataObjFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(dataObjFile);
    if (dataObjFile.type === "application/pdf") {
      console.log(dataObjFile);
      setData({ ...data, file: dataObjFile });
    } else console.log("File not pdf");
  };

  const handleChange = (event) => {
    const dataObj = event.target.value;
    setData({
      ...data,
      [event.target.name]: dataObj,
    });
  };
  //API Calls
  const handleSubmit = async (event) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append("file", data.file);
    setIsLoading(true);

    await axios
      .post("http://localhost:5000/api/v1/digitization/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.status == 200) {
          console.log("File Uploaded");
          console.log(res.data.storageLink);
          insertData(res.data.storageLink);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setIsLoading(false));
  };
  const insertData = async (fileLink) => {
    let jsonObject = {
      WardNo: data.ward,
      SubDivNo: data.subdiv,
      Title: data.title,
      FileLink: fileLink,
    };

    await axios
      .post("http://localhost:5000/api/v1/digitization/insert", jsonObject)
      .then((res) => {
        if (res.status == 200) {
          console.log("Data Inserted Successfully");
          setIsInserted(true);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <h1>MUNICIPAL PROPERTY RECORDS</h1>
      <Form style={{ marginTop: "10px" }}>
        <Row gutter={30}>
          <Col span={6}>
            <Form.Item name="wardNo">
              <Input
                size="large"
                placeholder="Ward No."
                className="form-input-styles"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="houseNo">
              <Input
                size="large"
                placeholder="House No."
                className="form-input-styles"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="Title" required wrapperCol={{ span: 16 }}>
          <Input
            status=""
            size="large"
            placeholder="Title"
            className="form-input-styles"
          />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 6,
          }}
        >
          <Form.Item label="Dragger" required>
            <Form.Item
              name="dragger"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
            >
              {/* <Dragger {...uploadDraggerProps}> */}
              {/* <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibited from
                  uploading company data or other banned files.
                </p>
              </Dragger> */}
              <Upload
                {...props}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default MunicipalProperty;
