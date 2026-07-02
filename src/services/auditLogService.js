import apiClient from './apiService';

export const auditLogService = {
  /**
   * Lấy nhật ký hệ thống (chỉ các hành động UPDATE / DELETE / SOFT_DELETE).
   * GET /api/v1/admin/audit-logs
   */
  getSensitiveLogs() {
    return apiClient.get('/api/v1/admin/audit-logs');
  },
};
