<template>
  <div class="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Phân tích doanh thu</p>
        <p class="mt-2 text-lg font-semibold text-slate-900">Năm 2026 · Tất cả sản phẩm</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100">Tháng</button>
        <button class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100">Quý</button>
        <button class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100">Năm</button>
      </div>
    </div>

    <div class="relative h-80 rounded-[28px] bg-slate-50 p-4 shadow-inner">
      <canvas ref="chartRef" class="h-full w-full" />
    </div>

    <div class="mt-6 grid gap-4 sm:grid-cols-3">
      <div class="rounded-3xl bg-slate-50 p-4 text-center">
        <p class="text-sm text-slate-500">Tổng doanh thu</p>
        <p class="mt-2 text-xl font-semibold text-slate-900">657.5M đ</p>
      </div>
      <div class="rounded-3xl bg-slate-50 p-4 text-center">
        <p class="text-sm text-slate-500">Đơn hoàn thành</p>
        <p class="mt-2 text-xl font-semibold text-slate-900">1,284</p>
      </div>
      <div class="rounded-3xl bg-slate-50 p-4 text-center">
        <p class="text-sm text-slate-500">Trung bình/đơn</p>
        <p class="mt-2 text-xl font-semibold text-slate-900">512K đ</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const chartRef = ref(null);

const chartData = {
  labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
  datasets: [
    {
      label: 'Doanh thu',
      data: [42000000, 52000000, 48000000, 63000000, 71000000, 85000000],
      borderColor: '#fb923c',
      backgroundColor: 'rgba(251, 146, 60, 0.18)',
      fill: true,
      tension: 0.2,
      borderWidth: 3,
      pointRadius: 5,
      pointHoverRadius: 8,
      pointBackgroundColor: '#f97316',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2
    }
  ]
};

onMounted(() => {
  if (!chartRef.value) return;
  new Chart(chartRef.value, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#1f2937',
          bodyColor: '#1f2937',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            title: context => `${context[0].label} · Doanh thu`,
            label: context => `${Number(context.formattedValue).toLocaleString('vi-VN')} đ`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#6b7280', font: { weight: 500 } }
        },
        y: {
          grid: { color: '#e5e7eb' },
          ticks: {
            color: '#6b7280',
            callback: value => `${Number(value).toLocaleString('vi-VN')} đ`
          }
        }
      },
      interaction: {
        mode: 'nearest',
        intersect: false
      }
    }
  });
});
</script>
