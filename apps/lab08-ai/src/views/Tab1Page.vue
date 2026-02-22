<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Lab08: Gemini Vision โดย กิตติพัฒน์ ราชศรีเมือง 663380201-3</ion-title>
      </ion-toolbar>
    </ion-header>


    <ion-content class="ion-padding">
      <input ref="fileEl" type="file" accept="image/*" hidden @change="onFileChange" />


      <ion-button expand="block" @click="fileEl?.click()">เลือกไฟล์ภาพ</ion-button>
      <ion-button expand="block" @click="onTakePhoto">ถ่ายภาพ (Camera)</ion-button>


      <div v-if="error" style="color: red; margin: 10px 0; padding: 10px; background: #ffe0e0; border-radius: 4px;">
        <strong>Error:</strong> {{ error }}
      </div>


      <div v-if="previewUrl" class="image-container">
        <ion-img :src="previewUrl" />
      </div>


      <ion-button expand="block" :disabled="!img || loading" @click="onAnalyze">
        วิเคราะห์ภาพ
      </ion-button>


      <ion-spinner v-if="loading" />
      <pre v-if="result">{{ JSON.stringify(result, null, 2) }}</pre>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import { ref } from "vue";
import {
  IonButton, IonContent, IonHeader, IonImg, IonPage, IonSpinner, IonTitle, IonToolbar
} from "@ionic/vue";
import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";
import type { Base64Image } from "../core/ai.interface"; ;
import type { ImageAnalysisResult } from "../core/ai.interface";


const fileEl = ref<HTMLInputElement | null>(null);
const img = ref<Base64Image | null>(null);
const previewUrl = ref("");
const result = ref<ImageAnalysisResult | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);


async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  img.value = await PhotoService.fromFile(file);
  previewUrl.value = URL.createObjectURL(file);
  result.value = null;
}


async function onTakePhoto() {
  loading.value = true;
  error.value = null;
  try {
    const b64 = await PhotoService.fromCamera();
    img.value = b64;
    previewUrl.value = `data:${b64.mimeType};base64,${b64.base64}`;
    result.value = null;
  } catch (err) {
    console.error("Camera error:", err);
    error.value = err instanceof Error ? err.message : "Failed to take photo";
  } finally {
    loading.value = false;
  }
}


async function onAnalyze() {
  if (!img.value) return;
  loading.value = true;
  try {
    result.value = await GeminiVisionService.analyze(img.value);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.image-container {
  width: 100%;
  max-width: 100%;
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container ion-img {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 8px;
}
</style>
