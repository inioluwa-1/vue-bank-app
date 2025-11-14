<template>
  <div class="beneficiaries-container">
    <div class="beneficiaries-card">
      <div class="header">
        <h1>Beneficiaries</h1>
        <button @click="showAddModal = true" class="btn btn-primary">
          + Add Beneficiary
        </button>
      </div>

      <div v-if="loading" class="loading">Loading beneficiaries...</div>

      <div v-else-if="beneficiaries.length" class="beneficiaries-grid">
        <div
          v-for="beneficiary in beneficiaries"
          :key="beneficiary.id"
          class="beneficiary-card"
        >
          <h3>{{ beneficiary.beneficiary_name }}</h3>
          <p class="account-number">{{ beneficiary.account_number }}</p>
          <p class="bank-name">{{ beneficiary.bank_name }}</p>
          <div class="actions">
            <button @click="editBeneficiary(beneficiary)" class="btn-edit">Edit</button>
            <button @click="deleteBeneficiaryItem(beneficiary.id)" class="btn-delete">Delete</button>
          </div>
        </div>
      </div>

      <div v-else class="no-data">
        <p>No beneficiaries yet. Add one to get started!</p>
      </div>

      <router-link :to="`/dashboard/${user?.id}`" class="back-link">
        ← Back to Dashboard
      </router-link>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ editMode ? 'Edit' : 'Add' }} Beneficiary</h2>
        
        <form @submit.prevent="saveBeneficiary">
          <div class="form-group">
            <label>Beneficiary Name *</label>
            <input
              v-model="formData.beneficiary_name"
              type="text"
              placeholder="Enter name"
              required
            />
          </div>

          <div class="form-group">
            <label>Account Number *</label>
            <input
              v-model="formData.account_number"
              type="text"
              maxlength="10"
              placeholder="Enter 10-digit account number"
              required
            />
          </div>

          <div class="form-group">
            <label>Bank Name *</label>
            <input
              v-model="formData.bank_name"
              type="text"
              placeholder="Enter bank name"
              required
            />
          </div>

          <div class="form-group">
            <label>Amount</label>
            <input
              v-model="formData.amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="Default amount (optional)"
            />
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBeneficiaryStore } from '@/stores/beneficiary'

const authStore = useAuthStore()
const beneficiaryStore = useBeneficiaryStore()

const user = computed(() => authStore.user)

const showAddModal = ref(false)
const editMode = ref(false)
const currentBeneficiaryId = ref(null)
const saving = ref(false)
const errorMessage = ref('')

const formData = ref({
  beneficiary_name: '',
  account_number: '',
  bank_name: '',
  amount: 0
})

const loading = computed(() => beneficiaryStore.loading)
const beneficiaries = computed(() => beneficiaryStore.beneficiaries)

onMounted(async () => {
  await beneficiaryStore.fetchBeneficiaries()
})

function editBeneficiary(beneficiary) {
  editMode.value = true
  currentBeneficiaryId.value = beneficiary.id
  formData.value = {
    beneficiary_name: beneficiary.beneficiary_name,
    account_number: beneficiary.account_number,
    bank_name: beneficiary.bank_name,
    amount: beneficiary.amount || 0
  }
  showAddModal.value = true
}

async function saveBeneficiary() {
  saving.value = true
  errorMessage.value = ''

  // Ensure amount is a number
  const dataToSend = {
    ...formData.value,
    amount: parseFloat(formData.value.amount) || 0
  }

  try {
    if (editMode.value) {
      await beneficiaryStore.updateBeneficiary(currentBeneficiaryId.value, dataToSend)
    } else {
      await beneficiaryStore.addBeneficiary(dataToSend)
    }
    closeModal()
  } catch (error) {
    errorMessage.value = error.error || error.message || 'Failed to save beneficiary'
  } finally {
    saving.value = false
  }
}

async function deleteBeneficiaryItem(id) {
  if (!confirm('Are you sure you want to delete this beneficiary?')) {
    return
  }

  try {
    await beneficiaryStore.deleteBeneficiary(id)
  } catch (error) {
    alert('Failed to delete beneficiary')
  }
}

function closeModal() {
  showAddModal.value = false
  editMode.value = false
  currentBeneficiaryId.value = null
  formData.value = {
    beneficiary_name: '',
    account_number: '',
    bank_name: '',
    amount: 0
  }
  errorMessage.value = ''
}
</script>

<style scoped>
.beneficiaries-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24px;
}

.beneficiaries-card {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h1 {
  margin: 0;
  color: #333;
}

.loading,
.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.beneficiaries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.beneficiary-card {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.beneficiary-card h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
}

.account-number {
  margin: 4px 0;
  color: #666;
  font-size: 14px;
  font-family: monospace;
}

.bank-name {
  margin: 4px 0 16px 0;
  color: #999;
  font-size: 13px;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-edit {
  background: #2196f3;
  color: white;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.btn-edit:hover,
.btn-delete:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-secondary {
  background: #999;
  color: white;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  margin: 0 0 24px 0;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
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

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.modal-actions button {
  flex: 1;
}
</style>
