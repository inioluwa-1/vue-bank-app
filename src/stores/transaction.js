import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import transactionService from '@/services/transaction'
import { useAuthStore } from './auth'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([])
  const currentTransaction = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0
  })

  // Computed
  const balance = computed(() => {
    const authStore = useAuthStore()
    return authStore.user?.balance || 0
  })

  const recentTransactions = computed(() => {
    return transactions.value.slice(0, 5)
  })

  const totalDeposits = computed(() => {
    return transactions.value
      .filter(t => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  })

  const totalTransfers = computed(() => {
    return transactions.value
      .filter(t => t.type === 'transfer' && t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  })

  // Deposit
  async function deposit(depositData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await transactionService.deposit(depositData)
      
      // Update user balance in auth store
      const authStore = useAuthStore()
      if (response.new_balance) {
        authStore.updateUser({
          ...authStore.user,
          balance: response.new_balance
        })
      }
      
      // Add to transactions list
      if (response.transaction) {
        transactions.value.unshift(response.transaction)
      }
      
      return response
    } catch (err) {
      error.value = err.error || err.message || 'Deposit failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Transfer
  async function transfer(transferData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await transactionService.transfer(transferData)
      
      // Update user balance in auth store
      const authStore = useAuthStore()
      if (response.new_balance) {
        authStore.updateUser({
          ...authStore.user,
          balance: response.new_balance
        })
      }
      
      // Add to transactions list
      if (response.transaction) {
        transactions.value.unshift(response.transaction)
      }
      
      return response
    } catch (err) {
      error.value = err.error || err.message || 'Transfer failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get transaction history
  async function fetchTransactions(params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const response = await transactionService.getTransactionHistory(params)
      transactions.value = response.transactions || []
      
      if (response.meta) {
        pagination.value = {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          perPage: response.meta.per_page,
          total: response.meta.total
        }
      }
      
      return response
    } catch (err) {
      error.value = err.error || err.message || 'Failed to fetch transactions'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get single transaction
  async function fetchTransactionById(id) {
    loading.value = true
    error.value = null
    
    try {
      const response = await transactionService.getTransactionById(id)
      currentTransaction.value = response.transaction
      return response
    } catch (err) {
      error.value = err.error || err.message || 'Failed to fetch transaction'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Clear transactions
  function clearTransactions() {
    transactions.value = []
    currentTransaction.value = null
  }

  return {
    transactions,
    currentTransaction,
    loading,
    error,
    pagination,
    balance,
    recentTransactions,
    totalDeposits,
    totalTransfers,
    deposit,
    transfer,
    fetchTransactions,
    fetchTransactionById,
    clearTransactions
  }
})
