<template>
  <div class="chocopine-page animate-fade-in">
    <div class="chocopine-inner space-y-8">
      <div class="chocopine-card p-8 md:p-12">
        <div class="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div class="space-y-6">
            <span class="chocopine-eyebrow">Liên hệ Chocopine</span>
            <h1 class="chocopine-title chocopine-title--lg">Liên hệ với chúng tôi</h1>
            <p class="chocopine-desc" style="text-align: left; margin-top: 0;">
              Bạn cần tư vấn chọn mẫu bánh cưới, đặt bánh sinh nhật thiết kế riêng theo yêu cầu hay cần hỗ trợ về đơn hàng? Đừng ngần ngại liên hệ, đội ngũ chăm sóc khách hàng của chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.
            </p>
            <div class="space-y-4 text-xs font-bold chocopine-text-mid">
              <p class="flex items-center gap-3"><iconify-icon icon="ph:map-pin-duotone" class="text-lg chocopine-accent shrink-0"></iconify-icon><span><span class="chocopine-accent">Địa chỉ cửa hàng:</span> 123 Lê Lợi, Quận 1, TP. Hồ Chí Minh</span></p>
              <p class="flex items-center gap-3"><iconify-icon icon="ph:phone-duotone" class="text-lg chocopine-accent shrink-0"></iconify-icon><span><span class="chocopine-accent">Hotline hỗ trợ:</span> 0901 234 567</span></p>
              <p class="flex items-center gap-3"><iconify-icon icon="ph:envelope-duotone" class="text-lg chocopine-accent shrink-0"></iconify-icon><span><span class="chocopine-accent">Email tiếp nhận:</span> hello@chocopine.vn</span></p>
            </div>
          </div>

          <div class="chocopine-card chocopine-card--soft p-8 space-y-5">
            <h2 class="chocopine-title" style="font-size: 1.75rem; text-align: left;">Giờ mở cửa</h2>
            <div class="space-y-2 text-xs font-medium chocopine-text-mid">
              <p class="flex justify-between"><span>Thứ 2 - Thứ 7:</span> <span class="font-extrabold" style="color: var(--wheat-brown-dark)">08:00 - 20:00</span></p>
              <p class="flex justify-between"><span>Chủ nhật:</span> <span class="font-extrabold" style="color: var(--wheat-brown-dark)">09:00 - 18:00</span></p>
            </div>
            <button class="chocopine-btn-primary mt-4 w-full px-5 py-3.5">Gọi Hotline tư vấn</button>
          </div>
        </div>
      </div>

      <div class="chocopine-card p-8 md:p-12">
        <h2 class="chocopine-title" style="font-size: 2rem; text-align: left;">Gửi yêu cầu phản hồi nhanh</h2>
        <form class="mt-6 grid gap-5 sm:grid-cols-2">
          <input type="text" placeholder="Họ và tên của bạn" class="chocopine-field" />
          <input type="email" placeholder="Địa chỉ email nhận phản hồi" class="chocopine-field" />
          <input type="text" placeholder="Số điện thoại liên hệ" class="chocopine-field" />
          <select class="chocopine-field">
            <option>Chọn loại yêu cầu hỗ trợ</option>
            <option>Tư vấn đặt bánh Custom</option>
            <option>Hỗ trợ chỉnh sửa đơn hàng</option>
            <option>Hợp tác sự kiện & tiệc trà</option>
            <option>Đóng góp ý kiến dịch vụ</option>
          </select>
          <textarea rows="4" placeholder="Nội dung chi tiết yêu cầu của bạn..." class="chocopine-field col-span-2"></textarea>
          <button type="button" class="chocopine-btn-primary col-span-2 px-6 py-4">Gửi thông tin liên hệ</button>
        </form>
      </div>
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
