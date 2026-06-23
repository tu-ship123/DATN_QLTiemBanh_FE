<template>
  <div class="flex min-h-screen bg-[#FFF8F4]">
    <div
      v-if="sidebarOpen && isMobile"
      class="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
      @click="sidebarOpen = false"
    />

    <aside
      class="sidebar w-[264px] bg-white border-r border-[#EDE8E3] shadow-[2px_0_20px_rgba(0,0,0,0.02)] h-screen fixed top-0 left-0 flex flex-col z-50 transition-transform duration-300 ease-in-out"
      :class="{ '-translate-x-full': !sidebarOpen && isMobile }"
    >
      <div class="flex items-center gap-3 px-6 py-5 border-b border-[#EDE8E3] shrink-0">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8634A] to-[#FBB830] flex items-center justify-center shadow-lg shadow-[#E8634A]/20">
          <iconify-icon icon="ph:storefront-duotone" class="text-2xl text-white"></iconify-icon>
        </div>
        <div>
          <div class="font-display font-black text-lg text-[#1E2A3B] leading-tight">Polycake</div>
          <div class="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B0A8A3]">Staff Area</div>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        <p class="text-[10px] font-bold tracking-widest uppercase text-[#B0A8A3] px-3 pb-2 pt-1">Nhân viên</p>

        <RouterLink
          v-for="item in staffMenu"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl cursor-pointer transition-all duration-200 group relative text-sm font-semibold text-[#5A6474] hover:bg-[#FFF0EC] hover:text-[#E8634A]"
          :class="{ 'bg-gradient-to-r from-[#E8634A] to-[#F57858] text-white shadow-md shadow-[#E8634A]/20 hover:bg-none hover:text-white': isActive(item.path) }"
          @click="isMobile && (sidebarOpen = false)"
        >
          <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
               :class="isActive(item.path) ? 'bg-white/20' : 'bg-[#F5F0ED] group-hover:bg-white'">
            <iconify-icon :icon="item.icon" class="text-[18px]"></iconify-icon>
          </div>
          <span class="flex-1">{{ item.label }}</span>
          <span v-if="item.badge" 
                class="px-2 py-0.5 rounded-full text-[10px] font-bold min-w-[20px] text-center"
                :class="isActive(item.path) ? 'bg-white/25 text-white' : 'bg-[#E8634A] text-white'">
            {{ item.badge }}
          </span>
        </RouterLink>


      </nav>

      <div class="p-3 border-t border-[#EDE8E3] shrink-0 bg-white">
        <div class="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors hover:bg-[#FFF0EC]">
          <div class="w-10 h-10 rounded-xl bg-[#FBB830] text-white text-sm font-bold flex items-center justify-center shrink-0">
            NV
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-bold truncate text-[#1E2A3B]">Nguyễn Văn A</div>
            <div class="text-[11px] font-black uppercase tracking-wider text-[#E8634A]">Nhân viên</div>
          </div>
          <el-dropdown trigger="click">
            <button class="p-1.5 rounded-lg hover:bg-white text-gray-400 transition-colors shadow-sm border border-transparent hover:border-gray-200">
              <el-icon><MoreFilled /></el-icon>
            </button>
            <template #dropdown>
              <el-dropdown-menu class="w-48 rounded-xl font-sans">
                <el-dropdown-item><iconify-icon icon="ph:user-circle" class="mr-2 text-lg"></iconify-icon>Hồ sơ cá nhân</el-dropdown-item>
                <el-dropdown-item divided @click="$router.push('/login')" class="text-red-500 font-semibold hover:bg-red-50">
                  <iconify-icon icon="ph:sign-out" class="mr-2 text-lg"></iconify-icon>Đăng xuất
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col md:ml-[264px] min-h-screen transition-all duration-300">
      <header class="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#EDE8E3] h-[72px] px-6 flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <button
            v-if="isMobile"
            class="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-[#FFF0EC] hover:text-[#E8634A] transition-colors border border-gray-100"
            @click="sidebarOpen = !sidebarOpen"
          >
            <iconify-icon icon="ph:list" class="text-xl"></iconify-icon>
          </button>

          <el-breadcrumb separator="/" class="hidden sm:block">
            <el-breadcrumb-item
              v-for="(crumb, i) in currentBreadcrumb"
              :key="i"
            >
              <span
                class="transition-colors"
                :class="i < currentBreadcrumb.length - 1 ? 'text-[#6B7280] text-sm hover:text-[#E8634A]' : 'text-sm font-bold text-[#1E2A3B]'"
              >
                {{ i === 0 ? '🏠 ' + crumb : crumb }}
              </span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="flex items-center gap-3">
          <el-badge :value="2" :max="9" class="mt-1">
            <button class="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-[#FFF0EC] hover:text-[#E8634A] hover:border-[#E8634A]/30 transition-all text-gray-500 shadow-sm">
              <iconify-icon icon="ph:bell-duotone" class="text-xl"></iconify-icon>
            </button>
          </el-badge>
        </div>
      </header>

      <main class="flex-1 p-6 max-w-[1600px] w-full mx-auto">
        <RouterView v-slot="{ Component, route }">
          <Transition name="fade-slide" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'
import { MoreFilled } from '@element-plus/icons-vue'

const route  = useRoute()
const router = useRouter()

const sidebarOpen = ref(true)
const isMobile    = ref(false)
const staffMenu = [
  { path: '/staff-area/checkin',  icon: 'ph:fingerprint-duotone',  label: 'Chấm công' },
  { path: '/staff-area/orders',   icon: 'ph:receipt-duotone',      label: 'Quản lý đơn hàng' },
  { path: '/staff-area/bakery',   icon: 'ph:cake-duotone',         label: 'Tiệm Bánh' },
  { path: '/staff-area/shipper',  icon: 'ph:motorcycle-duotone',   label: 'Giao Hàng' },
  { path: '/staff-area/products', icon: 'ph:shopping-bag-duotone', label: 'Danh sách bánh' },
  { path: '/staff-area/pos',      icon: 'ph:storefront-duotone',   label: 'Bán hàng tại quầy' },
]

const currentBreadcrumb = computed(
  () => route.meta?.breadcrumb ?? ['Trang chủ']
)

const isActive = (path) => route.path.startsWith(path)


function checkMobile() {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) sidebarOpen.value = false
  else sidebarOpen.value = true
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => window.removeEventListener('resize', checkMobile))
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E5E7EB;
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #D1D5DB;
}

/* Page Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>