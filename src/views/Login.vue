<template>
  <div class="min-h-screen flex" style="background: linear-gradient(135deg, #FFF4EF 0%, #FFF9F5 60%, #FFF0E8 100%)">

    <!-- LEFT: Branding Panel -->
    <div class="hidden lg:flex flex-col justify-between p-12 w-[480px] flex-shrink-0"
         style="background: linear-gradient(160deg, #E8634A 0%, #F07A5E 50%, #FBB830 100%)">

      <div>
        <div class="flex items-center gap-3 mb-16">
          <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">🎂</div>
          <div>
            <div class="font-display font-black text-white text-xl">Polycake</div>
            <div class="text-white/70 text-xs tracking-widest uppercase font-semibold">Admin Dashboard</div>
          </div>
        </div>

        <h1 class="font-display font-black text-white text-4xl leading-tight mb-4">
          Quản lý tiệm bánh<br/>thông minh hơn
        </h1>
        <p class="text-white/80 text-base leading-relaxed">
          Theo dõi đơn hàng, quản lý sản phẩm, phân tích doanh thu — tất cả trong một nơi.
        </p>
      </div>

      <!-- Stats preview -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
          <div class="text-2xl font-display font-black text-white">4.9 ★</div>
          <div class="text-white/80 text-sm mt-1">Đánh giá trung bình</div>
        </div>
        <div class="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
          <div class="text-2xl font-display font-black text-white">98%</div>
          <div class="text-white/80 text-sm mt-1">Đơn hoàn thành đúng hạn</div>
        </div>
        <div class="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
          <div class="text-2xl font-display font-black text-white">1,240</div>
          <div class="text-white/80 text-sm mt-1">Khách hàng tháng này</div>
        </div>
        <div class="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
          <div class="text-2xl font-display font-black text-white">85M</div>
          <div class="text-white/80 text-sm mt-1">Doanh thu tháng này</div>
        </div>
      </div>
    </div>

    <!-- RIGHT: Login Form -->
    <div class="flex-1 flex items-center justify-center p-6 lg:p-12">
      <div class="w-full max-w-[420px]">

        <!-- Mobile logo -->
        <div class="flex items-center gap-3 mb-10 lg:hidden">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style="background:linear-gradient(135deg,#E8634A,#FBB830)">🎂</div>
          <div>
            <div class="font-display font-black text-xl" style="color:#1E2A3B">Polycake Admin</div>
            <div class="text-xs tracking-widest uppercase font-semibold text-gray-400">Dashboard</div>
          </div>
        </div>

        <h2 class="font-display font-black text-3xl mb-1" style="color:#1E2A3B">Xin chào 👋</h2>
        <p class="text-gray-500 mb-8">Đăng nhập vào tài khoản quản trị của bạn</p>

        <el-form :model="form" :rules="rules" ref="formRef" @submit.prevent="handleLogin">
          <!-- Username -->
          <div class="mb-5">
            <label class="form-label">Tên đăng nhập</label>
            <el-form-item prop="username" style="margin-bottom:0">
              <el-input
                v-model="form.username"
                size="large"
                placeholder="admin@polycake.vn"
                :prefix-icon="User"
                style="--el-input-border-radius:14px"
              />
            </el-form-item>
          </div>

          <!-- Password -->
          <div class="mb-2">
            <label class="form-label">Mật khẩu</label>
            <el-form-item prop="password" style="margin-bottom:0">
              <el-input
                v-model="form.password"
                type="password"
                size="large"
                placeholder="••••••••"
                :prefix-icon="Lock"
                show-password
                style="--el-input-border-radius:14px"
              />
            </el-form-item>
          </div>

          <!-- Remember + Forgot -->
          <div class="flex items-center justify-between mb-6">
            <el-checkbox v-model="form.remember" label="Ghi nhớ đăng nhập" size="small" />
            <a href="#" class="text-sm font-semibold" style="color:#E8634A">Quên mật khẩu?</a>
          </div>

          <!-- Submit -->
          <button
            type="button"
            class="w-full py-3 rounded-2xl font-display font-bold text-white text-base transition-all"
            :style="{
              background: loading ? '#ccc' : 'linear-gradient(135deg, #E8634A, #F07A5E)',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(232,99,74,0.4)',
              cursor: loading ? 'not-allowed' : 'pointer'
            }"
            :disabled="loading"
            @click="handleLogin"
          >
            <span v-if="!loading">Đăng nhập →</span>
            <span v-else>Đang xác thực...</span>
          </button>
        </el-form>

        <p class="text-center text-sm text-gray-400 mt-6">
          Bằng cách đăng nhập, bạn đồng ý với
          <a href="#" style="color:#E8634A">Điều khoản sử dụng</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router  = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({ username: 'admin@polycake.vn', password: '123456', remember: true })

const rules = {
  username: [{ required: true, message: 'Vui lòng nhập tên đăng nhập', trigger: 'blur' }],
  password: [{ required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' }],
}

async function handleLogin() {
  loading.value = true
  await new Promise(r => setTimeout(r, 1200))
  loading.value = false
  ElMessage.success('Đăng nhập thành công! 🎉')
  router.push('/dashboard')
}
</script>