import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { RootState } from "../store";

export interface Task<e = number> {
  id: e;
  title: string;
  description: string;
  deadline: string;
  project_id: string;
  assignee_id: string;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
};

export const createTask = createAsyncThunk<any, Task<undefined>>(
  "task/createTask",
  async (data, { getState, rejectWithValue,dispatch }) => {
    const { token } = (getState() as RootState).auth;
    try {
      const response = await api.post("/add_task", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(getTasks(parseInt(data.project_id)) as any)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTasks = createAsyncThunk<Task[], number>(
  "task/getTasks",
  async (project , { getState, rejectWithValue }) => {
    const { token } = (getState() as RootState).auth;
    try {
      const response = await api.get(`/get_tasks/${project}`, {
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

export const deleteTask = createAsyncThunk<number, number>(
  "task/deleteTask",
  async (task, { getState, rejectWithValue }) => {
    const { token } = (getState() as RootState).auth;
    try {
      await api.delete(`/delete_task/${task}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return task; 
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = null;
        state.tasks = [...state.tasks, action.payload];
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch in";
      })
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = null;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch in";
      })
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = null;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch in";
      });
  },
});

export const { addTask } = taskSlice.actions;

export default taskSlice.reducer;
