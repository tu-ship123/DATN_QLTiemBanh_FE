import apiClient from './apiService';

const BASE = '/api/v1/admin/settings';

export const settingsService = {
  /** Lấy toàn bộ cấu hình hệ thống (key-value) */
  getAllSettings() {
    return apiClient.get(BASE);
  },

  /** Cập nhật giá trị 1 cấu hình theo khoaCauHinh (BE chỉ UPDATE, không tạo mới) */
  updateSetting(khoaCauHinh, giaTri) {
    return apiClient.put(`${BASE}/${khoaCauHinh}`, { giaTri });
  },
};
