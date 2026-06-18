<template>
  <div class="overflow-hidden rounded-[32px] shadow-xl transition-transform duration-200 hover:-translate-y-1">
    <div :class="['h-full rounded-[32px] p-[1px]', accent]">
      <div class="flex h-full flex-col justify-between gap-6 rounded-[30px] bg-white p-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">{{ title }}</p>
            <p class="mt-4 text-3xl font-semibold text-slate-900">{{ value }}</p>
          </div>
          <div class="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-2xl shadow-sm">
            {{ icon }}
          </div>
        </div>
        <div class="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
          <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
          {{ note }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  value: String,
  note: String,
  icon: String,
  accent: String
});
</script>
