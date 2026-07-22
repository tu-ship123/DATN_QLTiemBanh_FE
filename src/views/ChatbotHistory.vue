<template>
  <section class="space-y-6">
    <!-- Header -->
    <div class="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold" style="color:#5C4428">Lịch sử Trợ lý ảo</h1>
          <p class="text-sm text-muted">Xem lại các cuộc hội thoại giữa khách hàng và chatbot AI</p>
        </div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 xl:grid-cols-2 gap-4">
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Tổng số phiên chat</div>
          <div class="text-3xl font-bold" style="color:#7A5C3A">{{ conversations.length }}</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Tổng lượt hỏi-đáp</div>
          <div class="text-3xl font-bold" style="color:#3B82F6">{{ tongLuotChat }}</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <!-- Conversation list -->
      <div class="data-card xl:col-span-1" v-loading="loadingConvos">
        <div class="data-card-header">
          <h2 class="font-bold text-lg" style="color:#5C4428">Danh sách phiên chat</h2>
        </div>
        <div class="overflow-hidden max-h-[560px] overflow-y-auto">
          <div v-if="!loadingConvos && conversations.length === 0" class="p-8 text-center text-sm text-muted">
            Chưa có ai chat với trợ lý ảo.
          </div>
          <div
            v-for="c in conversations"
            :key="c.sessionId"
            class="border-t border-[#FDF8F2] p-4 hover:bg-[#FFFBF5] transition cursor-pointer flex items-center gap-3"
            :class="c.sessionId === activeId ? 'bg-[#FFFBF5]' : ''"
            @click="openConversation(c)"
          >
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0 bg-[#FDF6EC] text-[#7A5C3A]">
              {{ (c.tenKhachHang || 'KH').slice(0, 2).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-bold text-sm" style="color:#5C4428">{{ c.tenKhachHang || 'Khách vãng lai' }}</span>
                <span class="badge" style="background:#FDF6EC;color:#7A5C3A;font-size:10px">{{ c.soLuotChat }} lượt</span>
              </div>
              <p class="text-sm text-muted truncate">{{ c.cauHoiCuoi }}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <span class="text-xs text-muted block">{{ formatTime(c.thoiGian) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Conversation detail (read-only) -->
      <div class="data-card xl:col-span-2 flex flex-col" style="min-height:560px">
        <div class="data-card-header">
          <h2 class="font-bold text-lg" style="color:#5C4428">
            {{ activeConvo ? (activeConvo.tenKhachHang || 'Khách vãng lai') : 'Chọn một phiên chat' }}
          </h2>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-3" v-loading="loadingHistory">
          <div v-if="!activeId" class="text-center text-sm text-muted py-16">
            Chọn một phiên chat ở danh sách bên trái để xem toàn bộ hội thoại.
          </div>
          <template v-for="h in history" :key="h.id">
            <div class="flex justify-end">
              <div class="max-w-[70%] rounded-2xl px-4 py-2 text-sm bg-[#7A5C3A] text-white">
                {{ h.cauHoi }}
                <div class="text-[10px] mt-1 opacity-70">{{ formatTime(h.ngayTao) }}</div>
              </div>
            </div>
            <div class="flex justify-start">
              <div class="max-w-[70%] rounded-2xl px-4 py-2 text-sm bg-[#FFFBF5] text-[#5C4428] border border-[#EDE0CC]">
                {{ h.traLoi }}
              </div>
            </div>
          </template>
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
const history = ref([])
const activeId = ref(null)
const activeConvo = ref(null)
const loadingConvos = ref(false)
const loadingHistory = ref(false)

const tongLuotChat = computed(() => conversations.value.reduce((s, c) => s + (c.soLuotChat || 0), 0))

function formatTime(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
}

async function fetchConversations() {
  loadingConvos.value = true
  try {
    const { data } = await apiClient.get('/api/v1/admin/chatbot/conversations')
    conversations.value = data || []
  } catch {
    ElMessage.error('Không thể tải danh sách phiên chat!')
  } finally {
    loadingConvos.value = false
  }
}

async function openConversation(c) {
  activeId.value = c.sessionId
  activeConvo.value = c
  loadingHistory.value = true
  try {
    const { data } = await apiClient.get(`/api/v1/admin/chatbot/conversations/${encodeURIComponent(c.sessionId)}`)
    history.value = data || []
  } catch {
    ElMessage.error('Không thể tải nội dung hội thoại!')
  } finally {
    loadingHistory.value = false
  }
}

fetchConversations()
</script>
