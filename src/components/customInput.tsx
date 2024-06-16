import React from 'react';
import { Form, Input } from 'antd';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

type InputProps = {
    label?: string;
    name?: string | any;
    message?: string;
    required?: boolean;
}

const CustomInput: React.FC<InputProps> = ({ label, name, message, required }) => (
    <Form.Item<FieldType>
      label={label}
      name={name}
      className='text-black'
      rules={[{ required: required, message:  'Please input your ' + (message || 'value') + '!' }]}
    >
      {label !== "password" ? <Input className='text-black' /> : <Input.Password />}
      
    </Form.Item>
);

export default CustomInput;
