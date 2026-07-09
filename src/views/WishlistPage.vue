<template>
  <div class="chocopine-page animate-fade-in">
    <div class="chocopine-inner space-y-8">
      <section class="chocopine-card p-6 md:p-8 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="chocopine-title" style="text-align:left;margin:0;font-size:24px;">Thiết Kế Đã Lưu</h1>
          <p class="chocopine-desc" style="text-align:left;margin:4px 0 0;font-size:13px;">
            Xem lại những chiếc bánh 3D bạn đã lưu và đặt lại bất cứ lúc nào
          </p>
        </div>
        <RouterLink to="/shop/design" class="chocopine-btn-secondary px-5 py-2.5">
          + Thiết kế bánh mới
        </RouterLink>
      </section>

      <!-- Loading -->
      <div v-if="loading" class="py-20 text-center text-sm text-gray-400">Đang tải danh sách...</div>

      <!-- Rỗng -->
      <div v-else-if="danhSach.length === 0" class="chocopine-card p-12 text-center">
        <iconify-icon icon="ph:heart-duotone" class="text-4xl" style="color:#C4A882"></iconify-icon>
        <p class="chocopine-desc" style="margin-top:8px;">Bạn chưa lưu thiết kế nào cả.</p>
        <RouterLink to="/shop/design" class="chocopine-btn-primary inline-block mt-4 px-6 py-2.5">
          Bắt đầu thiết kế 3D
        </RouterLink>
      </div>

      <!-- Danh sách -->
      <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="tk in danhSach" :key="tk.id" class="chocopine-card p-4 space-y-3">
          <div class="rounded-xl overflow-hidden bg-[#FDF6EC] h-40 flex items-center justify-center">
            <iconify-icon icon="ph:cube-duotone" class="text-4xl" style="color:#C4A882"></iconify-icon>
          </div>
          <div>
            <p class="text-sm font-bold text-[#5C4428]">Bánh thiết kế 3D</p>
            <p class="text-xs text-gray-400 mt-0.5">Lưu lúc {{ formatDateTime(tk.ngayTao) }}</p>
            <p class="text-base font-black mt-1" style="color:var(--color-primary)">{{ formatPrice(tk.gia) }}</p>
          </div>
          <div class="flex gap-2">
            <button class="flex-1 chocopine-btn-secondary py-2 text-xs" @click="xemPreview(tk)">
              Xem lại 3D
            </button>
            <button class="flex-1 chocopine-btn-primary py-2 text-xs" :disabled="dangDat === tk.id" @click="datLaiBanhNay(tk)">
              {{ dangDat === tk.id ? 'Đang thêm...' : 'Đặt bánh này' }}
            </button>
          </div>
          <button class="w-full text-center text-xs text-red-400 hover:text-red-500 hover:underline py-1"
            @click="xoaThietKe(tk)">
            Xoá thiết kế
          </button>
        </div>
      </div>
    </div>

    <!-- Dialog xem lại 3D -->
    <el-dialog v-model="showPreview" title="Xem lại thiết kế 3D" width="640px">
      <CakeDesignViewer3D v-if="showPreview" :design="previewDesign" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import CakeDesignViewer3D from '@/components/cake3d/CakeDesignViewer3D.vue'
import apiClient from '@/services/apiService'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice } from '@/utils/format'

/**
 * Trang xem lại các thiết kế bánh 3D đã lưu (không phải đơn hàng, chỉ là bản nháp khách lưu
 * lại từ Design.vue qua nút "Lưu thiết kế").
 * LƯU Ý: các endpoint /api/v1/wishlist/thiet-ke/* là ĐỀ XUẤT — cần Backend xác nhận/tạo mới.
 */

const router = useRouter()
const cartStore = useCartStore()

const danhSach = ref([])
const loading = ref(false)

async function fetchDanhSach() {
  loading.value = true
  try {
    const { data } = await apiClient.get('/api/v1/wishlist/thiet-ke/cua-toi')
    danhSach.value = data || []
  } catch (e) {
    danhSach.value = []
  } finally {
    loading.value = false
  }
}

// ── Xem lại 3D ──────────────────────────────────────────────────────
const showPreview = ref(false)
const previewDesign = ref(null)
function xemPreview(tk) {
  try {
    previewDesign.value = typeof tk.thietKe === 'string' ? JSON.parse(tk.thietKe) : tk.thietKe
  } catch {
    previewDesign.value = null
  }
  showPreview.value = true
}

// ── Đặt lại bánh từ thiết kế đã lưu ─────────────────────────────────
const dangDat = ref(null)
async function datLaiBanhNay(tk) {
  dangDat.value = tk.id
  try {
    const marker = await apiClient.get('/api/v1/products/custom-cake-marker')
    const sanPhamDaiDienId = marker.data.id

    const result = await cartStore.themVaoGio(sanPhamDaiDienId, 1, tk.thietKe, tk.gia)
    if (!result.success) {
      ElMessage.error(result.message || 'Không thể thêm bánh vào giỏ hàng!')
      return
    }
    ElMessage.success('Đã thêm bánh vào giỏ hàng!')
    router.push('/shop/cart')
  } catch (e) {
    ElMessage.error(e.response?.data || 'Có lỗi xảy ra, thử lại nhé.')
  } finally {
    dangDat.value = null
  }
}

// ── Xoá thiết kế ─────────────────────────────────────────────────────
async function xoaThietKe(tk) {
  try {
    await ElMessageBox.confirm('Xoá thiết kế đã lưu này?', 'Xác nhận', {
      confirmButtonText: 'Xoá', cancelButtonText: 'Huỷ', type: 'warning',
    })
  } catch {
    return
  }
  try {
    await apiClient.delete(`/api/v1/wishlist/thiet-ke/${tk.id}`)
    danhSach.value = danhSach.value.filter(x => x.id !== tk.id)
    ElMessage.success('Đã xoá thiết kế.')
  } catch (e) {
    ElMessage.error(e.response?.data || 'Xoá thất bại, thử lại nhé.')
  }
}

function formatDateTime(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
}

onMounted(fetchDanhSach)
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>
