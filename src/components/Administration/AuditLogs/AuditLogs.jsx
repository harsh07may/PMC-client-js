import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import qs from "qs";
import {
  List,
  Table,
  Tag,
  Tooltip,
  Typography,
  Tabs,
  message,
  Space,
  Button,
  Input,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

import { useAuth } from "../../../utils/auth";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import styles from "./AuditLogs.module.css";
import { getEnv } from "../../../utils/getEnv";
import { capitalizeEveryWord } from "../../../utils/fns";

export default function AuditLogs() {
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
  const getColumnSearchProps = (dataIndex, fieldName) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      // close,
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
    // onFilter: (value, record) =>
    //   record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
  const digitizationColumns = [
    {
      title: "Title",
      dataIndex: "resourcename",
      key: "title",
      width: "40%",
      ...getColumnSearchProps("title", "Title"),
      render: (_, record) => {
        return <p>{record.resourcename}</p>;
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      align: "center",
      render: (_, { action }) => {
        let color = {
          Search: "geekblue",
          Download: "red",
          Upload: "green",
        }[action];
        return (
          <Tag color={color} key={action}>
            {action.toUpperCase()}
          </Tag>
        );
      },
      //? Requires server side filtering. onFilter only filters entries in each page.
      filters: [
        {
          text: "Search",
          value: "Search",
        },
        {
          text: "Download",
          value: "Download",
        },
        {
          text: "Upload",
          value: "Upload",
        },
      ],
      filterMode: "tree",
      // filterSearch: true,
    },
    {
      title: "Performed by",
      dataIndex: "performedby",
      key: "performedby",
      align: "center",
      ...getColumnSearchProps("performedby", "Performed by"),
      render: (_, { performedby, fullname }) => {
        return (
          <Tooltip placement="left" title={fullname} color="geekblue">
            <Text keyboard strong>
              {performedby}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      align: "center",
      render: (_, { timestamp }) => {
        return dayjs(timestamp).format("hh:mm A, DD MMM YYYY ");
      },
    },
    {
      title: "Category",
      dataIndex: "documenttype",
      key: "category",
      align: "center",
      render: (_, { documenttype }) => {
        let category = {
          municipal_property_record: "Municipal Property Record",
          birth_record: "Birth Record",
          death_record: "Death Record",
          house_tax_record: "House Tax Record",
          trade_license_record: "Trade License Record",
          construction_license_record: "Construction License Record",
        }[documenttype];

        return <p>{category}</p>;
      },
      filters: [
        {
          text: "Municipal Property Record",
          value: "municipal_property_record",
        },
        {
          text: "Birth Record",
          value: "birth_record",
        },
        {
          text: "Death Record",
          value: "death_record",
        },
        {
          text: "House Tax Record",
          value: "house_tax_record",
        },
        {
          text: "Trade License Record",
          value: "trade_license_record",
        },
        {
          text: "Construction License Record",
          value: "construction_license_record",
        },
      ],
      filterMode: "tree",
      // filterSearch: true,
    },
  ];
  const userColumns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "40%",
      ...getColumnSearchProps("description", "Description"),
      render: (_, record) => {
        // "Registered User %harsh"
        if (record.action == "register" || record.action == "update") {
          let username = record.description.split("%")[1];
          return (
            <p>
              {capitalizeEveryWord(record.description.split("%")[0])}{" "}
              {
                <Text keyboard strong>
                  {username}
                </Text>
              }
            </p>
          );
        } else {
          return <p>{capitalizeEveryWord(record.description)}</p>;
        }
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      filters: [
        {
          text: "Login",
          value: "login",
        },
        {
          text: "Register",
          value: "register",
        },
        {
          text: "Update",
          value: "update",
        },
      ],
      filterMode: "tree",
      render: (_, { action }) => {
        let color = {
          login: "green",
          register: "geekblue",
          Register: "geekblue",
          update: "red",
        }[action];
        return (
          <Tag color={color} key={action}>
            {action.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Performed by",
      dataIndex: "performedby",
      key: "performedby",
      align: "center",
      ...getColumnSearchProps("performedby", "Performed by"),
      render: (_, { performedby, fullname }) => {
        return (
          <Tooltip placement="left" title={fullname} color="geekblue">
            <Text keyboard strong>
              {performedby}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      align: "center",
      render: (_, { timestamp }) => {
        return dayjs(timestamp).format("hh:mm A, DD MMM YYYY ");
      },
    },
    // {
    //   title: "Category",
    //   dataIndex: "documenttype",
    //   key: "category",
    //   render: (_, { documenttype }) => {
    //     let category = {
    //       municipal_property_record: "Municipal Property Record",
    //       birth_record: "Birth Record",
    //       house_tax_record: "House Tax Record",
    //       construction_license_record: "Construction License Record",
    //     }[documenttype];

    //     return <p>{category}</p>;
    //   },
    // },
  ];

  const getDigitizationTabParams = (params) => ({
    page: params.pagination?.current,
    action: params.filters?.action,
    category: params.filters?.category,
    title: params.filters?.title ? params.filters?.title[0] : "",
    performedby: params.filters?.performedby
      ? params.filters?.performedby[0]
      : "",
  });

  const getUserTabParams = (params) => ({
    page: params.pagination?.current,
    action: params.filters?.action,
    description: params.filters?.description
      ? params.filters?.description[0]
      : "",
    performedby: params.filters?.performedby
      ? params.filters?.performedby[0]
      : "",
  });

  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  //digitization audit
  const [digitizationData, setDigitizationData] = useState();
  const [digitizationTableParams, setDigitizationTableParams] = useState({
    pagination: {
      current: 1,
      showSizeChanger: false,
    },
  });
  //user audit
  const [userData, setUserData] = useState();
  const [userTableParams, setUserTableParams] = useState({
    pagination: {
      current: 1,
      showSizeChanger: false,
    },
  });

  const fetchData = async (tab) => {
    setLoading(true);

    if (tab == "digitization") {
      //* digitization tab
      axios({
        method: "get",
        url: `${getEnv(
          "VITE_API_STRING"
        )}/api/v1/admin/get-digitization-audit?${qs.stringify(
          getDigitizationTabParams(digitizationTableParams)
        )}`,
        headers: {
          Authorization: `Bearer ${auth.user.accesstoken}`,
        },
      })
        .then((res) => {
          setDigitizationData(res.data.rows);
          setLoading(false);
          setDigitizationTableParams({
            ...digitizationTableParams,
            pagination: {
              ...digitizationTableParams.pagination,
              total: res.data.total,
            },
          });
        })
        .catch((err) => {
          if (err.response.status == 404) {
            // call message
            message.error("No digitization audit records found", 2.5);
            setLoading(false);
          }
          if (err.response.data.error?.name == "AuthenticationError") {
            message
              .error("You need to reload the page and try again!", 3.5)
              .then(() => window.location.reload(true));
          }
        });
    } else if (tab == "user") {
      //* user tab
      axios({
        method: "get",
        url: `${getEnv(
          "VITE_API_STRING"
        )}/api/v1/admin/get-user-audit?${qs.stringify(
          getUserTabParams(userTableParams)
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
          if (err.response.status == 404) {
            // call message
            message.error("No user audit records found", 2.5);
            setLoading(false);
          }
          if (err.response?.data.error?.name == "AuthenticationError") {
            message
              .error("You need to reload the page and try again!", 2.5)
              .then(() => window.location.reload(true));
          }
        });
    }
  };

  //* useEffect called when pagination, filters or sorter is changed
  useEffect(() => {
    fetchData("digitization");
  }, [JSON.stringify(digitizationTableParams)]);

  useEffect(() => {
    fetchData("user");
  }, [JSON.stringify(userTableParams)]);

  const handleDigitizationTableChange = (pagination, filters, sorter) => {
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

  const handleUserTableChange = (pagination, filters, sorter) => {
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
        header={<Title level={3}>Audit Logs</Title>}
        bordered
      >
        <Tabs
          defaultActiveKey="1"
          type="card"
          size="small"
          items={[
            {
              label: `Digitization Audit Logs`,
              key: 1,
              children: (
                <Table
                  rowKey={(record) => record.logid}
                  columns={digitizationColumns}
                  dataSource={digitizationData}
                  pagination={digitizationTableParams.pagination}
                  loading={loading}
                  onChange={handleDigitizationTableChange}
                ></Table>
              ),
            },
            {
              label: `User Audit Logs`,
              key: 2,
              children: (
                <Table
                  rowKey={(record) => record.logid}
                  columns={userColumns}
                  dataSource={userData}
                  pagination={userTableParams.pagination}
                  loading={loading}
                  onChange={handleUserTableChange}
                ></Table>
              ),
            },
          ]}
        />
      </List>
    </>
  );
}
