<template>
  <div class="template-gallery chocopine-card p-6 space-y-4">
    <div>
      <h3 class="chocopine-heading-sm" style="margin: 0;">Mẫu bánh 3D có sẵn</h3>
      <p class="chocopine-desc" style="margin: 4px 0 0; font-size: 12px; text-align: left;">
        Chọn nhanh 1 mẫu để bắt đầu, sau đó bạn vẫn có thể sửa/thêm/xóa topping thoải mái — giá sẽ tự cập nhật.
      </p>
    </div>

    <div class="template-grid">
      <div
        v-for="mau in templates"
        :key="mau.id"
        class="template-card"
        :class="{ 'template-card--active': activeId === mau.id }"
      >
        <div class="template-thumb">
          <iconify-icon :icon="mau.icon" class="text-3xl"></iconify-icon>
        </div>
        <div class="template-info">
          <h4>{{ mau.ten }}</h4>
          <p>{{ mau.moTa }}</p>
          <span class="template-price">Từ {{ formatPrice(mau.giaTuKhoang) }}</span>
        </div>
        <button type="button" class="template-select-btn" :disabled="loadingId === mau.id" @click="onSelect(mau)">
          <span v-if="loadingId === mau.id" class="cake3d-spinner-sm"></span>
          <span v-else>{{ activeId === mau.id ? 'Đang dùng mẫu này' : 'Chọn mẫu này' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { cakeTemplates } from '@/data/cakeTemplates'
import { formatPrice } from '@/utils/format'

const props = defineProps({
  loadingId: { type: [String, Number], default: null },
})

const emit = defineEmits(['select'])

const templates = cakeTemplates
const activeId = ref(null)

async function onSelect(mau) {
  activeId.value = mau.id
  emit('select', mau)
}
</script>

<style scoped>
.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
}

.template-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-card);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.template-card--active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent);
}

.template-thumb {
  width: 100%;
  height: 88px;
  border-radius: 10px;
  background: var(--cream-white-soft, #fdf6ec);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.template-info h4 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
}

.template-info p {
  margin: 0 0 6px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--color-text-muted);
}

.template-price {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary);
}

.template-select-btn {
  margin-top: auto;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.template-select-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: #fff;
}

.template-select-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.cake3d-spinner-sm {
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: gallery-spin 0.8s linear infinite;
}

@keyframes gallery-spin {
  to { transform: rotate(360deg); }
}
</style>
