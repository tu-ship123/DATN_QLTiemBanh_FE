// realtimeService.js
// ─────────────────────────────────────────────────────────────────────────
// Kết nối tới WebSocket (STOMP qua SockJS) mà backend đã mở sẵn ở /ws-bakery
// (xem be/src/main/java/com/poly/cake/config/WebSocketConfig.java).
//
// Mục đích: khi Admin/Nhân viên đổi trạng thái đơn hàng, backend bắn 1 tin
// nhắn tới kênh riêng của khách (/user/queue/notifications) — FE lắng nghe
// kênh này để CẬP NHẬT DỮ LIỆU NGAY, không cần khách bấm F5 tải lại trang.
//
// Cần cài 2 package (chưa có trong project, phải thêm vào package.json):
//   npm install @stomp/stompjs sockjs-client
// ─────────────────────────────────────────────────────────────────────────

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthStore } from '@/stores/authStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const WS_URL = `${API_BASE}/ws-bakery`;

let stompClient = null;
let isConnecting = false;

// Danh sách các hàm callback đang lắng nghe thông báo realtime (đơn hàng đổi
// trạng thái, ...). Nhiều trang/component khác nhau có thể cùng đăng ký.
const listeners = new Set();

function baoChoCacListener(message) {
  listeners.forEach((cb) => {
    try {
      cb(message);
    } catch (e) {
      console.error('[realtimeService] Lỗi khi xử lý thông báo realtime:', e);
    }
  });
}

export const realtimeService = {
  /**
   * Mở kết nối WebSocket (nếu chưa có / chưa đăng nhập thì bỏ qua).
   * Gọi lại nhiều lần không sao — tự bỏ qua nếu đã kết nối rồi.
   */
  connect() {
    const authStore = useAuthStore();
    if (!authStore.accessToken) return;
    if (isConnecting || stompClient?.active) return;

    isConnecting = true;

    stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      reconnectDelay: 5000, // Mất mạng / rớt kết nối -> tự thử lại sau 5s
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        isConnecting = false;
        console.log('✅ [Realtime] Đã kết nối WebSocket');

        // Kênh riêng: thông báo đổi trạng thái đơn hàng của CHÍNH khách này
        stompClient.subscribe('/user/queue/notifications', (msg) => {
          baoChoCacListener(msg.body);
        });
      },

      onStompError: (frame) => {
        isConnecting = false;
        console.warn('[Realtime] Lỗi STOMP:', frame.headers?.message);
      },

      onWebSocketClose: () => {
        isConnecting = false;
      },
    });

    stompClient.activate();
  },

  /** Đóng kết nối (gọi khi logout để tránh giữ session WebSocket cũ). */
  disconnect() {
    if (stompClient) {
      stompClient.deactivate();
      stompClient = null;
    }
    isConnecting = false;
  },

  /**
   * Đăng ký lắng nghe thông báo realtime (VD: đổi trạng thái đơn hàng).
   * @param {(message: string) => void} callback
   * @returns {() => void} gọi hàm này để hủy đăng ký (nhớ gọi ở onBeforeUnmount)
   */
  onNotification(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
};