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
  const pendingColumns = [
    {
      title: "Reference No.",
      dataIndex: "ref_id",
      key: "refno",
      // align: "center",
      width: "15%",
    },
    {
      title: "Title",
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
        return dayjs(transfer_time, "DD-MM-YYYY HH:mm:ss A").format(
          "MMM D, YYYY h:mm A"
        );
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
              console.log("clicked accept");
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
              console.log("clicked reject");
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
      width: "15%",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
      width: "30%",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      width: "15%",
      render: (_, { createdAt }) => {
        return dayjs(createdAt, "DD-MM-YYYY HH:mm:ss A").format(
          "MMM D, YYYY h:mm A"
        );
      },
    },
    {
      title: "Sender",
      dataIndex: "sent_by",
      key: "sender",
      width: "15%",
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
      dataIndex: "sentAt",
      key: "sentAt",
      align: "center",
      width: "15%",
      render: (_, { createdAt }) => {
        return dayjs(createdAt, "DD-MM-YYYY HH:mm:ss A").format(
          "MMM D, YYYY h:mm A"
        );
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
    // {
    //   title: "Action",
    //   width: "15%",
    //   key: "filelink",
    //   render: (_, record) => (
    //     <span>
    //       <Button
    //         size="small"
    //         style={{ marginRight: 8 }}
    //         type="primary"
    //         onClick={() => {
    //           // handleclick(record.recordid);
    //           changePendingStatus(record, "accepted");
    //           console.log("clicked accept");
    //         }}
    //       >
    //         Accept
    //       </Button>
    //       <Button
    //         type="primary"
    //         danger
    //         size="small"
    //         onClick={() => {
    //           // handleclick(record.recordid);
    //           changePendingStatus(record, "rejected");
    //           console.log("clicked reject");
    //         }}
    //       >
    //         Reject
    //       </Button>
    //     </span>
    //   ),
    // },
  ];

  //states for receiver list
  const [receiverList, setReceiverList] = useState({});

  const [notes, setNotes] = useState("");
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  //? To make only 1 row expand at a time.
  const onTableRowExpand = (expanded, record) => {
    const keys = [];
    if (expanded) {
      keys.push(record.ref_id); // I have set my record.id as row key. Check the documentation for more details.
    }

    setExpandedRowKeys(keys);
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
                        minRows: 3,
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
                    <Form onFinish={(receiver) => console.log(receiver)}>
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
                              () => console.log(record) //TODOfunction to send req to recall file, needs to accept error response and send notification and reload
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
                      <Popconfirm
                        title="Mark as Outward"
                        description="Are you sure you want to mark this application as outwarded?"
                        onConfirm={
                          () =>
                            console.log(
                              jwt(auth.user.accesstoken).perms[
                                "application_tracking"
                              ]
                            ) //TODO function to send req to mark file as outwarded, needs to send notification and reload
                        }
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button danger>Mark as Outwarded</Button>
                      </Popconfirm>
                    </Row>
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
                          () =>
                            console.log(
                              jwt(auth.user.accesstoken).perms[
                                "application_tracking"
                              ]
                            ) //TODO function to send req to delete app, needs to send notification and reload
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

  const UpdateNotes = async ({ notes }, ref_id) => {
    const values = { notes, ref_id: ref_id };
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
        console.log(error);
      });

    //? inefficient call to make
    // fetchData("holding");
  };
  const changePendingStatus = async (record, newStatus) => {
    setLoading(true);
    const values = {
      status: newStatus,
      trail_id: record.trail_id,
      ref_id: record.ref_id,
    };
    console.log(values);

    // await axios
    //   .post(
    //     `${getEnv("VITE_API_STRING")}/api/v1/application/updateStatus`,
    //     values,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${auth.user.accesstoken}`,
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     if (res.status == 200) {
    //       message.success(`Successfully ${newStatus}`, 1.5);
    //       setLoading(false);
    //     }
    //   })
    //   .catch((error) => {
    //     message.error(`Application was not ${newStatus}`, 1.5);
    //     setLoading(false);
    //     console.log(error);
    //   });

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
        .catch((err) => console.log(err));
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
        .catch((err) => console.log(err));
    }
  };

  //* useEffect called when pagination, filters or sorter is changed
  useEffect(() => {
    fetchData("pending");
    console.log("ran pending fetchdata");
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
                ></Table>
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
                ></Table>
              ),
            },
          ]}
        />
      </List>
    </>
  );
};
export default ApplicationInbox;
