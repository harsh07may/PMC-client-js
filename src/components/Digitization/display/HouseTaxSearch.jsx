import React from "react";
import { useAuth } from "../../../utils/auth";
import axios from "axios";
import fileDownload from "js-file-download";
function HouseTaxSearch() {
  const auth = useAuth();

  const handleclick = () => {
    axios({
      method: "get",
      url: "http://localhost:5000/api/v1/digitization/filedownload?doc_name=Test",
      headers: {
        Authorization: `Bearer ${auth.user}`,
      },
      responseType: "blob",
    })
      .then((response) => {
        fileDownload(res.data, "download.pdf");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <button onClick={handleclick}>get files</button>
    </>
  );
}

export default HouseTaxSearch;
