import React, { useEffect } from "react";
import { Card, Button, Form, message } from "antd";
import CustomInput from "../components/customInput";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "../redux/slices/auth.slice";

type FieldType = {
  username: string;
  email: string;
  password: string;
};

const SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, messages } = useSelector((state: any) => state.auth);
  const onFinish = (values: FieldType) => {
    handleRegister(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    errorInfo.errorFields.forEach((error: any) => {
      const fieldName = error.name.join(" ");
      error.errors.forEach((err: string) => {
        message.error(`${fieldName}: ${err}`);
      });
    });
  };

  useEffect(() => {
    if (token) {
      navigate("/layout");
    }
  }, [token]);

  const handleRegister = async (values: FieldType) => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values?.email)) {
        message.error("Invalid email format");
        return;
      }
      dispatch(signin(values) as any);
    } catch (error: any) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (messages == "Sign in Successfully") {
      message.success(messages);
      navigate("/");
    }
  }, [messages]);

  return (
    <Card
      title="Create a new account"
      className="w-80 mx-auto mt-10 py-6 rounded-lg shadow-lg"
    >
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <CustomInput label="User Name" name="username" required={true} />
        <CustomInput label="Email" name="email" required={true} />
        <CustomInput label="Password" name="password" required={true} />

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" className="mt-4 w-full">
            Sign Up
          </Button>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <a href="/" className="text-blue-500">
            Already have an account?{" "}
          </a>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SignUp;
