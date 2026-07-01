/**
 * Danh sách mẫu bánh 3D dựng sẵn (hardcode ở FE, chưa cần backend).
 *
 * Mỗi mẫu gồm:
 *  - Thông tin hiển thị ở gallery (ten, moTa, icon, giaTuKhoang)
 *  - `thietKe`: cấu hình sẽ được đổ thẳng vào CakeBuilder3D.loadTemplate()
 *      + shape / size / tierCount / frostingColor / message / messageColor: giống hệt
 *        state nội bộ của CakeBuilder3D (xem captureSnapshot()).
 *      + accessories: danh sách phụ kiện mặc định đi kèm mẫu, mỗi phần tử:
 *          phuKienId : PHẢI khớp với `id` của phụ kiện trong danh sách đang tải
 *                      (hiện tại là FALLBACK_ACCESSORIES trong useDecorAccessories.js:
 *                      'fallback-1'..'fallback-5'). Khi nối API phụ kiện thật, chỉ cần
 *                      đổi các id này sang id thật trong DB — không phải sửa gì khác.
 *          tenPhuKien: dùng để CakeBuilder3D chọn đúng model 3D hiển thị (so khớp theo
 *                      từ khoá tên, xem buildMarkerMesh()).
 *          soLuong   : số lượng phụ kiện này gắn lên bánh.
 *          viTri     : mảng toạ độ {x,y,z} tương ứng từng phụ kiện (đơn vị world ~ bán
 *                      kính bánh 1 tầng ~0.75-0.8). Nếu thiếu toạ độ cho 1 phụ kiện thì
 *                      sẽ lấy lại toạ độ cuối cùng trong mảng.
 */

export const cakeTemplates = [
  {
    id: 'tmpl-bday-balloon',
    ten: 'Bánh sinh nhật bóng bay',
    moTa: 'Bánh tròn 1 tầng kem cam pastel, gắn nến số và topper chúc mừng.',
    icon: 'ph:balloon-duotone',
    giaTuKhoang: 495000, // giá tham khảo hiển thị ở thẻ mẫu, giá thật luôn tính lại theo builder
    thietKe: {
      shape: 'round',
      size: 'm',
      tierCount: 1,
      frostingColor: '#FBD9B0',
      message: 'Happy Birthday!',
      messageColor: '#7a4a2b',
      accessories: [
        {
          phuKienId: 'fallback-1',
          tenPhuKien: 'Nến số sinh nhật',
          soLuong: 2,
          viTri: [
            { x: -0.3, y: 0.62, z: 0.15 },
            { x: 0.3, y: 0.62, z: 0.15 },
          ],
        },
        {
          phuKienId: 'fallback-3',
          tenPhuKien: 'Topper "Happy Birthday"',
          soLuong: 1,
          viTri: [{ x: 0, y: 0.62, z: -0.25 }],
        },
      ],
    },
  },
  {
    id: 'tmpl-wedding-3tier',
    ten: 'Bánh cưới 3 tầng',
    moTa: 'Tháp bánh tròn 3 tầng tông kem sữa, phối hoa kem pastel sang trọng.',
    icon: 'ph:rings-duotone',
    giaTuKhoang: 970000,
    thietKe: {
      shape: 'round',
      size: 'l',
      tierCount: 3,
      frostingColor: '#FFF6E9',
      message: '',
      messageColor: '#7a4a2b',
      accessories: [
        {
          phuKienId: 'fallback-2',
          tenPhuKien: 'Hoa kem hồng pastel',
          soLuong: 4,
          viTri: [
            { x: -0.4, y: 0.5, z: 0.3 },
            { x: 0.4, y: 0.5, z: 0.3 },
            { x: -0.25, y: 0.9, z: 0 },
            { x: 0.25, y: 0.9, z: 0 },
          ],
        },
      ],
    },
  },
  {
    id: 'tmpl-heart-love',
    ten: 'Bánh trái tim tỏ tình',
    moTa: 'Khung trái tim ngọt ngào, điểm xuyết trái cây tươi và macaron.',
    icon: 'ph:heart-duotone',
    giaTuKhoang: 460000,
    thietKe: {
      shape: 'heart',
      size: 's',
      tierCount: 1,
      frostingColor: '#F7C6D0',
      message: 'Love You',
      messageColor: '#a13a53',
      accessories: [
        {
          phuKienId: 'fallback-4',
          tenPhuKien: 'Trái cây tươi trang trí',
          soLuong: 3,
          viTri: [
            { x: -0.25, y: 0.6, z: 0.2 },
            { x: 0.25, y: 0.6, z: 0.2 },
            { x: 0, y: 0.6, z: -0.3 },
          ],
        },
        {
          phuKienId: 'fallback-2',
          tenPhuKien: 'Hoa kem hồng pastel',
          soLuong: 1,
          viTri: [{ x: 0, y: 0.62, z: 0.35 }],
        },
      ],
    },
  },
  {
    id: 'tmpl-choco-square',
    ten: 'Bánh vuông socola Oreo',
    moTa: 'Bánh vuông 2 tầng socola đậm vị, phủ bánh quy Oreo giòn tan.',
    icon: 'ph:square-duotone',
    giaTuKhoang: 640000,
    thietKe: {
      shape: 'square',
      size: 'm',
      tierCount: 2,
      frostingColor: '#6B4A34',
      message: '',
      messageColor: '#f5e6d8',
      accessories: [
        {
          phuKienId: 'fallback-5',
          tenPhuKien: 'Bánh quy Oreo',
          soLuong: 4,
          viTri: [
            { x: -0.35, y: 0.5, z: -0.35 },
            { x: 0.35, y: 0.5, z: -0.35 },
            { x: -0.35, y: 0.5, z: 0.35 },
            { x: 0.35, y: 0.5, z: 0.35 },
          ],
        },
      ],
    },
  },
]
