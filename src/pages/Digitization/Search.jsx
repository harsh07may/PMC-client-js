import React from "react";
import { useState } from "react";
import ConLisc from "../../components/Digitization/forms/ConstructionLicense";

import MuncipalPropertySearch from "../../components/Digitization/display/MuncipalPropertySearch";
import BirthRecords from "../../components/Digitization/forms/BirthRecords";
import { Layout } from "antd";
import HouseTaxSearch from "../../components/Digitization/display/HouseTaxSearch";

const { Content, Sider } = Layout;

const Search = () => {
  const [documentType, setDocumentType] = useState("Properties");
  const [selectedButtonId, setSelectedButtonId] = useState("1");

  const handleClick = (e, key) => {
    setDocumentType(e.target.value);
    setSelectedButtonId(key);
  };

  return (
    <>
      <Layout>
        <Sider theme="light">
          <button
            key="1"
            onClick={(e) => handleClick(e, 1)}
            value="Properties"
            //   className="bg-slate-400 rounded-lg m-2 p-6"
            className={selectedButtonId == "1" ? "btn" : "btn btn-selected"}
          >
            MUNCIPALITY PROPERTY RECORDS
          </button>
          <button
            key="2"
            onClick={(e) => handleClick(e, 2)}
            value="HouseTax"
            className={selectedButtonId == "2" ? "btn" : "btn btn-selected"}
          >
            HOUSE TAX RECORDS
          </button>
          <button
            key="3"
            onClick={(e) => handleClick(e, 3)}
            value="ConLisc"
            className={selectedButtonId == "3" ? "btn" : "btn btn-selected"}
          >
            CONSTRUCTION LICENSES
          </button>
          <button
            key="4"
            onClick={(e) => handleClick(e, 4)}
            value="BirthRecords"
            className={selectedButtonId == "4" ? "btn" : "btn btn-selected"}
          >
            BIRTH RECORDS
          </button>
        </Sider>
        <Content>
          {documentType == "Properties" && <MuncipalPropertySearch />}
          {documentType == "HouseTax" && <HouseTaxSearch />}
          {documentType == "ConLisc" && <ConLisc />}
          {documentType == "BirthRecords" && <BirthRecords />}
        </Content>
      </Layout>
    </>
  );
};

export default Search;
