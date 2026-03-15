import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  theme: 'light',
  loading: false,
  modal: {
    open: false,
    type: null,
    data: null
  },
  toast: {
    open: false,
    message: '',
    severity: 'info'
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    openModal: (state, action) => {
      state.modal = {
        open: true,
        type: action.payload.type,
        data: action.payload.data || null
      };
    },
    closeModal: (state) => {
      state.modal = {
        open: false,
        type: null,
        data: null
      };
    },
    showToast: (state, action) => {
      state.toast = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'info'
      };
    },
    hideToast: (state) => {
      state.toast = {
        ...state.toast,
        open: false
      };
    }
  }
});

export const { 
  toggleSidebar, 
  setSidebarOpen, 
  setTheme, 
  setLoading,
  openModal,
  closeModal,
  showToast,
  hideToast
} = uiSlice.actions;
export default uiSlice.reducer;