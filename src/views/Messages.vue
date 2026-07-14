<template>
  <section class="space-y-6">
    <!-- Header -->
    <div class="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold" style="color:#5C4428">Tin nhắn</h1>
          <p class="text-sm text-muted">Quản lý liên hệ và tin nhắn khách hàng</p>
        </div>
      </div>
    </div>

    <!-- Stats Row (tính từ dữ liệu thật) -->
    <div class="grid grid-cols-2 xl:grid-cols-2 gap-4">
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Tổng tin chưa đọc</div>
          <div class="text-3xl font-bold" style="color:#7A5C3A">{{ tongChuaDoc }}</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Khách hàng đã nhắn tin</div>
          <div class="text-3xl font-bold" style="color:#3B82F6">{{ conversations.length }}</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <!-- Messages List -->
      <div class="data-card xl:col-span-1" v-loading="loadingConvos">
        <div class="data-card-header">
          <h2 class="font-bold text-lg" style="color:#5C4428">Hộp thư đến</h2>
        </div>
        <div class="overflow-hidden max-h-[560px] overflow-y-auto">
          <div v-if="!loadingConvos && conversations.length === 0" class="p-8 text-center text-sm text-muted">
            Chưa có khách hàng nào nhắn tin.
          </div>
          <div
            v-for="c in conversations"
            :key="c.khachHangId"
            class="border-t border-[#FDF8F2] p-4 hover:bg-[#FFFBF5] transition cursor-pointer flex items-center gap-3"
            :class="c.khachHangId === activeId ? 'bg-[#FFFBF5]' : ''"
            @click="openConversation(c)"
          >
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0 bg-[#FDF6EC] text-[#7A5C3A]">
              {{ (c.tenKhachHang || '?').slice(0, 2).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-sm" style="color:#5C4428">{{ c.tenKhachHang }}</span>
                <span v-if="c.soTinChuaDoc > 0" class="w-2 h-2 rounded-full bg-blue-500"></span>
              </div>
              <p class="text-sm text-muted truncate">{{ c.tinNhanCuoi }}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <span class="text-xs text-muted block">{{ formatTime(c.thoiGian) }}</span>
              <span v-if="c.soTinChuaDoc > 0" class="badge" style="background:#DBEAFE;color:#2563EB;font-size:10px">{{ c.soTinChuaDoc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Conversation detail -->
      <div class="data-card xl:col-span-2 flex flex-col" style="min-height:560px">
        <div class="data-card-header">
          <h2 class="font-bold text-lg" style="color:#5C4428">
            {{ activeConvo ? activeConvo.tenKhachHang : 'Chọn một hội thoại' }}
          </h2>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-3" v-loading="loadingMessages">
          <div v-if="!activeId" class="text-center text-sm text-muted py-16">
            Chọn một khách hàng ở hộp thư đến để xem hội thoại.
          </div>
          <div
            v-for="m in messages"
            :key="m.id"
            class="flex"
            :class="m.tuCuaHang ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[70%] rounded-2xl px-4 py-2 text-sm"
              :class="m.tuCuaHang ? 'bg-[#7A5C3A] text-white' : 'bg-[#FFFBF5] text-[#5C4428] border border-[#EDE0CC]'"
            >
              {{ m.noiDung }}
              <div class="text-[10px] mt-1 opacity-70">{{ formatTime(m.ngayTao) }}</div>
            </div>
          </div>
        </div>
        <div v-if="activeId" class="p-3 border-t border-[var(--color-border)] flex gap-2">
          <el-input v-model="replyText" placeholder="Nhập tin nhắn trả lời..." @keyup.enter="sendReply" />
          <button class="btn-primary" @click="sendReply" :disabled="!replyText.trim() || sending">Gửi</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import apiClient from '@/services/apiService'

const conversations = ref([])
const messages = ref([])
const activeId = ref(null)
const activeConvo = ref(null)
const loadingConvos = ref(false)
const loadingMessages = ref(false)
const replyText = ref('')
const sending = ref(false)

const tongChuaDoc = computed(() => conversations.value.reduce((s, c) => s + (c.soTinChuaDoc || 0), 0))

function formatTime(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
}

async function fetchConversations() {
  loadingConvos.value = true
  try {
    const { data } = await apiClient.get('/api/v1/admin/messages/conversations')
    conversations.value = data || []
  } catch {
    ElMessage.error('Không thể tải hộp thư đến!')
  } finally {
    loadingConvos.value = false
  }
}

async function openConversation(c) {
  activeId.value = c.khachHangId
  activeConvo.value = c
  loadingMessages.value = true
  try {
    const { data } = await apiClient.get(`/api/v1/admin/messages/conversations/${c.khachHangId}`)
    messages.value = data || []
    if (c.soTinChuaDoc > 0) {
      await apiClient.put(`/api/v1/admin/messages/conversations/${c.khachHangId}/read`)
      c.soTinChuaDoc = 0
    }
  } catch {
    ElMessage.error('Không thể tải nội dung hội thoại!')
  } finally {
    loadingMessages.value = false
  }
}

async function sendReply() {
  if (!replyText.value.trim() || !activeId.value) return
  sending.value = true
  try {
    const { data } = await apiClient.post(`/api/v1/admin/messages/conversations/${activeId.value}/reply`, {
      noiDung: replyText.value.trim()
    })
    messages.value.push(data)
    if (activeConvo.value) {
      activeConvo.value.tinNhanCuoi = data.noiDung
      activeConvo.value.thoiGian = data.ngayTao
    }
    replyText.value = ''
  } catch {
    ElMessage.error('Gửi tin nhắn thất bại!')
  } finally {
    sending.value = false
  }
}

fetchConversations()
</script>
