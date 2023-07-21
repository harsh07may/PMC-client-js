import {
  Calendar,
  Badge,
  Modal,
  List,
  Button,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Space,
  message,
} from "antd";
import {
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
const { RangePicker } = DatePicker;
import React, { useState, useEffect } from "react";
import jwt from "jwt-decode";
import axios from "axios";
import { getEnv } from "../../../utils/getEnv";
import { useAuth } from "../../../utils/auth";
import { getColorForString, checkPermission } from "../../../utils/fns";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
// import "dayjs/locale/en-in";
// import dayLocaleData from "dayjs/plugin/localeData";
// dayjs.extend(dayLocaleData);
import styles, { formInputStyles } from "./LeaveCalendar.module.css";

const LeaveCalendar = () => {
  const auth = useAuth();
  const [form] = Form.useForm();
  const [leaveData, setLeaveData] = useState([]);
  const [callApi, setCallApi] = useState(0);
  const [panelDate, setPanelDate] = useState(dayjs());

  function checkError(err) {
    if (err?.response?.data?.error?.name == "AuthenticationError") {
      message
        .error("You need to reload the page and try again!", 3.5)
        .then(() => window.location.reload(true));
    } else if (err.response.data.error?.name == "BadRequestError") {
      message.error(`${err.response.data.error?.message}`, 3.5);
    } else if (err.response.data.error?.name == "AccessDeniedError") {
      message.error(`${err.response.data.error?.message}`, 3.5);
    }
  }

  const getListData = (value) => {
    // console.log(value);
    // searches through the api response state
    let listData = [];
    leaveData.forEach((element) => {
      if (
        value
          .startOf("day")
          .isBetween(element.start_date, element.end_date, null, "[]")
      ) {
        listData.push(element);
      }
      // console.log(
      //   value,
      //   value.isBetween(element.start_date, element.end_date, null, "[]"),
      //   element
      // );
    });
    return listData || [];
  };

  const getLeaveData = async (date) => {
    let start_date = date
      .startOf("month")
      .add(-date.startOf("month").day(), "day");

    let end_date = date
      .startOf("month")
      .add(-date.startOf("month").day(), "day")
      .add(41, "day");

    // console.log(start_date, end_date);

    await axios
      .post(
        `${getEnv("VITE_API_STRING")}/api/v1/leave/getLeavesInRange`,
        { start_date, end_date },
        {
          headers: {
            Authorization: `Bearer ${auth.user.accesstoken}`,
          },
        }
      )
      .then((res) => {
        // console.log(res.data);
        setLeaveData(res.data);
      })
      .catch((error) => {
        checkError(error);
        message.error("Failed to get Leave Records", 1.5);
        console.log(error);
      });
  };

  useEffect(() => {
    // call the getLeaveData call
    getLeaveData(panelDate);
  }, [callApi]);

  const dateCellRender = (value) => {
    // get values for the cell
    const listData = getListData(value);
    return (
      <ul
        className={styles.events}
        onClick={(e) => onDateCellClick(e, value, listData)}
      >
        {listData.map((item) => (
          <li
            key={`${item.start_date}+${item.end_date}+${item.applicant_name}+${item.leave_type}`}
          >
            <Badge
              color={getColorForString(
                `${item.applicant_name}+${item.leave_type}+${item.designation}+${item.department}`
              )}
              text={item.applicant_name}
            />
          </li>
        ))}
      </ul>
    );
  };

  const onPanelChange = (date) => {
    //make getLeaveData call
    setPanelDate(date);
    getLeaveData(date);
  };

  const IconText = ({ icon, text, callback, callbackParam, className }) => (
    <Space onClick={() => callback(callbackParam)} className={className}>
      {React.createElement(icon)}
      {text}
    </Space>
    // <Button icon={<UploadOutlined />}>Click to Upload</Button>
  );
  const deleteLeave = async (record) => {
    await axios
      .delete(
        `${getEnv("VITE_API_STRING")}/api/v1/leave/deleteLeave?id=${record.id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.user.accesstoken}`,
          },
        }
      )
      .then((res) => {
        message.success("Successfully deleted Leave Record", 1.5);
      })
      .catch((error) => {
        checkError(error);
        message.error("Failed to delete Leave Record", 1.5);
      });
    setCallApi((value) => value + 1);
    Modal.destroyAll();
  };

  const onDateCellClick = (e, value, listData) => {
    // const items = listData.map((data, idx) => {
    //   console.log(data, idx);
    //   return data;
    // });
    const text = `
    A dog is a type of domesticated animal.
    Known for its loyalty and faithfulness,
    it can be found as a welcome guest in many households across the world.
    `;

    const modal = Modal.info({
      closable: true,
      centered: true,
      autoFocusButton: null,
      maskClosable: true,
      title: `${value.format("D MMMM, YYYY")}`,
      content: (
        <List
          itemLayout="vertical"
          bordered
          dataSource={listData}
          renderItem={(item) => (
            <List.Item
              actions={[
                <IconText
                  icon={DeleteOutlined}
                  className={styles.iconText}
                  text="Delete"
                  key="delete-leave"
                  callback={deleteLeave}
                  callbackParam={item}
                />,
              ]}
            >
              <List.Item.Meta
                title={item.applicant_name}
                description={
                  <>
                    <p>
                      <strong>Designation:</strong> {item.designation}
                    </p>
                    <p>
                      <strong>Department:</strong> {item.department}
                    </p>
                    <p>
                      <strong>Leave Type:</strong> {item.leave_type}
                    </p>
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {dayjs(item.start_date).format("D MMMM, YYYY")}
                    </p>
                    <p>
                      <strong>End Date:</strong>{" "}
                      {dayjs(item.end_date).format("D MMMM, YYYY")}
                    </p>
                  </>
                }
              />
            </List.Item>
          )}
        />
      ),
    });
    // setIsModalOpen(true);
  };

  const [openLeaveModal, setOpenLeaveModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showModal = () => {
    setOpenLeaveModal(true);
  };
  const handleOk = () => {
    //call form submit
    form.submit();

    // setConfirmLoading(true);
    // setTimeout(() => {
    //   setOpenLeaveModal(false);
    //   setConfirmLoading(false);
    // }, 2000);
  };
  const handleCancel = () => {
    form.resetFields();
    setOpenLeaveModal(false);
  };

  const submitAddLeaveForm = async (values) => {
    values.dates[0] = values.dates[0].startOf("day");
    values.dates[1] = values.dates[1].startOf("day");

    //make api call
    setConfirmLoading(true);

    await axios
      .post(`${getEnv("VITE_API_STRING")}/api/v1/leave/addLeave`, values, {
        headers: {
          Authorization: `Bearer ${auth.user.accesstoken}`,
        },
      })
      .then((res) => {
        message.success("Leave Record Added Successfully", 1.5);
        form.resetFields();
        setConfirmLoading(false);
        setOpenLeaveModal(false);
        setCallApi((value) => value + 1);
        // getLeaveData(dayjs());
      })
      .catch((error) => {
        checkError(error);
        message.error("Failed to add Leave Record", 1.5);
        setConfirmLoading(false);
        console.log(error);
      });
  };

  const onFinishFailed = () => {
    console.log("failed");
  };

  return (
    <>
      <Modal
        title="Add Leave"
        open={openLeaveModal}
        onOk={handleOk}
        centered
        destroyOnClose={true}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <>
          <Row align="middle" justify="center">
            <Col xs={22} sm={20} md={20} lg={18}>
              <Form
                style={{ marginTop: "10px", overflow: "hidden" }}
                onFinish={submitAddLeaveForm}
                onFinishFailed={onFinishFailed}
                form={form}
              >
                {/* <Row gutter={24}> */}
                {/* <Col xs={24} md={24}> */}
                <Form.Item
                  wrapperCol={{ xs: { span: 20 }, sm: { span: 24 } }}
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a name!",
                    },
                    {
                      pattern: new RegExp(/^.{1,50}$/),
                      message:
                        "Reference number should be at least 1 characters long!",
                    },
                    {
                      pattern: new RegExp(/^$|^\S+/),
                      message:
                        "Reference number should not start with a whitespace character!",
                    },
                  ]}
                >
                  <Input
                    autoComplete="off"
                    size="large"
                    placeholder="Name"
                    className={formInputStyles}
                  />
                </Form.Item>
                {/* </Col> */}
                {/* </Row> */}
                <Form.Item
                  name="designation"
                  wrapperCol={{ xs: { span: 20 }, sm: { span: 24 } }}
                  rules={[
                    {
                      required: true,
                      message: "Please enter a designation!",
                    },
                    {
                      pattern: new RegExp(/^.{2,100}$/),
                      message:
                        "Designation should be at least 2 characters long!",
                    },
                    {
                      pattern: new RegExp(/^$|^\S+/),
                      message:
                        "Designation should not start with a whitespace character!",
                    },
                  ]}
                >
                  <Input
                    autoComplete="off"
                    status=""
                    size="large"
                    placeholder="Designation"
                    className={formInputStyles}
                  />
                </Form.Item>
                <Form.Item
                  name="department"
                  wrapperCol={{ xs: { span: 20 }, sm: { span: 24 } }}
                  rules={[
                    {
                      required: true,
                      message: "Please enter a department!",
                    },
                    {
                      pattern: new RegExp(/^.{2,100}$/),
                      message:
                        "Department should be at least 2 characters long!",
                    },
                    {
                      pattern: new RegExp(/^$|^\S+/),
                      message:
                        "Department should not start with a whitespace character!",
                    },
                  ]}
                >
                  <Input
                    autoComplete="off"
                    status=""
                    size="large"
                    placeholder="Department"
                    className={formInputStyles}
                  />
                </Form.Item>
                <Form.Item
                  name="type"
                  wrapperCol={{ xs: { span: 20 }, sm: { span: 24 } }}
                  rules={[
                    {
                      required: true,
                      message: "Please enter a leave type!",
                    },
                    {
                      pattern: new RegExp(/^.{2,100}$/),
                      message:
                        "Leave type should be at least 2 characters long!",
                    },
                    {
                      pattern: new RegExp(/^$|^\S+/),
                      message:
                        "Leave type should not start with a whitespace character!",
                    },
                  ]}
                >
                  <Input
                    autoComplete="off"
                    status=""
                    size="large"
                    placeholder="Leave Type"
                    className={formInputStyles}
                  />
                </Form.Item>
                <Form.Item
                  name="dates"
                  wrapperCol={{ xs: { span: 20 }, sm: { span: 24 } }}
                  rules={[
                    {
                      required: true,
                      message: "Please enter a Leave Period!",
                    },
                  ]}
                >
                  <RangePicker
                    style={{
                      width: "100%",
                    }}
                    className={formInputStyles}
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </>
      </Modal>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: 3,
          marginTop: 5,
        }}
      >
        {checkPermission(
          jwt(auth.user.accesstoken).perms,
          ["leave_management"],
          "editor"
        ) && (
          <Button size="large" onClick={showModal}>
            Add Leave
          </Button>
        )}
      </div>
      <Calendar
        dateCellRender={dateCellRender}
        onPanelChange={onPanelChange}
        className="check"
      />
    </>
  );
};

export default LeaveCalendar;
