import axios from "axios";
import React from "react";
import { getEnv } from "../utils/getEnv";

const TestPage = () => {
  async function callAPI() {
    // console.log(getEnv(VITE_API_STRING));
    console.log(getEnv("VITE_API_STRING"));
    await axios
      .get(`${getEnv("VITE_API_STRING")}/api/getall`)
      .then((res) => console.log(res.data))
      .catch((e) => console.log(e));
  }
  return (
    <div>
      <p>Test Page</p>
      <button onClick={() => console.log("clicked")}>clg</button>
      <button onClick={callAPI}>api</button>
    </div>
  );
};

export default TestPage;
