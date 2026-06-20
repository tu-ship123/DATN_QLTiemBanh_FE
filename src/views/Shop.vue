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
              Mỗi chiếc bánh là một câu chuyện — được nhào nặn từ nguyên liệu tươi ngon
              và tình yêu thương của người thợ bánh.
            </p>

            <div class="hero-actions">
              <RouterLink to="/shop/products" class="hero-btn-main">
                <iconify-icon icon="ph:storefront-duotone"></iconify-icon>
                Khám phá ngay
              </RouterLink>
              <RouterLink to="/shop/design" class="hero-btn-ghost">
                <iconify-icon icon="ph:cube-duotone"></iconify-icon>
                Thiết kế 3D
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
          <div class="hero-float-card">
            <div class="float-card-badge">✦ Hôm nay</div>
            <!-- SVG Cake icon thay emoji -->
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
                <!-- Cream swirls on tiers -->
                <circle cx="26" cy="43" r="2" fill="#FBB6CE" opacity="0.7"/>
                <circle cx="33" cy="43" r="2" fill="#FBB6CE" opacity="0.7"/>
                <circle cx="40" cy="43" r="2" fill="#FBB6CE" opacity="0.7"/>
                <circle cx="47" cy="43" r="2" fill="#FBB6CE" opacity="0.7"/>
                <circle cx="54" cy="43" r="2" fill="#FBB6CE" opacity="0.7"/>
                <!-- Flowers on top tier -->
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
    <div class="trust-bar">
      <div class="trust-bar-inner">
        <div v-for="t in trustItems" :key="t.label" class="trust-item">
          <iconify-icon :icon="t.icon" class="trust-icon"></iconify-icon>
          <span class="trust-label">{{ t.label }}</span>
        </div>
      </div>
    </div>

    <!-- ===== CATEGORIES ===== -->
    <section class="section-categories">
      <div class="section-container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">Danh mục</span>
            <h2 class="section-title">Bạn thích loại bánh nào?</h2>
          </div>
        </div>

        <div class="category-strip">
          <button
            v-for="cat in categories"
            :key="cat.name"
            class="cat-pill"
            :class="activeCategory === cat.name ? 'cat-pill--active' : ''"
            @click="activeCategory = cat.name"
          >
            <span class="cat-icon" :style="{ background: cat.bg }">{{ cat.icon }}</span>
            <span>{{ cat.name }}</span>
          </button>
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
          <RouterLink to="/shop/products" class="section-link">
            Xem tất cả <iconify-icon icon="ph:arrow-right"></iconify-icon>
          </RouterLink>
        </div>

        <div class="product-grid">
          <div
            v-for="p in featuredProducts"
            :key="p.id"
            class="product-card"
          >
            <!-- Image area -->
            <div class="product-img" :style="{ background: p.imgBg }">
              <span class="product-emoji">{{ p.emoji }}</span>
              <button class="product-wish" @click="toggleWishlist(p)" :class="p.wished ? 'product-wish--active' : ''">
                <iconify-icon :icon="p.wished ? 'ph:heart-fill' : 'ph:heart'"></iconify-icon>
              </button>
              <span v-if="p.badge" class="product-badge" :style="{ background: p.badgeColor }">{{ p.badge }}</span>
            </div>

            <!-- Body -->
            <div class="product-body">
              <div class="product-meta">{{ p.category }}</div>
              <h3 class="product-name">{{ p.name }}</h3>
              <p class="product-desc">{{ p.desc }}</p>

              <!-- Variants -->
              <div class="product-variants">
                <button
                  v-for="v in p.variants"
                  :key="v"
                  class="variant-btn"
                  :class="p.selectedVariant === v ? 'variant-btn--active' : ''"
                  @click="p.selectedVariant = v"
                >{{ v }}</button>
              </div>

              <!-- Price + CTA -->
              <div class="product-footer">
                <div class="product-pricing">
                  <span class="product-price">{{ p.price }}</span>
                  <span v-if="p.origPrice" class="product-orig">{{ p.origPrice }}</span>
                </div>
                <button class="product-add-btn" @click="addToCart(p)" :class="p.added ? 'product-add-btn--done' : ''">
                  <iconify-icon :icon="p.added ? 'ph:check-bold' : 'ph:shopping-cart-simple'"></iconify-icon>
                  {{ p.added ? 'Đã thêm' : 'Thêm' }}
                </button>
              </div>
            </div>

            <!-- Rating -->
            <div class="product-rating">
              <span class="stars">★★★★★</span>
              <span class="rating-text">{{ p.rating }} · {{ p.reviews }} đánh giá</span>
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
        <div class="banner-3d-right">
          <div class="designer-preview">
            <div class="preview-cake">
              <!-- SVG floating cake decoration -->
              <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" width="140" height="140">
                <circle cx="70" cy="70" r="68" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
                <!-- Cake layers -->
                <rect x="18" y="90" width="104" height="22" rx="11" fill="rgba(255,255,255,0.85)"/>
                <rect x="28" y="68" width="84" height="22" rx="11" fill="rgba(255,255,255,0.75)"/>
                <rect x="38" y="48" width="64" height="20" rx="10" fill="rgba(255,255,255,0.65)"/>
                <!-- Candle -->
                <rect x="67" y="34" width="6" height="14" rx="3" fill="#FBB6CE"/>
                <!-- Flame -->
                <ellipse cx="70" cy="32" rx="4" ry="5" fill="#FBBF24"/>
                <!-- Pink dots decoration -->
                <circle cx="36" cy="79" r="3" fill="#F9A8D4" opacity="0.8"/>
                <circle cx="50" cy="79" r="3" fill="#F9A8D4" opacity="0.8"/>
                <circle cx="64" cy="79" r="3" fill="#F9A8D4" opacity="0.8"/>
                <circle cx="78" cy="79" r="3" fill="#F9A8D4" opacity="0.8"/>
                <circle cx="92" cy="79" r="3" fill="#F9A8D4" opacity="0.8"/>
                <circle cx="106" cy="79" r="3" fill="#F9A8D4" opacity="0.8"/>
                <!-- Flowers on top tier -->
                <circle cx="50" cy="58" r="4" fill="#FBCFE8"/>
                <circle cx="70" cy="57" r="4.5" fill="#F472B6"/>
                <circle cx="90" cy="58" r="4" fill="#FBCFE8"/>
                <!-- Stars -->
                <text x="14" y="30" font-size="14" fill="rgba(255,255,255,0.5)">✦</text>
                <text x="110" y="20" font-size="10" fill="rgba(255,255,255,0.4)">✦</text>
                <text x="6" y="80" font-size="10" fill="rgba(255,255,255,0.35)">✿</text>
                <text x="122" y="75" font-size="12" fill="rgba(255,255,255,0.4)">✿</text>
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
        <RouterLink to="/shop/products" class="cta-btn">Mua sắm ngay</RouterLink>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import heroImage from '@/assets/images/thiet-ke-cua-tiem-banh-ngot-1.jpg'

const activeCategory = ref('Bánh Kem')
const proofColors = ['#F9A8D4', '#FBCFE8', '#F472B6', '#EC4899', '#DB2777']

const trustItems = [
  { icon: 'ph:truck-duotone',    label: 'Miễn phí giao từ 300k' },
  { icon: 'ph:seal-check-duotone', label: 'Nguyên liệu tươi mỗi ngày' },
  { icon: 'ph:clock-duotone',    label: 'Đặt trước 14h – giao ngay' },
  { icon: 'ph:medal-duotone',    label: '100% hoàn tiền bảo hành' },
]

const categories = [
  { name: 'Bánh Kem',       icon: '🎂', bg: 'linear-gradient(135deg,#FBCFE8,#F9A8D4)' },
  { name: 'Cupcake',        icon: '🧁', bg: 'linear-gradient(135deg,#FDE68A,#FCA5A5)' },
  { name: 'Bánh Mì',        icon: '🥐', bg: 'linear-gradient(135deg,#FEF3C7,#FCD34D)' },
  { name: 'Tart & Trái Cây',icon: '🍓', bg: 'linear-gradient(135deg,#FFE4E6,#FCA5A5)' },
  { name: 'Thiết Kế 3D',    icon: '✨', bg: 'linear-gradient(135deg,#EDE9FE,#C4B5FD)' },
  { name: 'Đồ Uống',        icon: '🥤', bg: 'linear-gradient(135deg,#CFFAFE,#67E8F9)' },
]

const featuredProducts = reactive([
  {
    id: 1, name: 'Bánh Kem Dâu 3 Tầng', category: 'Bánh kem',
    desc: 'Kem tươi Anchor, dâu tây nhập khẩu từ Đà Lạt',
    emoji: '🎂', imgBg: 'linear-gradient(135deg,#FFF0F5,#FBCFE8)',
    badge: 'Bán chạy', badgeColor: '#EC4899',
    price: '185,000đ', origPrice: '220,000đ',
    variants: ['15cm', '20cm', '25cm'], selectedVariant: '20cm',
    rating: 4.5, reviews: 128, wished: false, added: false
  },
  {
    id: 2, name: 'Cupcake Hộp 12', category: 'Cupcake',
    desc: 'Mix các vị: vanilla, matcha, dâu, cà phê',
    emoji: '🧁', imgBg: 'linear-gradient(135deg,#FFF9F0,#FDE68A)',
    badge: 'Mới', badgeColor: '#F59E0B',
    price: '420,000đ', origPrice: null,
    variants: ['Hộp 6', 'Hộp 12'], selectedVariant: 'Hộp 12',
    rating: 4.8, reviews: 64, wished: false, added: false
  },
  {
    id: 3, name: 'Bánh 3D Custom', category: 'Thiết kế 3D',
    desc: 'Độc nhất vô nhị – thiết kế theo yêu cầu của bạn',
    emoji: '✨', imgBg: 'linear-gradient(135deg,#F5F0FF,#DDD5F0)',
    badge: '3D', badgeColor: '#8B5CF6',
    price: 'từ 350,000đ', origPrice: null,
    variants: ['20cm', '25cm', '30cm'], selectedVariant: '25cm',
    rating: 5.0, reviews: 42, wished: false, added: false
  },
  {
    id: 4, name: 'Tart Dâu Tây', category: 'Tart & Trái cây',
    desc: 'Vỏ bơ giòn tan, kem custard mịn, dâu tươi óng ánh',
    emoji: '🍓', imgBg: 'linear-gradient(135deg,#FFF0F5,#FCA5A5)',
    badge: null, badgeColor: null,
    price: '55,000đ', origPrice: null,
    variants: ['Nhỏ', 'Vừa'], selectedVariant: 'Vừa',
    rating: 4.7, reviews: 95, wished: false, added: false
  }
])

const designFeatures = ['🔄 Xoay 360°', '🎨 Tuỳ màu & trang trí', '📤 Gửi kèm đơn']

const reviews = [
  { name: 'Nguyễn Thị Lan',   initials: 'NL', location: 'TP. HCM',   date: '20/05/2026', color: '#F472B6', quote: 'Bánh kem rất ngon, đóng gói đẹp, giao đúng giờ. Sẽ ủng hộ lại lần sau!' },
  { name: 'Trần Minh Quân',   initials: 'TQ', location: 'Hà Nội',     date: '15/05/2026', color: '#A78BFA', quote: 'Thiết kế 3D độc đáo, nhân viên tư vấn nhiệt tình. Bánh đẹp hơn tưởng tượng!' },
  { name: 'Lê Thu Hương',     initials: 'LH', location: 'Đà Nẵng',    date: '10/05/2026', color: '#FB7185', quote: 'Cupcake siêu xinh và ngon. Mua làm quà tặng bạn bè ai cũng khen nức nở.' },
]

const toggleWishlist = (p) => { p.wished = !p.wished }
const addToCart = (p) => {
  p.added = true
  setTimeout(() => { p.added = false }, 1800)
  window.dispatchEvent(new CustomEvent('cart:update', { detail: { count: 4 } }))
}
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
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
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
.section-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--c-blossom-mid);
  text-decoration: none;
  white-space: nowrap;
  padding-bottom: 3px;
  border-bottom: 1.5px solid var(--c-blossom-soft);
  transition: border-color 0.2s;
}
.section-link:hover { border-color: var(--c-blossom-mid); }

/* ===== CATEGORIES ===== */
.section-categories {
  background: var(--c-white);
  padding: 52px 0 32px;
}
.category-strip {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: none;
}
.category-strip::-webkit-scrollbar { display: none; }
.cat-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
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
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}

/* ===== PRODUCTS ===== */
.section-products {
  background: var(--c-blossom-pale);
  padding: 64px 0 80px;
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
  height: 190px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.product-emoji {
  font-size: 64px;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.08));
  transition: transform 0.35s;
}
.product-card:hover .product-emoji { transform: scale(1.12) rotate(-5deg); }
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
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--c-text-light); margin-bottom: 4px;
}
.product-name {
  font-family: 'Playfair Display', serif;
  font-size: 16px; font-weight: 900;
  color: var(--c-text); margin: 0 0 5px; line-height: 1.25;
}
.product-desc {
  font-size: 12px; color: var(--c-text-light);
  margin: 0 0 10px; line-height: 1.55;
}
.product-variants { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
.variant-btn {
  font-size: 10px; font-weight: 600;
  padding: 4px 10px; border-radius: 99px;
  border: 1.5px solid #F5D0E8; color: var(--c-text-mid);
  background: transparent; cursor: pointer; transition: all 0.15s;
}
.variant-btn:hover { border-color: var(--c-blossom); color: var(--c-blossom-mid); }
.variant-btn--active {
  background: linear-gradient(135deg,#EC4899,#F472B6);
  border-color: transparent; color: #fff;
}
.product-footer {
  display: flex; align-items: center;
  justify-content: space-between; gap: 8px;
  margin-top: 8px;
}
.product-price { font-size: 17px; font-weight: 800; color: var(--c-blossom-mid); display: block; }
.product-orig { font-size: 12px; color: #ccc; text-decoration: line-through; }
.product-add-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 15px; border-radius: 20px;
  background: #FFF0F7; color: var(--c-blossom-mid);
  font-size: 12px; font-weight: 700; border: none; cursor: pointer;
  transition: all 0.2s; white-space: nowrap;
}
.product-add-btn:hover {
  background: linear-gradient(135deg,#EC4899,#F472B6);
  color: #fff;
  box-shadow: 0 4px 12px rgba(236,72,153,0.3);
}
.product-add-btn--done { background: #dcfce7 !important; color: #16a34a !important; }
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
  .section-header { flex-direction: column; align-items: flex-start; }
  .section-categories, .section-products, .section-reviews, .cta-strip { padding: 48px 0; }
  .banner-3d { padding: 48px 0; }
  .trust-bar-inner { grid-template-columns: 1fr 1fr; }
  .product-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .reviews-grid { grid-template-columns: 1fr; }
  .hero-actions { flex-direction: column; }
  .cta-title { font-size: 28px; }
}
</style>