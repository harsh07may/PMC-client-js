const PORT = import.meta.env.VITE_PORT;
const HOST = import.meta.env.VITE_HOST;
const PROTOCOL = import.meta.env.VITE_PROTOCOL;
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  message,
  Checkbox,
  Tag,
} from "antd";
const { Option, OptGroup } = Select;
import axios from "axios";
import { useAuth } from "../../../../utils/auth";
import { isIntersecting } from "../../../../utils/fns";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const permissionGroups = [
  {
    groupName: "ADMIN",
    options: [{ value: "admin", label: "ADMIN" }],
  },
  {
    groupName: "Municipality Property Records",
    options: [
      { value: "municipality_property_records/editor", label: "MP Editor" },
      { value: "municipality_property_records/viewer", label: "MP Viewer" },
    ],
  },
  {
    groupName: "Birth Records",
    options: [
      { value: "birth_records/editor", label: "BTH Editor" },
      { value: "birth_records/viewer", label: "BTH Viewer" },
    ],
  },
  {
    groupName: "Death Records",
    options: [
      { value: "death_records/editor", label: "DTH Editor" },
      { value: "death_records/viewer", label: "DTH Viewer" },
    ],
  },
  {
    groupName: "House Tax Records",
    options: [
      { value: "house_tax_records/editor", label: "HT Editor" },
      { value: "house_tax_records/viewer", label: "HT Viewer" },
    ],
  },
  {
    groupName: "Construction License Records",
    options: [
      { value: "construction_license_records/editor", label: "CL Editor" },
      { value: "construction_license_records/viewer", label: "CL Viewer" },
    ],
  },
  {
    groupName: "Trade License Records",
    options: [
      { value: "trade_license_records/editor", label: "TL Editor" },
      { value: "trade_license_records/viewer", label: "TL Viewer" },
    ],
  },
];

const formatPerms = (perms) => {
  const result = {
    admin: false,
    municipality_property_records: "deny",
    birth_records: "deny",
    death_records: "deny",
    house_tax_records: "deny",
    construction_license_records: "deny",
    trade_license_records: "deny",
  };

  if (perms.includes("admin"))
    return {
      admin: true,
      municipality_property_records: "editor",
      birth_records: "editor",
      death_records: "editor",
      house_tax_records: "editor",
      construction_license_records: "editor",
      trade_license_records: "editor",
    };

  perms.forEach((element) => {
    if (element !== "admin") {
      console.log(element);
      result[element.split("/")[0]] = element.split("/")[1];
    }
  });

  return result;
};

export default function CreateAccount() {
  const [datas, setDatas] = useState(permissionGroups);
  const [selectedItems, setSelectedItems] = useState([]);

  const onChange = (option) => {
    setSelectedItems(option);

    const newData = () =>
      datas.map((data) => {
        if (
          isIntersecting(
            data.options.map((each) => {
              return each.value;
            }),
            option
          )
        ) {
          return {
            groupName: data.groupName,
            options: data.options.map((each) => {
              return {
                value: each.value,
                label: each.label,
                disabled: !isIntersecting([each.value], option),
              };
            }),
          };
        } else {
          return {
            groupName: data.groupName,
            options: data.options.map((each) => {
              return {
                value: each.value,
                label: each.label,
                disabled: false,
              };
            }),
          };
        }
      });

    const newAdminData = () =>
      datas.map((data) => {
        return {
          groupName: data.groupName,
          options: data.options.map((each) => {
            return {
              value: each.value,
              label: each.label,
              disabled: !isIntersecting([each.value], "admin"),
            };
          }),
        };
      });

    if (option.length > 0) {
      if (isIntersecting(["admin"], option)) {
        setDatas(newAdminData());
      } else {
        setDatas(newData());
      }
    } else {
      setDatas(permissionGroups);
    }
  };

  function tagRender(props) {
    const { label, value, closable, onClose } = props;

    return (
      <Tag
        color="blue"
        closable={closable}
        onClose={onClose}
        style={{ margin: 3 }}
      >
        {label}
      </Tag>
    );
  }
  //!

  const auth = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  let { state } = useLocation();
  const navigate = useNavigate();

  const onFinish = (values) => {
    const perms = formatPerms(values.permissions);
    values = { ...values, perms: perms };

    if (state) {
      // For edit account
      axios
        .post(
          `${PROTOCOL}://${HOST}:${PORT}/api/v1/admin/update-user`,
          values,
          {
            headers: {
              Authorization: `Bearer ${auth.user.accesstoken}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 201) {
            messageApi
              .open({
                type: "success",
                content: "Account Modified Successfully!",
                duration: 1.5,
              })
              .then(() =>
                navigate("../accounts/ManageAccounts", { replace: true })
              );
          }
        })
        .catch((error) => {
          if (error.response.status == 400) {
            message.error("Username already registered!", 1.5);
          }
          console.log(error);
        });
    } else {
      console.log(values);
      //  For create account
      axios
        .post(`${PROTOCOL}://${HOST}:${PORT}/api/v1/admin/register`, values, {
          headers: {
            Authorization: `Bearer ${auth.user.accesstoken}`,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status == 201) {
            message.success("Account Registered Successfully!", 1.5);
            form.resetFields();
            setSelectedItems([]);
            setDatas(permissionGroups);
          }
        })
        .catch((error) => {
          // if (error.response.status == 400) {
          //   message.error("Username already registered!", 1.5);
          // }
          console.log(error);
        });
    }
  };

  const [form] = Form.useForm();
  const [disableUsername, setDisableUsername] = useState(false);

  useEffect(() => {
    if (state) {
      setDisableUsername(true);
      axios({
        method: "get",
        url: `${PROTOCOL}://${HOST}:${PORT}/api/v1/admin/get-user?username=${state?.username}`,
        headers: {
          Authorization: `Bearer ${auth.user.accesstoken}`,
        },
      }).then((res) => {
        const permData = ["admin"];
        form.setFieldsValue({
          fullname: res.data.rows[0].fullname,
          username: res.data.rows[0].username,
          roles: res.data.rows[0].roles,
          permissions: permData,
        });
        onChange(permData);
      });
    }
  }, [state]);

  return (
    <>
      {contextHolder}
      <br />
      <h3 style={{ textAlign: "center" }}>
        {state ? `Edit Account` : `Create Account`}
      </h3>
      <br />
      <Row align="middle" justify="center">
        <Col xs={22} sm={20} md={16} lg={12}>
          <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            style={{
              maxWidth: 600,
            }}
            scrollToFirstError={{
              behavior: "smooth",
              block: "center",
              inline: "center",
            }}
          >
            <Form.Item
              name="fullname"
              label="Full Name"
              rules={[
                {
                  required: true,
                  message: "Please input your full name!",
                },
                {
                  max: 30,
                  message: "Name has to be less than 30 characters!",
                },
              ]}
            >
              <Input autoComplete="off" />
            </Form.Item>

            <Form.Item
              name="username"
              label="Username"
              tooltip="A name to uniquely identify yourself"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                  whitespace: false,
                },
                {
                  pattern: new RegExp(/^(\w)+$/),
                  message:
                    "Whitespaces and special characters are not allowed!",
                },
              ]}
            >
              <Input autoComplete="off" disabled={disableUsername} />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                {
                  pattern: new RegExp(/^.{8,20}$/),
                  message: "Password should be at least 8 characters long!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="permissions"
              label="Permissions"
              initialValue={[]}
              rules={[
                {
                  required: true,
                  message: "Please select a permisssion!",
                },
              ]}
            >
              <Select
                mode="multiple"
                value={selectedItems}
                tagRender={tagRender}
                style={{ width: "100%" }}
                onChange={onChange}
              >
                {datas.map((data) => (
                  <OptGroup label={data.groupName} key={data.groupName}>
                    {data.options.map((option) => (
                      <Option
                        value={option.value}
                        key={option.value}
                        disabled={option?.disabled ?? false}
                      >
                        <Checkbox
                          style={{ pointerEvents: "none" }}
                          type="checkbox"
                          checked={selectedItems.indexOf(option.value) !== -1}
                          disabled={option?.disabled ?? false}
                        >
                          {option.label}
                        </Checkbox>
                      </Option>
                    ))}
                  </OptGroup>
                ))}
              </Select>
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                {state ? `Save Changes` : `Create Account`}
              </Button>
              {state ? (
                <Button
                  style={{ marginLeft: 10 }}
                  danger
                  onClick={() =>
                    navigate("../accounts/ManageAccounts", { replace: true })
                  }
                >
                  Cancel
                </Button>
              ) : (
                ""
              )}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
