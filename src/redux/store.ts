// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../redux/slices/adminSlice';

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     // other reducers...
//   },
// });

// // Define RootState and AppDispatch types
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export default store;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../redux/slices/adminSlice";
 
const adminPersistConfig = {
  key: "user",
  storage,  
   whitelist: ['CurrentDealerAdmin', 'token'],
};
 
const persistedAdminReducer = persistReducer(adminPersistConfig, authReducer);
 
const rootReducer = combineReducers({
  user: persistedAdminReducer,
});
 
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      ignoredActions: [
        "persist/PERSIST",
        "persist/REHYDRATE",
        "persist/REGISTER",
      ],
    }),
});
 
const persistor = persistStore(store);
 
export { persistor };
export default store;