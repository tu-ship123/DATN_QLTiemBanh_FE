import apiClient from './apiService';

export const dashboardService = {
  /**
   * Lấy thống kê KPI tổng quan
   * Quyền: ADMIN
   * Trả về: { tongDoanhThu, tongDon, khachMoi, phanTramTangTruong, ... }
   */
  getKPI() {
    return apiClient.get('/api/v1/admin/dashboard');
  },

  /**
   * Lấy báo cáo doanh thu theo ngày
   * Quyền: ADMIN
   * Trả về: Array [{ ngay, doanhThu }, ...]
   */
  getRevenue() {
    return apiClient.get('/api/v1/admin/reports/revenue');
  },
};