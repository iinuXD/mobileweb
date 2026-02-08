<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>รายการรายรับ–รายจ่าย</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/add-expense">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">รายการรายรับ–รายจ่าย</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Summary Section -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>สรุป</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="summary-grid">
            <div class="summary-item income">
              <div class="label">รายรับ</div>
              <div class="amount">{{ formatCurrency(totalIncome) }}</div>
            </div>
            <div class="summary-item expense">
              <div class="label">รายจ่าย</div>
              <div class="amount">{{ formatCurrency(totalExpense) }}</div>
            </div>
            <div class="summary-item balance">
              <div class="label">คงเหลือ</div>
              <div class="amount">{{ formatCurrency(totalIncome - totalExpense) }}</div>
            </div>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Expenses List -->
      <div v-if="expenses.length > 0" class="ion-padding">
        <h2>รายการทั้งหมด</h2>
        <ion-list>
          <ion-item
            v-for="expense in expenses"
            :key="expense.id"
            class="expense-item"
            button
            :router-link="`/edit-expense/${expense.id}`"
          >
            <ion-label>
              <h2>{{ expense.title }}</h2>
              <p class="category-badge" :class="expense.type">
                {{ expense.type === 'income' ? 'รายรับ' : 'รายจ่าย' }} • {{ expense.category }}
              </p>
              <p class="date">{{ formatDate(expense.createdAt) }}</p>
            </ion-label>
            <div slot="end" class="amount-display" :class="expense.type">
              {{ expense.type === 'income' ? '+' : '-' }}{{ formatCurrency(expense.amount) }}
            </div>
          </ion-item>
        </ion-list>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <ion-icon :icon="documentText" class="empty-icon"></ion-icon>
        <p>ไม่มีรายการ</p>
        <p class="text-muted">คลิกปุ่ม + เพื่อเพิ่มรายการใหม่</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/vue';
import { add, documentText } from 'ionicons/icons';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import ExploreContainer from '@/components/ExploreContainer.vue';

interface Expense {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note: string;
  createdAt: Timestamp;
}

const expenses = ref<Expense[]>([]);
const totalIncome = ref(0);
const totalExpense = ref(0);
let unsubscribe: (() => void) | null = null;

onMounted(() => {
  // Set up real-time listener
  const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));

  unsubscribe = onSnapshot(q, (snapshot) => {
    expenses.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Expense[];

    // Calculate totals
    calculateTotals();
  });
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

const calculateTotals = () => {
  totalIncome.value = 0;
  totalExpense.value = 0;

  expenses.value.forEach((expense) => {
    if (expense.type === 'income') {
      totalIncome.value += expense.amount;
    } else {
      totalExpense.value += expense.amount;
    }
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (timestamp: any) => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
</script>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}

.summary-item {
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  background: #f5f5f5;
}

.summary-item.income {
  background: #e8f5e9;
}

.summary-item.expense {
  background: #ffebee;
}

.summary-item.balance {
  background: #e3f2fd;
}

.summary-item .label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.summary-item .amount {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.expense-item {
  margin-bottom: 8px;
}

.category-badge {
  font-size: 12px;
  color: #999;
  margin-top: 4px !important;
}

.category-badge.income {
  color: #4caf50;
}

.category-badge.expense {
  color: #f44336;
}

.date {
  font-size: 11px;
  color: #bbb;
  margin-top: 4px !important;
}

.amount-display {
  font-weight: bold;
  font-size: 14px;
  min-width: 80px;
  text-align: right;
}

.amount-display.income {
  color: #4caf50;
}

.amount-display.expense {
  color: #f44336;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  color: #ddd;
  margin-bottom: 16px;
}

.text-muted {
  font-size: 12px;
  color: #bbb;
}
</style>
