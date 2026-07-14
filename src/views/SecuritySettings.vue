<template>
  <section class="min-h-screen bg-slate-50 px-6 py-8">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[.24em] text-cake-500">Bảo mật</p>
        <h1 class="text-3xl font-semibold text-slate-900">Bảo mật tài khoản</h1>
        <p class="mt-2 text-sm text-slate-500">Quản lý mật khẩu, xác thực hai bước (2FA) và theo dõi phiên đăng nhập.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Cột bên trái: Mật khẩu và 2FA -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Đổi mật khẩu -->
        <el-card class="rounded-[28px] border border-slate-200 shadow-sm" body-class="p-6">
          <template #header>
            <div class="flex items-center gap-2">
              <iconify-icon icon="ph:lock-key-duotone" class="text-xl text-cake-500" />
              <h3 class="font-semibold text-slate-800">Đổi mật khẩu</h3>
            </div>
          </template>
          <el-form :model="pwdForm" label-position="top" class="space-y-4">
            <el-form-item label="Mật khẩu hiện tại">
              <el-input v-model="pwdForm.current" type="password" show-password placeholder="Nhập mật khẩu hiện tại" />
            </el-form-item>
            <el-form-item label="Mật khẩu mới">
              <el-input v-model="pwdForm.new" type="password" show-password placeholder="Nhập mật khẩu mới" />
            </el-form-item>
            <el-form-item label="Xác nhận mật khẩu mới">
              <el-input v-model="pwdForm.confirm" type="password" show-password placeholder="Xác nhận mật khẩu mới" />
            </el-form-item>
            <el-button type="primary" class="w-full rounded-xl bg-slate-800 hover:bg-slate-900 border-none" @click="changePassword">
              Cập nhật mật khẩu
            </el-button>
          </el-form>
        </el-card>

        <!-- Xác thực hai bước (2FA TOTP) -->
        <el-card class="rounded-[28px] border border-slate-200 shadow-sm" body-class="p-6">
          <template #header>
             <div class="flex items-center justify-between">
               <div class="flex items-center gap-2">
                 <iconify-icon icon="ph:shield-check-duotone" class="text-xl text-green-500" />
                 <h3 class="font-semibold text-slate-800">Xác thực hai bước (2FA)</h3>
               </div>
               <el-tag :type="is2FAEnabled ? 'success' : 'info'" effect="light" round>
                 {{ is2FAEnabled ? 'Đã bật' : 'Chưa bật' }}
               </el-tag>
             </div>
          </template>
          
          <div v-if="!is2FAEnabled" class="text-center space-y-4">
            <p class="text-sm text-slate-500 text-left">Quét mã QR dưới đây bằng ứng dụng Google Authenticator hoặc Authy để thiết lập.</p>
            <div v-if="!qrCodeUri" class="text-left">
              <el-button class="w-full rounded-xl" @click="startSetupTotp" :loading="settingUp">
                Bắt đầu thiết lập 2FA
              </el-button>
            </div>
            <template v-else>
              <div class="inline-block p-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <img :src="qrImageUrl" alt="QR Code" class="w-32 h-32" />
              </div>
              <div class="text-left">
                <p class="text-xs text-slate-400 mb-1">Hoặc nhập mã thủ công:</p>
                <code class="px-2 py-1 bg-slate-100 rounded text-slate-700 text-xs font-mono select-all">{{ totpSecret }}</code>
              </div>
              <el-input v-model="otpCode" placeholder="Nhập mã gồm 6 chữ số" maxlength="6" class="mt-4 text-center text-lg tracking-widest font-mono" />
              <el-button type="primary" class="w-full rounded-xl bg-cake-500 border-none hover:bg-cake-600" @click="enable2FA" :loading="verifying">
                Kích hoạt 2FA
              </el-button>
            </template>
          </div>

          <div v-else class="text-center space-y-4">
             <div class="w-16 h-16 mx-auto rounded-full bg-green-50 text-green-500 flex items-center justify-center text-3xl">
               <iconify-icon icon="ph:shield-check-fill" />
             </div>
             <p class="text-sm text-slate-600">Tài khoản của bạn đã được bảo vệ bằng xác thực hai bước.</p>
             <el-button type="danger" plain class="w-full rounded-xl" @click="disable2FA" :loading="disabling">
               Tắt xác thực hai bước
             </el-button>
          </div>
        </el-card>
      </div>

      <!-- Cột bên phải: Lịch sử đăng nhập -->
      <div class="lg:col-span-2">
        <el-card class="rounded-[28px] border border-slate-200 shadow-sm h-full" body-class="p-0">
          <div class="p-5 border-b border-slate-100 flex items-center gap-2">
            <iconify-icon icon="ph:devices-duotone" class="text-xl text-blue-500" />
            <h3 class="font-semibold text-slate-800">Thiết bị & Lịch sử đăng nhập</h3>
          </div>
          <el-table :data="loginHistory" style="width: 100%" class="custom-table" header-cell-class-name="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <el-table-column label="Thiết bị / Trình duyệt" min-width="200">
              <template #default="{ row }">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 text-lg">
                    <iconify-icon :icon="row.icon" />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-slate-800">{{ row.device }}</p>
                    <p class="text-xs text-slate-500">{{ row.browser }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="ip" label="Địa chỉ IP" width="130" />
            <el-table-column prop="time" label="Thời gian" width="160" />
            <el-table-column label="Trạng thái" width="120" align="center">
               <template #default="{ row }">
                 <el-tag :type="row.current ? 'success' : 'info'" effect="light" class="rounded-full px-3">
                   {{ row.current ? 'Hiện tại' : 'Thành công' }}
                 </el-tag>
               </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import apiClient from '@/services/apiService'

const pwdForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

const is2FAEnabled = ref(false)
const otpCode = ref('')
const qrCodeUri = ref('')
const totpSecret = ref('')
const settingUp = ref(false)
const verifying = ref(false)
const disabling = ref(false)

// otpauth://... URI trả về từ BE (chứa secret thật của user) -> nhờ dịch vụ QR public vẽ ảnh
const qrImageUrl = computed(() =>
  qrCodeUri.value
    ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCodeUri.value)}`
    : ''
)

const loginHistory = ref([
  { id: 1, device: 'MacBook Pro (macOS)', browser: 'Chrome 124.0.0.0', icon: 'ph:laptop-duotone', ip: '192.168.1.45', time: 'Vừa xong', current: true },
  { id: 2, device: 'iPhone 13 Pro (iOS)', browser: 'Safari 16.0', icon: 'ph:device-mobile-camera-duotone', ip: '14.232.12.34', time: 'Hôm qua, 14:30', current: false },
  { id: 3, device: 'Windows PC (Win 11)', browser: 'Edge 123.0.0.0', icon: 'ph:desktop-tower-duotone', ip: '113.160.22.10', time: '20/05/2024 09:15', current: false },
])

async function fetchStatus() {
  try {
    const { data } = await apiClient.get('/api/v1/users/me')
    is2FAEnabled.value = !!data.is2FaEnabled
  } catch {
    // im lặng, giữ trạng thái mặc định false
  }
}

const changePassword = async () => {
  if (!pwdForm.current || !pwdForm.new || !pwdForm.confirm) {
    ElMessage.warning('Vui lòng nhập đầy đủ thông tin!')
    return
  }
  if (pwdForm.new !== pwdForm.confirm) {
    ElMessage.error('Mật khẩu xác nhận không khớp!')
    return
  }
  try {
    await apiClient.put('/api/v1/users/me/password', {
      matKhauHienTai: pwdForm.current,
      matKhauMoi: pwdForm.new
    })
    ElMessage.success('Đổi mật khẩu thành công! Các thiết bị khác đã bị đăng xuất.')
    pwdForm.current = ''
    pwdForm.new = ''
    pwdForm.confirm = ''
  } catch (err) {
    ElMessage.error(err?.response?.data?.message || err?.response?.data || 'Đổi mật khẩu thất bại!')
  }
}

async function startSetupTotp() {
  settingUp.value = true
  try {
    const { data } = await apiClient.get('/api/v1/auth/totp/setup')
    totpSecret.value = data.secret
    qrCodeUri.value = data.qrCodeUri
  } catch (err) {
    ElMessage.error(err?.response?.data?.message || err?.response?.data || 'Không thể thiết lập 2FA!')
  } finally {
    settingUp.value = false
  }
}

const enable2FA = async () => {
  if (otpCode.value.length !== 6) {
    ElMessage.warning('Mã xác nhận phải gồm 6 chữ số!')
    return
  }
  verifying.value = true
  try {
    await apiClient.post('/api/v1/auth/totp/verify', null, { params: { code: otpCode.value } })
    is2FAEnabled.value = true
    otpCode.value = ''
    qrCodeUri.value = ''
    ElMessage.success('Đã kích hoạt xác thực hai bước (2FA)')
  } catch (err) {
    ElMessage.error(err?.response?.data?.message || err?.response?.data || 'Mã xác thực không chính xác!')
  } finally {
    verifying.value = false
  }
}

const disable2FA = () => {
  ElMessageBox.confirm(
    'Bạn có chắc chắn muốn tắt xác thực hai bước? Tài khoản của bạn sẽ kém an toàn hơn.',
    'Cảnh báo',
    {
      confirmButtonText: 'Tắt 2FA',
      cancelButtonText: 'Hủy',
      type: 'warning',
    }
  ).then(async () => {
    disabling.value = true
    try {
      await apiClient.post('/api/v1/auth/totp/disable')
      is2FAEnabled.value = false
      ElMessage.success('Đã tắt xác thực hai bước (2FA)')
    } catch (err) {
      ElMessage.error(err?.response?.data?.message || err?.response?.data || 'Tắt 2FA thất bại!')
    } finally {
      disabling.value = false
    }
  }).catch(() => {})
}

onMounted(fetchStatus)
</script>

<style scoped>
.custom-table :deep(th.el-table__cell) {
  background-color: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}
</style>
