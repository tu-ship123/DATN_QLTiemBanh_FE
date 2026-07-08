<template>
  <div class="chocopine-admin flex min-h-screen bg-[#FFFBF5]">
    <div
      v-if="sidebarOpen && isMobile"
      class="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
      @click="sidebarOpen = false"
    />

    <aside
      class="sidebar w-[264px] bg-white border-r border-[#EDE0CC] shadow-[2px_0_20px_rgba(0,0,0,0.02)] h-screen fixed top-0 left-0 flex flex-col z-50 transition-transform duration-300 ease-in-out"
      :class="{ '-translate-x-full': !sidebarOpen && isMobile }"
    >
      <div class="flex items-center gap-3 px-6 py-5 border-b border-[#EDE0CC] shrink-0">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7A5C3A] to-[#B8956A] flex items-center justify-center shadow-lg shadow-[#7A5C3A]/20">
          <iconify-icon icon="ph:cake-duotone" class="text-2xl text-white"></iconify-icon>
        </div>
        <div>
          <div class="brand-script-staff">Chocopine</div>
          <div class="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A68B5C]">Staff Area</div>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        <p class="text-[10px] font-bold tracking-widest uppercase text-[#B0A8A3] px-3 pb-2 pt-1">Nhân viên</p>

        <RouterLink
          v-for="item in staffMenu"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl cursor-pointer transition-all duration-200 group relative text-sm font-semibold text-[#9A7650] hover:bg-[#FDF6EC] hover:text-[#7A5C3A]"
          :class="{ 'bg-gradient-to-r from-[#7A5C3A] to-[#9A7650] text-white shadow-md shadow-[#7A5C3A]/20 hover:bg-none hover:text-white': isActive(item.path) }"
          @click="isMobile && (sidebarOpen = false)"
        >
          <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
               :class="isActive(item.path) ? 'bg-white/20' : 'bg-[#FDF8F2] group-hover:bg-white'">
            <iconify-icon :icon="item.icon" class="text-[18px]"></iconify-icon>
          </div>
          <span class="flex-1">{{ item.label }}</span>
          <span v-if="item.badge" 
                class="px-2 py-0.5 rounded-full text-[10px] font-bold min-w-[20px] text-center"
                :class="isActive(item.path) ? 'bg-white/25 text-white' : 'bg-[#7A5C3A] text-white'">
            {{ item.badge }}
          </span>
        </RouterLink>


      </nav>

      <div class="p-3 border-t border-[#EDE0CC] shrink-0 bg-white">
        <div class="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors hover:bg-[#FDF6EC]">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7A5C3A] to-[#B8956A] text-white text-sm font-bold flex items-center justify-center shrink-0">
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-bold truncate text-[#5C4428]">{{ displayName }}</div>
            <div class="text-[11px] font-black uppercase tracking-wider text-[#7A5C3A]">Nhân viên</div>
          </div>
          <el-dropdown trigger="click">
            <button class="p-1.5 rounded-lg hover:bg-white text-gray-400 transition-colors shadow-sm border border-transparent hover:border-gray-200">
              <el-icon><MoreFilled /></el-icon>
            </button>
            <template #dropdown>
              <el-dropdown-menu class="w-48 rounded-xl font-sans">
                <el-dropdown-item><iconify-icon icon="ph:user-circle" class="mr-2 text-lg"></iconify-icon>Hồ sơ cá nhân</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout" class="text-red-500 font-semibold hover:bg-red-50">
                  <iconify-icon icon="ph:sign-out" class="mr-2 text-lg"></iconify-icon>Đăng xuất
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col md:ml-[264px] min-h-screen transition-all duration-300">
      <header class="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#EDE0CC] h-[72px] px-6 flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <button
            v-if="isMobile"
            class="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-[#FDF6EC] hover:text-[#7A5C3A] transition-colors border border-gray-100"
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
                class="transition-colors inline-flex items-center gap-1.5"
                :class="i < currentBreadcrumb.length - 1 ? 'text-[#9A7650] text-sm hover:text-[#7A5C3A]' : 'text-sm font-bold text-[#5C4428]'"
              >
                <iconify-icon v-if="i === 0" icon="ph:house-duotone" class="text-base text-[#7A5C3A]"></iconify-icon>
                {{ crumb }}
              </span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="flex items-center gap-3">
          <el-badge :value="2" :max="9" class="mt-1">
            <button class="w-10 h-10 rounded-xl bg-white border border-[#EDE0CC] flex items-center justify-center hover:bg-[#FDF6EC] hover:text-[#7A5C3A] hover:border-[#7A5C3A]/30 transition-all text-[#9A7650] shadow-sm">
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
import { useAuthStore } from '@/stores/authStore'

const route     = useRoute()
const router    = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const sidebarOpen = ref(true)
const isMobile    = ref(false)
const staffMenu = [
  { path: '/staff-area/checkin',   icon: 'ph:fingerprint-duotone',      label: 'Chấm công' },
  { path: '/staff-area/orders',    icon: 'ph:receipt-duotone',          label: 'Quản lý đơn hàng' },
  { path: '/staff-area/bakery',    icon: 'ph:cake-duotone',             label: 'Bếp bánh' },
  { path: '/staff-area/shipper',   icon: 'ph:motorcycle-duotone',       label: 'Giao Hàng' },
  { path: '/staff-area/products',  icon: 'ph:shopping-bag-duotone',     label: 'Danh sách bánh' },
  { path: '/staff-area/pos',       icon: 'ph:storefront-duotone',       label: 'Bán hàng tại quầy' },
  { path: '/staff-area/end-shift', icon: 'ph:flag-checkered-duotone',   label: 'Kết Ca – Báo cáo' },
  { path: '/staff-area/kiem-ke',   icon: 'ph:clipboard-text-duotone',   label: 'Kiểm Kê Cuối Ca' },
]

const currentBreadcrumb = computed(
  () => route.meta?.breadcrumb ?? ['Trang chủ']
)

const isActive = (path) => route.path.startsWith(path)

const displayName = computed(() => {
  const u = authStore.user
  return u?.tenNguoiDung || u?.hoTen || u?.name || u?.email?.split('@')[0] || 'Nhân viên'
})

const userInitials = computed(() => {
  const name = displayName.value
  const words = name.trim().split(' ').filter(Boolean)
  if (words.length >= 2) return (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
})

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
.brand-script-staff {
  font-family: 'Great Vibes', cursive;
  font-size: 28px;
  line-height: 1;
  color: #5C4428;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #EDE0CC;
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #D4C4A8;
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