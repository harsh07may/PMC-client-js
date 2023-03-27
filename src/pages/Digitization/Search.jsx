import React from "react";
import { useState } from "react";
import { Layout } from "antd";

import MunicipalPropertySearch from "../../components/Digitization/search/MunicipalPropertySearch";
import HouseTaxSearch from "../../components/Digitization/search/HouseTaxSearch";
import ConstructionLicenseSearch from "../../components/Digitization/search/ConstructionLicenseSearch";
import BirthRecordsSearch from "../../components/Digitization/search/BirthRecordsSearch";

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
          {documentType == "Properties" && <MunicipalPropertySearch />}
          {documentType == "HouseTax" && <HouseTaxSearch />}
          {documentType == "ConLisc" && <ConstructionLicenseSearch />}
          {documentType == "BirthRecords" && <BirthRecordsSearch />}
        </Content>
      </Layout>
    </>
  );
};

export default Search;
