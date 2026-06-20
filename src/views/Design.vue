<template>
  <div class="space-y-8 max-w-7xl mx-auto px-4 md:px-12 py-8 animate-fade-in blossom-theme">
    <!-- Hero Section cho thiết kế 3D -->
    <section class="rounded-[32px] bg-white p-8 md:p-12 shadow-sm border border-[#FDD8EE]">
      <div class="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div class="space-y-6">
          <span class="inline-flex rounded-xl bg-[#FFF0F7] border border-[#EC4899]/20 px-3.5 py-1.5 text-xs font-black text-[#EC4899] uppercase tracking-wider font-sans">
            Tự thiết kế bánh 3D
          </span>
          <h1 class="text-4xl md:text-5xl font-black text-[#3D1A2C] tracking-tight leading-tight" style="font-family:'Playfair Display',serif;">
            Tạo Chiếc Bánh Riêng Theo Cách Của Bạn
          </h1>
          <p class="text-xs text-[#7C3D5C] font-medium font-sans leading-relaxed">
            Chọn kiểu dáng, phối màu sắc và thêm thắt những chi tiết trang trí ngọt ngào của riêng bạn. Công cụ mô phỏng 3D trực quan giúp bạn xem trước chiếc bánh mơ ước của mình trong nháy mắt.
          </p>
          <div class="flex flex-wrap gap-3 font-sans">
            <button class="rounded-2xl bg-[#EC4899] px-6 py-3.5 text-xs font-bold text-white hover:bg-[#D12E7B] shadow-md shadow-[#EC4899]/15 hover:shadow-[#EC4899]/30 transition-all hover:-translate-y-0.5">
              Bắt đầu thiết kế 3D
            </button>
            <button class="rounded-2xl border border-[#FDD8EE] bg-[#FFF5FA] px-6 py-3.5 text-xs font-bold text-[#7C3D5C] hover:bg-[#FFF0F7] transition-colors">
              Xem bộ sưu tập mẫu
            </button>
          </div>
        </div>

        <!-- Các mẫu gợi ý -->
        <div class="grid gap-4 sm:grid-cols-2 font-sans">
          <div class="rounded-2xl bg-[#FFF0F7] border border-[#FDD8EE] p-5 hover:shadow-md transition-shadow">
            <span class="text-2xl">💍</span>
            <h3 class="text-sm font-bold text-[#3D1A2C] mt-2">Bánh cưới truyền thống</h3>
            <p class="mt-1 text-xs text-[#7C3D5C] font-medium leading-relaxed">Tầng hoa lộng lẫy, phối tone pastel kem sữa nhẹ nhàng và quý phái.</p>
          </div>
          <div class="rounded-2xl bg-[#FFF0F7] border border-[#FDD8EE] p-5 hover:shadow-md transition-shadow">
            <span class="text-2xl">🎈</span>
            <h3 class="text-sm font-bold text-[#3D1A2C] mt-2">Bánh sinh nhật Custom</h3>
            <p class="mt-1 text-xs text-[#7C3D5C] font-medium leading-relaxed">Nhiều tạo hình 3D hoạt hình đáng yêu và ngộ nghĩnh cho bé.</p>
          </div>
          <div class="rounded-2xl bg-[#FFF0F7] border border-[#FDD8EE] p-5 hover:shadow-md transition-shadow">
            <span class="text-2xl">🧁</span>
            <h3 class="text-sm font-bold text-[#3D1A2C] mt-2">Hộp quà Cupcake</h3>
            <p class="mt-1 text-xs text-[#7C3D5C] font-medium leading-relaxed">Trang trí kem hoa tinh tế, mix nhiều vị khác nhau làm quà tặng.</p>
          </div>
          <div class="rounded-2xl bg-[#FFF0F7] border border-[#FDD8EE] p-5 hover:shadow-md transition-shadow">
            <span class="text-2xl">✨</span>
            <h3 class="text-sm font-bold text-[#3D1A2C] mt-2">Macaron tháp thăng hoa</h3>
            <p class="mt-1 text-xs text-[#7C3D5C] font-medium leading-relaxed">Xếp tầng nghệ thuật tinh xảo cho các buổi tiệc trà chiều sang trọng.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Các đặc điểm nổi bật -->
    <section class="grid gap-6 lg:grid-cols-3 font-sans">
      <div class="rounded-[28px] bg-white p-6 shadow-sm border border-[#FDD8EE] space-y-2">
        <h2 class="text-base font-bold text-[#3D1A2C]">Dễ dàng tùy biến</h2>
        <ul class="space-y-2 text-xs text-[#7C3D5C] font-medium leading-relaxed">
          <li>• Chọn đường kính & chiều cao tầng bánh phù hợp</li>
          <li>• Phối bảng màu phong phú theo chủ đề tiệc</li>
          <li>• Viết lời chúc ý nghĩa vẽ bằng kem</li>
        </ul>
      </div>
      <div class="rounded-[28px] bg-white p-6 shadow-sm border border-[#FDD8EE] space-y-2">
        <h2 class="text-base font-bold text-[#3D1A2C]">Chất lượng thượng hạng</h2>
        <ul class="space-y-2 text-xs text-[#7C3D5C] font-medium leading-relaxed">
          <li>• 100% kem tươi whipping nhập khẩu từ New Zealand</li>
          <li>• Nhân trái cây tươi tự làm ít đường tự nhiên</li>
          <li>• Nướng cốt bánh tươi xốp mới mỗi sáng</li>
        </ul>
      </div>
      <div class="rounded-[28px] bg-white p-6 shadow-sm border border-[#FDD8EE] space-y-2">
        <h2 class="text-base font-bold text-[#3D1A2C]">Đặc quyền dịch vụ</h2>
        <ul class="space-y-2 text-xs text-[#7C3D5C] font-medium leading-relaxed">
          <li>• Giao bánh bằng ô tô chuyên dụng đảm bảo tạo hình</li>
          <li>• Tặng kèm bộ nến, đĩa giấy và dao cắt bánh cao cấp</li>
          <li>• Hỗ trợ tư vấn thiết kế tiệc bánh trọn gói</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
// Không cần script logic cho trang giới thiệu thiết kế 3D mock
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
