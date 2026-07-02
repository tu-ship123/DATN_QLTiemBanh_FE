<template>
  <div class="space-y-6" v-loading="loading">

    <!-- ── HEADER ── -->
    <div class="flex items-center justify-between mb-2">
      <div>
        <h1 class="font-display font-black text-2xl" style="color:#5C4428">Phụ kiện trang trí</h1>
        <p class="text-sm text-muted mt-0.5">
          {{ items.length }} phụ kiện ·
          {{ items.filter(i => i.hoatDong).length }} đang hoạt động
        </p>
      </div>
      <button class="btn-primary flex items-center gap-2" @click="openAdd">
        <iconify-icon icon="ph:plus-bold" class="text-base" />
        Thêm phụ kiện
      </button>
    </div>

    <!-- ── FILTER BAR ── -->
    <div class="flex gap-3 flex-wrap items-center">
      <div class="search-input flex-1 min-w-[200px]">
        <iconify-icon icon="ph:magnifying-glass" style="color:#B0A8A3" />
        <input v-model="search" type="text" placeholder="Tìm tên phụ kiện..." />
      </div>
      <el-select v-model="filterStatus" style="width:170px" placeholder="Tất cả trạng thái">
        <el-option label="Tất cả" :value="null" />
        <el-option label="Đang hoạt động" :value="true" />
        <el-option label="Đã tắt" :value="false" />
      </el-select>
      <div class="flex bg-white border border-[var(--color-border)] rounded-xl p-1">
        <button
          v-for="v in ['grid','list']" :key="v"
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1"
          :class="viewMode === v ? 'bg-[#7A5C3A] text-white' : 'text-gray-400 hover:text-gray-600'"
          @click="viewMode = v"
        >
          <iconify-icon :icon="v === 'grid' ? 'ph:grid-four' : 'ph:list-bullets'" class="text-base" />
        </button>
      </div>
    </div>

    <!-- ── GRID VIEW ── -->
    <div v-if="viewMode === 'grid'" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="item in displayed" :key="item.id"
        class="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
        @click="openEdit(item)"
      >
        <!-- Thumbnail -->
        <div class="h-44 relative overflow-hidden bg-[#FDF8F2]">
          <img
            v-if="item.anhPhuKien"
            :src="item.anhPhuKien"
            :alt="item.tenPhuKien"
            class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            @error="$event.target.src = placeholderImg"
          />
          <div v-else class="h-full w-full flex items-center justify-center">
            <iconify-icon icon="ph:sparkle-duotone" class="text-5xl" style="color:#D4C4A8" />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />

          <!-- Action buttons (hover) -->
          <div class="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition">
            <button
              class="w-8 h-8 bg-white rounded-xl shadow flex items-center justify-center text-[#7A5C3A] hover:bg-[#FDF6EC] transition"
              @click.stop="openEdit(item)" title="Sửa"
            >
              <iconify-icon icon="ph:pencil-simple-duotone" />
            </button>
            <button
              class="w-8 h-8 bg-white rounded-xl shadow flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 transition"
              @click.stop="confirmDelete(item)" title="Xóa"
            >
              <iconify-icon icon="ph:trash-duotone" />
            </button>
          </div>

          <!-- Status badge -->
          <div class="absolute top-3 left-3">
            <span
              class="px-2 py-1 rounded-lg text-[10px] font-bold uppercase shadow"
              :class="item.hoatDong ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'"
            >
              {{ item.hoatDong ? 'Hoạt động' : 'Tắt' }}
            </span>
          </div>
        </div>

        <!-- Info -->
        <div class="p-4">
          <div class="font-semibold text-sm mb-1 line-clamp-1" style="color:#5C4428" :title="item.tenPhuKien">
            {{ item.tenPhuKien }}
          </div>
          <div class="text-xs text-muted mb-3">Tồn: {{ item.soLuongTon }} cái</div>
          <div class="flex items-center justify-between">
            <div class="font-bold text-base" style="color:#7A5C3A">{{ formatPrice(item.donGia) }}</div>
            <button
              class="p-1.5 rounded-lg transition text-xs"
              :class="item.hoatDong ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'"
              @click.stop="toggleItem(item)"
              :title="item.hoatDong ? 'Tắt hoạt động' : 'Bật hoạt động'"
            >
              <iconify-icon :icon="item.hoatDong ? 'ph:toggle-right-duotone' : 'ph:toggle-left-duotone'" class="text-lg" />
            </button>
          </div>
        </div>
      </div>

      <!-- Add card -->
      <div
        class="bg-white rounded-2xl border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#7A5C3A] hover:bg-[#FFFBF5] transition min-h-[240px]"
        @click="openAdd"
      >
        <div class="w-12 h-12 rounded-2xl bg-[#FDF6EC] flex items-center justify-center">
          <iconify-icon icon="ph:plus-bold" class="text-2xl" style="color:#7A5C3A" />
        </div>
        <div class="text-sm font-semibold" style="color:#7A5C3A">Thêm phụ kiện</div>
      </div>
    </div>

    <!-- ── LIST VIEW ── -->
    <div v-else class="data-card">
      <el-table :data="displayed" style="width:100%">
        <el-table-column label="PHỤ KIỆN" min-width="240">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 bg-[#FDF8F2] flex items-center justify-center">
                <img
                  v-if="row.anhPhuKien"
                  :src="row.anhPhuKien"
                  class="h-full w-full object-cover"
                  @error="$event.target.src = placeholderImg"
                />
                <iconify-icon v-else icon="ph:sparkle-duotone" class="text-xl" style="color:#D4C4A8" />
              </div>
              <div>
                <div class="font-semibold text-sm line-clamp-1" style="color:#5C4428">{{ row.tenPhuKien }}</div>
                <div class="text-xs text-muted">Tồn: {{ row.soLuongTon }} cái</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="ĐƠN GIÁ" width="150">
          <template #default="{ row }">
            <span class="font-bold" style="color:#7A5C3A">{{ formatPrice(row.donGia) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="TỒN KHO" width="100" align="center">
          <template #default="{ row }">
            <span
              class="font-semibold px-2 py-1 rounded-lg text-sm"
              :class="row.soLuongTon === 0 ? 'bg-red-50 text-red-500' : row.soLuongTon < 10 ? 'bg-yellow-50 text-yellow-600' : 'text-gray-700'"
            >{{ row.soLuongTon }}</span>
          </template>
        </el-table-column>

        <el-table-column label="TRẠNG THÁI" width="140" align="center">
          <template #default="{ row }">
            <el-tag :type="row.hoatDong ? 'success' : 'info'" size="small">
              {{ row.hoatDong ? 'Hoạt động' : 'Đã tắt' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="THAO TÁC" width="140" align="center">
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-2">
              <button
                class="p-1.5 rounded-lg bg-[#FDF6EC] hover:bg-[#EDE0CC] transition"
                @click="openEdit(row)" title="Sửa"
              >
                <iconify-icon icon="ph:pencil-simple-duotone" style="color:#7A5C3A" />
              </button>
              <button
                class="p-1.5 rounded-lg transition"
                :class="row.hoatDong ? 'bg-green-50 hover:bg-green-100' : 'bg-gray-50 hover:bg-gray-100'"
                @click="toggleItem(row)"
                :title="row.hoatDong ? 'Tắt' : 'Bật'"
              >
                <iconify-icon
                  :icon="row.hoatDong ? 'ph:toggle-right-duotone' : 'ph:toggle-left-duotone'"
                  :style="{ color: row.hoatDong ? '#22C55E' : '#9CA3AF' }"
                  class="text-lg"
                />
              </button>
              <button
                class="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition"
                @click="confirmDelete(row)" title="Xóa"
              >
                <iconify-icon icon="ph:trash-duotone" style="color:#EF4444" />
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- ── EMPTY STATE ── -->
    <div v-if="!loading && displayed.length === 0" class="data-card text-center py-16">
      <iconify-icon icon="ph:sparkle-duotone" class="text-5xl mb-3" style="color:#D4C4A8" />
      <p class="font-semibold" style="color:#9A7650">Không tìm thấy phụ kiện nào</p>
      <p class="text-xs text-muted mt-1">Hãy thêm phụ kiện trang trí đầu tiên</p>
      <button class="btn-primary mt-4" @click="openAdd">
        <iconify-icon icon="ph:plus-bold" class="mr-1" /> Thêm phụ kiện
      </button>
    </div>

    <!-- ── DIALOG THÊM / SỬA ── -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingItem ? 'Chỉnh sửa phụ kiện' : 'Thêm phụ kiện mới'"
      width="520px"
      align-center
      :close-on-click-modal="false"
      class="decor-dialog"
    >
      <div class="space-y-4 px-1">

        <!-- Preview ảnh -->
        <div class="flex justify-center mb-2">
          <div class="w-24 h-24 rounded-2xl border-2 border-dashed border-[#EDE0CC] overflow-hidden bg-[#FDF8F2] flex items-center justify-center">
            <img
              v-if="form.anhPhuKien"
              :src="form.anhPhuKien"
              class="w-full h-full object-cover"
              @error="$event.target.src = placeholderImg"
            />
            <iconify-icon v-else icon="ph:image-duotone" class="text-3xl" style="color:#D4C4A8" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold mb-1" style="color:#7A5C3A">URL ảnh phụ kiện</label>
          <el-input v-model="form.anhPhuKien" placeholder="https://example.com/image.jpg">
            <template #prefix>
              <iconify-icon icon="ph:image-duotone" style="color:#A68B5C" />
            </template>
          </el-input>
        </div>

        <div>
          <label class="block text-xs font-bold mb-1" style="color:#7A5C3A">Model 3D (.glb)</label>
          <el-input v-model="form.model3dUrl" placeholder="/models/ten-file.glb hoặc URL CDN ngoài">
            <template #prefix>
              <iconify-icon icon="ph:cube-duotone" style="color:#A68B5C" />
            </template>
          </el-input>
          <div class="text-xs text-muted mt-1">
            Bỏ trống nếu chưa có file model — bánh 3D sẽ tự hiển thị hình mẫu dựng sẵn thay thế.
            File .glb cần được bỏ sẵn vào thư mục <code>fe/public/models/</code> của dự án.
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold mb-1" style="color:#7A5C3A">Tên phụ kiện <span class="text-red-400">*</span></label>
          <el-input v-model="form.tenPhuKien" placeholder="VD: Nến sinh nhật, Hoa hồng sáp..." maxlength="150" show-word-limit>
            <template #prefix>
              <iconify-icon icon="ph:sparkle-duotone" style="color:#A68B5C" />
            </template>
          </el-input>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold mb-1" style="color:#7A5C3A">Đơn giá (VNĐ) <span class="text-red-400">*</span></label>
            <el-input-number
              v-model="form.donGia"
              :min="0"
              :step="1000"
              style="width:100%"
              placeholder="0"
            />
          </div>
          <div>
            <label class="block text-xs font-bold mb-1" style="color:#7A5C3A">Số lượng tồn</label>
            <el-input-number
              v-model="form.soLuongTon"
              :min="0"
              style="width:100%"
              placeholder="0"
            />
          </div>
        </div>

        <div class="flex items-center gap-3 p-3 rounded-xl bg-[#FFFBF5] border border-[#EDE0CC]">
          <el-switch v-model="form.hoatDong" active-color="#7A5C3A" />
          <div>
            <div class="text-sm font-semibold" style="color:#5C4428">
              {{ form.hoatDong ? 'Đang hoạt động' : 'Đã tắt' }}
            </div>
            <div class="text-xs text-muted">Phụ kiện {{ form.hoatDong ? 'hiển thị' : 'bị ẩn' }} khi khách thiết kế bánh</div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-2 justify-end">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button type="primary" :loading="saving" @click="handleSave" class="primary-btn">
            <iconify-icon :icon="editingItem ? 'ph:floppy-disk-duotone' : 'ph:plus-circle-duotone'" class="mr-1" />
            {{ editingItem ? 'Lưu thay đổi' : 'Thêm phụ kiện' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import apiClient from '@/services/apiService'

const placeholderImg = 'https://placehold.co/300x300?text=PKT'

// ── State ──────────────────────────────────────────────────────────────────────
const loading      = ref(false)
const saving       = ref(false)
const items        = ref([])
const search       = ref('')
const filterStatus = ref(null)
const viewMode     = ref('grid')

const dialogVisible = ref(false)
const editingItem   = ref(null)
const form = ref({
  tenPhuKien: '',
  donGia: 0,
  soLuongTon: 0,
  anhPhuKien: '',
  model3dUrl: '',
  hoatDong: true,
})

// ── Computed ───────────────────────────────────────────────────────────────────
const displayed = computed(() => {
  let result = [...items.value]
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    result = result.filter(i => i.tenPhuKien?.toLowerCase().includes(q))
  }
  if (filterStatus.value !== null) {
    result = result.filter(i => i.hoatDong === filterStatus.value)
  }
  return result
})

// ── API ────────────────────────────────────────────────────────────────────────
async function loadItems() {
  loading.value = true
  try {
    const { data } = await apiClient.get('/api/v1/admin/decor-items')
    items.value = data
  } catch {
    ElMessage.error('Không thể tải danh sách phụ kiện')
  } finally {
    loading.value = false
  }
}

async function handleSave() {
  if (!form.value.tenPhuKien?.trim()) {
    ElMessage.warning('Vui lòng nhập tên phụ kiện!')
    return
  }
  if (!form.value.donGia && form.value.donGia !== 0) {
    ElMessage.warning('Vui lòng nhập đơn giá!')
    return
  }
  saving.value = true
  try {
    if (editingItem.value) {
      await apiClient.put(`/api/v1/admin/decor-items/${editingItem.value.id}`, form.value)
      ElMessage.success('Đã cập nhật phụ kiện!')
    } else {
      await apiClient.post('/api/v1/admin/decor-items', form.value)
      ElMessage.success('Đã thêm phụ kiện mới!')
    }
    dialogVisible.value = false
    await loadItems()
  } catch (e) {
    ElMessage.error(e.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại')
  } finally {
    saving.value = false
  }
}

async function toggleItem(item) {
  try {
    const { data } = await apiClient.patch(`/api/v1/admin/decor-items/${item.id}/toggle`)
    const idx = items.value.findIndex(i => i.id === item.id)
    if (idx !== -1) items.value[idx] = data
    ElMessage.success(data.hoatDong ? 'Đã bật hoạt động!' : 'Đã tắt hoạt động!')
  } catch {
    ElMessage.error('Không thể thay đổi trạng thái')
  }
}

function confirmDelete(item) {
  ElMessageBox.confirm(
    `Bạn có chắc muốn xóa phụ kiện "<strong>${item.tenPhuKien}</strong>"?`,
    'Xác nhận xóa',
    { confirmButtonText: 'Xóa', cancelButtonText: 'Hủy', type: 'warning', dangerouslyUseHTMLString: true }
  ).then(async () => {
    try {
      await apiClient.delete(`/api/v1/admin/decor-items/${item.id}`)
      ElMessage.success('Đã xóa phụ kiện!')
      await loadItems()
    } catch (e) {
      ElMessage.error(e.response?.data || 'Không thể xóa phụ kiện này')
    }
  }).catch(() => {})
}

// ── Dialog helpers ─────────────────────────────────────────────────────────────
function openAdd() {
  editingItem.value = null
  form.value = { tenPhuKien: '', donGia: 0, soLuongTon: 0, anhPhuKien: '', model3dUrl: '', hoatDong: true }
  dialogVisible.value = true
}

function openEdit(item) {
  editingItem.value = item
  form.value = {
    tenPhuKien: item.tenPhuKien,
    donGia: item.donGia,
    soLuongTon: item.soLuongTon,
    anhPhuKien: item.anhPhuKien || '',
    model3dUrl: item.model3dUrl || '',
    hoatDong: item.hoatDong,
  }
  dialogVisible.value = true
}

// ── Formatter ─────────────────────────────────────────────────────────────────
const formatPrice = (v) => {
  if (v == null) return '—'
  return new Intl.NumberFormat('vi-VN').format(v) + 'đ'
}

onMounted(loadItems)
</script>

<style scoped>
.decor-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid #EDE0CC;
  padding-bottom: 12px;
}
.decor-dialog :deep(.el-dialog__title) {
  font-weight: 800;
  color: #5C4428;
  font-family: var(--font-display);
}
</style>