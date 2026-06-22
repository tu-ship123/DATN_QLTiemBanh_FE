import axios from 'axios';

const mockStore = {
  orders: [
    { id: 1, orderId: '#DH2047', customer: 'Nguyễn Minh Anh', product: 'Bánh cưới 2 tầng', date: '03/06/2026', status: 'Chờ nhận', amount: '4,200,000đ', note: 'Giao vào buổi chiều. Yêu cầu trang trí hoa tươi.' },
    { id: 2, orderId: '#DH2046', customer: 'Lê Hoàng', product: 'Bánh sinh nhật 3 tầng', date: '02/06/2026', status: 'Hoàn thành', amount: '1,800,000đ', note: 'Không ghi chú.' },
    { id: 3, orderId: '#DH2045', customer: 'Trần Thuỷ', product: 'Bánh 3D Custom – Mèo Shiba', date: '01/06/2026', status: 'Sản xuất', amount: '2,500,000đ', note: 'Thêm nhân vật dễ thương màu cam.' },
    { id: 4, orderId: '#DH2044', customer: 'Phạm Gia Hân', product: 'Hộp bánh Macaron', date: '31/05/2026', status: 'Đã giao', amount: '1,200,000đ', note: 'Đã giao cho khách hàng tại văn phòng.' }
  ],
  products: [
    { id: 1, name: 'Bánh Kem Dâu Tươi', category: 'Sinh nhật', stock: 12, price: '520,000đ', status: 'Còn hàng' },
    { id: 2, name: 'Bánh Mousse Chocolate', category: 'Mousse', stock: 8, price: '420,000đ', status: 'Còn hàng' },
    { id: 3, name: 'Bánh Tart Trái Cây', category: 'Tart', stock: 4, price: '280,000đ', status: 'Ít hàng' },
    { id: 4, name: 'Bánh Macaron Set', category: 'Set quà', stock: 0, price: '350,000đ', status: 'Hết hàng' }
  ],
  staff: [
    { id: 1, name: 'Trần Hương', role: 'Super Admin', email: 'tranhuong@polycake.com', phone: '090 123 4567', active: true },
    { id: 2, name: 'Nguyễn Minh', role: 'Quản lý bán hàng', email: 'nguyenminh@polycake.com', phone: '091 234 5678', active: true },
    { id: 3, name: 'Lê Thị Hoa', role: 'Nhân viên sản xuất', email: 'lethihhoa@polycake.com', phone: '092 345 6789', active: false }
  ]
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // Đã sửa lại thành địa chỉ Backend thật
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async config => {
  const url = config.url?.replace(/^\//, '');
  if (!url) return config;

  const parts = url.split('/');
  const resource = parts[0];
  const id = parts[1] ? Number(parts[1]) : null;

  if (!Object.prototype.hasOwnProperty.call(mockStore, resource)) {
    return config;
  }

  await delay(300);

  let data;
  if (config.method === 'get') {
    data = id ? mockStore[resource].find(item => item.id === id) || null : mockStore[resource];
  } else if (config.method === 'post') {
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const nextId = mockStore[resource].length ? Math.max(...mockStore[resource].map(item => item.id)) + 1 : 1;
    const newItem = { id: nextId, ...payload };
    mockStore[resource].push(newItem);
    data = newItem;
  } else if (config.method === 'put' || config.method === 'patch') {
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const index = mockStore[resource].findIndex(item => item.id === id);
    if (index !== -1) {
      mockStore[resource][index] = { ...mockStore[resource][index], ...payload };
      data = mockStore[resource][index];
    } else {
      data = null;
    }
  } else if (config.method === 'delete') {
    const index = mockStore[resource].findIndex(item => item.id === id);
    if (index !== -1) {
      const removed = mockStore[resource].splice(index, 1);
      data = removed[0];
    } else {
      data = null;
    }
  }

  const response = {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config
  };

  config.adapter = () => Promise.resolve(response);
  return config;
}, error => Promise.reject(error));

export default api;
