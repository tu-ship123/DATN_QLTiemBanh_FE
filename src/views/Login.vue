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

  <!-- ======================================================= -->
  <!-- DIALOG QUÊN MẬT KHẨU - 2 BƯỚC                          -->
  <!-- ======================================================= -->
  <el-dialog
    v-model="dialogVisible"
    :title="forgotStep === 1 ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'"
    width="440px"
    center
    align-center
    :close-on-click-modal="false"
    @closed="resetForgotDialog"
  >
    <!-- ===== BƯỚC 1: Nhập email để nhận OTP ===== -->
    <div v-if="forgotStep === 1" class="forgot-step">
      <div class="step-indicator">
        <div class="step active">1</div>
        <div class="step-line"></div>
        <div class="step">2</div>
      </div>
      <p class="step-desc">Nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi mã OTP (6 chữ số) về hộp thư của bạn.</p>
      <el-input
        v-model="forgotEmail"
        type="email"
        placeholder="Nhập email của bạn"
        size="large"
        :prefix-icon="EmailIcon"
        @keyup.enter="handleSendOtp"
      />
    </div>

    <!-- ===== BƯỚC 2: Nhập OTP + mật khẩu mới ===== -->
    <div v-else class="forgot-step">
      <div class="step-indicator">
        <div class="step done">✓</div>
        <div class="step-line active"></div>
        <div class="step active">2</div>
      </div>
      <p class="step-desc">
        Mã OTP đã được gửi đến <strong>{{ forgotEmail }}</strong>. Mã có hiệu lực trong <strong>5 phút</strong>.
      </p>

      <!-- OTP Input -->
      <div class="otp-label">Mã OTP</div>
      <div class="otp-inputs">
        <el-input
          v-for="(_, i) in otpDigits"
          :key="i"
          :ref="el => { if (el) otpRefs[i] = el }"
          v-model="otpDigits[i]"
          maxlength="1"
          class="otp-cell"
          @input="onOtpInput(i)"
          @keydown.backspace="onOtpBackspace(i)"
          @keydown.left="focusOtp(i - 1)"
          @keydown.right="focusOtp(i + 1)"
          @paste.prevent="onOtpPaste($event)"
        />
      </div>

      <!-- Mật khẩu mới -->
      <el-input
        v-model="newPassword"
        type="password"
        placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
        size="large"
        show-password
        style="margin-top: 16px;"
      />
      <el-input
        v-model="confirmPassword"
        type="password"
        placeholder="Xác nhận mật khẩu mới"
        size="large"
        show-password
        style="margin-top: 10px;"
        @keyup.enter="handleResetPassword"
      />

      <!-- Đếm ngược + Gửi lại OTP -->
      <div class="resend-row">
        <span v-if="countdown > 0" class="countdown">
          Gửi lại OTP sau <strong>{{ countdown }}s</strong>
        </span>
        <el-button v-else link type="primary" @click="handleSendOtp" :loading="isForgotLoading">
          Gửi lại OTP
        </el-button>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <!-- Bước 1: Nút Hủy + Tiếp tục -->
        <template v-if="forgotStep === 1">
          <el-button @click="dialogVisible = false">Hủy</el-button>
          <el-button
            type="primary"
            @click="handleSendOtp"
            :loading="isForgotLoading"
            class="primary-btn"
          >
            Gửi mã OTP
          </el-button>
        </template>

        <!-- Bước 2: Nút Quay lại + Xác nhận -->
        <template v-else>
          <el-button @click="forgotStep = 1">← Quay lại</el-button>
          <el-button
            type="primary"
            @click="handleResetPassword"
            :loading="isForgotLoading"
            class="primary-btn"
          >
            Đặt lại mật khẩu
          </el-button>
        </template>
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';

// ---- Icon email đơn giản dùng cho el-input prefix ----
const EmailIcon = shallowRef({
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '16', height: '16', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '2', y: '4', width: '20', height: '16', rx: '2' }),
      h('path', { d: 'M2 7l10 7 10-7' })
    ]);
  }
});

import { h } from 'vue';

const router = useRouter();
const authStore = useAuthStore();

// Trạng thái giao diện
const isSignUp = ref(false);
const isLoading = ref(false);

// ---- State Quên mật khẩu ----
const dialogVisible = ref(false);
const forgotStep = ref(1);          // 1 = nhập email, 2 = nhập OTP + mật khẩu mới
const forgotEmail = ref('');
const isForgotLoading = ref(false);

// Bước 2
const otpDigits = reactive(['', '', '', '', '', '']);
const otpRefs = ref([]);
const newPassword = ref('');
const confirmPassword = ref('');
const countdown = ref(0);
let countdownTimer = null;

// Dữ liệu Form đăng nhập / đăng ký
const loginForm = reactive({ email: '', matKhau: '' });
const registerForm = reactive({ hoTen: '', email: '', soDienThoai: '', matKhau: '' });

// ---- Helpers OTP ----
const getOtpString = () => otpDigits.join('');

const focusOtp = (index) => {
  if (index >= 0 && index < 6) {
    otpRefs.value[index]?.focus();
  }
};

const onOtpInput = (index) => {
  // Lọc chỉ giữ lại chữ số
  otpDigits[index] = otpDigits[index].replace(/\D/g, '').slice(-1);
  if (otpDigits[index] && index < 5) {
    focusOtp(index + 1);
  }
};

const onOtpBackspace = (index) => {
  if (!otpDigits[index] && index > 0) {
    otpDigits[index - 1] = '';
    focusOtp(index - 1);
  }
};

const onOtpPaste = (event) => {
  const text = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
  text.split('').forEach((char, i) => { otpDigits[i] = char; });
  focusOtp(Math.min(text.length, 5));
};

// ---- Đếm ngược ----
const startCountdown = (seconds = 60) => {
  countdown.value = seconds;
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) clearInterval(countdownTimer);
  }, 1000);
};

// ---- Reset dialog khi đóng ----
const resetForgotDialog = () => {
  forgotStep.value = 1;
  forgotEmail.value = '';
  otpDigits.forEach((_, i) => { otpDigits[i] = ''; });
  newPassword.value = '';
  confirmPassword.value = '';
  countdown.value = 0;
  clearInterval(countdownTimer);
};

// ---- Mở dialog ----
const showForgotPassword = () => {
  resetForgotDialog();
  dialogVisible.value = true;
};

// ---- XỬ LÝ API ----

// 1. ĐĂNG NHẬP
const handleLogin = async () => {
  isLoading.value = true;
  try {
    const redirectUrl = await authStore.login(loginForm);
    ElMessage.success('Đăng nhập thành công!');
    router.push(redirectUrl).catch(err => {
      console.error('❌ [LỖI ROUTER]', err);
    });
  } catch (error) {
    ElMessage.error(typeof error === 'string' ? error : 'Email hoặc mật khẩu không chính xác!');
  } finally {
    isLoading.value = false;
  }
};

// 2. ĐĂNG KÝ
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

// 3. GỬI OTP (Bước 1 → Bước 2, hoặc gửi lại)
const handleSendOtp = async () => {
  if (!forgotEmail.value) {
    ElMessage.warning('Vui lòng nhập email của bạn!');
    return;
  }
  isForgotLoading.value = true;
  try {
    await authService.forgotPassword(forgotEmail.value);
    ElMessage.success('Mã OTP đã được gửi! Vui lòng kiểm tra hộp thư.');
    // Chuyển sang bước 2 (nếu đang ở bước 1)
    if (forgotStep.value === 1) {
      forgotStep.value = 2;
      // Reset OTP fields
      otpDigits.forEach((_, i) => { otpDigits[i] = ''; });
    }
    startCountdown(60);
  } catch (error) {
    ElMessage.error(error.response?.data?.message || error.response?.data || 'Lỗi gửi yêu cầu. Vui lòng thử lại.');
  } finally {
    isForgotLoading.value = false;
  }
};

// 4. ĐẶT LẠI MẬT KHẨU (Bước 2)
const handleResetPassword = async () => {
  const otp = getOtpString();

  if (otp.length < 6) {
    ElMessage.warning('Vui lòng nhập đủ 6 chữ số OTP!');
    return;
  }
  if (!newPassword.value || newPassword.value.length < 6) {
    ElMessage.warning('Mật khẩu mới phải có ít nhất 6 ký tự!');
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    ElMessage.error('Mật khẩu xác nhận không khớp!');
    return;
  }

  isForgotLoading.value = true;
  try {
    await authService.resetPassword({
      email: forgotEmail.value,
      otp,
      newPassword: newPassword.value,
    });
    ElMessage.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
    dialogVisible.value = false;
    // Điền sẵn email vào form đăng nhập cho tiện
    loginForm.email = forgotEmail.value;
  } catch (error) {
    const msg = error.response?.data?.message || error.response?.data || 'OTP không hợp lệ hoặc đã hết hạn!';
    ElMessage.error(msg);
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
  background: linear-gradient(135deg, #fcf8f2 0%, #f0e4d8 100%);
  font-family: 'Helvetica Neue', Arial, sans-serif;
  position: relative;
  overflow: hidden;
}

.auth-page-wrapper::before {
  content: '';
  position: absolute;
  width: 50vw;
  height: 50vw;
  background: rgba(216, 140, 81, 0.15);
  border-radius: 50%;
  top: -20%;
  left: -10%;
  filter: blur(90px);
  z-index: 0;
}

.auth-page-wrapper::after {
  content: '';
  position: absolute;
  width: 40vw;
  height: 40vw;
  background: rgba(255, 195, 113, 0.15);
  border-radius: 50%;
  bottom: -15%;
  right: -5%;
  filter: blur(80px);
  z-index: 0;
}

/* --- KHUNG FORM CHÍNH --- */
.container {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  width: 900px;
  max-width: 95%;
  min-height: 550px;
  z-index: 1;
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

/* ========================================== */
/* DIALOG QUÊN MẬT KHẨU                      */
/* ========================================== */
.forgot-step {
  padding: 0 4px;
}

/* Step indicator */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  gap: 0;
}

.step {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s;
  flex-shrink: 0;
}

.step.active {
  background: #d88c51;
  color: #fff;
}

.step.done {
  background: #67c23a;
  color: #fff;
}

.step-line {
  height: 2px;
  width: 60px;
  background: #e0e0e0;
  transition: all 0.3s;
}

.step-line.active {
  background: #d88c51;
}

.step-desc {
  font-size: 14px;
  color: #666;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 18px;
}

/* OTP Input */
.otp-label {
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 10px;
  text-align: left;
}

.otp-inputs {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.otp-cell {
  width: 50px !important;
  height: 50px !important;
}

.otp-cell :deep(.el-input__wrapper) {
  background-color: #f5f5f5 !important;
  border: 2px solid #e0e0e0 !important;
  border-radius: 8px !important;
  padding: 0 !important;
  box-shadow: none !important;
  transition: border-color 0.2s;
}

.otp-cell :deep(.el-input__wrapper:focus-within) {
  border-color: #d88c51 !important;
  background-color: #fff9f4 !important;
}

.otp-cell :deep(.el-input__inner) {
  text-align: center !important;
  font-size: 20px !important;
  font-weight: bold !important;
  color: #333 !important;
  background-color: transparent !important;
  height: 50px !important;
  padding: 0 !important;
}

/* Resend */
.resend-row {
  margin-top: 12px;
  text-align: center;
  font-size: 13px;
  color: #888;
}

.countdown {
  color: #d88c51;
}

/* Footer button */
.primary-btn {
  background-color: #d88c51 !important;
  border-color: #d88c51 !important;
  color: #fff !important;
}
.primary-btn:hover {
  background-color: #c07b45 !important;
  border-color: #c07b45 !important;
}
</style>