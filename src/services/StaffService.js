import apiClient from './apiService';

const STAFF_BASE     = '/api/v1/admin/staff';
const SCHEDULE_BASE  = '/api/v1/admin/schedules';
const CA_BASE        = '/api/v1/admin/ca-lam-viec';
const MY_SCHED_BASE  = '/api/v1/staff/my-schedules';

export const staffService = {

  // ── Quản lý nhân viên ──────────────────────────────────────────────────────

  getAll(params = {}) {
    return apiClient.get(STAFF_BASE, { params });
  },

  getById(id) {
    return apiClient.get(`${STAFF_BASE}/${id}`);
  },

  create(data) {
    return apiClient.post(STAFF_BASE, data);
  },

  update(id, data) {
    return apiClient.put(`${STAFF_BASE}/${id}`, data);
  },

  deactivate(id) {
    return apiClient.delete(`${STAFF_BASE}/${id}`);
  },

  // ── Quản lý Ca Làm Việc (Admin CRUD) ──────────────────────────────────────

  /**
   * Lấy danh sách tất cả ca làm việc.
   * GET /api/v1/admin/ca-lam-viec
   * @returns {Promise} Array of CaLamViecResponse
   */
  getAllCaLamViec() {
    return apiClient.get(CA_BASE);
  },

  /**
   * Tạo ca làm việc mới.
   * POST /api/v1/admin/ca-lam-viec
   * @param {{ tenCa: string, gioBatDau: string, gioKetThuc: string }} data
   */
  createCaLamViec(data) {
    return apiClient.post(CA_BASE, data);
  },

  /**
   * Cập nhật ca làm việc.
   * PUT /api/v1/admin/ca-lam-viec/{id}
   */
  updateCaLamViec(id, data) {
    return apiClient.put(`${CA_BASE}/${id}`, data);
  },

  /**
   * Vô hiệu hoá ca làm việc.
   * DELETE /api/v1/admin/ca-lam-viec/{id}
   */
  deleteCaLamViec(id) {
    return apiClient.delete(`${CA_BASE}/${id}`);
  },

  // ── Phân Ca (Admin) ────────────────────────────────────────────────────────

  /**
   * Tạo phân ca cho nhân viên.
   * POST /api/v1/admin/schedules
   * @param {{ nhanVienId: number, caLamViecId: number, ngayLamViec: string, ghiChu?: string }} data
   */
  createSchedule(data) {
    return apiClient.post(SCHEDULE_BASE, data);
  },

  /**
   * Lấy lịch phân ca theo ngày (admin quản lý).
   * GET /api/v1/admin/schedules?date=2025-06-25
   * @param {string|null} date - định dạng YYYY-MM-DD, null = hôm nay
   */
  getSchedulesByDate(date = null) {
    const params = date ? { date } : {};
    return apiClient.get(SCHEDULE_BASE, { params });
  },

  /**
   * Huỷ phân ca.
   * DELETE /api/v1/admin/schedules/{id}
   */
  cancelSchedule(id) {
    return apiClient.delete(`${SCHEDULE_BASE}/${id}`);
  },

  /**
   * Lấy bảng chấm công tổng hợp (admin).
   * GET /api/v1/admin/attendances
   */
  getAttendances(params = {}) {
    return apiClient.get('/api/v1/admin/attendances', { params });
  },

  // ── Lịch ca của nhân viên (Staff view) ───────────────────────────────────

  /**
   * Nhân viên xem ca hôm nay của mình.
   * GET /api/v1/staff/my-schedules?date=2025-06-25
   * @param {string|null} date - YYYY-MM-DD, null = hôm nay
   */
  getMySchedules(date = null) {
    const params = date ? { date } : {};
    return apiClient.get(MY_SCHED_BASE, { params });
  },

  /**
   * Nhân viên xem lịch ca cả tuần.
   * GET /api/v1/staff/my-schedules/week?tuNgay=...&denNgay=...
   */
  getMySchedulesInRange(tuNgay, denNgay) {
    return apiClient.get(`${MY_SCHED_BASE}/week`, { params: { tuNgay, denNgay } });
  },
};
