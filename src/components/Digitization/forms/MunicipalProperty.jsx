import React from "react";
import { useState } from "react";
import axios from "axios";
import { Form, Input, Row, Col, Button, Upload } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";

import "./styles/MunicipalProperty.css";
import Spinner from "../../../assets/Spinner";
import Tick from "../../../assets/Tick";

const MunicipalProperty = () => {
  //data members

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
      <h1
      // className=" font-bold text-xl mb-2"
      >
        MUNICIPAL PROPERTY RECORDS
      </h1>
      {/* <form
        className="w-full"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="flex flex-row space-x-52 w-2/3">
          <input
            type="text"
            placeholder="Ward No."
            name="ward"
            value={data.ward}
            className="shadow appearance-none border-2 border-gray-500 placeholder-blue-500 rounded py-3 px-3 m-4 leading-tight"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Sub Div No."
            name="subdiv"
            value={data.subdiv}
            className="shadow appearance-none border-2 border-gray-500 placeholder-blue-500 rounded py-3 px-3 m-4 leading-tight"
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={data.title}
          className="block w-2/3 shadow appearance-none border-2 border-gray-500 placeholder-blue-500 rounded py-3 px-3 m-4 leading-tight"
          onChange={handleChange}
          required
        />

        <label
          className="block ml-2 text-blue-500 mt-5 font-bold"
          htmlFor="File"
        >
          Upload file:
        </label>
        <input
          className=" text-blue-500 file:mr-5 file:py-2 file:px-6 file:rounded file:border-0 file:text-sm file:font-bold
            file:bg-blue-500 file:text-blue-50
            hover:file:cursor-pointer m-4"
          type="file"
          name="file"
          onChange={handleFileChange}
          required
        />
        <div className="flex flex-row justify-center space-x-52 w-2/3 mt-14">
          <input
            type="submit"
            value="Submit"
            className="inline-block m-4 px-8 py-2 text-white font-bold bg-blue-500 rounded hover:bg-blue-300"
          />
          <input
            type="reset"
            value="Reset"
            className="inline-block m-4 px-8 py-2 text-blue-500 font-bold border-2 border-blue-500 rounded hover:bg-blue-300 hover:text-white"
            onClick={resetFields}
          />
        </div>
      </form> */}
      {/* <Form>
        <div style={{ display: "flex" }}>
          <Form.Item label={false} name="wardNo">
            <Input placeholder="Ward No." />
          </Form.Item>

          <Form.Item label={false} name="houseNo">
            <Input placeholder="House no." />
          </Form.Item>
        </div>

        <Form.Item label={false} name="Title">
          <Input placeholder="Title" />
        </Form.Item>
      </Form> */}
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
              // getValueFromEvent={normFile}
              noStyle
            >
              <Upload.Dragger name="files" action="/upload.do">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload.
                </p>
              </Upload.Dragger>
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
