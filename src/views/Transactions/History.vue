<template>
  <div class="history-container">
    <div class="history-card">
      <h1>Transaction History</h1>

      <!-- Filters -->
      <div class="filters">
        <select v-model="filters.type" @change="fetchHistory">
          <option value="">All Types</option>
          <option value="deposit">Deposits</option>
          <option value="transfer">Transfers</option>
        </select>

        <select v-model="filters.status" @change="fetchHistory">
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div v-if="loading" class="loading">Loading transactions...</div>

      <div v-else-if="transactions.length" class="transactions-table">
        <div class="table-header">
          <div class="col">Date & Time</div>
          <div class="col">Transaction ID</div>
          <div class="col">Type</div>
          <div class="col">Amount</div>
          <div class="col">Status</div>
        </div>

        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          class="table-row"
          :class="transaction.type"
        >
          <div class="col">
            {{ formatDate(transaction.created_at) }}
          </div>
          <div class="col">
            <span class="transaction-id">{{ transaction.transaction_id }}</span>
          </div>
          <div class="col">
            <span class="badge" :class="transaction.type">
              {{ transaction.type }}
            </span>
          </div>
          <div class="col">
            <span class="amount" :class="transaction.type">
              {{ transaction.type === 'deposit' ? '+' : '-' }}₦{{ formatAmount(transaction.amount) }}
            </span>
          </div>
          <div class="col">
            <span class="status" :class="transaction.status">
              {{ transaction.status }}
            </span>
          </div>
        </div>
      </div>

      <div v-else class="no-data">
        <p>No transactions found</p>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.lastPage > 1" class="pagination">
        <button
          @click="changePage(pagination.currentPage - 1)"
          :disabled="pagination.currentPage === 1"
          class="btn-page"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ pagination.currentPage }} of {{ pagination.lastPage }}
        </span>
        <button
          @click="changePage(pagination.currentPage + 1)"
          :disabled="pagination.currentPage === pagination.lastPage"
          class="btn-page"
        >
          Next
        </button>
      </div>

      <router-link :to="`/dashboard/${user?.id}`" class="back-link">
        ← Back to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTransactionStore } from '@/stores/transaction'

const transactionStore = useTransactionStore()

const filters = ref({
  type: '',
  status: '',
  page: 1
})

const loading = computed(() => transactionStore.loading)
const transactions = computed(() => transactionStore.transactions)
const pagination = computed(() => transactionStore.pagination)

onMounted(async () => {
  await fetchHistory()
})

async function fetchHistory() {
  try {
    await transactionStore.fetchTransactions(filters.value)
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
  }
}

async function changePage(page) {
  filters.value.page = page
  await fetchHistory()
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
.history-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24px;
}

.history-card {
  max-width: 1200px;
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

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.filters select {
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.filters select:focus {
  outline: none;
  border-color: #667eea;
}

.loading,
.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.transactions-table {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 16px;
  align-items: center;
}

.table-header {
  background: #f9f9f9;
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.table-row {
  border-top: 1px solid #eee;
  transition: background 0.3s;
}

.table-row:hover {
  background: #f9f9f9;
}

.col {
  overflow: hidden;
  text-overflow: ellipsis;
}

.transaction-id {
  font-family: monospace;
  font-size: 13px;
  color: #666;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.badge.deposit {
  background: #e8f5e9;
  color: #2e7d32;
}

.badge.transfer {
  background: #ffebee;
  color: #c62828;
}

.amount {
  font-weight: 700;
  font-size: 15px;
}

.amount.deposit {
  color: #4caf50;
}

.amount.transfer {
  color: #f44336;
}

.status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status.completed {
  background: #e8f5e9;
  color: #2e7d32;
}

.status.pending {
  background: #fff3e0;
  color: #f57c00;
}

.status.failed {
  background: #ffebee;
  color: #c62828;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.btn-page {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-page:hover:not(:disabled) {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
  font-size: 14px;
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

@media (max-width: 768px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .table-header {
    display: none;
  }

  .col {
    display: flex;
    justify-content: space-between;
  }

  .col::before {
    content: attr(data-label);
    font-weight: 600;
    color: #666;
  }
}
</style>
