<template> 
 <div>
   <div class="auth-page-wrapper">
    <div class="container" :class="{ 'right-panel-active': isSignUp }">
      
      <div class="form-container sign-up-container">
        <form @submit.prevent="handleRegister">
          <h1>Tạo tài khoản</h1>
          <span class="subtitle">Đăng ký thành viên Polycake</span>
          
          <el-input v-model="registerForm.hoTen" placeholder="Họ và tên" required />
          <el-input v-model="registerForm.email" type="email" placeholder="Email" required />
          <el-input v-model="registerForm.soDienThoai" placeholder="Số điện thoại" required />
          <el-input v-model="registerForm.matKhau" type="password" placeholder="Mật khẩu" show-password required />
          
          <el-button type="primary" native-type="submit" :loading="isLoading" class="submit-btn">
            Đăng ký
          </el-button>
        </form>
      </div>

      <div class="form-container sign-in-container">
        <form @submit.prevent="handleLogin">
          <h1>Đăng nhập</h1>
          <span class="subtitle">Sử dụng tài khoản của bạn</span>
          
          <el-input v-model="loginForm.email" type="email" placeholder="Email" required />
          <el-input v-model="loginForm.matKhau" type="password" placeholder="Mật khẩu" show-password required />
          
          <a href="#" class="forgot-password" @click.prevent="showForgotPassword">Quên mật khẩu?</a>
          
          <el-button type="primary" native-type="submit" :loading="isLoading" class="submit-btn">
            Đăng nhập
          </el-button>
        </form>
      </div>

      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>Chào mừng trở lại!</h1>
            <p>Để duy trì kết nối với Polycake, vui lòng đăng nhập bằng thông tin cá nhân của bạn.</p>
            <el-button plain class="ghost-btn" @click="isSignUp = false">Đăng nhập</el-button>
          </div>
          
          <div class="overlay-panel overlay-right">
            <h1>Chào bạn mới!</h1>
            <p>Nhập thông tin cá nhân và bắt đầu hành trình thưởng thức bánh ngon cùng chúng tôi.</p>
            <el-button plain class="ghost-btn" @click="isSignUp = true">Đăng ký</el-button>
          </div>
        </div>
      </div>

    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="Khôi phục mật khẩu" width="400px" center align-center>
      <div style="text-align: center; margin-bottom: 20px; font-size: 14px; color: #666;">
        Vui lòng nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi cho bạn hướng dẫn để đặt lại mật khẩu.
      </div>
      <el-input v-model="forgotEmail" type="email" placeholder="Nhập email của bạn" size="large" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button type="primary" @click="handleForgotPassword" :loading="isForgotLoading" style="background-color: #d88c51; border-color: #d88c51;">
            Gửi yêu cầu
          </el-button>
        </span>
      </template>
    </el-dialog></div>
 
    
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../stores/authStore'; 
import { authService } from '../services/authService'; // Sử dụng Service thay vì apiClient trực tiếp

const router = useRouter();
const authStore = useAuthStore();

// Trạng thái giao diện
const isSignUp = ref(false);
const isLoading = ref(false);

// State Quên mật khẩu
const dialogVisible = ref(false);
const forgotEmail = ref('');
const isForgotLoading = ref(false);

// Dữ liệu Form
const loginForm = reactive({ email: '', matKhau: '' });
const registerForm = reactive({ hoTen: '', email: '', soDienThoai: '', matKhau: '' });

// --- XỬ LÝ GỌI API ---

// 1. GỌI API ĐĂNG NHẬP
const handleLogin = async () => {
  isLoading.value = true;
  try {
    const response = await authService.login(loginForm);
    
    authStore.setAuthData(response.data);
    
    if (response.data.user) {
      authStore.setUser(response.data.user);
    } else {
      authStore.setUser({ email: loginForm.email });
    }

    ElMessage.success('Đăng nhập thành công!');

    // Redirect theo role
    const role = response.data.user?.role || response.data.role;
    
    if (role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else if (role === 'STAFF') {
      router.push('/staff-area/orders');
    } else {
      router.push('/shop');
    }

  } catch (error) {
    ElMessage.error(error.response?.data?.message || error.response?.data || 'Đăng nhập thất bại.');
  } finally {
    isLoading.value = false;
  }
};

// 2. GỌI API ĐĂNG KÝ
const handleRegister = async () => {
  isLoading.value = true;
  try {
    await authService.register(registerForm);
    ElMessage.success('Đăng ký thành công! Vui lòng đăng nhập.');
    isSignUp.value = false; 
    loginForm.email = registerForm.email; 
    registerForm.matKhau = ''; 
  } catch (error) {
    ElMessage.error(error.response?.data?.message || error.response?.data || 'Đăng ký thất bại.');
  } finally {
    isLoading.value = false;
  }
};

// 3. XỬ LÝ MỞ POPUP QUÊN MẬT KHẨU
const showForgotPassword = () => {
  dialogVisible.value = true;
  forgotEmail.value = ''; 
};

// 4. GỌI API QUÊN MẬT KHẨU
const handleForgotPassword = async () => {
  if (!forgotEmail.value) {
    ElMessage.warning('Vui lòng nhập email của bạn!');
    return;
  }
  isForgotLoading.value = true;
  try {
    await authService.forgotPassword(forgotEmail.value);
    ElMessage.success('Đã gửi hướng dẫn khôi phục! Vui lòng kiểm tra hộp thư email của bạn.');
    dialogVisible.value = false; 
  } catch (error) {
    ElMessage.error(error.response?.data?.message || error.response?.data || 'Lỗi khi gửi yêu cầu. Vui lòng thử lại sau.');
  } finally {
    isForgotLoading.value = false;
  }
};
</script>

<style scoped>
/* --- PHẦN NỀN BÊN NGOÀI ĐƯỢC NÂNG CẤP --- */
.auth-page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* Thay màu xám đơn điệu bằng Gradient tone kem ấm áp */
  background: linear-gradient(135deg, #fcf8f2 0%, #f0e4d8 100%);
  font-family: 'Helvetica Neue', Arial, sans-serif;
  position: relative;
  overflow: hidden; /* Ngăn scroll bar nếu khối mờ lọt ra ngoài */
}

/* Tạo khối màu cam mờ bồng bềnh ở góc trên bên trái */
.auth-page-wrapper::before {
  content: '';
  position: absolute;
  width: 50vw;
  height: 50vw;
  background: rgba(216, 140, 81, 0.15); /* Màu cam đất của Polycake */
  border-radius: 50%;
  top: -20%;
  left: -10%;
  filter: blur(90px);
  z-index: 0;
}

/* Tạo khối màu vàng nhạt mờ bồng bềnh ở góc dưới bên phải */
.auth-page-wrapper::after {
  content: '';
  position: absolute;
  width: 40vw;
  height: 40vw;
  background: rgba(255, 195, 113, 0.15); /* Màu vàng bơ */
  border-radius: 50%;
  bottom: -15%;
  right: -5%;
  filter: blur(80px);
  z-index: 0;
}

/* --- KHUNG FORM CHÍNH --- */
.container {
  background-color: #fff;
  border-radius: 16px; /* Bo góc mềm mại hơn */
  /* Đổ bóng (Shadow) đa tầng: sâu, êm và sang trọng hơn */
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  width: 900px;
  max-width: 95%;
  min-height: 550px;
  z-index: 1; /* Đảm bảo form luôn nổi lên trên các khối màu mờ */
}

/* Khung chính chứa form và ảnh */
.container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  position: relative;
  overflow: hidden;
  width: 900px;
  max-width: 100%;
  min-height: 550px;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

form {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}

/* Tùy chỉnh input của Element Plus cho đồng bộ */
:deep(.el-input) {
  margin: 8px 0;
  height: 45px;
}
:deep(.el-input__wrapper) {
  background-color: #eee;
  border-radius: 5px;
  box-shadow: none !important;
}
:deep(.el-input__inner) {
  background-color: transparent;
}

.forgot-password {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

/* Nút bấm chính (Cam đất - Hợp với tiệm bánh) */
.submit-btn {
  border-radius: 20px;
  padding: 12px 45px;
  font-size: 14px;
  font-weight: bold;
  margin-top: 15px;
  background-color: #d88c51; 
  border-color: #d88c51;
  color: white;
}
.submit-btn:hover {
  background-color: #c07b45;
  border-color: #c07b45;
}

/* --- LOGIC HIỆU ỨNG TRƯỢT CSS --- */
.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}
.container.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}
.container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {
  0%, 49.99% { opacity: 0; z-index: 1; }
  50%, 100% { opacity: 1; z-index: 5; }
}

/* Khung chứa ảnh trượt */
.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}
.container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

/* Đường dẫn ảnh đã được sửa khớp với thư mục của bạn */
.overlay {
  background: url('../assets/images/thiet-ke-cua-tiem-banh-ngot-1.jpg') no-repeat center center;
  background-size: cover;
  color: #ffffff;
  position: absolute;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}
.container.right-panel-active .overlay {
  transform: translateX(50%);
}

/* Lớp đen mờ phủ lên ảnh để chữ trắng nổi bật hơn */
.overlay::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6); 
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  z-index: 1;
}
.overlay-panel h1, .overlay-panel p {
  color: #fff;
}
.overlay-panel p {
  font-size: 15px;
  line-height: 1.5;
  margin: 20px 0 30px;
}

.overlay-left {
  transform: translateX(-20%);
}
.container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}
.container.right-panel-active .overlay-right {
  transform: translateX(20%);
}

/* Nút bấm trong suốt trên nền ảnh */
.ghost-btn {
  background-color: transparent;
  border: 2px solid #fff;
  color: #fff;
  border-radius: 20px;
  padding: 12px 45px;
  font-weight: bold;
}
.ghost-btn:hover {
  background-color: #fff;
  color: #333;
}
</style>