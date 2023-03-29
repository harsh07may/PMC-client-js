import React, { useState, useEffect } from "react";
import axios from "axios";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { formInputStyles } from "./searchForm.module.css";
import {
  Badge,
  Dropdown,
  Space,
  Table,
  Form,
  Input,
  Row,
  Col,
  Button,
  message,
} from "antd";
import { useAuth } from "../../../utils/auth";
import fileDownload from "js-file-download";

//! test
const items = [
  {
    key: "1",
    label: "Action 1",
  },
  {
    key: "2",
    label: "Action 2",
  },
];
//! test

const MunicipalPropertySearch = () => {
  //data members
  //! test
  const auth = useAuth();

  const handleclick = (recordid) => {
    axios({
      method: "get",
      url: `http://localhost:5000/api/v1/digitization/file-download?recordid=${recordid}&type=municipal_property_record`,
      headers: {
        Authorization: `Bearer ${auth.user}`,
      },
      responseType: "blob",
    })
      .then((res) => {
        const fileName = res.headers["content-disposition"]
          .split('filename="')[1]
          .slice(0, -1);
        fileDownload(res.data, fileName);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const columns = [
    {
      title: "Ward No.",
      dataIndex: "wardno",
      key: "wardno",
    },
    {
      title: "Sub Div No.",
      dataIndex: "subdivno",
      key: "subdivno",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Action",
      key: "filelink",
      render: (_, record) => (
        <Button
          size="small"
          onClick={() => {
            console.log("record");
            // console.log(record);
            handleclick(record.recordid);
          }}
        >
          Download
        </Button>
      ),
    },
  ];
  const embededData = [];
  for (let i = 0; i < 3; ++i) {
    embededData.push({
      key: i.toString(),
      title: "Screen",
      subDivNo: "10.3.4.5654",
      wardNo: 500,
      // expandable: i % 2 == 0 ? false : true,
      expandable: false,
    });
  }

  const expandedRowRender = () => {
    const columns = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Status",
        key: "state",
        render: () => <Badge status="success" text="Finished" />,
      },
      {
        title: "Upgrade Status",
        dataIndex: "upgradeNum",
        key: "upgradeNum",
      },
      {
        title: "Action",
        dataIndex: "operation",
        key: "operation",
        render: () => <a>Download</a>,
      },
    ];
    const dataSrc = [];
    for (let i = 0; i < 3; ++i) {
      dataSrc.push({
        key: i.toString(),
        date: "2014-12-24 23:12:00",
        name: "This is production name",
        upgradeNum: "Upgraded: 56",
      });
    }
    return <Table columns={columns} dataSource={dataSrc} pagination={false} />;
  };

  //! test

  //States
  const [reqSent, setReqSent] = useState(false);
  const [searching, setSearching] = useState(false);
  const [data, setData] = useState(null);
  const [tableData, setTableData] = useState([]);

  //* Make a UE call after data state updates to format the data for the Table.
  useEffect(() => {
    console.log("data modified");
    if (data !== null) {
      console.log(data);
      handleDataChange();
    } else console.log("data null");
  }, [data]);

  useEffect(() => {
    console.log(tableData);
  }, [tableData]);

  //functions
  const handleDataChange = async () => {
    console.log("oil");
    for (let i = 0; i < data.length; i++) {
      data[i].key = i.toString();
    }
    setTableData(data);
  };

  //API Calls
  const onFinish = async (values) => {
    values = { ...values, type: "municipal_property_record" };

    for (const key in values) {
      if (typeof values[key] === "undefined") {
        values[key] = "";
      }
    }

    setSearching(true);
    console.log(values);

    await axios
      .get(
        `http://localhost:5000/api/v1/digitization/search?type=${values.type}&subDivNo=${values.subDivNo}&title=${values.title}&wardNo=${values.wardNo}`
      )
      .then((res) => {
        setData(res.data);
        setSearching(false);
      })
      .catch((err) => {
        message.error("File not found", 2);
        setData(null);
        setSearching(false);
        // message.error(err, 1.4);
      });
  };

  return (
    <>
      <h1>MUNICIPAL PROPERTY RECORDS</h1>
      <br />
      <Form
        style={{ marginTop: "10px" }}
        onFinish={onFinish}
        // onFinishFailed={() => console.log("failed")}
        // form={form}
      >
        <Row gutter={30}>
          <Col span={6}>
            <Form.Item name="wardNo">
              <Input
                autoComplete="off"
                size="large"
                placeholder="Ward No."
                className={formInputStyles}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="subDivNo">
              <Input
                autoComplete="off"
                size="large"
                placeholder="Sub Division No."
                className={formInputStyles}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="title" wrapperCol={{ span: 16 }}>
          <Input
            autoComplete="off"
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
          <Button
            // type="primary"
            icon={<SearchOutlined />}
            htmlType="submit"
            style={{ marginLeft: 10 }}
            loading={searching}
          >
            {searching ? "Searching" : "Search"}
          </Button>
        </Form.Item>
      </Form>
      <br />
      {/* {reqSent && ( */}
      <Table
        loading={searching}
        columns={columns}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.expandable,
        }}
        dataSource={tableData}
        // size="small"
      />
      {/* )} */}
    </>
  );
};

export default MunicipalPropertySearch;
