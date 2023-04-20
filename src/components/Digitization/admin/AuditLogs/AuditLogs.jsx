import React, { useEffect, useState } from "react";
import axios from "axios";
import qs from "qs";
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
  Tabs,
} from "antd";
const { Title, Text } = Typography;

import { useAuth } from "../../../../utils/auth";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import styles from "./AuditLogs.module.css";

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
const adminData = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
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
    },
  });
  //user audit
  const [userData, setUserData] = useState();
  const [userTableParams, setUserTableParams] = useState({
    pagination: {
      current: 1,
    },
  });

  const fetchData = async (tab) => {
    setLoading(true);

    if (tab == "digitization") {
      //* digitization tab
      axios({
        method: "get",
        url: `http://localhost:5000/api/v1/digitization/get-search-audit?${qs.stringify(
          getRandomUserParams(digitizationTableParams)
        )}`,
        headers: {
          Authorization: `Bearer ${auth.user.accesstoken}`,
        },
      }).then((res) => {
        setDigitizationData(res.data.rows);
        setLoading(false);
        setDigitizationTableParams({
          ...digitizationTableParams,
          pagination: {
            ...digitizationTableParams.pagination,
            total: res.data.total,
          },
        });
      });
    } else if (tab == "user") {
      //* user tab
      axios({
        method: "get",
        url: `http://localhost:5000/api/v1/user/get-user-audit?${qs.stringify(
          getRandomUserParams(userTableParams)
        )}`,
        headers: {
          Authorization: `Bearer ${auth.user.accesstoken}`,
        },
      }).then((res) => {
        console.log(res.data);
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
    }
  };

  //* useEffect called when pagination, filters or sorter is changed
  useEffect(() => {
    fetchData("digitization");
  }, [JSON.stringify(digitizationTableParams)]);

  useEffect(() => {
    fetchData("user");
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
    // <List>
    //   <Table {...tableProps} rowKey="id">
    //     <Table.Column dataIndex="id" title="ID" />
    //     <Table.Column dataIndex="title" title="Title" />
    //     <Table.Column
    //       dataIndex={["category", "id"]}
    //       title="Category"
    //       render={(value) => {
    //         if (isLoading) {
    //           return <TextField value="Loading..." />;
    //         }

    //         return (
    //           <TextField
    //             value={data?.data.find((item) => item.id === value)?.title}
    //           />
    //         );
    //       }}
    //       filterDropdown={(props) => (
    //         <FilterDropdown
    //           {...props}
    //           mapValue={(selectedKeys) => selectedKeys.map(Number)}
    //         >
    //           <Select
    //             style={{ minWidth: 200 }}
    //             mode="multiple"
    //             placeholder="Select Category"
    //             {...categorySelectProps}
    //           />
    //         </FilterDropdown>
    //       )}
    //       defaultFilteredValue={getDefaultFilter("category.id", filters, "in")}
    //     />
    //     <Table.Column
    //       dataIndex="status"
    //       title="Status"
    //       render={(value) => <TagField value={value} />}
    //       filterDropdown={(props) => (
    //         <FilterDropdown {...props}>
    //           <Radio.Group>
    //             <Radio value="published">Published</Radio>
    //             <Radio value="draft">Draft</Radio>
    //             <Radio value="rejected">Rejected</Radio>
    //           </Radio.Group>
    //         </FilterDropdown>
    //       )}
    //     />
    //     <Table.Column
    //       title="Actions"
    //       dataIndex="actions"
    //       render={(_, record) => (
    //         <Space>
    //           <EditButton hideText size="small" recordItemId={record.id} />
    //           <ShowButton hideText size="small" recordItemId={record.id} />
    //           <LogButton hideText size="small" recordItemId={record.id} />
    //         </Space>
    //       )}
    //     />
    //   </Table>
    // </List>
    <>
      <Button
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
      </Button>
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
                  onChange={handleTableChange}
                ></Table>
              ),
            },
            {
              label: `Admin Audit Logs`,
              key: 2,
              children: (
                <Table
                  rowKey={(record) => record.logid}
                  columns={userColumns}
                  dataSource={userData}
                  pagination={userTableParams.pagination}
                  loading={loading}
                  onChange={handleTableChange}
                ></Table>
              ),
            },
          ]}
        />
      </List>
    </>
  );
}
