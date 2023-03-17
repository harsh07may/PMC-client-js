import { Button } from "antd";
import Link from "antd/es/typography/Link";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div>
      <Button type="primary" onClick={() => navigate("/AppGallery")}>
        Login
      </Button>
    </div>
  );
}
