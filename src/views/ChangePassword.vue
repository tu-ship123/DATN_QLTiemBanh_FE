<template>
  <div class="max-w-2xl mx-auto px-4 md:px-8 py-10 animate-fade-in chocopine-page">

    <!-- ===== HEADER ===== -->
    <div class="flex items-center gap-4 mb-8">
      <RouterLink to="/shop/profile"
        class="w-10 h-10 rounded-2xl flex items-center justify-center border border-[#EDE0CC] bg-white hover:bg-[#FDF6EC] transition-colors flex-shrink-0 no-underline">
        <iconify-icon icon="ph:arrow-left-bold" class="text-lg text-[#7A5C3A]"></iconify-icon>
      </RouterLink>
      <div>
        <h1 class="chocopine-title" style="font-size:24px;text-align:left;margin:0;">Đổi mật khẩu</h1>
        <p class="chocopine-desc" style="text-align:left;margin:4px 0 0;font-size:13px;">
          Cập nhật mật khẩu mới để bảo vệ tài khoản của bạn
        </p>
      </div>
    </div>

    <!-- ===== FORM CARD ===== -->
    <div class="rounded-[24px] bg-white border border-[#EDE0CC] shadow-sm p-6 sm:p-8 space-y-5">

      <div class="flex items-start gap-3 rounded-2xl bg-[#FDF8F2] border border-[#EDE0CC] p-4">
        <iconify-icon icon="ph:shield-check-duotone" class="text-xl text-[#7A5C3A] flex-shrink-0 mt-0.5"></iconify-icon>
        <p class="text-xs text-[#9A7650] leading-relaxed">
          Mật khẩu mới nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số để đảm bảo an toàn.
        </p>
      </div>

      <!-- Mật khẩu hiện tại -->
      <div>
        <label class="text-xs font-semibold text-[#9A7650] mb-1 block">Mật khẩu hiện tại</label>
        <div class="relative">
          <input v-model="form.matKhauCu" :type="show.cu ? 'text' : 'password'"
            placeholder="Nhập mật khẩu hiện tại"
            class="w-full px-4 py-3 pr-11 rounded-xl border bg-[#FDF6EC] text-sm text-[#5C4428] outline-none focus:ring-2 focus:ring-[#7A5C3A]/10 transition-all"
            :class="errors.matKhauCu ? 'border-red-300' : 'border-[#EDE0CC] focus:border-[#7A5C3A]'" />
          <button type="button" @click="show.cu = !show.cu"
            class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A68B5C] hover:text-[#7A5C3A]">
            <iconify-icon :icon="show.cu ? 'ph:eye-slash-duotone' : 'ph:eye-duotone'" class="text-lg"></iconify-icon>
          </button>
        </div>
        <p v-if="errors.matKhauCu" class="text-xs text-red-500 mt-1">{{ errors.matKhauCu }}</p>
      </div>

      <!-- Mật khẩu mới -->
      <div>
        <label class="text-xs font-semibold text-[#9A7650] mb-1 block">Mật khẩu mới</label>
        <div class="relative">
          <input v-model="form.matKhauMoi" :type="show.moi ? 'text' : 'password'"
            placeholder="Nhập mật khẩu mới"
            class="w-full px-4 py-3 pr-11 rounded-xl border bg-[#FDF6EC] text-sm text-[#5C4428] outline-none focus:ring-2 focus:ring-[#7A5C3A]/10 transition-all"
            :class="errors.matKhauMoi ? 'border-red-300' : 'border-[#EDE0CC] focus:border-[#7A5C3A]'" />
          <button type="button" @click="show.moi = !show.moi"
            class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A68B5C] hover:text-[#7A5C3A]">
            <iconify-icon :icon="show.moi ? 'ph:eye-slash-duotone' : 'ph:eye-duotone'" class="text-lg"></iconify-icon>
          </button>
        </div>
        <p v-if="errors.matKhauMoi" class="text-xs text-red-500 mt-1">{{ errors.matKhauMoi }}</p>

        <!-- Độ mạnh mật khẩu -->
        <div v-if="form.matKhauMoi" class="flex items-center gap-2 mt-2">
          <div class="flex-1 h-1.5 rounded-full bg-[#EDE0CC] overflow-hidden">
            <div class="h-full rounded-full transition-all" :style="{ width: strength.percent + '%', background: strength.color }"></div>
          </div>
          <span class="text-xs font-semibold" :style="{ color: strength.color }">{{ strength.label }}</span>
        </div>
      </div>

      <!-- Xác nhận mật khẩu mới -->
      <div>
        <label class="text-xs font-semibold text-[#9A7650] mb-1 block">Xác nhận mật khẩu mới</label>
        <div class="relative">
          <input v-model="form.xacNhan" :type="show.xacNhan ? 'text' : 'password'"
            placeholder="Nhập lại mật khẩu mới"
            class="w-full px-4 py-3 pr-11 rounded-xl border bg-[#FDF6EC] text-sm text-[#5C4428] outline-none focus:ring-2 focus:ring-[#7A5C3A]/10 transition-all"
            :class="errors.xacNhan ? 'border-red-300' : 'border-[#EDE0CC] focus:border-[#7A5C3A]'" />
          <button type="button" @click="show.xacNhan = !show.xacNhan"
            class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A68B5C] hover:text-[#7A5C3A]">
            <iconify-icon :icon="show.xacNhan ? 'ph:eye-slash-duotone' : 'ph:eye-duotone'" class="text-lg"></iconify-icon>
          </button>
        </div>
        <p v-if="errors.xacNhan" class="text-xs text-red-500 mt-1">{{ errors.xacNhan }}</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <button @click="doiMatKhau" :disabled="dangLuu"
          class="chocopine-btn-primary px-8 py-3 text-sm w-full sm:w-auto justify-center disabled:opacity-60">
          <span v-if="dangLuu" class="inline-block w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin mr-1"></span>
          <iconify-icon v-else icon="ph:check-circle-duotone" class="text-base mr-1"></iconify-icon>
          {{ dangLuu ? 'Đang lưu...' : 'Lưu mật khẩu mới' }}
        </button>
        <RouterLink to="/shop/profile"
          class="w-full sm:w-auto text-center px-8 py-3 rounded-2xl text-sm font-bold border border-[#EDE0CC] text-[#7A5C3A] hover:bg-[#FDF6EC] transition-colors no-underline">
          Hủy
        </RouterLink>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2 max-w-xs"
        :class="toast.type === 'success' ? 'bg-green-600 text-white' : toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-[#7A5C3A] text-white'">
        <iconify-icon :icon="toast.type === 'success' ? 'ph:check-circle-duotone' : 'ph:warning-circle-duotone'" class="text-lg flex-shrink-0"></iconify-icon>
        {{ toast.msg }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import apiClient from '@/services/apiService'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({ matKhauCu: '', matKhauMoi: '', xacNhan: '' })
const errors = reactive({ matKhauCu: '', matKhauMoi: '', xacNhan: '' })
const show = reactive({ cu: false, moi: false, xacNhan: false })
const dangLuu = ref(false)

const toast = ref({ show: false, msg: '', type: 'info' })
let toastTimer = null
const showToast = (msg, type = 'info') => {
  toast.value = { show: true, msg, type }
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.value.show = false, 3500)
}

// ─── Độ mạnh mật khẩu (ước lượng đơn giản) ───────────────────────────────────
const strength = computed(() => {
  const pw = form.matKhauMoi || ''
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  if (!pw) return { percent: 0, label: '', color: '#EDE0CC' }
  if (score <= 1) return { percent: 25, label: 'Yếu', color: '#EF4444' }
  if (score === 2) return { percent: 55, label: 'Trung bình', color: '#F59E0B' }
  if (score === 3) return { percent: 80, label: 'Khá tốt', color: '#7A5C3A' }
  return { percent: 100, label: 'Mạnh', color: '#16A34A' }
})

function resetErrors() {
  errors.matKhauCu = ''
  errors.matKhauMoi = ''
  errors.xacNhan = ''
}

function validate() {
  resetErrors()
  let ok = true

  if (!form.matKhauCu) {
    errors.matKhauCu = 'Vui lòng nhập mật khẩu hiện tại.'
    ok = false
  }

  if (!form.matKhauMoi) {
    errors.matKhauMoi = 'Vui lòng nhập mật khẩu mới.'
    ok = false
  } else if (form.matKhauMoi.length < 8) {
    errors.matKhauMoi = 'Mật khẩu mới phải có ít nhất 8 ký tự.'
    ok = false
  } else if (form.matKhauCu && form.matKhauMoi === form.matKhauCu) {
    errors.matKhauMoi = 'Mật khẩu mới phải khác mật khẩu hiện tại.'
    ok = false
  }

  if (!form.xacNhan) {
    errors.xacNhan = 'Vui lòng xác nhận mật khẩu mới.'
    ok = false
  } else if (form.xacNhan !== form.matKhauMoi) {
    errors.xacNhan = 'Mật khẩu xác nhận không khớp.'
    ok = false
  }

  return ok
}

async function doiMatKhau() {
  if (!validate()) {
    showToast('Vui lòng kiểm tra lại thông tin.', 'error')
    return
  }

  dangLuu.value = true
  try {
    // BE (HoSoController: PUT /api/v1/users/me/password) đổi mật khẩu xong sẽ
    // đăng xuất mọi thiết bị khác và cấp lại cặp token mới CHỈ cho phiên hiện tại.
    const res = await apiClient.put('/api/v1/users/me/password', {
      matKhauHienTai: form.matKhauCu,
      matKhauMoi: form.matKhauMoi,
    })
    authStore.setAuthData(res.data)

    showToast('Đổi mật khẩu thành công!', 'success')
    form.matKhauCu = ''
    form.matKhauMoi = ''
    form.xacNhan = ''
    setTimeout(() => router.push('/shop/profile'), 900)
  } catch (e) {
    showToast(e?.response?.data?.message || e?.response?.data || 'Đổi mật khẩu thất bại. Vui lòng thử lại.', 'error')
  } finally {
    dangLuu.value = false
  }
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn .4s ease both; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

.toast-enter-active, .toast-leave-active { transition: all .3s ease; }
.toast-enter-from { opacity: 0; transform: translateY(16px); }
.toast-leave-to { opacity: 0; transform: translateY(8px); }

.chocopine-btn-primary {
  background: linear-gradient(135deg, #7A5C3A, #9A7650);
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all .2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.chocopine-btn-primary:hover { background: linear-gradient(135deg, #6B4E2E, #7A5C3A); box-shadow: 0 6px 20px rgba(122,92,58,.25); }
.chocopine-title { font-weight: 800; color: #3D2B1A; }
.chocopine-desc { color: #9A7650; }
</style>
