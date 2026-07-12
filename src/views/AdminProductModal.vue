<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    :title="editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'"
    width="640px"
    @close="resetForm"
  >
    <el-form :model="form" label-position="top" v-loading="saving">
      <div class="grid grid-cols-2 gap-4">

        <!-- Ảnh sản phẩm (gallery tối đa 5 tấm) -->
        <el-form-item label="Ảnh sản phẩm (tối đa 5 tấm)" class="col-span-2">
          <div class="w-full">
            <div class="grid grid-cols-5 gap-3">
              <!-- Các ảnh đã có -->
              <div v-for="(img, idx) in form.danhSachAnh" :key="idx"
                class="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-gray-200 group">
                <img :src="img" class="w-full h-full object-cover" alt="Ảnh sản phẩm" />
                <span v-if="idx === 0"
                  class="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#7A5C3A] text-white">
                  Ảnh chính
                </span>
                <button type="button" @click="removeGalleryImage(idx)"
                  class="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  ✕
                </button>
              </div>

              <!-- Ô thêm ảnh -->
              <label v-if="form.danhSachAnh.length < 5"
                class="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#7A5C3A] hover:bg-[#FDF6EC] transition-colors">
                <el-icon class="text-xl text-gray-400"><Upload /></el-icon>
                <span class="text-[10px] text-gray-400">Thêm ảnh</span>
                <input type="file" accept="image/*" class="hidden" @change="handleGalleryFileChange" />
              </label>
            </div>
            <p class="text-xs text-muted mt-2">
              PNG, JPG tối đa 5MB/ảnh · Ảnh đầu tiên sẽ là ảnh đại diện hiển thị ở danh sách sản phẩm.
            </p>
          </div>
        </el-form-item>

        <!-- Tên sản phẩm -->
        <el-form-item label="Tên sản phẩm *" class="col-span-2">
          <el-input v-model="form.tenSanPham" placeholder="VD: Bánh sinh nhật 3D Custom" />
        </el-form-item>

        <!-- Danh mục -->
        <el-form-item label="Danh mục *">
          <el-select v-model="form.danhMucId" style="width:100%" placeholder="Chọn danh mục">
            <el-option
              v-for="cat in categoryStore.categories"
              :key="cat.id"
              :label="cat.tenDanhMuc"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>

        <!-- Giá bán -->
        <el-form-item label="Giá bán (đ) *">
          <el-input v-model.number="form.donGia" type="number" placeholder="500000" :min="0" />
        </el-form-item>

        <!-- Số lượng tồn -->
        <el-form-item label="Số lượng tồn">
          <el-input-number v-model="form.soLuongTon" :min="0" style="width:100%" />
        </el-form-item>

        <!-- Mô tả -->
        <el-form-item label="Mô tả" class="col-span-2">
          <el-input v-model="form.moTa" type="textarea" :rows="3" placeholder="Mô tả chi tiết sản phẩm..." />
        </el-form-item>

        <!-- Trạng thái -->
        <el-form-item class="col-span-2">
          <div class="flex gap-6">
            <el-checkbox v-model="form.trangThaiActive" label="Đang bán" />
            <el-checkbox v-model="form.isBestseller" label="🔥 Gắn nhãn Bán chạy" />
            <el-checkbox v-model="form.choPhepTuyChinh" label="Cho phép tuỳ chỉnh" />
          </div>
        </el-form-item>

      </div>
    </el-form>

    <template #footer>
      <el-button @click="emit('update:visible', false)" :disabled="saving">Huỷ</el-button>
      <el-button
        type="primary"
        :style="{ background: '#7A5C3A', borderColor: '#7A5C3A' }"
        :loading="saving"
        @click="handleSave"
      >
        {{ editingProduct ? 'Cập nhật' : 'Thêm sản phẩm' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import { productService } from '../services/productService'
import { useCategoryStore } from '../stores/categoryStore'

const props = defineProps({
  visible:        { type: Boolean, default: false },
  editingProduct: { type: Object,  default: null  }
})
const emit = defineEmits(['update:visible', 'save'])

const categoryStore = useCategoryStore()
const saving    = ref(false)

if (!categoryStore.categories.length) {
  categoryStore.fetchAdminCategories()
}

const defaultImage = 'https://placehold.co/400x300?text=Polycake'

const emptyForm = () => ({
  tenSanPham:      '',
  danhMucId:       null,
  donGia:          0,
  soLuongTon:      0,
  moTa:            '',
  danhSachAnh:     [],   // tối đa 5 ảnh, ảnh đầu tiên = ảnh đại diện (anhSanPham)
  trangThaiActive: true,
  isBestseller:    false,
  choPhepTuyChinh: false,
})

const form = ref(emptyForm())

// Hàm đổ data vào form
function fillForm(p) {
  // Ưu tiên field mảng ảnh mới (danhSachAnh) nếu BE đã hỗ trợ; nếu chưa có,
  // fallback về field cũ anhSanPham (1 ảnh) để tương thích ngược với BE cũ.
  const anhCu = Array.isArray(p.danhSachAnh) && p.danhSachAnh.length
    ? p.danhSachAnh
    : (p.anhSanPham && p.anhSanPham !== defaultImage ? [p.anhSanPham] : [])

  form.value = {
    tenSanPham:      p.tenSanPham      || '',
    danhMucId:       p.danhMucId       || null,
    donGia:          p.donGia          || 0,
    soLuongTon:      p.soLuongTon      || 0,
    moTa:            p.moTa            || '',
    danhSachAnh:     anhCu.slice(0, 5),
    trangThaiActive: p.trangThai === 'DANG_BAN',
    isBestseller:    p.isBestseller    || false,
    choPhepTuyChinh: p.choPhepTuyChinh || false,
  }
}

// Fill form ngay khi component mount (v-if tạo lại component mỗi lần mở)
onMounted(() => {
  if (props.editingProduct) {
    fillForm(props.editingProduct)
  } else {
    form.value = emptyForm()
  }
})

// Watch visible: fallback khi dùng v-show
watch(() => props.visible, (val) => {
  if (!val) return
  if (props.editingProduct) {
    fillForm(props.editingProduct)
  } else {
    form.value = emptyForm()
  }
})

// Watch editingProduct: trường hợp visible đã true, chỉ đổi sản phẩm cần sửa
watch(() => props.editingProduct, (p) => {
  if (!props.visible) return
  if (p) {
    fillForm(p)
  } else {
    form.value = emptyForm()
  }
})

function handleGalleryFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (form.value.danhSachAnh.length >= 5) { ElMessage.warning('Chỉ được tối đa 5 ảnh'); return }
  if (!file.type.startsWith('image/')) { ElMessage.warning('Vui lòng chọn file ảnh'); return }
  if (file.size > 5 * 1024 * 1024)    { ElMessage.warning('Ảnh tối đa 5MB'); return }
  const reader = new FileReader()
  reader.onload = () => { form.value.danhSachAnh.push(reader.result) }
  reader.readAsDataURL(file)
  e.target.value = ''
}

function removeGalleryImage(idx) {
  form.value.danhSachAnh.splice(idx, 1)
}

function resetForm() {
  form.value = emptyForm()
}

function buildPayload() {
  return {
    tenSanPham:      form.value.tenSanPham,
    danhMucId:       form.value.danhMucId,
    donGia:          Number(form.value.donGia),
    soLuongTon:      Number(form.value.soLuongTon),
    moTa:            form.value.moTa,
    // Gửi cả 2 field để tương thích: BE mới đọc danhSachAnh (mảng), BE cũ đọc anhSanPham (1 ảnh = ảnh đầu tiên)
    danhSachAnh:     form.value.danhSachAnh,
    anhSanPham:      form.value.danhSachAnh[0] || null,
    trangThai:       form.value.trangThaiActive ? 'DANG_BAN' : 'TAM_AN',
    isBestseller:    form.value.isBestseller,
    choPhepTuyChinh: form.value.choPhepTuyChinh,
  }
}

async function handleSave() {
  if (!form.value.tenSanPham?.trim()) {
    ElMessage.warning('Vui lòng nhập tên sản phẩm'); return
  }
  if (!form.value.donGia || form.value.donGia <= 0) {
    ElMessage.warning('Vui lòng nhập giá bán hợp lệ'); return
  }
  if (!form.value.danhMucId) {
    ElMessage.warning('Vui lòng chọn danh mục'); return
  }

  saving.value = true
  try {
    const payload = buildPayload()
    if (props.editingProduct) {
      await productService.admin.update(props.editingProduct.id, payload)
      ElMessage.success('Cập nhật sản phẩm thành công!')
    } else {
      await productService.admin.create(payload)
      ElMessage.success('Thêm sản phẩm thành công!')
    }
    emit('save')
    emit('update:visible', false)
  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data || 'Có lỗi xảy ra, vui lòng thử lại!'
    ElMessage.error(typeof msg === 'string' ? msg : 'Lỗi khi lưu sản phẩm')
  } finally {
    saving.value = false
  }
}
</script>