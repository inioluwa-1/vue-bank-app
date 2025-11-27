<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
    <div class="w-full max-w-md">
      <!-- Logo/Brand Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-4 shadow-lg">
          <span class="text-3xl">🏦</span>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
        <p class="text-gray-600">Join our banking platform today</p>
      </div>

      <!-- Register Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Personal Information Section -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-primary border-b border-gray-200 pb-2">Personal Information</h3>
            
            <!-- Full Name -->
            <div>
              <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="Enter your full name"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="Enter your email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              />
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                placeholder="Min 8 characters"
                required
                minlength="8"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              />
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="password_confirmation" class="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                id="password_confirmation"
                v-model="formData.password_confirmation"
                type="password"
                placeholder="Confirm your password"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              />
            </div>

            <!-- Account Type -->
            <div>
              <label for="account_type" class="block text-sm font-semibold text-gray-700 mb-2">
                Account Type *
              </label>
              <select 
                id="account_type" 
                v-model="formData.account_type" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none bg-white"
              >
                <option value="">Select account type</option>
                <option value="savings">💰 Savings Account</option>
                <option value="current">💼 Current Account</option>
                <option value="fixed">🏛️ Fixed Deposit</option>
              </select>
            </div>
          </div>

          <!-- Error Messages -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start space-x-2">
            <span class="text-lg">⚠️</span>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
            <span v-else>Create Account</span>
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-600 text-sm">
            Already have an account? 
            <router-link to="/login" class="text-primary font-semibold hover:text-secondary transition-colors">
              Sign In
            </router-link>
          </p>
        </div>
      </div>

      <!-- Footer Text -->
      <p class="text-center text-gray-500 text-xs mt-8">
        © 2025 Bank App. Secure & Trusted Banking
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  account_type: ''
})

const loading = ref(false)
const errorMessage = ref('')

async function handleRegister() {
  errorMessage.value = ''
  
  // Validate passwords match
  if (formData.value.password !== formData.value.password_confirmation) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  loading.value = true

  try {
    await authStore.register(formData.value)
    
    // Show success message
    alert('Registration successful! Please login.')
    
    // Redirect to login
    router.push('/login')
  } catch (error) {
    console.error('Registration error:', error)
    errorMessage.value = error.message || error.error || 'Registration failed. Please try again.'
    
    // Handle validation errors
    if (error.errors) {
      const errors = Object.values(error.errors).flat()
      errorMessage.value = errors.join(', ')
    }
  } finally {
    loading.value = false
  }
}
</script>


