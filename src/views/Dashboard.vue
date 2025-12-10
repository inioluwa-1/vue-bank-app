<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navbar -->
    <nav class="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <span class="text-3xl">🏦</span>
            <h2 class="text-xl lg:text-2xl font-bold text-primary">Bank App</h2>
          </div>
          <div class="flex items-center space-x-4">
            <button 
              @click="handleLogout" 
              :disabled="loggingOut"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg v-if="loggingOut" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loggingOut ? 'Logging out...' : 'Logout' }}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="flex max-w-7xl mx-auto">
      <!-- Sidebar for Desktop -->
      <aside class="hidden lg:block w-64 bg-white shadow-lg min-h-screen border-r border-gray-200">
        <nav class="p-4 space-y-2">
          <router-link 
            :to="`/dashboard/${route.params.userId}`" 
            class="flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all bg-primary text-white"
          >
            <span class="text-xl">📊</span>
            <span>Dashboard</span>
          </router-link>
          <router-link 
            to="/transfer" 
            class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-all"
          >
            <span class="text-xl">💸</span>
            <span>Transfer</span>
          </router-link>
          <router-link 
            to="/deposit" 
            class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-all"
          >
            <span class="text-xl">💰</span>
            <span>Deposit</span>
          </router-link>
          <router-link 
            to="/beneficiaries" 
            class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-all"
          >
            <span class="text-xl">👥</span>
            <span>Beneficiaries</span>
          </router-link>
          <router-link 
            to="/transactions" 
            class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-all"
          >
            <span class="text-xl">📝</span>
            <span>Transactions</span>
          </router-link>
          <router-link 
            to="/profile" 
            class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-all"
          >
            <span class="text-xl">⚙️</span>
            <span>Profile</span>
          </router-link>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="text-gray-500 text-lg">Loading...</div>
        </div>

        <div v-else-if="dashboardData" class="space-y-6">
          <!-- Account Overview Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div class="bg-gradient-to-br from-primary to-secondary rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
              <p class="text-lg font-semibold mb-3">Hi, {{ dashboardData.user?.name || 'User' }} 👋</p>
              <h3 class="text-sm font-medium opacity-90 mb-2">Account Balance</h3>
              <p class="text-2xl lg:text-3xl font-bold mb-2 break-words">₦{{ formatAmount(dashboardData.user?.balance) }}</p>
              <p class="text-xs opacity-75 truncate">{{ dashboardData.user?.account_number }}</p>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <h3 class="text-sm font-medium text-gray-600 mb-2">Account Type</h3>
              <p class="text-2xl lg:text-3xl font-bold text-gray-900 capitalize">{{ dashboardData.user?.account_type }}</p>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <h3 class="text-sm font-medium text-gray-600 mb-2">Total Transactions</h3>
              <p class="text-2xl lg:text-3xl font-bold text-gray-900">{{ dashboardData.statistics?.total_transactions || 0 }}</p>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <h3 class="text-sm font-medium text-gray-600 mb-2">Beneficiaries</h3>
              <p class="text-2xl lg:text-3xl font-bold text-gray-900">{{ dashboardData.statistics?.beneficiaries_count || 0 }}</p>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <router-link 
                to="/deposit" 
                class="flex items-center justify-center space-x-2 px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <span class="text-2xl">💰</span>
                <span>Deposit Funds</span>
              </router-link>
              <router-link 
                to="/transfer" 
                class="flex items-center justify-center space-x-2 px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <span class="text-2xl">💸</span>
                <span>Transfer Money</span>
              </router-link>
            </div>
          </div>

          <!-- Recent Transactions -->
          <div class="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            <div v-if="dashboardData.recent_transactions?.length" class="space-y-3">
              <div
                v-for="transaction in dashboardData.recent_transactions"
                :key="transaction.id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4"
                :class="transaction.type === 'deposit' ? 'border-green-500' : 'border-red-500'"
              >
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                       :class="transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'">
                    {{ transaction.type === 'deposit' ? '💰' : '💸' }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 capitalize">{{ transaction.type }}</p>
                    <p class="text-sm text-gray-500">{{ formatDate(transaction.created_at) }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-bold text-lg lg:text-xl"
                     :class="transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'">
                    {{ transaction.type === 'deposit' ? '+' : '-' }}₦{{ formatAmount(transaction.amount) }}
                  </p>
                </div>
              </div>
            </div>
            <p v-else class="text-center text-gray-500 py-8">No recent transactions</p>
          </div>
        </div>

        <div v-else class="flex items-center justify-center h-64">
          <div class="text-red-500 text-lg">Failed to load dashboard data</div>
        </div>
      </main>
    </div>

    <!-- Mobile Bottom Navigation -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div class="grid grid-cols-5 h-16">
        <router-link 
          :to="`/dashboard/${route.params.userId}`"
          class="flex flex-col items-center justify-center text-primary font-medium"
        >
          <span class="text-xl">📊</span>
          <span class="text-xs mt-1">Dashboard</span>
        </router-link>
        <router-link 
          to="/transfer"
          class="flex flex-col items-center justify-center text-gray-600 hover:text-primary"
        >
          <span class="text-xl">💸</span>
          <span class="text-xs mt-1">Transfer</span>
        </router-link>
        <router-link 
          to="/deposit"
          class="flex flex-col items-center justify-center text-gray-600 hover:text-primary"
        >
          <span class="text-xl">💰</span>
          <span class="text-xs mt-1">Deposit</span>
        </router-link>
        <router-link 
          to="/beneficiaries"
          class="flex flex-col items-center justify-center text-gray-600 hover:text-primary"
        >
          <span class="text-xl">👥</span>
          <span class="text-xs mt-1">Beneficiaries</span>
        </router-link>
        <router-link 
          to="/profile"
          class="flex flex-col items-center justify-center text-gray-600 hover:text-primary"
        >
          <span class="text-xl">⚙️</span>
          <span class="text-xs mt-1">Profile</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import userService from '@/services/user'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const dashboardData = ref(null)
const loading = ref(true)
const loggingOut = ref(false)

const user = computed(() => authStore.user)

onMounted(async () => {
  await loadDashboard()
})

async function loadDashboard() {
  loading.value = true
  try {
    const userId = route.params.userId
    const response = await userService.getDashboard(userId)
    dashboardData.value = response
  } catch (error) {
    console.error('Failed to load dashboard:', error)
  } finally {
    loading.value = false
  }
}

async function handleLogout() {
  loggingOut.value = true
  try {
    await authStore.logout()
    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    router.push('/login')
  } finally {
    loggingOut.value = false
  }
}

function formatAmount(amount) {
  if (!amount) return '0.00'
  return parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>


