<template>
  <ion-page class="dark-page">
    <ion-content :scroll-y="false">
      <div class="layout">

        <!-- Status badge -->
        <div class="status-badge" :class="statusClass">
          {{ statusLabel }}
        </div>

        <!-- Rep counter -->
        <div class="rep-counter">
          <span class="rep-number">{{ state?.repDisplay ?? 0 }}</span>
          <span class="rep-label">REPS</span>
        </div>

        <!-- Stats row -->
        <div class="stats-row">
          <div class="stat">
            <span class="stat-value">{{ state?.stats.score ?? 0 }}</span>
            <span class="stat-label">SCORE</span>
          </div>
          <div class="stat-divider" />
          <div class="stat">
            <span class="stat-value">{{ state?.stats.repsOk ?? 0 }}</span>
            <span class="stat-label">GOOD</span>
          </div>
          <div class="stat-divider" />
          <div class="stat">
            <span class="stat-value">{{ state?.stats.repsBad ?? 0 }}</span>
            <span class="stat-label">BAD</span>
          </div>
        </div>

        <!-- Feedback message -->
        <div class="message" :class="{ visible: !!state?.stats.lastMessage }">
          {{ state?.stats.lastMessage || '—' }}
        </div>

        <!-- Controls -->
        <div class="controls">
          <button class="btn-start" @click="start">START</button>
          <button class="btn-stop" @click="stop">STOP</button>
        </div>

        <!-- Footer -->
        <div class="footer-text">663380201-3 นายกิตติพัฒน์ ราชศรีเมือง</div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import type { WorkoutState } from "../core/types";

const state = ref<WorkoutState | null>(null);

const engine = new ArmWorkoutEngine();
const motion = new MotionService();
const tts = new TtsService();

onMounted(() => {
  engine.onChange((s) => (state.value = s));
});

const statusLabel = computed(() => {
  switch (state.value?.status) {
    case "RUNNING": return "ACTIVE";
    case "STOPPED": return "DONE";
    case "CALIBRATING": return "CALIBRATING";
    default: return "READY";
  }
});

const statusClass = computed(() => ({
  active: state.value?.status === "RUNNING",
  done: state.value?.status === "STOPPED",
}));

async function start() {
  await tts.speak("เริ่มกายบริหารแขน ยกขึ้นจนสุดแล้วลดลง");
  engine.start();
  await motion.start((s) => engine.process(s));
}

async function stop() {
  await motion.stop();
  engine.stop();
}
</script>

<style scoped>
.dark-page {
  --ion-background-color: #0a0a0f;
  --ion-text-color: #ffffff;
}

ion-content {
  --background: #0a0a0f;
}

.layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 100dvh;
  padding: 2rem 1.5rem;
  gap: 1.8rem;
  background: #0a0a0f;
  color: #fff;
  font-family: 'SF Pro Display', 'Segoe UI', sans-serif;
}

/* Status badge */
.status-badge {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  padding: 0.35rem 1rem;
  border-radius: 999px;
  border: 1px solid #333;
  color: #666;
  background: #111;
  transition: all 0.3s ease;
}
.status-badge.active {
  color: #4ade80;
  border-color: #4ade8055;
  background: #4ade8012;
  box-shadow: 0 0 16px #4ade8033;
}
.status-badge.done {
  color: #60a5fa;
  border-color: #60a5fa55;
  background: #60a5fa12;
}

/* Rep counter */
.rep-counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
}
.rep-number {
  font-size: 7rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, #fff 0%, #555 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.2s;
}
.rep-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: #444;
  margin-top: 0.25rem;
}

/* Stats row */
.stats-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e2e2;
}
.stat-label {
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: #444;
}
.stat-divider {
  width: 1px;
  height: 2rem;
  background: #222;
}

/* Message */
.message {
  font-size: 0.85rem;
  color: #555;
  letter-spacing: 0.05em;
  min-height: 1.4rem;
  transition: color 0.3s;
}
.message.visible {
  color: #f59e0b;
}

/* Controls */
.controls {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  max-width: 320px;
}
.btn-start,
.btn-stop {
  flex: 1;
  border: none;
  border-radius: 14px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  padding: 1rem 0;
  cursor: pointer;
  transition: transform 0.1s, opacity 0.2s;
}
.btn-start:active,
.btn-stop:active {
  transform: scale(0.96);
}
.btn-start {
  background: #fff;
  color: #0a0a0f;
}
.btn-stop {
  background: #1a1a1a;
  color: #666;
  border: 1px solid #222;
}

/* Footer */
.footer-text {
  font-size: 0.7rem;
  color: #2a2a2a;
  letter-spacing: 0.05em;
  position: absolute;
  bottom: 1.5rem;
}
</style>
