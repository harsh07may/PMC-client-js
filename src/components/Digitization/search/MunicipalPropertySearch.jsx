import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { SearchOutlined } from "@ant-design/icons";
import { formInputStyles } from "./searchForm.module.css";
import { Table, Form, Input, Row, Col, Button, message, Space } from "antd";
import { Link } from "react-router-dom";
import { useAuth } from "../../../utils/auth";
import fileDownload from "js-file-download";
import { useNavigate } from "react-router-dom";
import { getEnv } from "../../../utils/getEnv";
import jwtDecode from "jwt-decode";
import { checkPermission } from "../../../utils/fns";

const MunicipalPropertySearch = () => {
  const auth = useAuth();

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
      message.error("File not found", 2);
    }
  }

  const handleclick = (recordid) => {
    axios({
      method: "get",
      url: `${getEnv(
        "VITE_API_STRING"
      )}/api/v1/digitization/file-download?recordid=${recordid}&type=municipal_property_record`,
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
        checkError(err);
      });
  };
  const columns = [
    {
      title: "Survey No.",
      dataIndex: "surveyno",
      key: "surveyno",
      width: "15%",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: "15%",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
      render: (_, record) => (record.hasChildren ? <></> : `${record.title}`),
    },
    {
      title: "Uploaded At",
      dataIndex: "timestamp",
      key: "Timestamp",
      align: "center",
      render: (_, record) =>
        record.hasChildren ? (
          <></>
        ) : (
          dayjs(record.timestamp).format("hh:mm A, DD MMM YYYY ")
        ),
    },
    {
      title: "Action",
      width: "15%",
      key: "filelink",
      render: (_, record) =>
        record.hasChildren ? (
          <>
            {checkPermission(
              jwtDecode(auth.user.accesstoken).perms,
              ["municipality_property_records"],
              "editor"
            ) && (
              <Space>
                <Link
                  to="../add/MunicipalPropertyRecord"
                  state={{
                    surveyNo: record.surveyno,
                    location: record.location,
                  }}
                >
                  <Button type="primary" size="small">
                    Update
                  </Button>
                </Link>
              </Space>
            )}
          </>
        ) : (
          <Space>
            {checkPermission(
              jwtDecode(auth.user.accesstoken).perms,
              ["municipality_property_records"],
              "editor"
            ) && (
              <Link
                to="../add/MunicipalPropertyRecord"
                state={{ surveyNo: record.surveyno, location: record.location }}
              >
                <Button type="primary" size="small">
                  Update
                </Button>
              </Link>
            )}
            <Button
              size="small"
              onClick={() => {
                handleclick(record.recordid);
              }}
            >
              Download
            </Button>
          </Space>
        ),
    },
  ];

  const expandedColumns = [
    {
      title: "Uploaded At",
      dataIndex: "timestamp",
      key: "Timestamp",
      render: (_, { timestamp }) => {
        return dayjs(timestamp).format("hh:mm A, DD MMM YYYY ");
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
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

  //States
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
      return e["surveyno"] + e["location"];
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

          tempObj.surveyno = obj[ele][0]["surveyno"];
          tempObj.location = obj[ele][0]["location"];
          tempObj.hasChildren = true;
          tempObj.kids = obj[ele];
          tempObj.recordid =
            obj[ele][0]["surveyno"] + obj[ele][0]["location"] + "a";

          outputArr.push(tempObj);
        }
      }
      return outputArr;
    };
    const unsorted = groupArray(data, hashFn);
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
        `${getEnv("VITE_API_STRING")}/api/v1/digitization/search?type=${
          values.type
        }&location=${values.location}&title=${values.title}&surveyno=${
          values.surveyNo
        }`,
        {
          headers: {
            Authorization: `Bearer ${auth.user.accesstoken}`,
          },
        }
      )
      .then((res) => {
        setData(res.data);
        setSearching(false);
      })
      .catch((err) => {
        setData(null);
        setSearching(false);

        checkError(err);
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
          >
            {/* //! gutter=24 causes margin-right= -15px; Only fix is to set overflow:hidden in parent  */}
            <Row gutter="24">
              <Col xs={24} md={12}>
                <Form.Item name="surveyNo">
                  <Input
                    autoComplete="off"
                    size="large"
                    placeholder="Survey No."
                    className={formInputStyles}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="location">
                  <Input
                    autoComplete="off"
                    size="large"
                    placeholder="Location"
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
          expandRowByClick: true,
          expandedRowRender: renderExpandedRow,
          rowExpandable: (record) => record.hasChildren == true,
        }}
        dataSource={tableData}
      />
    </>
  );
};

export default MunicipalPropertySearch;
