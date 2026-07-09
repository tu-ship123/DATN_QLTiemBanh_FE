<template>
  <div class="chocopine-page animate-fade-in">
    <div class="chocopine-inner space-y-8">
      <section class="chocopine-card p-6 md:p-8 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="chocopine-title" style="text-align:left;margin:0;font-size:24px;">Sổ Địa Chỉ</h1>
          <p class="chocopine-desc" style="text-align:left;margin:4px 0 0;font-size:13px;">
            Quản lý các địa chỉ giao hàng, chọn 1 địa chỉ mặc định để đặt hàng nhanh hơn
          </p>
        </div>
        <button class="chocopine-btn-primary px-5 py-2.5" @click="moFormThem">
          <iconify-icon icon="ph:plus-bold" class="text-sm mr-1"></iconify-icon> Thêm địa chỉ
        </button>
      </section>

      <div v-if="loading" class="py-20 text-center text-sm text-gray-400">Đang tải...</div>

      <div v-else-if="danhSach.length === 0" class="chocopine-card p-12 text-center">
        <iconify-icon icon="ph:map-pin-duotone" class="text-4xl" style="color:#C4A882"></iconify-icon>
        <p class="chocopine-desc" style="margin-top:8px;">Bạn chưa lưu địa chỉ nào cả.</p>
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2">
        <div v-for="dc in danhSach" :key="dc.id"
          class="chocopine-card p-5 space-y-2 relative"
          :class="dc.macDinh ? 'ring-2' : ''"
          :style="dc.macDinh ? 'border-color:#7A5C3A' : ''">
          <span v-if="dc.macDinh" class="absolute top-4 right-4 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style="background:#FDF6EC;color:#7A5C3A;">
            Mặc định
          </span>
          <p class="text-sm font-bold text-[#5C4428]">{{ dc.tenNguoiNhan }}</p>
          <p class="text-xs text-gray-400">{{ dc.soDienThoai }}</p>
          <p class="text-sm text-[#5C4428] leading-relaxed">{{ dc.diaChiChiTiet }}</p>

          <div class="flex flex-wrap gap-2 pt-2">
            <button v-if="!dc.macDinh" class="text-xs font-bold text-[#7A5C3A] hover:underline" @click="datMacDinh(dc)">
              Đặt làm mặc định
            </button>
            <button class="text-xs font-bold text-gray-400 hover:underline" @click="moFormSua(dc)">Sửa</button>
            <button class="text-xs font-bold text-red-400 hover:underline" @click="xoaDiaChi(dc)">Xoá</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog thêm/sửa địa chỉ -->
    <el-dialog v-model="showForm" :title="dangSua ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'" width="480px">
      <el-form label-position="top">
        <el-form-item label="Tên người nhận" required>
          <el-input v-model="form.tenNguoiNhan" placeholder="Nguyễn Văn A" />
        </el-form-item>
        <el-form-item label="Số điện thoại" required>
          <el-input v-model="form.soDienThoai" placeholder="09xxxxxxxx" />
        </el-form-item>
        <el-form-item label="Địa chỉ chi tiết" required>
          <el-input v-model="form.diaChiChiTiet" type="textarea" :rows="3"
            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành..." />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.macDinh">Đặt làm địa chỉ mặc định</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showForm = false">Huỷ</el-button>
        <el-button type="primary" :loading="submitting" style="background:#7A5C3A;border-color:#7A5C3A" @click="luuDiaChi">
          Lưu địa chỉ
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import apiClient from '@/services/apiService'

/**
 * Sổ địa chỉ giao hàng của khách hàng — thêm/sửa/xoá nhiều địa chỉ, chọn 1 địa chỉ mặc định.
 * LƯU Ý: các endpoint /api/v1/dia-chi/* là ĐỀ XUẤT — cần Backend xác nhận/tạo mới
 * (hiện Checkout.vue chỉ đang dùng 1 ô nhập tay tự do "diaChiGiaoHang", chưa có sổ địa chỉ).
 */

const danhSach = ref([])
const loading = ref(false)

async function fetchDanhSach() {
  loading.value = true
  try {
    const { data } = await apiClient.get('/api/v1/dia-chi/cua-toi')
    danhSach.value = data || []
  } catch (e) {
    danhSach.value = []
  } finally {
    loading.value = false
  }
}

// ── Thêm / Sửa ────────────────────────────────────────────────────
const showForm = ref(false)
const dangSua = ref(null)
const submitting = ref(false)
const form = ref({ tenNguoiNhan: '', soDienThoai: '', diaChiChiTiet: '', macDinh: false })

function moFormThem() {
  dangSua.value = null
  form.value = { tenNguoiNhan: '', soDienThoai: '', diaChiChiTiet: '', macDinh: danhSach.value.length === 0 }
  showForm.value = true
}

function moFormSua(dc) {
  dangSua.value = dc.id
  form.value = { tenNguoiNhan: dc.tenNguoiNhan, soDienThoai: dc.soDienThoai, diaChiChiTiet: dc.diaChiChiTiet, macDinh: dc.macDinh }
  showForm.value = true
}

async function luuDiaChi() {
  if (!form.value.tenNguoiNhan.trim() || !form.value.soDienThoai.trim() || !form.value.diaChiChiTiet.trim()) {
    return ElMessage.warning('Vui lòng điền đầy đủ thông tin!')
  }
  submitting.value = true
  try {
    if (dangSua.value) {
      await apiClient.put(`/api/v1/dia-chi/${dangSua.value}`, form.value)
      ElMessage.success('Đã cập nhật địa chỉ.')
    } else {
      await apiClient.post('/api/v1/dia-chi', form.value)
      ElMessage.success('Đã thêm địa chỉ mới.')
    }
    showForm.value = false
    await fetchDanhSach()
  } catch (e) {
    ElMessage.error(e.response?.data || 'Lưu địa chỉ thất bại, thử lại nhé.')
  } finally {
    submitting.value = false
  }
}

// ── Đặt mặc định ──────────────────────────────────────────────────
async function datMacDinh(dc) {
  try {
    await apiClient.put(`/api/v1/dia-chi/${dc.id}/mac-dinh`)
    ElMessage.success('Đã đặt làm địa chỉ mặc định.')
    await fetchDanhSach()
  } catch (e) {
    ElMessage.error(e.response?.data || 'Không thể đặt mặc định, thử lại nhé.')
  }
}

// ── Xoá ───────────────────────────────────────────────────────────
async function xoaDiaChi(dc) {
  try {
    await ElMessageBox.confirm('Xoá địa chỉ này?', 'Xác nhận', {
      confirmButtonText: 'Xoá', cancelButtonText: 'Huỷ', type: 'warning',
    })
  } catch {
    return
  }
  try {
    await apiClient.delete(`/api/v1/dia-chi/${dc.id}`)
    danhSach.value = danhSach.value.filter(x => x.id !== dc.id)
    ElMessage.success('Đã xoá địa chỉ.')
  } catch (e) {
    ElMessage.error(e.response?.data || 'Xoá thất bại, thử lại nhé.')
  }
}

onMounted(fetchDanhSach)
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>
