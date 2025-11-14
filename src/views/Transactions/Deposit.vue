<template>
  <div class="deposit-container">
    <div class="deposit-card">
      <h1>Deposit Funds</h1>
      
      <form @submit.prevent="handleDeposit">
        <div class="form-group">
          <label>Amount (₦)</label>
          <input
            v-model="formData.amount"
            type="number"
            step="0.01"
            min="1"
            placeholder="Enter amount to deposit"
            required
          />
        </div>

        <div class="form-group">
          <label>Sender Account Number (Optional)</label>
          <input
            v-model="formData.sender_account_number"
            type="text"
            maxlength="10"
            placeholder="Enter sender's account number"
          />
        </div>

        <div class="form-group">
          <label>Sender Name (Optional)</label>
          <input
            v-model="formData.sender_name"
            type="text"
            placeholder="Enter sender's name"
          />
        </div>

        <div class="balance-info">
          <p>Current Balance: <strong>₦{{ formatAmount(user?.balance) }}</strong></p>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Processing...' : 'Deposit' }}
        </button>
      </form>

      <router-link :to="`/dashboard/${user?.id}`" class="back-link">
        ← Back to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTransactionStore } from '@/stores/transaction'

const authStore = useAuthStore()
const transactionStore = useTransactionStore()

const user = computed(() => authStore.user)

const formData = ref({
  amount: '',
  sender_account_number: '',
  sender_name: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function handleDeposit() {
  errorMessage.value = ''
  successMessage.value = ''

  loading.value = true

  try {
    const response = await transactionStore.deposit(formData.value)
    successMessage.value = response.message || 'Deposit successful!'
    
    // Reset form
    formData.value = {
      amount: '',
      sender_account_number: '',
      sender_name: ''
    }
  } catch (error) {
    console.error('Deposit error:', error)
    errorMessage.value = error.error || error.message || 'Deposit failed'
  } finally {
    loading.value = false
  }
}

function formatAmount(amount) {
  if (!amount) return '0.00'
  return parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
</script>

<style scoped>
.deposit-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24px;
}

.deposit-card {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0 0 24px 0;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

.balance-info {
  background: #e8f5e9;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.balance-info p {
  margin: 0;
  color: #2e7d32;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.success-message {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(76, 175, 80, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-link {
  display: inline-block;
  margin-top: 24px;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
