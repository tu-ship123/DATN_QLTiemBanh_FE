/**
 * Định dạng số tiền theo chuẩn Việt Nam.
 * Ví dụ: formatPrice(150000) => "150.000 đ"
 * @param {number|string} n
 * @returns {string}
 */
export function formatPrice(n) {
  return Number(n || 0).toLocaleString('vi-VN') + ' đ'
}
