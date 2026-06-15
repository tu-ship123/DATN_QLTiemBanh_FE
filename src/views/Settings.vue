<template>
  <section class="min-h-screen bg-slate-50 px-6 py-8">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[.24em] text-cake-500">Cài đặt</p>
        <h1 class="text-3xl font-semibold text-slate-900">Thiết lập cửa hàng</h1>
        <p class="mt-2 text-sm text-slate-500">Quản lý thông tin cửa hàng, bảo mật và thông báo trong cùng một giao diện gọn nhẹ.</p>
      </div>
      <el-button
        type="primary"
        class="rounded-3xl bg-gradient-to-r from-cake-500 to-orange-500 px-6 py-3 text-white shadow-sm shadow-cake-200"
        @click="saveSettings"
      >
        Lưu thay đổi
      </el-button>
    </div>

    <el-card class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item title="Thông tin cửa hàng" name="1">
          <el-form :model="form.storeInfo" label-width="140px" class="space-y-4">
            <el-form-item label="Tên cửa hàng">
              <el-input v-model="form.storeInfo.name" placeholder="Nhập tên cửa hàng" />
            </el-form-item>
            <el-form-item label="Email liên hệ">
              <el-input v-model="form.storeInfo.email" placeholder="hello@polycake.com" />
            </el-form-item>
            <el-form-item label="Số điện thoại">
              <el-input v-model="form.storeInfo.phone" placeholder="090 123 4567" />
            </el-form-item>
            <el-form-item label="Địa chỉ">
              <el-input v-model="form.storeInfo.address" placeholder="Nhập địa chỉ cửa hàng" />
            </el-form-item>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="Cấu hình bảo mật" name="2">
          <el-form :model="form.security" label-width="170px" class="space-y-4">
            <el-form-item label="Mật khẩu hiện tại">
              <el-input v-model="form.security.currentPassword" type="password" placeholder="••••••••" />
            </el-form-item>
            <el-form-item label="Mật khẩu mới">
              <el-input v-model="form.security.newPassword" type="password" placeholder="••••••••" />
            </el-form-item>
            <el-form-item label="Xác nhận mật khẩu">
              <el-input v-model="form.security.confirmPassword" type="password" placeholder="••••••••" />
            </el-form-item>
            <el-form-item label="Xác thực hai bước">
              <el-switch v-model="form.security.twoFactor" active-color="#fb923c" inactive-color="#d1d5db" />
            </el-form-item>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="Cấu hình thông báo" name="3">
          <el-form :model="form.notifications" label-width="170px" class="space-y-4">
            <el-form-item label="Thông báo đơn hàng">
              <el-switch v-model="form.notifications.orderUpdates" active-color="#fb923c" inactive-color="#d1d5db" />
            </el-form-item>
            <el-form-item label="Thông báo nhân sự">
              <el-switch v-model="form.notifications.staffAlerts" active-color="#fb923c" inactive-color="#d1d5db" />
            </el-form-item>
            <el-form-item label="Khuyến mãi & marketing">
              <el-switch v-model="form.notifications.marketing" active-color="#fb923c" inactive-color="#d1d5db" />
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';

const activeNames = ref(['1']);

const form = reactive({
  storeInfo: {
    name: 'Polycake Bakery',
    email: 'hello@polycake.com',
    phone: '090 123 4567',
    address: '123 Nguyễn Trãi, Quận 1'
  },
  security: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: true
  },
  notifications: {
    orderUpdates: true,
    staffAlerts: true,
    marketing: false
  }
});

const saveSettings = () => {
  ElMessage.success('Cài đặt đã được lưu thành công');
};
</script>
