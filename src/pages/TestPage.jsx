import axios from "axios";
import React from "react";
import { getEnv } from "../utils/getEnv";
import { Collapse } from "antd";

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const items = [
  {
    key: "1",
    label: "This is panel header 1",
    children: <p>{text}</p>,
  },
  {
    key: "2",
    label: "This is panel header 2",
    children: <p>{text}</p>,
  },
  {
    key: "3",
    label: "This is panel header 3",
    children: <p>{text}</p>,
  },
];

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
      <Collapse items={items} defaultActiveKey={["1"]} />
    </div>
  );
};

export default TestPage;
