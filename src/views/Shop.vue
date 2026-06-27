<template>
  <div class="shop-page">

    <!-- ===== HERO SECTION ===== -->
    <section class="hero-section" :style="{ backgroundImage: `url(${heroImage})` }">
      <div class="hero-overlay"></div>
      <div class="hero-grain" aria-hidden="true"></div>

      <div class="hero-deco hero-deco--tr"></div>
      <div class="hero-deco hero-deco--bl"></div>
      <div class="hero-deco hero-deco--c"></div>

      <div class="hero-content">
        <div class="hero-inner">
          <div class="hero-text-block">
            <div class="hero-eyebrow">
              <iconify-icon icon="ph:seal-check-duotone" class="eyebrow-icon"></iconify-icon>
              Thủ công · Tươi mỗi ngày
            </div>

            <h1 class="hero-headline">
              <em class="hero-headline-script hero-headline-script--solo">Chocopine</em>
            </h1>

            <p class="hero-desc">
              Mỗi chiếc bánh là một câu chuyện — được nhào nặn từ nguyên liệu tươi ngon
              và tình yêu thương của người thợ bánh.
            </p>

            <div class="hero-actions">
              <button @click="scrollToProducts" class="hero-btn-main">
                <iconify-icon icon="ph:storefront-duotone"></iconify-icon>
                Khám phá ngay
              </button>
              <RouterLink to="/shop/design" class="hero-btn-ghost">
                <iconify-icon icon="ph:cube-duotone"></iconify-icon>
                Thiết kế 3D
              </RouterLink>
            </div>

            <div class="hero-social-proof">
              <div class="proof-avatars">
                <div v-for="(c, i) in proofColors" :key="i" class="proof-avatar"
                  :style="{ background: c, marginLeft: i > 0 ? '-10px' : '0' }">
                </div>
              </div>
              <span class="proof-text"><strong>2,400+</strong> khách hàng hài lòng</span>
            </div>
          </div>

          <div class="hero-float-card">
            <div class="float-card-badge">
              <iconify-icon icon="ph:clock-duotone"></iconify-icon>
              Hôm nay
            </div>
            <div class="float-card-icon">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
                <circle cx="40" cy="40" r="38" fill="url(#creamGrad)"/>
                <rect x="12" y="50" width="56" height="12" rx="6" fill="#F5E6CE" opacity="0.95"/>
                <rect x="18" y="37" width="44" height="13" rx="6" fill="#FAF0E4" opacity="0.9"/>
                <rect x="24" y="26" width="32" height="11" rx="5.5" fill="#FAF0E4" opacity="0.85"/>
                <rect x="38" y="18" width="4" height="8" rx="2" fill="#D4CF7A" opacity="0.9"/>
                <ellipse cx="40" cy="17" rx="2.5" ry="3.5" fill="#FBBF24" opacity="0.95"/>
                <circle cx="30" cy="31" r="2.5" fill="#E8E69A" opacity="0.9"/>
                <circle cx="40" cy="31" r="2.5" fill="#D4CF7A" opacity="0.9"/>
                <circle cx="50" cy="31" r="2.5" fill="#E8E69A" opacity="0.9"/>
                <defs>
                  <linearGradient id="creamGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#FFFDD0"/>
                    <stop offset="100%" stop-color="#D4CF7A"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="float-card-name">Bánh kem 3D Custom</div>
            <div class="float-card-price">từ <strong>350,000đ</strong></div>
            <div class="float-card-stars"><span class="star-row" aria-hidden="true"><iconify-icon v-for="n in 5" :key="n" icon="ph:star-fill"></iconify-icon></span> <span>5.0</span></div>
            <RouterLink to="/shop/design" class="float-card-link">Thiết kế ngay →</RouterLink>
          </div>
        </div>
      </div>

      <div class="hero-scroll-hint">
        <div class="scroll-line"></div>
        <span>Kéo xuống</span>
      </div>
    </section>

    <!-- ===== TRUST BAR ===== -->
    <div class="trust-bar">
      <div class="trust-bar-inner">
        <div v-for="t in trustItems" :key="t.label" class="trust-item">
          <iconify-icon :icon="t.icon" class="trust-icon"></iconify-icon>
          <span class="trust-label">{{ t.label }}</span>
        </div>
      </div>
    </div>

    <div class="section-divider">
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#FDF6EC"/>
      </svg>
    </div>

    <!-- ===== CATEGORIES ===== -->
    <section class="section-categories" id="product-section">
      <div class="section-container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">Danh mục</span>
            <h2 class="section-title">Bạn thích loại bánh nào?</h2>
            <p class="section-subtitle">
              {{ productStore.loading ? 'Đang tải thực đơn...' : `Đang hiển thị ${displayedProducts.length} sản phẩm` }}
            </p>
          </div>
        </div>

        <div class="category-strip-wrapper">
          <div class="category-strip">
            <button
              class="cat-pill"
              :class="[activeCategory === null ? 'cat-pill--active' : '', ripplingCat === 'all' ? 'rippling' : '']"
              @click="handleCatClick(null, 'all')"
            >
              <span class="cat-icon cat-icon--glyph" style="background: linear-gradient(135deg,#FFFDD0,#D4CF7A)"><iconify-icon icon="ph:cake-duotone"></iconify-icon></span>
              <span>Tất cả</span>
            </button>

            <template v-if="categoryStore.loading">
              <div v-for="n in 5" :key="n" class="cat-pill cat-pill--skeleton"></div>
            </template>

            <button
              v-else
              v-for="cat in categoryStore.activeCategories"
              :key="cat.id"
              class="cat-pill"
              :class="[activeCategory === cat.id ? 'cat-pill--active' : '', ripplingCat === cat.id ? 'rippling' : '']"
              @click="handleCatClick(cat.id, cat.id)"
            >
              <img
                v-if="cat.anhDaiDien"
                :src="cat.anhDaiDien"
                class="cat-icon cat-icon--img"
                @error="(e) => e.target.style.display = 'none'"
              />
              <span v-else class="cat-icon cat-icon--glyph" style="background: linear-gradient(135deg,#FFFDD0,#D4CF7A)"><iconify-icon icon="ph:cookie-duotone"></iconify-icon></span>
              <span>{{ cat.tenDanhMuc }}</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FEATURED PRODUCTS ===== -->
    <section class="section-products">
      <div class="section-container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">Nổi bật</span>
            <h2 class="section-title">Bánh được yêu thích nhất</h2>
            <p class="section-subtitle">Những chiếc bánh làm từ nguyên liệu tươi, chế biến hàng ngày</p>
          </div>
          <div class="section-header-right">
            <div class="search-wrapper">
              <iconify-icon icon="ph:magnifying-glass" class="search-icon"></iconify-icon>
              <input
                v-model="search"
                type="text"
                class="search-input"
                placeholder="Tìm bánh yêu thích..."
              />
              <button
                v-if="search"
                type="button"
                class="search-clear"
                aria-label="Xóa tìm kiếm"
                @click="search = ''"
              >×</button>
            </div>
            <select v-model="sortBy" class="sort-select">
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá thấp nhất</option>
            </select>
            <RouterLink to="/shop/products" class="section-link">
              Xem tất cả <iconify-icon icon="ph:arrow-right"></iconify-icon>
            </RouterLink>
            <div class="view-toggle">
              <button class="view-btn" :class="{ 'view-btn--active': viewMode === 'grid' }" @click="viewMode = 'grid'" title="Lưới">
                <iconify-icon icon="ph:grid-four"></iconify-icon>
              </button>
              <button class="view-btn" :class="{ 'view-btn--active': viewMode === 'list' }" @click="viewMode = 'list'" title="Danh sách">
                <iconify-icon icon="ph:list"></iconify-icon>
              </button>
            </div>
          </div>
        </div>

        <div v-if="productStore.loading" class="product-grid skeleton-grid">
          <div v-for="n in 8" :key="n" class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
              <div class="skeleton-line skeleton-line--short"></div>
              <div class="skeleton-line"></div>
              <div class="skeleton-line skeleton-line--mid"></div>
            </div>
          </div>
        </div>

        <div v-else class="product-grid" :class="{ 'product-grid--list': viewMode === 'list' }">
          <div
            v-for="(product, idx) in displayedProducts"
            :key="product.id"
            class="product-card"
            :style="{ transitionDelay: `${idx * 0.1}s` }"
            @click="goToDetail(product.id)"
          >
            <div class="product-img">
              <img
                :src="product.anhSanPham || defaultImage"
                :alt="product.tenSanPham"
                class="product-photo"
                @error="handleImageError"
              />
              <button class="product-wish" @click.stop="toggleWishlist(product)" :class="product.wished ? 'product-wish--active' : ''">
                <iconify-icon :icon="product.wished ? 'ph:heart-fill' : 'ph:heart'"></iconify-icon>
              </button>
              <span v-if="product.soLuongTon === 0" class="product-badge" style="background: #3D2000">Hết hàng</span>
              <span v-else class="product-badge" style="background: #7A5C3A">{{ product.tenDanhMuc || 'Bánh ngọt' }}</span>
            </div>

            <div class="product-body">
              <div>
                <div class="product-meta">Tồn kho: {{ product.soLuongTon }}</div>
                <h3 class="product-name" :title="product.tenSanPham">{{ product.tenSanPham }}</h3>
              </div>

              <div class="product-footer">
                <div class="product-pricing">
                  <span class="product-price">{{ formatPrice(product.donGia) }}</span>
                </div>
                <button
                  class="product-add-btn"
                  @click.stop="addToCart(product)"
                  :disabled="cartStore.loading || product.soLuongTon === 0"
                  :class="{
                    'product-add-btn--done': product.added,
                    'product-add-btn--loading': cartStore.loading
                  }"
                >
                  <iconify-icon :icon="cartStore.loading ? 'ph:spinner-gap-bold' : (product.added ? 'ph:check-bold' : 'ph:shopping-cart-simple')" :class="{ 'spin-icon': cartStore.loading }"></iconify-icon>
                  {{ cartStore.loading ? 'Đang xử lý...' : (product.added ? 'Đã thêm' : 'Thêm') }}
                </button>
              </div>
            </div>

            <div class="product-rating">
              <span class="star-row" aria-hidden="true"><iconify-icon v-for="n in 5" :key="n" icon="ph:star-fill"></iconify-icon></span>
              <span class="rating-text">5.0 · Đánh giá tốt</span>
            </div>
          </div>
        </div>

        <div v-if="!productStore.loading && displayedProducts.length === 0" class="empty-state">
          <div class="empty-cake-svg">
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="100" height="100">
              <ellipse cx="60" cy="95" rx="48" ry="8" fill="rgba(212,207,122,0.25)"/>
              <rect x="20" y="72" width="80" height="18" rx="9" fill="#FFFDD0" stroke="#D4CF7A" stroke-width="1.5"/>
              <rect x="28" y="54" width="64" height="18" rx="9" fill="#FAF0E4" stroke="#D4CF7A" stroke-width="1.5"/>
              <rect x="36" y="38" width="48" height="16" rx="8" fill="#F5E6CE" stroke="#D4CF7A" stroke-width="1.5"/>
              <rect x="57" y="26" width="6" height="12" rx="3" fill="#D4CF7A"/>
              <ellipse cx="60" cy="24" rx="4" ry="5" fill="#FBBF24"/>
            </svg>
          </div>
          <p class="empty-text">Không tìm thấy sản phẩm nào</p>
          <button class="empty-reset" @click="search = ''; activeCategory = null">Xem tất cả</button>
        </div>
      </div>
    </section>

    <div class="section-divider section-divider--dark">
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,20 C360,0 1080,40 1440,20 L1440,0 L0,0 Z" fill="#FFFBF5"/>
      </svg>
    </div>

    <!-- ===== 3D DESIGNER BANNER ===== -->
    <section class="banner-3d">
      <div class="section-container banner-3d-inner">
        <div class="banner-3d-left">
          <span class="section-eyebrow" style="color:#FFFDD0; opacity:0.85;">Tính năng độc quyền</span>
          <h2 class="banner-3d-title">Tự thiết kế<br/><em>chiếc bánh của bạn</em></h2>
          <p class="banner-3d-desc">Chọn hình dáng, màu kem, hoa văn trang trí. Xoay 360° ngắm nghía rồi gửi thẳng vào đơn hàng.</p>
          <RouterLink to="/shop/design" class="banner-3d-btn">
            <iconify-icon icon="ph:cube-duotone"></iconify-icon>
            Mở 3D Designer
          </RouterLink>
          <div class="banner-3d-features">
            <span v-for="f in designFeatures" :key="f.label" class="feature-tag">
              <iconify-icon :icon="f.icon"></iconify-icon>
              {{ f.label }}
            </span>
          </div>
        </div>
        <div class="banner-3d-right">
          <div class="designer-preview">
            <div class="preview-cake">
              <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" width="140" height="140">
                <circle cx="70" cy="70" r="68" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
                <rect x="18" y="90" width="104" height="22" rx="11" fill="rgba(255,255,255,0.85)"/>
                <rect x="28" y="68" width="84" height="22" rx="11" fill="rgba(255,255,255,0.75)"/>
                <rect x="38" y="48" width="64" height="20" rx="10" fill="rgba(255,255,255,0.65)"/>
                <rect x="67" y="34" width="6" height="14" rx="3" fill="#D4CF7A"/>
                <ellipse cx="70" cy="32" rx="4" ry="5" fill="#FBBF24"/>
                <circle cx="50" cy="58" r="4" fill="#E8E69A"/>
                <circle cx="70" cy="57" r="4.5" fill="#D4CF7A"/>
                <circle cx="90" cy="58" r="4" fill="#E8E69A"/>
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
        <div class="section-header section-header--center">
          <span class="section-eyebrow">Khách hàng nói gì</span>
          <h2 class="section-title">Hơn 2,400 người tin tưởng chúng tôi</h2>
        </div>

        <div class="reviews-grid">
          <div
            v-for="(r, idx) in reviews"
            :key="r.name"
            class="review-card"
            :style="{ transitionDelay: `${idx * 0.1}s` }"
          >
            <div class="review-stars"><span class="star-row" aria-hidden="true"><iconify-icon v-for="n in 5" :key="`r-${n}`" icon="ph:star-fill"></iconify-icon></span></div>
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
        <div class="cta-deco">
          <iconify-icon icon="ph:star-duotone"></iconify-icon>
          <iconify-icon icon="ph:sparkle-duotone"></iconify-icon>
          <iconify-icon icon="ph:star-duotone"></iconify-icon>
        </div>
        <h2 class="cta-title">Đặt bánh ngay hôm nay<br/>nhận <em>giảm 15%</em> đơn đầu tiên</h2>
        <p class="cta-sub">Dùng mã <strong>CREAM15</strong> khi thanh toán</p>
        <button @click="scrollToProducts" class="cta-btn">Mua sắm ngay</button>
      </div>
    </section>

    <Transition name="fade">
      <button v-if="showBackTop" class="back-top-btn" @click="scrollToTop" title="Lên đầu trang">↑</button>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useProductStore } from '@/stores/productStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import heroImage from '@/assets/images/thiet-ke-cua-tiem-banh-ngot-1.jpg'

const router = useRouter()
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const search = ref('')
const activeCategory = ref(null)
const sortBy = ref('newest')
const viewMode = ref('grid')
const showBackTop = ref(false)
const ripplingCat = ref(null)
const defaultImage = 'https://placehold.co/400x300?text=Polycake'

const formatPrice = (price) => {
  if (!price && price !== 0) return 'Liên hệ'
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

const handleImageError = (e) => { e.target.src = defaultImage }

onMounted(() => {
  productStore.fetchAllProducts()
  categoryStore.fetchAllCategories()

  scrollHandler = () => { showBackTop.value = window.scrollY > 500 }
  window.addEventListener('scroll', scrollHandler)

  nextTick().then(initScrollReveal)
})

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
    product.added = true
    setTimeout(() => { product.added = false }, 1800)
    ElMessage.success(`Đã thêm "${product.tenSanPham}" vào giỏ hàng!`)
  } else {
    ElMessage.error(typeof result.message === 'string' ? result.message : 'Thêm vào giỏ thất bại, vui lòng thử lại!')
  }
}

const scrollToProducts = () => {
  const el = document.getElementById('product-section')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleCatClick = (categoryId, rippleKey) => {
  activeCategory.value = categoryId
  ripplingCat.value = rippleKey
  setTimeout(() => { ripplingCat.value = null }, 300)
}

const toggleWishlist = (p) => {
  p.wished = !p.wished
  if (p.wished) ElMessage.success('Đã thêm vào danh sách yêu thích!')
  else ElMessage.info('Đã bỏ khỏi danh sách yêu thích.')
}

let scrollHandler = null
let observer = null

const initScrollReveal = () => {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible')
    })
  }, { threshold: 0.12 })

  document.querySelectorAll('.review-card, .product-card').forEach(el => {
    observer.observe(el)
  })
}

watch(displayedProducts, async () => {
  await nextTick()
  initScrollReveal()
})

onUnmounted(() => {
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
  if (observer) observer.disconnect()
})

const proofColors = ['#FFFBF5', '#F5E6CE', '#E8D9C4', '#B8956A', '#7A5C3A']

const trustItems = [
  { icon: 'ph:truck-duotone', label: 'Miễn phí giao từ 300k' },
  { icon: 'ph:seal-check-duotone', label: 'Nguyên liệu tươi mỗi ngày' },
  { icon: 'ph:clock-duotone', label: 'Đặt trước 14h – giao ngay' },
  { icon: 'ph:medal-duotone', label: '100% hoàn tiền bảo hành' },
]

const designFeatures = [
  { icon: 'ph:arrows-clockwise-duotone', label: 'Xoay 360°' },
  { icon: 'ph:palette-duotone', label: 'Tuỳ màu & trang trí' },
  { icon: 'ph:paper-plane-tilt-duotone', label: 'Gửi kèm đơn' },
]

const reviews = [
  { name: 'Nguyễn Thị Lan', initials: 'NL', location: 'TP. HCM', date: '20/05/2026', color: '#7A5C3A', quote: 'Bánh kem rất ngon, đóng gói đẹp, giao đúng giờ. Sẽ ủng hộ lại lần sau!' },
  { name: 'Trần Minh Quân', initials: 'TQ', location: 'Hà Nội', date: '15/05/2026', color: '#9A7650', quote: 'Thiết kế 3D độc đáo, nhân viên tư vấn nhiệt tình. Bánh đẹp hơn tưởng tượng!' },
  { name: 'Lê Thu Hương', initials: 'LH', location: 'Đà Nẵng', date: '10/05/2026', color: '#B8956A', quote: 'Cupcake siêu xinh và ngon. Mua làm quà tặng bạn bè ai cũng khen nức nở.' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Nunito:wght@400;500;600;700;800;900&display=swap');

.shop-page {
  /* Trắng Kem (Cream White) */
  --cream-white:       #FFFBF5;
  --cream-white-soft:  #FDF6EC;
  --cream-white-mid:   #F5E6CE;
  --cream-white-deep:  #EDE0CC;

  /* Nâu Lúa Mì (Wheat Brown) */
  --wheat-brown:       #7A5C3A;
  --wheat-brown-dark:  #5C4428;
  --wheat-brown-mid:   #9A7650;
  --wheat-brown-light: #B8956A;
  --wheat-brown-pale:  #E8D9C4;

  /* Typography */
  --font-script: 'Great Vibes', cursive;
  --font-sans:   'Nunito', sans-serif;

  /* Aliases (dùng xuyên suốt component) */
  --c-cream:      var(--cream-white-mid);
  --c-champagne:  var(--cream-white-soft);
  --c-champagne-light: var(--cream-white);
  --c-champagne-mid:   var(--cream-white-deep);
  --c-blossom-pale:    var(--cream-white);
  --c-text:       var(--wheat-brown-dark);
  --c-text-mid:   var(--wheat-brown);
  --c-text-light: var(--wheat-brown-mid);
  --c-white:      var(--cream-white);
  --c-card:       var(--cream-white);
  --c-amber:      var(--wheat-brown);
  --c-gold:       var(--wheat-brown-mid);

  font-family: var(--font-sans);
  font-weight: 600;
  background: var(--cream-white);
  color: var(--c-text);
}

.hero-section {
  position: relative;
  width: 100%;
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
  background: linear-gradient(110deg, rgba(92,68,40,0.82) 0%, rgba(122,92,58,0.55) 50%, rgba(92,68,40,0.15) 100%);
}
.hero-grain {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 180px 180px;
}
.hero-deco { position: absolute; border-radius: 50%; pointer-events: none; z-index: 1; }
.hero-deco--tr { width: 400px; height: 400px; top: -80px; right: -80px; background: radial-gradient(circle, rgba(255,251,245,0.18), transparent); filter: blur(60px); }
.hero-deco--bl { width: 300px; height: 300px; bottom: -60px; left: -60px; background: radial-gradient(circle, rgba(245,230,206,0.15), transparent); filter: blur(50px); }
.hero-deco--c { width: 200px; height: 200px; top: 50%; left: 35%; opacity: 0.1; background: radial-gradient(circle, rgba(255,251,245,0.55), transparent); filter: blur(40px); transform: translateY(-50%); }
.hero-content { position: relative; z-index: 2; width: 100%; padding: 80px; }
.hero-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 40px; }
.hero-text-block { max-width: 520px; animation: fadeSlideUp 0.8s ease-out both; }
@keyframes fadeSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.hero-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-sans); font-size: 11px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--cream-white-mid); margin-bottom: 20px; }
.eyebrow-icon { font-size: 15px; color: var(--cream-white-mid); }
.hero-headline { margin: 0 0 28px; color: #fff; display: flex; flex-direction: column; align-items: flex-start; }
.hero-headline-sans { font-family: var(--font-sans); font-size: 26px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,251,245,0.92); line-height: 1.2; margin: 0; }
.hero-headline-script {
  font-family: var(--font-script);
  font-size: clamp(72px, 9vw, 108px);
  font-weight: 400;
  font-style: normal;
  line-height: 1.2;
  margin: 22px 0 0;
  padding-top: 6px;
  background: linear-gradient(135deg, #FFFBF5, #F5E6CE, #E8D9C4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 3px 14px rgba(92,68,40,0.3));
}
.hero-headline-script--solo { margin-top: 0; padding-top: 0; }
.cat-icon--glyph { display: inline-flex; align-items: center; justify-content: center; font-size: 18px; color: #7A5C3A; }
.hero-desc { font-family: var(--font-sans); font-size: 15px; line-height: 1.8; color: rgba(255,251,245,0.85); margin: 0 0 36px; max-width: 400px; font-weight: 500; }
.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 32px; }
.hero-btn-main, .hero-btn-ghost { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-sans); font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; padding: 14px 28px; border-radius: 50px; text-decoration: none; transition: all 0.25s; cursor: pointer; }
.hero-btn-main { background: linear-gradient(135deg, var(--wheat-brown), var(--wheat-brown-mid)); color: var(--cream-white); border: none; box-shadow: 0 4px 20px rgba(92,68,40,0.35); }
.hero-btn-main:hover { background: linear-gradient(135deg, var(--wheat-brown-dark), var(--wheat-brown)); transform: translateY(-2px); }
.hero-btn-ghost { background: rgba(255,251,245,0.12); color: #fff; border: 1.5px solid rgba(255,251,245,0.45); backdrop-filter: blur(8px); }
.hero-btn-ghost:hover { background: rgba(255,251,245,0.2); border-color: rgba(255,251,245,0.7); }
.hero-social-proof { display: flex; align-items: center; gap: 12px; }
.proof-avatars { display: flex; align-items: center; }
.proof-avatar { width: 32px; height: 32px; border-radius: 50%; border: 2.5px solid rgba(255,255,255,0.7); flex-shrink: 0; }
.proof-text { font-family: var(--font-sans); font-size: 13px; color: rgba(255,251,245,0.88); font-weight: 600; }
.proof-text strong { color: #fff; font-weight: 800; }

.hero-float-card {
  background: rgba(255,251,245,0.96);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 22px 20px;
  width: 210px;
  flex-shrink: 0;
  box-shadow: 0 20px 50px rgba(92,68,40,0.16);
  border: 1px solid var(--cream-white-deep);
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  text-align: center;
  animation: fadeSlideRight 0.8s ease-out 0.3s both, floatCard 3s ease-in-out 1.1s infinite;
}
@keyframes fadeSlideRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes floatCard { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.float-card-badge { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-sans); font-size: 10px; font-weight: 800; color: var(--wheat-brown); letter-spacing: 0.1em; text-transform: uppercase; }
.float-card-name { font-family: var(--font-sans); font-size: 15px; font-weight: 800; color: var(--c-text); }
.float-card-price { font-family: var(--font-sans); font-size: 12px; color: var(--c-text-light); font-weight: 600; }
.float-card-price strong { color: var(--wheat-brown); font-size: 15px; font-weight: 800; }
.float-card-stars { font-size: 12px; color: var(--wheat-brown-mid); display: flex; align-items: center; gap: 6px; }
.star-row { display: inline-flex; align-items: center; gap: 2px; color: var(--wheat-brown-mid); font-size: 12px; }
.star-row iconify-icon { font-size: 12px; }
.float-card-link { margin-top: 4px; font-family: var(--font-sans); font-size: 12px; font-weight: 800; color: var(--wheat-brown); text-decoration: none; }

.hero-scroll-hint { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; color: rgba(255,251,245,0.5); font-family: var(--font-sans); font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; z-index: 3; }
.scroll-line { width: 1px; height: 36px; background: linear-gradient(to bottom, rgba(255,251,245,0.65), transparent); animation: scrollAnim 1.8s ease infinite; }
@keyframes scrollAnim { 0% { transform: scaleY(0); transform-origin: top; } 50% { transform: scaleY(1); transform-origin: top; } 100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; } }

.trust-bar { background: var(--cream-white-soft); padding: 0; border-bottom: 1.5px solid var(--cream-white-deep); }
.trust-bar-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; display: grid; grid-template-columns: repeat(4, 1fr); }
.trust-item { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 16px 24px; border-right: 1px solid var(--wheat-brown-pale); }
.trust-item:last-child { border-right: none; }
.trust-icon { font-size: 20px; color: var(--wheat-brown); }
.trust-label { font-family: var(--font-sans); font-size: 12px; font-weight: 800; color: var(--wheat-brown-dark); }

.section-divider { line-height: 0; overflow: hidden; margin: -1px 0; }
.section-divider svg { display: block; width: 100%; }

.section-container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
.section-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 32px; }
.section-header--center { justify-content: center; text-align: center; flex-direction: column; align-items: center; gap: 8px; }
.section-header-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; flex-wrap: wrap; }
.section-eyebrow { display: block; font-family: var(--font-sans); font-size: 11px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: var(--wheat-brown-mid); margin-bottom: 6px; }
.section-title { font-family: var(--font-script); font-size: 42px; font-weight: 400; color: var(--wheat-brown-dark); margin: 0; line-height: 1.15; }
.section-subtitle { font-family: var(--font-sans); font-size: 14px; color: var(--c-text-light); margin: 6px 0 0; font-weight: 600; }
.section-link { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-sans); font-size: 13px; font-weight: 800; color: var(--wheat-brown); text-decoration: none; white-space: nowrap; }

.search-wrapper { position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 12px; font-size: 16px; color: var(--c-text-light); pointer-events: none; }
.search-input { width: 200px; padding: 9px 32px 9px 36px; border-radius: 14px; border: 1.5px solid var(--cream-white-deep); background: var(--cream-white); font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--c-text); outline: none; }
.search-input:focus { border-color: var(--wheat-brown-pale); box-shadow: 0 0 0 3px rgba(122,92,58,0.12); }
.search-clear { position: absolute; right: 8px; width: 22px; height: 22px; border: none; border-radius: 50%; background: var(--wheat-brown-pale); color: var(--wheat-brown); cursor: pointer; font-weight: 800; }

.sort-select {
  padding: 9px 14px;
  border-radius: 14px;
  border: 1.5px solid var(--cream-white-deep);
  background: var(--cream-white);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 700;
  color: var(--c-text-mid);
  outline: none;
  cursor: pointer;
}

.view-toggle { display: flex; gap: 4px; background: var(--cream-white-deep); border-radius: 10px; padding: 3px; }
.view-btn { width: 32px; height: 32px; border: none; background: transparent; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--c-text-light); cursor: pointer; }
.view-btn--active { background: var(--cream-white); color: var(--wheat-brown-dark); box-shadow: 0 2px 8px rgba(92,68,40,0.1); }

.section-categories { background: var(--cream-white-soft); padding: 52px 0 32px; }
.category-strip-wrapper { position: relative; }
.category-strip { display: flex; gap: 12px; overflow-x: auto; padding: 4px 2px 8px; scrollbar-width: none; }
.category-strip::-webkit-scrollbar { display: none; }
.cat-pill { display: inline-flex; align-items: center; gap: 10px; padding: 10px 20px; border-radius: 99px; border: 1.5px solid var(--cream-white-deep); background: var(--cream-white); cursor: pointer; font-family: var(--font-sans); font-size: 13px; font-weight: 700; color: var(--c-text-mid); white-space: nowrap; flex-shrink: 0; position: relative; overflow: hidden; transition: all 0.2s; }
.cat-pill--active { border-color: var(--wheat-brown); background: linear-gradient(135deg, var(--cream-white-mid), var(--wheat-brown-pale)); color: var(--wheat-brown-dark); }
.cat-pill--skeleton { width: 120px; height: 44px; animation: shimmerLoad 1.5s infinite; pointer-events: none; }
.cat-pill.rippling::after { content: ''; position: absolute; inset: 0; background: rgba(255,251,245,0.6); border-radius: 99px; animation: ripple 0.3s ease-out forwards; }
@keyframes ripple { from { opacity: 1; transform: scale(0.85); } to { opacity: 0; transform: scale(1.05); } }
.cat-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
.cat-icon--img { object-fit: cover; }

.section-products { background: var(--cream-white); padding: 64px 0 80px; }

.product-card, .review-card { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s; }
.product-card.visible, .review-card.visible { opacity: 1; transform: translateY(0); }

.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.product-grid--list { grid-template-columns: 1fr; }
.product-grid--list .product-card { flex-direction: row; }
.product-grid--list .product-img { width: 200px; height: 160px; flex-shrink: 0; }

.product-card { background: var(--c-card); border-radius: 22px; overflow: hidden; border: 1.5px solid var(--cream-white-deep); display: flex; flex-direction: column; cursor: pointer; }
.product-card:hover { transform: translateY(-6px) !important; box-shadow: 0 20px 44px rgba(122,92,58,0.12); border-color: var(--wheat-brown-pale); }
.product-img { height: 190px; position: relative; overflow: hidden; background: var(--cream-white-soft); }
.product-photo { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.product-card:hover .product-photo { transform: scale(1.08); }
.product-wish { position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; border-radius: 50%; background: rgba(255,251,245,0.94); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #ccc; z-index: 5; }
.product-wish--active { color: var(--wheat-brown) !important; }
.product-badge { position: absolute; top: 12px; left: 12px; color: var(--cream-white); font-family: var(--font-sans); font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 99px; z-index: 5; }
.product-body { padding: 18px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.product-meta { font-family: var(--font-sans); font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--c-text-light); margin-bottom: 4px; }
.product-name { font-family: var(--font-sans); font-size: 16px; font-weight: 800; color: var(--c-text); margin: 0; line-height: 1.25; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.product-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 12px; }
.product-price { font-family: var(--font-sans); font-size: 17px; font-weight: 900; color: var(--wheat-brown); }
.product-add-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 15px; border-radius: 20px; background: var(--cream-white-soft); color: var(--wheat-brown-dark); font-family: var(--font-sans); font-size: 12px; font-weight: 800; border: none; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
.product-add-btn:hover:not(:disabled) { background: linear-gradient(135deg, var(--wheat-brown-pale), var(--cream-white-mid)); transform: scale(1.05); }
.product-add-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.product-add-btn--done { background: #dcfce7 !important; color: #16a34a !important; }
.spin-icon { animation: spin 0.75s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.product-rating { padding: 10px 18px 14px; border-top: 1px solid var(--cream-white-deep); display: flex; align-items: center; gap: 8px; }
.stars { color: var(--wheat-brown-mid); font-size: 12px; }
.rating-text { font-family: var(--font-sans); font-size: 11px; color: var(--c-text-light); font-weight: 600; }

.skeleton-grid { pointer-events: none; }
.skeleton-card { background: var(--c-card); border-radius: 22px; overflow: hidden; border: 1.5px solid var(--cream-white-deep); }
.skeleton-img { height: 190px; background: linear-gradient(90deg, var(--cream-white-soft) 25%, var(--cream-white-mid) 50%, var(--cream-white-soft) 75%); background-size: 200% 100%; animation: shimmerLoad 1.5s infinite; }
.skeleton-body { padding: 18px; display: flex; flex-direction: column; gap: 10px; }
.skeleton-line { height: 12px; border-radius: 6px; background: linear-gradient(90deg, var(--cream-white-soft) 25%, var(--cream-white-mid) 50%, var(--cream-white-soft) 75%); background-size: 200% 100%; animation: shimmerLoad 1.5s infinite; }
.skeleton-line--short { width: 40%; }
.skeleton-line--mid { width: 70%; }
@keyframes shimmerLoad { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.empty-state { text-align: center; padding: 60px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.empty-text { font-family: var(--font-sans); font-size: 16px; color: var(--c-text-light); font-weight: 800; }
.empty-reset { background: linear-gradient(135deg, var(--wheat-brown-pale), var(--cream-white-mid)); border: none; color: var(--wheat-brown-dark); font-family: var(--font-sans); font-size: 13px; font-weight: 800; padding: 10px 28px; border-radius: 50px; cursor: pointer; }

.banner-3d { background: linear-gradient(135deg, var(--wheat-brown-dark) 0%, var(--wheat-brown) 45%, #4A3526 100%); padding: 80px 0; position: relative; overflow: hidden; }
.banner-3d-inner { display: flex; align-items: center; gap: 60px; }
.banner-3d-title { font-family: var(--font-sans); font-size: 40px; font-weight: 900; color: #fff; margin: 12px 0 16px; line-height: 1.15; }
.banner-3d-title em { font-family: var(--font-script); font-size: 52px; font-weight: 400; font-style: normal; background: linear-gradient(135deg, #FFFBF5, #F5E6CE); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.banner-3d-desc { font-family: var(--font-sans); font-size: 14px; color: rgba(255,251,245,0.72); line-height: 1.8; margin: 0 0 28px; max-width: 380px; font-weight: 500; }
.banner-3d-btn { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, var(--cream-white), var(--cream-white-mid)); color: var(--wheat-brown-dark); font-family: var(--font-sans); font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 14px 28px; border-radius: 50px; text-decoration: none; }
.banner-3d-features { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px; }
.feature-tag { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-sans); font-size: 12px; font-weight: 700; color: rgba(255,251,245,0.75); border: 1px solid rgba(255,251,245,0.22); border-radius: 99px; padding: 5px 14px; }
.designer-preview { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.preview-cake { animation: floatCake 3.5s ease-in-out infinite; }
@keyframes floatCake { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-14px) rotate(2deg); } }
.preview-label { font-family: var(--font-sans); font-size: 11px; font-weight: 800; color: rgba(255,251,245,0.5); letter-spacing: 0.12em; text-transform: uppercase; }

.section-reviews { background: var(--cream-white-soft); padding: 80px 0; }
.reviews-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 48px; }
.review-card { background: var(--cream-white); border: 1.5px solid var(--cream-white-deep); border-radius: 22px; padding: 24px; }
.review-stars { color: var(--wheat-brown-mid); font-size: 15px; margin-bottom: 12px; }
.review-stars .star-row iconify-icon { font-size: 14px; }
.review-quote { font-family: var(--font-script); font-size: 26px; font-weight: 400; color: var(--wheat-brown-dark); line-height: 1.45; margin: 0 0 20px; }
.review-author { display: flex; align-items: center; gap: 12px; }
.review-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-sans); font-size: 13px; font-weight: 800; color: var(--cream-white); }
.review-name { font-family: var(--font-sans); font-size: 14px; font-weight: 800; }
.review-loc { font-family: var(--font-sans); font-size: 11px; color: var(--c-text-light); margin-top: 2px; font-weight: 600; }

.cta-strip { background: linear-gradient(135deg, var(--cream-white), var(--cream-white-soft), var(--cream-white)); padding: 80px 0; text-align: center; border-top: 1.5px solid var(--cream-white-deep); }
.cta-deco { display: flex; align-items: center; justify-content: center; gap: 20px; font-size: 18px; color: var(--wheat-brown-mid); margin-bottom: 20px; opacity: 0.85; }
.cta-title { font-family: var(--font-sans); font-size: 36px; font-weight: 900; color: var(--wheat-brown-dark); line-height: 1.2; margin: 0 0 12px; }
.cta-title em { font-family: var(--font-script); font-size: 48px; font-weight: 400; font-style: normal; background: linear-gradient(135deg, var(--wheat-brown), var(--wheat-brown-mid)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.cta-sub { font-family: var(--font-sans); font-size: 15px; color: var(--c-text-mid); margin: 0 0 32px; font-weight: 600; }
.cta-sub strong { font-family: var(--font-sans); font-size: 18px; font-weight: 900; color: var(--wheat-brown); background: rgba(122,92,58,0.08); border: 1px dashed var(--wheat-brown-pale); border-radius: 8px; padding: 2px 12px; }
.cta-btn { display: inline-block; background: linear-gradient(135deg, var(--wheat-brown), var(--wheat-brown-mid)); color: var(--cream-white); font-family: var(--font-sans); font-size: 12px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; padding: 16px 40px; border-radius: 50px; border: none; cursor: pointer; box-shadow: 0 6px 24px rgba(92,68,40,0.28); }

.back-top-btn { position: fixed; bottom: 32px; right: 32px; width: 48px; height: 48px; border-radius: 50%; border: none; background: linear-gradient(135deg, var(--cream-white-mid), var(--wheat-brown-pale)); color: var(--wheat-brown-dark); font-family: var(--font-sans); font-size: 20px; font-weight: 900; cursor: pointer; box-shadow: 0 6px 20px rgba(122,92,58,0.15); z-index: 1000; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }

@media (max-width: 1024px) {
  .hero-headline-script { font-size: 68px; margin-top: 14px; }
  .hero-content { padding: 60px 40px; }
  .hero-float-card, .banner-3d-right, .hero-deco { display: none; }
  .product-grid, .trust-bar-inner { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .hero-headline-sans { font-size: 20px; }
  .hero-headline-script { font-size: 56px; margin-top: 12px; }
  .hero-content, .section-container { padding: 40px 20px; }
  .section-header { flex-direction: column; align-items: flex-start; }
  .section-header-right { width: 100%; }
  .search-input { width: 100%; }
  .section-title { font-size: 34px; }
  .product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .reviews-grid { grid-template-columns: 1fr; }
  .cta-title { font-size: 28px; }
  .cta-title em { font-size: 38px; }
  .back-top-btn { bottom: 16px; right: 16px; }
}
</style>
