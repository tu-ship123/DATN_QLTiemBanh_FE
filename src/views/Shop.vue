<template>
  <div class="w-full">
    <!-- ===== HERO BANNER + NAVBAR ===== -->
    <section
      class="relative overflow-hidden text-white"
      style="min-height: 72vh; width: 100vw; margin-left: calc(-50vw + 50%); background-size: cover; background-position: center;"
      :style="{ backgroundImage: `url(${heroImage})` }"
    >
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>

      <!-- NAVBAR -->
      <header class="absolute top-0 left-0 w-full z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
          <div class="flex flex-col cursor-pointer">
            <span class="font-display text-2xl font-black tracking-wider text-white">Polycake.</span>
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#E8634A]">Cửa hàng bánh</span>
          </div>
          <nav class="hidden md:flex items-center gap-8">
            <a href="#" class="text-sm font-bold text-[#E8634A] transition">TRANG CHỦ</a>
            <a href="#" class="text-sm font-bold text-white hover:text-[#E8634A] transition">CỬA HÀNG</a>
            <a href="#" class="text-sm font-bold text-white hover:text-[#E8634A] transition">THIẾT KẾ 3D</a>
            <a href="#" class="text-sm font-bold text-white hover:text-[#E8634A] transition">LIÊN HỆ</a>
          </nav>
          <div class="flex items-center gap-5">
            <button class="text-white hover:text-[#E8634A] transition mt-1">
              <el-icon :size="20"><Search /></el-icon>
            </button>
            <button class="relative text-white hover:text-[#E8634A] transition mt-1">
              <el-icon :size="20"><ShoppingCart /></el-icon>
              <span class="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#E8634A] text-[10px] font-bold text-white shadow">3</span>
            </button>
            <div class="h-6 w-px bg-white/30 hidden sm:block"></div>
            <div class="hidden sm:flex items-center gap-3">
              <button class="text-sm font-bold text-white hover:text-[#E8634A] transition">Đăng nhập</button>
              <button class="rounded-full bg-white px-5 py-2 text-sm font-bold text-[#E8634A] transition hover:bg-gray-100 shadow-lg">Đăng ký</button>
              <div class="ml-2 flex items-center">
                <el-dropdown trigger="click" @command="handleUserAction">
                  <div class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-tr from-[#E8634A] to-[#FBB830] text-sm font-bold text-white shadow-md transition hover:scale-105 outline-none">
                    NK
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu class="w-48 rounded-xl">
                      <el-dropdown-item command="profile">Hồ sơ cá nhân</el-dropdown-item>
                      <el-dropdown-item command="orders">Đơn hàng của tôi</el-dropdown-item>
                      <el-dropdown-item divided command="logout" class="text-red-500 font-semibold hover:bg-red-50">Đăng xuất</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Nội dung Hero -->
      <div class="relative w-full h-full flex flex-col items-center justify-center pt-24 pb-12">
        <div class="max-w-2xl space-y-4 text-center px-6 sm:px-8 mt-10">
          <span class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-wider font-semibold text-[#FBB830] backdrop-blur-sm border border-white/20">
            <span class="h-2 w-2 rounded-full bg-[#FBB830] animate-pulse"></span>
            Bánh handmade
          </span>
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-display font-black leading-tight uppercase drop-shadow-lg">
            Tiệm bánh<br>dễ thương
          </h1>
          <p class="max-w-xl text-base text-white/90 sm:text-lg mx-auto drop-shadow">
            Thưởng thức hương vị ngọt ngào từ những chiếc bánh handmade được làm với tình yêu thương.
          </p>
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center justify-center pt-4">
            <RouterLink to="/shop" class="inline-flex items-center justify-center rounded-full bg-[#E8634A] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#E8634A]/40 hover:bg-[#f37356] hover:-translate-y-1 transition-all duration-300">
              ĐẶT BÁNH NGAY
            </RouterLink>
            <button class="inline-flex items-center justify-center rounded-full border-2 border-white/60 bg-white/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">
              THIẾT KẾ 3D ✨
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== DANH SÁCH SẢN PHẨM ===== -->
    <div class="space-y-8 px-4 sm:px-6 lg:px-8 mt-12 mb-20 max-w-7xl mx-auto">
      <section class="space-y-6">

        <!-- Tiêu đề + bộ lọc danh mục -->
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 class="text-3xl font-black text-[#1E2A3B]">Bánh của chúng tôi</h2>
            <p class="text-gray-500 mt-1 text-sm font-medium">
              {{ productStore.loading ? 'Đang tải...' : `${displayedProducts.length} sản phẩm` }}
            </p>
          </div>

          <!-- Nút lọc danh mục -->
          <div class="flex flex-wrap gap-2">
            <button
              @click="activeCategory = null"
              :class="activeCategory === null
                ? 'bg-[#E8634A] text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#E8634A] hover:text-[#E8634A]'"
              class="rounded-full px-5 py-2 text-sm font-semibold transition-all"
            >
              Tất cả
            </button>

            <!-- Skeleton loading danh mục -->
            <template v-if="categoryStore.loading">
              <div v-for="n in 4" :key="n" class="h-9 w-24 rounded-full bg-gray-100 animate-pulse"></div>
            </template>

            <!-- Danh mục từ store -->
            <button
              v-else
              v-for="cat in categoryStore.activeCategories"
              :key="cat.id"
              @click="activeCategory = cat.id"
              :class="activeCategory === cat.id
                ? 'bg-[#E8634A] text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#E8634A] hover:text-[#E8634A]'"
              class="rounded-full px-5 py-2 text-sm font-semibold transition-all flex items-center gap-2"
            >
              <img
                v-if="cat.anhDaiDien"
                :src="cat.anhDaiDien"
                class="h-4 w-4 rounded-full object-cover"
                @error="(e) => e.target.style.display = 'none'"
              />
              {{ cat.tenDanhMuc }}
            </button>
          </div>
        </div>

        <!-- Thanh tìm kiếm + sắp xếp -->
        <div class="grid gap-4 lg:grid-cols-[1.5fr_0.75fr] items-center">
          <div class="relative rounded-full border border-gray-200 bg-white px-5 py-3 shadow-sm transition-all focus-within:border-[#E8634A] focus-within:ring-2 focus-within:ring-[#E8634A]/20">
            <el-icon class="text-[#E8634A] absolute left-5 top-1/2 -translate-y-1/2"><Search /></el-icon>
            <input
              v-model="search"
              type="text"
              placeholder="Tìm sản phẩm yêu thích..."
              class="w-full border-none bg-transparent pl-8 text-sm text-[#334155] outline-none placeholder:text-gray-400"
            />
          </div>
          <div class="flex flex-col gap-3 sm:flex-row">
            <button
              @click="sortBy = 'newest'"
              :class="sortBy === 'newest' ? 'border-[#E8634A] text-[#E8634A]' : 'border-gray-200 text-[#475569]'"
              class="flex-1 rounded-full border bg-white px-5 py-3 text-sm font-semibold hover:border-[#E8634A] hover:text-[#E8634A] transition-colors shadow-sm"
            >
              Mới nhất
            </button>
            <button
              @click="sortBy = 'price_asc'"
              :class="sortBy === 'price_asc' ? 'border-[#E8634A] text-[#E8634A]' : 'border-gray-200 text-[#475569]'"
              class="flex-1 rounded-full border bg-white px-5 py-3 text-sm font-semibold hover:border-[#E8634A] hover:text-[#E8634A] transition-colors shadow-sm"
            >
              Giá thấp nhất
            </button>
          </div>
        </div>

        <!-- Loading skeleton sản phẩm -->
        <div v-if="productStore.loading" class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 pt-4">
          <div v-for="n in 8" :key="n" class="rounded-[24px] border border-gray-100 bg-white shadow-sm overflow-hidden animate-pulse">
            <div class="h-56 bg-gray-200"></div>
            <div class="p-5 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-100 rounded w-1/2"></div>
              <div class="h-6 bg-gray-200 rounded w-1/3"></div>
              <div class="h-10 bg-gray-100 rounded-xl"></div>
            </div>
          </div>
        </div>

        <!-- Không có sản phẩm -->
        <div v-else-if="displayedProducts.length === 0" class="text-center py-20 text-gray-400">
          <el-icon :size="48" class="mb-4"><Box /></el-icon>
          <p class="text-lg font-semibold">Không tìm thấy sản phẩm nào</p>
          <p class="text-sm mt-1">Thử thay đổi từ khóa hoặc danh mục khác</p>
        </div>

        <!-- Danh sách sản phẩm -->
        <div v-else class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 pt-4">
          <div
            v-for="product in displayedProducts"
            :key="product.id"
            class="group overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl cursor-pointer"
            @click="goToDetail(product.id)"
          >
            <div class="relative h-56 overflow-hidden bg-slate-50">
              <img
                :src="product.anhSanPham || defaultImage"
                :alt="product.tenSanPham"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                @error="handleImageError"
              />
              <div class="absolute left-4 top-4 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-xs font-bold text-[#E8634A] shadow-sm">
                {{ product.tenDanhMuc || 'Sản phẩm' }}
              </div>
              <div v-if="product.soLuongTon === 0" class="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span class="bg-white text-gray-700 font-bold text-sm px-4 py-2 rounded-full">Hết hàng</span>
              </div>
            </div>
            <div class="p-5 space-y-4">
              <div>
                <h3 class="text-lg font-bold text-[#1E2A3B] line-clamp-1">{{ product.tenSanPham }}</h3>
                <p class="text-xs text-gray-500 mt-1 font-medium">
                  {{ product.tenDanhMuc }} · Còn {{ product.soLuongTon }} cái
                </p>
              </div>
              <div class="flex items-center justify-between gap-3">
                <div class="text-lg font-black text-[#E8634A]">{{ formatPrice(product.donGia) }}</div>
                <div class="flex items-center gap-1 text-sm text-[#1E2A3B] bg-gray-50 px-2 py-1 rounded-lg">
                  <span class="text-[#FBB830]">★</span>
                  <span class="font-bold">5.0</span>
                </div>
              </div>
              <button
                class="w-full rounded-xl bg-[#FFF0EC] text-[#E8634A] px-4 py-3 text-sm font-bold transition-colors hover:bg-[#E8634A] hover:text-white"
                @click.stop="addToCart(product)"
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>

      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ShoppingCart, Box } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useProductStore } from '@/stores/productStore'
import { useCategoryStore } from '@/stores/categoryStore'
import heroImage from '@/assets/images/Screenshot 2026-06-17 151209.png'

const router = useRouter()
const productStore = useProductStore()
const categoryStore = useCategoryStore()

const search = ref('')
const activeCategory = ref(null)   // null = Tất cả, số = danhMucId
const sortBy = ref('newest')
const defaultImage = 'https://placehold.co/400x300?text=Polycake'

const formatPrice = (price) => {
  if (!price && price !== 0) return 'Liên hệ'
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

const handleImageError = (e) => {
  e.target.src = defaultImage
}

// Load cả 2 store cùng lúc
onMounted(() => {
  productStore.fetchAllProducts()
  categoryStore.fetchAllCategories()
})

// Lọc + sắp xếp sản phẩm
const displayedProducts = computed(() => {
  let result = productStore.products.filter((item) => {
    const matchesCategory =
      activeCategory.value === null ||
      item.danhMucId === activeCategory.value

    const matchesSearch =
      !search.value ||
      item.tenSanPham?.toLowerCase().includes(search.value.toLowerCase())

    return matchesCategory && matchesSearch
  })

  if (sortBy.value === 'newest') {
    result = [...result].sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao))
  } else if (sortBy.value === 'price_asc') {
    result = [...result].sort((a, b) => a.donGia - b.donGia)
  }

  return result
})

const goToDetail = (id) => {
  router.push(`/shop/product/${id}`)
}

const addToCart = (product) => {
  if (product.soLuongTon === 0) {
    ElMessage.warning('Sản phẩm này đã hết hàng!')
    return
  }
  // TODO: Gọi cartStore.addItem(product) sau khi làm giỏ hàng
  ElMessage.success(`Đã thêm "${product.tenSanPham}" vào giỏ hàng!`)
}

const handleUserAction = (command) => {
  if (command === 'logout') router.push('/login')
  else if (command === 'profile') router.push('/profile')
  else if (command === 'orders') router.push('/orders')
}
</script>