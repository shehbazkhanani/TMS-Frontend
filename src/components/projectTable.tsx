import { Button, Table } from "antd";
import type { TableProps } from "antd";
import { DeleteOutlined } from '@ant-design/icons';


interface DataType {
  id: number;
  name: string;
}

const ProjectTable = ({ data,onClick, onDelete }: { data: DataType[],onClick: (e:number) => void, onDelete: (id: number) => void }) => {
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text,e) => <a onClick={() =>  onClick(e.id)}>{text}</a>,
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

export default ProjectTable;
