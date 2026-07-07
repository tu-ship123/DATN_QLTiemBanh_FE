<template>
  <section class="space-y-6">

    <!-- ── HEADER ── -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 class="font-display font-black text-2xl" style="color:#5C4428">Quản lý Đánh giá</h1>
        <p class="text-sm text-muted mt-0.5">Phản hồi và kiểm duyệt đánh giá của khách hàng</p>
      </div>
      <button class="btn-secondary" @click="loadAll" :disabled="loading">
        <iconify-icon
          :icon="loading ? 'ph:spinner-gap' : 'ph:arrows-clockwise-duotone'"
          :class="loading ? 'animate-spin' : ''"
          class="text-base mr-1"
        />
        Làm mới
      </button>
    </div>

    <!-- ── STATS ── -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4" v-if="stats">
      <div class="data-card flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
          <iconify-icon icon="ph:star-duotone" class="text-2xl" style="color:#F59E0B" />
        </div>
        <div>
          <p class="text-xs text-muted">Điểm TB</p>
          <p class="text-2xl font-bold text-[#7A5C3A]">{{ stats.trungBinhSao }}</p>
        </div>
      </div>
      <div class="data-card flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
          <iconify-icon icon="ph:chat-teardrop-dots-duotone" class="text-2xl" style="color:#3B82F6" />
        </div>
        <div>
          <p class="text-xs text-muted">Tổng đánh giá</p>
          <p class="text-2xl font-bold text-slate-800">{{ stats.tong }}</p>
        </div>
      </div>
      <div class="data-card flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
        @click="filterTraLoi = 'chua'; filterTrangThai = null">
        <div class="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
          <iconify-icon icon="ph:clock-countdown-duotone" class="text-2xl" style="color:#F97316" />
        </div>
        <div>
          <p class="text-xs text-muted">Chưa trả lời</p>
          <p class="text-2xl font-bold text-orange-500">{{ stats.chuaTraLoi }}</p>
        </div>
      </div>
      <div class="data-card flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
        @click="filterTrangThai = true; filterTraLoi = ''">
        <div class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
          <iconify-icon icon="ph:eye-slash-duotone" class="text-2xl" style="color:#6B7280" />
        </div>
        <div>
          <p class="text-xs text-muted">Đang ẩn</p>
          <p class="text-2xl font-bold text-slate-500">{{ stats.biAn }}</p>
        </div>
      </div>
    </div>

    <!-- ── PHÂN PHỐI SAO ── -->
    <div class="data-card" v-if="stats">
      <p class="text-sm font-semibold text-slate-700 mb-3">Phân phối đánh giá</p>
      <div class="space-y-2">
        <div v-for="n in [5,4,3,2,1]" :key="n"
          class="flex items-center gap-3 cursor-pointer group"
          @click="filterSao = filterSao === n ? null : n">
          <span class="text-xs text-muted w-8 text-right font-semibold"
            :class="filterSao === n ? 'text-amber-500' : ''">{{ n }}⭐</span>
          <div class="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div class="h-2.5 rounded-full bg-amber-400 transition-all duration-500 group-hover:bg-amber-500"
              :style="{ width: stats.tong ? (stats[`sao${n}`] / stats.tong * 100) + '%' : '0%' }">
            </div>
          </div>
          <span class="text-xs font-bold w-6 text-right"
            :class="filterSao === n ? 'text-amber-600' : 'text-muted'">{{ stats[`sao${n}`] }}</span>
        </div>
      </div>
    </div>

    <!-- ── BỘ LỌC ── -->
    <div class="data-card flex flex-wrap items-center gap-3">
      <el-input v-model="search" placeholder="Tìm tên khách hoặc sản phẩm..."
        prefix-icon="Search" clearable style="width:260px" />

      <el-select v-model="filterSao" placeholder="Tất cả sao" clearable style="width:140px">
        <el-option v-for="n in [5,4,3,2,1]" :key="n" :label="`${n} sao`" :value="n" />
      </el-select>

      <el-select v-model="filterTrangThai" placeholder="Hiển thị" clearable style="width:160px">
        <el-option label="Đang hiển thị" :value="false" />
        <el-option label="Đang ẩn"       :value="true"  />
      </el-select>

      <el-select v-model="filterTraLoi" placeholder="Phản hồi" clearable style="width:150px">
        <el-option label="Đã trả lời"   value="da"   />
        <el-option label="Chưa trả lời" value="chua" />
      </el-select>

      <button v-if="hasFilters" class="btn-secondary text-xs" @click="clearFilters">
        <iconify-icon icon="ph:x-bold" class="mr-1" />
        Xóa bộ lọc
      </button>

      <span class="text-xs text-muted ml-auto">{{ filtered.length }} kết quả</span>
    </div>

    <!-- ── DANH SÁCH ĐÁNH GIÁ ── -->
    <div v-loading="loading" class="space-y-4">
      <div v-if="!loading && filtered.length === 0"
        class="data-card text-center py-16 text-muted">
        <p class="text-5xl mb-3">⭐</p>
        <p class="font-semibold">Không có đánh giá nào</p>
        <p class="text-sm mt-1">Thay đổi bộ lọc để xem thêm</p>
      </div>

      <div v-for="dg in filtered" :key="dg.id"
        class="data-card transition-all border-2"
        :class="[
          dg.biAn ? 'opacity-60 border-dashed border-slate-200' : 'border-transparent',
          dg.phanHoiCuaTiem ? '' : 'border-l-4 border-l-orange-300'
        ]"
        style="border-left-width: 4px">

        <div class="flex gap-4">
          <!-- Ảnh sản phẩm -->
          <img :src="dg.anhSanPham || 'https://placehold.co/80x80?text=🎂'"
            class="w-16 h-16 rounded-2xl object-cover shrink-0 bg-slate-100"
            @error="$event.target.src = 'https://placehold.co/80x80?text=🎂'" />

          <div class="flex-1 min-w-0">
            <!-- Top row -->
            <div class="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p class="font-semibold text-slate-800 text-sm">{{ dg.tenKhachHang }}</p>
                <p class="text-xs text-muted">{{ dg.tenSanPham }} · Đơn #{{ dg.donHangId }}</p>
              </div>
              <div class="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                <span v-if="dg.biAn"
                  class="badge flex items-center gap-1"
                  style="background:#F1F5F9;color:#64748B">
                  <iconify-icon icon="ph:eye-slash-duotone" class="text-xs" />Đang ẩn
                </span>
                <span v-if="!dg.phanHoiCuaTiem"
                  class="badge badge-warning flex items-center gap-1">
                  <iconify-icon icon="ph:clock-duotone" class="text-xs" />Chưa trả lời
                </span>
                <span v-else
                  class="badge badge-success flex items-center gap-1">
                  <iconify-icon icon="ph:check-circle-duotone" class="text-xs" />Đã trả lời
                </span>
                <span class="text-xs text-muted">{{ formatDate(dg.ngayTao) }}</span>
              </div>
            </div>

            <!-- Sao -->
            <div class="flex gap-0.5 mt-1.5">
              <span v-for="i in 5" :key="i"
                class="text-lg"
                :class="i <= dg.soSao ? 'text-amber-400' : 'text-slate-200'">★</span>
            </div>

            <!-- Nội dung -->
            <p v-if="dg.noiDung" class="text-sm text-slate-700 mt-2 leading-relaxed">{{ dg.noiDung }}</p>
            <p v-else class="text-xs text-muted italic mt-2">Không có nội dung</p>

            <!-- Phản hồi của tiệm -->
            <div v-if="dg.phanHoiCuaTiem"
              class="mt-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p class="text-xs font-semibold text-[#7A5C3A] mb-1 flex items-center gap-1">
                <iconify-icon icon="ph:chat-circle-duotone" /> Phản hồi từ Chocopine
              </p>
              <p class="text-sm text-slate-700">{{ dg.phanHoiCuaTiem }}</p>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 mt-3 flex-wrap">
              <!-- Nút Trả lời / Sửa phản hồi -->
              <button
                class="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all"
                :class="dg.phanHoiCuaTiem
                  ? 'bg-[#FDF6EC] text-[#7A5C3A] hover:bg-[#7A5C3A] hover:text-white'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200'"
                @click="openReply(dg)">
                <iconify-icon :icon="dg.phanHoiCuaTiem ? 'ph:pencil-simple-duotone' : 'ph:chat-circle-duotone'" class="text-sm" />
                {{ dg.phanHoiCuaTiem ? 'Sửa phản hồi' : 'Trả lời ngay' }}
              </button>

              <!-- Nút Ẩn / Hiện vi phạm -->
              <button
                class="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all border"
                :class="dg.biAn
                  ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-600 hover:text-white'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-600 hover:text-white'"
                :disabled="togglingId === dg.id"
                @click="toggleHide(dg)">
                <iconify-icon
                  :icon="togglingId === dg.id
                    ? 'ph:spinner-gap'
                    : (dg.biAn ? 'ph:eye-duotone' : 'ph:eye-slash-duotone')"
                  :class="togglingId === dg.id ? 'animate-spin' : ''"
                  class="text-sm"
                />
                {{ dg.biAn ? 'Hiện lại' : 'Ẩn vi phạm' }}
              </button>

              <!-- Nút Xóa (chỉ Admin) -->
              <button v-if="isAdmin"
                class="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl text-red-400 hover:text-white hover:bg-red-500 transition-all border border-transparent hover:border-red-500"
                @click="confirmDelete(dg)">
                <iconify-icon icon="ph:trash-duotone" class="text-sm" /> Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── DIALOG PHẢN HỒI ── -->
    <el-dialog v-model="replyDialog" title="Phản hồi đánh giá" width="520px" @closed="clearReplyForm">
      <!-- Preview đánh giá -->
      <div v-if="replyTarget" class="mb-4 bg-slate-50 rounded-xl p-4 text-sm text-slate-700 border border-slate-200">
        <div class="flex items-start gap-3">
          <div>
            <div class="flex gap-0.5 mb-1">
              <span v-for="i in 5" :key="i"
                class="text-base"
                :class="i <= replyTarget.soSao ? 'text-amber-400' : 'text-slate-200'">★</span>
            </div>
            <p class="font-semibold text-sm">{{ replyTarget.tenKhachHang }}</p>
            <p class="text-muted text-xs mt-0.5">{{ replyTarget.tenSanPham }}</p>
            <p class="text-slate-600 text-sm mt-1.5 leading-relaxed">{{ replyTarget.noiDung || 'Không có nội dung' }}</p>
          </div>
        </div>
      </div>

      <!-- Phản hồi hiện tại (nếu có) -->
      <div v-if="replyTarget?.phanHoiCuaTiem" class="mb-3 bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm">
        <p class="text-xs font-semibold text-amber-700 mb-1">Phản hồi hiện tại:</p>
        <p class="text-slate-700">{{ replyTarget.phanHoiCuaTiem }}</p>
      </div>

      <!-- Textarea phản hồi -->
      <div class="space-y-2">
        <label class="text-sm font-semibold text-slate-700">
          {{ replyTarget?.phanHoiCuaTiem ? 'Cập nhật phản hồi' : 'Viết phản hồi' }}
        </label>
        <el-input
          v-model="replyText"
          type="textarea"
          :rows="4"
          placeholder="Cảm ơn bạn đã đánh giá! Chúng tôi rất vui khi..."
          :maxlength="500"
          show-word-limit
        />
        <!-- Quick templates -->
        <div class="flex flex-wrap gap-2 mt-2">
          <p class="text-xs text-muted w-full">Mẫu nhanh:</p>
          <button
            v-for="tmpl in replyTemplates" :key="tmpl.label"
            class="text-xs px-2.5 py-1 rounded-lg bg-[#FDF6EC] text-[#7A5C3A] hover:bg-[#7A5C3A] hover:text-white transition-all border border-[#EDE0CC]"
            @click="replyText = tmpl.text">
            {{ tmpl.label }}
          </button>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between items-center">
          <button v-if="replyTarget?.phanHoiCuaTiem"
            class="text-sm text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
            @click="deleteReply">
            <iconify-icon icon="ph:trash-duotone" /> Xóa phản hồi
          </button>
          <div v-else></div>
          <div class="flex gap-2">
            <el-button @click="replyDialog = false">Huỷ</el-button>
            <el-button type="primary" :loading="saving"
              :style="{ background: '#7A5C3A', borderColor: '#7A5C3A' }"
              @click="submitReply">
              {{ replyTarget?.phanHoiCuaTiem ? 'Cập nhật phản hồi' : 'Gửi phản hồi' }}
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- ── DIALOG XÁC NHẬN ẨN ── -->
    <el-dialog v-model="hideConfirmDialog" title="Ẩn đánh giá vi phạm" width="420px">
      <div class="flex gap-3 items-start">
        <div class="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
          <iconify-icon icon="ph:eye-slash-duotone" class="text-2xl text-orange-500" />
        </div>
        <div>
          <p class="font-semibold text-slate-800">Ẩn đánh giá này?</p>
          <p class="text-sm text-muted mt-1">
            Đánh giá sẽ bị ẩn khỏi trang sản phẩm công khai nhưng vẫn lưu trong hệ thống.
            Bạn có thể hiện lại bất cứ lúc nào.
          </p>
          <div v-if="hideTarget" class="mt-3 p-3 bg-slate-50 rounded-xl text-sm">
            <p class="font-medium text-slate-700">{{ hideTarget.tenKhachHang }}</p>
            <p class="text-slate-500 text-xs mt-0.5">{{ hideTarget.noiDung || 'Không có nội dung' }}</p>
          </div>
          <label class="mt-3 block">
            <span class="text-xs font-semibold text-muted uppercase tracking-wider">Lý do ẩn (tuỳ chọn)</span>
            <el-input
              v-model="hideReason"
              type="textarea"
              :rows="2"
              placeholder="VD: Ngôn từ không phù hợp, spam..."
              class="mt-1"
              size="small"
            />
          </label>
        </div>
      </div>
      <template #footer>
        <el-button @click="hideConfirmDialog = false">Huỷ</el-button>
        <el-button type="warning" :loading="togglingId !== null" @click="doToggleHide">
          <iconify-icon icon="ph:eye-slash-duotone" class="mr-1" />
          Xác nhận ẩn
        </el-button>
      </template>
    </el-dialog>

  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '../stores/authStore'
import apiClient from '../services/apiService'

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.user?.role === 'ROLE_ADMIN' || authStore.userRole === 'ROLE_ADMIN')

// ── State ─────────────────────────────────────────────────────────────────────
const reviews        = ref([])
const stats          = ref(null)
const loading        = ref(false)
const saving         = ref(false)
const togglingId     = ref(null)

const search          = ref('')
const filterSao       = ref(null)
const filterTrangThai = ref(null)
const filterTraLoi    = ref('')

// Dialog phản hồi
const replyDialog  = ref(false)
const replyTarget  = ref(null)
const replyText    = ref('')

// Dialog xác nhận ẩn
const hideConfirmDialog = ref(false)
const hideTarget        = ref(null)
const hideReason        = ref('')

// ── Mẫu phản hồi nhanh ────────────────────────────────────────────────────────
const replyTemplates = [
  { label: '😊 Cảm ơn 5⭐', text: 'Cảm ơn bạn rất nhiều vì đánh giá 5 sao! Chúng tôi rất vui khi biết bạn hài lòng với sản phẩm. Hẹn gặp lại bạn lần sau!' },
  { label: '🙏 Xin lỗi', text: 'Xin lỗi vì trải nghiệm chưa được tốt! Chúng tôi đã ghi nhận phản hồi của bạn và sẽ cải thiện ngay. Nếu cần hỗ trợ, vui lòng liên hệ chúng tôi.' },
  { label: '🎂 Lời mời', text: 'Cảm ơn bạn đã ủng hộ Chocopine! Lần sau ghé thăm, bạn sẽ được tặng ưu đãi đặc biệt. Hẹn gặp lại!' },
]

// ── Computed ──────────────────────────────────────────────────────────────────
const hasFilters = computed(() =>
  search.value.trim() || filterSao.value != null || filterTrangThai.value != null || filterTraLoi.value
)

// ── Load data ─────────────────────────────────────────────────────────────────
async function loadAll() {
  loading.value = true
  try {
    const [revRes, statRes] = await Promise.all([
      apiClient.get('/api/v1/admin/reviews'),
      apiClient.get('/api/v1/admin/reviews/stats'),
    ])
    reviews.value = revRes.data
    stats.value   = statRes.data
  } catch {
    ElMessage.error('Không thể tải danh sách đánh giá')
  } finally {
    loading.value = false
  }
}

onMounted(loadAll)

// ── Filter ────────────────────────────────────────────────────────────────────
const filtered = computed(() => {
  let list = reviews.value

  if (search.value.trim()) {
    const kw = search.value.toLowerCase()
    list = list.filter(d =>
      d.tenKhachHang?.toLowerCase().includes(kw) ||
      d.tenSanPham?.toLowerCase().includes(kw)
    )
  }

  if (filterSao.value != null)
    list = list.filter(d => d.soSao === filterSao.value)

  if (filterTrangThai.value != null)
    list = list.filter(d => d.biAn === filterTrangThai.value)

  if (filterTraLoi.value === 'da')
    list = list.filter(d => d.phanHoiCuaTiem)
  else if (filterTraLoi.value === 'chua')
    list = list.filter(d => !d.phanHoiCuaTiem)

  return list
})

function clearFilters() {
  search.value = ''
  filterSao.value = null
  filterTrangThai.value = null
  filterTraLoi.value = ''
}

// ── Phản hồi ─────────────────────────────────────────────────────────────────
function openReply(dg) {
  replyTarget.value = dg
  replyText.value   = dg.phanHoiCuaTiem || ''
  replyDialog.value = true
}

function clearReplyForm() {
  replyTarget.value = null
  replyText.value   = ''
}

async function submitReply() {
  if (!replyText.value.trim()) {
    ElMessage.warning('Vui lòng nhập nội dung phản hồi')
    return
  }
  saving.value = true
  try {
    const { data } = await apiClient.put(
      `/api/v1/admin/reviews/${replyTarget.value.id}/reply`,
      { phanHoi: replyText.value }
    )
    const idx = reviews.value.findIndex(d => d.id === data.id)
    if (idx !== -1) reviews.value[idx] = data

    // reload stats
    const statRes = await apiClient.get('/api/v1/admin/reviews/stats')
    stats.value = statRes.data

    ElMessage.success(replyTarget.value.phanHoiCuaTiem ? 'Đã cập nhật phản hồi!' : 'Đã gửi phản hồi!')
    replyDialog.value = false
  } catch {
    ElMessage.error('Gửi phản hồi thất bại')
  } finally {
    saving.value = false
  }
}

async function deleteReply() {
  try {
    await ElMessageBox.confirm(
      'Bạn có chắc muốn xóa phản hồi này không?',
      'Xác nhận',
      { confirmButtonText: 'Xóa phản hồi', cancelButtonText: 'Huỷ', type: 'warning' }
    )
    // Gọi API reply với chuỗi rỗng để xóa phản hồi
    const { data } = await apiClient.put(
      `/api/v1/admin/reviews/${replyTarget.value.id}/reply`,
      { phanHoi: '' }
    )
    const idx = reviews.value.findIndex(d => d.id === data.id)
    if (idx !== -1) reviews.value[idx] = data
    const statRes = await apiClient.get('/api/v1/admin/reviews/stats')
    stats.value = statRes.data
    ElMessage.success('Đã xóa phản hồi')
    replyDialog.value = false
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('Xóa phản hồi thất bại')
  }
}

// ── Ẩn / Hiện ────────────────────────────────────────────────────────────────
function toggleHide(dg) {
  if (dg.biAn) {
    // Đang ẩn → hiện lại ngay (không cần confirm)
    doDirectToggle(dg)
  } else {
    // Đang hiện → hỏi lý do ẩn
    hideTarget.value        = dg
    hideReason.value        = ''
    hideConfirmDialog.value = true
  }
}

async function doDirectToggle(dg) {
  togglingId.value = dg.id
  try {
    const { data } = await apiClient.put(`/api/v1/admin/reviews/${dg.id}/toggle`)
    const idx = reviews.value.findIndex(d => d.id === data.id)
    if (idx !== -1) reviews.value[idx] = data
    const statRes = await apiClient.get('/api/v1/admin/reviews/stats')
    stats.value = statRes.data
    ElMessage.success('Đã hiện lại đánh giá')
  } catch {
    ElMessage.error('Thao tác thất bại')
  } finally {
    togglingId.value = null
  }
}

async function doToggleHide() {
  if (!hideTarget.value) return
  togglingId.value = hideTarget.value.id
  try {
    const { data } = await apiClient.put(`/api/v1/admin/reviews/${hideTarget.value.id}/toggle`)
    const idx = reviews.value.findIndex(d => d.id === data.id)
    if (idx !== -1) reviews.value[idx] = data
    const statRes = await apiClient.get('/api/v1/admin/reviews/stats')
    stats.value = statRes.data
    ElMessage.success('Đã ẩn đánh giá vi phạm')
    hideConfirmDialog.value = false
  } catch {
    ElMessage.error('Thao tác thất bại')
  } finally {
    togglingId.value = null
  }
}

// ── Xóa ──────────────────────────────────────────────────────────────────────
async function confirmDelete(dg) {
  try {
    await ElMessageBox.confirm(
      `Xóa đánh giá của "${dg.tenKhachHang}"? Hành động này không thể hoàn tác.`,
      'Xác nhận xóa',
      { confirmButtonText: 'Xóa', cancelButtonText: 'Huỷ', type: 'error' }
    )
    await apiClient.delete(`/api/v1/admin/reviews/${dg.id}`)
    reviews.value = reviews.value.filter(d => d.id !== dg.id)
    const statRes = await apiClient.get('/api/v1/admin/reviews/stats')
    stats.value = statRes.data
    ElMessage.success('Đã xóa đánh giá')
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('Xóa thất bại')
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>