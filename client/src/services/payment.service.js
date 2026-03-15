import api from './api';

class PaymentService {
  async processPayment(paymentData) {
    return api.post('/payments/process', paymentData);
  }

  async getPaymentHistory() {
    return api.get('/payments/history');
  }

  async getPaymentDetails(paymentId) {
    return api.get(`/payments/${paymentId}`);
  }

  async generateInvoice(paymentId) {
    return api.get(`/payments/invoice/${paymentId}`, { responseType: 'blob' });
  }

  async refundPayment(paymentId) {
    return api.post(`/payments/${paymentId}/refund`);
  }
}

export default new PaymentService();