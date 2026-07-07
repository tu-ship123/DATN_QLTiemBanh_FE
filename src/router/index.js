import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const routes = [
  // 1. ĐĂNG NHẬP
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { public: true }
  },

  // 2. KHÁCH HÀNG
  {
    path: '/shop',
    component: () => import('@/components/CustomerLayout.vue'),
    children: [
      {
        path: '',
        name: 'Shop',
        component: () => import('@/views/Shop.vue'),
        meta: { title: 'Cửa hàng', breadcrumb: ['Cửa hàng'] }
      },
      {
        path: 'products',
        name: 'ShopProducts',
        component: () => import('@/views/Products.vue'),
        meta: { title: 'Sản phẩm', breadcrumb: ['Cửa hàng', 'Sản phẩm'] }
      },
      {
        path: 'product/:id',
        name: 'ProductDetail',
        component: () => import('@/views/ProductDetail.vue'),
        meta: { title: 'Chi tiết sản phẩm', breadcrumb: ['Cửa hàng', 'Chi tiết sản phẩm'] }
      },
      {
        path: 'design',
        name: 'Design',
        component: () => import('@/views/Design.vue'),
        meta: { title: 'Thiết kế 3D', breadcrumb: ['Cửa hàng', 'Thiết kế 3D'] }
      },
      {
        path: 'contact',
        name: 'Contact',
        component: () => import('@/views/Contact.vue'),
        meta: { title: 'Liên hệ', breadcrumb: ['Cửa hàng', 'Liên hệ'] }
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/Cart.vue'),
        meta: { title: 'Giỏ hàng', breadcrumb: ['Cửa hàng', 'Giỏ hàng'] }
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('@/views/Checkout.vue'),
        meta: { title: 'Thanh toán', breadcrumb: ['Cửa hàng', 'Thanh toán'], requiresAuth: true, roles: ['ROLE_KHACH_HANG'] }
      },
      {
        path: 'orders',
        name: 'MyOrders',
        component: () => import('@/views/MyOrders.vue'),
        meta: { title: 'Đơn hàng của tôi', breadcrumb: ['Cửa hàng', 'Đơn hàng của tôi'], requiresAuth: true, roles: ['ROLE_KHACH_HANG'] }
      },
      {
        path: '/orders/:id',
        name: 'OrderDetail',
        component: () => import('@/views/OrderDetail.vue'),
        meta: { title: 'Chi tiết đơn hàng', breadcrumb: ['Cửa hàng', 'Chi tiết đơn hàng'], requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
        meta: { title: 'Hồ sơ của tôi', breadcrumb: ['Cửa hàng', 'Hồ sơ'], requiresAuth: true, roles: ['ROLE_KHACH_HANG'] }
      },
      {
        path: 'change-password',
        name: 'ChangePassword',
        component: () => import('@/views/ChangePassword.vue'),
        meta: { title: 'Đổi mật khẩu', breadcrumb: ['Cửa hàng', 'Hồ sơ', 'Đổi mật khẩu'], requiresAuth: true, roles: ['ROLE_KHACH_HANG'] }
      }
    ]
  },

  { path: '/', redirect: '/shop' },

  // 3. ADMIN
  {
    path: '/admin',
    component: () => import('@/components/AdminLayout.vue'),
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] },
    children: [
      { path: 'dashboard',   name: 'Dashboard',   component: () => import('@/views/Dashboard.vue'),       meta: { title: 'Tổng quan',               breadcrumb: ['Trang chủ', 'Tổng quan'] } },
      { path: 'orders',      name: 'Orders',      component: () => import('@/views/Orders.vue'),          meta: { title: 'Quản lý đơn hàng',        breadcrumb: ['Trang chủ', 'Đơn hàng'] } },
      { path: 'customers',   name: 'Customers',   component: () => import('@/views/Customers.vue'),       meta: { title: 'Khách hàng',               breadcrumb: ['Trang chủ', 'Khách hàng'] } },
      { path: 'categories',  name: 'Categories',  component: () => import('@/views/Categoryview.vue'),   meta: { title: 'Danh mục',                breadcrumb: ['Trang chủ', 'Danh mục'] } },
      { path: 'products',    name: 'Products',    component: () => import('@/views/Products.vue'),        meta: { title: 'Sản phẩm',                breadcrumb: ['Trang chủ', 'Sản phẩm'] } },
      { path: 'decor-items', name: 'DecorItems',  component: () => import('@/views/DecorItems.vue'),      meta: { title: 'Phụ kiện trang trí',      breadcrumb: ['Trang chủ', 'Phụ kiện trang trí'] } },
      { path: 'staff',       name: 'Staff',       component: () => import('@/views/Staff.vue'),           meta: { title: 'Nhân sự & Phân quyền',    breadcrumb: ['Trang chủ', 'Nhân sự'] } },
      { path: 'inventory',   name: 'Inventory',   component: () => import('@/views/Inventory.vue'),       meta: { title: 'Kho hàng',                breadcrumb: ['Trang chủ', 'Kho hàng'] } },
      { path: 'vouchers',    name: 'Vouchers',    component: () => import('@/views/Vouchers.vue'),        meta: { title: 'Voucher',                 breadcrumb: ['Trang chủ', 'Voucher'] } },
      { path: 'analytics',   name: 'Analytics',   component: () => import('@/views/Analytics.vue'),       meta: { title: 'Phân tích',               breadcrumb: ['Trang chủ', 'Phân tích'] } },
      { path: 'reviews',     name: 'Reviews',     component: () => import('@/views/Reviews.vue'),         meta: { title: 'Đánh giá',                breadcrumb: ['Trang chủ', 'Đánh giá'] } },
      { path: 'messages',    name: 'Messages',    component: () => import('@/views/Messages.vue'),        meta: { title: 'Tin nhắn',                breadcrumb: ['Trang chủ', 'Tin nhắn'] } },
      { path: 'settings',    name: 'Settings',    component: () => import('@/views/Settings.vue'),        meta: { title: 'Cài đặt',                 breadcrumb: ['Trang chủ', 'Cài đặt'] } },
      { path: 'audit-log',   name: 'AuditLog',    component: () => import('@/views/AuditLog.vue'),        meta: { title: 'Nhật ký hoạt động',       breadcrumb: ['Trang chủ', 'Cài đặt', 'Nhật ký hoạt động'] } }
    ]
  },

  // 4. STAFF
  {
    path: '/staff-area',
    component: () => import('@/components/StaffLayout.vue'),
    redirect: '/staff-area/checkin',
    meta: { requiresAuth: true, roles: ['ROLE_NHAN_VIEN', 'ROLE_ADMIN'] },
    children: [
      { path: 'checkin',  name: 'StaffCheckin',  component: () => import('@/views/Checkin.vue'),       meta: { title: 'Chấm công',              breadcrumb: ['Nhân viên', 'Chấm công'] } },
      { path: 'calendar', name: 'StaffCalendar', component: () => import('@/views/MyCalendar.vue'),    meta: { title: 'Lịch làm việc',          breadcrumb: ['Nhân viên', 'Lịch làm việc'] } },
      { path: 'pos',      name: 'StaffPOS',      component: () => import('@/views/POS.vue'),            meta: { title: 'Bán hàng tại quầy',      breadcrumb: ['Nhân viên', 'Bán hàng'] } },
      { path: 'orders',   name: 'StaffOrders',   component: () => import('@/views/StaffOrders.vue'),    meta: { title: 'Đơn hàng (Staff)',       breadcrumb: ['Nhân viên', 'Đơn hàng'] } },
      { path: 'products', name: 'StaffProducts', component: () => import('@/views/Products.vue'),       meta: { title: 'Sản phẩm (Staff)',       breadcrumb: ['Nhân viên', 'Sản phẩm'] } },
      { path: 'bakery',   name: 'BakeryOrders',  component: () => import('@/views/BakeryOrders.vue'),   meta: { title: 'Tiệm bánh – Xử lý đơn', breadcrumb: ['Nhân viên', 'Tiệm Bánh'] } },
      { path: 'shipper',   name: 'ShipperView',  component: () => import('@/views/ShipperView.vue'),  meta: { title: 'Shipper – Giao hàng',  breadcrumb: ['Nhân viên', 'Giao Hàng'] } },
      { path: 'end-shift', name: 'EndShift',      component: () => import('@/views/EndShift.vue'),      meta: { title: 'Kết ca – Báo cáo',     breadcrumb: ['Nhân viên', 'Kết Ca'] } }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Route công khai → cho qua ngay
  if (to.meta.public) {
    return next();
  }

  // Cần đăng nhập nhưng chưa có token → về trang login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login');
  }

  // Kiểm tra quyền theo danh sách roles trong meta
  if (to.meta.roles && to.meta.roles.length > 0) {
    const userRole = authStore.userRole; // VD: "ROLE_ADMIN"
    const hasPermission = to.meta.roles.some(r => userRole === r || userRole.includes(r.replace('ROLE_', '')));
    if (!hasPermission) {
      // Chuyển về trang phù hợp với quyền hiện tại
      if (authStore.isAdmin) return next('/admin/dashboard');
      if (authStore.isNhanVien) return next('/staff-area/checkin');
      return next('/login');
    }
  }

  next();
});

export default router;