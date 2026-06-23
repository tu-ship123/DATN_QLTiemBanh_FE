<template>
  <div class="shop-page">

    <!-- ===== HERO SECTION ===== -->
    <section class="hero-section" :style="{ backgroundImage: `url(${heroImage})` }">
      <div class="hero-overlay"></div>

      <div class="hero-content">
        <div class="hero-inner">
          <div class="hero-text-block">
            <!-- Eyebrow -->
            <div class="hero-eyebrow">
              <span class="eyebrow-petal">✿</span>
              Thủ công · Tươi mỗi ngày
            </div>

            <!-- Headline -->
            <h1 class="hero-headline">
              Tiệm Bánh<br/>
              <em>Ngọt Ngào</em>
            </h1>

            <p class="hero-desc">
              Thưởng thức hương vị ngọt ngào từ những chiếc bánh handmade được làm với tình yêu thương và nguyên liệu tươi ngon nhất.
            </p>

            <div class="hero-actions">
              <button @click="scrollToProducts" class="hero-btn-main">
                <iconify-icon icon="ph:storefront-duotone"></iconify-icon>
                Đặt bánh ngay
              </button>
              <RouterLink to="/shop/design" class="hero-btn-ghost">
                <iconify-icon icon="ph:cube-duotone"></iconify-icon>
                Thiết kế 3D ✨
              </RouterLink>
            </div>

            <!-- Social proof -->
            <div class="hero-social-proof">
              <div class="proof-avatars">
                <div v-for="(c, i) in proofColors" :key="i" class="proof-avatar"
                  :style="{ background: c, marginLeft: i > 0 ? '-10px' : '0' }">
                </div>
              </div>
              <span class="proof-text"><strong>2,400+</strong> khách hàng hài lòng</span>
            </div>
          </div>

          <!-- Floating product card -->
          <div class="hero-float-card hidden lg:flex">
            <div class="float-card-badge">✦ Bán chạy</div>
            <div class="float-card-icon">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
                <circle cx="40" cy="40" r="38" fill="url(#blossomGrad)"/>
                <!-- Cake base -->
                <rect x="12" y="50" width="56" height="12" rx="6" fill="white" opacity="0.95"/>
                <!-- Cake middle -->
                <rect x="18" y="37" width="44" height="13" rx="6" fill="white" opacity="0.9"/>
                <!-- Cake top -->
                <rect x="24" y="26" width="32" height="11" rx="5.5" fill="white" opacity="0.85"/>
                <!-- Candle -->
                <rect x="38" y="18" width="4" height="8" rx="2" fill="#FBB6CE" opacity="0.9"/>
                <!-- Flame -->
                <ellipse cx="40" cy="17" rx="2.5" ry="3.5" fill="#FBBF24" opacity="0.95"/>
                <!-- Flowers -->
                <circle cx="30" cy="31" r="2.5" fill="#F9A8D4" opacity="0.9"/>
                <circle cx="40" cy="31" r="2.5" fill="#F472B6" opacity="0.9"/>
                <circle cx="50" cy="31" r="2.5" fill="#F9A8D4" opacity="0.9"/>
                <defs>
                  <linearGradient id="blossomGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#FBCFE8"/>
                    <stop offset="100%" stop-color="#F9A8D4"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="float-card-name">Bánh kem 3D Custom</div>
            <div class="float-card-price">từ <strong>350,000đ</strong></div>
            <div class="float-card-stars">★★★★★ <span>5.0</span></div>
            <RouterLink to="/shop/design" class="float-card-link">Thiết kế ngay →</RouterLink>
          </div>
        </div>
      </div>

      <!-- Scroll hint -->
      <div class="hero-scroll-hint">
        <div class="scroll-line"></div>
        <span>Kéo xuống</span>
      </div>
    </section>

    <!-- ===== TRUST BAR ===== -->
    <div class="trust-bar hidden md:block">
      <div class="trust-bar-inner">
        <div v-for="t in trustItems" :key="t.label" class="trust-item">
          <iconify-icon :icon="t.icon" class="trust-icon"></iconify-icon>
          <span class="trust-label">{{ t.label }}</span>
        </div>
      </div>
    </div>

    <!-- ===== CATEGORIES & FILTERS ===== -->
    <section class="section-categories" id="product-section">
      <div class="section-container">
        <div class="section-header flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span class="section-eyebrow">Danh mục</span>
            <h2 class="section-title">Bạn thích loại bánh nào?</h2>
            <p class="section-subtitle mt-2">
              {{ productStore.loading ? 'Đang tải thực đơn...' : `Đang hiển thị ${displayedProducts.length} sản phẩm` }}
            </p>
          </div>
          
          <!-- Thanh tìm kiếm & Sắp xếp -->
          <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div class="relative flex-1 md:w-64">
              <iconify-icon icon="ph:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 text-[#B07090] text-lg"></iconify-icon>
              <input
                v-model="search"
                type="text"
                placeholder="Tìm bánh yêu thích..."
                class="w-full pl-11 pr-4 py-3 rounded-full text-sm outline-none transition-all placeholder:text-[#B07090]"
                style="border: 1.5px solid #FDD8EE; background: #FFF7FB; color: #3D1A2C;"
              />
            </div>
            <select 
              v-model="sortBy" 
              class="px-4 py-3 rounded-full text-sm font-semibold outline-none transition-all cursor-pointer"
              style="border: 1.5px solid #FDD8EE; background: #FFF7FB; color: #7C3D5C;"
            >
              <option value="newest">✨ Mới nhất</option>
              <option value="price_asc">💎 Giá thấp nhất</option>
            </select>
          </div>
        </div>

        <!-- Bộ lọc Category Pinia -->
        <div class="category-strip mt-6">
          <button
            class="cat-pill"
            :class="activeCategory === null ? 'cat-pill--active' : ''"
            @click="activeCategory = null"
          >
            <span class="cat-icon" style="background: linear-gradient(135deg,#FBCFE8,#F9A8D4)">🍰</span>
            <span>Tất cả</span>
          </button>

          <template v-if="categoryStore.loading">
            <div v-for="n in 5" :key="n" class="h-12 w-32 rounded-full bg-pink-50 animate-pulse"></div>
          </template>

          <button
            v-else
            v-for="cat in categoryStore.activeCategories"
            :key="cat.id"
            class="cat-pill"
            :class="activeCategory === cat.id ? 'cat-pill--active' : ''"
            @click="activeCategory = cat.id"
          >
            <img v-if="cat.anhDaiDien" :src="cat.anhDaiDien" class="cat-icon object-cover" @error="(e) => e.target.style.display = 'none'"/>
            <span>{{ cat.tenDanhMuc }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- ===== SẢN PHẨM (STORE DATA) ===== -->
    <section class="section-products pt-0">
      <div class="section-container">
        
        <!-- Loading Skeleton -->
        <div v-if="productStore.loading" class="product-grid">
          <div v-for="n in 8" :key="n" class="product-card animate-pulse">
            <div class="product-img bg-pink-50"></div>
            <div class="product-body">
              <div class="h-3 bg-pink-100 rounded w-1/3 mb-3"></div>
              <div class="h-5 bg-pink-200 rounded w-3/4 mb-3"></div>
              <div class="h-8 bg-pink-100 rounded-full w-full mt-auto"></div>
            </div>
          </div>
        </div>

        <!-- Trống -->
        <div v-else-if="displayedProducts.length === 0" class="text-center py-20 bg-white rounded-3xl border border-[#FDD8EE]">
          <iconify-icon icon="ph:cake-duotone" class="text-6xl text-[#F9A8D4] mb-4"></iconify-icon>
          <h3 class="text-xl font-bold text-[#3D1A2C] font-display">Không tìm thấy sản phẩm nào</h3>
          <p class="text-[#7C3D5C] mt-2">Hãy thử thay đổi từ khóa hoặc danh mục khác nhé.</p>
        </div>

        <!-- Danh sách Sản phẩm thật -->
        <div v-else class="product-grid">
          <div
            v-for="product in displayedProducts"
            :key="product.id"
            class="product-card cursor-pointer group"
            @click="goToDetail(product.id)"
          >
            <!-- Image area -->
            <div class="product-img bg-[#FFF7FB]">
              <img
                :src="product.anhSanPham || defaultImage"
                :alt="product.tenSanPham"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                @error="handleImageError"
              />
              <button class="product-wish" @click.stop="toggleWishlist(product)" :class="product.wished ? 'product-wish--active' : ''">
                <iconify-icon :icon="product.wished ? 'ph:heart-fill' : 'ph:heart'"></iconify-icon>
              </button>
              
              <!-- Badge -->
              <span v-if="product.soLuongTon === 0" class="product-badge" style="background: #3D1A2C">Hết hàng</span>
              <span v-else class="product-badge" style="background: #EC4899">{{ product.tenDanhMuc || 'Bánh ngọt' }}</span>
            </div>

            <!-- Body -->
            <div class="product-body">
              <div>
                <div class="product-meta">Tồn kho: {{ product.soLuongTon }}</div>
                <h3 class="product-name line-clamp-2" :title="product.tenSanPham">{{ product.tenSanPham }}</h3>
              </div>

              <!-- Price + CTA -->
              <div class="product-footer mt-4">
                <div class="product-pricing">
                  <span class="product-price">{{ formatPrice(product.donGia) }}</span>
                </div>
                <button 
                  class="product-add-btn" 
                  @click.stop="addToCart(product)" 
                  :disabled="cartStore.loading || product.soLuongTon === 0"
                  :class="{'opacity-50 cursor-not-allowed': product.soLuongTon === 0}"
                >
                  <iconify-icon :icon="cartStore.loading ? 'ph:spinner-gap-bold' : 'ph:shopping-cart-simple-bold'" :class="{'animate-spin': cartStore.loading}"></iconify-icon>
                  {{ cartStore.loading ? 'Đang...' : 'Thêm' }}
                </button>
              </div>
            </div>

            <!-- Rating -->
            <div class="product-rating">
              <span class="stars">★★★★★</span>
              <span class="rating-text">5.0 · Đánh giá tốt</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 3D DESIGNER BANNER ===== -->
    <section class="banner-3d">
      <div class="section-container banner-3d-inner">
        <div class="banner-3d-left">
          <span class="section-eyebrow" style="color:#FFF0F7; opacity:0.8;">Tính năng độc quyền</span>
          <h2 class="banner-3d-title">Tự thiết kế<br/><em>chiếc bánh của bạn</em></h2>
          <p class="banner-3d-desc">Chọn hình dáng, màu kem, hoa văn trang trí. Xoay 360° ngắm nghía rồi gửi thẳng vào đơn hàng.</p>
          <RouterLink to="/shop/design" class="banner-3d-btn">
            <iconify-icon icon="ph:cube-duotone"></iconify-icon>
            Mở 3D Designer
          </RouterLink>
          <div class="banner-3d-features">
            <span v-for="f in designFeatures" :key="f" class="feature-tag">{{ f }}</span>
          </div>
        </div>
        <div class="banner-3d-right hidden lg:block">
          <div class="designer-preview">
            <div class="preview-cake">
              <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" width="140" height="140">
                <circle cx="70" cy="70" r="68" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
                <rect x="18" y="90" width="104" height="22" rx="11" fill="rgba(255,255,255,0.85)"/>
                <rect x="28" y="68" width="84" height="22" rx="11" fill="rgba(255,255,255,0.75)"/>
                <rect x="38" y="48" width="64" height="20" rx="10" fill="rgba(255,255,255,0.65)"/>
                <rect x="67" y="34" width="6" height="14" rx="3" fill="#FBB6CE"/>
                <ellipse cx="70" cy="32" rx="4" ry="5" fill="#FBBF24"/>
                <circle cx="36" cy="79" r="3" fill="#F9A8D4" opacity="0.8"/>
                <circle cx="50" cy="79" r="3" fill="#F9A8D4" opacity="0.8"/>
                <circle cx="64" cy="79" r="3" fill="#F9A8D4" opacity="0.8"/>
                <circle cx="78" cy="79" r="3" fill="#F9A8D4" opacity="0.8"/>
                <circle cx="92" cy="79" r="3" fill="#F9A8D4" opacity="0.8"/>
                <circle cx="106" cy="79" r="3" fill="#F9A8D4" opacity="0.8"/>
                <circle cx="50" cy="58" r="4" fill="#FBCFE8"/>
                <circle cx="70" cy="57" r="4.5" fill="#F472B6"/>
                <circle cx="90" cy="58" r="4" fill="#FBCFE8"/>
              </svg>
            </div>
            <div class="preview-label">Xoay 360°</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TESTIMONIALS ===== -->
    <section class="section-reviews">
      <div class="section-container">
        <div class="section-header" style="justify-content:center; text-align:center; flex-direction:column; align-items:center; gap:8px;">
          <span class="section-eyebrow">Khách hàng nói gì</span>
          <h2 class="section-title">Hơn 2,400 người tin tưởng chúng tôi</h2>
        </div>

        <div class="reviews-grid">
          <div v-for="r in reviews" :key="r.name" class="review-card">
            <div class="review-stars">★★★★★</div>
            <p class="review-quote">"{{ r.quote }}"</p>
            <div class="review-author">
              <div class="review-avatar" :style="{ background: r.color }">{{ r.initials }}</div>
              <div>
                <div class="review-name">{{ r.name }}</div>
                <div class="review-loc">{{ r.location }} · {{ r.date }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CTA STRIP ===== -->
    <section class="cta-strip">
      <div class="section-container cta-inner">
        <div class="cta-petals">✿ ✦ ✿</div>
        <h2 class="cta-title">Đặt bánh ngay hôm nay<br/>nhận <em>giảm 15%</em> đơn đầu tiên</h2>
        <p class="cta-sub">Dùng mã <strong>BLOSSOM15</strong> khi thanh toán</p>
        <button @click="scrollToProducts" class="cta-btn">Mua sắm ngay</button>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ElMessage } from 'element-plus'

// DÙNG CÁC STORE ĐÃ CÓ CỦA BẠN
import { useProductStore } from '@/stores/productStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import heroImage from '@/assets/images/Screenshot 2026-06-17 151209.png'

const router = useRouter()
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

// State cho Logic tìm kiếm, lọc
const search = ref('')
const activeCategory = ref(null) // null = Tất cả, số = id danh mục
const sortBy = ref('newest')
const defaultImage = 'https://placehold.co/400x300?text=Polycake'

const formatPrice = (price) => {
  if (!price && price !== 0) return 'Liên hệ'
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

const handleImageError = (e) => { e.target.src = defaultImage }

// Lấy dữ liệu từ API lúc mounted
onMounted(() => {
  productStore.fetchAllProducts()
  categoryStore.fetchAllCategories()
})

// Logic Filter & Sort như file gốc
const displayedProducts = computed(() => {
  let result = productStore.products.filter((item) => {
    const matchesCategory = activeCategory.value === null || item.danhMucId === activeCategory.value
    const matchesSearch = !search.value || item.tenSanPham?.toLowerCase().includes(search.value.toLowerCase())
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

const addToCart = async (product) => {
  if (product.soLuongTon === 0) {
    ElMessage.warning('Sản phẩm này đã hết hàng!')
    return
  }
  if (!authStore.isAuthenticated) {
    ElMessage.warning('Vui lòng đăng nhập để thêm vào giỏ hàng!')
    router.push('/login')
    return
  }

  const result = await cartStore.themVaoGio(product.id, 1)
  if (result.success) {
    ElMessage.success(`Đã thêm "${product.tenSanPham}" vào giỏ hàng!`)
  } else {
    ElMessage.error(typeof result.message === 'string' ? result.message : 'Thêm vào giỏ thất bại, vui lòng thử lại!')
  }
}

// Hàm cuộn trang mượt mà
const scrollToProducts = () => {
  const el = document.getElementById('product-section')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const toggleWishlist = (p) => {
  p.wished = !p.wished
  if (p.wished) ElMessage.success('Đã thêm vào danh sách yêu thích!')
  else ElMessage.info('Đã bỏ khỏi danh sách yêu thích.')
}

// ================= DỮ LIỆU TĨNH UI BLOSSOM =================
const proofColors = ['#F9A8D4', '#FBCFE8', '#F472B6', '#EC4899', '#DB2777']

const trustItems = [
  { icon: 'ph:truck-duotone',    label: 'Miễn phí giao từ 300k' },
  { icon: 'ph:seal-check-duotone', label: 'Nguyên liệu tươi mỗi ngày' },
  { icon: 'ph:clock-duotone',    label: 'Đặt trước 14h – giao ngay' },
  { icon: 'ph:medal-duotone',    label: '100% hoàn tiền bảo hành' },
]

const designFeatures = ['🔄 Xoay 360°', '🎨 Tuỳ màu & trang trí', '📤 Gửi kèm đơn']

const reviews = [
  { name: 'Nguyễn Thị Lan',   initials: 'NL', location: 'TP. HCM',   date: '20/05/2026', color: '#F472B6', quote: 'Bánh kem rất ngon, đóng gói đẹp, giao đúng giờ. Sẽ ủng hộ lại lần sau!' },
  { name: 'Trần Minh Quân',   initials: 'TQ', location: 'Hà Nội',    date: '15/05/2026', color: '#A78BFA', quote: 'Thiết kế 3D độc đáo, nhân viên tư vấn nhiệt tình. Bánh đẹp hơn tưởng tượng!' },
  { name: 'Lê Thu Hương',     initials: 'LH', location: 'Đà Nẵng',   date: '10/05/2026', color: '#FB7185', quote: 'Cupcake siêu xinh và ngon. Mua làm quà tặng bạn bè ai cũng khen nức nở.' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

/* ===== DESIGN TOKENS – BLOSSOM PATISSERIE ===== */
.shop-page {
  --c-blossom:      #F472B6;   /* Hot pink chính */
  --c-blossom-mid:  #EC4899;   /* Đậm hơn – hover, active */
  --c-blossom-soft: #FBCFE8;   /* Hồng nhạt – bg nhẹ */
  --c-blossom-pale: #FFF0F7;   /* Nền tổng thể */
  --c-rose:         #FB7185;   /* Hồng đỏ nhẹ – accent phụ */
  --c-gold:         #F59E0B;   /* Vàng mật ong – stars, giá */
  --c-peach:        #FDE68A;   /* Vàng pastel – category bg */
  --c-text:         #3D1A2C;   /* Tím nâu đậm – màu chữ */
  --c-text-mid:     #7C3D5C;   /* Giữa */
  --c-text-light:   #B07090;   /* Nhạt – mô tả phụ */
  --c-white:        #FFFFFF;
  --c-card:         #FFFFFF;

  font-family: 'DM Sans', sans-serif;
  background: var(--c-blossom-pale);
  color: var(--c-text);
}

/* ===== HERO ===== */
.hero-section {
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  min-height: 680px;
  background-size: cover;
  background-position: center top;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    rgba(61, 10, 36, 0.75) 0%,
    rgba(120, 30, 70, 0.45) 50%,
    rgba(236, 72, 153, 0.1) 100%
  );
}
.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 80px;
}
.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}
.hero-text-block { max-width: 520px; }

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #FBCFE8;
  margin-bottom: 20px;
}
.eyebrow-petal {
  font-size: 16px;
  animation: petalSpin 4s linear infinite;
  display: inline-block;
}
@keyframes petalSpin {
  0%   { transform: rotate(0deg) scale(1); }
  50%  { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
}

.hero-headline {
  font-family: 'Playfair Display', serif;
  font-size: 80px;
  font-weight: 900;
  line-height: 1.0;
  color: #FFFFFF;
  margin: 0 0 22px;
  letter-spacing: -0.01em;
}
.hero-headline em {
  font-style: italic;
  background: linear-gradient(135deg, #FBCFE8, #F9A8D4, #F472B6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-desc {
  font-size: 15px;
  line-height: 1.8;
  color: rgba(255, 240, 247, 0.85);
  margin: 0 0 36px;
  max-width: 400px;
  font-weight: 400;
}
.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}
.hero-btn-main {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #EC4899, #F472B6);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 14px 28px;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.25s;
  box-shadow: 0 4px 20px rgba(236,72,153,0.4);
  cursor: pointer;
  border: none;
}
.hero-btn-main:hover {
  background: linear-gradient(135deg, #DB2777, #EC4899);
  box-shadow: 0 8px 28px rgba(236,72,153,0.55);
  transform: translateY(-2px);
}
.hero-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.12);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 14px 28px;
  border-radius: 50px;
  border: 1.5px solid rgba(255,255,255,0.35);
  text-decoration: none;
  transition: all 0.25s;
  backdrop-filter: blur(8px);
}
.hero-btn-ghost:hover {
  background: rgba(255,255,255,0.22);
  border-color: rgba(255,255,255,0.6);
}

.hero-social-proof {
  display: flex;
  align-items: center;
  gap: 12px;
}
.proof-avatars { display: flex; align-items: center; }
.proof-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  border: 2.5px solid rgba(255,255,255,0.7);
  flex-shrink: 0;
}
.proof-text { font-size: 13px; color: rgba(255,240,247,0.85); }
.proof-text strong { color: #fff; }

/* Float card */
.hero-float-card {
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 22px 20px;
  width: 210px;
  flex-shrink: 0;
  box-shadow: 0 20px 50px rgba(61,10,36,0.18);
  border: 1px solid rgba(249,168,212,0.4);
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  text-align: center;
}
.float-card-badge {
  font-size: 10px;
  font-weight: 700;
  color: var(--c-blossom-mid);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.float-card-icon {
  margin: 4px 0 2px;
  filter: drop-shadow(0 4px 12px rgba(236,72,153,0.2));
}
.float-card-name {
  font-family: 'Playfair Display', serif;
  font-size: 15px;
  font-weight: 900;
  color: var(--c-text);
}
.float-card-price { font-size: 12px; color: var(--c-text-light); }
.float-card-price strong { color: var(--c-blossom-mid); font-size: 15px; }
.float-card-stars { font-size: 12px; color: #F59E0B; }
.float-card-stars span { color: var(--c-text-light); font-family: 'DM Sans', sans-serif; }
.float-card-link {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--c-blossom-mid);
  text-decoration: none;
  transition: color 0.2s;
}
.float-card-link:hover { color: var(--c-blossom); }

.hero-scroll-hint {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255,240,247,0.45);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  z-index: 3;
}
.scroll-line {
  width: 1px; height: 36px;
  background: linear-gradient(to bottom, rgba(249,168,212,0.6), transparent);
  animation: scrollAnim 1.8s ease infinite;
}
@keyframes scrollAnim {
  0%   { transform: scaleY(0); transform-origin: top; }
  50%  { transform: scaleY(1); transform-origin: top; }
  100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
}

/* ===== TRUST BAR ===== */
.trust-bar {
  background: linear-gradient(135deg, #EC4899, #F472B6);
  padding: 0;
  border-bottom: 1.5px solid #FDD8EE;
}
.trust-bar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.trust-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  border-right: 1px solid rgba(255,255,255,0.15);
}
.trust-item:last-child { border-right: none; }
.trust-icon { font-size: 20px; color: #FFFFFF; flex-shrink: 0; }
.trust-label { font-size: 12px; font-weight: 700; color: #FFFFFF; }

/* ===== COMMON ===== */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}
.section-header {
  display: flex;
  margin-bottom: 32px;
}
.section-eyebrow {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--c-blossom-mid);
  margin-bottom: 6px;
}
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  font-weight: 950;
  color: var(--c-text);
  margin: 0;
  line-height: 1.15;
}
.section-subtitle {
  font-size: 14px;
  color: var(--c-text-light);
  margin: 6px 0 0;
  font-weight: 400;
}

/* ===== CATEGORIES ===== */
.section-categories {
  background: var(--c-white);
  padding: 52px 0 32px;
}
.category-strip {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 10px;
  scroll-behavior: smooth;
}
.category-strip::-webkit-scrollbar { display: none; }
.cat-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 99px;
  border: 1.5px solid #FDD8EE;
  background: #FFF7FB;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  color: var(--c-text-mid);
  white-space: nowrap;
  transition: all 0.2s;
  flex-shrink: 0;
}
.cat-pill:hover {
  border-color: var(--c-blossom);
  color: var(--c-blossom-mid);
  background: var(--c-blossom-pale);
}
.cat-pill--active {
  border-color: var(--c-blossom-mid);
  background: linear-gradient(135deg, #EC4899, #F472B6);
  color: #fff;
  box-shadow: 0 4px 14px rgba(236,72,153,0.3);
}
.cat-icon {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0; background: #fff;
}

/* ===== PRODUCTS ===== */
.section-products {
  background: var(--c-white);
  padding: 32px 0 80px;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.product-card {
  background: var(--c-card);
  border-radius: 22px;
  overflow: hidden;
  border: 1.5px solid #FDD8EE;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 44px rgba(236,72,153,0.08);
  border-color: #F9A8D4;
}
.product-img {
  height: 220px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.product-wish {
  position: absolute; top: 12px; right: 12px;
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(8px);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; transition: all 0.2s;
  color: #ccc;
  z-index: 5;
}
.product-wish:hover { background: #fff; color: var(--c-blossom); transform: scale(1.12); }
.product-wish--active { color: var(--c-blossom) !important; }
.product-badge {
  position: absolute; top: 12px; left: 12px;
  color: #fff; font-size: 10px; font-weight: 800;
  letter-spacing: 0.05em; padding: 3px 10px;
  border-radius: 99px;
  z-index: 5;
}
.product-body { padding: 18px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.product-meta {
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.05em; text-transform: uppercase;
  color: var(--c-text-light); margin-bottom: 4px;
}
.product-name {
  font-family: 'Playfair Display', serif;
  font-size: 16px; font-weight: 900;
  color: var(--c-text); margin: 0 0 5px; line-height: 1.35;
}
.product-footer {
  display: flex; align-items: center;
  justify-content: space-between; gap: 8px;
  margin-top: 8px;
}
.product-price { font-size: 17px; font-weight: 800; color: var(--c-blossom-mid); display: block; }
.product-add-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 15px; border-radius: 20px;
  background: #FFF0F7; color: var(--c-blossom-mid);
  font-size: 12px; font-weight: 700; border: none; cursor: pointer;
  transition: all 0.2s; white-space: nowrap;
}
.product-add-btn:hover:not(:disabled) {
  background: linear-gradient(135deg,#EC4899,#F472B6);
  color: #fff;
  box-shadow: 0 4px 12px rgba(236,72,153,0.3);
}
.product-rating {
  padding: 10px 18px 14px;
  border-top: 1px solid #FFF0F7;
  display: flex; align-items: center; gap: 8px;
}
.stars { color: #F59E0B; font-size: 12px; }
.rating-text { font-size: 11px; color: var(--c-text-light); }

/* ===== 3D BANNER ===== */
.banner-3d {
  background: linear-gradient(135deg, #831843 0%, #6D1A4A 40%, #4C0B35 100%);
  padding: 80px 0;
  position: relative;
  overflow: hidden;
  margin: 0 calc(-50vw + 50%);
  width: 100vw;
}
.banner-3d::before {
  content: '';
  position: absolute;
  top: -60px; right: -60px;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: rgba(249,168,212,0.08);
  pointer-events: none;
}
.banner-3d-inner {
  display: flex;
  align-items: center;
  gap: 60px;
  position: relative;
}
.banner-3d-left { flex: 1; }
.banner-3d-title {
  font-family: 'Playfair Display', serif;
  font-size: 44px; font-weight: 700;
  color: #FFFFFF;
  margin: 12px 0 16px; line-height: 1.15;
}
.banner-3d-title em {
  font-style: italic;
  background: linear-gradient(135deg,#FBCFE8,#F9A8D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.banner-3d-desc {
  font-size: 14px;
  color: rgba(255,240,247,0.65);
  line-height: 1.8; margin: 0 0 28px; max-width: 380px;
}
.banner-3d-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg,#FBCFE8,#F9A8D4);
  color: #831843;
  font-size: 11px; font-weight: 850;
  text-transform: uppercase; letter-spacing: 0.06em;
  padding: 14px 28px; border-radius: 50px;
  text-decoration: none; transition: all 0.25s;
  box-shadow: 0 4px 20px rgba(249,168,212,0.35);
}
.banner-3d-btn:hover {
  background: linear-gradient(135deg,#F9A8D4,#F472B6);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(244,114,182,0.45);
}
.banner-3d-features { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px; }
.feature-tag {
  font-size: 12px; font-weight: 600;
  color: rgba(255,240,247,0.7);
  border: 1px solid rgba(249,168,212,0.2);
  border-radius: 99px;
  padding: 5px 14px;
  background: rgba(255,255,255,0.05);
}
.banner-3d-right { flex-shrink: 0; }
.designer-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.preview-cake { animation: floatCake 3.5s ease-in-out infinite; display: block; }
@keyframes floatCake {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50%       { transform: translateY(-14px) rotate(2deg); }
}
.preview-label {
  font-size: 11px; font-weight: 600;
  color: rgba(255,240,247,0.45);
  letter-spacing: 0.12em; text-transform: uppercase;
}

/* ===== REVIEWS ===== */
.section-reviews {
  background: var(--c-white);
  padding: 80px 0;
}
.reviews-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 48px;
}
.review-card {
  background: var(--c-blossom-pale);
  border: 1.5px solid #FDD8EE;
  border-radius: 22px;
  padding: 24px;
  transition: all 0.25s;
}
.review-card:hover {
  box-shadow: 0 8px 28px rgba(236,72,153,0.08);
  transform: translateY(-4px);
  border-color: #F9A8D4;
}
.review-stars { color: #F59E0B; font-size: 15px; margin-bottom: 12px; }
.review-quote {
  font-family: 'Playfair Display', serif;
  font-size: 16px; font-style: italic;
  color: var(--c-text); line-height: 1.7;
  margin: 0 0 20px;
}
.review-author { display: flex; align-items: center; gap: 12px; }
.review-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0;
}
.review-name { font-size: 14px; font-weight: 700; color: var(--c-text); }
.review-loc { font-size: 11px; color: var(--c-text-light); margin-top: 2px; }

/* ===== CTA STRIP ===== */
.cta-strip {
  background: linear-gradient(135deg, #FFF0F7, #FBCFE8, #FFF0F7);
  padding: 80px 0;
  text-align: center;
  border-top: 1.5px solid #FDD8EE;
  margin: 0 calc(-50vw + 50%);
  width: 100vw;
}
.cta-inner { text-align: center; }
.cta-petals {
  font-size: 22px; color: var(--c-blossom); letter-spacing: 12px;
  margin-bottom: 20px; display: block;
}
.cta-title {
  font-family: 'Playfair Display', serif;
  font-size: 40px; font-weight: 700;
  color: var(--c-text); line-height: 1.2; margin: 0 0 12px;
}
.cta-title em {
  font-style: italic;
  background: linear-gradient(135deg,#EC4899,#F472B6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.cta-sub {
  font-size: 15px; color: var(--c-text-mid); margin: 0 0 32px;
}
.cta-sub strong {
  font-family: 'Playfair Display', serif;
  font-size: 18px; color: var(--c-blossom-mid);
  background: rgba(236,72,153,0.08);
  border: 1px dashed #F9A8D4;
  border-radius: 8px;
  padding: 2px 12px; letter-spacing: 1px;
}
.cta-btn {
  display: inline-block;
  background: linear-gradient(135deg, #EC4899, #F472B6);
  color: #fff;
  font-size: 12px; font-weight: 850;
  letter-spacing: 0.06em; text-transform: uppercase;
  padding: 16px 40px; border-radius: 50px;
  text-decoration: none; transition: all 0.25s;
  box-shadow: 0 6px 24px rgba(236,72,153,0.35);
  cursor: pointer;
  border: none;
}
.cta-btn:hover {
  background: linear-gradient(135deg, #DB2777, #EC4899);
  box-shadow: 0 10px 32px rgba(236,72,153,0.5);
  transform: translateY(-2px);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .hero-headline { font-size: 58px; }
  .hero-content { padding: 60px 40px; }
  .hero-float-card { display: none; }
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .trust-bar-inner { grid-template-columns: repeat(2, 1fr); }
  .banner-3d-right { display: none; }
}
@media (max-width: 768px) {
  .hero-headline { font-size: 42px; }
  .hero-content { padding: 40px 20px; }
  .section-container { padding: 0 20px; }
  .section-categories, .section-products, .section-reviews, .cta-strip { padding: 48px 0; }
  .banner-3d { padding: 48px 0; }
  .trust-bar-inner { grid-template-columns: 1fr 1fr; }
  .product-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .reviews-grid { grid-template-columns: 1fr; }
  .hero-actions { flex-direction: column; }
  .cta-title { font-size: 28px; }
}
</style>