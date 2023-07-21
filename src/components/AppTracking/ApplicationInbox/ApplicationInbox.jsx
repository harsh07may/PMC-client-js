import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import {
  List,
  Table,
  Input,
  Typography,
  Tabs,
  Button,
  message,
  Select,
  Form,
  Badge,
  Row,
  Col,
  Popconfirm,
} from "antd";
const { Title, Text } = Typography;
const { TextArea } = Input;
import jwt from "jwt-decode";
import { useAuth } from "../../../utils/auth";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import styles from "./ApplicationInbox.module.css";
import { getEnv } from "../../../utils/getEnv";

const ApplicationInbox = () => {
  const [form] = Form.useForm();
  function checkError(err) {
    if (err.response.data.error?.name == "AuthenticationError") {
      message
        .error("You need to reload the page and try again!", 3.5)
        .then(() => window.location.reload(true));
    } else if (err.response.data.error?.name == "BadRequestError") {
      message.error(`${err.response.data.error?.message}`, 3.5);
    } else if (err.response.data.error?.name == "AccessDeniedError") {
      message.error(`${err.response.data.error?.message}`, 3.5);
    }
  }
  const pendingColumns = [
    {
      title: "Reference No.",
      dataIndex: "ref_id",
      key: "refno",
      // align: "center",
      width: "15%",
    },
    {
      title: "Subject",
      dataIndex: "title",
      key: "title",
      align: "center",
      width: "30%",
    },
    {
      title: "Sent At",
      dataIndex: "sentAt",
      key: "sentAt",
      align: "center",
      width: "15%",
      render: (_, { transfer_time }) => {
        return dayjs(transfer_time).format("hh:mm A, DD MMM YYYY ");
      },
    },
    {
      title: "Sender",
      dataIndex: "sender",
      key: "sender",
      width: "15%",
      align: "center",
      render: (value) => {
        return value.trim().charAt(0).toUpperCase() + value.trim().slice(1);
      },
    },
    {
      title: "Action",
      width: "15%",
      key: "filelink",
      render: (_, record) => (
        <span>
          <Button
            size="small"
            style={{ marginRight: 8 }}
            type="primary"
            onClick={() => {
              // handleclick(record.recordid);
              changePendingStatus(record, "accepted");
            }}
          >
            Accept
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            onClick={() => {
              // handleclick(record.recordid);
              changePendingStatus(record, "rejected");
            }}
          >
            Reject
          </Button>
        </span>
      ),
    },
  ];
  const holdingColumns = [
    {
      title: "Reference No.",
      dataIndex: "ref_id",
      key: "refno",
      // align: "center",
      width: "10%",
    },
    {
      title: "Applicant",
      dataIndex: "applicant_name",
      key: "applicant_name",
      align: "center",
      width: "22%",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
      width: "20%",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      width: "13%",
      render: (_, { created_at }) => {
        return dayjs(created_at).format("hh:mm A, DD MMM YYYY ");
      },
    },
    {
      title: "Sender",
      dataIndex: "sent_by",
      key: "sender",
      width: "13%",
      align: "center",
      render: (sent_by) => {
        if (sent_by === "technical") {
          return <p>Technical Section</p>;
        } else if (sent_by === "administration") {
          return <p>Administration Section</p>;
        } else if (sent_by === "central") {
          return <p>Central Inward</p>;
        } else if (sent_by === "treasury") {
          return <p>Treasury Section</p>;
        }
      },
    },
    {
      title: "Sent At",
      dataIndex: "sent_at",
      key: "sentAt",
      align: "center",
      width: "15%",
      render: (_, { sent_at }) => {
        return dayjs(sent_at).format("hh:mm A, DD MMM YYYY ");
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => {
        if (status === "unseen") {
          return <Badge status="processing" text="Unseen" />;
        } else if (status === "rejected") {
          return <Badge status="error" text="Rejected" />;
        } else {
          return <Badge status="default" text="Holding" />;
        }
      },
    },
  ];

  //states for receiver list
  const [receiverList, setReceiverList] = useState({});

  // const [notes, setNotes] = useState("");
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  //? To make only 1 row expand at a time.
  const onTableRowExpand = (expanded, record) => {
    const keys = [];
    if (expanded) {
      keys.push(record.ref_id); // I have set my record.id as row key. Check the documentation for more details.
    }

    setExpandedRowKeys(keys);
  };
  const [expandedPendingRowKeys, setExpandedPendingRowKeys] = useState([]);
  //? To make only 1 row expand at a time.
  const onPendingTableRowExpand = (expanded, record) => {
    const keys = [];
    if (expanded) {
      keys.push(record.ref_id); // I have set my record.id as row key. Check the documentation for more details.
    }

    setExpandedPendingRowKeys(keys);
  };
  const renderPendingExpandedRow = (record) => {
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
  const handleOutwardFormSubmit = async (record) => {
    try {
      // console.log("in outward");
      // console.log(record, form.getFieldValue("outwardNo"));
      await form.validateFields();
      // Perform the form submission logic here
      OutwardApplication(record, form.getFieldValue("outwardNo"));
    } catch (error) {
      // Handle form validation errors
      // console.error("Form validation failed:", error);
    }
  };
  const renderExpandedRow = (record) => {
    return (
      <Tabs
        // onChange={(activeKey) => console.log(activeKey)}
        // destroyInactiveTabPane={true}
        centered={true}
        defaultActiveKey="Notes"
        size="small"
        items={[
          {
            label: `Notes`,
            key: "Notes",
            children: (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Form onFinish={(note) => UpdateNotes(note, record.ref_id)}>
                  <Form.Item name="notes" initialValue={record.notes}>
                    <TextArea
                      // defaultValue={record.notes}
                      // value={notes}
                      // onChange={(e) => console.log(e.target.value)}
                      // placeholder="Controlled autosize"
                      autoSize={{
                        minRows: 5,
                        maxRows: 5,
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    wrapperCol={{
                      offset: 12,
                      span: 24,
                    }}
                  >
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            ),
          },
          {
            label: `Transfer`,
            key: "transfer",
            children: (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Row align="middle" justify="center">
                  <Col xs={22} sm={10} md={10} lg={5}>
                    <Form
                      onFinish={(receiver) =>
                        transferApplication(record, receiver)
                      }
                    >
                      <Form.Item
                        // wrapperCol={{
                        //   offset: 12,
                        //   span: 4,
                        // }}
                        name="receiver"
                        initialValue={
                          record.sending_to ? record.sending_to : []
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please select a receiver!",
                          },
                        ]}
                      >
                        <Select
                          disabled={record.status == "unseen" ? true : false}
                          placeholder="Send To"
                          style={{ width: "100%" }}
                          // onChange={onChange}
                          options={receiverList}
                        />
                      </Form.Item>
                      <Form.Item
                        style={{ marginTop: 10 }}
                        wrapperCol={{
                          xm: { span: 20, offset: 10 },
                          sm: { span: 20, offset: 10 },
                          md: { span: 16, offset: 10 },
                        }}
                      >
                        {record.status == "unseen" ? (
                          <Button
                            type="primary"
                            onClick={
                              () => RecallApplication(record)
                              //TODOfunction to send req to recall file, needs to accept error response and send notification and reload
                            }
                          >
                            Recall
                          </Button>
                        ) : (
                          <Button type="primary" htmlType="submit">
                            Send
                          </Button>
                        )}
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>
              </div>
            ),
          },
          jwt(auth.user.accesstoken).perms["application_tracking"] == "central"
            ? {
                label: `Outward`,
                key: "outward",
                children: (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Row align="middle" justify="center">
                      <Col xs={22} sm={10} md={10} lg={5}>
                        <Form
                          form={form}
                          // onFinish={(receiver) => console.log(record, receiver)}
                        >
                          <Form.Item
                            // wrapperCol={{
                            //   offset: 12,
                            //   span: 4,
                            // }}
                            name="outwardNo"
                            rules={[
                              {
                                required: true,
                                message: "Please enter an applicant!",
                              },
                              {
                                pattern: new RegExp(/^.{5,250}$/),
                                message:
                                  "Applicant should be at least 5 characters long!",
                              },
                              {
                                pattern: new RegExp(/^(?!\s)(.*\S)?(?<!\s)$/),
                                message:
                                  "Applicant should not start/end with a whitespace character!",
                              },
                            ]}
                          >
                            <Input
                              autoComplete="off"
                              status=""
                              // size="large"
                              placeholder="Outward Number"
                              className={styles}
                            />
                          </Form.Item>
                          <Form.Item
                            wrapperCol={{ span: 24 }}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Popconfirm
                              placement="bottom"
                              title="Mark as Outward"
                              description="Are you sure you want to mark this application as outwarded?"
                              onConfirm={() => handleOutwardFormSubmit(record)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button type="primary">Mark as Outwarded</Button>
                              {/* <Button danger>Mark as Outwarded</Button> */}
                            </Popconfirm>
                          </Form.Item>
                        </Form>
                      </Col>
                    </Row>
                    {/* <Row align="middle" justify="center">
                      <Popconfirm
                        title="Mark as Outward"
                        description="Are you sure you want to mark this application as outwarded?"
                        onConfirm={() => OutwardApplication(record)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button danger>Mark as Outwarded</Button>
                      </Popconfirm>
                    </Row> */}
                  </div>
                ),
              }
            : "",
          jwt(auth.user.accesstoken).perms["application_tracking"] ==
            "central" && record.sent_by === "none"
            ? {
                label: `Delete`,
                key: "delete",
                children: (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Row align="middle" justify="center">
                      <Popconfirm
                        title="Delete"
                        description="Are you sure you want to delete this application?"
                        onConfirm={
                          () => DeleteApplication(record)
                          //TODO function to send req to delete app, needs to send notification and reload
                        }
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button danger>Delete</Button>
                      </Popconfirm>
                    </Row>
                  </div>
                ),
              }
            : "",
        ]}
      />
    );
  };

  const getRandomUserParams = (params) => ({
    page: params.pagination?.current,
  });

  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  //pending applications states
  const [pendingData, setPendingData] = useState();
  const [pendingTableParams, setPendingTableParams] = useState({
    pagination: {
      current: 1,
      showSizeChanger: false,
    },
  });
  //holding application states
  const [holdingData, setHoldingData] = useState();
  const [holdingTableParams, setHoldingTableParams] = useState({
    pagination: {
      current: 1,
      showSizeChanger: false,
    },
  });

  const transferApplication = async ({ ref_id }, { receiver }) => {
    const values = { receiver, ref_id };
    console.log(values);
    await axios
      .post(
        `${getEnv("VITE_API_STRING")}/api/v1/application/transferApplication`,
        values,
        {
          headers: {
            Authorization: `Bearer ${auth.user.accesstoken}`,
          },
        }
      )
      .then((res) => {
        message.success(`Successfully send Transfer Request`, 1.5);
        setLoading(false);
      })
      .catch((err) => {
        // message.error(`Failed to send transfer Request`, 1.5);
        setLoading(false);
        console.log(err);
        checkError(err);
      });

    fetchData("holding");
  };

  const RecallApplication = async ({ trail_id }) => {
    const values = { trail_id, status: "recall" };
    console.log(values);
    await axios
      .post(
        `${getEnv("VITE_API_STRING")}/api/v1/application/updateStatus`,
        values,
        {
          headers: {
            Authorization: `Bearer ${auth.user.accesstoken}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          message.success(`Successfully Recalled`, 1.5);
          setLoading(false);
        }
      })
      .catch((error) => {
        // message.error(`Failed to Recall`, 1.5);
        checkError(error);
        setLoading(false);
        console.log(error);
      });

    fetchData("holding");
  };

  const UpdateNotes = async ({ notes }, ref_id) => {
    const values = { notes, ref_id };
    await axios
      .post(
        `${getEnv("VITE_API_STRING")}/api/v1/application/updateApplicationNote`,
        values,
        {
          headers: {
            Authorization: `Bearer ${auth.user.accesstoken}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          message.success(`Successfully updated Notes`, 1.5);
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(`Failed to update Notes`, 1.5);
        setLoading(false);
        checkError(error);
        console.log(error);
      });

    //? inefficient call to make
    // fetchData("holding");
  };

  const DeleteApplication = async ({ ref_id }) => {
    const values = { ref_id };
    await axios
      .post(
        `${getEnv("VITE_API_STRING")}/api/v1/application/deleteApplication`,
        values,
        {
          headers: {
            Authorization: `Bearer ${auth.user.accesstoken}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          message.success(`Successfully deleted Application`, 1.5);
          setLoading(false);
        }
      })
      .catch((error) => {
        checkError(err);
        console.log(error);
        // message.error(`Failed to delete Application`, 1.5);
        setLoading(false);
        // console.log(error);
      });

    fetchData("holding");
  };

  const OutwardApplication = async ({ ref_id }, outwardNo) => {
    const values = { ref_id, outwardNo };
    // console.log(values);
    await axios
      .post(
        `${getEnv("VITE_API_STRING")}/api/v1/application/outwardApplication`,
        values,
        {
          headers: {
            Authorization: `Bearer ${auth.user.accesstoken}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          message.success(`Successfully outwarded Application`, 1.5);
          setLoading(false);
        }
      })
      .catch((error) => {
        checkError(err);
        // console.log(error);
        // message.error(`Failed to outward Application`, 1.5);
        setLoading(false);
        console.log(error);
      });

    fetchData("holding");
  };

  const changePendingStatus = async (record, newStatus) => {
    setLoading(true);
    const values = {
      status: newStatus,
      trail_id: record.trail_id,
      ref_id: record.ref_id,
    };

    await axios
      .post(
        `${getEnv("VITE_API_STRING")}/api/v1/application/updateStatus`,
        values,
        {
          headers: {
            Authorization: `Bearer ${auth.user.accesstoken}`,
          },
        }
      )
      .then((res) => {
        // console.log(res);
        if (res.status == 200) {
          message.success(`Successfully ${newStatus}`, 1.5);
          setLoading(false);
        }
      })
      .catch((err) => {
        // console.log(err);
        setLoading(false);
        checkError(err);
        // if (err.response.data.error?.name == "AuthenticationError") {
        //   message
        //     .error("You need to reload the page and try again!", 3.5)
        //     .then(() => window.location.reload(true));
        // } else if (err.response.data.error?.name == "BadRequestError") {
        //   message.error(`${err.response.data.error?.message}`, 3.5);
        // } else if (err.response.data.error?.name == "AccessDeniedError") {
        //   message.error(`${err.response.data.error?.message}`, 3.5);
        // }
        // message.error(`Application was not ${newStatus}`, 1.5);
      });

    fetchData("pending");
  };
  const fetchData = async (tab) => {
    setLoading(true);

    if (tab == "pending") {
      //* pending applications tab

      axios({
        method: "get",
        url: `${getEnv("VITE_API_STRING")}/api/v1/application/getPending`,
        // ?${qs.stringify(
        //   getRandomUserParams(pendingTableParams)
        // )}`,
        headers: {
          Authorization: `Bearer ${auth.user.accesstoken}`,
        },
      })
        .then((res) => {
          console.log("pending", [res.data]);
          setPendingData(res.data);
          setLoading(false);
          setPendingTableParams({
            ...pendingTableParams,
            pagination: {
              ...pendingTableParams.pagination,
              total: 1,
            },
          });
        })
        .catch((err) => checkError(err));
    } else if (tab == "holding") {
      //* holding applications tab
      const ignore = jwt(auth.user.accesstoken).perms["application_tracking"];
      const receivers = [
        { value: "central", label: "Central Inward" },
        { value: "treasury", label: "Treasury Section" },
        { value: "technical", label: "Technical Section" },
        {
          value: "administration",
          label: "Administration Section",
        },
      ];

      setReceiverList(
        receivers.map((receiver) => {
          return {
            value: receiver.value,
            label: receiver.label,
            disabled: receiver.value === ignore,
          };
        })
      );

      axios({
        method: "get",
        url: `${getEnv("VITE_API_STRING")}/api/v1/application/getHoldingFiles`,
        // ?${qs.stringify(
        //   getRandomUserParams(pendingTableParams)
        // )}`,
        headers: {
          Authorization: `Bearer ${auth.user.accesstoken}`,
        },
      })
        .then((res) => {
          console.log("holding", [res.data]);
          setHoldingData(res.data);
          setLoading(false);
          setHoldingTableParams({
            ...holdingTableParams,
            pagination: {
              ...holdingTableParams.pagination,
              total: res.data.total,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          checkError(err);
          // if (err.response.status == 404) {
          //   // call message
          //   message.error("No Applications found", 2.5);
          //   setLoading(false);
          // }
          // if (err.response.data.error?.name == "AuthenticationError") {
          //   message
          //     .error("You need to reload the page and try again!", 3.5)
          //     .then(() => window.location.reload(true));
          // }
        });
    }
  };

  //* useEffect called when pagination, filters or sorter is changed
  useEffect(() => {
    fetchData("pending");
  }, [JSON.stringify(pendingTableParams)]);

  useEffect(() => {
    fetchData("holding");
  }, [JSON.stringify(holdingTableParams)]);

  const handlePendingTableChange = (pagination, filters, sorter) => {
    setPendingTableParams({
      pagination,
      filters,
      ...sorter,
    });

    //? pageSize fixed to 10 rows in backend
    // `dataSource` is useless if `pageSize` changes
    // if (pagination.pageSize !== tableParams.pagination?.pageSize) {
    //   setPendingData([]);
    // }
  };

  const handleHoldingTableChange = (pagination, filters, sorter) => {
    setHoldingTableParams({
      pagination,
      filters,
      ...sorter,
    });

    //? pageSize fixed to 10 rows in backend
    // `dataSource` is useless if `pageSize` changes
    // if (pagination.pageSize !== tableParams.pagination?.pageSize) {
    //   setPendingData([]);
    // }
  };

  return (
    <>
      {/* <Button
        onClick={() => {
          fetchData();
          console.log(
            `${PROTOCOL}://${HOST}:${PORT}/api/v1/user/get-user-audit?${qs.stringify(
              getRandomUserParams(holdingTableParams)
            )}`
          );
        }}
      >
        click
      </Button> */}
      <List
        className={styles.list}
        header={<Title level={3}>Inbox</Title>}
        bordered
      >
        <Tabs
          onChange={(activeKey) => fetchData(activeKey)}
          destroyInactiveTabPane={true}
          defaultActiveKey="pending"
          type="card"
          size="small"
          items={[
            {
              label: `Pending Applications`,
              key: "pending",
              children: (
                <Table
                  rowKey={(record) => record.ref_id}
                  columns={pendingColumns}
                  dataSource={pendingData}
                  pagination={pendingTableParams.pagination}
                  loading={loading}
                  onChange={handlePendingTableChange}
                  expandable={{
                    expandRowByClick: true,
                    expandedRowRender: renderPendingExpandedRow,
                    expandedRowKeys: expandedPendingRowKeys,
                    onExpand: onPendingTableRowExpand,
                    // rowExpandable: (record) => record.hasChildren == true,
                  }}
                />
              ),
            },
            {
              label: `Holding Applications`,
              key: "holding",
              children: (
                <Table
                  rowKey={(record) => record.ref_id}
                  columns={holdingColumns}
                  dataSource={holdingData}
                  pagination={holdingTableParams.pagination}
                  loading={loading}
                  expandable={{
                    expandRowByClick: true,
                    expandedRowRender: renderExpandedRow,
                    expandedRowKeys: expandedRowKeys,
                    onExpand: onTableRowExpand,
                    // rowExpandable: (record) => record.hasChildren == true,
                  }}
                  onChange={handleHoldingTableChange}
                />
              ),
            },
          ]}
        />
      </List>
    </>
  );
};
export default ApplicationInbox;
