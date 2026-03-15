import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import courseReducer from './slices/courseSlice';
import assignmentReducer from './slices/assignmentSlice';
import userReducer from './slices/userSlice';
import paymentReducer from './slices/paymentSlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  courses: courseReducer,
  assignments: assignmentReducer,
  users: userReducer,
  payments: paymentReducer,
  notifications: notificationReducer,
  ui: uiReducer,
});