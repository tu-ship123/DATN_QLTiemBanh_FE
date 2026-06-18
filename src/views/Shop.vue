<template>
  <div class="w-full">
    <!-- Khu vực Hero Banner & Navbar -->
    <section class="relative overflow-hidden text-white" style="min-height:72vh; width: 100vw; margin-left: calc(-50vw + 50%); background-size: cover; background-position: center;" :style="{ backgroundImage: `url(${heroImage})` }">
      
      <!-- Lớp phủ tối (Overlay) để làm nổi bật chữ -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>

      <!-- NAVBAR -->
      <header class="absolute top-0 left-0 w-full z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
          
          <!-- 1. Cụm Logo -->
          <div class="flex flex-col cursor-pointer">
            <span class="font-display text-2xl font-black tracking-wider text-white">Polycake.</span>
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#E8634A]">Cửa hàng bánh</span>
          </div>

          <!-- 2. Cụm Menu Giữa -->
          <nav class="hidden md:flex items-center gap-8">
            <a href="#" class="text-sm font-bold text-[#E8634A] transition">TRANG CHỦ</a>
            <a href="#" class="text-sm font-bold text-white hover:text-[#E8634A] transition">CỬA HÀNG</a>
            <a href="#" class="text-sm font-bold text-white hover:text-[#E8634A] transition">THIẾT KẾ 3D</a>
            <a href="#" class="text-sm font-bold text-white hover:text-[#E8634A] transition">LIÊN HỆ</a>
          </nav>

          <!-- 3. Cụm Actions (Tìm kiếm, Giỏ hàng, Auth) -->
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
               
               <!-- Khu vực User (Dropdown khi click vào Avatar) -->
               <div class="ml-2 flex items-center">
                 <el-dropdown trigger="click" @command="handleUserAction">
                   <div class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-tr from-[#E8634A] to-[#FBB830] text-sm font-bold text-white shadow-md transition hover:scale-105 outline-none">
                     NK
                   </div>
                   <template #dropdown>
                     <el-dropdown-menu class="w-48 rounded-xl">
                       <el-dropdown-item command="profile">Hồ sơ cá nhân</el-dropdown-item>
                       <el-dropdown-item command="orders">Đơn hàng của tôi</el-dropdown-item>
                       <el-dropdown-item divided command="logout" class="text-red-500 font-semibold hover:bg-red-50">
                         Đăng xuất
                       </el-dropdown-item>
                     </el-dropdown-menu>
                   </template>
                 </el-dropdown>
               </div>

            </div>
          </div>
        </div>
      </header>

      <!-- Nội dung chính của Hero -->
      <div class="relative w-full h-full flex flex-col items-center justify-center pt-24 pb-12">
        <div class="max-w-2xl space-y-4 text-center px-6 sm:px-8 mt-10">
          <span class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-wider font-semibold text-[#FBB830] backdrop-blur-sm border border-white/20">
            <span class="h-2 w-2 rounded-full bg-[#FBB830] animate-pulse"></span>
            Bánh hàng thủ công
          </span>
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-display font-black leading-tight uppercase drop-shadow-lg">Tiệm bánh<br>dễ thương</h1>
          <p class="max-w-xl text-base text-white/90 sm:text-lg mx-auto drop-shadow">Thưởng thức hương vị ngọt ngào từ những chiếc bánh handmade được làm với tình yêu thương.</p>
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center justify-center pt-4">
            <RouterLink to="/shop" class="inline-flex items-center justify-center rounded-full bg-[#E8634A] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#E8634A]/40 hover:bg-[#f37356] hover:-translate-y-1 transition-all duration-300">ĐẶT BÁNH NGAY</RouterLink>
            <button class="inline-flex items-center justify-center rounded-full border-2 border-white/60 bg-white/5 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">THIẾT KẾ 3D ✨</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Explorer -->
    <div class="space-y-8 px-4 sm:px-6 lg:px-8 mt-12 mb-20 max-w-7xl mx-auto">
      <section class="space-y-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 class="text-3xl font-black text-[#1E2A3B]">Quản lý sản phẩm</h2>
            <p class="text-gray-500 mt-1 text-sm font-medium">8 sản phẩm · 7 đang bán</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button v-for="cat in categories" :key="cat" @click="activeCategory = cat"
              :class="activeCategory === cat ? 'bg-[#E8634A] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#E8634A] hover:text-[#E8634A]'"
              class="rounded-full px-5 py-2 text-sm font-semibold transition-all">
              {{ cat }}
            </button>
          </div>
        </div>

        <div class="grid gap-4 lg:grid-cols-[1.5fr_0.75fr] items-center">
          <div class="relative rounded-full border border-gray-200 bg-white px-5 py-3 shadow-sm transition-all focus-within:border-[#E8634A] focus-within:ring-2 focus-within:ring-[#E8634A]/20">
            <el-icon class="text-[#E8634A] absolute left-5 top-1/2 -translate-y-1/2"><Search /></el-icon>
            <input v-model="search" type="text" placeholder="Tìm sản phẩm yêu thích..." class="w-full border-none bg-transparent pl-8 text-sm text-[#334155] outline-none placeholder:text-gray-400" />
          </div>
          <div class="flex flex-col gap-3 sm:flex-row">
            <button class="flex-1 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#475569] hover:border-[#E8634A] hover:text-[#E8634A] transition-colors shadow-sm">Bán chạy nhất</button>
            <button class="flex-1 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#475569] hover:border-[#E8634A] hover:text-[#E8634A] transition-colors shadow-sm">Mới nhất</button>
          </div>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 pt-4">
          <div v-for="product in displayedProducts" :key="product.id" class="group overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl">
            <div class="relative h-56 overflow-hidden bg-slate-50">
              <img :src="product.image" :alt="product.name" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div class="absolute left-4 top-4 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-xs font-bold text-[#E8634A] shadow-sm">{{ product.label }}</div>
            </div>
            <div class="p-5 space-y-4">
              <div>
                <h3 class="text-lg font-bold text-[#1E2A3B] line-clamp-1">{{ product.name }}</h3>
                <p class="text-xs text-gray-500 mt-1 font-medium">{{ product.category }} · {{ product.soldCount }} đã bán</p>
              </div>
              <div class="flex items-center justify-between gap-3">
                <div>
                  <div class="text-lg font-black text-[#E8634A]">{{ product.price }}</div>
                  <div v-if="product.originalPrice" class="text-xs text-gray-400 line-through font-medium">{{ product.originalPrice }}</div>
                </div>
                <div class="flex items-center gap-1 text-sm text-[#1E2A3B] bg-gray-50 px-2 py-1 rounded-lg">
                  <span class="text-[#FBB830]">★</span><span class="font-bold">{{ product.rating }}</span>
                </div>
              </div>
              <button class="w-full rounded-xl bg-[#FFF0EC] text-[#E8634A] px-4 py-3 text-sm font-bold transition-colors hover:bg-[#E8634A] hover:text-white mt-2">Xem chi tiết</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ShoppingCart } from '@element-plus/icons-vue'
import heroImage from '@/assets/images/Screenshot 2026-06-17 151209.png'

const router = useRouter()
const search = ref('')
const activeCategory = ref('Tất cả')
const categories = ['Tất cả', 'Bánh sinh nhật', 'Bánh cưới', 'Cupcake', 'Mousse', 'Macaron']

const products = [
  { id: 1, name: 'Bánh sinh nhật 3D Custom', category: 'Bánh sinh nhật', price: '2,500,000đ', originalPrice: null, soldCount: 128, rating: 4.9, image: 'https://images.unsplash.com/photo-1542821298-0bb848916421?auto=format&fit=crop&w=800&q=80', label: 'Bán chạy' },
  { id: 2, name: 'Cupcake set 12 mix', category: 'Cupcake', price: '350,000đ', originalPrice: '420,000đ', soldCount: 96, rating: 4.8, image: 'https://images.unsplash.com/photo-1520186994236-a332a9a6da5b?auto=format&fit=crop&w=800&q=80', label: 'Ưu đãi' },
  { id: 3, name: 'Bánh mousse chanh leo', category: 'Mousse', price: '520,000đ', originalPrice: null, soldCount: 72, rating: 4.7, image: 'https://images.unsplash.com/photo-1489945052260-4f21c52268b9?auto=format&fit=crop&w=800&q=80', label: 'Mới' },
  { id: 4, name: 'Macaron hộp 24', category: 'Macaron', price: '480,000đ', originalPrice: '550,000đ', soldCount: 64, rating: 4.8, image: 'https://images.unsplash.com/photo-1613904874392-1f9dac2c71ce?auto=format&fit=crop&w=800&q=80', label: 'Bán chạy' }
]

const displayedProducts = computed(() => {
  return products.filter((item) => {
    const matchesCategory = activeCategory.value === 'Tất cả' || item.category === activeCategory.value
    const matchesSearch = item.name.toLowerCase().includes(search.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

const handleUserAction = (command) => {
  if (command === 'logout') {
    // Chỉ xử lý giao diện: Đẩy thẳng người dùng về trang Đăng nhập
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/profile')
  } else if (command === 'orders') {
    router.push('/orders')
  }
}
</script>