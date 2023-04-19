import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { DownOutlined } from "@ant-design/icons";
import { Badge, Dropdown, Space, Table, Button } from "antd";

const AdminDashboard = () => {
  const handleclick = (recordid) => {
    // console.log(recordid);
  };

  const columns = [
    {
      title: "Ward No.",
      dataIndex: "wardno",
      key: "wardno",
      width: "15%",
    },
    {
      title: "Sub Div No.",
      dataIndex: "subdivno",
      key: "subdivno",
      width: "15%",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: "Action",
      width: "15%",
      key: "filelink",
      render: (_, record) =>
        record.hasChildren ? (
          <></>
        ) : (
          <Button
            size="small"
            onClick={() => {
              console.log("download " + record.recordid);
              // console.log(record);
              handleclick(record.recordid);
            }}
          >
            Download
          </Button>
        ),
    },
  ];
  const expandedColumns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "Timestamp",
      // 19-04-2023 01:00:17 PM
      // render: (_, record) => record.timestamp.split(" ")[0],
      render: (_, record) => {
        return dayjs(record.timestamp, "DD-MM-YYYY HH:mm:ss A").format(
          "DD/MM/YYYY h:mm A"
        );
      },
    },
    {
      title: "Action",
      dataIndex: "operation2",
      key: "operation2",
      render: (_, record) => (
        <Button
          size="small"
          onClick={() => {
            console.log("download " + record.recordid);
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
        dataSource={record.kids}
        pagination={false}
      />
    );
  };

  const srcData = [
    {
      recordid: 1,
      key: "0",
      wardno: "1",
      subdivno: "1",
      title: "1",
      filelink: "D:/PMC Document Digitization/1.pdf",
      timestamp: "19-04-2023 01:00:17 PM",
    },
    {
      recordid: 2,
      key: "1",
      wardno: "1",
      subdivno: "1",
      title: "1",
      filelink: "D:/PMC Document Digitization/2.pdf",
      timestamp: "19-04-2023 01:02:02 PM",
    },
    {
      recordid: 3,
      key: "2",
      wardno: "1",
      subdivno: "1",
      title: "2",
      filelink: "D:/PMC Document Digitization/1.pdf",
      timestamp: "19-04-2023 01:01:17 PM",
    },
  ];

  //States
  const [reqSent, setReqSent] = useState(false);
  const [searching, setSearching] = useState(false);
  const [data, setData] = useState(srcData);
  const [tableData, setTableData] = useState([]);

  //* Make a UE call after data state updates to format the data for the Table.
  useEffect(() => {
    if (data !== null) {
      handleDataChange();
    }
  }, [data]);

  //functions
  const handleDataChange = async () => {
    //!
    const hashFn = (e) => {
      return e["wardno"] + e["subdivno"] + e["title"];
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

          tempObj.wardno = obj[ele][0]["wardno"];
          tempObj.subdivno = obj[ele][0]["subdivno"];
          tempObj.title = obj[ele][0]["title"];
          tempObj.hasChildren = true;
          tempObj.kids = obj[ele];
          tempObj.recordid =
            obj[ele][0]["wardno"] +
            obj[ele][0]["subdivno"] +
            obj[ele][0]["title"] +
            "a";

          outputArr.push(tempObj);
        }
      }
      return outputArr;
    };
    const unsorted = groupArray(data, hashFn);
    // console.log(organizeArray(unsorted));
    //!
    const fixedData = organizeArray(unsorted);
    console.log(fixedData);
    for (let i = 0; i < fixedData.length; i++) {
      fixedData[i].key = i.toString();
    }
    setTableData(fixedData);
  };

  return (
    <>
      <Table
        columns={columns}
        rowkey={(record) => record.recordid}
        expandable={{
          expandedRowRender: renderExpandedRow,
          rowExpandable: (record) => record.hasChildren == true,
          onExpand: (expanded, record) => {
            console.log("onExpand: ", record, expanded);
          },
        }}
        dataSource={tableData}
      />
    </>
  );
};

export default AdminDashboard;
