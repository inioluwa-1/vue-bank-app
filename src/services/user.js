import api from './api'

export default {
  // Get user profile
  async getProfile() {
    try {
      const response = await api.get('/user')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/user/profile', profileData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Upload profile picture
  async uploadProfilePicture(file) {
    try {
      const formData = new FormData()
      formData.append('profile_picture', file)
      
      const response = await api.post('/user/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Create transaction PIN
  async createTransactionPin(pinData) {
    try {
      const response = await api.post('/user/transaction-pin', pinData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update transaction PIN
  async updateTransactionPin(pinData) {
    try {
      const response = await api.put('/user/transaction-pin', pinData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Add/Update next of kin
  async addNextOfKin(nextOfKinData) {
    try {
      const response = await api.post('/user/next-of-kin', nextOfKinData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get dashboard data
  async getDashboard(userId) {
    try {
      const response = await api.get(`/dashboard/${userId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}
