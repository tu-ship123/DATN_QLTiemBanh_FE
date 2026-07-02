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

        <!-- Cấu hình vận hành: form dựng động từ mảng operationalConfigs.
             Thêm/bớt 1 phần tử trong mảng là tự sinh thêm field, không cần sửa template. -->
        <el-collapse-item title="Cấu hình vận hành" name="2">
          <p class="mb-4 text-sm text-slate-400">
            Các thông số áp dụng cho toàn bộ đơn hàng. Dữ liệu hiện đang là dữ liệu mẫu, chưa kết nối API.
          </p>
          <el-form label-width="240px" class="space-y-4">
            <el-form-item
              v-for="cfg in operationalConfigs"
              :key="cfg.key"
              :label="cfg.label"
            >
              <el-input-number
                v-model="cfg.value"
                :min="cfg.min"
                :max="cfg.max"
                :step="cfg.step"
                controls-position="right"
                class="w-full max-w-xs"
              />
              <span v-if="cfg.suffix" class="ml-3 text-sm text-slate-400">{{ cfg.suffix }}</span>
              <p v-if="cfg.description" class="mt-1 text-xs text-slate-400">{{ cfg.description }}</p>
            </el-form-item>
          </el-form>
        </el-collapse-item>

        <el-collapse-item title="Cấu hình bảo mật" name="3">
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

        <el-collapse-item title="Cấu hình thông báo" name="4">
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
import { reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { settingsService } from '../services/settingsService';

const activeNames = ref(['1']);
const isLoading = ref(true);
const isSaving = ref(false);

const form = reactive({
  storeInfo: {
    name: 'Chocopine Bakery',
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

// key dùng để map với cột khoa_cau_hinh bên backend (bảng cau_hinh_he_thong).
// Lưu ý: backend chỉ UPDATE cấu hình đã tồn tại sẵn trong DB (chưa có API tạo mới),
// nên field nào chưa được seed sẵn trong DB sẽ giữ giá trị mặc định ở dưới và
// việc lưu (PUT) cho key đó sẽ báo lỗi "không tìm thấy cấu hình".
const operationalConfigs = reactive([
  { key: 'shipping_fee',        label: 'Phí vận chuyển',                 value: 20000,  min: 0, max: 200000,  step: 1000,  suffix: 'VNĐ', description: 'Áp dụng cho đơn hàng dưới ngưỡng miễn phí ship.' },
  { key: 'min_order_days',      label: 'Số ngày đặt hàng tối thiểu',     value: 2,      min: 0, max: 14,      step: 1,     suffix: 'ngày', description: 'Thời gian tối thiểu khách cần đặt trước khi nhận bánh.' },
  { key: 'free_ship_threshold', label: 'Miễn phí ship từ',               value: 300000, min: 0, max: 2000000, step: 10000, suffix: 'VNĐ', description: '' },
  { key: 'max_order_per_day',   label: 'Số đơn nhận tối đa / ngày',      value: 50,     min: 1, max: 500,     step: 1,     suffix: 'đơn', description: '' },
]);

// Map field storeInfo -> khoaCauHinh tương ứng (nếu backend có seed sẵn)
const STORE_INFO_KEYS = {
  name: 'store_name', email: 'store_email', phone: 'store_phone', address: 'store_address',
};

async function loadSettings() {
  isLoading.value = true;
  try {
    const res = await settingsService.getAllSettings();
    const rows = Array.isArray(res.data) ? res.data : [];
    const byKey = new Map(rows.map(r => [r.khoaCauHinh, r.giaTri]));

    operationalConfigs.forEach(cfg => {
      if (byKey.has(cfg.key)) {
        const num = Number(byKey.get(cfg.key));
        if (!Number.isNaN(num)) cfg.value = num;
      }
    });

    Object.entries(STORE_INFO_KEYS).forEach(([field, key]) => {
      if (byKey.has(key)) form.storeInfo[field] = byKey.get(key);
    });
  } catch (err) {
    console.warn('Không load được cấu hình hệ thống:', err.message);
    ElMessage.warning('Không thể tải cấu hình hệ thống từ server, đang hiển thị giá trị mặc định.');
  } finally {
    isLoading.value = false;
  }
}

const saveSettings = async () => {
  isSaving.value = true;
  const toSave = [
    ...operationalConfigs.map(cfg => ({ key: cfg.key, value: String(cfg.value) })),
    ...Object.entries(STORE_INFO_KEYS).map(([field, key]) => ({ key, value: form.storeInfo[field] })),
  ];

  const results = await Promise.allSettled(
    toSave.map(({ key, value }) => settingsService.updateSetting(key, value))
  );

  const failed = results.filter(r => r.status === 'rejected').length;
  if (failed === 0) {
    ElMessage.success('Cài đặt đã được lưu thành công');
  } else if (failed < results.length) {
    ElMessage.warning(`Đã lưu một phần. ${failed} cấu hình chưa tồn tại trên server nên không lưu được.`);
  } else {
    ElMessage.error('Không lưu được cấu hình. Vui lòng kiểm tra kết nối tới server.');
  }
  isSaving.value = false;
};

onMounted(loadSettings);
</script>