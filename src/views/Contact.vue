<template>
  <div class="space-y-8">
    <div class="rounded-[32px] bg-white p-10 shadow-sm border border-[var(--color-border)]">
      <div class="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div class="space-y-4">
          <h1 class="text-4xl font-black text-[#1E2A3B]">Liên hệ Polycake</h1>
          <p class="text-gray-600 max-w-2xl">Cần tư vấn bánh cưới, đặt bánh sinh nhật hay thiết kế 3D? Gửi yêu cầu ngay, đội ngũ sẽ phản hồi nhanh chóng.</p>
          <div class="space-y-3 text-sm text-gray-600">
            <p>📍 Địa chỉ: 123 Lê Lợi, Quận 1, TP.HCM</p>
            <p>📞 Hotline: 0901 234 567</p>
            <p>✉️ Email: hello@polycake.vn</p>
          </div>
        </div>
        <div class="rounded-[28px] bg-[#FFF5EE] p-8">
          <h2 class="text-xl font-semibold text-[#1E2A3B]">Giờ mở cửa</h2>
          <div class="mt-4 space-y-3 text-sm text-gray-600">
            <p>Thứ 2 - Thứ 7: 08:00 - 20:00</p>
            <p>Chủ nhật: 09:00 - 18:00</p>
          </div>
          <button class="mt-8 rounded-full bg-[#E8634A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#f3714e] transition">Gửi yêu cầu</button>
        </div>
      </div>
    </div>

    <div class="rounded-[32px] bg-white p-8 shadow-sm border border-[var(--color-border)]">
      <h2 class="text-2xl font-bold text-[#1E2A3B]">Phản hồi nhanh</h2>
      <form class="mt-6 grid gap-4 sm:grid-cols-2">
        <input type="text" placeholder="Họ tên" class="rounded-3xl border border-[var(--color-border)] px-4 py-3 outline-none focus:border-[#E8634A]" />
        <input type="email" placeholder="Email" class="rounded-3xl border border-[var(--color-border)] px-4 py-3 outline-none focus:border-[#E8634A]" />
        <input type="text" placeholder="Số điện thoại" class="rounded-3xl border border-[var(--color-border)] px-4 py-3 outline-none focus:border-[#E8634A]" />
        <select class="rounded-3xl border border-[var(--color-border)] px-4 py-3 outline-none focus:border-[#E8634A]">
          <option>Chọn yêu cầu</option>
          <option>Đặt bánh</option>
          <option>Thiết kế 3D</option>
          <option>Tư vấn sự kiện</option>
        </select>
        <textarea rows="4" placeholder="Nội dung yêu cầu" class="col-span-2 rounded-3xl border border-[var(--color-border)] px-4 py-3 outline-none focus:border-[#E8634A]"></textarea>
        <button type="button" class="col-span-2 rounded-full bg-[#E8634A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#f3714e] transition">Gửi liên hệ</button>
      </form>
    </div>
  </div>
</template>
