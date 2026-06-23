<template>
  <div class="min-h-screen flex flex-col blossom-theme">

    <header class="fixed top-0 left-0 right-0 z-50" style="height:68px; background:rgba(255,255,255,0.95); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid #FDD8EE;">
      <div class="h-full max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-8">

        <RouterLink to="/shop" class="flex items-center gap-3 no-underline group" style="text-decoration:none;">
          <div style="width:40px;height:40px;flex-shrink:0;">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
              <circle cx="20" cy="20" r="19" stroke="#F472B6" stroke-width="1" stroke-dasharray="2 2"/>
              <path d="M20 9 C17 12, 13 14, 13 17 C13 21, 16 23, 20 23 C24 23, 27 21, 27 17 C27 14, 23 12, 20 9 Z" fill="#FFF0F7" stroke="#EC4899" stroke-width="1.2"/>
              <circle cx="20" cy="17" r="2.5" fill="#FBBF24"/>
              <path d="M15 22 C14 26, 17 29, 20 29 C23 29, 26 26, 25 22" stroke="#EC4899" stroke-width="1.2" stroke-linecap="round"/>
              <path d="M20 29 L20 32" stroke="#EC4899" stroke-width="1.2" stroke-linecap="round"/>
              <path d="M11 12 C10 13, 9 13, 9 12 C9 11, 10 11, 11 12 Z" fill="#F472B6" opacity="0.8"/>
              <path d="M29 27 C28 28, 27 28, 27 27 C27 26, 28 26, 29 27 Z" fill="#F472B6" opacity="0.8"/>
            </svg>
          </div>
          <div class="flex flex-col leading-tight">
            <span style="font-family:'Playfair Display',serif; font-weight:900; font-size:18px; color:#3D1A2C; letter-spacing:1px; transition: color 0.25s;" class="group-hover:text-[#EC4899]">TIỆM BÁNH</span>
            <span style="font-family:'DM Sans',sans-serif; font-size:9px; font-weight:700; color:#B07090; letter-spacing:2px; text-transform:uppercase;">Blossom Patisserie</span>
          </div>
        </RouterLink>

        <nav class="hidden md:flex items-center gap-9">
          <RouterLink to="/shop"
            :class="route.path === '/shop' ? 'blossom-nav-active' : 'blossom-nav-link'"
            style="font-family:'DM Sans',sans-serif; font-weight:700; font-size:12px; text-decoration:none; letter-spacing:1.5px; text-transform:uppercase; transition:color 0.2s;">
            Trang Chủ
          </RouterLink>
          <RouterLink to="/shop/products"
            :class="route.path.startsWith('/shop/products') ? 'blossom-nav-active' : 'blossom-nav-link'"
            style="font-family:'DM Sans',sans-serif; font-weight:700; font-size:12px; text-decoration:none; letter-spacing:1.5px; text-transform:uppercase; transition:color 0.2s;">
            Cửa Hàng
          </RouterLink>
          <RouterLink to="/shop/design"
            :class="route.path === '/shop/design' ? 'blossom-nav-active' : 'blossom-nav-link'"
            style="font-family:'DM Sans',sans-serif; font-weight:700; font-size:12px; text-decoration:none; letter-spacing:1.5px; text-transform:uppercase; transition:color 0.2s;">
            Thiết Kế 3D
          </RouterLink>
          <RouterLink to="/shop/contact"
            :class="route.path === '/shop/contact' ? 'blossom-nav-active' : 'blossom-nav-link'"
            style="font-family:'DM Sans',sans-serif; font-weight:700; font-size:12px; text-decoration:none; letter-spacing:1.5px; text-transform:uppercase; transition:color 0.2s;">
            Liên Hệ
          </RouterLink>
        </nav>

        <div class="flex items-center gap-5">
          <button style="background:none;border:none;cursor:pointer;color:#7C3D5C;padding:0;transition:color 0.2s;" class="hover:text-[#EC4899]" title="Tìm kiếm">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          <RouterLink to="/shop/cart" class="relative" style="text-decoration:none;color:#7C3D5C;transition:color 0.2s;" @mouseenter="e=>e.target.style.color='#EC4899'" @mouseleave="e=>e.target.style.color='#7C3D5C'">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span v-if="cartCount > 0" style="position:absolute;top:-9px;right:-9px;background:#EC4899;color:#FFFFFF;font-family:'DM Sans',sans-serif;font-size:9px;font-weight:800;border-radius:20px;padding:1px 5px;min-width:17px;text-align:center;">{{ cartCount }}</span>
          </RouterLink>

          <div style="width:1px;height:18px;background:#FDD8EE;" class="hidden sm:block"></div>

          <div v-if="authStore.isAuthenticated" class="hidden md:block">
            <el-dropdown trigger="click" @command="handleUserAction">
              <div style="width:34px;height:34px;border-radius:50%;border:1.5px solid #EC4899;color:#EC4899;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer;letter-spacing:0.5px;background:#FFF0F7;">
                {{ avatarInitials }}
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <div style="padding:12px 16px;border-bottom:1px solid #FDD8EE;background:#FFF5FA;">
                    <p style="font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;color:#3D1A2C;margin:0;">{{ displayName }}</p>
                    <p style="font-family:'DM Sans',sans-serif;font-size:11px;color:#B07090;margin:2px 0 0;">{{ authStore.user?.email }}</p>
                  </div>
                  <el-dropdown-item command="profile" style="font-family:'DM Sans',sans-serif;font-size:13px;">Hồ sơ của tôi</el-dropdown-item>
                  <el-dropdown-item command="orders" style="font-family:'DM Sans',sans-serif;font-size:13px;">Đơn hàng đã mua</el-dropdown-item>
                  <el-dropdown-item divided command="logout" style="font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;color:#E11D48;">Đăng xuất</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <RouterLink v-else to="/login" class="hidden md:block"
            style="font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;color:#EC4899;text-decoration:none;letter-spacing:2px;text-transform:uppercase;border:1px solid rgba(236,72,153,0.4);border-radius:8px;padding:7px 16px;transition:all 0.2s;"
            onmouseenter="this.style.background='rgba(236,72,153,0.1)'"
            onmouseleave="this.style.background='transparent'"
          >
            Đăng Nhập
          </RouterLink>

          <button class="md:hidden" @click="mobileOpen = !mobileOpen"
            style="background:none;border:none;cursor:pointer;color:#7C3D5C;padding:4px;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="mobileOpen" class="md:hidden absolute w-full animate-fade-in" style="top:68px;left:0;background:#FFFFFF;border-bottom:1px solid #FDD8EE;z-index:100;">
        <div style="padding:16px 24px;display:flex;flex-direction:column;gap:4px;">
          <RouterLink to="/shop" @click="mobileOpen=false" class="mobile-nav-link">Trang Chủ</RouterLink>
          <RouterLink to="/shop/products" @click="mobileOpen=false" class="mobile-nav-link">Cửa Hàng</RouterLink>
          <RouterLink to="/shop/design" @click="mobileOpen=false" class="mobile-nav-link">Thiết Kế 3D</RouterLink>
          <RouterLink to="/shop/contact" @click="mobileOpen=false" class="mobile-nav-link">Liên Hệ</RouterLink>
          <RouterLink to="/login" @click="mobileOpen=false" class="mobile-nav-link" style="border-top:1px solid #FDD8EE;margin-top:4px;padding-top:14px;color:#EC4899;">Đăng Nhập</RouterLink>
        </div>
      </div>
    </header>

    <main class="flex-1 w-full" style="margin-top:68px; background:var(--c-blossom-pale);">
      <RouterView v-slot="{ Component, route: r }">
        <Transition name="fade-slide" mode="out-in">
          <component :is="Component" :key="r.path" />
        </Transition>
      </RouterView>
    </main>

    <footer style="background:#FFFFFF; padding:64px 72px 32px; border-top:1px solid #FDD8EE;" class="px-6 md:px-16">
      <div style="display:grid;gap:40px;margin-bottom:48px;" class="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 footer-grid max-w-7xl mx-auto">

        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
              <circle cx="20" cy="20" r="19" stroke="#F472B6" stroke-width="1" opacity="0.6"/>
              <path d="M20 9 C17 12, 13 14, 13 17 C13 21, 16 23, 20 23 C24 23, 27 21, 27 17 C27 14, 23 12, 20 9 Z" fill="#FFF0F7" stroke="#EC4899" stroke-width="1.2"/>
              <circle cx="20" cy="17" r="2.5" fill="#FBBF24"/>
            </svg>
            <div>
              <div style="font-family:'Playfair Display',serif;font-size:16px;color:#3D1A2C;font-weight:900;letter-spacing:1px;">TIỆM BÁNH</div>
              <div style="font-family:'DM Sans',sans-serif;font-size:9px;color:#B07090;letter-spacing:2px;text-transform:uppercase;">Blossom Patisserie</div>
            </div>
          </div>
          <p style="font-family:'DM Sans',sans-serif;font-size:13px;color:#7C3D5C;line-height:1.7;max-width:220px;">Mang đến những chiếc bánh thơm ngon, độc đáo nhất cho mọi dịp kỷ niệm của bạn.</p>
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
          <p style="font-family:'DM Sans',sans-serif;font-size:12px;color:#7C3D5C;margin:0 0 16px;line-height:1.6;">Đăng ký để nhận thông tin về bộ sưu tập mới và ưu đãi dành riêng cho thành viên.</p>
          <div style="display:flex;gap:8px;margin-bottom:10px;">
            <input type="email" placeholder="Email của bạn..."
              style="flex:1;border:1px solid #FDD8EE;background:#FFF0F7;border-radius:10px;padding:11px 14px;font-family:'DM Sans',sans-serif;font-size:13px;color:#3D1A2C;outline:none;" />
            <button style="background:linear-gradient(135deg,#EC4899,#F472B6);color:#FFFFFF;border:none;border-radius:10px;padding:10px 16px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;box-shadow:0 4px 12px rgba(236,72,153,0.25);">
              Đăng ký
            </button>
          </div>
          <div style="font-family:'DM Sans',sans-serif;font-size:11px;color:#B07090;font-style:italic;">Không spam · Chỉ nội dung giá trị</div>
        </div>
      </div>

      <div style="border-top:1px solid #FDD8EE;padding-top:24px;display:flex;justify-content:space-between;align-items:center;" class="footer-bottom max-w-7xl mx-auto">
        <span style="font-family:'DM Sans',sans-serif;font-size:12px;color:#B07090;letter-spacing:0.5px;">
          © 2026 Tiệm Bánh Blossom Patisserie. All rights reserved.
        </span>
        <span style="font-family:'Playfair Display',serif;font-size:10px;color:#EC4899;letter-spacing:1px;font-weight:900;">
          CRAFTED WITH LOVE
        </span>
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
.blossom-nav-link {
  color: #7C3D5C;
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
}
.blossom-nav-link:hover { color: #EC4899; }

.blossom-nav-active {
  color: #EC4899;
  text-decoration: none;
  position: relative;
}
.blossom-nav-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0; right: 0;
  height: 2px;
  background: #EC4899;
  border-radius: 2px;
}

.mobile-nav-link {
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #7C3D5C;
  text-decoration: none;
  padding: 11px 16px;
  border-radius: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.2s;
}
.mobile-nav-link:hover {
  background: #FFF0F7;
  color: #EC4899;
}

.footer-heading {
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-weight: 900;
  color: #EC4899;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.footer-link {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #7C3D5C;
  text-decoration: none;
  transition: all 0.2s;
  display: block;
}
.footer-link:hover {
  color: #EC4899;
  padding-left: 6px;
}

.footer-social {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid #FDD8EE;
  background: #FFF0F7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7C3D5C;
  text-decoration: none;
  font-size: 15px;
  transition: all 0.2s;
}
.footer-social:hover {
  border-color: #EC4899;
  background: #EC4899;
  color: #FFFFFF;
  transform: translateY(-2px);
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
  .footer-grid {
    grid-template-columns: 1fr !important;
    gap: 28px !important;
  }
  .footer-bottom {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>