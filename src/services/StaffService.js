import apiClient from './apiService';

const BASE = '/api/v1/admin/staff';

export const staffService = {
  /**
   * Lấy danh sách nhân viên (có thể truyền page/size để phân trang)
   * GET /api/v1/admin/staff
   */
  getAll(params = {}) {
    return apiClient.get(BASE, { params });
  },

  /**
   * Xem chi tiết 1 nhân viên
   * GET /api/v1/admin/staff/{id}
   */
  getById(id) {
    return apiClient.get(`${BASE}/${id}`);
  },

  /**
   * Tạo nhân viên mới — BE tự tạo mật khẩu ngẫu nhiên và gửi email First Login
   * POST /api/v1/admin/staff
   * @param {{ hoTen: string, email: string, soDienThoai: string, [key: string]: any }} data
   */
  create(data) {
    return apiClient.post(BASE, data);
  },

  /**
   * Cập nhật thông tin nhân viên
   * PUT /api/v1/admin/staff/{id}
   */
  update(id, data) {
    return apiClient.put(`${BASE}/${id}`, data);
  },

  /**
   * Vô hiệu hoá (khoá) nhân viên
   * DELETE /api/v1/admin/staff/{id}
   */
  deactivate(id) {
    return apiClient.delete(`${BASE}/${id}`);
  },

  /**
   * Tạo phân ca làm việc
   * POST /api/v1/admin/schedules
   * @param {{ ngayLamViec: string, caId: number, danhSachNhanVienId: number[] }} data
   */
  createSchedule(data) {
    return apiClient.post('/api/v1/admin/schedules', data);
  },

  /**
   * Xem bảng chấm công
   * GET /api/v1/admin/attendances
   * @param {{ thang: number, nam: number, nhanVienId?: number }} params
   */
  getAttendances(params = {}) {
    return apiClient.get('/api/v1/admin/attendances', { params });
  },
};