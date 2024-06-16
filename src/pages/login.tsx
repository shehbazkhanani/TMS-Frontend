import React, { useEffect } from "react";
import { Card, Button, Form, message } from "antd";
import CustomInput from "../components/customInput";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/auth.slice";

type FieldType = {
  email?: string;
  password?: string;
  remember?: boolean;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state: any) => state.auth);
  const onFinish = async (values: FieldType) => {
    try {
      dispatch(login(values) as any);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/layout");
      message.success("Login successful");
    }
  }, [token]);

  const onFinishFailed = (errorInfo: any) => {
    errorInfo.errorFields.forEach((error: any) => {
      const fieldName = error.name.join(" ");
      error.errors.forEach((err: string) => {
        message.error(`${fieldName}: ${err}`);
      });
    });
  };

  return (
    <Card
      title="Login"
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
        <CustomInput label="Email" name="email" required={true} />
        <CustomInput label="Password" name="password" required={true} />

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" className="mt-4 w-full">
            Login
          </Button>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <a href="/signup" className="text-blue-500">
            Don't have an account
          </a>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;
