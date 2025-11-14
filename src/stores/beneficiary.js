import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import beneficiaryService from '@/services/beneficiary'

export const useBeneficiaryStore = defineStore('beneficiary', () => {
  const beneficiaries = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const beneficiariesCount = computed(() => beneficiaries.value.length)

  // Get all beneficiaries
  async function fetchBeneficiaries() {
    loading.value = true
    error.value = null
    
    try {
      const response = await beneficiaryService.getAllBeneficiaries()
      beneficiaries.value = response.beneficiaries || []
      return response
    } catch (err) {
      error.value = err.error || err.message || 'Failed to fetch beneficiaries'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Add beneficiary
  async function addBeneficiary(beneficiaryData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await beneficiaryService.addBeneficiary(beneficiaryData)
      
      if (response.beneficiary) {
        beneficiaries.value.push(response.beneficiary)
      }
      
      return response
    } catch (err) {
      error.value = err.error || err.message || 'Failed to add beneficiary'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update beneficiary
  async function updateBeneficiary(id, beneficiaryData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await beneficiaryService.updateBeneficiary(id, beneficiaryData)
      
      if (response.beneficiary) {
        const index = beneficiaries.value.findIndex(b => b.id === id)
        if (index !== -1) {
          beneficiaries.value[index] = response.beneficiary
        }
      }
      
      return response
    } catch (err) {
      error.value = err.error || err.message || 'Failed to update beneficiary'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete beneficiary
  async function deleteBeneficiary(id) {
    loading.value = true
    error.value = null
    
    try {
      const response = await beneficiaryService.deleteBeneficiary(id)
      
      // Remove from local state
      beneficiaries.value = beneficiaries.value.filter(b => b.id !== id)
      
      return response
    } catch (err) {
      error.value = err.error || err.message || 'Failed to delete beneficiary'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get beneficiary by ID
  function getBeneficiaryById(id) {
    return beneficiaries.value.find(b => b.id === id)
  }

  // Clear beneficiaries
  function clearBeneficiaries() {
    beneficiaries.value = []
  }

  return {
    beneficiaries,
    loading,
    error,
    beneficiariesCount,
    fetchBeneficiaries,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    getBeneficiaryById,
    clearBeneficiaries
  }
})
