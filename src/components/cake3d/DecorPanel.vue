<template>
  <div class="decor-panel chocopine-card p-5 space-y-4">
    <div>
      <h3 class="chocopine-heading-sm" style="margin: 0;">Phụ kiện trang trí</h3>
      <p class="chocopine-desc" style="margin: 4px 0 0; font-size: 12px; text-align: left;">
        Kéo phụ kiện thả lên bánh để gắn trực tiếp, hoặc dùng nút +/- để chọn số lượng.
      </p>
    </div>

    <div v-if="state.loading" class="decor-loading">
      <span class="cake3d-spinner"></span>
      <span>Đang tải phụ kiện...</span>
    </div>

    <div v-else-if="!state.accessories.length" class="decor-empty">
      <iconify-icon icon="ph:package-duotone" class="text-2xl"></iconify-icon>
      <span>Hiện chưa có phụ kiện nào.</span>
    </div>

    <div v-else class="decor-list">
      <div v-for="item in state.accessories" :key="item.id" class="decor-item">
        <div
          class="decor-thumb"
          :class="{ 'decor-thumb--disabled': !canAdd(item) }"
          :draggable="canAdd(item)"
          :title="canAdd(item) ? 'Kéo thả lên bánh để gắn' : 'Đã hết hàng / đạt giới hạn'"
          @dragstart="onDragStart(item, $event)"
          @dragend="onDragEnd"
        >
          <img v-if="item.anhPhuKien" :src="item.anhPhuKien" :alt="item.tenPhuKien" />
          <iconify-icon v-else icon="ph:gift-duotone" class="text-2xl"></iconify-icon>
        </div>

        <div class="decor-info">
          <span class="decor-name">{{ item.tenPhuKien }}</span>
          <span class="decor-price">{{ formatPrice(item.donGia) }}</span>
          <span class="decor-stock" v-if="item.soLuongTon != null">Còn {{ item.soLuongTon }}</span>
        </div>

        <div class="decor-stepper">
          <button
            type="button"
            class="decor-step-btn"
            :disabled="(state.quantities[item.id] || 0) === 0"
            @click="decrease(item)"
          >−</button>
          <span class="decor-qty">{{ state.quantities[item.id] || 0 }}</span>
          <button
            type="button"
            class="decor-step-btn"
            :disabled="!canAdd(item)"
            @click="increase(item)"
          >+</button>
        </div>
      </div>
    </div>

    <div class="decor-total" v-if="total > 0">
      <span>Tổng phụ kiện</span>
      <span>{{ formatPrice(total) }}</span>
    </div>

    <p v-if="state.usingFallback" class="decor-fallback-note">
      * Chưa kết nối được máy chủ, đang hiển thị dữ liệu mẫu.
    </p>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useDecorAccessories } from '@/composables/useDecorAccessories'
import { formatPrice } from '@/utils/format'

const emit = defineEmits(['change'])

const { state, ensureLoaded, canAdd, addOne, removeOne, selectedItems, total } = useDecorAccessories()

onMounted(ensureLoaded)

// Phát sự kiện 'change' ra ngoài (Design.vue) mỗi khi tổng tiền/số lượng thay đổi,
// bất kể thay đổi đến từ nút +/- ở đây hay từ kéo-thả/xóa trên canvas (T051/T052)
watch(total, (value) => emit('change', { total: value, items: selectedItems.value }), { immediate: true })

function increase(item) {
  addOne(item)
}

function decrease(item) {
  removeOne(item.id)
}

// T051 - bắt đầu kéo 1 phụ kiện từ sidebar để thả lên bánh
function onDragStart(item, evt) {
  if (!canAdd(item)) {
    evt.preventDefault()
    return
  }
  state.draggingItem = item
  evt.dataTransfer.effectAllowed = 'copy'
  // Một số trình duyệt (Firefox) yêu cầu phải setData thì mới cho phép kéo
  evt.dataTransfer.setData('text/plain', String(item.id))
}

function onDragEnd() {
  // Nếu thả ngoài vùng bánh (không trúng canvas) thì dọn trạng thái kéo
  state.draggingItem = null
}


</script>

<style scoped>
.decor-loading,
.decor-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-muted);
  padding: 10px 0;
}

.cake3d-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: decor-spin 0.8s linear infinite;
}

@keyframes decor-spin {
  to { transform: rotate(360deg); }
}

.decor-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 2px;
}

.decor-item {
  display: grid;
  grid-template-columns: 44px 1fr auto;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px dashed var(--color-border);
}

.decor-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.decor-thumb {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--cream-white-soft, #fdf6ec);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: var(--color-primary);
  flex-shrink: 0;
  cursor: grab;
  border: 1px dashed transparent;
  transition: border-color 0.15s ease;
}

.decor-thumb:hover {
  border-color: var(--color-primary);
}

.decor-thumb:active {
  cursor: grabbing;
}

.decor-thumb--disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.decor-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.decor-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.decor-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.decor-price {
  font-size: 12px;
  color: var(--color-primary);
  font-weight: 600;
}

.decor-stock {
  font-size: 11px;
  color: var(--color-text-muted);
}

.decor-stepper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.decor-step-btn {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-card);
  color: var(--color-text);
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.15s ease;
}

.decor-step-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.decor-step-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.decor-qty {
  min-width: 18px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
}

.decor-total {
  display: flex;
  justify-content: space-between;
  border-top: 1px dashed var(--color-border);
  padding-top: 12px;
  font-size: 14px;
  font-weight: 800;
  color: var(--color-primary);
}

.decor-fallback-note {
  margin: 0;
  font-size: 11px;
  color: var(--color-warning);
}
</style>