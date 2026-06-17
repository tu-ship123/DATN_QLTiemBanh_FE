<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white rounded-2xl p-6 shadow">
      <h2 class="font-display font-black text-2xl mb-4">Tạo tài khoản (Local)</h2>

      <el-form :model="form" ref="formRef">
        <el-form-item label="Tên" prop="name">
          <el-input v-model="form.name" placeholder="Họ tên" />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="email@polycake.vn" />
        </el-form-item>

        <el-form-item label="Mật khẩu" prop="password">
          <el-input v-model="form.password" type="password" placeholder="••••••" />
        </el-form-item>

        <el-form-item label="Vai trò">
          <el-select v-model="form.role" placeholder="Chọn vai trò">
            <el-option label="Khách hàng" value="customer" />
            <el-option label="Nhân viên" value="staff" />
          </el-select>
        </el-form-item>

        <div class="flex items-center gap-2 mt-4">
          <button class="btn-primary flex-1" @click.prevent="handleRegister">Tạo tài khoản</button>
          <RouterLink to="/login" class="text-sm text-gray-500">Đã có tài khoản?</RouterLink>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref()
const form = reactive({ name: '', email: '', password: '', role: 'customer' })

function handleRegister() {
  // Save basic profile locally (no backend)
  const profile = { name: form.name, email: form.email, role: form.role }
  localStorage.setItem('polycake_user', JSON.stringify(profile))
  localStorage.setItem('polycake_role', form.role)
  ElMessage.success('Tạo tài khoản thành công')
  if (form.role === 'staff') router.push('/staff-area/orders')
  else router.push('/shop')
}
</script>
