import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentService from '../../services/payment.service';

export const processPayment = createAsyncThunk(
  'payments/process',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentService.processPayment(paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPaymentHistory = createAsyncThunk(
  'payments/history',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentService.getPaymentHistory();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  payments: [],
  currentPayment: null,
  paymentHistory: [],
  isLoading: false,
  error: null,
  success: false,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearPaymentState: (state) => {
      state.currentPayment = null;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Process Payment
      .addCase(processPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPayment = action.payload.payment;
        state.payments.unshift(action.payload.payment);
        state.success = true;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Payment processing failed';
        state.success = false;
      })
      // Get Payment History
      .addCase(getPaymentHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPaymentHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentHistory = action.payload.payments;
      })
      .addCase(getPaymentHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch payment history';
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;