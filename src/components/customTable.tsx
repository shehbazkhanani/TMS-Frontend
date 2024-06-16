import React, { useState } from 'react';
import { Cascader, Space, Table, Tag, Tooltip, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { CascaderProps, TableProps } from 'antd';

interface DataType {
  key: string;
  ticket: string;
  title: string;
  assignee: string;
  description: string;
  deadline: string;
  status: string;
}

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

const CustomTable: React.FC = () => {
  const [data, setData] = useState<DataType[]>([
    {
      key: '1',
      ticket: '001',
      title: 'Issue 1',
      assignee: 'User2',
      description: 'This is a long description for issue 1 that exceeds 40 characters.',
      deadline: '2024-07-01',
      status: 'Todo',
    },
    {
      key: '2',
      ticket: '002',
      title: 'Issue 2',
      assignee: 'User1',
      description: 'This is another long description for issue 2 that exceeds 40 characters.',
      deadline: '2024-07-05',
      status: 'Todo',
    },
  ]);

  const statusUpdate: CascaderProps<Option>['onChange'] = (value:any, selectedOptions:any, record:any) => {
    const newStatus = value[0];
    const newData = data.map(item => {
      if (item.key === record.key) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    setData(newData);
  };

  const deleteRecord = (key: string) => {
    const newData = data.filter(item => item.key !== key);
    setData(newData);
  };

  const options: Option[] = [
    {
      value: 'Todo',
      label: 'Todo',
    },
    {
      value: 'InProgress',
      label: 'In Progress',
    },
    {
      value: 'Completed',
      label: 'Completed',
    },
  ];

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Ticket',
      dataIndex: 'ticket',
      key: 'ticket',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <Tooltip title={text}>
          {text.length > 40 ? `${text.substring(0, 40)}...` : text}
        </Tooltip>
      ),
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        let color;
        if (status === 'Todo') {
          color = 'blue';
        } else if (status === 'InProgress') {
          color = 'yellow';
        } else if (status === 'Completed') {
          color = 'green';
        }
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Update',
      key: 'update',
      render: (_, record) => (
        <Space size="middle">
          <Cascader options={options} onChange={(value, selectedOptions) => statusUpdate(value, selectedOptions, record)} placeholder="Select Status" />
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<DeleteOutlined />} onClick={() => deleteRecord(record.key)} />
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default CustomTable;
