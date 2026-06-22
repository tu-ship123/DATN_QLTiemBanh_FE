<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-400 mb-8">
      <RouterLink to="/shop" class="hover:text-[#E8634A] transition">Trang chủ</RouterLink>
      <span>/</span>
      <span
        class="hover:text-[#E8634A] transition cursor-pointer"
        @click="router.back()"
      >Cửa hàng</span>
      <span>/</span>
      <span class="text-[#1E2A3B] font-semibold line-clamp-1">{{ product?.tenSanPham }}</span>
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
        class="mt-6 rounded-full bg-[#E8634A] text-white px-8 py-3 text-sm font-bold hover:bg-[#f37356] transition"
      >
        Quay về cửa hàng
      </button>
    </div>

    <!-- Nội dung chi tiết -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12">

      <!-- Ảnh sản phẩm -->
      <div class="space-y-4">
        <div class="relative rounded-[28px] overflow-hidden bg-slate-50 h-[480px] shadow-lg">
          <img
            :src="product.anhSanPham || defaultImage"
            :alt="product.tenSanPham"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
          <!-- Badge hết hàng -->
          <div
            v-if="product.soLuongTon === 0"
            class="absolute inset-0 bg-black/40 flex items-center justify-center"
          >
            <span class="bg-white text-gray-700 font-bold text-lg px-6 py-3 rounded-full">Hết hàng</span>
          </div>
          <!-- Badge danh mục -->
          <div class="absolute left-5 top-5 rounded-full bg-white/95 backdrop-blur px-4 py-1.5 text-xs font-bold text-[#E8634A] shadow">
            {{ product.tenDanhMuc }}
          </div>
        </div>
      </div>

      <!-- Thông tin sản phẩm -->
      <div class="space-y-6 pt-2">

        <!-- Tên + danh mục -->
        <div>
          <p class="text-sm font-semibold text-[#E8634A] uppercase tracking-wider mb-1">
            {{ product.tenDanhMuc }}
          </p>
          <h1 class="text-3xl sm:text-4xl font-black text-[#1E2A3B] leading-tight">
            {{ product.tenSanPham }}
          </h1>
        </div>

        <!-- Rating + tồn kho -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1 bg-[#FFF8EC] px-3 py-1.5 rounded-lg">
            <span class="text-[#FBB830] text-lg">★★★★★</span>
            <span class="text-sm font-bold text-[#1E2A3B] ml-1">5.0</span>
          </div>
          <div class="h-5 w-px bg-gray-200"></div>
          <p class="text-sm text-gray-500 font-medium">
            <span
              :class="product.soLuongTon > 0 ? 'text-green-500' : 'text-red-400'"
              class="font-bold"
            >
              {{ product.soLuongTon > 0 ? `Còn ${product.soLuongTon} cái` : 'Hết hàng' }}
            </span>
          </p>
        </div>

        <!-- Giá -->
        <div class="flex items-end gap-3">
          <span class="text-4xl font-black text-[#E8634A]">
            {{ formatPrice(product.donGia) }}
          </span>
        </div>

        <!-- Mô tả -->
        <div class="bg-gray-50 rounded-2xl p-5">
          <p class="text-sm font-bold text-[#1E2A3B] mb-2">Mô tả sản phẩm</p>
          <p class="text-sm text-gray-600 leading-relaxed">
            {{ product.moTa || 'Chưa có mô tả cho sản phẩm này.' }}
          </p>
        </div>

        <!-- Chọn số lượng -->
        <div class="flex items-center gap-4">
          <p class="text-sm font-bold text-[#1E2A3B]">Số lượng:</p>
          <div class="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
            <button
              @click="decreaseQty"
              class="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition font-bold text-lg"
              :disabled="qty <= 1"
            >−</button>
            <span class="w-8 text-center font-black text-[#1E2A3B]">{{ qty }}</span>
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
            class="flex-1 rounded-full bg-[#E8634A] text-white px-8 py-4 text-sm font-bold shadow-lg shadow-[#E8634A]/30 hover:bg-[#f37356] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <el-icon class="mr-2"><ShoppingCart /></el-icon>
            {{ cartStore.loading ? 'Đang thêm...' : 'Thêm vào giỏ hàng' }}
          </button>
          <button
            @click="buyNow"
            :disabled="product.soLuongTon === 0 || cartStore.loading"
            class="flex-1 rounded-full border-2 border-[#E8634A] text-[#E8634A] px-8 py-4 text-sm font-bold hover:bg-[#FFF0EC] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            Mua ngay
          </button>
        </div>

        <!-- Thông tin thêm -->
        <div class="border-t border-gray-100 pt-5 space-y-3">
          <div class="flex items-center gap-3 text-sm text-gray-500">
            <span class="text-[#E8634A]">🎂</span>
            <span>Giao hàng trong ngày với đơn đặt trước 10:00 sáng</span>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-500">
            <span class="text-[#E8634A]">🎁</span>
            <span>Hỗ trợ đóng gói quà tặng miễn phí</span>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-500">
            <span class="text-[#E8634A]">✨</span>
            <span>Có thể tùy chỉnh theo yêu cầu, liên hệ để biết thêm</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sản phẩm liên quan -->
    <section v-if="relatedProducts.length > 0" class="mt-20">
      <h2 class="text-2xl font-black text-[#1E2A3B] mb-6">Sản phẩm liên quan</h2>
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
            <h3 class="font-bold text-[#1E2A3B] line-clamp-1">{{ item.tenSanPham }}</h3>
            <div class="flex items-center justify-between">
              <span class="font-black text-[#E8634A]">{{ formatPrice(item.donGia) }}</span>
              <span class="text-xs text-gray-400">Còn {{ item.soLuongTon }}</span>
            </div>
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
  } catch (error) {
    console.error('Lỗi tải chi tiết sản phẩm:', error)
    ElMessage.error('Không tải được thông tin sản phẩm!')
  } finally {
    loading.value = false
  }
}

// Sản phẩm liên quan: cùng danh mục, loại trừ sản phẩm hiện tại, tối đa 4
const relatedProducts = computed(() => {
  if (!product.value) return []
  return productStore.products
    .filter(
      (p) =>
        p.danhMucId === product.value.danhMucId &&
        p.id !== product.value.id &&
        p.soLuongTon > 0
    )
    .slice(0, 4)
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