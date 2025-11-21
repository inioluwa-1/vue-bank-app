<template>
  <div class="transfer-container">
    <div class="transfer-card">
      <h1>Transfer Funds</h1>
      
      <form @submit.prevent="handleTransfer">
        <div class="form-group">
          <label>Select Beneficiary (Optional)</label>
          <select v-model="formData.beneficiary_id" @change="selectBeneficiary">
            <option value="">Enter details manually...</option>
            <option
              v-for="beneficiary in beneficiaries"
              :key="beneficiary.id"
              :value="beneficiary.id"
            >
              {{ beneficiary.beneficiary_name }} - {{ beneficiary.account_number }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Beneficiary Account Number *</label>
          <input
            v-model="formData.beneficiary_account_number"
            type="text"
            maxlength="10"
            placeholder="Enter 10-digit account number"
            required
          />
        </div>

        <div class="form-group">
          <label>Beneficiary Name *</label>
          <input
            v-model="formData.beneficiary_name"
            type="text"
            placeholder="Enter beneficiary name"
            required
          />
        </div>

        <div class="form-group">
          <label>Amount (₦)</label>
          <input
            v-model="formData.amount"
            type="number"
            step="0.01"
            min="1"
            placeholder="Enter amount"
            required
          />
        </div>

        <div class="balance-info">
          <p>Available Balance: <strong>₦{{ formatAmount(user?.balance) }}</strong></p>
        </div>

        <div class="form-group">
          <label>Transaction PIN</label>
          <input
            v-model="formData.transaction_pin"
            type="password"
            maxlength="4"
            placeholder="Enter 4-digit PIN"
            required
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Processing...' : 'Transfer' }}
        </button>
      </form>

      <router-link :to="`/dashboard/${user?.id}`" class="back-link">
        ← Back to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBeneficiaryStore } from '@/stores/beneficiary'
import { useTransactionStore } from '@/stores/transaction'

const authStore = useAuthStore()
const beneficiaryStore = useBeneficiaryStore()
const transactionStore = useTransactionStore()

const user = computed(() => authStore.user)
const beneficiaries = computed(() => beneficiaryStore.beneficiaries)

const formData = ref({
  beneficiary_id: '',
  beneficiary_account_number: '',
  beneficiary_name: '',
  amount: '',
  transaction_pin: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

onMounted(async () => {
  await beneficiaryStore.fetchBeneficiaries()
})

function selectBeneficiary() {
  const beneficiary = beneficiaries.value.find(b => b.id == formData.value.beneficiary_id)
  if (beneficiary) {
    formData.value.beneficiary_account_number = beneficiary.account_number
    formData.value.beneficiary_name = beneficiary.beneficiary_name
  }
}

async function handleTransfer() {
  errorMessage.value = ''
  successMessage.value = ''

  // Validate balance
  if (parseFloat(formData.value.amount) > parseFloat(user.value.balance)) {
    errorMessage.value = 'Insufficient balance'
    return
  }

  loading.value = true

  try {
    // Prepare data - only include beneficiary_id if one is selected
    const transferData = {
      beneficiary_account_number: formData.value.beneficiary_account_number,
      beneficiary_name: formData.value.beneficiary_name,
      amount: formData.value.amount,
      transaction_pin: formData.value.transaction_pin
    }

    // Only add beneficiary_id if a beneficiary was selected from dropdown
    if (formData.value.beneficiary_id) {
      transferData.beneficiary_id = formData.value.beneficiary_id
    }

    const response = await transactionStore.transfer(transferData)
    successMessage.value = response.message || 'Transfer successful!'
    
    // Reset form
    formData.value = {
      beneficiary_id: '',
      beneficiary_account_number: '',
      beneficiary_name: '',
      amount: '',
      transaction_pin: ''
    }
  } catch (error) {
    console.error('Transfer error:', error)
    errorMessage.value = error.error || error.message || 'Transfer failed'
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
.transfer-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24px;
}

.transfer-card {
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

input,
select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

input:focus,
select:focus {
  outline: none;
  border-color: #667eea;
}

.balance-info {
  background: #e3f2fd;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.balance-info p {
  margin: 0;
  color: #1976d2;
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
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(33, 150, 243, 0.4);
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
