import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  List,
  Space,
  Table,
  Tag,
  Select,
  Radio,
  Tooltip,
  Button,
  Typography,
  Popconfirm,
  Tabs,
} from "antd";
const { Title, Text } = Typography;

import { useAuth } from "../../../../utils/auth";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import styles from "./manageAccounts.module.css";
import CreateAccount from "../CreateAccount/CreateAccount";
// fullname
// username
// role
// designation
// timestamp
// action
const userColumns = [
  {
    title: "Full Name",
    dataIndex: "fullname",
    key: "fullname",
    // width: "40%",
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
    // width: "40%",
    render: (_, { username }) => {
      return (
        <Text keyboard strong>
          {username}
        </Text>
      );
    },
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (_, { roles }) => {
      let color = {
        admin: "red",
        editor: "geekblue",
        viewer: "green",
      }[roles];
      return (
        <Tag color={color} key={roles}>
          {roles.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: "Designation",
    dataIndex: "designation",
    key: "designation",
    render: (_, { designation }) => {
      return (
        <Text>{designation.replace(/\b\w/g, (x) => x.toUpperCase())}</Text>
      );
    },
  },
  {
    title: "createdAt",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (_, { timestamp }) => {
      return dayjs(timestamp, "DD-MM-YYYY HH:mm:ss A").format(
        "MMM D, YYYY h:mm A"
      );
    },
  },
  {
    title: "Action",
    key: "action",
    dataIndex: "action",
    render: (_, record) => {
      return (
        <Space size="middle">
          {/* <Popconfirm
            title="Edit the user"
            description="Are you sure you want to edit this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {}}
          > */}
          <Link to="../admin/EditAccount" state={{ username: record.username }}>
            Edit
          </Link>
          {/* </Popconfirm> */}
          <Popconfirm
            title="Delete the user"
            description="Are you sure you want to delete this user?"
            okText="Yes"
            cancelText="No"
            icon={
              <QuestionCircleOutlined
                style={{
                  color: "red",
                }}
              />
            }
            onConfirm={() => {}}
          >
            <Button type="link">Delete</Button>
          </Popconfirm>
        </Space>
      );
    },
  },
];

const getRandomUserParams = (params) => ({
  page: params.pagination?.current,
});

export default function ManageAccounts() {
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [userTableParams, setUserTableParams] = useState({
    pagination: {
      current: 1,
      showSizeChanger: false,
    },
  });

  const fetchData = async () => {
    setLoading(true);

    axios({
      method: "get",
      url: `http://localhost:5000/api/v1/admin/get-users?${qs.stringify(
        getRandomUserParams(userTableParams)
      )}`,
      headers: {
        Authorization: `Bearer ${auth.user.accesstoken}`,
      },
    }).then((res) => {
      setUserData(res.data.rows);
      setLoading(false);
      setUserTableParams({
        ...userTableParams,
        pagination: {
          ...userTableParams.pagination,
          total: res.data.total,
        },
      });
    });
  };

  //* useEffect called when pagination, filters or sorter is changed
  useEffect(() => {
    fetchData();
  }, [JSON.stringify(userTableParams)]);

  const handleTableChange = (pagination, filters, sorter) => {
    setDigitizationTableParams({
      pagination,
      filters,
      ...sorter,
    });

    //? pageSize fixed to 10 rows in backend
    // `dataSource` is useless since `pageSize` changed
    // if (pagination.pageSize !== tableParams.pagination?.pageSize) {
    //   setDigitizationData([]);
    // }
  };

  return (
    <>
      {/* <Button
        onClick={() => {
          fetchData();
          console.log(
            `http://localhost:5000/api/v1/user/get-user-audit?${qs.stringify(
              getRandomUserParams(userTableParams)
            )}`
          );
        }}
      >
        click
      </Button> */}
      <List
        className={styles.list}
        header={<Title level={3}>Users</Title>}
        bordered
      >
        <Table
          rowKey={(record) => record.user_id}
          columns={userColumns}
          dataSource={userData}
          // dataSource={demoData}
          pagination={userTableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
        ></Table>
      </List>
    </>
  );
}
