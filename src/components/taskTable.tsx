import { Button, Table } from "antd";
import type { TableProps } from "antd";
import { Task } from "../redux/slices/task.slice";
import { DeleteOutlined } from '@ant-design/icons';


const TaskTable = ({ data, onDelete }: { data: Task[], onDelete: (id: number) => void }) => {
  const columns: TableProps<Task>["columns"] = [
    {
      title: "No #",
      dataIndex: "id",
      key: "id",
      render: (e) => <div>00{e}</div>
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
    },
    {
      title: "Assignee",
      dataIndex: "assignee_id",
      key: "assignee_id",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => onDelete(record.id)}
        />
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default TaskTable;
