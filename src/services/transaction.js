import api from './api'

export default {
  // Deposit funds
  async deposit(depositData) {
    try {
      const response = await api.post('/transactions/deposit', depositData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Transfer funds
  async transfer(transferData) {
    try {
      const response = await api.post('/transactions/transfer', transferData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get transaction history
  async getTransactionHistory(params = {}) {
    try {
      const response = await api.get('/transactions', { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get single transaction
  async getTransactionById(id) {
    try {
      const response = await api.get(`/transactions/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}
