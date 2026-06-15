<template>
  <div class="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl">
    <div class="mb-6 flex items-center justify-between gap-4">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Hoạt động gần đây</p>
        <p class="mt-2 text-xs text-emerald-500">Đang cập nhật liên tục</p>
      </div>
      <span class="text-xs font-medium text-slate-400">3 đơn hàng</span>
    </div>

    <ul class="space-y-4">
      <li v-for="item in activities" :key="item.id" class="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-sm font-semibold text-slate-900 shadow-sm">
            {{ item.initials }}
          </div>
          <div>
            <p class="font-semibold text-slate-900">{{ item.order }}</p>
            <p class="mt-1 text-sm text-slate-500">{{ item.description }}</p>
          </div>
        </div>
        <div class="flex flex-col items-start gap-2 text-right sm:items-end">
          <span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold" :class="item.statusClass">{{ item.status }}</span>
          <p class="text-sm font-semibold text-slate-900">{{ item.amount }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const activities = [
  {
    id: 1,
    initials: 'NK',
    order: '#DH2045',
    description: 'Bánh 3D Custom – Mèo Shiba',
    status: 'Sản xuất',
    amount: '2,500,000đ',
    statusClass: 'bg-rose-100 text-rose-600'
  },
  {
    id: 2,
    initials: 'TH',
    order: '#DH2044',
    description: 'Bánh sinh nhật 3 tầng',
    status: 'Hoàn thành',
    amount: '1,800,000đ',
    statusClass: 'bg-emerald-100 text-emerald-600'
  },
  {
    id: 3,
    initials: 'LM',
    order: '#DH2043',
    description: 'Bánh cưới kem tươi',
    status: 'Chờ nhận',
    amount: '4,200,000đ',
    statusClass: 'bg-amber-100 text-amber-700'
  }
];
</script>
