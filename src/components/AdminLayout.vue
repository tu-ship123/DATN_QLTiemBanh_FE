<template>
  <div class="flex" style="min-height:100vh">
    <!-- Sidebar Overlay (mobile) -->
    <div
      v-if="sidebarOpen && isMobile"
      class="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
      @click="sidebarOpen = false"
    />

    <!-- ===== SIDEBAR ===== -->
    <aside
      class="sidebar"
      :class="{ '-translate-x-full': !sidebarOpen && isMobile }"
    >
      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">🎂</div>
        <div>
          <div class="font-display font-black text-[16px] leading-tight" style="color:#1E2A3B">Polycake</div>
          <div class="text-[11px] font-semibold tracking-widest uppercase" style="color:#B0A8A3">Workspace</div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <p class="nav-section-label">Menu Chính</p>

        <RouterLink
          v-for="item in mainMenu"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
          @click="isMobile && (sidebarOpen = false)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="flex-1 text-sm">{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </RouterLink>

        <p class="nav-section-label mt-3">Kho & Marketing</p>

        <RouterLink
          v-for="item in secondMenu"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
          @click="isMobile && (sidebarOpen = false)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="flex-1 text-sm">{{ item.label }}</span>
        </RouterLink>

        <p class="nav-section-label mt-3">Hệ Thống</p>

        <RouterLink
          to="/settings"
          class="nav-item"
          :class="{ active: isActive('/settings') }"
          @click="isMobile && (sidebarOpen = false)"
        >
          <span class="nav-icon">⚙️</span>
          <span class="flex-1 text-sm">Cài đặt</span>
        </RouterLink>
      </nav>

      <!-- Footer / User -->
      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar">TH</div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold truncate" style="color:#1E2A3B">Trần Hương</div>
            <div class="text-xs" style="color:#E8634A; font-weight:600">Super Admin</div>
          </div>
          <el-dropdown trigger="click">
            <button class="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition">
              <el-icon><MoreFilled /></el-icon>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>Hồ sơ cá nhân</el-dropdown-item>
                <el-dropdown-item>Đổi mật khẩu</el-dropdown-item>
                <el-dropdown-item divided @click="$router.push('/login')">
                  <span style="color:#EF4444">Đăng xuất</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </aside>

    <!-- ===== MAIN CONTENT ===== -->
    <div class="main-wrapper flex-1 flex flex-col">
      <!-- Top Header -->
      <header class="top-header">
        <div class="flex items-center gap-3">
          <!-- Mobile menu toggle -->
          <button
            v-if="isMobile"
            class="p-2 rounded-xl hover:bg-brand-100 transition"
            @click="sidebarOpen = !sidebarOpen"
          >
            <el-icon size="20"><Menu /></el-icon>
          </button>

          <!-- Breadcrumb -->
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              v-for="(crumb, i) in currentBreadcrumb"
              :key="i"
            >
              <span
                :class="i < currentBreadcrumb.length - 1 ? 'text-muted text-sm' : 'text-sm font-semibold'"
                :style="i === currentBreadcrumb.length - 1 ? 'color:#1E2A3B' : ''"
              >
                {{ i === 0 ? '🏠 ' + crumb : crumb }}
              </span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="flex items-center gap-2">
          <!-- Search -->
          <div class="search-input" v-if="!isMobile">
            <el-icon style="color:#B0A8A3"><Search /></el-icon>
            <input type="text" placeholder="Tìm kiếm..." />
            <span class="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 font-mono">⌘K</span>
          </div>

          <!-- Notifications -->
          <el-badge :value="5" :max="9" class="ml-1">
            <button class="w-10 h-10 rounded-xl bg-white border border-[var(--color-border)] flex items-center justify-center hover:bg-[#FFF0EC] transition">
              <el-icon size="18" style="color:#5A6474"><Bell /></el-icon>
            </button>
          </el-badge>

          <!-- Add New -->
          <button class="btn-primary" @click="handleAddNew">
            <el-icon><Plus /></el-icon>
            <span>Thêm mới</span>
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content flex-1">
        <RouterView v-slot="{ Component, route }">
          <Transition name="page" mode="out-in">
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

const route  = useRoute()
const router = useRouter()

const sidebarOpen = ref(true)
const isMobile    = ref(false)

const mainMenu = [
  { path: '/dashboard', icon: '📊', label: 'Tổng quan' },
  { path: '/orders',    icon: '🛍️', label: 'Quản lý đơn hàng', badge: 24 },
  { path: '/staff',     icon: '👥', label: 'Nhân sự & Phân quyền' },
  { path: '/products',  icon: '🎂', label: 'Sản phẩm' },
  { path: '/reviews',   icon: '⭐', label: 'Đánh giá' },
  { path: '/analytics', icon: '📈', label: 'Phân tích' },
  { path: '/messages',  icon: '💬', label: 'Tin nhắn', badge: 3 },
]

const secondMenu = [
  { path: '/inventory', icon: '📦', label: 'Kho hàng' },
  { path: '/vouchers',  icon: '🎫', label: 'Voucher & Khuyến mãi' },
]

const currentBreadcrumb = computed(
  () => route.meta?.breadcrumb ?? ['Trang chủ']
)

const isActive = (path) => route.path.startsWith(path)

function handleAddNew() {
  // Delegate to each page via a global event or store
  window.dispatchEvent(new CustomEvent('open-add-modal'))
}

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