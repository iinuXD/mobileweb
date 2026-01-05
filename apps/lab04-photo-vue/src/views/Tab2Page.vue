<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
        <p>Hello Ionic Vue</p>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Photo Gallery</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <!-- CHANGE: Add a click event listener to the floating action button. -->
        <ion-fab-button @click="addNewToGallery()">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
// CHANGE: Add import from `ionicons/icons`
import { camera } from 'ionicons/icons';
// CHANGE: Update import from `@ionic/vue` to include necessary Ionic components
import { IonPage, IonHeader, IonFab, IonFabButton, IonIcon, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
// CHANGE: Remove or comment out the ExploreContainer import
// import ExploreContainer from '@/components/ExploreContainer.vue';

// CHANGE: Add `usePhotoGallery` import
import { usePhotoGallery } from '@/composables/usePhotoGallery';

// CHANGE: Destructure `addNewToGallery` from `usePhotoGallery()
const { addNewToGallery } = usePhotoGallery();
</script>

