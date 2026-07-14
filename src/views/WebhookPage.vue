<template>
  <section class="min-h-screen bg-slate-50 px-6 py-8">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[.24em] text-cake-500">Hệ thống</p>
        <h1 class="text-3xl font-semibold text-slate-900">Cấu hình Webhook</h1>
        <p class="mt-2 text-sm text-slate-500">Thông báo tự động đến kênh Discord khi có đơn hàng mới, đơn bị hủy, hoặc tồn kho thấp.</p>
      </div>
      <span
        class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
        :class="status.enabled ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'"
      >
        <span class="w-2 h-2 rounded-full" :class="status.enabled ? 'bg-green-500 animate-pulse' : 'bg-slate-400'"></span>
        {{ status.enabled ? 'Đang bật' : 'Đang tắt' }}
      </span>
    </div>

    <el-alert
      type="info"
      show-icon
      :closable="false"
      class="mb-4 rounded-xl"
      title="Webhook Discord hiện được cấu hình cố định ở server (application.yml: discord.webhook-url / discord.enabled) — chưa hỗ trợ đổi URL trực tiếp trên giao diện này."
    />

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <!-- Config status -->
      <el-card class="rounded-[28px] border border-slate-200 shadow-sm xl:col-span-1" body-class="p-6" v-loading="loadingStatus">
        <template #header>
          <div class="flex items-center gap-2">
            <iconify-icon icon="ph:webhooks-logo-duotone" class="text-xl text-cake-500" />
            <h3 class="font-semibold text-slate-800">Thông tin Webhook</h3>
          </div>
        </template>

        <div class="space-y-4">
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Trạng thái bật/tắt</p>
            <el-tag :type="status.enabled ? 'success' : 'info'" effect="light">{{ status.enabled ? 'Đang bật (discord.enabled=true)' : 'Đang tắt' }}</el-tag>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Webhook URL</p>
            <code v-if="status.configured" class="block px-2 py-1.5 bg-slate-100 rounded text-slate-700 text-xs font-mono break-all">{{ status.maskedUrl }}</code>
            <p v-else class="text-sm text-red-500">Chưa cấu hình webhook URL</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Sự kiện đang bắn tự động</p>
            <div class="space-y-1.5">
              <div class="flex items-center gap-2 text-sm text-slate-600"><iconify-icon icon="ph:check-circle-fill" class="text-green-500" /> Đơn hàng mới</div>
              <div class="flex items-center gap-2 text-sm text-slate-600"><iconify-icon icon="ph:check-circle-fill" class="text-green-500" /> Đơn hàng bị hủy</div>
              <div class="flex items-center gap-2 text-sm text-slate-600"><iconify-icon icon="ph:check-circle-fill" class="text-green-500" /> Cảnh báo tồn kho thấp</div>
            </div>
          </div>

          <el-button
            type="primary"
            class="w-full rounded-xl bg-gradient-to-r from-cake-500 to-orange-500 border-none shadow-sm shadow-cake-200"
            :loading="testing"
            :disabled="!status.configured || !status.enabled"
            @click="sendTest"
          >
            <iconify-icon icon="ph:paper-plane-tilt-duotone" class="mr-2 text-lg" />
            Gửi tin thử
          </el-button>
        </div>
      </el-card>

      <!-- Test log -->
      <el-card class="rounded-[28px] border border-slate-200 shadow-sm xl:col-span-2" body-class="p-0">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-semibold text-slate-800">Lịch sử gửi thử (phiên làm việc này)</h3>
          <el-button v-if="logs.length" text size="small" class="text-slate-400" @click="logs = []">Xóa lịch sử</el-button>
        </div>

        <div v-if="logs.length === 0" class="p-10 text-center text-sm text-slate-400">
          Chưa có lần gửi thử nào. Nhấn "Gửi tin thử" để kiểm tra webhook.
        </div>

        <div v-else class="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
          <div v-for="log in logs" :key="log.id" class="p-5">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <el-tag :type="log.success ? 'success' : 'danger'" effect="light" class="rounded-full px-3">
                  {{ log.success ? 'Thành công' : 'Thất bại' }}
                </el-tag>
                <span class="text-xs text-slate-400">{{ log.time }}</span>
              </div>
            </div>
            <p class="text-sm text-slate-600">{{ log.message }}</p>
          </div>
        </div>
      </el-card>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import apiClient from '@/services/apiService'

const loadingStatus = ref(false)
const testing = ref(false)

const status = reactive({
  enabled: false,
  configured: false,
  maskedUrl: null,
})

const logs = ref([])
let logId = 1

async function fetchStatus() {
  loadingStatus.value = true
  try {
    const { data } = await apiClient.get('/api/v1/admin/webhook/status')
    status.enabled = data.enabled
    status.configured = data.configured
    status.maskedUrl = data.maskedUrl
  } catch {
    ElMessage.error('Không thể tải trạng thái webhook!')
  } finally {
    loadingStatus.value = false
  }
}

async function sendTest() {
  testing.value = true
  try {
    const { data } = await apiClient.post('/api/v1/admin/webhook/test')
    logs.value.unshift({
      id: logId++,
      success: data.success,
      time: new Date().toLocaleTimeString('vi-VN'),
      message: data.message,
    })
    if (data.success) {
      ElMessage.success(data.message)
    } else {
      ElMessage.error(data.message)
    }
  } catch (err) {
    ElMessage.error(err?.response?.data?.message || 'Gửi tin thử thất bại!')
  } finally {
    testing.value = false
  }
}

onMounted(fetchStatus)
</script>
