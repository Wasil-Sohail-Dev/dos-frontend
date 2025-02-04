import { configureStore } from '@reduxjs/toolkit';
import summaryReducer from './summary/summarySlice';
import documentReducer from './document/documentSlice';
import authReducer from './auth/authSlice';
import chatReducer from './chat/chatSlice';

export const store = configureStore({
  reducer: {
    summary: summaryReducer,
    document: documentReducer,
    auth: authReducer,
    chat: chatReducer,
  },
});

export default store;