<template>
  <div class="min-h-screen flex flex-col chocopine-theme">

    <header class="site-header fixed top-0 left-0 right-0 z-50">
      <div class="h-full max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-8">

        <RouterLink to="/shop" class="flex items-center gap-3 no-underline group" style="text-decoration:none;">
          <div style="width:40px;height:40px;flex-shrink:0;">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
              <circle cx="20" cy="20" r="19" stroke="#B8956A" stroke-width="1" stroke-dasharray="2 2"/>
              <path d="M20 9 C17 12, 13 14, 13 17 C13 21, 16 23, 20 23 C24 23, 27 21, 27 17 C27 14, 23 12, 20 9 Z" fill="#FFFBF5" stroke="#7A5C3A" stroke-width="1.2"/>
              <circle cx="20" cy="17" r="2.5" fill="#FBBF24"/>
              <path d="M15 22 C14 26, 17 29, 20 29 C23 29, 26 26, 25 22" stroke="#7A5C3A" stroke-width="1.2" stroke-linecap="round"/>
              <path d="M20 29 L20 32" stroke="#7A5C3A" stroke-width="1.2" stroke-linecap="round"/>
              <path d="M11 12 C10 13, 9 13, 9 12 C9 11, 10 11, 11 12 Z" fill="#9A7650" opacity="0.8"/>
              <path d="M29 27 C28 28, 27 28, 27 27 C27 26, 28 26, 29 27 Z" fill="#9A7650" opacity="0.8"/>
            </svg>
          </div>
          <div class="brand-text flex flex-col">
            <span class="brand-script brand-script--logo">Chocopine</span>
          </div>
        </RouterLink>

        <nav class="hidden md:flex items-center gap-9">
          <RouterLink to="/shop"
            :class="route.path === '/shop' ? 'nav-active' : 'nav-link'">
            Trang Chủ
          </RouterLink>
          <RouterLink to="/shop/products"
            :class="route.path.startsWith('/shop/products') ? 'nav-active' : 'nav-link'">
            Cửa Hàng
          </RouterLink>
          <RouterLink to="/shop/design"
            :class="route.path === '/shop/design' ? 'nav-active' : 'nav-link'">
            Thiết Kế 3D
          </RouterLink>
          <RouterLink to="/shop/contact"
            :class="route.path === '/shop/contact' ? 'nav-active' : 'nav-link'">
            Liên Hệ
          </RouterLink>
        </nav>

        <div class="flex items-center gap-5">
          <button class="icon-btn" title="Tìm kiếm">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          <RouterLink to="/shop/cart" class="icon-btn relative cart-link">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </RouterLink>

          <div class="header-divider hidden sm:block"></div>

          <div v-if="authStore.isAuthenticated" class="hidden md:block">
            <el-dropdown trigger="click" @command="handleUserAction">
              <div class="avatar-btn">
                {{ avatarInitials }}
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <div class="dropdown-header">
                    <p class="dropdown-name">{{ displayName }}</p>
                    <p class="dropdown-email">{{ authStore.user?.email }}</p>
                  </div>
                  <el-dropdown-item command="profile">Hồ sơ của tôi</el-dropdown-item>
                  <el-dropdown-item command="orders">Đơn hàng đã mua</el-dropdown-item>
                  <el-dropdown-item divided command="logout" class="dropdown-logout">Đăng xuất</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <RouterLink v-else to="/login" class="login-btn hidden md:block">
            Đăng Nhập
          </RouterLink>

          <button class="icon-btn md:hidden" @click="mobileOpen = !mobileOpen">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="mobileOpen" class="mobile-menu md:hidden absolute w-full animate-fade-in">
        <div class="mobile-menu-inner">
          <RouterLink to="/shop" @click="mobileOpen=false" class="mobile-nav-link">Trang Chủ</RouterLink>
          <RouterLink to="/shop/products" @click="mobileOpen=false" class="mobile-nav-link">Cửa Hàng</RouterLink>
          <RouterLink to="/shop/design" @click="mobileOpen=false" class="mobile-nav-link">Thiết Kế 3D</RouterLink>
          <RouterLink to="/shop/contact" @click="mobileOpen=false" class="mobile-nav-link">Liên Hệ</RouterLink>
          <RouterLink to="/login" @click="mobileOpen=false" class="mobile-nav-link mobile-nav-link--accent">Đăng Nhập</RouterLink>
        </div>
      </div>
    </header>

    <main class="site-main flex-1 w-full">
      <RouterView v-slot="{ Component, route: r }">
        <Transition name="fade-slide" mode="out-in">
          <component :is="Component" :key="r.path" />
        </Transition>
      </RouterView>
    </main>

    <footer class="site-footer px-6 md:px-16">
      <div class="footer-grid max-w-7xl mx-auto">

        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
              <circle cx="20" cy="20" r="19" stroke="#B8956A" stroke-width="1" opacity="0.6"/>
              <path d="M20 9 C17 12, 13 14, 13 17 C13 21, 16 23, 20 23 C24 23, 27 21, 27 17 C27 14, 23 12, 20 9 Z" fill="#FFFBF5" stroke="#7A5C3A" stroke-width="1.2"/>
              <circle cx="20" cy="17" r="2.5" fill="#FBBF24"/>
            </svg>
            <div class="brand-text">
              <div class="brand-script brand-script--sm">Chocopine</div>
            </div>
          </div>
          <p class="footer-desc">Mang đến những chiếc bánh thơm ngon, độc đáo nhất cho mọi dịp kỷ niệm của bạn.</p>
          <div style="display:flex;gap:10px;padding-top:4px;">
            <a href="#" class="footer-social"><iconify-icon icon="ri:facebook-fill"></iconify-icon></a>
            <a href="#" class="footer-social"><iconify-icon icon="ri:instagram-line"></iconify-icon></a>
            <a href="#" class="footer-social"><iconify-icon icon="ri:tiktok-fill"></iconify-icon></a>
          </div>
        </div>

        <div>
          <div class="footer-heading">Điều Hướng</div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <RouterLink to="/shop" class="footer-link">Trang chủ</RouterLink>
            <RouterLink to="/shop/products" class="footer-link">Cửa hàng sản phẩm</RouterLink>
            <RouterLink to="/shop/design" class="footer-link">Tự thiết kế bánh 3D</RouterLink>
            <RouterLink to="/shop/contact" class="footer-link">Liên hệ hỗ trợ</RouterLink>
          </div>
        </div>

        <div>
          <div class="footer-heading">Hỗ Trợ</div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <a href="#" class="footer-link">Chính sách giao nhận bánh</a>
            <a href="#" class="footer-link">Chính sách đổi trả & hoàn tiền</a>
            <a href="#" class="footer-link">Câu hỏi thường gặp (FAQs)</a>
            <RouterLink to="/shop/order-tracking" class="footer-link">Tra cứu đơn hàng</RouterLink>
          </div>
        </div>

        <div>
          <div class="footer-heading">Nhận Ưu Đãi Độc Quyền</div>
          <p class="footer-note">Đăng ký để nhận thông tin về bộ sưu tập mới và ưu đãi dành riêng cho thành viên.</p>
          <div class="newsletter-row">
            <input type="email" placeholder="Email của bạn..." class="newsletter-input" />
            <button class="newsletter-btn">Đăng ký</button>
          </div>
          <div class="footer-hint">Không spam · Chỉ nội dung giá trị</div>
        </div>
      </div>

      <div class="footer-bottom max-w-7xl mx-auto">
        <span class="footer-copy">
          © 2026 Chocopine. All rights reserved.
        </span>
        <span class="footer-tagline">Crafted with love</span>
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
  : 'w-full fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#EDE0CC]')

const linkClass = computed(() => isShop.value
  ? 'text-sm font-bold text-white/90 hover:text-[#FBB830] transition-colors'
  : 'text-sm font-bold text-[#5A6474] hover:text-[#7A5C3A] transition-colors')

const mobileMenuClass = computed(() => isShop.value
  ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 top-20'
  : 'bg-white border-b border-gray-200 top-20')

const mobileLinkClass = computed(() => isShop.value
  ? 'text-white hover:bg-white/10'
  : 'text-[#5C4428] hover:bg-[#FDF6EC] hover:text-[#7A5C3A]')

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
.chocopine-theme {
  --cream-white: #FFFBF5;
  --cream-white-soft: #FDF6EC;
  --cream-white-deep: #EDE0CC;
  --wheat-brown: #7A5C3A;
  --wheat-brown-dark: #5C4428;
  --wheat-brown-mid: #9A7650;
  --wheat-brown-light: #B8956A;
  --wheat-brown-pale: #E8D9C4;
  --font-script: 'Great Vibes', cursive;
  --font-sans: 'Nunito', sans-serif;

  font-family: var(--font-sans);
  color: var(--wheat-brown-dark);
  background: var(--cream-white);
}

.site-header {
  height: 68px;
  background: rgba(255, 251, 245, 0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--cream-white-deep);
}

.brand-text { line-height: 1.1; }
.brand-sans {
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: 15px;
  color: var(--wheat-brown-dark);
  letter-spacing: 0.08em;
  transition: color 0.25s;
}
.brand-sans--sm { font-size: 14px; }
.brand-script {
  font-family: var(--font-script);
  font-size: 26px;
  font-weight: 400;
  color: var(--wheat-brown);
  margin-top: 6px;
  line-height: 1.25;
  display: block;
}
.brand-script--logo {
  font-size: 34px;
  line-height: 1.1;
  margin-top: 0;
}
.brand-script--sm { font-size: 24px; margin-top: 0; }

.nav-link,
.nav-active {
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 12px;
  text-decoration: none;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transition: color 0.2s;
  position: relative;
}
.nav-link { color: var(--wheat-brown-mid); }
.nav-link:hover { color: var(--wheat-brown); }
.nav-active { color: var(--wheat-brown); }
.nav-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--wheat-brown);
  border-radius: 2px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--wheat-brown-mid);
  padding: 0;
  transition: color 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.icon-btn:hover { color: var(--wheat-brown); }

.cart-badge {
  position: absolute;
  top: -9px;
  right: -9px;
  background: var(--wheat-brown);
  color: var(--cream-white);
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 800;
  border-radius: 20px;
  padding: 1px 5px;
  min-width: 17px;
  text-align: center;
}

.header-divider {
  width: 1px;
  height: 18px;
  background: var(--cream-white-deep);
}

.avatar-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid var(--wheat-brown);
  color: var(--wheat-brown);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  letter-spacing: 0.5px;
  background: var(--cream-white-soft);
}

.login-btn {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 800;
  color: var(--wheat-brown);
  text-decoration: none;
  letter-spacing: 2px;
  text-transform: uppercase;
  border: 1px solid rgba(122, 92, 58, 0.35);
  border-radius: 10px;
  padding: 7px 16px;
  transition: all 0.2s;
}
.login-btn:hover { background: rgba(122, 92, 58, 0.08); }

.mobile-menu {
  top: 68px;
  left: 0;
  background: var(--cream-white);
  border-bottom: 1px solid var(--cream-white-deep);
  z-index: 100;
}
.mobile-menu-inner {
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-nav-link {
  display: block;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 700;
  color: var(--wheat-brown-mid);
  text-decoration: none;
  padding: 11px 16px;
  border-radius: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.2s;
}
.mobile-nav-link:hover {
  background: var(--cream-white-soft);
  color: var(--wheat-brown);
}
.mobile-nav-link--accent {
  border-top: 1px solid var(--cream-white-deep);
  margin-top: 4px;
  padding-top: 14px;
  color: var(--wheat-brown);
}

.site-main {
  margin-top: 68px;
  background: var(--cream-white);
}

.site-footer {
  background: var(--cream-white);
  padding: 64px 72px 32px;
  border-top: 1px solid var(--cream-white-deep);
}

.footer-grid {
  display: grid;
  gap: 40px;
  margin-bottom: 48px;
  grid-template-columns: 1fr;
}
@media (min-width: 640px) { .footer-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .footer-grid { grid-template-columns: repeat(4, 1fr); } }

.footer-desc,
.footer-note,
.footer-hint,
.footer-copy {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--wheat-brown-mid);
  line-height: 1.7;
  max-width: 220px;
}
.footer-note { max-width: none; font-size: 12px; margin: 0 0 16px; }
.footer-hint { font-size: 11px; font-style: italic; max-width: none; }

.footer-heading {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 800;
  color: var(--wheat-brown);
  margin-bottom: 20px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.footer-link {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  color: var(--wheat-brown-mid);
  text-decoration: none;
  transition: all 0.2s;
  display: block;
}
.footer-link:hover {
  color: var(--wheat-brown);
  padding-left: 6px;
}

.footer-social {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--cream-white-deep);
  background: var(--cream-white-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wheat-brown-mid);
  text-decoration: none;
  font-size: 15px;
  transition: all 0.2s;
}
.footer-social:hover {
  border-color: var(--wheat-brown);
  background: var(--wheat-brown);
  color: var(--cream-white);
  transform: translateY(-2px);
}

.newsletter-row {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}
.newsletter-input {
  flex: 1;
  border: 1px solid var(--cream-white-deep);
  background: var(--cream-white-soft);
  border-radius: 10px;
  padding: 11px 14px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--wheat-brown-dark);
  outline: none;
}
.newsletter-input:focus {
  border-color: var(--wheat-brown-pale);
  box-shadow: 0 0 0 3px rgba(122, 92, 58, 0.1);
}
.newsletter-btn {
  background: linear-gradient(135deg, var(--wheat-brown), var(--wheat-brown-mid));
  color: var(--cream-white);
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(92, 68, 40, 0.2);
}

.footer-bottom {
  border-top: 1px solid var(--cream-white-deep);
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer-copy { font-size: 12px; max-width: none; }
.footer-tagline {
  font-family: var(--font-script);
  font-size: 22px;
  color: var(--wheat-brown);
  letter-spacing: 0.5px;
}

:deep(.dropdown-header) {
  padding: 12px 16px;
  border-bottom: 1px solid var(--cream-white-deep);
  background: var(--cream-white-soft);
}
:deep(.dropdown-name) {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 700;
  color: var(--wheat-brown-dark);
  margin: 0;
}
:deep(.dropdown-email) {
  font-family: var(--font-sans);
  font-size: 11px;
  color: var(--wheat-brown-mid);
  margin: 2px 0 0;
}
:deep(.el-dropdown-menu__item) {
  font-family: var(--font-sans) !important;
  font-size: 13px !important;
}
:deep(.dropdown-logout) {
  font-weight: 600 !important;
  color: #B45309 !important;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .footer-bottom {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>