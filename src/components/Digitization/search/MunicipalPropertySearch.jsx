import React from "react";
import { useState } from "react";
import axios from "axios";

const MunicipalPropertySearch = () => {
  //data members
  const options = [
    { value: "", text: "--Choose an option--" },
    { value: "1", text: "1" },
    { value: "2", text: "2" },
    { value: "3", text: "3" },
    { value: "4", text: "4" },
    { value: "5", text: "5" },
    { value: "6", text: "6" },
    { value: "7", text: "7" },
    { value: "8", text: "8" },
    { value: "9", text: "9" },
  ];

  //States
  const [wardNo, setWardNo] = useState(options[0].value);
  const [data, setData] = useState();

  //functions
  const handleChange = (event) => {
    const data = event.target.value;
    setWardNo(data);
  };
  //API calls
  const getData = async (event) => {
    const object = {
      wardNo: wardNo,
    };
    console.log(object);
    event.preventDefault();
    await axios
      .post("http://13.235.241.41:3002/getMuncipalData", object)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setData();
        window.alert(err);
      });
  };

  return (
    <>
      <h1 className=" font-bold text-xl mb-2">MUNCIPAL PROPERTY RECORDS</h1>
      <form className="w-full" onSubmit={getData} encType="multipart/form-data">
        <div className="flex flex-row space-x-52 w-2/3">
          <label
            htmlFor="ward"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Ward No.
          </label>
          <select
            value={wardNo}
            onChange={handleChange}
            name="ward"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-row w-2/3 mt-10">
          <input
            type="submit"
            value="Submit"
            className="inline-block m-4 px-8 py-2 text-white font-bold bg-blue-500 rounded hover:bg-blue-300"
          />
        </div>
      </form>

      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Title
              </th>
              <th scope="col" className="py-3 px-6">
                Ward No.
              </th>
              <th scope="col" className="py-3 px-6">
                Sub Div. No.
              </th>
              <th scope="col" className="py-3 px-6">
                File
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((record, i) => (
              <tr
                key={i}
                className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
              >
                <td className="py-4 px-6">{record.title}</td>
                <td className="py-4 px-6">{record.wardNo}</td>
                <td className="py-4 px-6">{record.subDivNo}</td>
                <td className="py-4 px-6 text-blue-500 hover:text-blue-700">
                  <a href={record.fileLink}>Download </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MunicipalPropertySearch;
