import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { RootState } from "../store";

interface Project {
  id: number;
  name: string;
}

interface User {
  username: string;
  email: string;
  id: number;
}

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  users: User[]
  ProjectMessage: string | null;
}

const initialState: ProjectState = {
  projects: [],
  users: [],
  isLoading: false,
  error: null,
  ProjectMessage : null,
};

export const createProject = createAsyncThunk<any, { name: string }>(
  "project/createProject",
  async ({ name }, { getState, rejectWithValue }) => {
    const { token } = (getState() as RootState).auth;
    try {
      const response = await api.post(
        "/create_project",
        { name: name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProjects = createAsyncThunk<Project[], void>(
  "project/getProjects",
  async (_, { getState, rejectWithValue }) => {
    const { token } = (getState() as RootState).auth;
    try {
      const response = await api.get("/get_projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getUsers = createAsyncThunk<User[], void>(
  "project/getUsers",
  async (_, { getState, rejectWithValue }) => {
    const { token } = (getState() as RootState).auth;
    try {
      const response = await api.get("/get_users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProject = createAsyncThunk<number, number>(
  "project/deleteProject",
  async (project, { getState, rejectWithValue }) => {
    const { token } = (getState() as RootState).auth;
    try {
      await api.delete(`/delete_project/${project}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return project; 
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    addProject(state, action: PayloadAction<Project>) {
      state.projects.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = null;
        state.projects = [...state.projects, action.payload];
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch in";
      })
      .addCase(getProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = null;
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch in";
      })
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = null;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch in";
      })
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = null;
        state.projects = state.projects.filter(project => project.id !== action.payload);
        state.ProjectMessage = "Project deleted successfully"
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch in";
      });
  },
});

export const { addProject } = projectSlice.actions;

export default projectSlice.reducer;
