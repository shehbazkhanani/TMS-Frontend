import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import projectReducer from "./slices/project.slice";
import taskReducer from "./slices/task.slice";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 
 
 
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ["auth"]
}


const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  task: taskReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});
export const persistor = persistStore(store)
export type RootState = ReturnType<typeof rootReducer>