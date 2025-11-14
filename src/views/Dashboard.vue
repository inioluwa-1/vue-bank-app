<template>
  <div class="dashboard">
    <nav class="navbar">
      <div class="navbar-brand">
        <h2>🏦 Bank App</h2>
      </div>
      <div class="navbar-user">
        <span>{{ user?.name || 'User' }}</span>
        <button @click="handleLogout" class="btn-logout">Logout</button>
      </div>
    </nav>

    <div class="dashboard-content">
      <div class="sidebar">
        <router-link :to="`/dashboard/${route.params.userId}`" class="nav-link active">
          <span>📊</span> Dashboard
        </router-link>
        <router-link to="/transfer" class="nav-link">
          <span>💸</span> Transfer
        </router-link>
        <router-link to="/deposit" class="nav-link">
          <span>💰</span> Deposit
        </router-link>
        <router-link to="/beneficiaries" class="nav-link">
          <span>👥</span> Beneficiaries
        </router-link>
        <router-link to="/transactions" class="nav-link">
          <span>📝</span> Transactions
        </router-link>
        <router-link to="/profile" class="nav-link">
          <span>⚙️</span> Profile
        </router-link>
      </div>

      <div class="main-content">
        <div v-if="loading" class="loading">Loading...</div>

        <div v-else-if="dashboardData">
          <!-- Account Overview -->
          <div class="account-overview">
            <div class="account-card balance-card">
              <h3>Account Balance</h3>
              <p class="balance">₦{{ formatAmount(dashboardData.user?.balance) }}</p>
              <p class="account-number">{{ dashboardData.user?.account_number }}</p>
            </div>

            <div class="account-card">
              <h3>Account Type</h3>
              <p class="value">{{ dashboardData.user?.account_type }}</p>
            </div>

            <div class="account-card">
              <h3>Total Transactions</h3>
              <p class="value">{{ dashboardData.statistics?.total_transactions || 0 }}</p>
            </div>

            <div class="account-card">
              <h3>Beneficiaries</h3>
              <p class="value">{{ dashboardData.statistics?.beneficiaries_count || 0 }}</p>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="quick-actions">
            <h3>Quick Actions</h3>
            <div class="action-buttons">
              <router-link to="/deposit" class="action-btn deposit">
                💰 Deposit
              </router-link>
              <router-link to="/transfer" class="action-btn transfer">
                💸 Transfer
              </router-link>
            </div>
          </div>

          <!-- Recent Transactions -->
          <div class="recent-transactions">
            <h3>Recent Transactions</h3>
            <div v-if="dashboardData.recent_transactions?.length" class="transactions-list">
              <div
                v-for="transaction in dashboardData.recent_transactions"
                :key="transaction.id"
                class="transaction-item"
                :class="transaction.type"
              >
                <div class="transaction-icon">
                  {{ transaction.type === 'deposit' ? '💰' : '💸' }}
                </div>
                <div class="transaction-details">
                  <p class="transaction-type">{{ transaction.type }}</p>
                  <p class="transaction-date">{{ formatDate(transaction.created_at) }}</p>
                </div>
                <div class="transaction-amount" :class="transaction.type">
                  {{ transaction.type === 'deposit' ? '+' : '-' }}₦{{ formatAmount(transaction.amount) }}
                </div>
              </div>
            </div>
            <p v-else class="no-data">No recent transactions</p>
          </div>
        </div>

        <div v-else class="error">
          Failed to load dashboard data
        </div>
      </div>
    </div>
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
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    router.push('/login')
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

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f5f5;
}

.navbar {
  background: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand h2 {
  margin: 0;
  color: #667eea;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 16px;
  color: green;
}

.btn-logout {
  padding: 8px 16px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-logout:hover {
  background: #d32f2f;
}

.dashboard-content {
  display: flex;
  min-height: calc(100vh - 64px);
}

.sidebar {
  width: 250px;
  background: white;
  padding: 24px 0;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: #666;
  text-decoration: none;
  transition: all 0.3s;
}

.nav-link:hover,
.nav-link.active {
  background: #f0f0f0;
  color: #667eea;
  border-left: 3px solid #667eea;
}

.main-content {
  flex: 1;
  padding: 24px;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.account-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.account-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.account-card h3 {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.balance {
  font-size: 32px;
  font-weight: 700;
  color: #667eea;
  margin: 0;
}

.account-number {
  font-size: 14px;
  color: #999;
  margin: 8px 0 0 0;
}

.value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
  text-transform: capitalize;
}

.quick-actions {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quick-actions h3 {
  margin: 0 0 16px 0;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.action-btn {
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s;
}

.action-btn.deposit {
  background: #4caf50;
  color: white;
}

.action-btn.transfer {
  background: #2196f3;
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.recent-transactions {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recent-transactions h3 {
  margin: 0 0 16px 0;
  color: #333;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 3px solid #ccc;
}

.transaction-item.deposit {
  border-left-color: #4caf50;
}

.transaction-item.transfer {
  border-left-color: #f44336;
}

.transaction-icon {
  font-size: 24px;
}

.transaction-details {
  flex: 1;
}

.transaction-type {
  margin: 0 0 4px 0;
  font-weight: 600;
  color: #333;
  text-transform: capitalize;
}

.transaction-date {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.transaction-amount {
  font-size: 18px;
  font-weight: 700;
}

.transaction-amount.deposit {
  color: #4caf50;
}

.transaction-amount.transfer {
  color: #f44336;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 20px;
}
</style>
