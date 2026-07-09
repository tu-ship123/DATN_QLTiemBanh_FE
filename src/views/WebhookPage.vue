<template>
  <section class="min-h-screen bg-slate-50 px-6 py-8">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[.24em] text-cake-500">Hệ thống</p>
        <h1 class="text-3xl font-semibold text-slate-900">Cấu hình Webhook</h1>
        <p class="mt-2 text-sm text-slate-500">Nhận thông báo tự động đến hệ thống ngoài khi có sự kiện xảy ra.</p>
      </div>
      <span
        class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
        :class="config.enabled ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'"
      >
        <span class="w-2 h-2 rounded-full" :class="config.enabled ? 'bg-green-500 animate-pulse' : 'bg-slate-400'"></span>
        {{ config.enabled ? 'Đang bật' : 'Đang tắt' }}
      </span>
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <!-- Config form -->
      <el-card class="rounded-[28px] border border-slate-200 shadow-sm xl:col-span-1" body-class="p-6">
        <template #header>
          <div class="flex items-center gap-2">
            <iconify-icon icon="ph:webhooks-logo-duotone" class="text-xl text-cake-500" />
            <h3 class="font-semibold text-slate-800">Thông tin Webhook</h3>
          </div>
        </template>

        <el-form :model="config" label-position="top" class="space-y-1">
          <el-form-item label="Bật webhook">
            <el-switch v-model="config.enabled" active-color="#fb923c" inactive-color="#d1d5db" />
          </el-form-item>

          <el-form-item label="Endpoint URL">
            <el-input v-model="config.url" placeholder="https://example.com/webhook/nhan-thong-bao" />
          </el-form-item>

          <el-form-item label="Token xác thực (Secret)">
            <el-input v-model="config.token" :type="showToken ? 'text' : 'password'" placeholder="Nhập token bí mật">
              <template #suffix>
                <iconify-icon
                  :icon="showToken ? 'ph:eye-slash-duotone' : 'ph:eye-duotone'"
                  class="cursor-pointer text-slate-400"
                  @click="showToken = !showToken"
                />
              </template>
            </el-input>
            <p class="mt-1 text-xs text-slate-400">Token sẽ được gửi kèm trong header <code class="bg-slate-100 px-1 rounded">X-Webhook-Token</code></p>
          </el-form-item>

          <el-form-item label="Sự kiện đăng ký">
            <div class="space-y-2 w-full">
              <label v-for="e in config.events.list" :key="e.key" class="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
                <span class="text-sm text-slate-600">{{ e.label }}</span>
                <el-switch v-model="e.checked" active-color="#fb923c" inactive-color="#d1d5db" size="small" />
              </label>
            </div>
          </el-form-item>

          <div class="flex gap-2 pt-2">
            <el-button
              type="primary"
              class="flex-1 rounded-xl bg-gradient-to-r from-cake-500 to-orange-500 border-none shadow-sm shadow-cake-200"
              :loading="saving"
              @click="saveConfig"
            >
              Lưu cấu hình
            </el-button>
            <el-button class="flex-1 rounded-xl" :loading="testing" @click="sendTest">
              <iconify-icon icon="ph:paper-plane-tilt-duotone" class="mr-2 text-lg" />
              Gửi tin thử
            </el-button>
          </div>
        </el-form>
      </el-card>

      <!-- Test log -->
      <el-card class="rounded-[28px] border border-slate-200 shadow-sm xl:col-span-2" body-class="p-0">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-semibold text-slate-800">Lịch sử gửi thử</h3>
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
                  {{ log.success ? `${log.statusCode} OK` : `${log.statusCode} Lỗi` }}
                </el-tag>
                <span class="text-xs text-slate-400">{{ log.time }} · {{ log.latency }}ms</span>
              </div>
              <span class="text-xs font-mono text-slate-400 truncate max-w-[220px]">{{ log.url }}</span>
            </div>
            <pre class="rounded-xl bg-slate-900 text-slate-100 text-xs p-4 overflow-x-auto"><code>{{ log.payload }}</code></pre>
          </div>
        </div>
      </el-card>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const saving = ref(false)
const testing = ref(false)
const showToken = ref(false)

const config = reactive({
  enabled: true,
  url: 'https://hooks.example.com/bakery/orders',
  token: 'whsec_5f8d3a2b9c1e4f7a',
  events: {
    list: [
      { key: 'order_created', label: 'Đơn hàng mới', checked: true },
      { key: 'order_paid',    label: 'Thanh toán thành công', checked: true },
      { key: 'order_status',  label: 'Cập nhật trạng thái đơn hàng', checked: false },
      { key: 'stock_low',     label: 'Cảnh báo tồn kho thấp', checked: false },
    ],
  },
})

const logs = ref([])
let logId = 1

function saveConfig() {
  if (!config.url) {
    ElMessage.warning('Vui lòng nhập Endpoint URL')
    return
  }
  saving.value = true
  setTimeout(() => {
    saving.value = false
    ElMessage.success('Đã lưu cấu hình webhook')
  }, 600)
}

function sendTest() {
  if (!config.url) {
    ElMessage.warning('Vui lòng nhập Endpoint URL trước khi gửi thử')
    return
  }
  if (!config.token) {
    ElMessage.warning('Vui lòng nhập token xác thực trước khi gửi thử')
    return
  }
  testing.value = true
  setTimeout(() => {
    const success = Math.random() > 0.15
    const payload = {
      event: 'test.ping',
      timestamp: new Date().toISOString(),
      data: { message: 'Đây là tin nhắn thử từ hệ thống Bakery Admin', orderId: null },
    }
    logs.value.unshift({
      id: logId++,
      success,
      statusCode: success ? 200 : 500,
      latency: Math.round(80 + Math.random() * 250),
      time: new Date().toLocaleTimeString('vi-VN'),
      url: config.url,
      payload: JSON.stringify(payload, null, 2),
    })
    testing.value = false
    if (success) {
      ElMessage.success('Gửi tin thử thành công! Endpoint đã phản hồi 200 OK')
    } else {
      ElMessage.error('Gửi tin thử thất bại. Vui lòng kiểm tra lại URL / token')
    }
  }, 900)
}
</script>
