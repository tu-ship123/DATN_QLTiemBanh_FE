<template>
  <div class="chocopine-page animate-fade-in">
    <div class="chocopine-inner space-y-8">
      <section class="chocopine-card p-8 md:p-12">
        <div class="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div class="space-y-6">
            <span class="chocopine-badge">Tự thiết kế bánh 3D</span>
            <h1 class="chocopine-title chocopine-title--lg">Tạo Chiếc Bánh Riêng Theo Cách Của Bạn</h1>
            <p class="chocopine-desc" style="text-align: left; margin-top: 0;">
              Chọn kiểu dáng, phối màu sắc và thêm thắt những chi tiết trang trí ngọt ngào của riêng bạn. Công cụ mô phỏng 3D trực quan giúp bạn xem trước chiếc bánh mơ ước trong nháy mắt.
            </p>
            <div class="flex flex-wrap gap-3">
              <button class="chocopine-btn-primary px-6 py-3.5" @click="showBuilder = true">Bắt đầu thiết kế 3D</button>
              <button class="chocopine-btn-secondary px-6 py-3.5">Xem bộ sưu tập mẫu</button>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div v-for="item in samples" :key="item.title" class="chocopine-card chocopine-card--soft p-5 hover:shadow-md transition-shadow">
              <iconify-icon :icon="item.icon" class="text-2xl chocopine-accent"></iconify-icon>
              <h3 class="chocopine-heading-sm mt-2">{{ item.title }}</h3>
              <p class="chocopine-desc" style="margin-top: 4px; font-size: 12px; text-align: left;">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <CakeTemplateGallery :loading-id="selectingTemplateId" @select="selectTemplate" />

      <section v-if="showBuilder" class="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div class="space-y-4">
          <CakeBuilder3D ref="builderRef" :accessories-total="accessoriesTotal" @design-change="handleDesignChange" @price-change="handlePriceChange" />

          <div class="chocopine-card p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p class="chocopine-desc" style="margin: 0; font-size: 12px; text-align: left;">Tổng tiền chiếc bánh này</p>
              <p class="text-2xl font-black" style="color: var(--color-primary); margin: 2px 0 0;">{{ formatPrice(currentPrice) }}</p>
            </div>
            <button
              type="button"
              class="chocopine-btn-primary px-6 py-3.5 disabled:opacity-60 disabled:cursor-wait"
              :disabled="placingOrder"
              @click="datBanhNay"
            >
              <span v-if="placingOrder" class="inline-flex items-center gap-2">
                <span class="cake3d-spinner-sm"></span> Đang thêm vào giỏ...
              </span>
              <span v-else>Đặt bánh này</span>
            </button>
          </div>
        </div>
        <DecorPanel @change="handleDecorChange" />
      </section>


      <section class="grid gap-6 lg:grid-cols-3">
        <div v-for="block in features" :key="block.title" class="chocopine-card p-6 space-y-2">
          <h2 class="chocopine-heading-sm">{{ block.title }}</h2>
          <ul class="space-y-2">
            <li v-for="line in block.items" :key="line" class="chocopine-desc" style="margin: 0; font-size: 12px; text-align: left;">• {{ line }}</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import CakeBuilder3D from '@/components/cake3d/CakeBuilder3D.vue'
import DecorPanel from '@/components/cake3d/DecorPanel.vue'
import CakeTemplateGallery from '@/components/cake3d/CakeTemplateGallery.vue'
import apiClient from '@/services/apiService'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { formatPrice } from '@/utils/format'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const showBuilder = ref(false)
const accessoriesTotal = ref(0)
const selectedAccessories = ref([]) // [{ phu_kien_id, so_luong, ten_phu_kien, don_gia }]
const currentDesign = ref(null) // { shape, size, tierCount, frostingColor, message, messageColor }
const currentPrice = ref(0)
const placingOrder = ref(false)

const builderRef = ref(null)
const selectingTemplateId = ref(null)

function handleDecorChange({ total, items }) {
  accessoriesTotal.value = total
  selectedAccessories.value = items
}

function handleDesignChange(design) {
  currentDesign.value = design
}

function handlePriceChange(price) {
  currentPrice.value = price
}

/** Khách bấm "Chọn mẫu này" ở gallery -> mở builder (nếu chưa mở) rồi nạp mẫu vào,
 *  sau đó khách vẫn sửa/thêm/xóa bình thường, giá tự tính lại theo state hiện tại. */
async function selectTemplate(mau) {
  selectingTemplateId.value = mau.id
  showBuilder.value = true
  await nextTick() // đợi CakeBuilder3D render xong (component chỉ mount khi showBuilder = true)
  try {
    await builderRef.value?.loadTemplate(mau)
  } finally {
    selectingTemplateId.value = null
  }
}

/** Khách bấm "Đặt bánh này":
 *  1. Đóng gói state hiện tại của builder (shape/size/tierCount/màu/lời chúc + phụ kiện) thành 1 JSON.
 *  2. Lấy (hoặc để BE tự tạo) ID sản phẩm đại diện "Bánh thiết kế 3D tùy chỉnh".
 *  3. Thêm vào giỏ hàng kèm JSON thiết kế + giá đã tính theo đúng lựa chọn của khách.
 *  4. Chuyển sang trang giỏ hàng để khách xem lại rồi qua Checkout hoàn tất như luồng mua bình thường.
 */
async function datBanhNay() {
  if (!currentDesign.value) {
    alert('Bạn cần chỉnh ít nhất 1 lựa chọn trên bánh trước khi đặt nhé!')
    return
  }

  if (!authStore.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: '/shop/design' } })
    return
  }

  placingOrder.value = true
  try {
    // Lấy ID sản phẩm đại diện (BE tự tạo nếu chưa tồn tại, xem KhachHangSanPhamController)
    const marker = await apiClient.get('/api/v1/products/custom-cake-marker')
    const sanPhamDaiDienId = marker.data.id

    // Snapshot dạng thô của CakeBuilder3D - CakeDesignViewer3D.vue bên bếp đã hỗ trợ sẵn đọc đúng dạng này
    const thietKe = {
      shape: currentDesign.value.shape,
      size: currentDesign.value.size,
      tierCount: currentDesign.value.tierCount,
      frostingColor: currentDesign.value.frostingColor,
      message: currentDesign.value.message,
      messageColor: currentDesign.value.messageColor,
      accessories: selectedAccessories.value,
    }

    const result = await cartStore.themVaoGio(
      sanPhamDaiDienId,
      1,
      JSON.stringify(thietKe),
      currentPrice.value
    )

    if (!result.success) {
      alert(result.message || 'Không thể thêm bánh vào giỏ hàng, thử lại nhé!')
      return
    }

    router.push('/shop/cart')
  } catch (e) {
    alert(e.response?.data || 'Có lỗi xảy ra khi đặt bánh, vui lòng thử lại.')
  } finally {
    placingOrder.value = false
  }
}

const samples = [
  { icon: 'ph:rings-duotone', title: 'Bánh cưới truyền thống', desc: 'Tầng hoa lộng lẫy, phối tone pastel kem sữa nhẹ nhàng và quý phái.' },
  { icon: 'ph:balloon-duotone', title: 'Bánh sinh nhật Custom', desc: 'Nhiều tạo hình 3D hoạt hình đáng yêu và ngộ nghĩnh cho bé.' },
  { icon: 'ph:cookie-duotone', title: 'Hộp quà Cupcake', desc: 'Trang trí kem hoa tinh tế, mix nhiều vị khác nhau làm quà tặng.' },
  { icon: 'ph:sparkle-duotone', title: 'Macaron tháp thăng hoa', desc: 'Xếp tầng nghệ thuật tinh xảo cho các buổi tiệc trà chiều sang trọng.' },
]

const features = [
  {
    title: 'Dễ dàng tùy biến',
    items: ['Chọn đường kính & chiều cao tầng bánh phù hợp', 'Phối bảng màu phong phú theo chủ đề tiệc', 'Viết lời chúc ý nghĩa vẽ bằng kem'],
  },
  {
    title: 'Chất lượng thượng hạng',
    items: ['100% kem tươi whipping nhập khẩu từ New Zealand', 'Nhân trái cây tươi tự làm ít đường tự nhiên', 'Nướng cốt bánh tươi xốp mới mỗi sáng'],
  },
  {
    title: 'Đặc quyền dịch vụ',
    items: ['Giao bánh bằng ô tô chuyên dụng đảm bảo tạo hình', 'Tặng kèm bộ nến, đĩa giấy và dao cắt bánh cao cấp', 'Hỗ trợ tư vấn thiết kế tiệc bánh trọn gói'],
  },
]
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.cake3d-spinner-sm {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: design-btn-spin 0.8s linear infinite;
}

@keyframes design-btn-spin {
  to { transform: rotate(360deg); }
}
</style>
