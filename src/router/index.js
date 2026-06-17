import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // Quick preview route for Staff layout
  {
    path: '/staff-area',
    component: () => import('@/components/StaffLayout.vue'),
    redirect: '/staff-area/orders',
    children: [
      {
        path: 'orders',
        name: 'StaffOrders',
        component: () => import('@/views/Orders.vue'),
        meta: { title: 'Đơn hàng (Staff)', breadcrumb: ['Nhân viên', 'Đơn hàng'] }
      },
      {
        path: 'products',
        name: 'StaffProducts',
        component: () => import('@/views/Products.vue'),
        meta: { title: 'Sản phẩm (Staff)', breadcrumb: ['Nhân viên', 'Sản phẩm'] }
      }
    ]
  },

  // Customer-facing shop preview
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
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { public: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: () => import('@/components/AdminLayout.vue'),
    redirect: '/login',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: 'Tổng quan', breadcrumb: ['Trang chủ', 'Tổng quan'] }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/Orders.vue'),
        meta: { title: 'Quản lý đơn hàng', breadcrumb: ['Trang chủ', 'Đơn hàng'] }
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/Products.vue'),
        meta: { title: 'Sản phẩm', breadcrumb: ['Trang chủ', 'Sản phẩm'] }
      },
      {
        path: 'staff',
        name: 'Staff',
        component: () => import('@/views/Staff.vue'),
        meta: { title: 'Nhân sự & Phân quyền', breadcrumb: ['Trang chủ', 'Nhân sự'] }
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('@/views/Inventory.vue'),
        meta: { title: 'Kho hàng', breadcrumb: ['Trang chủ', 'Kho hàng'] }
      },
      {
        path: 'vouchers',
        name: 'Vouchers',
        component: () => import('@/views/Vouchers.vue'),
        meta: { title: 'Voucher', breadcrumb: ['Trang chủ', 'Voucher'] }
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('@/views/Analytics.vue'),
        meta: { title: 'Phân tích', breadcrumb: ['Trang chủ', 'Phân tích'] }
      },
      {
        path: 'reviews',
        name: 'Reviews',
        component: () => import('@/views/Reviews.vue'),
        meta: { title: 'Đánh giá', breadcrumb: ['Trang chủ', 'Đánh giá'] }
      },
      {
        path: 'messages',
        name: 'Messages',
        component: () => import('@/views/Messages.vue'),
        meta: { title: 'Tin nhắn', breadcrumb: ['Trang chủ', 'Tin nhắn'] }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue'),
        meta: { title: 'Cài đặt', breadcrumb: ['Trang chủ', 'Cài đặt'] }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router