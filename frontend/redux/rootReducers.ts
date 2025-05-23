import baseApi from "./api/baseApi";
import authReducer from "./feature/auth/authSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: process.env.NEXT_PUBLIC_LOCAL_STORAGE_NAME as string,
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const rootReducer = {
  [baseApi?.reducerPath]: baseApi?.reducer,
  user: persistedAuthReducer,
};

export default rootReducer;
