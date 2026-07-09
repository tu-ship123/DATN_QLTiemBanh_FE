<template>
  <div class="chocopine-admin flex min-h-screen bg-[#FFFBF5]">

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen && isMobile"
      class="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
      @click="sidebarOpen = false"
    />

    <!-- ===== SIDEBAR ===== -->
    <aside
      class="sidebar w-[260px] bg-white border-r border-[#EDE0CC] h-screen fixed top-0 left-0 flex flex-col z-50 transition-transform duration-300 ease-in-out"
      :class="{ '-translate-x-full': !sidebarOpen && isMobile }"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-5 py-4 border-b border-[#EDE0CC] shrink-0">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7A5C3A] to-[#B8956A] flex items-center justify-center shadow-md shadow-[#7A5C3A]/20">
          <iconify-icon icon="ph:cake-duotone" class="text-xl text-white" />
        </div>
        <div>
          <div class="brand-script-admin">Chocopine</div>
          <div class="text-[9px] font-bold tracking-[0.2em] uppercase text-[#A68B5C]">Admin</div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto px-3 py-3 custom-scrollbar">

        <p class="nav-section-label">Menu Chính</p>

        <RouterLink
          v-for="item in mainMenu"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ 'nav-item--active': isActive(item.path) }"
          @click="isMobile && (sidebarOpen = false)"
        >
          <div class="nav-icon" :class="isActive(item.path) ? 'nav-icon--active' : ''">
            <iconify-icon :icon="item.icon" class="text-[17px]" />
          </div>
          <span class="flex-1 text-sm">{{ item.label }}</span>
          <span
            v-if="item.badgeKey"
            class="nav-badge"
            :class="isActive(item.path) ? 'nav-badge--active' : ''"
          >
            {{ badges[item.badgeKey] ?? '' }}
          </span>
        </RouterLink>

        <p class="nav-section-label mt-4">Kho & Marketing</p>

        <RouterLink
          v-for="item in secondMenu"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ 'nav-item--active': isActive(item.path) }"
          @click="isMobile && (sidebarOpen = false)"
        >
          <div class="nav-icon" :class="isActive(item.path) ? 'nav-icon--active' : ''">
            <iconify-icon :icon="item.icon" class="text-[17px]" />
          </div>
          <span class="flex-1 text-sm">{{ item.label }}</span>
        </RouterLink>

        <p class="nav-section-label mt-4">Hệ Thống</p>

        <RouterLink
          v-for="item in systemMenu"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ 'nav-item--active': isActive(item.path) }"
          @click="isMobile && (sidebarOpen = false)"
        >
          <div class="nav-icon" :class="isActive(item.path) ? 'nav-icon--active' : ''">
            <iconify-icon :icon="item.icon" class="text-[17px]" />
          </div>
          <span class="flex-1 text-sm">{{ item.label }}</span>
        </RouterLink>

      </nav>

      <!-- User footer -->
      <div class="p-3 border-t border-[#EDE0CC] shrink-0 bg-white">
        <div class="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors hover:bg-[#FDF6EC]">
          <div
            class="w-9 h-9 rounded-xl text-white text-[11px] font-bold flex items-center justify-center shrink-0"
            :style="{ background: avatarBg }"
          >
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-[13px] font-bold truncate text-[#5C4428]">{{ displayName }}</div>
            <div class="text-[10px] font-black uppercase tracking-wider text-[#7A5C3A]">{{ displayRole }}</div>
          </div>
          <el-dropdown trigger="click">
            <button class="p-1.5 rounded-lg hover:bg-white text-gray-400 transition-colors border border-transparent hover:border-gray-200">
              <el-icon><MoreFilled /></el-icon>
            </button>
            <template #dropdown>
              <el-dropdown-menu class="w-48 rounded-xl font-sans">
                <el-dropdown-item>
                  <iconify-icon icon="ph:user-circle" class="mr-2 text-lg" />Hồ sơ cá nhân
                </el-dropdown-item>
                <el-dropdown-item>
                  <iconify-icon icon="ph:lock-key" class="mr-2 text-lg" />Đổi mật khẩu
                </el-dropdown-item>
                <el-dropdown-item divided class="text-red-500 font-semibold hover:bg-red-50" @click="handleLogout">
                  <iconify-icon icon="ph:sign-out" class="mr-2 text-lg" />Đăng xuất
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </aside>

    <!-- ===== MAIN AREA ===== -->
    <div class="flex-1 flex flex-col md:ml-[260px] min-h-screen transition-all duration-300">

      <header class="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#EDE0CC] h-[68px] px-5 flex items-center justify-between gap-4">

        <div class="flex items-center gap-3">
          <button
            v-if="isMobile"
            class="p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-[#FDF6EC] hover:text-[#7A5C3A] transition-colors border border-gray-100"
            @click="sidebarOpen = !sidebarOpen"
          >
            <iconify-icon icon="ph:list" class="text-xl" />
          </button>

          <el-breadcrumb separator="/" class="hidden sm:block">
            <el-breadcrumb-item v-for="(crumb, i) in currentBreadcrumb" :key="i">
              <span
                class="transition-colors inline-flex items-center gap-1.5"
                :class="i < currentBreadcrumb.length - 1
                  ? 'text-[#9A7650] text-sm hover:text-[#7A5C3A] cursor-pointer'
                  : 'text-sm font-bold text-[#5C4428]'"
              >
                <iconify-icon v-if="i === 0" icon="ph:house-duotone" class="text-base text-[#7A5C3A]"></iconify-icon>
                {{ crumb }}
              </span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="flex items-center gap-2.5">
          <div class="hidden lg:flex items-center gap-2 bg-[#FDF8F2] border border-[#EDE0CC] rounded-xl px-3 py-2 w-[260px] focus-within:border-[#7A5C3A] focus-within:ring-2 focus-within:ring-[#7A5C3A]/20 transition-all">
            <iconify-icon icon="ph:magnifying-glass" class="text-[#A68B5C] text-lg" />
            <input
              type="text"
              placeholder="Tìm kiếm nhanh..."
              class="bg-transparent border-none outline-none w-full text-sm text-[#5C4428] placeholder-[#A68B5C]"
            />
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#EDE0CC] text-[#A68B5C] font-mono font-bold shadow-sm">⌘K</span>
          </div>

          <el-badge :value="pendingOrderCount || null" :max="99" class="mt-1">
            <button class="w-10 h-10 rounded-xl bg-white border border-[#EDE0CC] flex items-center justify-center hover:bg-[#FDF6EC] hover:text-[#7A5C3A] hover:border-[#7A5C3A]/30 transition-all text-[#9A7650]">
              <iconify-icon icon="ph:bell-duotone" class="text-xl" />
            </button>
          </el-badge>

          <div class="h-5 w-px bg-[#EDE0CC] mx-0.5 hidden sm:block" />

          <button
            class="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#7A5C3A] to-[#9A7650] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#7A5C3A]/25 hover:shadow-[#7A5C3A]/40 hover:-translate-y-0.5 transition-all"
            @click="handleAddNew"
          >
            <iconify-icon icon="ph:plus-bold" class="text-base" />
            <span>Thêm mới</span>
          </button>
        </div>
      </header>

      <main class="flex-1 p-5 max-w-[1600px] w-full mx-auto">
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
import apiClient from '@/services/apiService'

const route     = useRoute()
const router    = useRouter()
const authStore = useAuthStore()

const sidebarOpen = ref(true)
const isMobile    = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth < 768
  sidebarOpen.value = !isMobile.value
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  loadPendingCount()
})
onUnmounted(() => window.removeEventListener('resize', checkMobile))

const displayName = computed(() => {
  const u = authStore.user
  return u?.tenNguoiDung || u?.hoTen || u?.name || u?.email?.split('@')[0] || 'Admin'
})

const displayRole = computed(() => {
  const role = authStore.userRole || ''
  const map = {
    ROLE_ADMIN:      'Super Admin',
    ADMIN:           'Super Admin',
    ROLE_NHAN_VIEN:  'Nhân viên',
    NHAN_VIEN:       'Nhân viên',
    ROLE_KHACH_HANG: 'Khách hàng',
  }
  return map[role] || role || 'Admin'
})

const userInitials = computed(() => {
  const name = displayName.value
  const words = name.trim().split(' ').filter(Boolean)
  if (words.length >= 2) return (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
})

const avatarBg = computed(() => {
  const role = authStore.userRole || ''
  if (role.includes('ADMIN')) return 'linear-gradient(135deg, #5C4428, #7A5C3A)'
  if (role.includes('NHAN_VIEN')) return 'linear-gradient(135deg, #7A5C3A, #9A7650)'
  return '#9A7650'
})

const pendingOrderCount = ref(null)

async function loadPendingCount() {
  try {
    const res = await apiClient.get('/api/v1/admin/dashboard')
    const d = res.data
    pendingOrderCount.value = d?.donChoXacNhan ?? d?.tongDon ?? null
  } catch {
    pendingOrderCount.value = null
  }
}

const badges = computed(() => ({
  orders: pendingOrderCount.value,
}))

const mainMenu = [
  { path: '/admin/dashboard',  icon: 'ph:squares-four-duotone',         label: 'Tổng quan'             },
  { path: '/admin/orders',     icon: 'ph:receipt-duotone',               label: 'Quản lý đơn hàng', badgeKey: 'orders' },
  { path: '/admin/customers',  icon: 'ph:users-duotone',                 label: 'Khách hàng'            },
  { path: '/admin/staff',      icon: 'ph:users-three-duotone',           label: 'Nhân sự & Phân quyền' },
  { path: '/admin/products',   icon: 'ph:cake-duotone',                  label: 'Sản phẩm'              },
  { path: '/admin/reviews',    icon: 'ph:star-duotone',                  label: 'Đánh giá'              },
  { path: '/admin/analytics',  icon: 'ph:chart-line-up-duotone',         label: 'Phân tích'             },
  { path: '/admin/reports',    icon: 'ph:chart-pie-slice-duotone',       label: 'Báo cáo'               },
  { path: '/admin/messages',   icon: 'ph:chat-teardrop-dots-duotone',    label: 'Tin nhắn'              },
  { path: '/admin/categories', icon: 'ph:tag-duotone',                   label: 'Danh mục'              },
  { path: '/admin/payroll',    icon: 'ph:money-wavy-duotone',            label: 'Lương thưởng'          },
]

const secondMenu = [
  { path: '/admin/inventory',       icon: 'ph:package-duotone',            label: 'Kho hàng'              },
  { path: '/admin/inventory-alert', icon: 'ph:warning-circle-duotone',     label: 'Cảnh báo tồn kho'      },
  { path: '/admin/purchase-order',  icon: 'ph:shopping-cart-simple-duotone', label: 'Đặt hàng nhập kho'   },
  { path: '/admin/decor-items',     icon: 'ph:sparkle-duotone',            label: 'Phụ kiện trang trí'    },
  { path: '/admin/vouchers',        icon: 'ph:ticket-duotone',             label: 'Voucher & Khuyến mãi'  },
]

const systemMenu = [
  { path: '/admin/settings',          icon: 'ph:gear-duotone',            label: 'Cài đặt'            },
  { path: '/admin/security-settings', icon: 'ph:shield-check-duotone',    label: 'Bảo mật'            },
  { path: '/admin/backup',            icon: 'ph:database-duotone',        label: 'Sao lưu & Phục hồi' },
  { path: '/admin/audit-log',         icon: 'ph:clock-countdown-duotone', label: 'Nhật ký hoạt động'  },
  { path: '/admin/health-check',      icon: 'ph:heartbeat-duotone',       label: 'Giám sát hệ thống'  },
  { path: '/admin/rbac',              icon: 'ph:lock-key-duotone',        label: 'Phân quyền (RBAC)'  },
  { path: '/admin/webhook',           icon: 'ph:webhooks-logo-duotone',   label: 'Webhook'            },
]

const currentBreadcrumb = computed(() => route.meta?.breadcrumb ?? ['Trang chủ'])

const isActive = (path) => route.path === path || route.path.startsWith(path + '/')

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

function handleAddNew() {
  window.dispatchEvent(new CustomEvent('open-add-modal'))
}
</script>

<style scoped>
.brand-script-admin {
  font-family: 'Great Vibes', cursive;
  font-size: 26px;
  line-height: 1;
  color: #5C4428;
}

.custom-scrollbar::-webkit-scrollbar       { width: 3px }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #EDE0CC; border-radius: 10px }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #D4C4A8 }

.nav-section-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: #A68B5C;
  padding: 0 10px 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  margin-bottom: 2px;
  border-radius: 12px;
  cursor: pointer;
  transition: background .15s, color .15s;
  font-size: 13px;
  font-weight: 600;
  color: #9A7650;
  text-decoration: none;
}
.nav-item:hover {
  background: #FDF6EC;
  color: #7A5C3A;
}
.nav-item--active {
  background: linear-gradient(135deg, #7A5C3A, #9A7650);
  color: #fff;
}
.nav-item--active:hover {
  background: linear-gradient(135deg, #7A5C3A, #9A7650);
  color: #fff;
}

.nav-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #FDF8F2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background .15s;
}
.nav-item:hover .nav-icon { background: #fff }
.nav-icon--active          { background: rgba(255,255,255,0.2) }

.nav-badge {
  padding: 2px 6px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  min-width: 20px;
  text-align: center;
  background: #7A5C3A;
  color: #fff;
}
.nav-badge--active { background: rgba(255,255,255,0.25); color: #fff }

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all .22s cubic-bezier(.4,0,.2,1);
}
.fade-slide-enter-from { opacity: 0; transform: translateY(8px) }
.fade-slide-leave-to   { opacity: 0; transform: translateY(-6px) }
</style>