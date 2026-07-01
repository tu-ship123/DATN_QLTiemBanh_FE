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

      <div v-if="parsed.checklist.length" class="checklist-toppings">
        <p class="checklist-title" style="margin-top: 10px;">Topping / phụ kiện cần gắn</p>
        <ul>
          <li v-for="t in parsed.checklist" :key="t.ten">
            <span>{{ t.ten }}</span>
            <span class="topping-qty">x{{ t.soLuong }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Viewer CHỈ XEM (read-only) dành cho nhân viên bếp: dựng lại nhanh hình dáng bánh +
 * vị trí topping từ JSON thiết kế đã lưu ở đơn hàng (GET /api/v1/orders/{id}/design),
 * kèm 1 bảng thông số rõ ràng bên dưới để bếp không cần đoán qua hình 3D.
 *
 * Không có bất kỳ thao tác chỉnh sửa nào ở đây (không kéo-thả, không đổi màu...).
 * Component này KHÔNG dùng lại code của CakeBuilder3D.vue (bên đó dành cho khách chỉnh sửa),
 * mà tự dựng 1 scene Three.js đơn giản, nhẹ hơn, chỉ để xoay/zoom xem.
 */

const props = defineProps({
  // Dữ liệu thô trả về từ GET /api/v1/orders/{id}/design (dạng khung/tang/trang_tri),
  // hoặc dạng snapshot thô của CakeBuilder3D (shape/size/tierCount/accessories) - viewer tự nhận diện.
  design: { type: Object, default: null },
})

const containerRef = ref(null)
const parsed = ref(null)

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
      })),
    }
  }

  // Trường hợp B: dữ liệu thô kiểu snapshot CakeBuilder3D: { shape, size, tierCount, frostingColor, message, accessories }
  const accessories = Array.isArray(raw.accessories) ? raw.accessories : []
  const grouped = new Map()
  for (const acc of accessories) {
    const ten = acc.tenPhuKien || acc.ten_phu_kien || 'Phụ kiện'
    grouped.set(ten, (grouped.get(ten) || 0) + 1)
  }
  return {
    hinhDangKey: mapShapeKey(raw.shape),
    mauNen: raw.frostingColor || '#FCEFE3',
    soTang: raw.tierCount || 1,
    loiChuc: raw.message || '',
    chieuCaoCm: null,
    duongKinhCm: null,
    markers: [...grouped.entries()].map(([ten, soLuong]) => ({ ten, soLuong, viTri: null })),
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

function buildCakeGroup(data) {
  const group = new THREE.Group()
  const tierTotal = Math.min(Math.max(data.soTang || 1, 1), 3)
  const tierHeight = tierTotal > 1 ? 0.42 : 0.55
  let cumulativeY = 0

  for (let i = 0; i < tierTotal; i++) {
    const scaleXZ = Math.max(0.42, 1 - i * 0.22)
    const geometry = buildTierGeometry(data.hinhDangKey, scaleXZ, tierHeight)
    const material = new THREE.MeshStandardMaterial({ color: data.mauNen, roughness: 0.55 })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.y = cumulativeY + tierHeight / 2
    group.add(mesh)
    cumulativeY += tierHeight
  }

  // Marker topping: quả cầu nhỏ đặt tại vi_tri đã lưu, hoặc rải đều quanh mặt bánh nếu không có toạ độ
  const totalMarkers = data.markers.reduce((sum, m) => sum + (m.soLuong || 1), 0)
  let idx = 0
  for (const m of data.markers) {
    for (let i = 0; i < (m.soLuong || 1); i++) {
      const pos = m.viTri || circularLayout(idx, totalMarkers)
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 16, 16),
        new THREE.MeshStandardMaterial({ color: markerColor(m.ten) })
      )
      marker.position.set(pos.x, pos.y ?? 0.6, pos.z)
      group.add(marker)
      idx += 1
    }
  }

  return group
}

function circularLayout(index, total) {
  const angle = (index / Math.max(total, 1)) * Math.PI * 2
  const radius = 0.45
  return { x: Math.cos(angle) * radius, y: 0.62, z: Math.sin(angle) * radius }
}

function markerColor(ten) {
  const n = (ten || '').toLowerCase()
  if (/nến|candle/.test(n)) return 0xe25822
  if (/hoa|flower|macaron/.test(n)) return 0xf28fb0
  if (/trái cây|fruit|dâu/.test(n)) return 0x6fbf73
  if (/oreo/.test(n)) return 0x3b2e2a
  if (/topper/.test(n)) return 0xffffff
  return 0xf6c453
}

function buildTierGeometry(shapeKey, scaleXZ, height) {
  if (shapeKey === 'square') {
    const size = 1.2 * scaleXZ
    return new THREE.BoxGeometry(size, height, size)
  }
  if (shapeKey === 'heart') {
    const size = 1.1 * scaleXZ
    return new THREE.BoxGeometry(size, height, size) // xấp xỉ đơn giản cho bản xem nhanh
  }
  const r = 0.75 * scaleXZ
  return new THREE.CylinderGeometry(r, r * 1.03, height, 40)
}

function render(data) {
  if (!scene) return
  clearScene()
  if (!data) return
  const group = buildCakeGroup(data)
  scene.add(group)
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
