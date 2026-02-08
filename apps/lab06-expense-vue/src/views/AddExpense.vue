<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tab1"></ion-back-button>
        </ion-buttons>
        <ion-title>เพิ่มรายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-input
          label="ชื่อรายการ"
          label-placement="floating"
          placeholder="กรอกชื่อรายการ"
          v-model="title"
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-input
          label="จำนวนเงิน"
          label-placement="floating"
          type="number"
          placeholder="0"
          v-model="amount"
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-label>ประเภท</ion-label>
        <ion-select v-model="type" interface="popover">
          <ion-select-option value="income">รายรับ</ion-select-option>
          <ion-select-option value="expense">รายจ่าย</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-input
          label="หมวดหมู่"
          label-placement="floating"
          placeholder="เช่น อาหาร, ค่าน้ำ, เงินเดือน"
          v-model="category"
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-textarea
          label="หมายเหตุ"
          label-placement="floating"
          placeholder="เพิ่มเติม (ไม่บังคับ)"
          :rows="4"
          v-model="note"
        ></ion-textarea>
      </ion-item>

      <ion-button
        expand="block"
        @click="saveExpense"
        class="ion-margin-top"
      >
        บันทึกข้อมูล
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonItem,
  IonLabel,
  IonButtons,
  IonBackButton,
  toastController,
} from "@ionic/vue";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { useRouter } from "vue-router";
import { signInAnonymously } from "firebase/auth";

const router = useRouter();

const title = ref("");
const amount = ref<number | null>(null);
const type = ref("expense");
const category = ref("");
const note = ref("");

// Sign in anonymously on component mount
onMounted(async () => {
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
  } catch (error) {
    console.error("Anonymous auth failed:", error);
  }
});

const saveExpense = async () => {
  // Validate inputs
  if (!title.value.trim()) {
    showToast("กรุณากรอกชื่อรายการ");
    return;
  }

  if (!amount.value || amount.value <= 0) {
    showToast("กรุณากรอกจำนวนเงิน");
    return;
  }

  if (!category.value.trim()) {
    showToast("กรุณากรอกหมวดหมู่");
    return;
  }

  try {
    await addDoc(collection(db, "expenses"), {
      title: title.value,
      amount: Number(amount.value),
      type: type.value,
      category: category.value,
      note: note.value,
      createdAt: new Date(),
    });

    showToast("บันทึกข้อมูลสำเร็จ");
    router.push("/tabs/tab1");
  } catch (error: any) {
    console.error("Error saving expense:", error);
    const errorMessage = error?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล";
    showToast(errorMessage);
  }
};

const showToast = async (message: string) => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    position: "bottom",
  });
  await toast.present();
};
</script>

<style scoped>
ion-item {
  margin-bottom: 12px;
}
</style>
