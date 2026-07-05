import { defineStore } from 'pinia';
import { staffService } from '../services/staffService';

// ── Helper: lấy 2 chữ cái đầu từ họ tên ──────────────────────────────────────
const getInitials = (hoTen = '') =>
  hoTen.trim().split(/\s+/).map((w) => w[0]).join('').slice(-2).toUpperCase();

// ── Helper: màu avatar theo vai trò ──────────────────────────────────────────
const AVATAR_PALETTE = [
  { bg: 'linear-gradient(135deg,#7A5C3A,#FBB830)', color: '#FFF' },
  { bg: '#EFF6FF', color: '#3B82F6' },
  { bg: '#F0FDF4', color: '#22C55E' },
  { bg: '#F5F3FF', color: '#7C3AED' },
  { bg: '#FFFBEB', color: '#F59E0B' },
  { bg: '#FFF0F5', color: '#EC4899' },
];
const pickPalette = (id) => AVATAR_PALETTE[id % AVATAR_PALETTE.length];

// ── Chuẩn hoá 1 nhân viên từ BE sang format mà component dùng ─────────────
const normalizeStaff = (s) => {
  const palette = pickPalette(s.id ?? 0);
  return {
    id:            s.id,
    name:          s.hoTen        ?? s.name         ?? '',
    email:         s.email        ?? '',
    phone:         s.soDienThoai  ?? s.phone        ?? '',
    role:          s.vaiTro       ?? s.role         ?? s.quyen ?? '',
    active:        s.hoatDong     ?? s.active       ?? true,
    joinDate:      s.ngayVaoLam   ?? s.joinDate     ?? '',
    ordersHandled: s.soLuongDonXuLy ?? s.ordersHandled ?? 0,
    performance:   s.hieuSuat       ?? s.performance   ?? 0,
    initials:      getInitials(s.hoTen ?? s.name ?? ''),
    avatarBg:      palette.bg,
    avatarColor:   palette.color,
    _raw:          s,
  };
};

export const useStaffStore = defineStore('staff', {
  state: () => ({
    staffList:   [],    // danh sách đã được normalise
    currentStaff: null, // nhân viên đang xem / sửa
    loading:     false,
    submitting:  false, // riêng cho form thêm/sửa để không block cả trang
    error:       null,
  }),

  getters: {
    totalStaff:  (state) => state.staffList.length,
    activeStaff: (state) => state.staffList.filter((s) => s.active),
  },

  actions: {
    // ── 1. Lấy danh sách ────────────────────────────────────────────────────
    async fetchAll(params = {}) {
      this.loading = true;
      this.error   = null;
      try {
        const res = await staffService.getAll(params);
        // BE có thể trả { content: [...] } (Page) hoặc thẳng mảng
        const raw = Array.isArray(res.data) ? res.data : (res.data?.content ?? []);
        this.staffList = raw.map(normalizeStaff);
      } catch (err) {
        this.error = err.response?.data?.message ?? 'Không thể tải danh sách nhân viên.';
        console.error('[StaffStore] fetchAll:', err);
      } finally {
        this.loading = false;
      }
    },

    // ── 2. Lấy chi tiết ─────────────────────────────────────────────────────
    async fetchById(id) {
      this.loading = true;
      this.error   = null;
      try {
        const res = await staffService.getById(id);
        this.currentStaff = normalizeStaff(res.data);
        return this.currentStaff;
      } catch (err) {
        this.error = err.response?.data?.message ?? 'Không thể tải thông tin nhân viên.';
        console.error('[StaffStore] fetchById:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // ── 3. Tạo nhân viên mới ────────────────────────────────────────────────
    async createStaff(formData) {
      this.submitting = true;
      this.error      = null;
      try {
        // Map tên field từ form UI → tên field BE mong muốn
        const payload = {
          hoTen:       formData.name    || formData.hoTen,
          email:       formData.email,
          soDienThoai: formData.phone   || formData.soDienThoai,
          vaiTro:      formData.role    || formData.vaiTro,
          // Nếu BE hỗ trợ mật khẩu tạm thì truyền, không bắt buộc
          ...(formData.password ? { matKhau: formData.password } : {}),
        };
        const res = await staffService.create(payload);
        const newStaff = normalizeStaff(res.data);
        this.staffList.unshift(newStaff); // Thêm vào đầu danh sách
        return { success: true, data: newStaff };
      } catch (err) {
        // Ưu tiên hiện lỗi field cụ thể (VD: "Email đã được sử dụng!", "Số điện thoại không hợp lệ")
        // thay vì chỉ hiện câu chung chung "Dữ liệu không hợp lệ!"
        const data = err.response?.data;
        const fieldError = data?.errors ? Object.values(data.errors)[0] : null;
        const msg = fieldError ?? data?.message ?? 'Không thể tạo nhân viên.';
        this.error = msg;
        return { success: false, message: msg };
      } finally {
        this.submitting = false;
      }
    },

    // ── 4. Cập nhật nhân viên ────────────────────────────────────────────────
    async updateStaff(id, formData) {
      this.submitting = true;
      this.error      = null;
      try {
        const payload = {
          hoTen:       formData.name    || formData.hoTen,
          email:       formData.email,
          soDienThoai: formData.phone   || formData.soDienThoai,
          vaiTro:      formData.role    || formData.vaiTro,
          hoatDong:    formData.active  ?? formData.hoatDong,
        };
        const res = await staffService.update(id, payload);
        const updated = normalizeStaff(res.data);
        // Cập nhật ngay trong list
        const idx = this.staffList.findIndex((s) => s.id === id);
        if (idx !== -1) this.staffList[idx] = updated;
        return { success: true, data: updated };
      } catch (err) {
        const data = err.response?.data;
        const fieldError = data?.errors ? Object.values(data.errors)[0] : null;
        const msg = fieldError ?? data?.message ?? 'Cập nhật thất bại.';
        this.error = msg;
        return { success: false, message: msg };
      } finally {
        this.submitting = false;
      }
    },

    // ── 5. Vô hiệu hoá nhân viên ────────────────────────────────────────────
    async deactivateStaff(id) {
      this.submitting = true;
      this.error      = null;
      try {
        await staffService.deactivate(id);
        // Đánh dấu inactive trong list (không xoá khỏi UI)
        const idx = this.staffList.findIndex((s) => s.id === id);
        if (idx !== -1) this.staffList[idx].active = false;
        return { success: true };
      } catch (err) {
        const msg = err.response?.data?.message ?? 'Vô hiệu hoá thất bại.';
        this.error = msg;
        return { success: false, message: msg };
      } finally {
        this.submitting = false;
      }
    },
  },
});