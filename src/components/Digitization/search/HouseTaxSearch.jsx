import React from "react";
import { useAuth } from "../../../utils/auth";
import axios from "axios";
import fileDownload from "js-file-download";
function HouseTaxSearch() {
  const auth = useAuth();

  const handleclick = () => {
    axios({
      method: "get",
      url: "http://localhost:5000/api/v1/digitization/file-download?doc_name=123",
      headers: {
        Authorization: `Bearer ${auth.user}`,
      },
      responseType: "blob",
    })
      .then((res) => {
        let fileSuffix = res.headers["content-disposition"]
          .split('filename="')[1]
          .split(".")[0];
        let extension = res.headers["content-disposition"]
          .split(".")[1]
          .split('"')[0];
        const fileName = fileSuffix + "." + extension;
        console.log(fileName);
        fileDownload(res.data, fileName);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <button onClick={handleclick}>get files</button>
      <h1>adsadf</h1>
    </>
  );
}

export default HouseTaxSearch;
