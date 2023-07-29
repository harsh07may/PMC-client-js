import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import qs from "qs";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  List,
  Space,
  Table,
  Button,
  Typography,
  Popconfirm,
  Tabs,
  message,
  Input,
} from "antd";
const { Title, Text } = Typography;

import { useAuth } from "../../../../utils/auth";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import styles from "./manageAccounts.module.css";
import { getEnv } from "../../../../utils/getEnv";

export default function ManageAccounts() {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters, selectedKeys, confirm, dataIndex) => {
    clearFilters();
    setSearchText("");
    // confirm();
    // setSearchedColumn(dataIndex);
  };
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
      message.error("Oops! Something went wrong!", 3.5);
    }
  }
  const getColumnSearchProps = (dataIndex, fieldName) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${fieldName}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 95,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() =>
              clearFilters &&
              handleReset(clearFilters, selectedKeys, confirm, dataIndex)
            }
            size="small"
            style={{
              width: 95,
            }}
          >
            Clear
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      // searchedColumn === dataIndex ? (
      //   <Highlighter
      //     highlightStyle={{
      //       backgroundColor: "#ffc069",
      //       padding: 0,
      //     }}
      //     searchWords={[searchText]}
      //     autoEscape
      //     textToHighlight={text ? text.toString() : ""}
      //   />
      // ) : (
      text,
    // ),
  });

  const userColumns = [
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
      ...getColumnSearchProps("fullname", "Full Name"),
      // width: "40%",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      align: "center",
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
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (_, { timestamp }) => {
        return dayjs(timestamp).format("hh:mm A, DD MMM YYYY ");
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Link
              to="../accounts/EditAccount"
              state={{ username: record.username }}
            >
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
              onConfirm={() => {
                deleteUser(record);
              }}
            >
              <Button danger={true} type="link">
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const getRandomUserParams = (params) => ({
    page: params.pagination?.current,
    fullname: params.filters?.fullname ? params.filters?.fullname[0] : "",
  });

  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [userTableParams, setUserTableParams] = useState({
    pagination: {
      current: 1,
      showSizeChanger: false,
    },
  });

  const deleteUser = async (record) => {
    setLoading(true);
    axios({
      method: "post",
      url: `${getEnv("VITE_API_STRING")}/api/v1/admin/deleteUser`,
      headers: {
        Authorization: `Bearer ${auth.user.accesstoken}`,
      },
      data: {
        username: record.username,
        user_id: record.user_id,
      },
    })
      .then((res) => {
        message.success(`Account has been deleted!`, 3.5);
        fetchData();
      })
      .catch((err) => {
        checkError(err);
      });
  };

  const fetchData = async () => {
    setLoading(true);
    axios({
      method: "get",
      url: `${getEnv("VITE_API_STRING")}/api/v1/admin/get-users?${qs.stringify(
        getRandomUserParams(userTableParams)
      )}`,
      headers: {
        Authorization: `Bearer ${auth.user.accesstoken}`,
      },
    })
      .then((res) => {
        setUserData(res.data.rows);
        setLoading(false);
        setUserTableParams({
          ...userTableParams,
          pagination: {
            ...userTableParams.pagination,
            total: res.data.total,
          },
        });
      })
      .catch((err) => {
        checkError(err);
      });
  };

  //* useEffect called when pagination, filters or sorter is changed
  useEffect(() => {
    fetchData();
  }, [JSON.stringify(userTableParams)]);

  const handleTableChange = (pagination, filters, sorter) => {
    setUserTableParams({
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
      <List
        className={styles.list}
        header={<Title level={3}>Users</Title>}
        bordered
      >
        <Table
          rowKey={(record) => record.user_id}
          columns={userColumns}
          dataSource={userData}
          pagination={userTableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
        ></Table>
      </List>
    </>
  );
}
