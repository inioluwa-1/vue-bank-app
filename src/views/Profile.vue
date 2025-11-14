<template>
  <div class="profile-container">
    <div class="profile-card">
      <h1>Profile</h1>
      
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else>
        <!-- Profile Information -->
        <div class="profile-section">
          <h3>Personal Information</h3>
          
          <div class="form-group">
            <label>Name</label>
            <input v-model="profileData.name" type="text" />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input v-model="profileData.email" type="email" />
          </div>

          <div class="form-group">
            <label>Account Number</label>
            <input :value="user?.account_number" disabled />
          </div>

          <div class="form-group">
            <label>Account Type</label>
            <input :value="user?.account_type" disabled />
          </div>

          <button @click="updateProfile" class="btn btn-primary" :disabled="updating">
            {{ updating ? 'Updating...' : 'Update Profile' }}
          </button>
        </div>

        <!-- Transaction PIN Section -->
        <div class="profile-section">
          <h3>Transaction PIN</h3>
          
          <div v-if="user?.has_transaction_pin" class="form-group">
            <label>Current PIN</label>
            <input
              v-model="pinData.current_pin"
              type="password"
              maxlength="4"
              placeholder="Enter current 4-digit PIN"
            />
          </div>

          <div class="form-group">
            <label>{{ user?.has_transaction_pin ? 'New PIN' : 'New PIN' }}</label>
            <input
              v-model="pinData.transaction_pin"
              type="password"
              maxlength="4"
              placeholder="Enter 4-digit PIN"
            />
          </div>

          <div class="form-group">
            <label>Confirm PIN</label>
            <input
              v-model="pinData.transaction_pin_confirmation"
              type="password"
              maxlength="4"
              placeholder="Confirm 4-digit PIN"
            />
          </div>

          <button @click="updatePin" class="btn btn-secondary" :disabled="updatingPin">
            {{ updatingPin ? 'Updating...' : (user?.has_transaction_pin ? 'Update PIN' : 'Create PIN') }}
          </button>
        </div>

        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>

      <router-link :to="`/dashboard/${user?.id}`" class="back-link">
        ← Back to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import userService from '@/services/user'

const authStore = useAuthStore()

const user = computed(() => authStore.user)

const profileData = ref({
  name: '',
  email: ''
})

const pinData = ref({
  current_pin: '',
  transaction_pin: '',
  transaction_pin_confirmation: ''
})

const loading = ref(true)
const updating = ref(false)
const updatingPin = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

onMounted(async () => {
  await loadProfile()
})

async function loadProfile() {
  loading.value = true
  try {
    const response = await userService.getProfile()
    profileData.value = {
      name: response.user.name,
      email: response.user.email
    }
  } catch (error) {
    console.error('Failed to load profile:', error)
  } finally {
    loading.value = false
  }
}

async function updateProfile() {
  updating.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await userService.updateProfile(profileData.value)
    authStore.updateUser(response.user)
    successMessage.value = 'Profile updated successfully!'
  } catch (error) {
    errorMessage.value = error.message || 'Failed to update profile'
  } finally {
    updating.value = false
  }
}

async function updatePin() {
  updatingPin.value = true
  successMessage.value = ''
  errorMessage.value = ''

  // Validate PIN is 4 digits
  if (!pinData.value.transaction_pin || pinData.value.transaction_pin.length !== 4) {
    errorMessage.value = 'Transaction PIN must be exactly 4 digits'
    updatingPin.value = false
    return
  }

  // Validate PIN confirmation matches
  if (pinData.value.transaction_pin !== pinData.value.transaction_pin_confirmation) {
    errorMessage.value = 'The transaction pin confirmation field is required.'
    updatingPin.value = false
    return
  }

  try {
    if (user.value?.has_transaction_pin) {
      // Updating existing PIN
      if (!pinData.value.current_pin) {
        errorMessage.value = 'Current PIN is required'
        updatingPin.value = false
        return
      }
      await userService.updateTransactionPin(pinData.value)
      successMessage.value = 'Transaction PIN updated successfully!'
    } else {
      // Creating new PIN
      await userService.createTransactionPin({
        transaction_pin: pinData.value.transaction_pin,
        transaction_pin_confirmation: pinData.value.transaction_pin_confirmation
      })
      successMessage.value = 'Transaction PIN created successfully!'
      authStore.updateUser({ ...user.value, has_transaction_pin: true })
    }
    
    // Reset form
    pinData.value = {
      current_pin: '',
      transaction_pin: '',
      transaction_pin_confirmation: ''
    }
  } catch (error) {
    errorMessage.value = error.error || error.message || 'Failed to update PIN'
  } finally {
    updatingPin.value = false
  }
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24px;
}

.profile-card {
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

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.profile-section {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #eee;
}

.profile-section:last-of-type {
  border-bottom: none;
}

.profile-section h3 {
  margin: 0 0 20px 0;
  color: #667eea;
  font-size: 18px;
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

input:disabled {
  background: #f5f5f5;
  color: #999;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

.btn {
  padding: 12px 24px;
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
  background: #4caf50;
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

.success-message {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
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
