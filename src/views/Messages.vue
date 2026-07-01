<template>
  <section class="space-y-6">
    <!-- Header -->
    <div class="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold" style="color:#5C4428">Tin nhắn</h1>
          <p class="text-sm text-muted">Quản lý liên hệ và tin nhắn khách hàng</p>
        </div>
        <button class="btn-primary flex items-center gap-2"><iconify-icon icon="ph:pencil-simple-duotone" /> Soạn tin</button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Tin nhắn chưa đọc</div>
          <div class="text-3xl font-bold" style="color:#7A5C3A">12</div>
          <div class="text-xs text-muted mt-2">↑ 3 tin mới hôm nay</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Khách hàng hoạt động</div>
          <div class="text-3xl font-bold" style="color:#3B82F6">28</div>
          <div class="text-xs text-muted mt-2">Đang trò chuyện</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Thời phản hồi TB</div>
          <div class="text-3xl font-bold" style="color:#22C55E">2.5m</div>
          <div class="text-xs text-muted mt-2">↓ từ 3.2m hôm qua</div>
        </div>
      </div>
      <div class="data-card">
        <div class="p-4">
          <div class="text-xs text-muted mb-2">Hỏi/Đáp trong ngày</div>
          <div class="text-3xl font-bold" style="color:#F59E0B">87</div>
          <div class="text-xs text-muted mt-2">58% đã giải quyết</div>
        </div>
      </div>
    </div>

    <!-- Messages List -->
    <div class="data-card">
      <div class="data-card-header">
        <h2 class="font-bold text-lg" style="color:#5C4428">Hộp thư đến</h2>
        <input type="text" placeholder="Tìm kiếm..." class="search-input" style="min-width:200px;height:36px;font-size:13px"/>
      </div>
      <div class="overflow-hidden">
        <div v-for="msg in messages" :key="msg.id" class="border-t border-[#FDF8F2] p-4 hover:bg-[#FFFBF5] transition cursor-pointer flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0" :style="{ background: msg.avatar.bg, color: msg.avatar.color }">
            {{ msg.avatar.text }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-bold text-sm" style="color:#5C4428">{{ msg.name }}</span>
              <span class="text-xs text-muted">{{ msg.time }}</span>
              <span v-if="!msg.read" class="w-2 h-2 rounded-full bg-blue-500"></span>
            </div>
            <p class="text-sm text-muted truncate">{{ msg.preview }}</p>
          </div>
          <div class="text-right flex-shrink-0">
            <span class="text-xs text-muted block">{{ msg.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const messages = [
  { id: 1, name: 'Nguyễn Khoa', avatar: { text: 'NK', bg: '#FDF6EC', color: '#7A5C3A' }, time: '2 phút', date: 'Hôm nay', preview: 'Bánh 3D xong chưa ạ? Em cần gấp cho ngày mai', read: false },
  { id: 2, name: 'Trần Hương', avatar: { text: 'TH', bg: '#F0FDF4', color: '#22C55E' }, time: '15 phút', date: 'Hôm nay', preview: 'Cảm ơn, bánh sinh nhật đẹp lắm!', read: false },
  { id: 3, name: 'Phạm Thu', avatar: { text: 'PT', bg: '#EFF6FF', color: '#3B82F6' }, time: '1 giờ', date: 'Hôm nay', preview: 'Tôi muốn đặt thêm 5 hộp cupcake cho tuần tới', read: false },
  { id: 4, name: 'Lê Minh', avatar: { text: 'LM', bg: '#F5F3FF', color: '#7C3AED' }, time: '3 giờ', date: 'Hôm nay', preview: 'Giá bánh cưới 5 tầng bao nhiêu ạ?', read: true },
  { id: 5, name: 'Cao Lan', avatar: { text: 'CL', bg: '#FEFCE8', color: '#F59E0B' }, time: '5 giờ', date: 'Hôm nay', preview: 'Hoàn hảo, đúng như tôi mong chờ!', read: true },
  { id: 6, name: 'Bùi Lan', avatar: { text: 'BL', bg: '#FDF6EC', color: '#7A5C3A' }, time: '1 ngày', date: 'Hôm qua', preview: 'Liên hệ sau để tính số lượng lớn nhé', read: true },
]
</script>
