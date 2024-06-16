import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Input,
  Layout,
  Menu,
  Modal,
  Select,
  message,
  theme,
} from "antd";
import moment from "moment";
import { useNavigate, useSearchParams } from "react-router-dom";
import { logout } from "../redux/slices/auth.slice";
import { useDispatch, useSelector } from "react-redux";
import {
  createProject,
  deleteProject,
  getProjects,
  getUsers,
} from "../redux/slices/project.slice";
import ProjectTable from "../components/projectTable";
import { RootState } from "../redux/store";
import { createTask, deleteTask, getTasks } from "../redux/slices/task.slice";
import TaskTable from "../components/taskTable";
const { Option } = Select;

const { Header, Sider, Content } = Layout;

interface TicketData {
  title: string;
  assignee: string;
  description: string;
  deadlineDate?: any;
}

const LayoutPage: React.FC = () => {
  const [ticketData, setTicketData] = useState<TicketData>({
    title: "",
    assignee: "",
    description: "",
    deadlineDate: undefined,
  });

  const [project, setProject] = useState("");
  const {
    project: { projects, users, ProjectMessage},
    task: {tasks}
  } = useSelector((state: RootState) => state);
  const [collapsed, setCollapsed] = useState(false);
  const [modal1Open, setModal1Open] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const [params, _] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
  if(ProjectMessage == 'Project deleted successfully'){
    message.success(ProjectMessage)
    navigate('/layout')
    window.location.reload();
  }
  },[ProjectMessage])

  const handleOk = () => {
    if (isValid(ticketData)) {
      try {
        dispatch(
          createTask({
            id: undefined,
            title: ticketData.title,
            description: ticketData.description,
            deadline: ticketData.deadlineDate,
            assignee_id: ticketData.assignee,
            project_id: params.get("project")?.toString() || "",
          }) as any
        );
        setModal1Open(false);
        message.success("project created successfully");
      } catch (error: any) {
        message.error("task failed");
        console.error(error.message);
      }
    }
  };

  const handleCancel = () => {
    setModal1Open(false);
  };


  const handleOk1 = async () => {
    if (project) {
      try {
        const projectWithToken = { name: project } as {
          name: string;
        };
        dispatch(createProject(projectWithToken) as any);
        setModal2Open(false);
        message.success("project created successfully");
      } catch (error: any) {
        message.error("Project fetching failed");
        console.error(error.message);
      }
    }
  };

  const handleCancel1 = () => {
    setModal2Open(false);
  };

  const isValid = (data: TicketData): boolean => {
    return (
      data.title.trim() !== "" &&
      data.description?.length > 0 &&
      data.deadlineDate.trim() !== "" &&
      data.assignee !== ""
    );
  };

  const handleLogout = async () => {
    dispatch(logout());
    navigate("/");
    message.success('Logged out Successfully')
  };

  useEffect(() => {
    dispatch(getProjects() as any);
    dispatch(getUsers() as any);
  }, []);

  useEffect(() => {
    if (params.get("project")) {
      dispatch(getTasks(parseInt(params.get("project") || "0")) as any);
      setShowTable(true);
    }
  }, [params]);

  const handleDelete = (id: number) => {
    dispatch(deleteTask(id) as any)
  };

  const handleProjectDelete = (id: number) => {
    dispatch(deleteProject(id) as any)
  };

  return (
    <Layout className="h-fit">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              label: "Dashboard",
            },
          
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 2, background: colorBgContainer, display : 'flex', justifyContent : "space-between", alignItems : 'center' }}>
          <div>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Button onClick={() => setModal2Open(true)}>Add Project</Button>
          </div>
          <Button onClick={() => handleLogout()}>Log out</Button>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <ProjectTable
            onClick={(e) => navigate(`?project=${e}`)}
            data={projects}
            onDelete={handleProjectDelete} 
          />

          {showTable && (
            <>
              <Button onClick={() => setModal1Open(true)} className="mb-5">Add Task</Button>
              <TaskTable data={tasks} onDelete={handleDelete} />
            </>
          )}
        </Content>
      </Layout>

      <Modal
        title="Add a New Task"
        style={{ top: 20 }}
        visible={modal1Open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add Task"
        cancelText="Cancel"
      >
        <div className="mb-4">
          <label htmlFor="title" className="block mb-1">
            Title:
          </label>
          <Input
            id="title"
            className="w-full"
            value={ticketData.title}
            onChange={(e) =>
              setTicketData({ ...ticketData, title: e.target.value })
            }
            placeholder="Enter task title"
          />
        </div>

        <div className="mb-4 w-[48%]">
          <label htmlFor="status" className="block mb-1">
            Assignee:
          </label>
          <Select
            id="assignee"
            className="w-full"
            value={ticketData.assignee}
            onChange={(value) =>
              setTicketData({ ...ticketData, assignee: value })
            }
          >
            {users.map((e) => (
              <Option value={e.id}>{e.username}</Option>
            ))}
          </Select>
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-1">
            Description:
          </label>
          <Input.TextArea
            id="description"
            className="w-full"
            value={ticketData.description}
            onChange={(e) =>
              setTicketData({ ...ticketData, description: e.target.value })
            }
            placeholder="Enter task description"
          />
        </div>
        <div className="flex justify-between w-full">
          <div className="mb-4 w-[48%]">
            <label htmlFor="deadline" className="block mb-1">
              Deadline:
            </label>
            <DatePicker
              id="deadline"
              className="w-full"
              value={
                ticketData.deadlineDate
                  ? moment(ticketData.deadlineDate)
                  : undefined
              }
              onChange={(date, dateString) =>
                setTicketData({ ...ticketData, deadlineDate: dateString })
              }
            />
          </div>
        </div>
      </Modal>
      <Modal
        title="Add a New Project"
        style={{ top: 20 }}
        visible={modal2Open}
        onOk={handleOk1}
        onCancel={handleCancel1}
        okText="Add Project"
        cancelText="Cancel"
      >
        <div className="mb-4">
          <label htmlFor="title" className="block mb-1">
            Project Name
          </label>
          <Input
            id="project"
            className="w-full"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="Enter Project Name"
          />
        </div>
      </Modal>
    </Layout>
  );
};

export default LayoutPage;
