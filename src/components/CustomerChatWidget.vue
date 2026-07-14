<template>
  <div class="chat-widget">
    <!-- Nút mở/đóng chat -->
    <button class="chat-fab" @click="toggleOpen" :title="isOpen ? 'Đóng tin nhắn' : 'Nhắn tin với cửa hàng'">
      <svg v-if="!isOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
      <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
      <span v-if="!isOpen && unreadHint" class="chat-fab-dot"></span>
    </button>

    <!-- Panel chat -->
    <Transition name="chat-pop">
      <div v-if="isOpen" class="chat-panel">
        <div class="chat-panel-header">
          <div>
            <div class="chat-panel-title">Nhắn tin với cửa hàng</div>
            <div class="chat-panel-sub">Chúng tôi thường phản hồi trong ít phút</div>
          </div>
        </div>

        <div class="chat-panel-body" ref="bodyRef" v-loading="loading">
          <div v-if="!loading && messages.length === 0" class="chat-empty">
            Hãy gửi tin nhắn đầu tiên cho chúng tôi — đội ngũ Chocopine luôn sẵn sàng hỗ trợ bạn!
          </div>
          <div
            v-for="m in messages"
            :key="m.id"
            class="chat-msg-row"
            :class="m.tuCuaHang ? 'from-shop' : 'from-me'"
          >
            <div class="chat-bubble">
              {{ m.noiDung }}
              <div class="chat-time">{{ formatTime(m.ngayTao) }}</div>
            </div>
          </div>
        </div>

        <div class="chat-panel-footer">
          <input
            v-model="draft"
            type="text"
            placeholder="Nhập tin nhắn..."
            @keyup.enter="handleSend"
            :disabled="sending"
          />
          <button class="chat-send-btn" @click="handleSend" :disabled="!draft.trim() || sending">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';
import { messagesService } from '@/services/messagesService';

const isOpen = ref(false);
const loading = ref(false);
const sending = ref(false);
const messages = ref([]);
const draft = ref('');
const bodyRef = ref(null);
const unreadHint = ref(false);

let pollTimer = null;

function formatTime(dt) {
  if (!dt) return '';
  return new Date(dt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
}

async function scrollToBottom() {
  await nextTick();
  if (bodyRef.value) {
    bodyRef.value.scrollTop = bodyRef.value.scrollHeight;
  }
}

async function fetchMessages({ silent = false } = {}) {
  if (!silent) loading.value = true;
  try {
    const { data } = await messagesService.getMyMessages();
    const prevCount = messages.value.length;
    messages.value = data || [];
    if (!isOpen.value && messages.value.length > prevCount) {
      unreadHint.value = true;
    }
    if (isOpen.value) scrollToBottom();
  } catch (err) {
    if (!silent) ElMessage.error('Không thể tải tin nhắn. Vui lòng thử lại sau!');
  } finally {
    if (!silent) loading.value = false;
  }
}

async function handleSend() {
  const noiDung = draft.value.trim();
  if (!noiDung) return;
  sending.value = true;
  try {
    const { data } = await messagesService.sendMessage(noiDung);
    messages.value.push(data);
    draft.value = '';
    scrollToBottom();
  } catch (err) {
    ElMessage.error('Gửi tin nhắn thất bại. Vui lòng thử lại!');
  } finally {
    sending.value = false;
  }
}

function toggleOpen() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    unreadHint.value = false;
    fetchMessages();
  }
}

onMounted(() => {
  // Kiểm tra định kỳ để phát hiện tin nhắn mới từ cửa hàng (không cần WebSocket)
  pollTimer = setInterval(() => fetchMessages({ silent: true }), 20000);
});

onBeforeUnmount(() => {
  if (pollTimer) clearInterval(pollTimer);
});
</script>

<style scoped>
.chat-widget {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 900;
}

.chat-fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, var(--wheat-brown, #7A5C3A), var(--wheat-brown-mid, #9A7650));
  color: #FFFBF5;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 28px rgba(92, 68, 40, 0.35);
  position: relative;
  transition: transform 0.2s ease;
}
.chat-fab:hover { transform: translateY(-2px) scale(1.03); }

.chat-fab-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #EF4444;
  border: 2px solid #FFFBF5;
}

.chat-panel {
  position: absolute;
  right: 0;
  bottom: 68px;
  width: 320px;
  max-width: calc(100vw - 48px);
  height: 420px;
  background: #FFFBF5;
  border-radius: 18px;
  border: 1px solid var(--wheat-brown-pale, #E8D9C4);
  box-shadow: 0 20px 50px rgba(92, 68, 40, 0.22);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-panel-header {
  padding: 14px 16px;
  background: linear-gradient(135deg, var(--wheat-brown, #7A5C3A), var(--wheat-brown-mid, #9A7650));
  color: #FFFBF5;
}
.chat-panel-title { font-weight: 800; font-size: 0.95rem; }
.chat-panel-sub { font-size: 0.72rem; opacity: 0.85; margin-top: 2px; }

.chat-panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-empty {
  text-align: center;
  font-size: 0.78rem;
  color: var(--wheat-brown-mid, #9A7650);
  padding: 24px 12px;
}

.chat-msg-row { display: flex; }
.chat-msg-row.from-me { justify-content: flex-end; }
.chat-msg-row.from-shop { justify-content: flex-start; }

.chat-bubble {
  max-width: 78%;
  padding: 8px 12px;
  border-radius: 14px;
  font-size: 0.82rem;
  line-height: 1.4;
}
.from-me .chat-bubble {
  background: var(--wheat-brown, #7A5C3A);
  color: #FFFBF5;
  border-bottom-right-radius: 4px;
}
.from-shop .chat-bubble {
  background: var(--wheat-brown-pale, #E8D9C4);
  color: var(--wheat-brown-dark, #5C4428);
  border-bottom-left-radius: 4px;
}
.chat-time {
  font-size: 0.62rem;
  opacity: 0.7;
  margin-top: 3px;
}

.chat-panel-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-top: 1px solid var(--wheat-brown-pale, #E8D9C4);
}
.chat-panel-footer input {
  flex: 1;
  border: 1px solid var(--wheat-brown-pale, #E8D9C4);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 0.82rem;
  outline: none;
  background: #fff;
}
.chat-panel-footer input:focus {
  border-color: var(--wheat-brown, #7A5C3A);
}
.chat-send-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: var(--wheat-brown, #7A5C3A);
  color: #FFFBF5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}
.chat-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-pop-enter-active, .chat-pop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.chat-pop-enter-from, .chat-pop-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
</style>
