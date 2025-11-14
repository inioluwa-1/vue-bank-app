import api from './api'

export default {
  // Get all beneficiaries
  async getAllBeneficiaries() {
    try {
      const response = await api.get('/beneficiaries')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Add new beneficiary
  async addBeneficiary(beneficiaryData) {
    try {
      const response = await api.post('/beneficiaries', beneficiaryData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update beneficiary
  async updateBeneficiary(id, beneficiaryData) {
    try {
      const response = await api.put(`/beneficiaries/${id}`, beneficiaryData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Delete beneficiary
  async deleteBeneficiary(id) {
    try {
      const response = await api.delete(`/beneficiaries/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}
