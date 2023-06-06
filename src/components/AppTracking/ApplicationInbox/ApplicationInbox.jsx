import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import {
  List,
  Table,
  Tag,
  Tooltip,
  Input,
  Typography,
  Tabs,
  Button,
  message,
  Form,
} from "antd";
const { Title, Text } = Typography;
const { TextArea } = Input;

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
      render: (_, { sentAt }) => {
        return dayjs(sentAt, "DD-MM-YYYY HH:mm:ss A").format(
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
    },
    // {
    //   title: "Receiver",
    //   dataIndex: "receiver",
    //   key: "receiver",
    //   width: "15%",
    // },
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
      dataIndex: "sender",
      key: "sender",
      width: "15%",
      align: "center",
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
    // {
    //   title: "Receiver",
    //   dataIndex: "receiver",
    //   key: "receiver",
    //   width: "15%",
    // },
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
        onChange={(activeKey) => console.log(activeKey)}
        destroyInactiveTabPane={true}
        centered={true}
        defaultActiveKey="pending"
        // type="card"
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
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            ),
          },
          {
            label: `Transfer`,
            key: "transfer",
            children: <p>B</p>,
          },
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
        `${getEnv("VITE_API_STRING")}/api/v1/application/updateNotes`,
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
    const values = { status: newStatus, trail_id: record.trail_id };
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
          message.success(`Successfully ${newStatus}`, 1.5);
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(`Application was not ${newStatus}`, 1.5);
        setLoading(false);
        console.log(error);
      });

    fetchData("pending");
  };
  const fetchData = async (tab) => {
    setLoading(true);

    if (tab == "pending") {
      //* pending applications tab
      const fakeData = [
        {
          trail_id: 1,
          ref_id: "ABC/1234",
          sentAt: "19-04-2023 06:32:55 PM",
          sender: "Central Inward",
          receiver: "Admin Section",
          title: "Vaibhav doesn't work",
        },
        {
          trail_id: 1,
          ref_id: "ABC/1235",
          sentAt: "19-04-2023 09:32:55 PM",
          sender: "Central Inward",
          receiver: "Admin Section",
          title: "He only wants marks",
        },
      ];
      setPendingData(fakeData);
      setLoading(false);
      setPendingTableParams({
        ...pendingTableParams,
        pagination: {
          ...pendingTableParams.pagination,
          total: 1,
        },
      });

      // axios({
      //   method: "get",
      //   url: `${getEnv(
      //     "VITE_API_STRING"
      //   )}/api/v1/admin/get-digitization-audit?${qs.stringify(
      //     getRandomUserParams(pendingTableParams)
      //   )}`,
      //   headers: {
      //     Authorization: `Bearer ${auth.user.accesstoken}`,
      //   },
      // })
      //   .then((res) => {
      //     setPendingData(res.data.rows);
      //     setLoading(false);
      //     setPendingTableParams({
      //       ...pendingTableParams,
      //       pagination: {
      //         ...pendingTableParams.pagination,
      //         total: res.data.total,
      //       },
      //     });
      //   })
      //   .catch((err) => console.log(err));
    } else if (tab == "holding") {
      //* holding applications tab
      let notes = {};
      const fakeData = [
        {
          trail_id: 1,
          ref_id: "ABC/1234",
          createdAt: "19-04-2023 06:32:55 PM",
          sender: "Central Inward",
          receiver: "Admin Section",
          title: "Vaibhav doesn't work",
          notes: "u farted?",
        },
        {
          trail_id: 2,
          ref_id: "ABC/1235",
          createdAt: "19-04-2023 09:32:55 PM",
          sender: "Central Inward",
          receiver: "Admin Section",
          title: "He only wants marks",
          notes: "it's not mine",
        },
      ];
      // setNotes(
      //   fakeData.map((record) => {
      //     return {
      //       [record.ref_id]: "b",
      //     };
      //   })
      // );
      setHoldingData(fakeData);
      setLoading(false);
      setHoldingTableParams({
        ...holdingTableParams,
        pagination: {
          ...holdingTableParams.pagination,
          total: 1,
        },
      });

      // axios({
      //   method: "get",
      //   url: `${getEnv(
      //     "VITE_API_STRING"
      //   )}/api/v1/admin/get-user-audit?${qs.stringify(
      //     getRandomUserParams(holdingTableParams)
      //   )}`,
      //   headers: {
      //     Authorization: `Bearer ${auth.user.accesstoken}`,
      //   },
      // })
      //   .then((res) => {
      //     setHoldingData(res.data.rows);
      //     setLoading(false);
      //     setHoldingTableParams({
      //       ...holdingTableParams,
      //       pagination: {
      //         ...holdingTableParams.pagination,
      //         total: res.data.total,
      //       },
      //     });
      //   })
      //   .catch((err) => console.log(err));
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
