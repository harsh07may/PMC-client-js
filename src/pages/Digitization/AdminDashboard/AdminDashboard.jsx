import React, { useState } from "react";
import { Layout } from "antd";
const { Content, Sider } = Layout;

export default function AdminDashboard() {
  const [documentType, setDocumentType] = useState("Properties");
  const [selectedButtonId, setSelectedButtonId] = useState("1");

  const handleClick = (e, key) => {
    // console.log(documentType + " " + selectedButtonId);
    setDocumentType(e.target.value);
    setSelectedButtonId(key);
  };

  return (
    <>
      <Layout
        style={{
          marginTop: "2.5rem",
          // "flex-direction": "row",
        }}
      >
        <Sider theme="light" style={{ position: "fixed", margin: "0 20px" }}>
          <button
            key="1"
            onClick={(e) => handleClick(e, 1)}
            value="Add Account"
            className={selectedButtonId == "1" ? "btn btn-selected" : "btn"}
          >
            ADD ACCOUNTS
          </button>
          <button
            key="2"
            onClick={(e) => handleClick(e, 2)}
            value="Manage Accounts"
            className={selectedButtonId == "2" ? "btn btn-selected" : "btn"}
          >
            MANAGE ACCOUNTS
          </button>
          <button
            key="3"
            onClick={(e) => handleClick(e, 3)}
            value="Audit Logs"
            className={selectedButtonId == "3" ? "btn btn-selected" : "btn"}
          >
            AUDIT LOGS
          </button>
        </Sider>
        <Content
          // theme="light"
          style={{
            margin: "0 20px 0 20%",
            padding: "8px 20px",
            // border: "1px dashed gray",
          }}
        >
          <p>asddsa</p>
          {/* {documentType == "Properties" && <MunicipalProperty />}
          {documentType == "HouseTax" && <HouseTax />}
          {documentType == "ConLisc" && <AddConstuctionLicense />}
          {documentType == "BirthRecords" && <BirthRecords />} */}
        </Content>
      </Layout>
    </>
  );
}
