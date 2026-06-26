<template>
  <div class="auth-wrapper">
    <!-- Animated blobs -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>

    <!-- Floating particles -->
    <span
      v-for="(p, i) in particles"
      :key="i"
      class="particle"
      :style="{
        left: p.left,
        animationDuration: p.animationDuration,
        animationDelay: p.animationDelay,
        fontSize: p.fontSize,
        color: p.color,
      }"
    >{{ p.symbol }}</span>

    <!-- Main card -->
    <div class="card" :class="{ 'right-panel-active': isSignUp }">

      <!-- ── SIGN-UP PANEL ── -->
      <div class="form-container sign-up-container">
        <form @submit.prevent="handleRegister" novalidate>
          <div class="f-logo">
            <Cake :size="44" :stroke-width="1.5" color="var(--amber)" />
          </div>

          <h1 class="f-title">Tạo tài khoản</h1>
          <p class="f-sub">Đăng ký thành viên Polycake</p>

          <label class="field">
            <span class="ficon"><User :size="16" :stroke-width="2" /></span>
            <input
              v-model="registerForm.hoTen"
              type="text"
              placeholder="Họ và tên"
              required
            />
          </label>

          <label class="field">
            <span class="ficon"><Mail :size="16" :stroke-width="2" /></span>
            <input
              v-model="registerForm.email"
              type="email"
              placeholder="Email"
              required
            />
          </label>

          <label class="field">
            <span class="ficon"><Phone :size="16" :stroke-width="2" /></span>
            <input
              v-model="registerForm.soDienThoai"
              type="tel"
              placeholder="Số điện thoại"
              required
            />
          </label>

          <label class="field">
            <span class="ficon"><Lock :size="16" :stroke-width="2" /></span>
            <input
              v-model="registerForm.matKhau"
              :type="showRegPwd ? 'text' : 'password'"
              placeholder="Mật khẩu"
              required
            />
            <button type="button" class="eye-btn" @click="showRegPwd = !showRegPwd">
              <Eye v-if="!showRegPwd" :size="16" :stroke-width="2" />
              <EyeOff v-else :size="16" :stroke-width="2" />
            </button>
          </label>

          <div class="pwd-strength" v-if="registerForm.matKhau">
            <div class="pwd-bars">
              <div
                v-for="i in 4"
                :key="i"
                class="pwd-bar"
                :style="{ background: i <= pwdStrength.level ? pwdStrength.color : 'var(--cream-dark)' }"
              ></div>
            </div>
            <span class="pwd-label" :style="{ color: pwdStrength.color }">{{ pwdStrength.label }}</span>
          </div>

          <button type="submit" class="cta-btn" :class="{ 'is-loading': isRegisterLoading }" :disabled="isRegisterLoading">
            <template v-if="isRegisterLoading">
              <span class="btn-spinner"></span>
              <span class="btn-loading-text">Đang xử lý...</span>
            </template>
            <span class="btn-label" v-else>Đăng ký</span>
          </button>

          <p class="mobile-switch">
            Đã có tài khoản?
            <button type="button" @click="isSignUp = false" class="switch-link">Đăng nhập</button>
          </p>
        </form>
      </div>

      <!-- ── SIGN-IN PANEL ── -->
      <div class="form-container sign-in-container">
        <form @submit.prevent="handleLogin" novalidate :class="{ 'form-loading': isLoginLoading }">
          <div class="f-logo">
            <Cake :size="44" :stroke-width="1.5" color="var(--amber)" />
          </div>

          <h1 class="f-title">Đăng nhập</h1>
          <p class="f-sub">Sử dụng tài khoản Polycake của bạn</p>

          <label class="field">
            <span class="ficon"><Mail :size="16" :stroke-width="2" /></span>
            <input
              v-model="loginForm.email"
              type="email"
              placeholder="Email"
              required
              :disabled="isLoginLoading"
            />
          </label>

          <label class="field">
            <span class="ficon"><Lock :size="16" :stroke-width="2" /></span>
            <input
              v-model="loginForm.matKhau"
              :type="showLogPwd ? 'text' : 'password'"
              placeholder="Mật khẩu"
              required
              :disabled="isLoginLoading"
            />
            <button type="button" class="eye-btn" @click="showLogPwd = !showLogPwd">
              <Eye v-if="!showLogPwd" :size="16" :stroke-width="2" />
              <EyeOff v-else :size="16" :stroke-width="2" />
            </button>
          </label>

          <a href="#" class="forgot" @click.prevent="showForgotPassword">Quên mật khẩu?</a>

          <button type="submit" class="cta-btn" :class="{ 'is-loading': isLoginLoading }" :disabled="isLoginLoading">
            <template v-if="isLoginLoading">
              <span class="btn-spinner"></span>
              <span class="btn-loading-text">Đang xử lý...</span>
            </template>
            <span class="btn-label" v-else>Đăng nhập</span>
          </button>

          <p class="mobile-switch">
            Chưa có tài khoản?
            <button type="button" @click="isSignUp = true" class="switch-link">Đăng ký ngay</button>
          </p>
        </form>
      </div>

      <!-- ── OVERLAY SLIDE ── -->
      <div class="overlay-container">
        <div class="overlay-track">
          <div class="overlay-panel overlay-left">
            <PartyPopper :size="40" :stroke-width="1.5" color="rgba(255,253,208,0.9)" />
            <h2>Chào mừng trở lại!</h2>
            <p>Để duy trì kết nối với Polycake, vui lòng đăng nhập bằng thông tin cá nhân của bạn.</p>
            <button class="ghost-btn" @click="isSignUp = false">Đăng nhập</button>
          </div>

          <div class="overlay-panel overlay-right">
            <ChefHat :size="40" :stroke-width="1.5" color="rgba(255,253,208,0.9)" />
            <h2>Chào bạn mới!</h2>
            <p>Nhập thông tin cá nhân và bắt đầu hành trình thưởng thức bánh ngon cùng chúng tôi.</p>
            <button class="ghost-btn" @click="isSignUp = true">Đăng ký</button>
          </div>
        </div>
      </div>

    </div>

    <!-- ── DIALOG QUÊN MẬT KHẨU - 2 BƯỚC (giữ nguyên logic) ── -->
    <el-dialog
      v-model="dialogVisible"
      :title="forgotStep === 1 ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'"
      width="440px"
      center
      align-center
      class="forgot-dialog"
      :close-on-click-modal="false"
      @closed="resetForgotDialog"
    >
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

      <div v-else class="forgot-step">
        <div class="step-indicator">
          <div class="step done"><iconify-icon icon="ph:check-bold"></iconify-icon></div>
          <div class="step-line active"></div>
          <div class="step active">2</div>
        </div>
        <p class="step-desc">
          Mã OTP đã được gửi đến <strong>{{ forgotEmail }}</strong>. Mã có hiệu lực trong <strong>5 phút</strong>.
        </p>

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
import { ref, reactive, computed, shallowRef, h } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';
import {
  Cake, User, Mail, Phone, Lock, Eye, EyeOff,
  ChefHat, PartyPopper
} from 'lucide-vue-next';

const EmailIcon = shallowRef({
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '16', height: '16', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('rect', { x: '2', y: '4', width: '20', height: '16', rx: '2' }),
      h('path', { d: 'M2 7l10 7 10-7' })
    ]);
  }
});

const router = useRouter();
const authStore = useAuthStore();

// ── UI State ──
const isSignUp          = ref(false);
const isLoginLoading    = ref(false);
const isRegisterLoading = ref(false);
const showLogPwd = ref(false);
const showRegPwd = ref(false);

// ── Forgot password (logic giữ nguyên) ──
const dialogVisible   = ref(false);
const forgotStep      = ref(1);
const forgotEmail     = ref('');
const isForgotLoading = ref(false);

const otpDigits       = reactive(['', '', '', '', '', '']);
const otpRefs         = ref([]);
const newPassword     = ref('');
const confirmPassword = ref('');
const countdown       = ref(0);
let countdownTimer    = null;

// ── Form data ──
const loginForm    = reactive({ email: '', matKhau: '' });
const registerForm = reactive({ hoTen: '', email: '', soDienThoai: '', matKhau: '' });

// ── Password strength (UI only) ──
const pwdStrength = computed(() => {
  const v = registerForm.matKhau;
  if (!v) return { level: 0, label: '', color: '' };
  let score = 0;
  if (v.length >= 6)           score++;
  if (v.length >= 10)          score++;
  if (/[A-Z]/.test(v))         score++;
  if (/[0-9]/.test(v))         score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  if (score <= 1) return { level: 1, label: 'Yếu',        color: '#E05A00' };
  if (score <= 2) return { level: 2, label: 'Trung bình', color: '#D4850A' };
  if (score <= 3) return { level: 3, label: 'Mạnh',       color: '#7A9E20' };
  return              { level: 4, label: 'Rất mạnh',    color: '#3A8A20' };
});

// ── Floating particles (UI only) ──
const shapes = ['✦', '◆', '✿', '❋', '✺', '⬡', '◈', '✤', '⊕', '❂'];
const particles = Array.from({ length: 14 }, (_, i) => ({
  symbol:            shapes[i % shapes.length],
  left:              `${(i * 7.3 + 3) % 100}%`,
  animationDuration: `${16 + (i * 1.9) % 14}s`,
  animationDelay:    `${(i * 1.5) % 10}s`,
  fontSize:          `${0.7 + (i % 4) * 0.25}rem`,
  color:             i % 3 === 0 ? 'rgba(212,133,10,0.35)'
                   : i % 3 === 1 ? 'rgba(180,120,10,0.22)'
                   :               'rgba(255,200,50,0.28)',
}));

// ── Helpers OTP ──
const getOtpString = () => otpDigits.join('');

const focusOtp = (index) => {
  if (index >= 0 && index < 6) {
    otpRefs.value[index]?.focus();
  }
};

const onOtpInput = (index) => {
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

const startCountdown = (seconds = 60) => {
  countdown.value = seconds;
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) clearInterval(countdownTimer);
  }, 1000);
};

const resetForgotDialog = () => {
  forgotStep.value = 1;
  forgotEmail.value = '';
  otpDigits.forEach((_, i) => { otpDigits[i] = ''; });
  newPassword.value = '';
  confirmPassword.value = '';
  countdown.value = 0;
  clearInterval(countdownTimer);
};

const showForgotPassword = () => {
  resetForgotDialog();
  dialogVisible.value = true;
};

// ── API handlers (giữ nguyên) ──

const handleLogin = async () => {
  isLoginLoading.value = true;
  try {
    const redirectUrl = await authStore.login(loginForm);
    try {
      await router.push(redirectUrl);
      ElMessage.success('Đăng nhập thành công!');
    } catch (navErr) {
      authStore.finishLoginRedirect();
      isLoginLoading.value = false;
      console.error('❌ [LỖI ROUTER]', navErr);
      ElMessage.error('Không thể chuyển trang. Vui lòng thử lại.');
    }
  } catch (error) {
    isLoginLoading.value = false;
    ElMessage.error(typeof error === 'string' ? error : 'Email hoặc mật khẩu không chính xác!');
  }
};

const handleRegister = async () => {
  isRegisterLoading.value = true;
  try {
    await authService.register(registerForm);
    ElMessage.success('Đăng ký thành công! Vui lòng đăng nhập.');
    isSignUp.value = false;
    loginForm.email = registerForm.email;
    registerForm.matKhau = '';
  } catch (error) {
    ElMessage.error(error.response?.data?.message || error.response?.data || 'Đăng ký thất bại.');
  } finally {
    isRegisterLoading.value = false;
  }
};

const handleSendOtp = async () => {
  if (!forgotEmail.value) {
    ElMessage.warning('Vui lòng nhập email của bạn!');
    return;
  }
  isForgotLoading.value = true;
  try {
    await authService.forgotPassword(forgotEmail.value);
    ElMessage.success('Mã OTP đã được gửi! Vui lòng kiểm tra hộp thư.');
    if (forgotStep.value === 1) {
      forgotStep.value = 2;
      otpDigits.forEach((_, i) => { otpDigits[i] = ''; });
    }
    startCountdown(60);
  } catch (error) {
    ElMessage.error(error.response?.data?.message || error.response?.data || 'Lỗi gửi yêu cầu. Vui lòng thử lại.');
  } finally {
    isForgotLoading.value = false;
  }
};

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
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

.auth-wrapper {
  --cream:        #FFFDD0;
  --cream-light:  #FFFEF0;
  --cream-mid:    #F5F0C0;
  --cream-dark:   #E8E0A0;
  --amber:        #D4850A;
  --amber-hover:  #B86F00;
  --amber-glow:   rgba(212, 133, 10, 0.28);
  --amber-soft:   #FDF3DC;
  --brown-dark:   #3D2000;
  --brown-mid:    #6B3A10;
  --brown-light:  #A0622A;
  --white-glass:  rgba(255, 253, 208, 0.82);
  --border-cream: rgba(212, 133, 10, 0.20);
  --input-bg:     rgba(255, 253, 208, 0.55);
  --ov-grad: linear-gradient(
    150deg,
    rgba(90, 50, 5, 0.72) 0%,
    rgba(180, 100, 10, 0.60) 50%,
    rgba(70, 35, 0, 0.78) 100%
  );

  font-family: 'Nunito', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background-size: 400% 400%;
  background-image: linear-gradient(
    135deg,
    #FFFDD0 0%,
    #FFE8A0 20%,
    #FFF0C0 40%,
    #FFD86B 60%,
    #FFFDD0 80%,
    #FDE8B0 100%
  );
  animation: bgShift 12s ease infinite;
}
@keyframes bgShift {
  0%   { background-position: 0%   50%; }
  25%  { background-position: 100% 25%; }
  50%  { background-position: 100% 100%; }
  75%  { background-position: 0%   75%; }
  100% { background-position: 0%   50%; }
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  pointer-events: none;
  z-index: 0;
}
.blob-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(255,210,60,0.38) 0%, rgba(255,240,160,0.08) 100%);
  top: -220px; left: -180px;
  animation: blobFloat1 18s ease-in-out infinite;
}
.blob-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(180,100,10,0.22) 0%, rgba(255,220,100,0.06) 100%);
  bottom: -160px; right: -150px;
  animation: blobFloat2 22s ease-in-out infinite;
}
.blob-3 {
  width: 380px; height: 380px;
  background: radial-gradient(circle, rgba(255,253,208,0.55) 0%, rgba(212,133,10,0.08) 100%);
  top: 40%; left: 55%;
  transform: translate(-50%, -50%);
  animation: blobFloat3 26s ease-in-out infinite;
}
@keyframes blobFloat1 {
  0%,100% { transform: translate(0,0) scale(1); }
  33%     { transform: translate(30px,-40px) scale(1.06); }
  66%     { transform: translate(-20px,25px) scale(0.96); }
}
@keyframes blobFloat2 {
  0%,100% { transform: translate(0,0) scale(1); }
  40%     { transform: translate(-35px,28px) scale(1.04); }
  70%     { transform: translate(22px,-18px) scale(0.98); }
}
@keyframes blobFloat3 {
  0%,100% { transform: translate(-50%,-50%) scale(1) rotate(0deg); }
  50%     { transform: translate(-50%,-50%) scale(1.12) rotate(180deg); }
}

.particle {
  position: fixed;
  bottom: -30px;
  animation: floatUp linear infinite;
  pointer-events: none;
  z-index: 0;
  user-select: none;
}
@keyframes floatUp {
  from { transform: translateY(0) rotate(0deg);   opacity: 0.8; }
  to   { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
}

.card {
  background-color: #fff;
  border-radius: 18px;
  box-shadow: 0 24px 60px rgba(61,32,0,0.13), 0 6px 18px rgba(61,32,0,0.07);
  position: relative;
  overflow: hidden;
  width: 1020px;
  max-width: 96vw;
  min-height: 600px;
  z-index: 1;
  animation: cardIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes cardIn {
  from { opacity:0; transform: translateY(28px) scale(0.97); filter: blur(4px); }
  to   { opacity:1; transform: translateY(0) scale(1);      filter: blur(0); }
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}
.card.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}
.card.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: showPanel 0.6s;
}
@keyframes showPanel {
  0%, 49.99% { opacity: 0; z-index: 1; }
  50%, 100%  { opacity: 1; z-index: 5; }
}

form {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 40px 52px;
  height: 100%;
  text-align: center;
  box-sizing: border-box;
  gap: 2px;
  position: relative;
}

.form-loading {
  pointer-events: none;
}

.f-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px; height: 72px;
  background: var(--amber-soft);
  border-radius: 50%;
  margin-bottom: 4px;
  box-shadow: 0 4px 16px var(--amber-glow);
}

.f-title {
  font-family: 'Nunito', sans-serif;
  font-weight: 900;
  font-size: 1.75rem;
  color: var(--brown-dark);
  letter-spacing: -0.3px;
  margin: 6px 0 2px;
}
.f-sub {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--brown-light);
  margin: 0 0 12px;
}

.field {
  display: flex;
  align-items: center;
  background: var(--input-bg);
  border: 1.5px solid var(--border-cream);
  border-radius: 10px;
  padding: 0 14px;
  height: 46px;
  width: 100%;
  gap: 10px;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  margin-top: 8px;
  box-sizing: border-box;
  cursor: text;
}
.field input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-family: 'Nunito', sans-serif;
  font-size: 0.88rem;
  color: var(--brown-dark);
  font-weight: 500;
}
.field input:-webkit-autofill,
.field input:-webkit-autofill:hover,
.field input:-webkit-autofill:focus,
.field input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 9999px var(--cream-light) inset !important;
  box-shadow: 0 0 0 9999px var(--cream-light) inset !important;
  -webkit-text-fill-color: var(--brown-dark) !important;
  caret-color: var(--brown-dark);
  transition: background-color 99999s ease-in-out 0s;
}
.field input::placeholder {
  color: var(--brown-light);
  opacity: 0.7;
}
.field input:focus {
  outline: none !important;
  box-shadow: none !important;
}
.field:focus-within {
  border-color: var(--amber);
  background: var(--cream-light);
  box-shadow: 0 0 0 3px rgba(212,133,10,0.18);
  outline: none;
}
form input,
form button {
  outline: none !important;
}

.ficon {
  display: flex;
  align-items: center;
  color: var(--brown-light);
  flex-shrink: 0;
}

.eye-btn {
  background: none; border: none;
  cursor: pointer; padding: 0;
  display: flex; align-items: center;
  color: var(--brown-light);
  flex-shrink: 0;
  transition: color 0.2s;
}
.eye-btn:hover { color: var(--amber); }

.forgot {
  font-size: 0.78rem;
  color: var(--amber);
  text-decoration: none;
  font-weight: 600;
  margin: 6px 0 2px;
  align-self: flex-end;
  transition: color 0.2s;
}
.forgot:hover { color: var(--amber-hover); text-decoration: underline; }

.pwd-strength {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  width: 100%;
}
.pwd-bars {
  display: flex;
  gap: 4px;
  flex: 1;
}
.pwd-bar {
  height: 4px;
  flex: 1;
  border-radius: 4px;
  transition: background 0.3s ease;
}
.pwd-label {
  font-size: 0.72rem;
  font-weight: 700;
  min-width: 62px;
  text-align: right;
  transition: color 0.3s;
}

.cta-btn {
  width: 100%;
  height: 48px;
  min-height: 48px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--amber) 0%, #E8A020 100%);
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 20px var(--amber-glow);
  transition: background 0.25s, transform 0.15s, box-shadow 0.2s;
}
.cta-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--amber-hover) 0%, var(--amber) 100%);
  transform: translateY(-1px);
  box-shadow: 0 8px 28px var(--amber-glow);
}
.cta-btn:active:not(:disabled) { transform: translateY(0); }
.cta-btn:disabled { opacity: 0.75; cursor: not-allowed; }
.cta-btn.is-loading {
  gap: 10px;
}

.btn-loading-text {
  font-size: 0.92rem;
  font-weight: 700;
}

.btn-spinner {
  width: 20px; height: 20px;
  border: 2.5px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  display: inline-block;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

.mobile-switch {
  display: none;
  font-size: 0.82rem;
  color: var(--brown-light);
  margin-top: 14px;
  text-align: center;
}
.switch-link {
  background: none; border: none;
  color: var(--amber); font-weight: 700;
  cursor: pointer; font-size: 0.82rem;
  font-family: 'Nunito', sans-serif;
  text-decoration: underline; padding: 0;
}

.overlay-container {
  position: absolute;
  top: 0; left: 50%;
  width: 50%; height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}
.card.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.overlay-track {
  background: url('../assets/images/thiet-ke-cua-tiem-banh-ngot-1.jpg') no-repeat center center;
  background-size: cover;
  color: #fff;
  position: absolute;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}
.card.right-panel-active .overlay-track {
  transform: translateX(50%);
}

.overlay-track::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--ov-grad);
  z-index: 0;
}

.overlay-track::after {
  content: '';
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(
    110deg,
    transparent 30%,
    rgba(255,253,208,0.06) 48%,
    rgba(255,253,208,0.12) 50%,
    rgba(255,253,208,0.06) 52%,
    transparent 70%
  );
  background-size: 200% 100%;
  animation: shimmer 5s ease-in-out infinite;
  pointer-events: none;
}
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 44px;
  text-align: center;
  top: 0; height: 100%; width: 50%;
  transition: transform 0.6s ease-in-out;
  z-index: 2;
  gap: 14px;
}
.overlay-panel h2 {
  font-family: 'Nunito', sans-serif;
  font-weight: 900;
  font-size: 1.6rem;
  color: #fff;
  margin: 0;
  letter-spacing: -0.2px;
}
.overlay-panel p {
  font-size: 0.88rem;
  line-height: 1.6;
  color: rgba(255,253,208,0.88);
  margin: 0;
  font-weight: 500;
}

.overlay-left  { transform: translateX(-20%); }
.card.right-panel-active .overlay-left { transform: translateX(0); }

.overlay-right { right: 0; transform: translateX(0); }
.card.right-panel-active .overlay-right { transform: translateX(20%); }

.ghost-btn {
  background: rgba(255,253,208,0.15);
  border: 2px solid rgba(255,253,208,0.85);
  color: #fff;
  border-radius: 24px;
  padding: 11px 38px;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: color 0.25s;
  margin-top: 4px;
}
.ghost-btn::after {
  content: '';
  position: absolute; inset: 0;
  background: rgba(255,253,208,0.18);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.ghost-btn:hover::after { transform: scaleX(1); }
.ghost-btn:hover { color: var(--cream); }

/* ── Dialog quên mật khẩu (themed) ── */
.forgot-step {
  padding: 0 4px;
}

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
  background: var(--cream-dark);
  color: var(--brown-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s;
  flex-shrink: 0;
}

.step.active {
  background: var(--amber);
  color: #fff;
}

.step.done {
  background: #7A9E20;
  color: #fff;
}

.step-line {
  height: 2px;
  width: 60px;
  background: var(--cream-dark);
  transition: all 0.3s;
}

.step-line.active {
  background: var(--amber);
}

.step-desc {
  font-size: 14px;
  color: var(--brown-mid);
  text-align: center;
  line-height: 1.6;
  margin-bottom: 18px;
}

.otp-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--brown-mid);
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
  background-color: var(--input-bg) !important;
  border: 2px solid var(--border-cream) !important;
  border-radius: 8px !important;
  padding: 0 !important;
  box-shadow: none !important;
  transition: border-color 0.2s;
}

.otp-cell :deep(.el-input__wrapper:focus-within) {
  border-color: var(--amber) !important;
  background-color: var(--cream-light) !important;
}

.otp-cell :deep(.el-input__inner) {
  text-align: center !important;
  font-size: 20px !important;
  font-weight: bold !important;
  color: var(--brown-dark) !important;
  background-color: transparent !important;
  height: 50px !important;
  padding: 0 !important;
}

.resend-row {
  margin-top: 12px;
  text-align: center;
  font-size: 13px;
  color: var(--brown-light);
}

.countdown {
  color: var(--amber);
}

.primary-btn {
  background-color: var(--amber) !important;
  border-color: var(--amber) !important;
  color: #fff !important;
}
.primary-btn:hover {
  background-color: var(--amber-hover) !important;
  border-color: var(--amber-hover) !important;
}

@media (max-width: 680px) {
  .card {
    width: 100vw;
    min-height: 100vh;
    border-radius: 0;
  }
  .form-container {
    width: 100% !important;
    position: relative !important;
    transform: none !important;
    opacity: 1 !important;
    z-index: 1 !important;
  }
  .sign-in-container  { display: block; }
  .sign-up-container  { display: none; }
  .card.right-panel-active .sign-in-container  { display: none; }
  .card.right-panel-active .sign-up-container  { display: flex; }
  .overlay-container  { display: none; }
  form { padding: 36px 28px; }
  .mobile-switch { display: block; }
}
</style>

<style>
/* Dialog global overrides (el-dialog renders in body) */
.forgot-dialog .el-dialog {
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 253, 208, 0.98);
  border: 1.5px solid rgba(212, 133, 10, 0.15);
  box-shadow: 0 28px 68px rgba(212, 133, 10, 0.28), 0 6px 18px rgba(0,0,0,0.07);
}
.forgot-dialog .el-dialog__header {
  padding: 24px 24px 8px;
}
.forgot-dialog .el-dialog__title {
  font-family: 'Nunito', sans-serif;
  font-weight: 900;
  font-size: 1.2rem;
  color: #3D2000;
}
.forgot-dialog .el-dialog__body {
  padding: 8px 24px 16px;
}
.forgot-dialog .el-dialog__footer {
  padding: 8px 24px 20px;
}
.forgot-dialog .el-input__wrapper {
  background-color: rgba(255, 253, 208, 0.55) !important;
  border: 1.5px solid rgba(212, 133, 10, 0.20) !important;
  box-shadow: none !important;
  border-radius: 10px !important;
}
.forgot-dialog .el-input__wrapper:focus-within {
  border-color: #D4850A !important;
  box-shadow: 0 0 0 3px rgba(212,133,10,0.18) !important;
}
</style>
