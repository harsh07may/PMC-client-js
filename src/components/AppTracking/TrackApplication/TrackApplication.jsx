import React, { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import axios from "axios";
import dayjs from "dayjs";
import qs from "qs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { SearchOutlined } from "@ant-design/icons";
import style from "./TrackApplication.module.css";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Table,
  Form,
  Input,
  Row,
  Tabs,
  Col,
  Button,
  message,
  Select,
  Badge,
  Tag,
} from "antd";
const { TextArea } = Input;
import { useAuth } from "../../../utils/auth";
import { useNavigate } from "react-router-dom";
import { getEnv } from "../../../utils/getEnv";
import { capitalizeEveryWord } from "../../../utils/fns";

const { Option, OptGroup } = Select;
const TrackApplication = () => {
  const [form] = Form.useForm();
  const auth = useAuth();
  const navigate = useNavigate();

  //? To make only 1 row expand at a time.
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const onTableRowExpand = (expanded, record) => {
    const keys = [];
    if (expanded) {
      keys.push(record.ref_id); // I have set my record.id as row key. Check the documentation for more details.
    }

    setExpandedRowKeys(keys);
  };
  // const handleclick = (recordid) => {
  //   axios({
  //     method: "get",
  //     url: `${getEnv(
  //       "VITE_API_STRING"
  //     )}/api/v1/digitization/file-download?recordid=${recordid}&type=construction_license`,
  //     headers: {
  //       Authorization: `Bearer ${auth.user.accesstoken}`,
  //     },
  //     responseType: "blob",
  //   })
  //     .then((res) => {
  //       const fileName = res.headers["content-disposition"]
  //         .split('filename="')[1]
  //         .slice(0, -1);
  //       fileDownload(res.data, fileName);
  //     })
  //     .catch((err) => {
  //       message.error("File not found", 2);
  //     });
  // };

  const sections = [
    { label: "All", value: "" },
    { label: "Treasury", value: "treasury" },
    { label: "Technical", value: "technical" },
    { label: "Administration", value: "administration" },
    { label: "Central Inward", value: "central" },
  ];

  const columns = [
    {
      title: "Reference No.",
      dataIndex: "ref_id",
      key: "refno",
      align: "center",
      width: "10%",
    },
    {
      title: "Inward No.",
      dataIndex: "inward_no",
      key: "inwardno",
      align: "center",
      width: "10%",
    },
    {
      title: "Outward No.",
      dataIndex: "outward_no",
      key: "outwardno",
      align: "center",
      width: "10%",
    },
    {
      title: "Applicant Name",
      dataIndex: "applicant_name",
      key: "applicant_name",
      align: "center",
      width: "30%",
    },
    {
      title: "Subject",
      dataIndex: "title",
      key: "title",
      align: "center",
      width: "30%",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "createdAt",
      align: "center",
      width: "20%",
      render: (_, { created_at }) => {
        return dayjs(created_at).format("hh:mm A, DD MMM YYYY ");
      },
    },
    //? removed to add space for applicant name column
    // {
    //   title: "Holder",
    //   dataIndex: "holder",
    //   key: "holder",
    //   width: "20%",
    //   align: "center",
    //   render: (_, { holder }) => {
    //     return capitalizeEveryWord(holder);
    //   },
    // },
    // {
    //   title: "Status",
    //   dataIndex: "outwarded",
    //   key: "outwarded",
    //   align: "center",
    //   width: "15%",
    //   filters: [
    //     { text: "Outwarded", value: true },
    //     { text: "Processing", value: false },
    //   ],
    //   filterMode: "tree",
    //   // onFilter: (value, record) => record.outwarded === value,
    //   render: (outwarded) => {
    //     if (outwarded === true) {
    //       return <Badge status="success" text="Outwarded" />;
    //     } else {
    //       return <Badge status="processing" text="Processing" />;
    //     }
    //   },
    // },
  ];

  const expandedRowColumns = [
    {
      title: "Transfer",
      dataIndex: "transfer_no",
      key: "transfer_no",
      width: "15%",
      align: "center",
      sorter: (a, b) => a.transfer_no - b.transfer_no,
      sortDirections: ["ascend", "descend"],
      defaultSortOrder: "ascend",
    },
    {
      title: "Transfer Time",
      dataIndex: "transfer_time",
      key: "transfer_time",
      align: "center",
      width: "30%",
      render: (_, { transfer_time }) => {
        return dayjs(transfer_time).format("hh:mm A, DD MMM YYYY ");
      },
    },
    {
      title: "Sender",
      dataIndex: "sender",
      key: "sender",
      align: "center",
      width: "20%",
      render: (_, { sender }) => {
        return capitalizeEveryWord(sender);
      },
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      key: "receiver",
      align: "center",
      width: "20%",
      render: (_, { receiver }) => {
        return capitalizeEveryWord(receiver);
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "15%",
      filters: [
        { text: "Unseen", value: "unseen" },
        { text: "Accepted", value: "accepted" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status, record) => {
        if (status === "unseen") {
          return (
            <Tag icon={<ClockCircleOutlined />} color="default">
              unseen
            </Tag>
          );
        } else if (status === "rejected") {
          return (
            <Tag icon={<CloseCircleOutlined />} color="error">
              rejected
            </Tag>
          );
        } else {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              accepted
            </Tag>
          );
        }
      },
    },
  ];

  const renderExpandedRow = (record) => {
    return (
      <Tabs
        // onChange={(activeKey) => console.log(activeKey)}
        // destroyInactiveTabPane={true}
        centered={true}
        style={{ border: "2px solid #4096ff", padding: 10, borderRadius: 6 }}
        defaultActiveKey="Trail"
        size="small"
        items={[
          {
            label: `Trail`,
            key: "Trail",
            children: (
              <Table
                className="expandedRow"
                columns={expandedRowColumns}
                rowKey={(record) => record.trail_id}
                dataSource={record.trail}
                pagination={false}
              />
            ),
          },
          {
            label: `Notes`,
            key: "Notes",
            children: (
              <TextArea
                // disabled={true}
                value={record.notes}
                // onChange={(e) => console.log(e.target.value)}
                // placeholder="Controlled autosize"
                autoSize={{
                  minRows: 5,
                  maxRows: 5,
                }}
              />
            ),
          },
        ]}
      />
    );
  };

  //States
  const [searching, setSearching] = useState(false);
  const [tableData, setTableData] = useState([]);

  //API Calls
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      showSizeChanger: false,
    },
  });
  //? used to activate the useeffect. tableparams changes when total result count changes
  //? causing unnecessary recalls
  const [fake_tableParams, setFake_TableParams] = useState({
    pagination: {
      current: 1,
      showSizeChanger: false,
    },
  });

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(fake_tableParams)]);

  const handleTableChange = (pagination, filters, sorter) => {
    // console.log(filters, sorter);
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    setFake_TableParams({
      pagination,
      filters,
      ...sorter,
    });
  };
  const getQueryString = (pageParams, values, first_page) => {
    return {
      outwarded: pageParams.filters?.outwarded
        ? ![0, 2].includes(pageParams.filters?.outwarded?.length)
          ? pageParams.filters?.outwarded[0]
          : ""
        : "",
      page: first_page ? 1 : pageParams.pagination?.current,
      refNo: values.refNo ?? "",
      inwardNo: values.inwardNo ?? "",
      outwardNo: values.outwardNo ?? "",
      applicantName: values.applicantName ?? "",
      title: values.title ?? "",
      holder: values.holder ?? "",
      sender: values.sender ?? "",
      receiver: values.receiver ?? "",
    };
  };

  const fetchData = async () => {
    setSearching(true);
    // console.log(getQueryString(tableParams, form.getFieldsValue(true), false));
    await axios
      .get(
        `${getEnv(
          "VITE_API_STRING"
        )}/api/v1/application/searchApplication?${qs.stringify(
          getQueryString(tableParams, form.getFieldsValue(true), false)
        )}`,
        // ref_id=${values.refNo}&title=${
        //   values.title
        // }&holder=${values.holder}&sender=${values.sender}&receiver=${
        //   values.receiver
        // }&outwarded=`,
        {
          headers: {
            Authorization: `Bearer ${auth.user.accesstoken}`,
          },
        }
      )
      .then((res) => {
        // console.log(res.data);
        setTableData(res.data.data);
        setSearching(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res.data.total,
          },
        });
      })
      .catch((err) => {
        setSearching(false);
        setTableData([]);
        if (err.response.data.error?.name == "AuthenticationError") {
          // message.error("Please reload the page", 3.5);
          // navigate(0, { replace: true });
          message
            .error("You need to reload the page and try again!", 3.5)
            .then(() => window.location.reload(true));
        } else {
          message.error("No applications found", 2);
        }
      });
  };
  const onFinish = async (values) => {
    // for (const key in values) {
    //   if (typeof values[key] === "undefined" || values[key].length == 0) {
    //     values[key] = "";
    //   }
    // }
    // ? set page number to 1
    setSearching(true);
    // console.log(getQueryString(tableParams, form.getFieldsValue(true)), true);
    await axios
      .get(
        `${getEnv(
          "VITE_API_STRING"
        )}/api/v1/application/searchApplication?${qs.stringify(
          getQueryString(tableParams, form.getFieldsValue(true), true)
        )}`,
        {
          headers: {
            Authorization: `Bearer ${auth.user.accesstoken}`,
          },
        }
      )
      .then((res) => {
        setTableData(res.data.data);
        setSearching(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            current: 1,
            total: res.data.total,
          },
        });
      })
      .catch((err) => {
        setSearching(false);
        setTableData([]);
        if (err.response.data.error?.name == "AuthenticationError") {
          // message.error("Please reload the page", 3.5);
          // navigate(0, { replace: true });
          message
            .error("You need to reload the page and try again!", 3.5)
            .then(() => window.location.reload(true));
        } else {
          message.error("No applications found", 2);
        }
      });

    // fetchData();
    // console.log(getQueryString(tableParams, form.getFieldsValue(true)));
    // setSearching(true);

    // await axios
    //   .get(
    //     `${getEnv(
    //       "VITE_API_STRING"
    //     )}/api/v1/application/searchApplication?${qs.stringify(
    //       getQueryString(tableParams, form.getFieldsValue(true))
    //     )}`,
    //     // ref_id=${values.refNo}&title=${
    //     //   values.title
    //     // }&holder=${values.holder}&sender=${values.sender}&receiver=${
    //     //   values.receiver
    //     // }&outwarded=`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${auth.user.accesstoken}`,
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     console.log(res.data);
    //     setTableData(res.data.data);
    //     setSearching(false);
    //     setTableParams({
    //       ...tableParams,
    //       pagination: {
    //         ...tableParams.pagination,
    //         total: res.data.total,
    //       },
    //     });
    //   })
    //   .catch((err) => {
    //     setData(null);
    //     setSearching(false);

    //     if (err.response.data.error?.name == "AuthenticationError") {
    //       // message.error("Please reload the page", 3.5);
    //       // navigate(0, { replace: true });
    //       message
    //         .error("You need to reload the page and try again!", 3.5)
    //         .then(() => window.location.reload(true));
    //     } else {
    //       message.error("No applications found", 2);
    //     }
    //   });
  };

  return (
    <>
      <br />
      <h3 style={{ textAlign: "center" }}>TRACK APPLICATION</h3>
      <br />

      <Row align="middle" justify="center">
        <Col xs={22} sm={20} md={16} lg={12}>
          <Form
            style={{ marginTop: "10px", overflow: "hidden" }}
            onFinish={onFinish}
            form={form}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item name="refNo">
                  <Input
                    autoComplete="off"
                    size="large"
                    placeholder="Reference No."
                    className={style.formInputStyles}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  style={{ borderColor: "red" }}
                  name="holder"
                  // initialValue={[]}
                >
                  <Select
                    size="large"
                    className={`${style.formSelectStyles}`}
                    // value={selectedItems}
                    // tagRender={tagRender}
                    // style={{ width: "100%", borderColor: "red" }}
                    placeholder="Holding Department"
                    // onChange={onChange}
                  >
                    <OptGroup label={"Holding Department"} key={"holder"}>
                      {sections.map((option) => (
                        <Option value={option.value} key={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </OptGroup>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  style={{ borderColor: "red" }}
                  name="sender"
                  // initialValue={[]}
                >
                  <Select
                    size="large"
                    className={`${style.formSelectStyles}`}
                    // value={selectedItems}
                    // tagRender={tagRender}
                    // style={{ width: "100%", borderColor: "red" }}
                    placeholder="Sending Department"
                    // onChange={onChange}
                  >
                    <OptGroup label={"Sending Department"} key={"sender"}>
                      {sections.map((option) => (
                        <Option value={option.value} key={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </OptGroup>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  style={{ borderColor: "red" }}
                  name="receiver"
                  // initialValue={[]}
                >
                  <Select
                    size="large"
                    className={`${style.formSelectStyles}`}
                    // value={selectedItems}
                    // tagRender={tagRender}
                    // style={{ width: "100%", borderColor: "red" }}
                    placeholder="Receiving Department"
                    // onChange={onChange}
                  >
                    <OptGroup label={"Receiving Department"} key={"receiver"}>
                      {sections.map((option) => (
                        <Option value={option.value} key={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </OptGroup>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item name="inwardNo">
                  <Input
                    autoComplete="off"
                    size="large"
                    placeholder="Inward No."
                    className={style.formInputStyles}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="outwardNo">
                  <Input
                    autoComplete="off"
                    size="large"
                    placeholder="Outward No."
                    className={style.formInputStyles}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="applicantName"
              wrapperCol={{ xs: { span: 20 }, sm: { span: 24 } }}
            >
              <Input
                autoComplete="off"
                status=""
                size="large"
                placeholder="Applicant Name"
                className={style.formInputStyles}
              />
            </Form.Item>
            <Form.Item
              name="title"
              wrapperCol={{ xs: { span: 20 }, sm: { span: 24 } }}
            >
              <Input
                autoComplete="off"
                status=""
                size="large"
                placeholder="Title"
                className={style.formInputStyles}
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
        rowKey={(record) => record.ref_id}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
        expandable={{
          expandRowByClick: true,
          expandedRowRender: renderExpandedRow,
          rowExpandable: (record) => record.trail,
          expandedRowKeys: expandedRowKeys,
          onExpand: onTableRowExpand,
        }}
        dataSource={tableData}
      />
    </>
  );
};

export default TrackApplication;
