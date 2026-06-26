<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="out-in" @after-enter="onPageEntered">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>

  <Teleport to="body">
    <div
      v-if="authStore.loginPending"
      class="login-pending-overlay"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="login-pending-card">
        <span class="login-pending-spinner"></span>
        <p class="login-pending-text">Đang chờ xử lý...</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const onPageEntered = () => {
  if (authStore.loginPending) {
    authStore.finishLoginRedirect()
  }
}
</script>

<style>
.login-pending-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 253, 208, 0.92);
  backdrop-filter: blur(4px);
  pointer-events: all;
}

.login-pending-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 40px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 16px 48px rgba(61, 32, 0, 0.12);
}

.login-pending-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(212, 133, 10, 0.2);
  border-top-color: #D4850A;
  border-radius: 50%;
  animation: loginPendingSpin 0.8s linear infinite;
}

.login-pending-text {
  margin: 0;
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #6B3A10;
}

@keyframes loginPendingSpin {
  to { transform: rotate(360deg); }
}
</style>
