<template>
  <div class="p-6 bg-[#FFF8F4] min-h-screen flex flex-col">
    <div class="mb-6 flex justify-between items-end shrink-0">
      <div>
        <h1 class="text-2xl font-black text-[#1E2A3B] font-display">Bảng Kanban Đơn Hàng</h1>
        <p class="text-sm text-slate-500 mt-1">Kéo thả thẻ để cập nhật tiến trình sản xuất và giao hàng</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
          <span class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span> Đơn 3D Custom
        </span>
      </div>
    </div>

    <div class="flex gap-5 overflow-x-auto pb-4 flex-1 custom-scrollbar items-start">
      
      <div 
        v-for="column in kanbanColumns" 
        :key="column.id" 
        class="flex-shrink-0 w-[340px] flex flex-col max-h-[calc(100vh-160px)]"
      >
        <div class="flex justify-between items-center mb-3 px-1 shrink-0">
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-[#1E2A3B] text-[15px] uppercase tracking-wide">{{ column.title }}</h3>
            <span class="bg-[#E8634A] text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm shadow-[#E8634A]/30">
              {{ column.cards.length }}
            </span>
          </div>
          <button class="text-slate-400 hover:text-[#E8634A] transition-colors">
            <el-icon><MoreFilled /></el-icon>
          </button>
        </div>

        <div class="bg-slate-100/50 backdrop-blur-sm border border-[#EDE8E3] rounded-2xl p-3 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <draggable
            v-model="column.cards"
            item-key="id"
            group="orders"
            class="flex-1 flex flex-col gap-3 min-h-[100px]"
            ghost-class="opacity-40"
            drag-class="rotate-2 scale-105 shadow-2xl cursor-grabbing"
            @change="onDragChange"
          >
            <template #item="{ element }">
              <div 
                class="bg-white border border-[#EDE8E3] p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] cursor-grab hover:border-[#E8634A]/40 hover:shadow-[0_8px_20px_rgba(232,99,74,0.08)] hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden"
                @click="openOrderDetail(element)"
              >
                <div v-if="element.is3D" class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500"></div>
                <div v-else class="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[#E8634A]/50 transition-colors"></div>

                <div class="flex justify-between items-start mb-2.5">
                  <span class="text-xs font-black text-[#E8634A] bg-[#FFF0EC] px-2 py-1 rounded-md">{{ element.id }}</span>
                  <span v-if="element.is3D" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md shadow-purple-500/30 tracking-wide uppercase">
                    3D Custom
                  </span>
                </div>
                
                <h4 class="text-[15px] font-bold text-[#1E2A3B] mb-1.5 leading-snug group-hover:text-[#E8634A] transition-colors">{{ element.product }}</h4>
                
                <div class="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                  <el-icon><User /></el-icon>
                  <span class="truncate">{{ element.customer }}</span>
                </div>
                
                <div class="pt-3 border-t border-slate-100 flex justify-between items-center mt-auto">
                  <div class="flex items-center gap-1.5 text-xs font-semibold" :class="column.id === 'delivered' ? 'text-emerald-600' : 'text-slate-500'">
                    <el-icon><Clock v-if="column.id !== 'delivered'" /><CircleCheck v-else /></el-icon>
                    {{ element.deliveryTime }}
                  </div>
                  <button class="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 hover:bg-[#E8634A] hover:text-white flex items-center justify-center transition-colors">
                    <el-icon><View /></el-icon>
                  </button>
                </div>
              </div>
            </template>
          </draggable>
          
          <div v-if="column.cards.length === 0" class="flex-1 flex flex-col items-center justify-center text-slate-400 opacity-60 min-h-[120px] pointer-events-none">
            <el-icon class="text-3xl mb-2"><Box /></el-icon>
            <p class="text-xs font-medium">Chưa có đơn hàng</p>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="showModal" :title="`Chi tiết đơn: ${selectedOrder?.id}`" width="540px" class="rounded-2xl" center>
      <div v-if="selectedOrder" class="space-y-5 px-2">
        <div class="text-center pb-2">
          <el-tag v-if="selectedOrder.is3D" type="warning" effect="dark" round class="mb-3 bg-gradient-to-r from-purple-500 to-indigo-500 border-none">Mô hình 3D Custom</el-tag>
          <h2 class="text-xl font-bold text-[#1E2A3B]">{{ selectedOrder.product }}</h2>
        </div>

        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-slate-400 font-semibold uppercase mb-1">Khách hàng</p>
            <p class="text-sm font-medium text-[#1E2A3B]">{{ selectedOrder.customer }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400 font-semibold uppercase mb-1">Hạn giao</p>
            <p class="text-sm font-medium text-[#1E2A3B]">{{ selectedOrder.deliveryTime }}</p>
          </div>
        </div>

        <div class="bg-amber-50 p-4 rounded-xl border border-amber-100">
          <p class="text-xs text-amber-600 font-bold uppercase mb-2 flex items-center gap-1"><el-icon><Warning /></el-icon> Ghi chú đặc biệt</p>
          <p class="text-sm text-amber-900">{{ selectedOrder.note || 'Không có ghi chú từ khách hàng.' }}</p>
        </div>

        <div v-if="selectedOrder.is3D" class="flex justify-center pt-2">
          <button class="w-full h-12 flex items-center justify-center gap-2 text-base font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all duration-300" @click="open3DViewer">
            <el-icon class="text-lg"><Monitor /></el-icon> Mở Trình Xem Mô Hình 3D
          </button>
        </div>
      </div>
      <template #footer>
        <div class="pb-2">
          <el-button class="rounded-xl px-6" @click="showModal = false">Đóng</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="show3DViewer" title="Trình Render 3D (Three.js)" width="860px" destroy-on-close class="rounded-2xl">
      <div class="w-full h-[540px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden shadow-inner border border-slate-700">
        <div class="text-center text-slate-400 z-10">
          <el-icon class="text-5xl mb-3 text-purple-400/50"><Box /></el-icon>
          <p class="font-medium text-slate-300">Môi trường giả lập 3D</p>
          <p class="text-sm mt-2 max-w-sm opacity-60">Thẻ canvas đã được chuẩn bị. Sẵn sàng tích hợp code Three.js ở Task T045 để hiển thị thiết kế bánh của khách.</p>
        </div>
        <canvas id="three-canvas" class="absolute inset-0 w-full h-full cursor-move"></canvas>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { ElMessage } from 'element-plus'
// Đã xóa chữ Inbox ở dòng import này để fix lỗi
import { MoreFilled, User, Clock, View, Warning, Monitor, Box, CircleCheck } from '@element-plus/icons-vue'

const showModal = ref(false)
const show3DViewer = ref(false)
const selectedOrder = ref(null)

const kanbanColumns = ref([
  {
    id: 'pending',
    title: 'Chờ xử lý',
    cards: [
      { id: '#DH001', product: 'Bánh Mèo Shiba 3D', customer: 'Anh Tuấn', deliveryTime: '14:00 Hôm nay', note: 'Làm chi tiết mặt mèo, kem ít ngọt', is3D: true },
      { id: '#DH002', product: 'Cupcake Set 12', customer: 'Chị Mai', deliveryTime: '16:00 Hôm nay', note: 'Giao hỏa tốc trước 4h chiều', is3D: false },
      { id: '#DH005', product: 'Bánh Kem Vani 20cm', customer: 'Cô Lan', deliveryTime: '10:00 Sáng mai', note: 'Viết chữ: Mừng thọ Ông', is3D: false }
    ]
  },
  {
    id: 'doing',
    title: 'Đang sản xuất',
    cards: [
      { id: '#DH003', product: 'Bánh Cưới 3 Tầng', customer: 'Hải Đăng', deliveryTime: 'Sáng mai', note: 'Trang trí hoa hồng fondant, tone màu pastel', is3D: true }
    ]
  },
  {
    id: 'ready',
    title: 'Sẵn sàng giao',
    cards: [
      { id: '#DH004', product: 'Macaron Box (24 viên)', customer: 'Minh Thư', deliveryTime: '18:00 Hôm nay', note: '', is3D: false }
    ]
  },
  {
    id: 'delivered',
    title: 'Đã giao',
    cards: []
  }
])

const onDragChange = (evt) => {
  if(evt.added) {
    ElMessage({
      message: 'Đã cập nhật tiến trình đơn hàng',
      type: 'success',
      plain: true,
      duration: 2000
    })
  }
}

const openOrderDetail = (order) => {
  selectedOrder.value = order
  showModal.value = true
}

const open3DViewer = () => {
  showModal.value = false
  show3DViewer.value = true
  ElMessage.info('Chuẩn bị nạp dữ liệu mesh Three.js...')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #94a3b8; 
}
</style>