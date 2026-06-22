<template>
  <div class="min-h-screen flex flex-col bg-[#FFF8F4]">
    <header :class="headerClass" class="transition-all duration-300">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <div class="flex items-center gap-8">
          <RouterLink to="/shop" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8634A] to-[#FBB830] flex items-center justify-center shadow-lg shadow-[#E8634A]/20 transition-transform group-hover:scale-105">
              <iconify-icon icon="ph:storefront-duotone" class="text-2xl text-white"></iconify-icon>
            </div>
            <div class="flex flex-col">
              <span class="font-display font-black text-xl tracking-wider transition-colors" :class="isShop ? 'text-white' : 'text-[#1E2A3B]'">Polycake.</span>
              <span class="text-[10px] font-bold uppercase tracking-widest text-[#E8634A]">Cửa hàng bánh</span>
            </div>
          </RouterLink>

          <nav class="hidden md:flex items-center gap-8 ml-4">
            <RouterLink to="/shop" :class="linkClass">Trang chủ</RouterLink>
            <RouterLink to="/shop/products" :class="linkClass">Cửa hàng</RouterLink>
            <RouterLink to="/shop/design" :class="linkClass">Thiết kế 3D</RouterLink>
            <RouterLink to="/shop/contact" :class="linkClass">Liên hệ</RouterLink>
          </nav>
        </div>

        <div class="flex items-center gap-4">
          <RouterLink to="/shop/cart" class="relative mt-1">
            <el-badge :value="cartCount" :max="99">
              <button class="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm"
                      :class="isShop ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' : 'bg-white text-gray-500 hover:bg-[#FFF0EC] hover:text-[#E8634A] border border-gray-200'">
                <iconify-icon icon="ph:shopping-cart-duotone" class="text-xl"></iconify-icon>
              </button>
            </el-badge>
          </RouterLink>

          <div class="h-6 w-px mx-1 hidden sm:block" :class="isShop ? 'bg-white/20' : 'bg-gray-200'"></div>

          <div class="hidden md:flex items-center gap-3">
            <el-dropdown trigger="click" @command="handleUserAction">
              <div class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-[#1E2A3B] text-sm font-bold text-white shadow-md transition-transform hover:scale-105 outline-none">
                {{ avatarInitials }}
              </div>
              <template #dropdown>
                <el-dropdown-menu class="w-52 rounded-xl font-sans">
                  <div class="px-4 py-3 border-b border-gray-100 mb-1">
                    <p class="text-sm font-bold text-gray-800">{{ displayName }}</p>
                    <p class="text-xs text-gray-500 font-medium truncate">{{ authStore.user?.email }}</p>
                  </div>
                  <el-dropdown-item command="profile"><iconify-icon icon="ph:user-circle" class="mr-2 text-lg text-gray-400"></iconify-icon>Hồ sơ của tôi</el-dropdown-item>
                  <el-dropdown-item command="orders"><iconify-icon icon="ph:receipt" class="mr-2 text-lg text-gray-400"></iconify-icon>Đơn hàng đã mua</el-dropdown-item>
                  <el-dropdown-item divided command="logout" class="text-red-500 font-semibold hover:bg-red-50 mt-1">
                    <iconify-icon icon="ph:sign-out" class="mr-2 text-lg"></iconify-icon>Đăng xuất
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <button class="md:hidden p-2 rounded-xl transition-colors"
                  :class="isShop ? 'text-white bg-white/10 hover:bg-white/20' : 'text-gray-600 bg-gray-50 hover:bg-gray-100'"
                  @click="mobileOpen = !mobileOpen">
            <iconify-icon icon="ph:list" class="text-2xl"></iconify-icon>
          </button>
        </div>
      </div>

      <div v-if="mobileOpen" class="md:hidden absolute w-full left-0 shadow-xl" :class="mobileMenuClass">
        <div class="px-4 py-4 space-y-2">
          <RouterLink to="/shop" class="block rounded-xl px-4 py-3 text-sm font-bold transition-colors" :class="mobileLinkClass">Trang chủ</RouterLink>
          <RouterLink to="/shop/products" class="block rounded-xl px-4 py-3 text-sm font-bold transition-colors" :class="mobileLinkClass">Cửa hàng</RouterLink>
          <RouterLink to="/shop/design" class="block rounded-xl px-4 py-3 text-sm font-bold transition-colors" :class="mobileLinkClass">Thiết kế 3D</RouterLink>
          <RouterLink to="/shop/contact" class="block rounded-xl px-4 py-3 text-sm font-bold transition-colors" :class="mobileLinkClass">Liên hệ</RouterLink>
          <div class="h-px w-full my-2" :class="isShop ? 'bg-white/10' : 'bg-gray-100'"></div>
          <RouterLink to="/login" class="block rounded-xl px-4 py-3 text-sm font-bold transition-colors" :class="mobileLinkClass">Đăng nhập / Đăng ký</RouterLink>
        </div>
      </div>
    </header>

    <main class="flex-1 w-full flex flex-col" :class="isShop ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20'">
      <RouterView v-slot="{ Component, route }">
        <Transition name="fade-slide" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <footer class="w-full bg-white border-t border-[#EDE8E3] mt-auto">
      <div class="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <iconify-icon icon="ph:storefront-duotone" class="text-xl text-[#E8634A]"></iconify-icon>
          <span class="text-sm font-bold text-[#1E2A3B]">© 2026 Polycake.</span>
          <span class="text-sm font-medium text-gray-500">All rights reserved.</span>
        </div>
        <div class="flex items-center gap-6 text-sm font-semibold text-gray-500">
          <RouterLink to="/shop" class="hover:text-[#E8634A] transition-colors">Về chúng tôi</RouterLink>
          <RouterLink to="/shop" class="hover:text-[#E8634A] transition-colors">Điều khoản</RouterLink>
          <RouterLink to="/shop/contact" class="hover:text-[#E8634A] transition-colors">Liên hệ</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const mobileOpen = ref(false)

const cartStore = useCartStore()
const authStore = useAuthStore()

// Badge số lượng lấy thẳng từ cartStore (reactive)
const cartCount = computed(() => cartStore.soLuongBadge)

// Tên hiển thị & avatar chữ cái
const displayName = computed(() => authStore.user?.hoTen || authStore.user?.email || 'Khách')
const avatarInitials = computed(() => {
  const name = authStore.user?.hoTen || authStore.user?.email || 'K'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})

// Kiểm tra xem có đang ở trang chủ (chứa Hero banner) hay không
const isShop = computed(() => route.path === '/shop')

// Xử lý class động cho thanh Header
const headerClass = computed(() => isShop.value
  ? 'w-full absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10'
  : 'w-full fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#EDE8E3]')

const linkClass = computed(() => isShop.value
  ? 'text-sm font-bold text-white/90 hover:text-[#FBB830] transition-colors'
  : 'text-sm font-bold text-[#5A6474] hover:text-[#E8634A] transition-colors')

const mobileMenuClass = computed(() => isShop.value
  ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 top-20'
  : 'bg-white border-b border-gray-200 top-20')

const mobileLinkClass = computed(() => isShop.value
  ? 'text-white hover:bg-white/10'
  : 'text-[#1E2A3B] hover:bg-[#FFF0EC] hover:text-[#E8634A]')

// Xử lý sự kiện Dropdown Avatar
const handleUserAction = async (command) => {
  if (command === 'logout') {
    cartStore.resetCart()
    await authStore.logout()
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/profile')
  } else if (command === 'orders') {
    router.push('/shop/orders')
  }
}

// Load giỏ hàng khi layout mount (chỉ fetch khi là KHACH_HANG)
onMounted(async () => {
  if (authStore.isAuthenticated && authStore.isKhachHang) {
    await cartStore.fetchGioHang()
  }
})
</script>

<style scoped>
/* Page Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>