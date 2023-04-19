import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
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

const MunicipalPropertySearch = () => {
  //data members
  const auth = useAuth();

  const handleclick = (recordid) => {
    axios({
      method: "get",
      url: `http://localhost:5000/api/v1/digitization/file-download?recordid=${recordid}&type=municipal_property_record`,
      headers: {
        Authorization: `Bearer ${auth.user.accesstoken}`,
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
      width: "15%",
    },
    {
      title: "Sub Div No.",
      dataIndex: "subdivno",
      key: "subdivno",
      width: "15%",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: "Action",
      width: "15%",
      key: "filelink",
      render: (_, record) =>
        record.hasChildren ? (
          <></>
        ) : (
          <Button
            size="small"
            onClick={() => {
              console.log("download " + record.recordid);
              // console.log(record);
              handleclick(record.recordid);
            }}
          >
            Download
          </Button>
        ),
    },
  ];

  //! EXPERIMENTAL
  //TODO EMBEDED COLUMNS
  //* TESTED
  const expandedColumns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "Timestamp",
      // 19-04-2023 01:00:17 PM
      // render: (_, record) => record.timestamp.split(" ")[0],
      render: (_, record) => {
        return dayjs(record.timestamp, "DD-MM-YYYY HH:mm:ss A").format(
          "DD/MM/YYYY h:mm A"
        );
      },
    },
    {
      title: "Action",
      dataIndex: "operation2",
      key: "operation2",
      render: (_, record) => (
        <Button
          size="small"
          onClick={() => {
            handleclick(record.recordid);
          }}
        >
          Download
        </Button>
      ),
    },
  ];

  const renderExpandedRow = (record) => {
    return (
      <Table
        className="expandedRow"
        columns={expandedColumns}
        rowKey={(record) => record.recordid}
        dataSource={record.kids}
        pagination={false}
      />
    );
  };

  //! EXPERIMENTAL

  //States
  const [reqSent, setReqSent] = useState(false);
  const [searching, setSearching] = useState(false);
  const [data, setData] = useState(null);
  const [tableData, setTableData] = useState([]);

  //* Make a UE call after data state updates to format the data for the Table.
  useEffect(() => {
    if (data !== null) {
      handleDataChange();
    }
  }, [data]);

  //functions
  const handleDataChange = async () => {
    const hashFn = (e) => {
      return e["wardno"] + e["subdivno"] + e["title"];
    };

    const groupArray = (arr, groupFn) => {
      const groups = {};

      for (const ele of arr) {
        const hash = groupFn(ele);

        if (!groups[hash]) {
          groups[hash] = [];
        }

        groups[hash].push(ele);
      }
      return groups;
    };

    const organizeArray = (obj) => {
      const outputArr = [];

      for (const ele in obj) {
        if (obj[ele].length == 1) {
          const temp = obj[ele][0];
          temp.hasChildren = false;
          outputArr.push(temp);
        } else {
          const tempObj = {};

          tempObj.wardno = obj[ele][0]["wardno"];
          tempObj.subdivno = obj[ele][0]["subdivno"];
          tempObj.title = obj[ele][0]["title"];
          tempObj.hasChildren = true;
          tempObj.kids = obj[ele];
          tempObj.recordid =
            obj[ele][0]["wardno"] +
            obj[ele][0]["subdivno"] +
            obj[ele][0]["title"] +
            "a";

          outputArr.push(tempObj);
        }
      }
      return outputArr;
    };
    const unsorted = groupArray(data, hashFn);
    // console.log(organizeArray(unsorted));
    //!
    const fixedData = organizeArray(unsorted);
    setTableData(fixedData);
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
      <br />
      <h3 style={{ textAlign: "center" }}>MUNICIPAL PROPERTY RECORDS</h3>
      <br />

      <Row align="middle" justify="center">
        <Col xs={22} sm={20} md={16} lg={12}>
          <Form
            style={{ marginTop: "10px", overflow: "hidden" }}
            onFinish={onFinish}
            // onFinishFailed={() => console.log("failed")}
            // form={form}
          >
            {/* //! gutter=24 causes margin-right= -15px; Only fix is to set overflow:hidden in parent  */}
            <Row gutter="24">
              <Col xs={24} md={12}>
                <Form.Item name="wardNo">
                  <Input
                    autoComplete="off"
                    size="large"
                    placeholder="Ward No."
                    className={formInputStyles}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
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
            <Form.Item
              name="title"
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
        </Col>
      </Row>

      <br />
      <Table
        loading={searching}
        columns={columns}
        rowKey={(record) => record.recordid}
        expandable={{
          expandedRowRender: renderExpandedRow,
          rowExpandable: (record) => record.hasChildren == true,
        }}
        dataSource={tableData}
      />
    </>
  );
};

export default MunicipalPropertySearch;
