<template>
  <div class="space-y-8 max-w-7xl mx-auto px-4 md:px-12 py-8 animate-fade-in blossom-theme">
    <!-- Khối liên hệ chính -->
    <div class="rounded-[32px] bg-white p-8 md:p-12 shadow-sm border border-[#FDD8EE]">
      <div class="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div class="space-y-6">
          <h1 class="text-4xl md:text-5xl font-black text-[#3D1A2C] tracking-tight leading-tight" style="font-family:'Playfair Display',serif;">Liên hệ với chúng tôi</h1>
          <p class="text-xs text-[#7C3D5C] font-medium font-sans leading-relaxed">
            Bạn cần tư vấn chọn mẫu bánh cưới, đặt bánh sinh nhật thiết kế riêng theo yêu cầu hay cần hỗ trợ về đơn hàng? Đừng ngần ngại liên hệ, đội ngũ chăm sóc khách hàng của chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.
          </p>
          <div class="space-y-4 text-xs text-[#7C3D5C] font-sans font-bold">
            <p class="flex items-center gap-3">📍 <span class="text-[#EC4899]">Địa chỉ cửa hàng:</span> 123 Lê Lợi, Quận 1, TP. Hồ Chí Minh</p>
            <p class="flex items-center gap-3">📞 <span class="text-[#EC4899]">Hotline hỗ trợ:</span> 0901 234 567</p>
            <p class="flex items-center gap-3">✉️ <span class="text-[#EC4899]">Email tiếp nhận:</span> hello@polycake.vn</p>
          </div>
        </div>

        <!-- Khối Giờ mở cửa -->
        <div class="rounded-2xl bg-[#FFF0F7] border border-[#FDD8EE] p-8 space-y-5">
          <h2 class="text-lg font-bold text-[#3D1A2C]" style="font-family:'Playfair Display',serif;">Giờ mở cửa</h2>
          <div class="space-y-2 text-xs text-[#7C3D5C] font-medium font-sans">
            <p class="flex justify-between"><span>Thứ 2 - Thứ 7:</span> <span class="font-bold text-[#3D1A2C]">08:00 - 20:00</span></p>
            <p class="flex justify-between"><span>Chủ nhật:</span> <span class="font-bold text-[#3D1A2C]">09:00 - 18:00</span></p>
          </div>
          <button class="mt-4 w-full rounded-2xl bg-[#EC4899] px-5 py-3.5 text-xs font-bold text-white hover:bg-[#D12E7B] shadow-md shadow-[#EC4899]/10 hover:shadow-[#EC4899]/20 transition-all font-sans">
            Gọi Hotline tư vấn
          </button>
        </div>
      </div>
    </div>

    <!-- Khối Phản hồi nhanh -->
    <div class="rounded-[32px] bg-white p-8 md:p-12 shadow-sm border border-[#FDD8EE]">
      <h2 class="text-2xl font-bold text-[#3D1A2C] tracking-tight" style="font-family:'Playfair Display',serif;">Gửi yêu cầu phản hồi nhanh</h2>
      <form class="mt-6 grid gap-5 sm:grid-cols-2 font-sans">
        <input type="text" placeholder="Họ và tên của bạn" class="rounded-2xl border border-[#FDD8EE] bg-[#FFF0F7] px-4 py-3.5 text-xs text-[#3D1A2C] outline-none focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/10 transition-all placeholder:text-[#B07090]" />
        <input type="email" placeholder="Địa chỉ email nhận phản hồi" class="rounded-2xl border border-[#FDD8EE] bg-[#FFF0F7] px-4 py-3.5 text-xs text-[#3D1A2C] outline-none focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/10 transition-all placeholder:text-[#B07090]" />
        <input type="text" placeholder="Số điện thoại liên hệ" class="rounded-2xl border border-[#FDD8EE] bg-[#FFF0F7] px-4 py-3.5 text-xs text-[#3D1A2C] outline-none focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/10 transition-all placeholder:text-[#B07090]" />
        <select class="rounded-2xl border border-[#FDD8EE] bg-[#FFF0F7] px-4 py-3.5 text-xs text-[#3D1A2C] outline-none focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/10 transition-all">
          <option>Chọn loại yêu cầu hỗ trợ</option>
          <option>Tư vấn đặt bánh Custom</option>
          <option>Hỗ trợ chỉnh sửa đơn hàng</option>
          <option>Hợp tác sự kiện & tiệc trà</option>
          <option>Đóng góp ý kiến dịch vụ</option>
        </select>
        <textarea rows="4" placeholder="Nội dung chi tiết yêu cầu của bạn..." class="col-span-2 rounded-2xl border border-[#FDD8EE] bg-[#FFF0F7] px-4 py-3.5 text-xs text-[#3D1A2C] outline-none focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/10 transition-all placeholder:text-[#B07090]"></textarea>
        <button type="button" class="col-span-2 rounded-2xl bg-[#EC4899] px-6 py-4 text-xs font-bold text-white hover:bg-[#D12E7B] shadow-md shadow-[#EC4899]/15 hover:shadow-[#EC4899]/35 transition-all hover:-translate-y-0.5">
          Gửi thông tin liên hệ
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
// Không cần script logic cho biểu mẫu liên hệ mock
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
