<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-400 mb-8">
      <RouterLink to="/shop" class="hover:text-[#7A5C3A] transition">Trang chủ</RouterLink>
      <span>/</span>
      <span
        class="hover:text-[#7A5C3A] transition cursor-pointer"
        @click="router.back()"
      >Cửa hàng</span>
      <span>/</span>
      <span class="text-[#5C4428] font-semibold line-clamp-1">{{ product?.tenSanPham }}</span>
    </nav>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
      <div class="rounded-[28px] bg-gray-200 h-[480px]"></div>
      <div class="space-y-5 pt-4">
        <div class="h-6 bg-gray-200 rounded w-1/3"></div>
        <div class="h-9 bg-gray-200 rounded w-3/4"></div>
        <div class="h-5 bg-gray-100 rounded w-1/2"></div>
        <div class="h-10 bg-gray-200 rounded w-1/4"></div>
        <div class="h-24 bg-gray-100 rounded"></div>
        <div class="h-14 bg-gray-200 rounded-full"></div>
      </div>
    </div>

    <!-- Không tìm thấy -->
    <div v-else-if="!product" class="text-center py-32 text-gray-400">
      <el-icon :size="56" class="mb-4"><Box /></el-icon>
      <p class="text-xl font-bold">Không tìm thấy sản phẩm</p>
      <p class="text-sm mt-2">Sản phẩm có thể đã bị xóa hoặc không tồn tại</p>
      <button
        @click="router.push('/shop')"
        class="mt-6 rounded-full bg-[#7A5C3A] text-white px-8 py-3 text-sm font-bold hover:bg-[#9A7650] transition"
      >
        Quay về cửa hàng
      </button>
    </div>

    <!-- Nội dung chi tiết -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12">

      <!-- Ảnh sản phẩm (slider tối đa 5 tấm) -->
      <div class="space-y-4">
        <div class="relative rounded-[28px] overflow-hidden bg-slate-50 h-[480px] shadow-lg group">
          <img
            :src="anhDangXem || defaultImage"
            :alt="product.tenSanPham"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
          <!-- Badge danh mục -->
          <div class="absolute left-5 top-5 rounded-full bg-white/95 backdrop-blur px-4 py-1.5 text-xs font-bold text-[#7A5C3A] shadow">
            {{ product.tenDanhMuc }}
          </div>

          <!-- Nút điều hướng, chỉ hiện khi có > 1 ảnh -->
          <template v-if="danhSachAnhSanPham.length > 1">
            <button @click="anhIndex = (anhIndex - 1 + danhSachAnhSanPham.length) % danhSachAnhSanPham.length"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
              <iconify-icon icon="ph:caret-left-bold" class="text-[#5C4428]"></iconify-icon>
            </button>
            <button @click="anhIndex = (anhIndex + 1) % danhSachAnhSanPham.length"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
              <iconify-icon icon="ph:caret-right-bold" class="text-[#5C4428]"></iconify-icon>
            </button>
            <div class="absolute bottom-4 right-5 rounded-full bg-black/50 text-white text-xs font-bold px-2.5 py-1">
              {{ anhIndex + 1 }}/{{ danhSachAnhSanPham.length }}
            </div>
          </template>
        </div>

        <!-- Dải thumbnail, chỉ hiện khi có > 1 ảnh -->
        <div v-if="danhSachAnhSanPham.length > 1" class="flex gap-3">
          <button v-for="(img, idx) in danhSachAnhSanPham" :key="idx" @click="anhIndex = idx"
            class="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-colors"
            :class="idx === anhIndex ? 'border-[#7A5C3A]' : 'border-transparent opacity-70 hover:opacity-100'">
            <img :src="img" class="w-full h-full object-cover" alt="Ảnh góc khác" />
          </button>
        </div>
      </div>

      <!-- Thông tin sản phẩm -->
      <div class="space-y-6 pt-2">

        <!-- Tên + danh mục -->
        <div>
          <p class="text-sm font-semibold text-[#7A5C3A] uppercase tracking-wider mb-1">
            {{ product.tenDanhMuc }}
          </p>
          <h1 class="text-3xl sm:text-4xl font-black text-[#5C4428] leading-tight">
            {{ product.tenSanPham }}
          </h1>
        </div>

        <!-- Rating -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1 bg-[#FFF8EC] px-3 py-1.5 rounded-lg">
            <span class="star-row inline-flex items-center gap-0.5 text-[#FBB830]">
              <iconify-icon
                v-for="n in 5"
                :key="n"
                :icon="n <= Math.round(averageRating || 0) ? 'ph:star-fill' : 'ph:star'"
              ></iconify-icon>
            </span>
            <span class="text-sm font-bold text-[#5C4428] ml-1">
              {{ averageRating || '—' }}
            </span>
          </div>
          <span class="text-sm text-gray-400 font-medium">
            {{ reviews.length > 0 ? `${reviews.length} đánh giá` : 'Chưa có đánh giá' }}
          </span>
        </div>

        <!-- Giá -->
        <div class="flex items-end gap-3">
          <span class="text-4xl font-black text-[#7A5C3A]">
            {{ formatPrice(product.donGia) }}
          </span>
        </div>

        <!-- Mô tả -->
        <div class="bg-gray-50 rounded-2xl p-5">
          <p class="text-sm font-bold text-[#5C4428] mb-2">Mô tả sản phẩm</p>
          <p class="text-sm text-gray-600 leading-relaxed">
            {{ product.moTa || 'Chưa có mô tả cho sản phẩm này.' }}
          </p>
        </div>

        <!-- Chọn số lượng -->
        <div class="flex items-center gap-4">
          <p class="text-sm font-bold text-[#5C4428]">Số lượng:</p>
          <div class="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
            <button
              @click="decreaseQty"
              class="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition font-bold text-lg"
              :disabled="qty <= 1"
            >−</button>
            <span class="w-8 text-center font-black text-[#5C4428]">{{ qty }}</span>
            <button
              @click="increaseQty"
              class="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition font-bold text-lg"
              :disabled="qty >= product.soLuongTon"
            >+</button>
          </div>
        </div>

        <!-- Nút hành động -->
        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            @click="addToCart"
            :disabled="product.soLuongTon === 0 || cartStore.loading"
            class="flex-1 rounded-full bg-[#7A5C3A] text-white px-8 py-4 text-sm font-bold shadow-lg shadow-[#7A5C3A]/30 hover:bg-[#9A7650] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <el-icon class="mr-2"><ShoppingCart /></el-icon>
            {{ cartStore.loading ? 'Đang thêm...' : 'Thêm vào giỏ hàng' }}
          </button>
          <button
            @click="buyNow"
            :disabled="product.soLuongTon === 0 || cartStore.loading"
            class="flex-1 rounded-full border-2 border-[#7A5C3A] text-[#7A5C3A] px-8 py-4 text-sm font-bold hover:bg-[#FDF6EC] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            Mua ngay
          </button>
        </div>

        <!-- Thông tin thêm -->
        <div class="border-t border-gray-100 pt-5 space-y-3">
          <div class="flex items-center gap-3 text-sm text-gray-500">
            <iconify-icon icon="ph:truck-duotone" class="text-lg text-[#7A5C3A] shrink-0"></iconify-icon>
            <span>Giao hàng trong ngày với đơn đặt trước 10:00 sáng</span>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-500">
            <iconify-icon icon="ph:gift-duotone" class="text-lg text-[#7A5C3A] shrink-0"></iconify-icon>
            <span>Hỗ trợ đóng gói quà tặng miễn phí</span>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-500">
            <iconify-icon icon="ph:sparkle-duotone" class="text-lg text-[#7A5C3A] shrink-0"></iconify-icon>
            <span>Có thể tùy chỉnh theo yêu cầu, liên hệ để biết thêm</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Có thể bạn thích -->
    <section v-if="relatedProducts.length > 0" class="mt-20">
      <h2 class="text-2xl font-black text-[#5C4428] mb-6">Có thể bạn thích</h2>
      <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="item in relatedProducts"
          :key="item.id"
          class="group overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl cursor-pointer"
          @click="goToProduct(item.id)"
        >
          <div class="relative h-48 overflow-hidden bg-slate-50">
            <img
              :src="item.anhSanPham || defaultImage"
              :alt="item.tenSanPham"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              @error="handleImageError"
            />
          </div>
          <div class="p-4 space-y-2">
            <h3 class="font-bold text-[#5C4428] line-clamp-1">{{ item.tenSanPham }}</h3>
            <div class="flex items-center justify-between">
              <span class="font-black text-[#7A5C3A]">{{ formatPrice(item.donGia) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Đánh giá khách hàng thật -->
    <section class="mt-16">
      <h2 class="text-2xl font-black text-[#5C4428] mb-6 flex items-center gap-2">
        <iconify-icon icon="ph:star-duotone" class="text-[#7A5C3A]"></iconify-icon>
        Đánh giá từ khách hàng
        <span class="text-base font-normal text-gray-400 ml-1">({{ reviews.length }})</span>
      </h2>

      <div v-if="loadingReviews" class="flex items-center gap-3 py-8 text-[#A68B5C]">
        <div class="animate-spin w-5 h-5 border-2 border-[#7A5C3A] border-t-transparent rounded-full"></div>
        <span class="text-sm font-semibold">Đang tải đánh giá...</span>
      </div>

      <div v-else-if="reviews.length === 0" class="rounded-2xl border border-dashed border-[#EDE0CC] p-10 text-center text-[#A68B5C]">
        <iconify-icon icon="ph:chat-circle-duotone" class="text-4xl mb-3 block"></iconify-icon>
        <p class="font-semibold">Chưa có đánh giá nào cho sản phẩm này.</p>
        <p class="text-sm mt-1">Hãy là người đầu tiên chia sẻ cảm nhận!</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="r in reviews"
          :key="r.id"
          class="rounded-2xl border border-[#EDE0CC] bg-white p-5 space-y-3 hover:border-[#C4A882] transition-colors"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                style="background: linear-gradient(135deg, #7A5C3A, #9A7650)"
              >
                {{ r.tenKhachHang?.charAt(0)?.toUpperCase() || 'K' }}
              </div>
              <div>
                <p class="font-bold text-[#5C4428] text-sm">{{ r.tenKhachHang }}</p>
                <p class="text-[11px] text-[#A68B5C]">
                  {{ new Date(r.ngayTao).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-0.5 flex-shrink-0">
              <iconify-icon
                v-for="n in 5"
                :key="n"
                :icon="n <= r.soSao ? 'ph:star-fill' : 'ph:star'"
                class="text-sm"
                :class="n <= r.soSao ? 'text-[#FBB830]' : 'text-gray-300'"
              ></iconify-icon>
              <span class="text-xs font-bold text-[#5C4428] ml-1.5">{{ r.soSao }}/5</span>
            </div>
          </div>

          <p v-if="r.noiDung" class="text-sm text-gray-600 leading-relaxed">{{ r.noiDung }}</p>
          <p v-else class="text-sm text-gray-400 italic">Khách hàng không để lại nhận xét.</p>

          <a v-if="r.hinhAnh" :href="r.hinhAnh" target="_blank" rel="noopener"
            class="block w-20 h-20 rounded-xl overflow-hidden border border-[#EDE0CC] hover:border-[#C4A882] transition-colors">
            <img :src="r.hinhAnh" class="w-full h-full object-cover" alt="Ảnh khách hàng đính kèm" />
          </a>

          <div v-if="r.phanHoiCuaTiem" class="bg-[#FDF6EC] rounded-xl p-3 border-l-4 border-[#7A5C3A]">
            <p class="text-xs font-bold text-[#5C4428] mb-1">💬 Phản hồi từ Chocopine:</p>
            <p class="text-sm text-[#5C4428]">{{ r.phanHoiCuaTiem }}</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ShoppingCart, Box } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import apiClient from '@/services/apiService'

const router = useRouter()
const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const product = ref(null)
const loading = ref(false)
const qty = ref(1)
const defaultImage = 'https://placehold.co/600x480?text=Polycake'

// ==========================================
// GALLERY ẢNH SẢN PHẨM (tối đa 5 tấm, slider)
// ==========================================
// Ưu tiên field mảng ảnh mới (danhSachAnh) nếu BE đã hỗ trợ; nếu chưa có,
// fallback về field cũ anhSanPham (1 ảnh) để tương thích ngược.
const danhSachAnhSanPham = computed(() => {
  if (!product.value) return []
  if (Array.isArray(product.value.danhSachAnh) && product.value.danhSachAnh.length) {
    return product.value.danhSachAnh.slice(0, 5)
  }
  return product.value.anhSanPham ? [product.value.anhSanPham] : []
})
const anhIndex = ref(0)
const anhDangXem = computed(() => danhSachAnhSanPham.value[anhIndex.value] || defaultImage)

// ==========================================
// ĐÁNH GIÁ THẬT TỪ API
// ==========================================
const reviews = ref([])
const loadingReviews = ref(false)

const averageRating = computed(() => {
  if (!reviews.value.length) return null
  const sum = reviews.value.reduce((acc, r) => acc + r.soSao, 0)
  return (sum / reviews.value.length).toFixed(1)
})

const loadReviews = async (sanPhamId) => {
  loadingReviews.value = true
  try {
    const { data } = await apiClient.get(`/api/v1/products/${sanPhamId}/reviews`)
    reviews.value = data
  } catch (e) {
    console.error('Lỗi tải đánh giá:', e)
    reviews.value = []
  } finally {
    loadingReviews.value = false
  }
}

// ==========================================
// FORMAT GIÁ
// ==========================================
const formatPrice = (price) => {
  if (!price && price !== 0) return 'Liên hệ'
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

const handleImageError = (e) => {
  e.target.src = defaultImage
}

// ==========================================
// LOAD CHI TIẾT SẢN PHẨM
// ==========================================
const loadProduct = async () => {
  loading.value = true
  qty.value = 1
  anhIndex.value = 0
  try {
    const id = Number(route.params.id)

    // Nếu store đã có dữ liệu thì lấy luôn, không cần gọi API thêm
    if (productStore.products.length > 0) {
      product.value = productStore.products.find((p) => p.id === id) || null
    }

    // Nếu store chưa có (user vào thẳng URL) thì fetch
    if (!product.value) {
      await productStore.fetchAllProducts()
      product.value = productStore.products.find((p) => p.id === id) || null
    }

    // Tải đánh giá thật sau khi có sản phẩm
    if (product.value) {
      await loadReviews(product.value.id)
    }
  } catch (error) {
    console.error('Lỗi tải chi tiết sản phẩm:', error)
    ElMessage.error('Không tải được thông tin sản phẩm!')
  } finally {
    loading.value = false
  }
}

// "Có thể bạn thích": ưu tiên cùng danh mục, nếu chưa đủ 4 thì lấy thêm
// sản phẩm còn hàng khác (loại trừ sản phẩm hiện tại) để luôn gợi ý đủ 4 món.
const RELATED_LIMIT = 4
const relatedProducts = computed(() => {
  if (!product.value) return []

  const allAvailable = productStore.products.filter(
    (p) => p.id !== product.value.id && p.soLuongTon > 0
  )

  const sameCategory = allAvailable.filter(
    (p) => p.danhMucId === product.value.danhMucId
  )

  if (sameCategory.length >= RELATED_LIMIT) {
    return sameCategory.slice(0, RELATED_LIMIT)
  }

  // Chưa đủ số lượng gợi ý -> bổ sung thêm sản phẩm khác danh mục
  const usedIds = new Set(sameCategory.map((p) => p.id))
  const others = allAvailable.filter((p) => !usedIds.has(p.id))

  return [...sameCategory, ...others].slice(0, RELATED_LIMIT)
})

// ==========================================
// SỐ LƯỢNG
// ==========================================
const increaseQty = () => {
  if (qty.value < product.value.soLuongTon) qty.value++
}

const decreaseQty = () => {
  if (qty.value > 1) qty.value--
}

// ==========================================
// GIỎ HÀNG
// ==========================================
const addToCart = async () => {
  if (!product.value || product.value.soLuongTon === 0) {
    ElMessage.warning('Sản phẩm đã hết hàng!')
    return
  }
  if (!authStore.isAuthenticated) {
    ElMessage.warning('Vui lòng đăng nhập để thêm vào giỏ hàng!')
    router.push('/login')
    return
  }
  const result = await cartStore.themVaoGio(product.value.id, qty.value)
  if (result.success) {
    ElMessage.success(`Đã thêm ${qty.value} "${product.value.tenSanPham}" vào giỏ hàng!`)
  } else {
    ElMessage.error(
      typeof result.message === 'string'
        ? result.message
        : 'Thêm vào giỏ thất bại, vui lòng thử lại!'
    )
  }
}

const buyNow = async () => {
  if (!product.value || product.value.soLuongTon === 0) {
    ElMessage.warning('Sản phẩm đã hết hàng!')
    return
  }
  if (!authStore.isAuthenticated) {
    ElMessage.warning('Vui lòng đăng nhập để mua hàng!')
    router.push('/login')
    return
  }
  const result = await cartStore.themVaoGio(product.value.id, qty.value)
  if (result.success) {
    router.push('/shop/cart')
  } else {
    ElMessage.error(
      typeof result.message === 'string'
        ? result.message
        : 'Thêm vào giỏ thất bại, vui lòng thử lại!'
    )
  }
}

const goToProduct = (id) => {
  router.push(`/shop/product/${id}`)
}

// Load lại khi route params thay đổi (click sản phẩm liên quan)
onMounted(loadProduct)
watch(() => route.params.id, loadProduct)
</script>