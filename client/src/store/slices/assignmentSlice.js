import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  assignments: [],
  currentAssignment: null,
  loading: false,
  error: null
};

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    setAssignments: (state, action) => {
      state.assignments = action.payload;
    },
    setCurrentAssignment: (state, action) => {
      state.currentAssignment = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setAssignments, setCurrentAssignment, setLoading, setError } = assignmentSlice.actions;
export default assignmentSlice.reducer;