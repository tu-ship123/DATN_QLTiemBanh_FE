<template>
  <div class="space-y-8 max-w-7xl mx-auto px-4 md:px-12 py-10 animate-fade-in chocopine-page">

    <div class="p-6" style="border-radius:24px;background:#FFFFFF;border:1px solid #EDE0CC;">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center" style="background:linear-gradient(135deg,#7A5C3A,#9A7650);box-shadow:0 4px 16px rgba(122,92,58,0.2);">
            <iconify-icon icon="ph:package-duotone" class="text-2xl" style="color:#FFFFFF;"></iconify-icon>
          </div>
          <div>
            <h1 class="chocopine-title" style="font-size:26px;text-align:left;margin:0;">Theo dõi đơn hàng</h1>
            <p class="chocopine-desc" style="text-align:left;margin:4px 0 0;font-size:13px;">Theo dõi chi tiết tiến độ chuẩn bị và giao bánh thời gian thực.</p>
          </div>
        </div>

        <div class="relative font-sans">
          <button
            @click="toggleNotifications"
            class="relative w-11 h-11 rounded-2xl border border-[#EDE0CC] bg-white hover:bg-[#FDF6EC] hover:border-[#7A5C3A] transition-all flex items-center justify-center shadow-sm"
          >
            <iconify-icon icon="ph:bell-duotone" class="text-xl text-[#5C4428]"></iconify-icon>
            <span v-if="unreadCount > 0" class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#7A5C3A] text-white text-[10px] font-black flex items-center justify-center shadow">
              {{ unreadCount }}
            </span>
          </button>

          <Transition name="dropdown">
            <div v-if="showNotif" class="absolute right-0 top-14 w-80 rounded-[20px] bg-white border border-[#EDE0CC] shadow-2xl z-50 overflow-hidden">
              <div class="flex items-center justify-between px-5 py-4 border-b border-[#FDF6EC]">
                <span class="font-bold text-[#5C4428] text-sm">Thông báo mới</span>
                <button @click="markAllRead" class="text-xs font-semibold text-[#7A5C3A] hover:underline">Đã đọc tất cả</button>
              </div>
              <div class="max-h-80 overflow-y-auto divide-y divide-[#FDF6EC]">
                <div
                  v-for="notif in notifications"
                  :key="notif.id"
                  @click="readNotif(notif)"
                  class="flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-[#FDF6EC]"
                  :class="notif.read ? 'opacity-60' : ''"
                >
                  <div class="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center" :class="notifIconBg(notif.type)">
                    <iconify-icon :icon="notifIcon(notif.type)" class="text-lg" :class="notifIconColor(notif.type)"></iconify-icon>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-[#5C4428] leading-snug">{{ notif.title }}</p>
                    <p class="text-[11px] text-[#9A7650] mt-0.5 line-clamp-2 leading-relaxed">{{ notif.body }}</p>
                    <p class="text-[10px] text-[#A68B5C] mt-1 font-medium">{{ notif.time }}</p>
                  </div>
                  <span v-if="!notif.read" class="w-2 h-2 rounded-full bg-[#7A5C3A] mt-1.5 flex-shrink-0"></span>
                </div>
              </div>
              <div class="px-5 py-3 bg-[#FDF8F2] border-t border-[#EDE0CC]">
                <button class="w-full text-xs text-center font-bold text-[#7A5C3A] hover:underline">Xem tất cả thông báo</button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin w-8 h-8 border-4 border-[#7A5C3A] border-t-transparent rounded-full mb-3"></div>
      <p class="text-sm font-semibold text-[#A68B5C]">Đang tải dữ liệu đơn hàng...</p>
    </div>

    <div v-else-if="orders.length === 0" class="rounded-[32px] bg-white p-12 text-center shadow-sm border border-[#EDE0CC]">
      <div class="w-20 h-20 rounded-2xl bg-[#FDF6EC] flex items-center justify-center mx-auto mb-6">
        <iconify-icon icon="ph:shopping-cart-duotone" class="text-5xl text-[#7A5C3A]"></iconify-icon>
      </div>
      <h3 class="chocopine-title" style="font-size:1.5rem;">Bạn chưa có đơn hàng nào</h3>
      <p class="text-sm text-[#9A7650] mt-2 mb-8">Hãy dạo quanh cửa hàng và chọn cho mình chiếc bánh yêu thích nhé!</p>
      <button @click="$router.push('/shop/products')" class="chocopine-btn-primary mt-6 px-8 py-3.5">
        Mua sắm ngay
      </button>
    </div>

    <template v-else>
      <div class="rounded-[24px] bg-white border border-[#EDE0CC] shadow-sm p-6 font-sans">
        <h2 class="text-base font-bold text-[#5C4428] mb-4 flex items-center gap-2">
          <iconify-icon icon="ph:magnifying-glass-duotone" class="text-[#7A5C3A] text-lg"></iconify-icon>
          Tra cứu mã đơn hàng
        </h2>
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1 relative">
            <iconify-icon icon="ph:hash" class="absolute left-4 top-1/2 -translate-y-1/2 text-[#A68B5C]"></iconify-icon>
            <input
              v-model="searchCode"
              type="text"
              placeholder="Nhập ID đơn hàng (Ví dụ: 15)"
              @keyup.enter="searchOrder"
              class="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#EDE0CC] bg-[#FDF6EC] text-sm text-[#5C4428] outline-none focus:border-[#7A5C3A] focus:ring-2 focus:ring-[#7A5C3A]/10 transition-all placeholder:text-[#A68B5C]"
            />
          </div>
          <button
            @click="searchOrder"
            class="rounded-2xl bg-[#7A5C3A] px-6 py-3 text-xs font-bold text-white hover:bg-[#6B4E2E] transition-colors shadow-sm shadow-[#7A5C3A]/15 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <iconify-icon icon="ph:magnifying-glass" class="text-base"></iconify-icon>
            Tra cứu đơn
          </button>
        </div>
      </div>

      <div v-if="activeOrder" class="grid gap-6 xl:grid-cols-[1fr_360px]">

        <div class="space-y-5">

          <div class="rounded-[24px] bg-white border border-[#EDE0CC] shadow-sm p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <div class="flex items-center gap-2.5 flex-wrap">
                  <span class="text-2xl font-black text-[#5C4428]">#{{ activeOrder.id }}</span>
                  <span class="rounded-xl px-3 py-1 text-[11px] font-bold" :class="orderStatusClass(activeOrder.trangThai)">
                    {{ translateStatus(activeOrder.trangThai) }}
                  </span>
                </div>
                <p class="text-xs text-[#A68B5C] font-medium font-sans mt-1">Đặt lúc {{ formatDate(activeOrder.ngayTao) }}</p>
              </div>
              <div class="text-left sm:text-right">
                <p class="text-2xl font-black text-[#7A5C3A]">{{ formatCurrency(activeOrder.tongTien) }}</p>
                <p class="text-[10px] text-[#A68B5C] font-bold uppercase tracking-wider font-sans">Tổng thanh toán</p>
              </div>
            </div>

            <div class="grid sm:grid-cols-2 gap-4 bg-[#FDF6EC] border border-[#EDE0CC] rounded-2xl p-4 text-xs font-sans">
              <div>
                <p class="text-[10px] text-[#A68B5C] font-bold uppercase tracking-wide mb-1">Người nhận bánh</p>
                <p class="font-bold text-[#5C4428] truncate">{{ activeOrder.emailNguoiDung || 'Khách hàng' }}</p>
                <p class="text-[#9A7650]">{{ activeOrder.soDienThoai }}</p>
              </div>
              <div>
                <p class="text-[10px] text-[#A68B5C] font-bold uppercase tracking-wide mb-1">Địa chỉ giao bánh</p>
                <p class="font-semibold text-[#5C4428] leading-relaxed">{{ activeOrder.diaChiGiaoHang }}</p>
              </div>
              <div>
                <p class="text-[10px] text-[#A68B5C] font-bold uppercase tracking-wide mb-1">Ngày giao dự kiến</p>
                <p class="font-bold text-[#7A5C3A]">{{ formatDate(activeOrder.ngayGiaoHang, false) }}</p>
              </div>
              <div>
                <p class="text-[10px] text-[#A68B5C] font-bold uppercase tracking-wide mb-1">Ghi chú đơn hàng</p>
                <p class="font-semibold text-[#5C4428] truncate" :title="activeOrder.ghiChu">{{ activeOrder.ghiChu || 'Không có ghi chú' }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-[24px] bg-white border border-[#EDE0CC] shadow-sm p-6">
            <h3 class="text-base font-bold text-[#5C4428] mb-6 flex items-center gap-2">
              <iconify-icon icon="ph:clock-countdown-duotone" class="text-[#7A5C3A] text-lg"></iconify-icon>
              Tiến trình đơn hàng
            </h3>
            <div class="space-y-0 font-sans">
              <div
                v-for="(step, idx) in generateTimeline(activeOrder)"
                :key="idx"
                class="flex gap-4 relative"
              >
                <div class="flex flex-col items-center">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all"
                    :class="step.done
                      ? 'bg-gradient-to-br from-[#7A5C3A] to-[#9A7650] shadow-md shadow-[#7A5C3A]/15'
                      : step.active
                      ? 'bg-white border-2 border-[#7A5C3A] shadow-md shadow-[#7A5C3A]/10'
                      : 'bg-[#FDF8F2] border-2 border-[#EDE0CC]'"
                  >
                    <iconify-icon
                      :icon="step.icon"
                      class="text-lg"
                      :class="step.done ? 'text-white' : step.active ? 'text-[#7A5C3A]' : 'text-[#A68B5C]'"
                    ></iconify-icon>
                  </div>
                  <div v-if="idx < generateTimeline(activeOrder).length - 1" class="w-0.5 h-12 mt-1" :class="step.done ? 'bg-[#7A5C3A]/30' : 'bg-[#EDE0CC]'"></div>
                </div>

                <div class="flex-1 pb-12" :class="idx === generateTimeline(activeOrder).length - 1 ? 'pb-0' : ''">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <p class="font-bold text-sm" :class="step.done || step.active ? 'text-[#5C4428]' : 'text-[#A68B5C]'">{{ step.label }}</p>
                      <p class="text-xs text-[#9A7650] mt-1 font-medium leading-relaxed">{{ step.desc }}</p>
                    </div>
                    <span v-if="step.time" class="text-xs text-[#A68B5C] font-bold whitespace-nowrap flex-shrink-0 mt-0.5">{{ step.time }}</span>
                  </div>
                  <div v-if="step.active" class="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-[#FDF6EC] border border-[#7A5C3A]/20 px-3 py-1 text-[10px] font-black text-[#7A5C3A] uppercase tracking-wider">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#7A5C3A] animate-pulse"></span>
                    Đang tiến hành
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-[24px] bg-white border border-[#EDE0CC] shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-bold text-[#5C4428] flex items-center gap-2">
                <iconify-icon icon="ph:shopping-bag-duotone" class="text-[#7A5C3A] text-lg"></iconify-icon>
                Bánh ngọt trong đơn
              </h3>
              <button
                @click="openDesignViewer(activeOrder)"
                :disabled="designLoading"
                class="flex items-center gap-1.5 rounded-xl border border-[#EDE0CC] bg-[#FDF6EC] px-3 py-2 text-[11px] font-bold text-[#7A5C3A] hover:bg-[#F5E9D6] transition-colors disabled:opacity-60"
              >
                <iconify-icon v-if="designLoading" icon="ph:circle-notch" class="animate-spin"></iconify-icon>
                <iconify-icon v-else icon="ph:cube-duotone"></iconify-icon>
                Xem thiết kế 3D
              </button>
            </div>
            <div class="space-y-3 font-sans">
              <div v-for="item in activeOrder.items" :key="item.sanPhamId" class="flex items-center gap-4 p-3 rounded-2xl bg-[#FFFFFF] border border-[#EDE0CC] hover:bg-[#FDF6EC] transition-colors">
                <img src="https://images.unsplash.com/photo-1542821298-0bb848916421?auto=format&fit=crop&w=400&q=80" alt="Bánh" class="w-16 h-16 rounded-xl object-cover shadow-sm flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-sm text-[#5C4428] truncate">{{ item.tenSanPham }}</p>
                  <p class="text-xs text-[#A68B5C] font-medium">SL: x{{ item.soLuong }}</p>
                </div>
                <p class="font-black text-sm text-[#7A5C3A] whitespace-nowrap">{{ formatCurrency(item.giaBan * item.soLuong) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-5 font-sans">

          <div class="rounded-[24px] bg-white border border-[#EDE0CC] shadow-sm p-6 sticky top-6">
            <h3 class="text-base font-bold text-[#5C4428] mb-4 flex items-center gap-2 border-b border-[#EDE0CC] pb-3">
              <iconify-icon icon="ph:receipt-duotone" class="text-[#7A5C3A] text-lg"></iconify-icon>
              Chi tiết hóa đơn
            </h3>
            <div class="space-y-3.5 text-xs font-medium text-[#9A7650]">
              <div class="flex justify-between">
                <span>Giá sản phẩm ({{ activeOrder.items?.length }} món)</span>
                <span class="font-bold text-[#5C4428]">{{ formatCurrency(tongTienHangCuaDon(activeOrder)) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Phí giao hàng</span>
                <span class="font-bold text-[#5C4428]">{{ formatCurrency(activeOrder.phiShip) }}</span>
              </div>
              <!-- Dòng giảm giá — mã giảm giá HOẶC voucher cá nhân đã dùng cho đơn này -->
              <div v-if="activeOrder.soTienGiam > 0" class="flex justify-between text-green-700">
                <span class="flex items-center gap-1">
                  <iconify-icon icon="ph:tag-duotone" class="text-sm"></iconify-icon>
                  {{ activeOrder.maGiamGiaCode ? `Mã ${activeOrder.maGiamGiaCode}` : activeOrder.tenVoucherKhachHang || 'Giảm giá' }}
                </span>
                <span class="font-black">-{{ formatCurrency(activeOrder.soTienGiam) }}</span>
              </div>

              <div class="h-px bg-[#FDF6EC] my-3"></div>
              <div class="flex justify-between items-center">
                <span class="text-sm font-bold text-[#5C4428]">Thành tiền</span>
                <span class="text-lg font-black text-[#7A5C3A]">{{ formatCurrency(activeOrder.tongTien) }}</span>
              </div>
            </div>

            <div class="mt-6 space-y-3">

              <!-- NÚT XÁC NHẬN ĐÃ NHẬN HÀNG (chỉ hiện khi DANG_GIAO) -->
              <button
                v-if="activeOrder.trangThai === 'DANG_GIAO'"
                @click="xacNhanNhanHang"
                :disabled="xacNhanLoading"
                class="w-full rounded-2xl px-4 py-3 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                style="background:linear-gradient(135deg,#16a34a,#22c55e);box-shadow:0 4px 12px rgba(22,163,74,0.25);"
              >
                <iconify-icon v-if="xacNhanLoading" icon="ph:circle-notch" class="text-base animate-spin"></iconify-icon>
                <iconify-icon v-else icon="ph:check-circle-duotone" class="text-base"></iconify-icon>
                {{ xacNhanLoading ? 'Đang xử lý...' : 'Tôi đã nhận được hàng (+điểm)' }}
              </button>

              <!-- NÚT ĐÁNH GIÁ (chỉ hiện khi HOAN_THANH và chưa đánh giá) -->
              <button
                v-if="activeOrder.trangThai === 'HOAN_THANH' && !daDanhGia"
                @click="moFormDanhGia = !moFormDanhGia"
                class="w-full rounded-2xl border-2 border-[#7A5C3A]/30 bg-[#FDF8F2] px-4 py-3 text-xs font-bold text-[#7A5C3A] hover:bg-[#FDF6EC] transition-colors flex items-center justify-center gap-2"
              >
                <iconify-icon icon="ph:star-duotone" class="text-base"></iconify-icon>
                Đánh giá sản phẩm & Nhận +5 điểm
              </button>

              <!-- FORM ĐÁNH GIÁ INLINE -->
              <Transition name="slide-down">
                <div v-if="moFormDanhGia && activeOrder.trangThai === 'HOAN_THANH'"
                  class="rounded-2xl border border-[#EDE0CC] bg-[#FDF8F2] p-5 space-y-4">
                  <h4 class="text-sm font-bold text-[#5C4428] flex items-center gap-2">
                    <iconify-icon icon="ph:star-duotone" class="text-[#7A5C3A]"></iconify-icon>
                    Đánh giá đơn hàng #{{ activeOrder.id }}
                  </h4>

                  <!-- Chọn sản phẩm cần đánh giá (chỉ hiện những sản phẩm CHƯA đánh giá) -->
                  <div v-if="sanPhamChuaDanhGia.length > 1">
                    <label class="text-xs font-semibold text-[#9A7650] mb-1 block">Sản phẩm đánh giá</label>
                    <select v-model="danhGia.sanPhamId"
                      class="w-full px-3 py-2.5 rounded-xl border border-[#EDE0CC] bg-white text-sm text-[#5C4428] outline-none focus:border-[#7A5C3A]">
                      <option v-for="item in sanPhamChuaDanhGia" :key="item.sanPhamId" :value="item.sanPhamId">
                        {{ item.tenSanPham }}
                      </option>
                    </select>
                  </div>

                  <!-- Số sao -->
                  <div>
                    <label class="text-xs font-semibold text-[#9A7650] mb-2 block">Xếp hạng</label>
                    <div class="flex gap-1">
                      <button v-for="s in 5" :key="s" @click="danhGia.soSao = s"
                        class="text-2xl transition-transform hover:scale-110"
                        :class="s <= danhGia.soSao ? 'text-yellow-400' : 'text-gray-300'">
                        ★
                      </button>
                    </div>
                  </div>

                  <!-- Nội dung -->
                  <div>
                    <label class="text-xs font-semibold text-[#9A7650] mb-1 block">Nhận xét của bạn</label>
                    <textarea v-model="danhGia.noiDung" rows="3"
                      placeholder="Bánh có ngon không? Giao hàng nhanh không?..."
                      class="w-full px-3 py-2.5 rounded-xl border border-[#EDE0CC] bg-white text-sm text-[#5C4428] outline-none focus:border-[#7A5C3A] resize-none"></textarea>
                  </div>

                  <!-- Ảnh đính kèm -->
                  <div>
                    <label class="text-xs font-semibold text-[#9A7650] mb-2 block">Ảnh thực tế (không bắt buộc)</label>
                    <div class="flex items-center gap-3">
                      <div v-if="danhGia.hinhAnh"
                        class="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-[#EDE0CC] shrink-0">
                        <img :src="danhGia.hinhAnh" class="w-full h-full object-cover" alt="Ảnh đánh giá" />
                        <button @click="danhGia.hinhAnh = null"
                          class="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center">
                          ✕
                        </button>
                      </div>
                      <label
                        class="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-[#7A5C3A] border border-dashed border-[#C4A882] rounded-xl px-3 py-2 hover:bg-[#FDF6EC] transition-colors">
                        <iconify-icon icon="ph:camera-plus-duotone" class="text-base"></iconify-icon>
                        {{ danhGia.hinhAnh ? 'Đổi ảnh' : 'Thêm ảnh' }}
                        <input type="file" accept="image/*" class="hidden" @change="handleReviewImageChange" />
                      </label>
                    </div>
                    <p class="text-[10px] text-[#A68B5C] mt-1">PNG, JPG tối đa 5MB</p>
                  </div>

                  <button @click="guiDanhGia" :disabled="danhGiaLoading || !danhGia.soSao"
                    class="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-colors disabled:opacity-60"
                    style="background:#7A5C3A;">
                    <iconify-icon v-if="danhGiaLoading" icon="ph:circle-notch" class="animate-spin mr-1"></iconify-icon>
                    {{ danhGiaLoading ? 'Đang gửi...' : '✅ Gửi đánh giá & Nhận +5 điểm' }}
                  </button>
                </div>
              </Transition>

              <!-- HỦY ĐƠN -->
              <button
                v-if="['CHO_XU_LY', 'CHO_XAC_NHAN', 'PAID'].includes(activeOrder.trangThai)"
                @click="openCancelModal(activeOrder)"
                class="w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <iconify-icon icon="ph:x-circle-bold" class="text-sm"></iconify-icon>
                Hủy đơn hàng này
              </button>

              <RouterLink
                to="/shop/products"
                class="w-full rounded-2xl border border-[#EDE0CC] bg-[#FDF8F2] px-4 py-3 text-xs font-bold text-[#9A7650] hover:bg-[#FDF6EC] hover:text-[#7A5C3A] hover:border-[#7A5C3A]/20 transition-colors flex items-center justify-center gap-2"
              >
                <iconify-icon icon="ph:storefront-duotone" class="text-base text-[#A68B5C]"></iconify-icon>
                Mua thêm sản phẩm khác
              </RouterLink>
            </div>
          </div>

          <div class="rounded-[24px] bg-white border border-[#EDE0CC] shadow-sm p-6">
            <h3 class="text-base font-bold text-[#5C4428] mb-4 flex items-center gap-2 border-b border-[#EDE0CC] pb-3">
              <iconify-icon icon="ph:list-bullets-duotone" class="text-[#7A5C3A] text-lg"></iconify-icon>
              Lịch sử mua bánh
            </h3>
            <div class="space-y-2.5 max-h-96 overflow-y-auto pr-2">
              <button
                v-for="order in orders"
                :key="order.id"
                @click="activeOrder = order"
                class="w-full flex items-center justify-between px-4 py-3 rounded-2xl border transition-all text-left duration-200"
                :class="activeOrder.id === order.id
                  ? 'border-[#7A5C3A] bg-[#FDF6EC] shadow-sm'
                  : 'border-[#EDE0CC] bg-[#FFFFFF] hover:bg-[#FDF6EC]'"
              >
                <div>
                  <p class="text-sm font-bold text-[#5C4428]">#{{ order.id }}</p>
                  <p class="text-[10px] text-[#A68B5C] font-semibold mt-0.5">{{ formatDate(order.ngayTao) }}</p>
                </div>
                <span class="rounded-lg px-2.5 py-1 text-[10px] font-bold" :class="orderStatusClass(order.trangThai)">
                  {{ translateStatus(order.trangThai) }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-if="searched && !activeOrder && orders.length > 0" class="rounded-[24px] border border-dashed border-[#EDE0CC] bg-white p-16 text-center font-sans">
      <div class="w-16 h-16 rounded-2xl bg-[#FDF6EC] flex items-center justify-center mx-auto mb-4">
        <iconify-icon icon="ph:package-duotone" class="text-3xl text-[#7A5C3A]"></iconify-icon>
      </div>
      <h3 class="text-lg font-bold text-[#5C4428] mb-1">Không tìm thấy đơn hàng</h3>
      <p class="text-xs text-[#9A7650]">Mã đơn hàng <strong>{{ searchCode }}</strong> không thuộc về bạn hoặc không tồn tại.</p>
    </div>

    <!-- ── MODAL XEM THIẾT KẾ 3D (chỉ xem) ─────────────────────────────── -->
    <div v-if="showDesignModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
      @click.self="showDesignModal = false">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div class="px-6 py-5 flex justify-between items-center" style="background:linear-gradient(135deg,#7A5C3A,#9A7650);">
          <div>
            <h2 class="text-lg font-black text-white">Thiết kế bánh 3D · #{{ designOrderId }}</h2>
            <p class="text-white/80 text-xs mt-0.5">Xem lại mẫu bánh bạn đã tự thiết kế cho đơn này</p>
          </div>
          <button @click="showDesignModal = false" class="text-white/80 hover:text-white text-2xl font-light leading-none">✕</button>
        </div>
        <div class="p-5 max-h-[75vh] overflow-y-auto">
          <CakeDesignViewer3D :design="designData" />
        </div>
      </div>
    </div>

    <!-- ── MODAL NHẬP LÝ DO HỦY ĐƠN ─────────────────────────────────────── -->
    <div v-if="showCancelModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
      @click.self="showCancelModal = false">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 font-sans">
        <h3 class="text-lg font-black text-[#5C4428] mb-1">Hủy đơn #{{ cancelTarget?.id }}</h3>
        <p class="text-sm text-[#9A7650] mb-4">Vui lòng cho biết lý do bạn muốn hủy đơn. Thao tác này không thể hoàn tác.</p>
        <textarea
          v-model="cancelReason"
          rows="3"
          placeholder="VD: Đặt nhầm, muốn đổi mẫu bánh, tìm được chỗ khác rẻ hơn..."
          class="w-full rounded-xl border border-[#EDE0CC] p-3 text-sm outline-none focus:border-[#7A5C3A] resize-none mb-4"
        ></textarea>
        <div class="flex gap-3">
          <button
            @click="showCancelModal = false"
            class="flex-1 py-2.5 rounded-xl text-sm font-bold border border-[#EDE0CC] text-[#9A7650] hover:bg-[#FDF6EC]"
          >
            Đóng
          </button>
          <button
            @click="confirmCancelOrder"
            :disabled="!cancelReason.trim() || cancelLoading"
            class="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <iconify-icon v-if="cancelLoading" icon="ph:circle-notch" class="animate-spin"></iconify-icon>
            {{ cancelLoading ? 'Đang hủy...' : 'Xác nhận hủy đơn' }}
          </button>
        </div>
      </div>
    </div>

    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl text-white text-xs font-bold font-sans"
        :class="toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-500' : 'bg-[#5C4428]'"
      >
        <iconify-icon :icon="toast.type === 'success' ? 'ph:check-circle-fill' : 'ph:info-fill'" class="text-lg"></iconify-icon>
        {{ toast.msg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { orderService } from '@/services/orderService' 
import apiClient from '@/services/apiService' // Để gọi thêm hàm cancel
import { realtimeService } from '@/services/realtimeService'
import CakeDesignViewer3D from '@/components/cake3d/CakeDesignViewer3D.vue'

const router = useRouter()
const orders = ref([])
const loading = ref(true)

// STATE UI GIAO DIỆN
const searchCode = ref('')
const searched = ref(false)
const activeOrder = ref(null)
const showNotif = ref(false)

// ===== LOGIC LẤY ĐƠN HÀNG TỪ BACKEND =====
// silent = true: dùng khi realtime tự làm mới dữ liệu ngầm — KHÔNG hiện spinner
// loading toàn trang, tránh cảm giác "giật" khi có thông báo đến.
const fetchMyOrders = async ({ silent = false } = {}) => {
  try {
    if (!silent) loading.value = true
    const response = await orderService.getMyOrders()
    const danhSachMoi = response.data.reverse()
    orders.value = danhSachMoi

    // Giữ nguyên đơn đang xem (nếu vẫn còn) để không bị nhảy về đơn đầu tiên
    // mỗi lần realtime cập nhật — chỉ thay bằng bản dữ liệu mới nhất của đơn đó.
    if (activeOrder.value) {
      const donDangXemMoi = danhSachMoi.find(o => o.id === activeOrder.value.id)
      activeOrder.value = donDangXemMoi || danhSachMoi[0] || null
    } else if (danhSachMoi.length > 0) {
      activeOrder.value = danhSachMoi[0]
    }
  } catch (error) {
    console.error('Lỗi lấy đơn hàng:', error)
    if (!silent) showToast('Không thể tải lịch sử đơn hàng lúc này.', 'error')
  } finally {
    if (!silent) loading.value = false
  }
}

// ===== LOGIC TÌM ĐƠN =====
const searchOrder = () => {
  searched.value = true
  const found = orders.value.find(o => String(o.id) === searchCode.value.trim() || o.maDonHang === searchCode.value.trim())
  activeOrder.value = found || null
  if (!found) showToast('Không tìm thấy mã đơn hàng này', 'error')
}

// ===== LOGIC HUỶ ĐƠN (Popup nhập lý do + xác nhận) =====
const showCancelModal = ref(false)
const cancelTarget = ref(null)
const cancelReason = ref('')
const cancelLoading = ref(false)

// Mở popup nhập lý do hủy, thay cho window.confirm() cũ
const openCancelModal = (order) => {
  cancelTarget.value = order
  cancelReason.value = ''
  showCancelModal.value = true
}

// Xác nhận trong popup -> gọi API hủy kèm lý do
const confirmCancelOrder = async () => {
  if (!cancelTarget.value || !cancelReason.value.trim()) return
  cancelLoading.value = true
  try {
    // Gọi API Hủy theo phương thức PUT đã định nghĩa trong OrderController, kèm lý do hủy
    await orderService.cancelMyOrder(cancelTarget.value.id, cancelReason.value.trim())

    showToast('Đã huỷ đơn hàng thành công', 'success')
    cancelTarget.value.trangThai = 'DA_HUY'
    cancelTarget.value.lyDoHuy = cancelReason.value.trim()
    if (activeOrder.value?.id === cancelTarget.value.id) {
      activeOrder.value.trangThai = 'DA_HUY'
      activeOrder.value.lyDoHuy = cancelReason.value.trim()
    }
    showCancelModal.value = false
  } catch (error) {
    console.error(error)
    showToast(error.response?.data || 'Có lỗi xảy ra khi hủy đơn', 'error')
  } finally {
    cancelLoading.value = false
  }
}

// ===== LOGIC XEM THIẾT KẾ 3D CỦA ĐƠN (chỉ xem) =====
const showDesignModal = ref(false)
const designData = ref(null)
const designOrderId = ref(null)
const designLoading = ref(false)

const openDesignViewer = async (order) => {
  if (!order) return
  designLoading.value = true
  try {
    const res = await orderService.getOrder3DDesign(order.id)
    designData.value = res.data
    designOrderId.value = order.id
    showDesignModal.value = true
  } catch (error) {
    console.error(error)
    showToast(error.response?.data || 'Không tải được dữ liệu thiết kế 3D của đơn này', 'error')
  } finally {
    designLoading.value = false
  }
}

// ─── XÁC NHẬN NHẬN HÀNG ─────────────────────────────────────────────────────
const xacNhanLoading = ref(false)
const xacNhanNhanHang = async () => {
  if (!confirm('Xác nhận bạn đã nhận được đơn hàng? Thao tác này không thể hoàn tác.')) return
  xacNhanLoading.value = true
  try {
    await apiClient.put(`/api/v1/loyalty/xac-nhan-nhan-hang/${activeOrder.value.id}`)
    activeOrder.value.trangThai = 'HOAN_THANH'
    showToast('✅ Xác nhận thành công! Điểm thưởng đã được cộng vào tài khoản.', 'success')
  } catch (e) {
    showToast(e.response?.data || 'Lỗi xác nhận nhận hàng!', 'error')
  } finally {
    xacNhanLoading.value = false
  }
}

// ─── ĐÁNH GIÁ SẢN PHẨM ──────────────────────────────────────────────────────
const moFormDanhGia = ref(false)
const daDanhGia = ref(false) // true = đã đánh giá HẾT tất cả sản phẩm trong đơn
const sanPhamIdDaDanhGia = ref([]) // danh sách id sản phẩm ĐÃ được đánh giá trong đơn hiện tại
const danhGiaLoading = ref(false)
const danhGia = ref({ sanPhamId: null, soSao: 0, noiDung: '', hinhAnh: null })

// Sản phẩm trong đơn hiện tại mà khách CHƯA đánh giá — dùng cho dropdown chọn sản phẩm
const sanPhamChuaDanhGia = computed(() => {
  const items = activeOrder.value?.items || []
  return items.filter(item => !sanPhamIdDaDanhGia.value.includes(item.sanPhamId))
})

// Gọi BE lấy trạng thái đánh giá mới nhất của đơn, đồng thời reset sanPhamId đang chọn
// về sản phẩm đầu tiên chưa được đánh giá (nếu còn)
const taiTrangThaiDanhGia = async (order) => {
  if (order?.trangThai !== 'HOAN_THANH') {
    daDanhGia.value = false
    sanPhamIdDaDanhGia.value = []
    return
  }
  try {
    const res = await apiClient.get(`/api/v1/orders/${order.id}/review`)
    daDanhGia.value = res.data?.daDanhGia === true
    sanPhamIdDaDanhGia.value = res.data?.sanPhamIdDaDanhGia || []
  } catch {
    // Không xử lý lỗi — mặc định cho phép đánh giá
    daDanhGia.value = false
    sanPhamIdDaDanhGia.value = []
  }
}

// Tự điền sanPhamId và kiểm tra đã đánh giá chưa khi chuyển đơn
watch(() => activeOrder.value, async (order) => {
  moFormDanhGia.value = false
  danhGia.value = { sanPhamId: null, soSao: 0, noiDung: '', hinhAnh: null }

  await taiTrangThaiDanhGia(order)

  // Chọn sẵn sản phẩm đầu tiên chưa được đánh giá
  danhGia.value.sanPhamId = sanPhamChuaDanhGia.value[0]?.sanPhamId
    ?? order?.items?.[0]?.sanPhamId
    ?? null
}, { immediate: true })

// Chọn ảnh thực tế đính kèm đánh giá -> convert base64 (đồng bộ cách làm với ảnh sản phẩm)
const handleReviewImageChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) { showToast('Vui lòng chọn file ảnh', 'error'); return }
  if (file.size > 5 * 1024 * 1024) { showToast('Ảnh tối đa 5MB', 'error'); return }
  const reader = new FileReader()
  reader.onload = () => { danhGia.value.hinhAnh = reader.result }
  reader.readAsDataURL(file)
  e.target.value = ''
}

const guiDanhGia = async () => {
  if (!danhGia.value.soSao) { showToast('Vui lòng chọn số sao!', 'error'); return }
  danhGiaLoading.value = true
  try {
    // 1. Gửi đánh giá (endpoint sẵn có hoặc cần tạo thêm tại /api/v1/orders/{id}/review)
    await apiClient.post(`/api/v1/orders/${activeOrder.value.id}/review`, {
      sanPhamId: danhGia.value.sanPhamId || activeOrder.value.items?.[0]?.sanPhamId,
      soSao: danhGia.value.soSao,
      noiDung: danhGia.value.noiDung,
      hinhAnh: danhGia.value.hinhAnh,
    })
    // 2. Cộng điểm đánh giá (BE tự chặn cộng trùng nếu đơn đã từng được cộng điểm đánh giá)
    await apiClient.post(`/api/v1/loyalty/cong-diem-danh-gia/${activeOrder.value.id}`)

    // 3. Nạp lại trạng thái đánh giá mới nhất — nếu đơn còn sản phẩm khác chưa đánh giá,
    //    daDanhGia vẫn là false nên form/nút vẫn hiển thị để khách đánh giá tiếp
    await taiTrangThaiDanhGia(activeOrder.value)

    if (daDanhGia.value) {
      moFormDanhGia.value = false
      showToast('🌟 Cảm ơn bạn đã đánh giá! +5 điểm đã được cộng.', 'success')
    } else {
      // Vẫn còn sản phẩm chưa đánh giá -> tự chọn sản phẩm tiếp theo, giữ form mở
      danhGia.value = { sanPhamId: sanPhamChuaDanhGia.value[0]?.sanPhamId ?? null, soSao: 0, noiDung: '', hinhAnh: null }
      showToast('🌟 Đã gửi đánh giá! Bạn có thể đánh giá thêm sản phẩm còn lại.', 'success')
    }
  } catch (e) {
    showToast(e.response?.data || 'Gửi đánh giá thất bại!', 'error')
  } finally {
    danhGiaLoading.value = false
  }
}

// ===== TIỆN ÍCH DỊCH THUẬT & FORMAT (GIỮ NGUYÊN TỪ CŨ) =====
const formatCurrency = (value) => {
  if (!value && value !== 0) return '0đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ')
}

// Giá sản phẩm (chưa gồm ship, chưa trừ giảm giá) của 1 đơn — tính từ danh sách
// item thay vì "tongTien - phiShip", vì tongTien đã trừ giảm giá rồi nên phép
// trừ đó sẽ ra thiếu tiền khi đơn có áp mã giảm giá/voucher.
const tongTienHangCuaDon = (order) => {
  if (!order?.items) return 0
  return order.items.reduce((sum, item) => sum + (item.giaBan || 0) * (item.soLuong || 0), 0)
}

const formatDate = (dateString, includeTime = true) => {
  if (!dateString) return 'Chưa cập nhật'
  const date = new Date(dateString)
  if (includeTime) {
    return date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
  }
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const translateStatus = (status) => {
  const statusMap = {
    'CHO_XU_LY': 'Chờ xử lý',
    'DA_XAC_NHAN': 'Đã xác nhận',
    'DANG_LAM': 'Đang làm bánh',
    'SAN_SANG': 'Sẵn sàng giao',
    'DANG_GIAO': 'Đang giao hàng',
    'HOAN_THANH': 'Đã giao thành công',
    'DA_HUY': 'Đã hủy',
    'PAID': 'Đã thanh toán',
  }
  return statusMap[status] || status || 'Không rõ'
}

const orderStatusClass = (status) => {
  switch (status) {
    case 'CHO_XU_LY': return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    case 'DA_XAC_NHAN': return 'bg-blue-50 text-blue-700 border border-blue-200'
    case 'DANG_LAM': return 'bg-[#FDF8F2] text-[#7A5C3A] border border-[#EDE0CC]'
    case 'SAN_SANG': return 'bg-cyan-50 text-cyan-700 border border-cyan-200'
    case 'DANG_GIAO': return 'bg-purple-50 text-purple-700 border border-purple-200'
    case 'HOAN_THANH': return 'bg-green-50 text-green-700 border border-green-200'
    case 'PAID': return 'bg-green-50 text-green-700 border border-green-200'
    case 'DA_HUY': return 'bg-red-50 text-red-600 border border-red-200'
    default: return 'bg-gray-50 text-gray-600 border border-gray-200'
  }
}

// ===== TỰ ĐỘNG TẠO TIMELINE DỰA THEO TRẠNG THÁI (MỚI) =====
const generateTimeline = (order) => {
  const status = order.trangThai
  const history = [
    { label: 'Đặt hàng thành công', desc: 'Đơn hàng đã được hệ thống ghi nhận', icon: 'ph:check-circle-duotone', done: true, active: false, time: formatDate(order.ngayTao) },
    { label: 'Xác nhận đơn hàng', desc: 'Chocopine đã xác nhận đơn', icon: 'ph:seal-check-duotone', done: false, active: false, time: '' },
    { label: 'Đang sản xuất', desc: 'Bánh đang được chuẩn bị trong lò', icon: 'ph:cooking-pot-duotone', done: false, active: false, time: '' },
    { label: 'Sẵn sàng giao', desc: 'Đơn hàng đã đóng gói sẵn sàng', icon: 'ph:package-duotone', done: false, active: false, time: '' },
    { label: 'Đang giao hàng', desc: 'Shipper đang trên đường giao tới bạn', icon: 'ph:motorcycle-duotone', done: false, active: false, time: '' },
    { label: 'Đã giao hàng', desc: 'Bạn đã nhận bánh thành công', icon: 'ph:house-duotone', done: false, active: false, time: '' }
  ]

  // Rẽ nhánh nếu đơn bị hủy
  if (status === 'DA_HUY') {
      history[1] = { label: 'Đã hủy', desc: order.lyDoHuy || 'Đơn hàng đã bị hủy', icon: 'ph:x-circle-duotone', done: true, active: false, time: '' }
      return history.slice(0, 2)
  }

  // Map vị trí tiến trình hiện tại
  const statusIndex = {
    'CHO_XU_LY': 0, 'PAID': 0,
    'DA_XAC_NHAN': 1,
    'DANG_LAM': 2,
    'SAN_SANG': 3,
    'DANG_GIAO': 4,
    'HOAN_THANH': 5
  }[status] || 0

  return history.map((step, idx) => {
      if (idx < statusIndex) return { ...step, done: true, active: false }
      if (idx === statusIndex) return { ...step, done: false, active: true }
      return step
  })
}

// ===== LOGIC CHUÔNG THÔNG BÁO (Mock UI) =====
const notifications = ref([
  { id: 1, type: 'promo', title: 'Ưu đãi cuối tuần', body: 'Nhập WEEKEND15 để được giảm 15% cho đơn hàng tiếp theo!', time: '1 ngày trước', read: false }
])
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
const toggleNotifications = () => { showNotif.value = !showNotif.value }
const markAllRead = () => { notifications.value.forEach(n => n.read = true) }
const readNotif = (notif) => { notif.read = true }

const notifIcon = (t) => ({ delivery: 'ph:motorcycle-duotone', confirm: 'ph:seal-check-duotone', promo: 'ph:tag-duotone', done: 'ph:check-circle-duotone' }[t] || 'ph:bell-duotone')
const notifIconBg = (t) => ({ delivery: 'bg-purple-50', confirm: 'bg-blue-50', promo: 'bg-[#FDF8F2]', done: 'bg-green-50' }[t] || 'bg-gray-50')
const notifIconColor = (t) => ({ delivery: 'text-purple-500', confirm: 'text-blue-500', promo: 'text-[#7A5C3A]', done: 'text-green-500' }[t] || 'text-gray-400')

// Đóng dropdown khi click ra ngoài
const closeDropdown = (e) => {
  if (!e.target.closest('.relative')) showNotif.value = false
}

// ===== TOAST =====
const toast = ref({ show: false, msg: '', type: 'info' })
let toastTimer = null
const showToast = (msg, type = 'info') => {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, msg, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}

// ─── REALTIME: tự cập nhật khi trạng thái đơn thay đổi (không cần F5) ──────
let huyLangNgheRealtime = null

onMounted(() => {
  fetchMyOrders()
  document.addEventListener('click', closeDropdown)

  // Khi Admin/Nhân viên đổi trạng thái đơn (VD: chuyển "Đang giao"), backend
  // sẽ bắn thông báo về đây — tự nạp lại danh sách đơn NGẦM (không loading toàn trang)
  // để trạng thái hiển thị đúng ngay lập tức, không cần khách bấm F5.
  huyLangNgheRealtime = realtimeService.onNotification((message) => {
    showToast(message, 'success')
    fetchMyOrders({ silent: true })
  })
})
onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdown)
  if (huyLangNgheRealtime) huyLangNgheRealtime()
})
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* slide-down transition cho form đánh giá */
.slide-down-enter-active { transition: all .3s ease; }
.slide-down-leave-active { transition: all .2s ease; }
.slide-down-enter-from { opacity: 0; max-height: 0; transform: translateY(-8px); }
.slide-down-leave-to { opacity: 0; max-height: 0; }
.slide-down-enter-to, .slide-down-leave-from { max-height: 600px; }
</style>