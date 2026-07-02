<template>
  <div class="cake-viewer">
    <div class="cake-viewer-canvas-wrap">
      <div ref="containerRef" class="cake-viewer-canvas"></div>
      <div v-if="!parsed" class="cake-viewer-empty">
        <iconify-icon icon="ph:cube-transparent-duotone" class="text-3xl"></iconify-icon>
        <span>Đơn này chưa có dữ liệu thiết kế 3D.</span>
      </div>
    </div>

    <!-- Danh sách rõ ràng cho bếp làm theo, không cần đoán qua hình 3D -->
    <div v-if="parsed" class="cake-viewer-checklist">
      <p class="checklist-title">Thông số để làm bánh</p>
      <div class="checklist-grid">
        <div class="checklist-item">
          <span class="checklist-label">Hình dáng</span>
          <span class="checklist-value">{{ shapeLabel }}</span>
        </div>
        <div class="checklist-item">
          <span class="checklist-label">Số tầng</span>
          <span class="checklist-value">{{ parsed.soTang }} tầng</span>
        </div>
        <div class="checklist-item" v-if="parsed.duongKinhCm">
          <span class="checklist-label">Đường kính</span>
          <span class="checklist-value">{{ parsed.duongKinhCm }} cm</span>
        </div>
        <div class="checklist-item" v-if="parsed.chieuCaoCm">
          <span class="checklist-label">Chiều cao</span>
          <span class="checklist-value">{{ parsed.chieuCaoCm }} cm</span>
        </div>
        <div class="checklist-item">
          <span class="checklist-label">Màu kem nền</span>
          <span class="checklist-value">
            <span class="color-dot" :style="{ background: parsed.mauNen }"></span>{{ parsed.mauNen }}
          </span>
        </div>
      </div>

      <div v-if="parsed.loiChuc" class="checklist-message">
        <iconify-icon icon="ph:pen-nib-duotone"></iconify-icon> Lời chúc: “{{ parsed.loiChuc }}”
      </div>

      <div v-if="checklistItems.length" class="checklist-toppings">
        <p class="checklist-title" style="margin-top: 10px;">Topping / phụ kiện cần gắn</p>
        <ul>
          <li v-for="(t, idx) in checklistItems" :key="t.ten + '-' + idx">
            <span>{{ t.ten }}</span>
            <span class="topping-qty">x{{ t.soLuong }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { loadCakeShapeObject3D, buildAccessoryMesh, SIZE_CM } from '@/composables/useCakeSceneKit'

/**
 * Viewer CHỈ XEM (read-only) dành cho nhân viên bếp: dựng lại hình dáng bánh + vị trí
 * phụ kiện từ JSON thiết kế đã lưu ở đơn hàng (GET /api/v1/orders/{id}/design), kèm 1 bảng
 * thông số rõ ràng bên dưới để bếp không cần đoán qua hình 3D.
 *
 * Component này DÙNG CHUNG hàm dựng hình bánh + phụ kiện với CakeBuilder3D.vue (qua
 * useCakeSceneKit.js), nên hình vẽ ra Y CHANG những gì khách đã thấy lúc thiết kế -
 * không phải bản đoán lại riêng theo từ khoá tên phụ kiện như trước.
 * Không có bất kỳ thao tác chỉnh sửa nào ở đây (không kéo-thả, không đổi màu...).
 */

const props = defineProps({
  // Dữ liệu thô trả về từ GET /api/v1/orders/{id}/design (dạng khung/tang/trang_tri),
  // hoặc dạng snapshot thô của CakeBuilder3D (shape/size/tierCount/accessories) - viewer tự nhận diện.
  design: { type: Object, default: null },
})

const containerRef = ref(null)
const parsed = ref(null)

/** Danh sách marker ở parsed.markers là TỪNG PHỤ KIỆN RIÊNG LẺ (để vẽ đúng vị trí 3D thật);
 *  checklist chữ bên dưới thì gộp lại theo tên cho dễ đọc (VD "Bánh quy Oreo x5" thay vì 5 dòng x1). */
const checklistItems = computed(() => {
  const list = parsed.value?.markers || []
  const grouped = new Map()
  for (const m of list) {
    grouped.set(m.ten, (grouped.get(m.ten) || 0) + (m.soLuong || 1))
  }
  return [...grouped.entries()].map(([ten, soLuong]) => ({ ten, soLuong }))
})

let scene, camera, renderer, controls, animationId, resizeObserver

const SHAPE_LABELS = { round: 'Tròn', square: 'Vuông', heart: 'Trái tim' }
const shapeLabel = ref('Tròn')

function mapShapeKey(raw) {
  const v = (raw || '').toString().toUpperCase()
  if (v === 'VUONG' || v === 'SQUARE') return 'square'
  if (v === 'TIM' || v === 'HEART') return 'heart'
  if (v === 'TRON' || v === 'ROUND' || !v) return 'round'
  return 'round'
}

/** Chuẩn hoá 2 khả năng dữ liệu đầu vào về cùng 1 cấu trúc để vẽ + hiển thị checklist. */
function normalizeDesign(raw) {
  if (!raw || typeof raw !== 'object') return null

  // Trường hợp A: đúng schema backend (CakeDesignDto): { khung, tang, trang_tri, loi_chuc }
  if (raw.khung) {
    const khung = raw.khung || {}
    const kichThuoc = khung.kich_thuoc || {}
    const trangTriRaw = Array.isArray(raw.trang_tri) ? raw.trang_tri : []
    return {
      hinhDangKey: mapShapeKey(khung.hinh_dang),
      mauNen: khung.mau_nen || '#FCEFE3',
      soTang: Array.isArray(raw.tang) && raw.tang.length ? raw.tang.length : 1,
      loiChuc: raw.loi_chuc || '',
      chieuCaoCm: kichThuoc.chieu_cao_cm || null,
      duongKinhCm: kichThuoc.duong_kinh_cm || null,
      markers: trangTriRaw.map((t, i) => ({
        ten: t.ten_phu_kien || t.tenPhuKien || `Phụ kiện ${i + 1}`,
        soLuong: t.so_luong || t.soLuong || 1,
        viTri: t.vi_tri || t.viTri || null,
        model3dUrl: t.model_3d_url || t.model3dUrl || null,
      })),
    }
  }

  // Trường hợp B: dữ liệu thô kiểu snapshot thật từ CakeBuilder3D.captureSnapshot():
  // { shape, size, tierCount, frostingColor, message, accessories: [{ tenPhuKien, position:{x,y,z}, rotationY }] }
  // Từ giờ mỗi phần tử accessories = 1 phụ kiện thật đã gắn, có toạ độ 3D thật -> dùng thẳng,
  // không gộp/đoán vị trí vòng tròn nữa (chỉ dùng circularLayout dự phòng cho đơn hàng CŨ lưu trước khi sửa lỗi này).
  //
  // LƯU Ý (đã sửa lỗi): trước đây chieuCaoCm/duongKinhCm luôn bị bỏ trống ở nhánh này ->
  // bên bếp mở đơn lên KHÔNG BAO GIỜ thấy số cm dù khách rõ ràng đã chọn size (S/M/L) lúc
  // thiết kế. Giờ tra lại đúng bảng SIZE_CM (dùng CHUNG với CakeBuilder3D.vue) theo raw.size
  // để hiện đúng số cm khách đã chọn - y hệt những gì khách nhìn thấy ở CakeBuilder3D.
  const accessories = Array.isArray(raw.accessories) ? raw.accessories : []
  return {
    hinhDangKey: mapShapeKey(raw.shape),
    mauNen: raw.frostingColor || '#FCEFE3',
    soTang: raw.tierCount || 1,
    loiChuc: raw.message || '',
    chieuCaoCm: null, // hệ thống hiện chưa lưu chiều cao riêng theo cm (chỉ có hệ số scale 3D)
    duongKinhCm: SIZE_CM[raw.size] || null,
    markers: accessories.map((acc) => ({
      ten: acc.tenPhuKien || acc.ten_phu_kien || 'Phụ kiện',
      soLuong: acc.soLuong ?? acc.so_luong ?? 1, // dữ liệu cũ (đã gộp trước khi sửa) mới có field này
      viTri: acc.position || acc.viTri || null,
      rotationY: acc.rotationY || 0,
      model3dUrl: acc.model3dUrl || null,
    })),
  }
}

function initScene() {
  const el = containerRef.value
  if (!el) return

  scene = new THREE.Scene()
  scene.background = null

  const width = el.clientWidth || 400
  const height = el.clientHeight || 320
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(1.8, 1.6, 2.2)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  el.appendChild(renderer.domElement)

  scene.add(new THREE.AmbientLight(0xffffff, 0.9))
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
  dirLight.position.set(2, 4, 3)
  scene.add(dirLight)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.enablePan = false
  controls.minDistance = 1.2
  controls.maxDistance = 5
  controls.target.set(0, 0.4, 0)

  resizeObserver = new ResizeObserver(() => {
    if (!el.clientWidth || !el.clientHeight) return
    camera.aspect = el.clientWidth / el.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(el.clientWidth, el.clientHeight)
  })
  resizeObserver.observe(el)

  animate()
}

function animate() {
  animationId = requestAnimationFrame(animate)
  controls?.update()
  renderer?.render(scene, camera)
}

function clearScene() {
  if (!scene) return
  for (const child of [...scene.children]) {
    if (child.isLight) continue
    scene.remove(child)
    child.geometry?.dispose?.()
    child.material?.dispose?.()
  }
}


/** Dựng lại đúng scene bánh bằng CHUNG bộ hàm với CakeBuilder3D.vue (useCakeSceneKit.js):
 *  cùng model 3D thật / cùng hình mẫu dựng sẵn cho cốt bánh, cùng cách chọn model cho phụ
 *  kiện (ưu tiên model3dUrl thật, dự phòng đoán theo tên) -> hình vẽ ra y hệt bên khách. */
async function buildCakeGroup(data) {
  const group = new THREE.Group()
  const { object3d } = await loadCakeShapeObject3D(data.hinhDangKey, data.mauNen, data.soTang || 1)
  group.add(object3d)

  const totalMarkers = data.markers.reduce((sum, m) => sum + (m.soLuong || 1), 0)
  let idx = 0
  for (const m of data.markers) {
    for (let i = 0; i < (m.soLuong || 1); i++) {
      const pos = m.viTri || circularLayout(idx, totalMarkers)
      const marker = await buildAccessoryMesh({ id: m.ten, tenPhuKien: m.ten, model3dUrl: m.model3dUrl })
      marker.position.set(pos.x, pos.y ?? 0.6, pos.z)
      marker.rotation.y = m.rotationY || 0
      group.add(marker)
      idx += 1
    }
  }

  return group
}

/** Dự phòng: chỉ dùng khi đơn hàng CŨ (lưu trước khi sửa lỗi thiếu toạ độ 3D) không có
 *  vị trí thật cho phụ kiện -> rải đều quanh mặt bánh thay vì chồng hết lên 1 điểm. */
function circularLayout(index, total) {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2
  const radius = 0.45
  return { x: Math.cos(angle) * radius, y: 0.62, z: Math.sin(angle) * radius }
}

let renderToken = 0

function render(data) {
  if (!scene) return
  clearScene()
  if (!data) return
  const myToken = ++renderToken
  buildCakeGroup(data).then((group) => {
    // Nếu design đổi lần nữa trong lúc đang load model (async) -> renderToken đã đổi, bỏ kết quả cũ
    if (scene && renderToken === myToken) scene.add(group)
  })
}

function refresh() {
  parsed.value = normalizeDesign(props.design)
  shapeLabel.value = SHAPE_LABELS[parsed.value?.hinhDangKey] || 'Tròn'
  render(parsed.value)
}

watch(() => props.design, refresh, { deep: true })

onMounted(() => {
  initScene()
  refresh()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  resizeObserver?.disconnect()
  controls?.dispose()
  renderer?.dispose()
  if (renderer?.domElement?.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement)
  }
})
</script>

<style scoped>
.cake-viewer {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cake-viewer-canvas-wrap {
  position: relative;
  width: 100%;
  height: 260px;
  border-radius: 14px;
  background: linear-gradient(180deg, #fff8ec, #fbeedb);
  overflow: hidden;
}

.cake-viewer-canvas {
  width: 100%;
  height: 100%;
}

.cake-viewer-empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #a68b5c;
  font-size: 12px;
  font-weight: 600;
}

.cake-viewer-checklist {
  background: #fdf6ec;
  border: 1px solid #ede0cc;
  border-radius: 14px;
  padding: 14px 16px;
}

.checklist-title {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #a68b5c;
  margin: 0 0 8px;
}

.checklist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px 16px;
}

.checklist-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.checklist-label {
  font-size: 11px;
  color: #a68b5c;
}

.checklist-value {
  font-size: 13px;
  font-weight: 700;
  color: #5c4428;
  display: flex;
  align-items: center;
  gap: 6px;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.15);
  display: inline-block;
}

.checklist-message {
  margin-top: 10px;
  font-size: 13px;
  color: #5c4428;
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 6px;
}

.checklist-toppings ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.checklist-toppings li {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #5c4428;
  border-bottom: 1px dashed #ede0cc;
  padding-bottom: 4px;
}

.topping-qty {
  font-weight: 800;
  color: #7a5c3a;
}
</style>