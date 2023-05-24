import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
import { List, Table, Tag, Tooltip, Typography, Tabs } from "antd";
const { Title, Text } = Typography;

import { useAuth } from "../../../utils/auth";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import styles from "./AuditLogs.module.css";
import { getEnv } from "../../../utils/getEnv";

const digitizationColumns = [
  {
    title: "Title",
    dataIndex: "resourcename",
    key: "title",
    width: "40%",
    render: (_, record) => {
      return <p>{record.resourcename}</p>;
    },
  },
  {
    title: "Action",
    key: "action",
    dataIndex: "action",
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
  },
  {
    title: "Performed by",
    dataIndex: "performedby",
    key: "performedby",
    align: "center",
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
    render: (_, { timestamp }) => {
      return dayjs(timestamp, "DD-MM-YYYY HH:mm:ss A").format(
        "MMM D, YYYY h:mm A"
      );
    },
  },
  {
    title: "Category",
    dataIndex: "documenttype",
    key: "category",
    render: (_, { documenttype }) => {
      let category = {
        municipal_property_record: "Municipal Property Record",
        birth_record: "Birth Record",
        house_tax_record: "House Tax Record",
        construction_license_record: "Construction License Record",
      }[documenttype];

      return <p>{category}</p>;
    },
  },
];
const userColumns = [
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: "40%",
    render: (_, record) => {
      // "Registered User %harsh"
      if (
        record.action == "register" ||
        record.action == "Register" || //due to typo in db, remove in prod
        record.action == "update"
      ) {
        let username = record.description.split("%")[1];
        return (
          <p>
            {record.description.split("%")[0]}{" "}
            {
              <Text keyboard strong>
                {username}
              </Text>
            }
          </p>
        );
      } else {
        return <p>{record.description}</p>;
      }
    },
  },
  {
    title: "Action",
    key: "action",
    dataIndex: "action",
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
    render: (_, { timestamp }) => {
      return dayjs(timestamp, "DD-MM-YYYY HH:mm:ss A").format(
        "MMM D, YYYY h:mm A"
      );
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

const getRandomUserParams = (params) => ({
  page: params.pagination?.current,
});

export default function AuditLogs() {
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
          getRandomUserParams(digitizationTableParams)
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
        .catch((err) => console.log(err));
    } else if (tab == "user") {
      //* user tab
      axios({
        method: "get",
        url: `${getEnv(
          "VITE_API_STRING"
        )}/api/v1/admin/get-user-audit?${qs.stringify(
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
        .catch((err) => console.log(err));
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
      {/* <Button
        onClick={() => {
          fetchData();
          console.log(
            `${PROTOCOL}://${HOST}:${PORT}/api/v1/user/get-user-audit?${qs.stringify(
              getRandomUserParams(userTableParams)
            )}`
          );
        }}
      >
        click
      </Button> */}
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
