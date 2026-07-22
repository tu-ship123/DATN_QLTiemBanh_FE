<template>
  <div class="ai-chat-widget">
    <!-- Nút mở/đóng trợ lý ảo -->
    <button class="ai-fab" @click="toggleOpen" :title="isOpen ? 'Đóng trợ lý ảo' : 'Hỏi trợ lý ảo'">
      <svg v-if="!isOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2a2 2 0 0 1 2 2v1h1a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h1V4a2 2 0 0 1 2-2z"/>
        <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none"/>
        <circle cx="15" cy="9" r="1" fill="currentColor" stroke="none"/>
        <path d="M8 21v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="4" y1="10" x2="4" y2="13"/>
        <line x1="20" y1="10" x2="20" y2="13"/>
      </svg>
      <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>

    <!-- Panel trợ lý ảo -->
    <Transition name="ai-pop">
      <div v-if="isOpen" class="ai-panel">
        <div class="ai-panel-header">
          <div>
            <div class="ai-panel-title">✨ Trợ lý ảo Chocopine</div>
            <div class="ai-panel-sub">Tư vấn bánh, chính sách, đặt hàng...</div>
          </div>
        </div>

        <div class="ai-privacy-note">
          Cuộc trò chuyện có thể được lưu lại để cải thiện dịch vụ.
        </div>

        <div class="ai-panel-body" ref="bodyRef">
          <div v-if="messages.length === 0" class="ai-empty">
            Chào bạn! 👋 Mình là trợ lý ảo, hỏi mình về menu, giá, chính sách đặt bánh
            hoặc cách tự thiết kế bánh 3D nhé.
          </div>
          <div
            v-for="m in messages"
            :key="m.id"
            class="ai-msg-row"
            :class="m.fromBot ? 'from-bot' : 'from-me'"
          >
            <div class="ai-bubble" v-html="m.html"></div>
          </div>
          <div v-if="thinking" class="ai-msg-row from-bot">
            <div class="ai-bubble ai-thinking">Đang trả lời...</div>
          </div>
        </div>

        <div class="ai-panel-footer">
          <input
            v-model="draft"
            type="text"
            placeholder="Nhập câu hỏi..."
            @keyup.enter="handleSend"
            :disabled="thinking"
          />
          <button class="ai-send-btn" @click="handleSend" :disabled="!draft.trim() || thinking">
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
import { ref, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { chatbotService } from '@/services/chatbotService';

const isOpen = ref(false);
const thinking = ref(false);
const messages = ref([]);
const draft = ref('');
const bodyRef = ref(null);
let nextId = 1;

// Escape HTML cơ bản trước khi hiển thị (tránh XSS vì trả lời AI có thể chứa ký tự lạ)
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Render xuống dòng đơn giản (\n -> <br>) cho câu trả lời của bot
function toHtml(text) {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

async function scrollToBottom() {
  await nextTick();
  if (bodyRef.value) {
    bodyRef.value.scrollTop = bodyRef.value.scrollHeight;
  }
}

function toggleOpen() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) scrollToBottom();
}

async function handleSend() {
  const text = draft.value.trim();
  if (!text) return;

  messages.value.push({ id: nextId++, fromBot: false, html: toHtml(text) });
  draft.value = '';
  thinking.value = true;
  scrollToBottom();

  try {
    const { data } = await chatbotService.ask(text);
    messages.value.push({ id: nextId++, fromBot: true, html: toHtml(data.response) });
  } catch (err) {
    ElMessage.error('Trợ lý ảo hiện không phản hồi được. Vui lòng thử lại sau!');
    messages.value.push({
      id: nextId++,
      fromBot: true,
      html: toHtml('⚠️ Mình đang gặp sự cố kết nối. Bạn thử lại sau hoặc nhắn trực tiếp cho cửa hàng nhé!'),
    });
  } finally {
    thinking.value = false;
    scrollToBottom();
  }
}
</script>

<style scoped>
.ai-chat-widget {
  position: fixed;
  left: 24px;
  bottom: 24px;
  z-index: 900;
}

.ai-fab {
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
  transition: transform 0.2s ease;
}
.ai-fab:hover { transform: translateY(-2px) scale(1.03); }

.ai-panel {
  position: absolute;
  left: 0;
  bottom: 68px;
  width: 340px;
  max-width: calc(100vw - 48px);
  height: 440px;
  background: #FFFBF5;
  border-radius: 18px;
  border: 1px solid var(--wheat-brown-pale, #E8D9C4);
  box-shadow: 0 20px 50px rgba(92, 68, 40, 0.22);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ai-panel-header {
  padding: 14px 16px;
  background: linear-gradient(135deg, var(--wheat-brown, #7A5C3A), var(--wheat-brown-mid, #9A7650));
  color: #FFFBF5;
}
.ai-panel-title { font-weight: 800; font-size: 0.95rem; }
.ai-panel-sub { font-size: 0.72rem; opacity: 0.85; margin-top: 2px; }

.ai-privacy-note {
  font-size: 0.68rem;
  color: var(--wheat-brown-mid, #9A7650);
  background: var(--wheat-brown-pale, #E8D9C4);
  padding: 5px 12px;
  text-align: center;
  border-bottom: 1px solid rgba(0,0,0,0.04);
}

.ai-panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai-empty {
  text-align: center;
  font-size: 0.78rem;
  color: var(--wheat-brown-mid, #9A7650);
  padding: 24px 12px;
}

.ai-msg-row { display: flex; }
.ai-msg-row.from-me { justify-content: flex-end; }
.ai-msg-row.from-bot { justify-content: flex-start; }

.ai-bubble {
  max-width: 82%;
  padding: 8px 12px;
  border-radius: 14px;
  font-size: 0.82rem;
  line-height: 1.45;
}
.from-me .ai-bubble {
  background: var(--wheat-brown, #7A5C3A);
  color: #FFFBF5;
  border-bottom-right-radius: 4px;
}
.from-bot .ai-bubble {
  background: var(--wheat-brown-pale, #E8D9C4);
  color: var(--wheat-brown-dark, #5C4428);
  border-bottom-left-radius: 4px;
}
.ai-thinking { font-style: italic; opacity: 0.8; }

.ai-panel-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-top: 1px solid var(--wheat-brown-pale, #E8D9C4);
}
.ai-panel-footer input {
  flex: 1;
  border: 1px solid var(--wheat-brown-pale, #E8D9C4);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 0.82rem;
  outline: none;
  background: #fff;
}
.ai-panel-footer input:focus {
  border-color: var(--wheat-brown, #7A5C3A);
}
.ai-send-btn {
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
.ai-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-pop-enter-active, .ai-pop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.ai-pop-enter-from, .ai-pop-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
</style>
