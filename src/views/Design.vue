<template>
  <div class="chocopine-page animate-fade-in">
    <div class="chocopine-inner space-y-8">
      <section class="chocopine-card p-8 md:p-12">
        <div class="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div class="space-y-6">
            <span class="chocopine-badge">Tự thiết kế bánh 3D</span>
            <h1 class="chocopine-title chocopine-title--lg">Tạo Chiếc Bánh Riêng Theo Cách Của Bạn</h1>
            <p class="chocopine-desc" style="text-align: left; margin-top: 0;">
              Chọn kiểu dáng, phối màu sắc và thêm thắt những chi tiết trang trí ngọt ngào của riêng bạn. Công cụ mô phỏng 3D trực quan giúp bạn xem trước chiếc bánh mơ ước trong nháy mắt.
            </p>
            <div class="flex flex-wrap gap-3">
              <button class="chocopine-btn-primary px-6 py-3.5">Bắt đầu thiết kế 3D</button>
              <button class="chocopine-btn-secondary px-6 py-3.5">Xem bộ sưu tập mẫu</button>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div v-for="item in samples" :key="item.title" class="chocopine-card chocopine-card--soft p-5 hover:shadow-md transition-shadow">
              <iconify-icon :icon="item.icon" class="text-2xl chocopine-accent"></iconify-icon>
              <h3 class="chocopine-heading-sm mt-2">{{ item.title }}</h3>
              <p class="chocopine-desc" style="margin-top: 4px; font-size: 12px; text-align: left;">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-6 lg:grid-cols-3">
        <div v-for="block in features" :key="block.title" class="chocopine-card p-6 space-y-2">
          <h2 class="chocopine-heading-sm">{{ block.title }}</h2>
          <ul class="space-y-2">
            <li v-for="line in block.items" :key="line" class="chocopine-desc" style="margin: 0; font-size: 12px; text-align: left;">• {{ line }}</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
const samples = [
  { icon: 'ph:rings-duotone', title: 'Bánh cưới truyền thống', desc: 'Tầng hoa lộng lẫy, phối tone pastel kem sữa nhẹ nhàng và quý phái.' },
  { icon: 'ph:balloon-duotone', title: 'Bánh sinh nhật Custom', desc: 'Nhiều tạo hình 3D hoạt hình đáng yêu và ngộ nghĩnh cho bé.' },
  { icon: 'ph:cookie-duotone', title: 'Hộp quà Cupcake', desc: 'Trang trí kem hoa tinh tế, mix nhiều vị khác nhau làm quà tặng.' },
  { icon: 'ph:sparkle-duotone', title: 'Macaron tháp thăng hoa', desc: 'Xếp tầng nghệ thuật tinh xảo cho các buổi tiệc trà chiều sang trọng.' },
]

const features = [
  {
    title: 'Dễ dàng tùy biến',
    items: ['Chọn đường kính & chiều cao tầng bánh phù hợp', 'Phối bảng màu phong phú theo chủ đề tiệc', 'Viết lời chúc ý nghĩa vẽ bằng kem'],
  },
  {
    title: 'Chất lượng thượng hạng',
    items: ['100% kem tươi whipping nhập khẩu từ New Zealand', 'Nhân trái cây tươi tự làm ít đường tự nhiên', 'Nướng cốt bánh tươi xốp mới mỗi sáng'],
  },
  {
    title: 'Đặc quyền dịch vụ',
    items: ['Giao bánh bằng ô tô chuyên dụng đảm bảo tạo hình', 'Tặng kèm bộ nến, đĩa giấy và dao cắt bánh cao cấp', 'Hỗ trợ tư vấn thiết kế tiệc bánh trọn gói'],
  },
]
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
