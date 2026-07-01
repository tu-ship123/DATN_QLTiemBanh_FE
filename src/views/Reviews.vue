<template>
  <section class="space-y-6">

    <!-- ── HEADER ── -->
    <div class="data-card">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="page-title">Quản lý đánh giá</h1>
          <p class="text-sm text-muted mt-0.5">Phản hồi và kiểm duyệt đánh giá của khách hàng</p>
        </div>
      </div>
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
      <div class="data-card flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
          <iconify-icon icon="ph:clock-countdown-duotone" class="text-2xl" style="color:#F97316" />
        </div>
        <div>
          <p class="text-xs text-muted">Chưa trả lời</p>
          <p class="text-2xl font-bold text-orange-500">{{ stats.chuaTraLoi }}</p>
        </div>
      </div>
      <div class="data-card flex items-center gap-4">
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
        <div v-for="n in [5,4,3,2,1]" :key="n" class="flex items-center gap-3">
          <span class="text-xs text-muted w-8 text-right">{{ n }}⭐</span>
          <div class="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
            <div class="h-2 rounded-full bg-amber-400 transition-all duration-500"
              :style="{ width: stats.tong ? (stats[`sao${n}`] / stats.tong * 100) + '%' : '0%' }">
            </div>
          </div>
          <span class="text-xs text-muted w-6">{{ stats[`sao${n}`] }}</span>
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

      <el-select v-model="filterTrangThai" placeholder="Trạng thái" clearable style="width:150px">
        <el-option label="Đang hiển thị" :value="false" />
        <el-option label="Đang ẩn"       :value="true"  />
      </el-select>

      <el-select v-model="filterTraLoi" placeholder="Phản hồi" clearable style="width:150px">
        <el-option label="Đã trả lời"    value="da"    />
        <el-option label="Chưa trả lời"  value="chua"  />
      </el-select>

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
        class="data-card transition-all"
        :class="dg.biAn ? 'opacity-60' : ''">

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
              <div class="flex items-center gap-2 shrink-0">
                <span v-if="dg.biAn" class="badge badge-gray text-xs">Ẩn</span>
                <span v-if="!dg.phanHoiCuaTiem" class="badge badge-warning text-xs">Chưa trả lời</span>
                <span v-else class="badge badge-success text-xs">Đã trả lời</span>
                <span class="text-xs text-muted">{{ formatDate(dg.ngayTao) }}</span>
              </div>
            </div>

            <!-- Sao -->
            <div class="flex gap-0.5 mt-1.5">
              <span v-for="i in 5" :key="i"
                class="text-base"
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
              <button class="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                @click="openReply(dg)">
                <iconify-icon :icon="dg.phanHoiCuaTiem ? 'ph:pencil-simple-duotone' : 'ph:chat-circle-duotone'" />
                {{ dg.phanHoiCuaTiem ? 'Sửa phản hồi' : 'Trả lời' }}
              </button>

              <button class="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                @click="toggleHide(dg)">
                <iconify-icon :icon="dg.biAn ? 'ph:eye-duotone' : 'ph:eye-slash-duotone'" />
                {{ dg.biAn ? 'Hiện' : 'Ẩn' }}
              </button>

              <button v-if="isAdmin"
                class="text-xs px-3 py-1.5 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center gap-1"
                @click="confirmDelete(dg)">
                <iconify-icon icon="ph:trash-duotone" /> Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── DIALOG PHẢN HỒI ── -->
    <el-dialog v-model="replyDialog" title="Phản hồi đánh giá" width="480px">
      <div v-if="replyTarget" class="mb-4 bg-slate-50 rounded-xl p-3 text-sm text-slate-700">
        <div class="flex gap-0.5 mb-1">
          <span v-for="i in 5" :key="i"
            class="text-base"
            :class="i <= replyTarget.soSao ? 'text-amber-400' : 'text-slate-200'">★</span>
        </div>
        <p class="font-semibold">{{ replyTarget.tenKhachHang }}</p>
        <p class="text-muted text-xs">{{ replyTarget.noiDung || 'Không có nội dung' }}</p>
      </div>
      <el-input v-model="replyText" type="textarea" :rows="4"
        placeholder="Cảm ơn bạn đã đánh giá! Chúng tôi rất vui khi..." />
      <template #footer>
        <el-button @click="replyDialog = false">Huỷ</el-button>
        <el-button type="primary" :loading="saving"
          :style="{ background: '#7A5C3A', borderColor: '#7A5C3A' }"
          @click="submitReply">
          Gửi phản hồi
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
const isAdmin = computed(() => authStore.user?.role === 'ROLE_ADMIN')

// ── State ─────────────────────────────────────────────────────────────────────
const reviews       = ref([])
const stats         = ref(null)
const loading       = ref(false)
const saving        = ref(false)

const search         = ref('')
const filterSao      = ref(null)
const filterTrangThai = ref(null)
const filterTraLoi   = ref('')

const replyDialog  = ref(false)
const replyTarget  = ref(null)
const replyText    = ref('')

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

// ── Actions ───────────────────────────────────────────────────────────────────
function openReply(dg) {
  replyTarget.value = dg
  replyText.value   = dg.phanHoiCuaTiem || ''
  replyDialog.value = true
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

    ElMessage.success('Đã gửi phản hồi!')
    replyDialog.value = false
  } catch {
    ElMessage.error('Gửi phản hồi thất bại')
  } finally {
    saving.value = false
  }
}

async function toggleHide(dg) {
  try {
    const { data } = await apiClient.put(`/api/v1/admin/reviews/${dg.id}/toggle`)
    const idx = reviews.value.findIndex(d => d.id === data.id)
    if (idx !== -1) reviews.value[idx] = data
    const statRes = await apiClient.get('/api/v1/admin/reviews/stats')
    stats.value = statRes.data
    ElMessage.success(data.biAn ? 'Đã ẩn đánh giá' : 'Đã hiện đánh giá')
  } catch {
    ElMessage.error('Thao tác thất bại')
  }
}

async function confirmDelete(dg) {
  try {
    await ElMessageBox.confirm(
      `Xóa đánh giá của "${dg.tenKhachHang}"? Hành động này không thể hoàn tác.`,
      'Xác nhận xóa',
      { confirmButtonText: 'Xóa', cancelButtonText: 'Huỷ', type: 'warning' }
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