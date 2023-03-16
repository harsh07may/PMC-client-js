import React from "react";
import { useState } from "react";
import ConLisc from "../../components/Digitization/forms/ConstructionLicense";
import HouseTax from "../../components/Digitization/forms/HouseTax";
import MuncipalPropertySearch from "../../components/Digitization/display/MuncipalPropertySearch";
const Search = () => {
  const [documentType, setDocumentType] = useState("Properties");
  const [selectedButtonId, setSelectedButtonId] = useState("1");

  const handleClick = (e, key) => {
    setDocumentType(e.target.value);
    setSelectedButtonId(key);
  };

  return (
    <div className="flex flex-row mt-10">
      <div className="flex flex-col w-w-sweet items-center">
        <button
          key="1"
          onClick={(e) => handleClick(e, "1")}
          value="Properties"
          //   className="bg-slate-400 rounded-lg m-2 p-6"
          className={
            selectedButtonId == "1"
              ? "bg-blue-300 rounded-lg m-2 h-20 w-48 text-white font-bold text-left pl-4"
              : "bg-blue-500 rounded-lg m-2 h-20 w-48 text-white font-bold text-left pl-4"
          }
        >
          MUNCIPALITY PROPERTY RECORDS
        </button>
        <button
          key="2"
          onClick={(e) => handleClick(e, "2")}
          value="HouseTax"
          className={
            selectedButtonId == "2"
              ? "bg-blue-300 rounded-lg m-2 h-20 w-48 text-white font-bold text-left pl-4"
              : "bg-blue-500 rounded-lg m-2 h-20 w-48 text-white font-bold text-left pl-4"
          }
        >
          HOUSE TAX RECORDS
        </button>
        <button
          key="3"
          onClick={(e) => handleClick(e, "3")}
          value="ConLisc"
          className={
            selectedButtonId == "3"
              ? "bg-blue-300 rounded-lg m-2 h-20 w-48 text-white font-bold text-left pl-4"
              : "bg-blue-500 rounded-lg m-2 h-20 w-48 text-white font-bold text-left pl-4"
          }
        >
          CONSTRUCTION LICENCES
        </button>
      </div>
      <div className="w-full m-5">
        {documentType == "Properties" && <MuncipalPropertySearch />}
        {documentType == "HouseTax" && <HouseTax />}
        {documentType == "ConLisc" && <ConLisc />}
      </div>
    </div>
  );
};

export default Search;
