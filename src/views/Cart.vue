<template>
  <div class="space-y-8 max-w-7xl mx-auto px-4 md:px-12 py-10 animate-fade-in">

    <!-- ===== HEADER ===== -->
    <div class="rounded-[24px] p-8 bg-white border border-[#EDE0CC] shadow-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style="background:linear-gradient(135deg,#7A5C3A,#9A7650);box-shadow:0 4px 16px rgba(122,92,58,0.2);">
            <iconify-icon icon="ph:shopping-cart-duotone" class="text-2xl text-white"></iconify-icon>
          </div>
          <div>
            <span style="font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;color:#9A7650;letter-spacing:3px;text-transform:uppercase;">Giỏ Hàng</span>
            <h1 style="font-family:'Playfair Display',serif;font-size:28px;font-weight:950;color:#3D2A1A;letter-spacing:1px;margin:2px 0 0;">Của Bạn</h1>
            <p style="font-family:'DM Sans',sans-serif;font-size:13px;color:#9A7650;margin-top:2px;">Xem lại các sản phẩm thơm ngon đã chọn và hoàn tất đơn hàng.</p>
          </div>
        </div>
        <RouterLink to="/shop/products" class="chocopine-btn-secondary px-5 py-2.5 inline-flex items-center gap-2 no-underline">
          ← Tiếp tục mua sắm
        </RouterLink>
      </div>
    </div>

    <!-- ===== CHƯA ĐĂNG NHẬP ===== -->
    <div v-if="!isAuthenticated" class="rounded-[24px] p-16 text-center bg-white border border-[#EDE0CC] shadow-sm">
      <div class="w-20 h-20 rounded-2xl bg-[#FDF6EC] border border-[#EDE0CC] flex items-center justify-center mx-auto mb-5">
        <iconify-icon icon="ph:shopping-cart-duotone" class="text-5xl text-[#7A5C3A]"></iconify-icon>
      </div>
      <h2 style="font-family:'Playfair Display',serif;font-size:24px;font-weight:900;color:#3D2A1A;letter-spacing:1px;" class="mb-2">Bạn chưa đăng nhập</h2>
      <p style="font-family:'DM Sans',sans-serif;font-size:14px;color:#9A7650;" class="mb-8">Vui lòng đăng nhập để xem và quản lý giỏ hàng của bạn.</p>
      <RouterLink to="/login" class="chocopine-btn-primary px-8 py-3.5 inline-block no-underline">
        Đăng nhập ngay
      </RouterLink>
    </div>

    <!-- ===== SKELETON LOADING ===== -->
    <div v-else-if="cartStore.loading && !cartStore.gioHang" class="grid gap-6 xl:grid-cols-[2.2fr_1fr]">
      <div class="space-y-4">
        <div v-for="i in 2" :key="i" class="rounded-[24px] p-6 animate-pulse flex gap-4 bg-white border border-[#EDE0CC]">
          <div class="h-32 w-[160px] rounded-2xl bg-[#F5ECD8] flex-shrink-0"></div>
          <div class="flex-1 space-y-3 pt-2">
            <div class="h-5 bg-[#EDE0CC] rounded-xl w-1/2"></div>
            <div class="h-4 bg-[#F5ECD8] rounded-xl w-1/3"></div>
            <div class="h-4 bg-[#F5ECD8] rounded-xl w-1/4"></div>
          </div>
        </div>
      </div>
      <div class="rounded-[24px] bg-[#FDF6EC] h-64 animate-pulse border border-[#EDE0CC]"></div>
    </div>

    <!-- ===== GIỎ TRỐNG ===== -->
    <div v-else-if="!cartStore.loading && cartStore.items.length === 0"
      class="rounded-[24px] p-16 text-center bg-white border border-[#EDE0CC] shadow-sm">
      <div class="w-24 h-24 rounded-2xl bg-[#FDF6EC] border border-[#EDE0CC] flex items-center justify-center mx-auto mb-5">
        <iconify-icon icon="ph:cake-duotone" class="text-6xl text-[#7A5C3A]"></iconify-icon>
      </div>
      <h2 style="font-family:'Playfair Display',serif;font-size:24px;font-weight:900;color:#3D2A1A;letter-spacing:1px;" class="mb-2">Giỏ hàng trống</h2>
      <p style="font-family:'DM Sans',sans-serif;font-size:14px;color:#9A7650;" class="mb-8">Hãy khám phá cửa hàng và thêm những chiếc bánh yêu thích nhé!</p>
      <RouterLink to="/shop" class="chocopine-btn-primary px-8 py-3.5 inline-block no-underline">
        Khám phá cửa hàng
      </RouterLink>
    </div>

    <!-- ===== NỘI DUNG GIỎ HÀNG ===== -->
    <div v-else class="grid gap-6 xl:grid-cols-[2.2fr_1fr]">

      <!-- Danh sách sản phẩm -->
      <div class="space-y-4">
        <div
          v-for="item in cartStore.items" :key="item.id"
          class="flex flex-col gap-5 sm:flex-row sm:items-center p-6 bg-white border border-[#EDE0CC] rounded-[20px] transition-all duration-200 hover:border-[#C4A882] hover:shadow-[0_8px_24px_rgba(122,92,58,0.08)]"
        >
          <img
            :src="item.anhSanPham || defaultImage"
            :alt="item.tenSanPham"
            class="h-32 w-full max-w-[160px] object-cover flex-shrink-0 rounded-[16px] border border-[#EDE0CC]"
            @error="e => e.target.src = defaultImage"
          />

          <div class="flex-1 space-y-3 font-sans">
            <!-- Tên + Thành tiền -->
            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 style="font-family:'Playfair Display',serif;font-size:17px;font-weight:900;color:#3D2A1A;letter-spacing:0.5px;">
                  {{ item.tenSanPham }}
                </h2>
                <p class="text-xs text-[#A68B5C] mt-0.5 font-medium">{{ item.tenDanhMuc || 'Bánh ngọt' }}</p>
              </div>
              <div class="rounded-xl bg-[#FDF6EC] border border-[#EDE0CC] px-3 py-1.5 text-sm font-black text-[#7A5C3A] whitespace-nowrap self-start">
                {{ formatCurrency(item.thanhTien) }}
              </div>
            </div>

            <!-- Đơn giá + Số lượng -->
            <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#9A7650]">
              <span>Đơn giá: <strong class="text-[#5C4428] font-bold">{{ formatCurrency(item.donGia) }}</strong></span>

              <div class="flex items-center gap-2">
                <span>Số lượng:</span>
                <div class="flex items-center gap-1 rounded-full border border-[#EDE0CC] bg-[#FDF6EC] px-1 py-0.5">
                  <button
                    @click="giamSoLuong(item)"
                    :disabled="cartStore.loading"
                    class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#7A5C3A] hover:text-white transition-colors text-base font-bold text-[#7A5C3A] disabled:opacity-40"
                  >−</button>
                  <span class="min-w-[28px] text-center font-bold text-[#3D2A1A] text-sm">{{ item.soLuong }}</span>
                  <button
                    @click="tangSoLuong(item)"
                    :disabled="cartStore.loading"
                    class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#7A5C3A] hover:text-white transition-colors text-base font-bold text-[#7A5C3A] disabled:opacity-40"
                  >+</button>
                </div>
              </div>
            </div>

            <!-- Nút xóa -->
            <div class="pt-1">
              <button
                @click="xacNhanXoa(item)"
                :disabled="cartStore.loading"
                class="text-[11px] font-bold text-[#A68B5C] border border-[#EDE0CC] rounded-xl px-4 py-1.5 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all disabled:opacity-40"
              >
                <iconify-icon icon="ph:trash-duotone" class="mr-1"></iconify-icon>
                Xóa khỏi giỏ
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar tổng đơn -->
      <div class="space-y-4">
        <div class="p-6 space-y-5 sticky top-6 bg-white border border-[#EDE0CC] rounded-[20px] shadow-sm">
          <h2 style="font-family:'Playfair Display',serif;font-size:18px;font-weight:900;color:#3D2A1A;letter-spacing:1px;"
            class="pb-3 border-b border-[#EDE0CC]">
            Tổng Đơn Hàng
          </h2>

          <!-- ===== VOUCHER SECTION ===== -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <iconify-icon icon="ph:ticket-duotone" class="text-[#7A5C3A] text-base flex-shrink-0"></iconify-icon>
              <span class="text-xs font-black text-[#5C4428] uppercase tracking-wider font-sans">Mã Giảm Giá</span>
            </div>

            <!-- Đã áp mã giảm giá -->
            <div v-if="cartStore.coApDungMaGiamGia"
              class="flex items-center justify-between gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
              <div class="flex items-center gap-2 min-w-0">
                <iconify-icon icon="ph:check-circle-fill" class="text-green-600 text-base flex-shrink-0"></iconify-icon>
                <div class="min-w-0">
                  <p class="text-xs font-black text-green-700 truncate">{{ cartStore.maGiamGiaCode }}</p>
                  <p class="text-[10px] text-green-600 font-medium">
                    Giảm {{ formatCurrency(cartStore.soTienGiam) }}
                  </p>
                </div>
              </div>
              <button @click="boVoucher"
                class="text-[10px] font-bold text-red-500 hover:text-red-700 flex-shrink-0 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
                Bỏ
              </button>
            </div>

            <!-- Đã áp voucher cá nhân (đổi bằng điểm) -->
            <div v-else-if="cartStore.coApDungVoucherKhachHang"
              class="flex items-center justify-between gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
              <div class="flex items-center gap-2 min-w-0">
                <iconify-icon icon="ph:check-circle-fill" class="text-green-600 text-base flex-shrink-0"></iconify-icon>
                <div class="min-w-0">
                  <p class="text-xs font-black text-green-700 truncate">{{ cartStore.tenVoucherKhachHang }}</p>
                  <p class="text-[10px] text-green-600 font-medium">
                    Giảm {{ formatCurrency(cartStore.soTienGiam) }}
                  </p>
                </div>
              </div>
              <button @click="boVoucherKhachHang"
                class="text-[10px] font-bold text-red-500 hover:text-red-700 flex-shrink-0 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors">
                Bỏ
              </button>
            </div>

            <!-- Input nhập mã -->
            <div v-else class="space-y-2">
              <div class="flex gap-2">
                <input
                  v-model="voucherInput"
                  @keyup.enter="apDungVoucher"
                  type="text"
                  placeholder="Nhập mã giảm giá..."
                  class="flex-1 text-xs border border-[#EDE0CC] rounded-xl px-3 py-2.5 outline-none focus:border-[#9A7650] focus:ring-2 focus:ring-[#9A7650]/20 font-sans placeholder:text-[#C4A882] bg-[#FDFAF6] transition-all"
                  :class="voucherError ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''"
                />
                <button
                  @click="apDungVoucher"
                  :disabled="!voucherInput.trim() || voucherLoading"
                  class="px-4 py-2.5 rounded-xl text-xs font-black transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  style="background:linear-gradient(135deg,#7A5C3A,#9A7650);color:white;"
                >
                  <iconify-icon v-if="voucherLoading" icon="ph:circle-notch" class="animate-spin text-sm"></iconify-icon>
                  <span v-else>Áp dụng</span>
                </button>
              </div>
              <p v-if="voucherError" class="text-[10px] text-red-500 font-semibold px-1">{{ voucherError }}</p>

              <!-- Nút xem voucher của tôi -->
              <button
                @click="moModalVoucher"
                class="w-full text-[11px] font-bold text-[#7A5C3A] border border-dashed border-[#C4A882] rounded-xl py-2 hover:bg-[#FDF6EC] transition-colors flex items-center justify-center gap-1.5"
              >
                <iconify-icon icon="ph:gift-duotone" class="text-sm"></iconify-icon>
                Xem voucher của tôi
              </button>
            </div>
          </div>
          <!-- ===== /VOUCHER SECTION ===== -->

          <div class="space-y-3 text-xs font-sans text-[#9A7650]">
            <div class="flex justify-between">
              <span>Giá sản phẩm ({{ cartStore.tongSoLuong }} món)</span>
              <span class="font-bold text-[#5C4428]">{{ formatCurrency(cartStore.tongTienHang) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Phí giao hàng</span>
              <span :class="cartStore.phiShip === 0 ? 'font-bold text-green-600' : 'font-bold text-[#5C4428]'">
                {{ cartStore.phiShip === 0 ? 'Miễn phí' : formatCurrency(cartStore.phiShip) }}
              </span>
            </div>
            <!-- Dòng giảm giá -->
            <div v-if="soTienGiam > 0" class="flex justify-between text-green-700">
              <span class="flex items-center gap-1">
                <iconify-icon icon="ph:tag-duotone" class="text-sm"></iconify-icon>
                Giảm giá voucher
              </span>
              <span class="font-black">-{{ formatCurrency(soTienGiam) }}</span>
            </div>
            <div v-if="cartStore.phiShip > 0"
              class="flex items-center gap-2 text-amber-600 font-semibold bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              <iconify-icon icon="ph:gift-duotone" class="text-base shrink-0"></iconify-icon>
              Thêm {{ formatCurrency(500000 - cartStore.tongTienHang) }} để miễn phí ship!
            </div>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-[#EDE0CC]">
            <span class="text-sm font-bold text-[#5C4428] font-sans">Thành tiền</span>
            <div class="text-right">
              <div v-if="soTienGiam > 0" class="text-xs text-[#A68B5C] line-through font-sans mb-0.5">
                {{ formatCurrency(tongTruocGiam) }}
              </div>
              <span style="font-family:'Playfair Display',serif;font-size:24px;font-weight:950;color:#7A5C3A;">
                {{ formatCurrency(cartStore.tongThanhToan) }}
              </span>
            </div>
          </div>

          <button
            @click="thanhToan"
            :disabled="cartStore.loading || cartStore.items.length === 0"
            class="chocopine-btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            <iconify-icon icon="ph:lock-duotone" class="text-sm"></iconify-icon>
            Tiến hành thanh toán
          </button>

          <button
            @click="xoaToanBo"
            :disabled="cartStore.loading"
            class="w-full py-3 text-xs font-bold text-[#A68B5C] border border-[#EDE0CC] rounded-xl hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-all disabled:opacity-40 font-sans"
          >
            Xóa toàn bộ giỏ hàng
          </button>
        </div>

        <!-- Mẹo đặt bánh -->
        <div class="p-6 bg-[#FDF6EC] border border-dashed border-[#C4A882] rounded-[20px]">
          <h3 class="text-xs font-black text-[#7A5C3A] uppercase tracking-widest mb-4 flex items-center gap-2">
            <iconify-icon icon="ph:lightbulb-duotone" class="text-base"></iconify-icon>
            Mẹo đặt bánh
          </h3>
          <ul class="space-y-2.5 text-xs text-[#9A7650] font-sans leading-relaxed">
            <li class="flex items-start gap-2">
              <span class="text-[#7A5C3A] flex-shrink-0 mt-0.5">◆</span>
              <span>Nên đặt trước <strong class="text-[#5C4428]">2–3 ngày</strong> với bánh Custom 3D phức tạp.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#7A5C3A] flex-shrink-0 mt-0.5">◆</span>
              <span>Chọn hình ảnh rõ nét khi yêu cầu thiết kế bánh in.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#7A5C3A] flex-shrink-0 mt-0.5">◆</span>
              <span>Ghi chú dị ứng thực phẩm (nếu có) trong phần ghi chú đơn hàng.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ===== MODAL CHỌN VOUCHER ===== -->
    <Transition name="modal">
      <div v-if="showVoucherModal"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        @click.self="dongModalVoucher">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="dongModalVoucher"></div>

        <!-- Panel -->
        <div class="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
          <!-- Header modal -->
          <div class="p-6 border-b border-[#EDE0CC] flex items-center justify-between flex-shrink-0"
            style="background:linear-gradient(135deg,#7A5C3A,#9A7650);">
            <div class="flex items-center gap-3">
              <iconify-icon icon="ph:ticket-duotone" class="text-2xl text-white"></iconify-icon>
              <div>
                <h3 style="font-family:'Playfair Display',serif;font-size:18px;font-weight:900;color:white;letter-spacing:0.5px;">
                  Voucher Của Tôi
                </h3>
                <p class="text-xs text-white/70 font-sans">Chọn voucher để áp dụng vào đơn hàng</p>
              </div>
            </div>
            <button @click="dongModalVoucher"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white">
              <iconify-icon icon="ph:x-bold" class="text-sm"></iconify-icon>
            </button>
          </div>

          <!-- Danh sách voucher -->
          <div class="overflow-y-auto flex-1 p-4 space-y-3">
            <!-- Loading -->
            <div v-if="voucherListLoading" class="py-10 text-center">
              <iconify-icon icon="ph:circle-notch" class="animate-spin text-3xl text-[#9A7650]"></iconify-icon>
              <p class="text-xs text-[#9A7650] mt-3 font-sans">Đang tải voucher...</p>
            </div>

            <!-- Không có voucher -->
            <div v-else-if="danhSachVoucher.length === 0" class="py-10 text-center">
              <iconify-icon icon="ph:ticket-duotone" class="text-5xl text-[#C4A882]"></iconify-icon>
              <p class="text-sm font-bold text-[#5C4428] mt-3 font-sans">Bạn chưa có voucher nào</p>
              <p class="text-xs text-[#9A7650] mt-1 font-sans">Hãy tích điểm để đổi lấy voucher hấp dẫn!</p>
            </div>

            <!-- Danh sách -->
            <div
              v-for="v in danhSachVoucher" :key="v.id"
              @click="v.conHieuLuc && cartStore.voucherKhachHangId !== v.id && chonVoucher(v)"
              class="rounded-[16px] border-2 p-4 transition-all select-none"
              :class="[
                !v.conHieuLuc
                  ? 'border-[#EDE0CC] bg-gray-50 opacity-50 cursor-not-allowed'
                  : cartStore.voucherKhachHangId === v.id
                    ? 'border-[#7A5C3A] bg-[#FDF6EC] shadow-md cursor-default'
                    : 'border-[#EDE0CC] bg-white hover:border-[#C4A882] hover:shadow-sm cursor-pointer'
              ]"
            >
              <div class="flex items-start gap-3">
                <!-- Icon loại -->
                <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  :style="v.conHieuLuc ? 'background:linear-gradient(135deg,#7A5C3A,#9A7650)' : 'background:#D1C9BE'">
                  <iconify-icon
                    v-if="!(chonVoucherLoadingId === v.id)"
                    :icon="v.loaiGiam === 'PHAN_TRAM' ? 'ph:percent-duotone' : 'ph:tag-duotone'"
                    class="text-white text-base">
                  </iconify-icon>
                  <iconify-icon v-else icon="ph:circle-notch" class="text-white text-base animate-spin"></iconify-icon>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <p class="text-sm font-black text-[#3D2A1A] font-sans truncate">
                        {{ v.tenVoucher || 'Voucher giảm giá' }}
                      </p>
                      <p class="text-xs text-[#7A5C3A] font-bold mt-0.5">
                        Giảm {{ v.loaiGiam === 'PHAN_TRAM' ? v.giaTriGiam + '%' : formatCurrency(v.giaTriGiam) }}
                        <span v-if="v.donHangToiThieu > 0" class="text-[#A68B5C] font-normal">
                          · Đơn tối thiểu {{ formatCurrency(v.donHangToiThieu) }}
                        </span>
                      </p>
                    </div>
                    <!-- Badge đang áp dụng -->
                    <span v-if="cartStore.voucherKhachHangId === v.id"
                      class="flex-shrink-0 text-[9px] font-black uppercase tracking-wider bg-[#7A5C3A] text-white px-2 py-0.5 rounded-full">
                      Đang dùng
                    </span>
                    <span v-else-if="!v.conHieuLuc"
                      class="flex-shrink-0 text-[9px] font-black uppercase tracking-wider bg-gray-300 text-gray-600 px-2 py-0.5 rounded-full">
                      Hết hạn
                    </span>
                  </div>

                  <div class="flex items-center gap-3 mt-2 text-[10px] text-[#A68B5C] font-sans">
                    <span v-if="v.ngayHetHan" class="flex items-center gap-1">
                      <iconify-icon icon="ph:clock-duotone" class="text-xs"></iconify-icon>
                      HSD: {{ formatDate(v.ngayHetHan) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer modal -->
          <div class="p-4 border-t border-[#EDE0CC] flex-shrink-0 bg-[#FDFAF6]">
            <p class="text-[10px] text-center text-[#A68B5C] font-sans">
              Chỉ áp dụng 1 voucher cho mỗi đơn hàng
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ===== TOAST ===== -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 rounded-2xl px-6 py-3.5 text-xs font-bold text-white shadow-xl flex items-center gap-3 font-sans"
        :class="toast.type === 'success' ? 'bg-[#7A5C3A]' : 'bg-red-500'"
      >
        <iconify-icon :icon="toast.type === 'success' ? 'ph:check-circle-fill' : 'ph:warning-fill'" class="text-lg"></iconify-icon>
        {{ toast.message }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import apiClient from '@/services/apiService'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const isAuthenticated = authStore.isAuthenticated
const defaultImage = 'https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=800&q=80'

// ─── Toast ───────────────────────────────────────────────────────────────────
const toast = ref({ show: false, message: '', type: 'success' })
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

// ─── Format ──────────────────────────────────────────────────────────────────
const formatCurrency = (value) => {
  if (!value && value !== 0) return '0đ'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ')
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`
}

// ─── Mã giảm giá (đồng bộ thật với backend qua cartStore) ───────────────────
const voucherInput = ref('')
const voucherError = ref('')
const voucherLoading = ref(false)

// ─── Modal "Voucher của tôi" ─────────────────────────────────────────────────
// Voucher cá nhân đổi bằng điểm thưởng (VoucherKhachHang) — hệ thống KHÁC với
// "Mã giảm giá" (MaGiamGia) ở trên, nhưng đều được lưu ở giỏ hàng phía backend
// (mỗi đơn chỉ áp dụng 1 trong 2). Chọn 1 voucher ở đây sẽ tự động gỡ mã giảm
// giá đang áp (nếu có), và tự động mang theo khi checkout.
const showVoucherModal = ref(false)
const voucherListLoading = ref(false)
const danhSachVoucher = ref([])
// id của voucher đang gọi API áp dụng (để hiện icon loading trên đúng thẻ voucher đó)
const chonVoucherLoadingId = ref(null)

const moModalVoucher = async () => {
  showVoucherModal.value = true
  if (danhSachVoucher.value.length > 0) return
  voucherListLoading.value = true
  try {
    const res = await apiClient.get('/api/v1/loyalty/voucher')
    danhSachVoucher.value = res.data || []
  } catch (err) {
    showToast('Không thể tải danh sách voucher', 'error')
  } finally {
    voucherListLoading.value = false
  }
}

const dongModalVoucher = () => {
  showVoucherModal.value = false
}

const chonVoucher = async (v) => {
  chonVoucherLoadingId.value = v.id
  try {
    const result = await cartStore.apDungVoucherKhachHang(v.id)
    if (result.success) {
      showToast(`Đã áp dụng "${v.tenVoucher}"! 🎉`)
      dongModalVoucher()
    } else {
      showToast(result.message, 'error')
    }
  } finally {
    chonVoucherLoadingId.value = null
  }
}

// ─── Số tiền giảm & tổng sau giảm — lấy trực tiếp từ backend (đã tính đúng) ──
// Lưu ý: cartStore.tongThanhToan (BE trả về) = tongTienHang - soTienGiam + phiShip,
// tức ĐÃ LÀ số tiền SAU khi giảm giá + cộng phí ship. Vì vậy không cần biến
// "tongThanhToanSauGiam" nào khác — chỉ cần dùng thẳng cartStore.tongThanhToan.
const soTienGiam = computed(() => cartStore.soTienGiam)

// Giá gốc TRƯỚC khi giảm giá (dùng để hiển thị dòng gạch ngang khi có voucher)
const tongTruocGiam = computed(() => cartStore.tongTienHang + cartStore.phiShip)

// ─── Áp dụng mã giảm giá (gọi backend thật, mã sẽ được lưu ở giỏ hàng và
// tự động mang qua khi checkout) ──────────────────────────────────────────────
const apDungVoucher = async () => {
  const ma = voucherInput.value.trim()
  if (!ma) return
  voucherError.value = ''
  voucherLoading.value = true
  try {
    const result = await cartStore.apDungMaGiamGia(ma)
    if (result.success) {
      voucherInput.value = ''
      showToast('Áp dụng mã giảm giá thành công! 🎉')
    } else {
      voucherError.value = result.message
    }
  } finally {
    voucherLoading.value = false
  }
}

// ─── Bỏ mã giảm giá (gọi backend, gỡ khỏi giỏ hàng thật) ────────────────────
const boVoucher = async () => {
  voucherError.value = ''
  const result = await cartStore.xoaMaGiamGia()
  if (result.success) {
    showToast('Đã bỏ mã giảm giá.')
  } else {
    showToast(result.message, 'error')
  }
}

// ─── Bỏ voucher cá nhân (gọi backend, gỡ khỏi giỏ hàng thật) ────────────────
const boVoucherKhachHang = async () => {
  const result = await cartStore.xoaVoucherKhachHang()
  if (result.success) {
    showToast('Đã bỏ voucher.')
  } else {
    showToast(result.message, 'error')
  }
}

// ─── Tăng / Giảm số lượng ────────────────────────────────────────────────────
const tangSoLuong = async (item) => {
  await cartStore.capNhatSoLuong(item.id, item.soLuong + 1)
  if (cartStore.error) showToast(cartStore.error, 'error')
}

const giamSoLuong = async (item) => {
  if (item.soLuong <= 1) { xacNhanXoa(item); return }
  await cartStore.capNhatSoLuong(item.id, item.soLuong - 1)
  if (cartStore.error) showToast(cartStore.error, 'error')
}

// ─── Xóa sản phẩm ────────────────────────────────────────────────────────────
const xacNhanXoa = async (item) => {
  if (!confirm(`Bỏ "${item.tenSanPham}" khỏi giỏ hàng?`)) return
  await cartStore.xoaItem(item.id)
  if (cartStore.error) showToast(cartStore.error, 'error')
  else showToast('Đã xóa sản phẩm khỏi giỏ hàng!')
}

// ─── Xóa toàn bộ ─────────────────────────────────────────────────────────────
const xoaToanBo = async () => {
  if (!confirm('Xóa toàn bộ giỏ hàng?')) return
  await cartStore.xoaToanBo()
  if (cartStore.error) showToast(cartStore.error, 'error')
  else showToast('Đã xóa toàn bộ giỏ hàng!')
}

// ─── Thanh toán ──────────────────────────────────────────────────────────────
// Mã giảm giá (nếu có) đã được lưu ở giỏ hàng phía backend, Checkout sẽ tự
// đọc lại giỏ hàng nên không cần truyền gì thêm qua query nữa.
const thanhToan = () => {
  router.push({ name: 'Checkout' })
}

// ─── Khởi tạo ────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (authStore.isAuthenticated && authStore.isKhachHang) {
    await cartStore.fetchGioHang()
    if (cartStore.error) showToast(cartStore.error, 'error')
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(20px); }

/* Modal transition */
.modal-enter-active { transition: all 0.25s ease-out; }
.modal-leave-active { transition: all 0.2s ease-in; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative,
.modal-leave-to .relative { transform: translateY(20px) scale(0.97); }

@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 0.8s linear infinite;
}
</style>