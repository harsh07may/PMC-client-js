import React from "react";
import { useState } from "react";
import MunicipalProperty from "../../components/Digitization/add/MunicipalProperty";
import HouseTax from "../../components/Digitization/add/HouseTax";
import AddConstuctionLicense from "../../components/Digitization/add/ConstructionLicense";
import BirthRecords from "../../components/Digitization/add/BirthRecords";
import "./Add.css";
import { Layout } from "antd";
const { Content, Sider } = Layout;

const Add = () => {
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
            value="Properties"
            className={selectedButtonId == "1" ? "btn btn-selected" : "btn"}
          >
            MUNCIPALITY PROPERTY RECORDS
          </button>
          <button
            key="2"
            onClick={(e) => handleClick(e, 2)}
            value="HouseTax"
            className={selectedButtonId == "2" ? "btn btn-selected" : "btn"}
          >
            HOUSE TAX RECORDS
          </button>
          <button
            key="3"
            onClick={(e) => handleClick(e, 3)}
            value="ConLisc"
            className={selectedButtonId == "3" ? "btn btn-selected" : "btn"}
          >
            CONSTRUCTION LICENSES
          </button>
          <button
            key="4"
            onClick={(e) => handleClick(e, 4)}
            value="BirthRecords"
            className={selectedButtonId == "4" ? "btn btn-selected" : "btn"}
          >
            BIRTH RECORDS
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
          {/* //! Flickering */}
          {documentType == "Properties" && <MunicipalProperty />}
          {documentType == "HouseTax" && <HouseTax />}
          {documentType == "ConLisc" && <AddConstuctionLicense />}
          {documentType == "BirthRecords" && <BirthRecords />}
        </Content>
      </Layout>
    </>
  );
};

export default Add;
