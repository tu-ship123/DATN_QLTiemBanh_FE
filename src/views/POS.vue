<template>
  <div class="flex h-screen bg-[#FFF8F4] overflow-hidden -m-6">

    <!-- LEFT: Danh sách sản phẩm -->
    <div class="flex-1 flex flex-col min-w-0 border-r border-[#EDE8E3]">
      <div class="bg-white px-5 py-4 border-b border-[#EDE8E3] shrink-0">
        <div class="flex items-center gap-3 bg-[#F5F0ED] rounded-xl px-4 py-2.5 mb-3 focus-within:ring-2 focus-within:ring-[#E8634A]/20">
          <iconify-icon icon="ph:magnifying-glass" class="text-gray-400 text-xl shrink-0"></iconify-icon>
          <input v-model="search" type="text" placeholder="Tìm tên bánh, mã sản phẩm..."
            class="bg-transparent outline-none w-full text-sm text-[#1E2A3B] placeholder-gray-400" />
          <button v-if="search" @click="search = ''" class="text-gray-400 hover:text-gray-600">
            <iconify-icon icon="ph:x" class="text-lg"></iconify-icon>
          </button>
        </div>

        <!-- Quét mã vạch -->
        <div class="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 mb-4 border-2 border-dashed border-[#E8634A]/30 focus-within:border-[#E8634A] focus-within:border-solid focus-within:ring-2 focus-within:ring-[#E8634A]/20 transition-all">
          <iconify-icon icon="ph:barcode" class="text-[#E8634A] text-xl shrink-0"></iconify-icon>
          <input ref="barcodeInputRef" v-model="barcodeInput" type="text"
            placeholder="Quét mã vạch sản phẩm rồi nhấn Enter..."
            class="bg-transparent outline-none w-full text-sm text-[#1E2A3B] placeholder-gray-400 font-mono"
            @keyup.enter="handleBarcodeScan" />
          <button v-if="barcodeInput" @click="barcodeInput = ''; focusBarcodeInput()" class="text-gray-400 hover:text-gray-600">
            <iconify-icon icon="ph:x" class="text-lg"></iconify-icon>
          </button>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
            class="px-4 py-2 rounded-xl text-sm font-bold transition-all"
            :class="activeTab === tab.key
              ? 'bg-gradient-to-r from-[#E8634A] to-[#F07A5E] text-white shadow-md shadow-[#E8634A]/20'
              : 'bg-[#F5F0ED] text-[#5A6474] hover:bg-[#EDE8E3]'">
            {{ tab.label }} <span class="ml-1 text-xs opacity-70">({{ tab.count }})</span>
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loadingProducts" class="flex-1 flex items-center justify-center">
        <div class="flex flex-col items-center gap-3 text-gray-400">
          <iconify-icon icon="ph:spinner-gap" class="text-4xl animate-spin text-[#E8634A]"></iconify-icon>
          <p class="text-sm font-semibold">Đang tải sản phẩm...</p>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="productError" class="flex-1 flex items-center justify-center">
        <div class="flex flex-col items-center gap-3 text-red-400 p-6 text-center">
          <iconify-icon icon="ph:warning-circle-duotone" class="text-5xl"></iconify-icon>
          <p class="text-sm font-semibold">{{ productError }}</p>
          <button @click="loadProducts" class="mt-2 px-4 py-2 bg-[#E8634A] text-white rounded-xl text-sm font-bold hover:bg-[#d4583f] transition">
            Thử lại
          </button>
        </div>
      </div>

      <div v-else class="flex-1 overflow-y-auto p-5">
        <div v-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center h-40 text-gray-300">
          <iconify-icon icon="ph:magnifying-glass" class="text-5xl mb-2"></iconify-icon>
          <p class="text-sm font-semibold">Không tìm thấy sản phẩm</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          <button v-for="p in filteredProducts" :key="p.id" @click="addToCart(p)"
            :disabled="p.soLuongTon === 0"
            class="bg-white rounded-2xl border border-[#EDE8E3] p-3 text-left transition-all group relative"
            :class="p.soLuongTon === 0
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:border-[#E8634A]/40 hover:shadow-md hover:-translate-y-0.5 active:scale-95'">
            <div v-if="p.soLuongTon === 0"
              class="absolute top-2 right-2 bg-red-100 text-red-500 text-[10px] font-black px-2 py-0.5 rounded-full">
              Hết
            </div>
            <div class="w-full aspect-square rounded-xl bg-[#FFF0EC] flex items-center justify-center mb-3 overflow-hidden group-hover:bg-[#FFE4DC] transition-colors">
              <img v-if="p.anhSanPham" :src="p.anhSanPham" :alt="p.tenSanPham"
                class="w-full h-full object-cover rounded-xl" @error="handleImgError($event)" />
              <iconify-icon v-else icon="ph:cake-duotone" class="text-4xl text-[#E8634A]"></iconify-icon>
            </div>
            <div class="text-xs font-black text-[#1E2A3B] truncate mb-0.5">{{ p.tenSanPham }}</div>
            <div class="text-xs font-bold text-[#E8634A]">{{ formatPrice(p.donGia) }}</div>
            <div class="text-[10px] text-gray-400 mt-0.5">Tồn: {{ p.soLuongTon }}</div>
            <div class="text-[9px] text-gray-300 font-mono mt-0.5 truncate">{{ maVachOf(p) }}</div>
          </button>
        </div>
      </div>
    </div>

    <!-- RIGHT: Bill Panel -->
    <div class="w-[380px] shrink-0 bg-white flex flex-col">
      <div class="px-5 py-4 border-b border-[#EDE8E3] shrink-0">
        <div class="flex items-center justify-between mb-3">
          <div>
            <div class="font-display font-black text-base text-[#1E2A3B]">Đơn hiện tại</div>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="text-xs text-gray-400">#POS-{{ orderNo }}</span>
              <span v-if="soTheRung.trim()" class="flex items-center gap-1 text-[11px] font-black text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                <iconify-icon icon="ph:bell-ringing-duotone" class="text-xs"></iconify-icon> Thẻ {{ soTheRung.trim() }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button @click="treoBill" :disabled="cart.length === 0"
              class="text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
              :class="cart.length === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-[#7A5C3A] hover:bg-[#FDF6EC]'">
              <iconify-icon icon="ph:tray-duotone" class="text-sm"></iconify-icon> Treo bill
            </button>
            <button @click="clearCart" class="text-xs font-bold text-red-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition flex items-center gap-1">
              <iconify-icon icon="ph:trash-duotone" class="text-sm"></iconify-icon> Xóa tất cả
            </button>
          </div>
        </div>

        <!-- Dải bill đang treo -->
        <div v-if="heldBills.length" class="flex items-center gap-2 overflow-x-auto pb-3 -mt-1 mb-3">
          <button v-for="bill in heldBills" :key="bill.id" @click="resumeHeldBill(bill)"
            class="shrink-0 flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors group">
            <iconify-icon icon="ph:tray-duotone" class="text-amber-500 text-sm shrink-0"></iconify-icon>
            <div class="text-left leading-tight">
              <div class="text-[11px] font-black text-amber-700 whitespace-nowrap">{{ bill.label }}</div>
              <div class="text-[10px] text-amber-500 whitespace-nowrap">{{ bill.cart.length }} món · {{ formatPrice(billTotal(bill)) }}</div>
            </div>
            <span @click.stop="discardHeldBill(bill)"
              class="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-amber-400 opacity-0 group-hover:opacity-100 hover:bg-amber-200 hover:text-amber-600 transition-all shrink-0">
              <iconify-icon icon="ph:x-bold" class="text-[10px]"></iconify-icon>
            </span>
          </button>
        </div>

        <!-- Email khách -->
        <div class="relative mb-2">
          <iconify-icon icon="ph:user-duotone" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base"></iconify-icon>
          <input
            v-model="emailKhach"
            type="email"
            placeholder="Email khách hàng (để trống = dùng email nhân viên)"
            class="w-full text-xs border border-[#EDE8E3] rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-[#E8634A] focus:ring-1 focus:ring-[#E8634A]/20"
          />
        </div>

        <!-- Số thẻ rung -->
        <div class="relative mb-2">
          <iconify-icon icon="ph:bell-ringing-duotone" class="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 text-base"></iconify-icon>
          <input
            v-model="soTheRung"
            type="text"
            placeholder="Số thẻ rung (vd: A12) để gọi khách"
            class="w-full text-xs border border-[#EDE8E3] rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-[#E8634A] focus:ring-1 focus:ring-[#E8634A]/20"
          />
        </div>

        <!-- Mã giảm giá -->
        <div v-if="!appliedVoucher" class="relative">
          <iconify-icon icon="ph:ticket-duotone" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base"></iconify-icon>
          <input
            v-model="voucherCode"
            type="text"
            placeholder="Nhập mã giảm giá..."
            @keyup.enter="applyVoucher"
            class="w-full text-xs border border-[#EDE8E3] rounded-xl pl-8 pr-20 py-2 uppercase focus:outline-none focus:border-[#E8634A] focus:ring-1 focus:ring-[#E8634A]/20"
          />
          <button @click="applyVoucher" :disabled="!voucherCode.trim()"
            class="absolute right-1.5 top-1/2 -translate-y-1/2 text-[11px] font-black px-3 py-1.5 rounded-lg transition"
            :class="voucherCode.trim() ? 'bg-[#E8634A] text-white hover:bg-[#d4583f]' : 'bg-gray-100 text-gray-300 cursor-not-allowed'">
            Áp dụng
          </button>
        </div>
        <p v-if="voucherError" class="text-[11px] text-red-500 mt-1 flex items-center gap-1">
          <iconify-icon icon="ph:warning-circle-duotone"></iconify-icon> {{ voucherError }}
        </p>
        <div v-if="appliedVoucher" class="flex items-center justify-between gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
          <div class="flex items-center gap-2 min-w-0">
            <iconify-icon icon="ph:ticket-duotone" class="text-green-500 text-base shrink-0"></iconify-icon>
            <div class="min-w-0">
              <div class="text-[11px] font-black text-green-700 truncate">Mã "{{ appliedVoucher.code }}" đã áp dụng</div>
              <div class="text-[10px] text-green-500 truncate">{{ appliedVoucher.moTa }} · -{{ formatPrice(discountAmount) }}</div>
            </div>
          </div>
          <button @click="removeVoucher" class="shrink-0 text-green-400 hover:text-red-400 transition">
            <iconify-icon icon="ph:x-circle-fill" class="text-lg"></iconify-icon>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto px-4 py-3">
        <div v-if="cart.length === 0" class="flex flex-col items-center justify-center h-full text-gray-300 py-10">
          <iconify-icon icon="ph:shopping-cart-duotone" class="text-6xl mb-3"></iconify-icon>
          <p class="text-sm font-semibold">Chưa có món nào</p>
          <p class="text-xs mt-1">Chọn sản phẩm bên trái để thêm vào</p>
        </div>
        <div v-else class="space-y-2">
          <div v-for="item in cart" :key="item.id"
            class="flex items-center gap-3 p-3 rounded-xl bg-[#FFF8F4] border border-[#EDE8E3] group">
            <div class="w-10 h-10 rounded-lg bg-[#FFF0EC] flex items-center justify-center shrink-0 overflow-hidden">
              <img v-if="item.anhSanPham" :src="item.anhSanPham" :alt="item.tenSanPham" class="w-full h-full object-cover" @error="handleImgError($event)" />
              <iconify-icon v-else icon="ph:cake-duotone" class="text-xl text-[#E8634A]"></iconify-icon>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs font-bold text-[#1E2A3B] truncate">{{ item.tenSanPham }}</div>
              <div class="text-xs text-[#E8634A] font-bold">{{ formatPrice(item.donGia) }}</div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button @click="decrease(item)" class="w-7 h-7 rounded-lg bg-white border border-[#EDE8E3] flex items-center justify-center text-gray-500 hover:border-[#E8634A] hover:text-[#E8634A] transition font-bold text-lg leading-none">-</button>
              <span class="w-6 text-center text-sm font-black text-[#1E2A3B]">{{ item.qty }}</span>
              <button @click="increase(item)"
                :disabled="item.qty >= item.soLuongTon"
                class="w-7 h-7 rounded-lg flex items-center justify-center transition font-bold text-lg leading-none"
                :class="item.qty >= item.soLuongTon ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#E8634A] text-white hover:bg-[#d4583f]'">+</button>
            </div>
            <button @click="removeItem(item)" class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition ml-1">
              <iconify-icon icon="ph:x-circle-fill" class="text-lg"></iconify-icon>
            </button>
          </div>
        </div>
      </div>

      <div class="border-t border-[#EDE8E3] px-5 pt-4 pb-3 shrink-0 space-y-2">
        <div class="flex justify-between text-sm text-gray-500">
          <span>Tạm tính ({{ totalQty }} món)</span>
          <span class="font-semibold text-[#1E2A3B]">{{ formatPrice(subtotal) }}</span>
        </div>
        <div v-if="appliedVoucher" class="flex justify-between text-sm text-green-600">
          <span>Giảm giá ({{ appliedVoucher.code }})</span>
          <span class="font-semibold">-{{ formatPrice(discountAmount) }}</span>
        </div>
        <div class="flex justify-between text-base font-black text-[#1E2A3B] pt-2 border-t border-[#EDE8E3]">
          <span>Tổng cộng</span>
          <span class="text-[#E8634A] text-lg">{{ formatPrice(finalTotal) }}</span>
        </div>
        <p class="text-[10px] text-gray-400 text-center italic">(Giá hiển thị theo BE, không cộng thêm VAT ở FE)</p>
        <p v-if="appliedVoucher" class="text-[10px] text-amber-500 text-center italic">(Mã giảm giá hiện đang demo giao diện, số tiền hệ thống ghi nhận sẽ đúng khi nối API)</p>
      </div>

      <div class="px-5 pb-5 space-y-2 shrink-0">
        <button @click="openPayment('cash')" :disabled="cart.length === 0 || submitting"
          class="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all"
          :class="cart.length === 0 || submitting ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-[#E8634A] to-[#F07A5E] text-white shadow-lg shadow-[#E8634A]/30 hover:-translate-y-0.5'">
          <iconify-icon icon="ph:money-duotone" class="text-xl"></iconify-icon>
          Thanh toán tiền mặt
        </button>
        <button @click="openPayment('qr')" :disabled="cart.length === 0 || submitting"
          class="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all border-2"
          :class="cart.length === 0 || submitting ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-[#E8634A] text-[#E8634A] hover:bg-[#FFF0EC]'">
          <iconify-icon icon="ph:qr-code-duotone" class="text-xl"></iconify-icon>
          VietQR / Chuyển khoản
        </button>
        <button @click="doPrintBill" :disabled="!lastReceipt"
          class="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all"
          :class="!lastReceipt ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-[#1E2A3B] text-white hover:bg-[#2D3F56]'">
          <iconify-icon icon="ph:printer-duotone" class="text-xl"></iconify-icon>
          In hóa đơn nhiệt
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- MODAL: Tiền mặt                                 -->
    <!-- ═══════════════════════════════════════════════ -->
    <el-dialog v-model="showCashModal" title="Thanh toán tiền mặt" width="420px" center align-center>
      <div class="space-y-4">
        <div class="text-center p-4 bg-[#FFF8F4] rounded-xl">
          <div class="text-sm text-gray-400 mb-1">Tổng tiền cần thanh toán</div>
          <div class="text-3xl font-black text-[#E8634A]">{{ formatPrice(finalTotal) }}</div>
        </div>

        <div>
          <label class="text-sm font-bold text-[#1E2A3B] mb-2 block">Ghi chú đơn hàng</label>
          <el-input v-model="ghiChu" type="textarea" :rows="2" placeholder="Ghi chú (tuỳ chọn)..." />
        </div>

        <div>
          <label class="text-sm font-bold text-[#1E2A3B] mb-2 block">Tiền khách đưa</label>
          <el-input v-model="cashGiven" type="number" size="large" placeholder="Nhập số tiền..." @input="calcChange">
            <template #suffix>đ</template>
          </el-input>
        </div>

        <div v-if="cashGiven && change >= 0" class="flex justify-between items-center p-3 bg-green-50 rounded-xl">
          <span class="text-sm font-bold text-green-700">Tiền thối lại</span>
          <span class="text-lg font-black text-green-600">{{ formatPrice(change) }}</span>
        </div>
        <div v-else-if="cashGiven && change < 0" class="flex justify-between items-center p-3 bg-red-50 rounded-xl">
          <span class="text-sm font-bold text-red-500">Thiếu</span>
          <span class="text-lg font-black text-red-500">{{ formatPrice(Math.abs(change)) }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="showCashModal = false" :disabled="submitting">Huỷ</el-button>
        <el-button type="primary"
          :disabled="change < 0 || !cashGiven || submitting"
          :loading="submitting"
          @click="submitOrder('TIEN_MAT')"
          style="background-color: #E8634A; border-color: #E8634A;">
          Xác nhận thanh toán
        </el-button>
      </template>
    </el-dialog>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- MODAL: VietQR                                   -->
    <!-- ═══════════════════════════════════════════════ -->
    <el-dialog v-model="showQRModal" title="Thanh toán VietQR / Chuyển khoản" width="440px" center align-center :close-on-click-modal="!submitting && !qrData" :close-on-press-escape="!submitting && !qrData" :before-close="handleCloseQRModal">
      <div class="space-y-4">

        <!-- Bước 1: Nhập ghi chú, chưa tạo đơn -->
        <template v-if="!qrData && !submitting">
          <div>
            <label class="text-sm font-bold text-[#1E2A3B] mb-2 block">Ghi chú đơn hàng</label>
            <el-input v-model="ghiChu" type="textarea" :rows="2" placeholder="Ghi chú (tuỳ chọn)..." />
          </div>
          <div class="flex flex-col items-center gap-3 py-4">
            <div class="w-40 h-40 bg-[#F5F0ED] rounded-2xl flex items-center justify-center">
              <iconify-icon icon="ph:qr-code-duotone" class="text-7xl text-[#E8634A]/30"></iconify-icon>
            </div>
            <p class="text-sm text-gray-400 text-center">
              Nhấn <strong class="text-[#E8634A]">"Tạo mã QR"</strong> để gửi đơn lên server và nhận mã chuyển khoản.
            </p>
          </div>
        </template>

        <!-- Loading -->
        <div v-else-if="submitting" class="flex flex-col items-center gap-3 py-8">
          <iconify-icon icon="ph:spinner-gap" class="text-5xl animate-spin text-[#E8634A]"></iconify-icon>
          <p class="text-sm text-gray-500 font-semibold">Đang tạo đơn hàng &amp; mã QR...</p>
        </div>

        <!-- Bước 2: Hiển thị QR từ BE -->
        <div v-else-if="qrData" class="flex flex-col items-center gap-4">
          <div class="p-2 bg-white rounded-2xl shadow-md border border-[#EDE8E3]">
            <img :src="qrData.vietQrUrl" alt="VietQR" class="w-56 h-56 rounded-xl object-contain"
              @error="qrImgError = true" />
            <p v-if="qrImgError" class="text-xs text-red-400 text-center mt-2">Không tải được ảnh QR. Kiểm tra cấu hình ngân hàng BE.</p>
          </div>

          <div class="text-center p-3 bg-[#FFF8F4] rounded-xl w-full">
            <div class="text-2xl font-black text-[#E8634A]">{{ formatPrice(qrData.tongTien) }}</div>
            <div class="text-xs text-gray-500 mt-1 font-semibold">Mã đơn: HD-POS-{{ qrData.donHangId }}</div>
          </div>

          <div class="flex items-center gap-2 text-sm text-green-600 font-semibold bg-green-50 px-4 py-2 rounded-xl w-full justify-center">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0"></span>
            Đang chờ xác nhận thanh toán...
          </div>

          <p class="text-xs text-gray-400 text-center">
            Cho khách quét mã QR bên trên để chuyển khoản. Sau khi tiền về, nhấn
            <strong class="text-green-600">"Đã nhận tiền"</strong> để hoàn tất đơn.
          </p>
        </div>

      </div>
      <template #footer>
        <el-button @click="cancelQR" :disabled="submitting" :loading="cancelling">Huỷ</el-button>
        <el-button v-if="!qrData" type="primary" :loading="submitting" @click="submitOrder('VIET_QR')"
          style="background-color: #E8634A; border-color: #E8634A;">
          <iconify-icon icon="ph:qr-code-duotone" class="mr-1 text-base"></iconify-icon>
          Tạo mã QR
        </el-button>
        <el-button v-else type="success" :loading="confirmingQR" @click="confirmQRPaid">
          <iconify-icon icon="ph:check-circle-duotone" class="mr-1 text-base"></iconify-icon>
          Đã nhận tiền
        </el-button>
      </template>
    </el-dialog>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- MODAL: Thành công                               -->
    <!-- ═══════════════════════════════════════════════ -->
    <el-dialog v-model="showSuccessModal" width="380px" center align-center :show-close="false">
      <div class="flex flex-col items-center gap-3 py-4">
        <div class="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <iconify-icon icon="ph:check-circle-duotone" class="text-6xl text-green-500"></iconify-icon>
        </div>
        <div class="text-xl font-black text-[#1E2A3B]">Thanh toán thành công!</div>
        <div class="text-sm text-gray-400">
          Đơn <strong>HD-POS-{{ successData?.donHangId }}</strong> đã hoàn tất
        </div>
        <div class="text-2xl font-black text-[#E8634A]">{{ formatPrice(successData?.tongTien) }}</div>
        <div class="text-xs text-gray-500 bg-[#FFF8F4] px-4 py-2 rounded-xl">
          {{ successData?.phuongThuc === 'TIEN_MAT' ? '💵 Tiền mặt' : '📱 VietQR / Chuyển khoản' }}
        </div>
      </div>
      <template #footer>
        <div class="flex gap-2">
          <el-button @click="doPrintBill" style="flex:1">
            <iconify-icon icon="ph:printer-duotone" class="mr-1"></iconify-icon>In hóa đơn
          </el-button>
          <el-button type="primary" @click="newOrder" style="background-color: #E8634A; border-color: #E8634A; flex:1">
            Tạo đơn mới
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- POPUP: Cộng điểm khách hàng (inline)            -->
    <!-- ═══════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="congdiem-modal">
        <div v-if="showCongDiem" class="fixed inset-0 z-50 flex items-center justify-center p-4"
             style="background:rgba(0,0,0,0.4);" @click.self="showCongDiem = false">
          <div class="w-full max-w-md rounded-[28px] bg-white shadow-2xl overflow-hidden">
            <div class="p-6 border-b border-[#FDF6EC]"
                 style="background:linear-gradient(135deg,#7A5C3A 0%,#9A7650 100%);">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
                  <iconify-icon icon="ph:star-duotone" class="text-2xl text-white"></iconify-icon>
                </div>
                <div>
                  <h2 class="text-base font-black text-white">Cộng điểm cho khách</h2>
                  <p class="text-xs text-white/70 mt-0.5">Đơn hàng #{{ congDiemDonHangId }}</p>
                </div>
                <button @click="showCongDiem = false"
                  class="ml-auto w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <iconify-icon icon="ph:x" class="text-white text-sm"></iconify-icon>
                </button>
              </div>
            </div>
            <div class="p-6 space-y-5">
              <div v-if="!congDiemKetQua">
                <p class="text-sm text-[#5C4428] font-semibold mb-1">Số điện thoại khách hàng</p>
                <p class="text-xs text-[#9A7650] mb-4">Nhập SĐT để tích điểm. Bỏ qua nếu khách không muốn.</p>
                <div class="flex gap-2">
                  <div class="flex-1 relative">
                    <iconify-icon icon="ph:phone-duotone"
                      class="absolute left-3 top-1/2 -translate-y-1/2 text-[#A68B5C] text-base"></iconify-icon>
                    <input v-model="congDiemSdt" type="tel" placeholder="0901 234 567"
                      @keyup.enter="doCongDiem"
                      class="w-full pl-9 pr-4 py-3 rounded-xl border border-[#EDE0CC] bg-[#FDF6EC] text-sm text-[#5C4428] outline-none focus:border-[#7A5C3A] focus:ring-2 focus:ring-[#7A5C3A]/10 transition-all" />
                  </div>
                  <button @click="doCongDiem" :disabled="congDiemLoading || !congDiemSdt.trim()"
                    class="px-5 py-3 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-50"
                    style="background:#7A5C3A;">
                    <iconify-icon v-if="congDiemLoading" icon="ph:circle-notch" class="animate-spin text-base"></iconify-icon>
                    <iconify-icon v-else icon="ph:magnifying-glass-bold" class="text-base"></iconify-icon>
                  </button>
                </div>
              </div>
              <div v-if="congDiemKetQua">
                <div v-if="congDiemKetQua.timThayKhach"
                  class="rounded-2xl bg-green-50 border border-green-200 p-5 text-center">
                  <div class="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <iconify-icon icon="ph:check-circle-duotone" class="text-4xl text-green-600"></iconify-icon>
                  </div>
                  <p class="text-base font-black text-green-700">{{ congDiemKetQua.tenKhach }}</p>
                  <div class="mt-3 flex items-center justify-center gap-2">
                    <span class="text-2xl font-black text-green-600">+{{ congDiemKetQua.diemDuocCong }}</span>
                    <span class="text-sm text-green-500 font-semibold">điểm</span>
                  </div>
                  <p class="text-xs text-green-500 mt-1">Tổng điểm: {{ congDiemKetQua.tongDiemMoi }} điểm</p>
                </div>
                <div v-else class="rounded-2xl bg-amber-50 border border-amber-200 p-5 text-center">
                  <iconify-icon icon="ph:user-circle-dashed-duotone" class="text-5xl text-amber-500 mb-2"></iconify-icon>
                  <p class="text-sm font-bold text-amber-700">Không tìm thấy tài khoản</p>
                  <p class="text-xs text-amber-500 mt-1">{{ congDiemKetQua.thongBao }}</p>
                  <button @click="congDiemKetQua = null; congDiemSdt = ''"
                    class="mt-3 text-xs font-bold text-amber-700 underline">Thử lại</button>
                </div>
              </div>
              <button @click="showCongDiem = false"
                class="w-full py-3 rounded-xl border border-[#EDE0CC] text-sm font-bold text-[#9A7650] hover:bg-[#FDF6EC] transition-colors">
                {{ congDiemKetQua?.timThayKhach ? 'Hoàn tất' : 'Bỏ qua, không cộng điểm' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import apiClient from '@/services/apiService'
import { productService } from '@/services/productService'
import { formatPrice } from '@/utils/format'

// ─── STATE ───────────────────────────────────────────────────────────────────
const allProducts     = ref([])
const loadingProducts = ref(false)
const productError    = ref(null)

const search     = ref('')
const activeTab  = ref('all')
const cart       = ref([])
const orderNo    = ref(Math.floor(Math.random() * 9000) + 1000)
const emailKhach = ref('')
const ghiChu     = ref('')
const soTheRung  = ref('')

// ─── MÃ GIẢM GIÁ (voucher) ──────────────────────────────────────────────────
// TODO: khi BE có API kiểm tra/áp mã giảm giá thật, thay danh sách giả lập này bằng lệnh gọi API
const MOCK_VOUCHERS = {
  GIAM10:  { loai: 'PHAN_TRAM', giaTri: 10,    toiThieu: 100000, moTa: 'Giảm 10% hóa đơn' },
  GIAM20K: { loai: 'TIEN_MAT',  giaTri: 20000, toiThieu: 150000, moTa: 'Giảm 20.000đ' },
  SALE50K: { loai: 'TIEN_MAT',  giaTri: 50000, toiThieu: 300000, moTa: 'Giảm 50.000đ cho hóa đơn từ 300k' },
}
const voucherCode    = ref('')
const appliedVoucher = ref(null)  // { code, loai, giaTri, moTa }
const voucherError   = ref('')

function applyVoucher() {
  const code = voucherCode.value.trim().toUpperCase()
  voucherError.value = ''
  if (!code) return

  const v = MOCK_VOUCHERS[code]
  if (!v) {
    voucherError.value = 'Mã giảm giá không tồn tại hoặc đã hết hạn.'
    return
  }
  if (subtotal.value < v.toiThieu) {
    voucherError.value = `Đơn hàng cần tối thiểu ${formatPrice(v.toiThieu)} để dùng mã này.`
    return
  }
  appliedVoucher.value = { code, ...v }
  voucherCode.value = ''
  ElMessage.success(`Đã áp dụng mã "${code}": ${v.moTa}`)
}

function removeVoucher() {
  appliedVoucher.value = null
  voucherError.value = ''
}

const discountAmount = computed(() => {
  if (!appliedVoucher.value) return 0
  const v = appliedVoucher.value
  return v.loai === 'PHAN_TRAM'
    ? Math.round(subtotal.value * v.giaTri / 100)
    : Math.min(v.giaTri, subtotal.value)
})

const finalTotal = computed(() => Math.max(0, subtotal.value - discountAmount.value))

// ─── QUÉT MÃ VẠCH ───────────────────────────────────────────────────────────
const barcodeInput    = ref('')
const barcodeInputRef = ref(null)

// TODO: khi BE có trường mã vạch thật (vd. p.maVach) thì dùng trực tiếp, bỏ hàm giả lập này đi
function maVachOf(p) {
  return '89999' + String(p.id).padStart(8, '0')
}

function focusBarcodeInput() {
  nextTick(() => barcodeInputRef.value?.focus())
}

function handleBarcodeScan() {
  const code = barcodeInput.value.trim()
  if (!code) return

  // Cho phép quét mã vạch thật (giả lập) hoặc gõ thẳng ID sản phẩm để tiện test khi chưa có máy quét
  const found = allProducts.value.find(p => maVachOf(p) === code || String(p.id) === code)

  if (!found) {
    ElMessage.error(`Không tìm thấy sản phẩm với mã: ${code}`)
  } else if (found.soLuongTon === 0) {
    ElMessage.warning(`"${found.tenSanPham}" đã hết hàng!`)
  } else {
    addToCart(found)
    ElMessage.success(`Đã thêm "${found.tenSanPham}" vào giỏ`)
  }
  barcodeInput.value = ''
  focusBarcodeInput()
}

// ─── TREO BILL ───────────────────────────────────────────────────────────────
const heldBills = ref([])  // { id, label, cart, ghiChu, emailKhach, orderNo, createdAt }

function billTotal(bill) {
  return bill.cart.reduce((s, i) => s + Number(i.donGia) * i.qty, 0)
}

async function treoBill() {
  if (cart.value.length === 0) {
    ElMessage.warning('Giỏ hàng đang trống, không có gì để treo.')
    return
  }
  try {
    const { value: label } = await ElMessageBox.prompt(
      'Đặt tên cho bill để dễ nhận biết khi mở lại (vd: "Bàn 5", "Chị Lan")',
      'Treo bill',
      {
        confirmButtonText: 'Treo bill',
        cancelButtonText: 'Huỷ',
        inputValue: `Khách ${heldBills.value.length + 1}`,
        inputValidator: (v) => !!v?.trim() || 'Vui lòng nhập tên bill',
      }
    )
    heldBills.value.push({
      id: Date.now(),
      label: label.trim(),
      cart: cart.value,
      ghiChu: ghiChu.value,
      emailKhach: emailKhach.value,
      orderNo: orderNo.value,
      soTheRung: soTheRung.value,
      appliedVoucher: appliedVoucher.value,
      createdAt: new Date(),
    })
    // Mở bill trắng mới để phục vụ khách khác
    cart.value = []
    ghiChu.value = ''
    emailKhach.value = ''
    soTheRung.value = ''
    appliedVoucher.value = null
    voucherError.value = ''
    orderNo.value = Math.floor(Math.random() * 9000) + 1000
    ElMessage.success(`Đã treo bill "${label.trim()}". Bạn có thể phục vụ khách khác ngay bây giờ.`)
  } catch {
    // Người dùng bấm Huỷ trên hộp thoại đặt tên -> không làm gì cả
  }
}

async function resumeHeldBill(bill) {
  const swapIn = () => {
    heldBills.value = heldBills.value.filter(b => b.id !== bill.id)
    cart.value = bill.cart
    ghiChu.value = bill.ghiChu
    emailKhach.value = bill.emailKhach
    orderNo.value = bill.orderNo
    soTheRung.value = bill.soTheRung || ''
    appliedVoucher.value = bill.appliedVoucher || null
    voucherError.value = ''
    ElMessage.success(`Đã mở lại bill "${bill.label}"`)
  }

  if (cart.value.length === 0) {
    swapIn()
    return
  }

  try {
    await ElMessageBox.confirm(
      'Giỏ hàng hiện tại chưa thanh toán. Bạn có muốn treo bill hiện tại lại trước khi mở bill khác không?',
      'Giỏ hàng chưa trống',
      { confirmButtonText: 'Treo bill hiện tại rồi mở', cancelButtonText: 'Huỷ', type: 'warning' }
    )
    await treoBillSilently()
    swapIn()
  } catch {
    // Huỷ -> giữ nguyên, không chuyển bill
  }
}

// Treo nhanh không hỏi tên, dùng khi resume bill khác mà giỏ hiện tại còn hàng
async function treoBillSilently() {
  if (cart.value.length === 0) return
  heldBills.value.push({
    id: Date.now(),
    label: `Khách ${heldBills.value.length + 1}`,
    cart: cart.value,
    ghiChu: ghiChu.value,
    emailKhach: emailKhach.value,
    orderNo: orderNo.value,
    soTheRung: soTheRung.value,
    appliedVoucher: appliedVoucher.value,
    createdAt: new Date(),
  })
}

async function discardHeldBill(bill) {
  try {
    await ElMessageBox.confirm(
      `Xoá bill "${bill.label}" đang treo? Hành động này không thể hoàn tác.`,
      'Xác nhận xoá bill',
      { confirmButtonText: 'Xoá', cancelButtonText: 'Huỷ', type: 'warning' }
    )
    heldBills.value = heldBills.value.filter(b => b.id !== bill.id)
    ElMessage.info(`Đã xoá bill "${bill.label}"`)
  } catch {
    // Huỷ -> không xoá
  }
}

const showCashModal    = ref(false)
const showQRModal      = ref(false)
const cancelling       = ref(false)
const showSuccessModal = ref(false)
const showCongDiem       = ref(false)
const congDiemDonHangId  = ref(null)
const congDiemSdt        = ref('')
const congDiemLoading    = ref(false)
const congDiemKetQua     = ref(null)

// Reset khi mở popup
watch(showCongDiem, (val) => {
  if (val) { congDiemSdt.value = ''; congDiemKetQua.value = null }
})

async function doCongDiem() {
  if (!congDiemSdt.value.trim()) return
  congDiemLoading.value = true
  try {
    const res = await apiClient.post('/api/v1/loyalty/pos/cong-diem', {
      soDienThoai: congDiemSdt.value.trim(),
      donHangId: congDiemDonHangId.value,
    })
    congDiemKetQua.value = res.data
  } catch (e) {
    console.error(e)
    congDiemKetQua.value = {
      timThayKhach: false,
      thongBao: e.response?.data || 'Lỗi kết nối server.'
    }
  } finally {
    congDiemLoading.value = false
  }
}
const cashGiven        = ref('')
const change           = ref(0)
const submitting       = ref(false)
const confirmingQR     = ref(false)
const qrData           = ref(null)       // Response từ API tạo đơn QR
const qrImgError       = ref(false)
const lastReceipt      = ref(null)       // receiptText từ BE để in sau
const lastReceiptBuzzer = ref('')        // Số thẻ rung tại thời điểm chốt đơn, để hiện khi in lại
const successData      = ref(null)       // Dữ liệu modal thành công

// ─── TABS TỪ DANH MỤC THỰC ──────────────────────────────────────────────────
const categories = computed(() => {
  const map = new Map()
  allProducts.value.forEach(p => {
    if (p.danhMucId && p.tenDanhMuc) map.set(p.danhMucId, p.tenDanhMuc)
  })
  return Array.from(map.entries()).map(([id, label]) => ({ key: String(id), label }))
})

const tabs = computed(() => [
  { key: 'all', label: 'Tất cả', count: allProducts.value.length },
  ...categories.value.map(c => ({
    key: c.key,
    label: c.label,
    count: allProducts.value.filter(p => String(p.danhMucId) === c.key).length
  }))
])

// ─── LOAD SẢN PHẨM ──────────────────────────────────────────────────────────
async function loadProducts() {
  loadingProducts.value = true
  productError.value = null
  try {
    // GET /api/v1/products → chỉ trả DANG_BAN
    const res = await productService.getAllProducts()
    allProducts.value = res.data || []
  } catch (err) {
    console.error('Lỗi tải sản phẩm:', err)
    productError.value = err.response?.data?.message || 'Không thể tải danh sách sản phẩm!'
  } finally {
    loadingProducts.value = false
  }
}

onMounted(() => { loadProducts(); focusBarcodeInput() })

// ─── FILTER SẢN PHẨM ────────────────────────────────────────────────────────
const filteredProducts = computed(() =>
  allProducts.value.filter(p => {
    const matchTab    = activeTab.value === 'all' || String(p.danhMucId) === activeTab.value
    const matchSearch = p.tenSanPham.toLowerCase().includes(search.value.toLowerCase())
    return matchTab && matchSearch
  })
)

// ─── GIỎ HÀNG ────────────────────────────────────────────────────────────────
const totalQty = computed(() => cart.value.reduce((s, i) => s + i.qty, 0))
const subtotal = computed(() => cart.value.reduce((s, i) => s + Number(i.donGia) * i.qty, 0))

function addToCart(p) {
  if (p.soLuongTon === 0) return
  const existing = cart.value.find(i => i.id === p.id)
  if (existing) {
    if (existing.qty < p.soLuongTon) existing.qty++
    else ElMessage.warning(`"${p.tenSanPham}" chỉ còn ${p.soLuongTon} trong kho!`)
  } else {
    cart.value.push({ ...p, qty: 1 })
  }
}
function increase(item) {
  if (item.qty < item.soLuongTon) item.qty++
  else ElMessage.warning(`Chỉ còn ${item.soLuongTon} sản phẩm!`)
}
function decrease(item) { item.qty > 1 ? item.qty-- : removeItem(item) }
function removeItem(item) { cart.value = cart.value.filter(i => i.id !== item.id) }
function clearCart() { cart.value = []; ghiChu.value = ''; emailKhach.value = ''; soTheRung.value = ''; appliedVoucher.value = null; voucherError.value = ''; voucherCode.value = '' }

// ─── MỞ MODAL ────────────────────────────────────────────────────────────────
function openPayment(type) {
  if (!cart.value.length) return
  cashGiven.value = ''
  change.value = 0
  ghiChu.value = ''
  qrData.value = null
  qrImgError.value = false
  if (type === 'cash') showCashModal.value = true
  else showQRModal.value = true
}

function calcChange() {
  change.value = Number(cashGiven.value) - finalTotal.value
}

async function cancelQR() {
  if (submitting.value || cancelling.value || confirmingQR.value) return

  // Nếu đã tạo đơn lên server (đã trừ kho, đang chờ khách quét) → gọi API hủy thật
  if (qrData.value?.donHangId) {
    cancelling.value = true
    try {
      await apiClient.delete(`/api/v1/pos/orders/${qrData.value.donHangId}/cancel`)
      ElMessage.info('Đã hủy hóa đơn và hoàn lại tồn kho.')
      await loadProducts()
    } catch (err) {
      console.error('Lỗi hủy hóa đơn POS:', err)
      const msg = err.response?.data
      ElMessage.error(typeof msg === 'string' ? msg : (msg?.message || 'Hủy hóa đơn thất bại, vui lòng kiểm tra lại!'))
      cancelling.value = false
      return // Hủy thất bại thì không đóng modal, để nhân viên thử lại
    }
    cancelling.value = false
  }

  showQRModal.value = false
  qrData.value = null
}

// Bắt sự kiện đóng dialog (click ra ngoài / nút X / phím Esc) → đi qua cùng luồng hủy ở trên
function handleCloseQRModal(done) {
  cancelQR().then(() => {
    if (!showQRModal.value) done()
  })
}

// ─── GỌI API TẠO ĐƠN POS ────────────────────────────────────────────────────
// POST /api/v1/pos/orders  (cần Bearer Token của nhân viên)
// Request body: { emailKhachHang, ghiChu, items: [{sanPhamId, soLuong}] }
// Response:     { donHangId, tongTien, trangThai, nguonDon, vietQrUrl, receiptText }
async function submitOrder(phuongThuc) {
  submitting.value = true
  try {
    const payload = {
      emailKhachHang: emailKhach.value.trim() || null,
      ghiChu: ghiChu.value.trim() || null,
      items: cart.value.map(i => ({
        sanPhamId: i.id,
        soLuong: i.qty
      })),
      phuongThucThanhToan: phuongThuc
    }

    const res = await apiClient.post('/api/v1/pos/orders', payload)
    const data = res.data  // PosOrderDto.Response

    // Lưu receiptText để in sau
    lastReceipt.value = data.receiptText
    lastReceiptBuzzer.value = soTheRung.value.trim()

    if (phuongThuc === 'TIEN_MAT') {
      showCashModal.value = false
      successData.value = { ...data, phuongThuc }
      showSuccessModal.value = true
      // Mở popup cộng điểm
      congDiemDonHangId.value = data.donHangId
      showCongDiem.value = true
      // Làm mới tồn kho và xóa giỏ
      await loadProducts()
      cart.value = []
    } else {
      // VietQR: lưu kết quả để hiển thị mã QR, không đóng modal
      qrData.value = { ...data, phuongThuc }
    }

    ElMessage.success('Tạo đơn hàng thành công!')

  } catch (err) {
    console.error('Lỗi tạo đơn POS:', err)
    const msg = err.response?.data
    ElMessage.error(typeof msg === 'string' ? msg : (msg?.message || 'Tạo đơn hàng thất bại!'))
  } finally {
    submitting.value = false
  }
}

// ─── XÁC NHẬN ĐÃ NHẬN TIỀN QR ───────────────────────────────────────────────
async function confirmQRPaid() {
  if (!qrData.value?.donHangId || confirmingQR.value) return
  confirmingQR.value = true
  try {
    // Đơn mua tại quầy (POS) -> xác nhận xong là hoàn tất luôn, không qua sản xuất/giao hàng
    await apiClient.put(`/api/v1/pos/orders/${qrData.value.donHangId}/confirm-paid`)

    showQRModal.value = false
    successData.value = { ...qrData.value, phuongThuc: 'VIET_QR' }
    showSuccessModal.value = true
    // Mở popup cộng điểm
    congDiemDonHangId.value = qrData.value.donHangId
    showCongDiem.value = true
    await loadProducts()
    cart.value = []
    qrData.value = null
  } catch (err) {
    console.error('Lỗi xác nhận thanh toán QR:', err)
    const msg = err.response?.data
    ElMessage.error(typeof msg === 'string' ? msg : (msg?.message || 'Xác nhận thanh toán thất bại, vui lòng thử lại!'))
  } finally {
    confirmingQR.value = false
  }
}

// ─── ĐƠN MỚI ─────────────────────────────────────────────────────────────────
function newOrder() {
  showSuccessModal.value = false
  cart.value = []
  orderNo.value = Math.floor(Math.random() * 9000) + 1000
  cashGiven.value = ''
  change.value = 0
  ghiChu.value = ''
  emailKhach.value = ''
  soTheRung.value = ''
  appliedVoucher.value = null
  voucherError.value = ''
  voucherCode.value = ''
  successData.value = null
  // KHÔNG xóa lastReceipt để vẫn có thể in lại
}

// ─── IN HÓA ĐƠN NHIỆT ────────────────────────────────────────────────────────
function doPrintBill() {
  if (lastReceipt.value) {
    printReceiptText(lastReceipt.value)
  }
}

function printReceiptText(text) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  // Chèn số thẻ rung nổi bật ngay đầu hóa đơn để nhân viên gọi khách (chỉ hiển thị ở bản in, không đổi receiptText gốc từ BE)
  const buzzerBlock = lastReceiptBuzzer.value
    ? `================================\nSO THE RUNG: ${lastReceiptBuzzer.value.toUpperCase()}\n================================\n\n`
    : ''
  const html = `
    <html><head>
      <title>Hóa đơn POS</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: 'Courier New', monospace; font-size:12px; width:80mm; padding:4mm; white-space:pre; }
        .buzzer { font-size:16px; font-weight:bold; text-align:center; }
        @media print { @page { size:80mm auto; margin:0; } body { width:80mm; } }
      </style>
    </head><body>${buzzerBlock ? `<div class="buzzer">${buzzerBlock}</div>` : ''}${escaped}</body></html>`
  const w = window.open('', '_blank', 'width=340,height=600')
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => { w.print(); w.close() }, 300)
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
function handleImgError(e) {
  e.target.style.display = 'none'
}
</script>

<style scoped>
.congdiem-modal-enter-active, .congdiem-modal-leave-active { transition: all .3s ease; }
.congdiem-modal-enter-from, .congdiem-modal-leave-to { opacity: 0; }
.congdiem-modal-enter-from > div, .congdiem-modal-leave-to > div { transform: scale(0.95); }
</style>