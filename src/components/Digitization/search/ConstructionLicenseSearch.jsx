import React from "react";
import { useAuth } from "../../../utils/auth";
import axios from "axios";

function ConstructionLicenseSearch() {
  const auth = useAuth();
  function convertToByteArray(input) {
    var sliceSize = 512;
    var bytes = [];

    for (var offset = 0; offset < input.length; offset += sliceSize) {
      var slice = input.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);

      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      bytes.push(byteArray);
    }

    return bytes;
  }
  const handleclick = () => {
    axios({
      method: "get",
      url: "http://localhost:5000/api/v1/digitization/filedownload?doc_name=Result",
      headers: {
        Authorization: `Bearer ${auth.user}`,
      },
    })
      .then((response) => {
        var file = new Blob(convertToByteArray(response.data), {
          type: "application/pdf",
        });

        const fileURL = URL.createObjectURL(file);

        window.open(fileURL);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <button onClick={handleclick}>get files</button>
      <h1>construction</h1>
    </>
  );
}

export default ConstructionLicenseSearch;
