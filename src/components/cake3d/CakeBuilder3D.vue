<template>
  <div class="cake3d chocopine-card p-6 md:p-8 space-y-6">
    <!-- ===== Header + chọn hình dáng cốt bánh (T046) ===== -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="chocopine-heading-sm" style="margin: 0;">Thiết kế bánh 3D</h2>
        <p class="chocopine-desc" style="margin: 4px 0 0; font-size: 13px; text-align: left;">
          Chọn hình dáng, size và màu kem nền, kéo chuột để xoay và cuộn để zoom.
        </p>
      </div>

      <div class="shape-group">
        <button
          v-for="shape in shapes"
          :key="shape.key"
          type="button"
          class="shape-btn"
          :class="{ 'shape-btn--active': currentShape === shape.key }"
          :disabled="loading"
          @click="selectShape(shape.key)"
        >
          <iconify-icon :icon="shape.icon" class="text-xl"></iconify-icon>
          <span>{{ shape.label }}</span>
        </button>

        <!-- ===== T053: Undo/Redo lịch sử thao tác 3D ===== -->
        <div class="history-group">
          <button
            type="button"
            class="history-btn"
            title="Hoàn tác (Ctrl+Z)"
            :disabled="!canUndo"
            @click="undo"
          >
            <iconify-icon icon="ph:arrow-counter-clockwise-bold" class="text-lg"></iconify-icon>
          </button>
          <button
            type="button"
            class="history-btn"
            title="Làm lại (Ctrl+Y)"
            :disabled="!canRedo"
            @click="redo"
          >
            <iconify-icon icon="ph:arrow-clockwise-bold" class="text-lg"></iconify-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Canvas 3D (T045) + Kéo-thả phụ kiện (T051) + Di chuyển/Xóa (T052) ===== -->
    <div
      ref="containerRef"
      class="cake3d-canvas"
      :class="{ 'cake3d-canvas--drop-active': isDragOverCanvas }"
      @dragover.prevent="onCanvasDragOver"
      @dragleave="onCanvasDragLeave"
      @drop="onCanvasDrop"
    >
      <div v-if="loading" class="cake3d-overlay">
        <span class="cake3d-spinner"></span>
        <span>Đang tải mô hình...</span>
      </div>

      <div v-else-if="loadError" class="cake3d-overlay cake3d-overlay--warn">
        <iconify-icon icon="ph:warning-circle-duotone" class="text-2xl"></iconify-icon>
        <span>{{ loadError }}</span>
      </div>

      <div v-if="!loading" class="cake3d-overlay cake3d-overlay--hint">
        <iconify-icon icon="ph:hand-pointing-duotone" class="text-lg"></iconify-icon>
        <span>Kéo phụ kiện ở danh sách bên cạnh thả lên bánh để trang trí</span>
      </div>

      <div v-if="selectedMarkerUid" class="cake3d-selected-toolbar">
        <span>{{ selectedMarkerName }}</span>
        <button type="button" class="cake3d-delete-btn" @click="removeMarkerByUser(selectedMarkerUid)">
          <iconify-icon icon="ph:trash-duotone" class="text-base"></iconify-icon>
          Xóa (phím Delete)
        </button>
      </div>
    </div>

    <!-- ===== T049: Viết chữ lên bánh (CanvasTexture) ===== -->
    <div class="cake3d-option-block">
      <span class="cake3d-option-label">Lời chúc trên bánh</span>
      <div class="message-row">
        <input
          type="text"
          class="message-text-input"
          v-model="cakeMessage"
          maxlength="40"
          placeholder="VD: Chúc mừng sinh nhật!"
          @focus="beginEdit"
          @blur="commitEdit"
        />
        <input
          type="color"
          class="color-swatch-input"
          v-model="messageColorHex"
          @input="applyCakeMessage(cakeMessage)"
          @mousedown="beginEdit"
          @change="commitEdit"
          title="Màu chữ"
        />
      </div>
      <span class="message-hint">Nhập lời chúc, chữ sẽ hiển thị lên mặt bánh ngay lập tức (tối đa 40 ký tự).</span>
    </div>

    <!-- ===== T047: ColorPicker màu kem nền + T048: Size selector & ước tính giá ===== -->
    <div class="cake3d-options">
      <div class="cake3d-option-block">
        <span class="cake3d-option-label">Màu kem nền</span>
        <div class="color-picker-row">
          <input
            type="color"
            class="color-swatch-input"
            v-model="frostingColorHex"
            @input="applyFrostingColor(frostingColorHex)"
            @mousedown="beginEdit"
            @change="commitEdit"
          />
          <span class="color-hex">{{ frostingColorHex.toUpperCase() }}</span>
        </div>
      </div>

      <div class="cake3d-option-block">
        <span class="cake3d-option-label">Size bánh</span>
        <div class="size-group">
          <button
            v-for="size in sizes"
            :key="size.key"
            type="button"
            class="size-btn"
            :class="{ 'size-btn--active': currentSize === size.key }"
            @click="selectSize(size.key)"
          >
            {{ size.label }}
          </button>
        </div>
      </div>

      <div class="cake3d-option-block">
        <span class="cake3d-option-label">Số tầng bánh</span>
        <div class="size-group">
          <button
            v-for="tier in tiers"
            :key="tier.key"
            type="button"
            class="size-btn"
            :class="{ 'size-btn--active': tierCount === tier.key }"
            :disabled="loading"
            @click="selectTier(tier.key)"
          >
            {{ tier.label }}
          </button>
        </div>
      </div>

      <div class="cake3d-price">
        <div class="cake3d-price-row">
          <span>Giá bánh theo size</span>
          <span>{{ formatPrice(basePrice) }}</span>
        </div>
        <div class="cake3d-price-row" v-if="tierExtraPrice > 0">
          <span>Phụ phí {{ tierCount }} tầng</span>
          <span>{{ formatPrice(tierExtraPrice) }}</span>
        </div>
        <div class="cake3d-price-row" v-if="accessoriesTotal > 0">
          <span>Phụ kiện trang trí</span>
          <span>{{ formatPrice(accessoriesTotal) }}</span>
        </div>
        <div class="cake3d-price-row cake3d-price-row--total">
          <span>Tổng cộng</span>
          <span>{{ formatPrice(totalPrice) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useDecorAccessories } from '@/composables/useDecorAccessories'
import { formatPrice } from '@/utils/format'

const { state: decorState, addOne, removeOne, ensureLoaded } = useDecorAccessories()

const props = defineProps({
  // Tổng tiền phụ kiện trang trí - sẽ được các task sau (T050/T051: chọn phụ kiện) truyền vào
  accessoriesTotal: { type: Number, default: 0 },
})

const emit = defineEmits(['price-change', 'design-change'])

/**
 * T046 - mỗi hình dáng tương ứng 1 file model 3D.
 * Đặt file thật vào thư mục `public/models/` với đúng tên bên dưới,
 * Three.js sẽ tự động dùng model thật thay vì hình mẫu dựng sẵn (fallback).
 */
const MODEL_PATHS = {
  round: '/models/cake-round.glb',
  square: '/models/cake-square.glb',
  heart: '/models/cake-heart.glb',
}

const shapes = [
  { key: 'round', label: 'Tròn', icon: 'ph:circle-duotone' },
  { key: 'square', label: 'Vuông', icon: 'ph:square-duotone' },
  { key: 'heart', label: 'Trái tim', icon: 'ph:heart-duotone' },
]

/**
 * T-mới - Model 3D thật cho phụ kiện trang trí (thay cho hình mẫu dựng sẵn buildXxxVisual()).
 * Nếu tên file của bạn khác, chỉ cần sửa đường dẫn ở đây, không cần sửa chỗ nào khác.
 */
const ACCESSORY_MODEL_PATHS = {
  candle: '/models/birthday_candle.glb',
  fruit: '/models/free_raspberry.glb',
  macaron: '/models/sweet_strawberry_macaron.glb',
  oreo: '/models/oreo.glb',
}
const accessoryModelCache = {} // key -> Promise<GLTF>, tránh load lại file mỗi lần kéo thêm 1 phụ kiện cùng loại

function loadAccessoryModel(key) {
  if (!accessoryModelCache[key]) {
    accessoryModelCache[key] = gltfLoader.loadAsync(ACCESSORY_MODEL_PATHS[key])
  }
  return accessoryModelCache[key]
}

// T048 - mỗi size có 1 hệ số phóng to/thu nhỏ + 1 mức giá cụ thể
const sizes = [
  { key: 's', label: 'S - 16cm', scale: 0.82, price: 320000 },
  { key: 'm', label: 'M - 20cm', scale: 1, price: 420000 },
  { key: 'l', label: 'L - 25cm', scale: 1.22, price: 560000 },
]

// Số tầng bánh - mỗi tầng thêm 1 mức phụ phí (bánh nhiều tầng luôn dùng hình mẫu dựng sẵn)
const tiers = [
  { key: 1, label: '1 tầng', extraPrice: 0 },
  { key: 2, label: '2 tầng', extraPrice: 150000 },
  { key: 3, label: '3 tầng', extraPrice: 320000 },
]

let resolveBuilderReady
const builderReadyPromise = new Promise((resolve) => { resolveBuilderReady = resolve })

const containerRef = ref(null)
const currentShape = ref('round')
const currentSize = ref('m')
const tierCount = ref(1) // T-mới: số tầng bánh
const frostingColorHex = ref('#FCEFE3')
const loading = ref(false)
const loadError = ref('')
const cakeMessage = ref('') // T049 - lời chúc viết lên bánh
const messageColorHex = ref('#7a4a2b') // màu chữ lời chúc
const isDragOverCanvas = ref(false) // T051 - highlight canvas khi đang kéo phụ kiện ngang qua
const selectedMarkerUid = ref(null) // T052 - phụ kiện đang được chọn trên bánh (để xóa)
const placedAccessories = ref([]) // T051/T052 - danh sách phụ kiện đã gắn lên bánh [{uid, phuKienId, tenPhuKien}]

// T053 - Undo/Redo lịch sử thao tác 3D (tối đa 20 bước mỗi chiều)
const MAX_HISTORY = 20
const undoStack = ref([])
const redoStack = ref([])
const canUndo = computed(() => undoStack.value.length > 0)
const canRedo = computed(() => redoStack.value.length > 0)
let isRestoring = false // true trong lúc undo()/redo() đang dựng lại scene -> không ghi lịch sử thêm
let pendingSnapshotBeforeEdit = null // dùng cho các thao tác kéo-thả liên tục (màu sắc, gõ chữ, kéo phụ kiện)

const selectedMarkerName = computed(
  () => placedAccessories.value.find((p) => p.uid === selectedMarkerUid.value)?.tenPhuKien || ''
)

/* ----------------------------------------------------------------
 * T053 - Undo/Redo: lưu/khôi phục toàn bộ trạng thái thiết kế bánh
 * (hình dáng, size, số tầng, màu kem, lời chúc, danh sách phụ kiện + vị trí/góc xoay)
 * ---------------------------------------------------------------- */
function captureSnapshot() {
  return {
    shape: currentShape.value,
    size: currentSize.value,
    tierCount: tierCount.value,
    frostingColor: frostingColorHex.value,
    message: cakeMessage.value,
    messageColor: messageColorHex.value,
    accessories: placedAccessories.value.map((p) => {
      const marker = placedMeshes.get(p.uid)
      return {
        uid: p.uid,
        phuKienId: p.phuKienId,
        tenPhuKien: p.tenPhuKien,
        position: marker ? { x: marker.position.x, y: marker.position.y, z: marker.position.z } : { x: 0, y: 0, z: 0 },
        rotationY: marker ? marker.rotation.y : 0,
      }
    }),
  }
}

/** Ghi 1 bước lịch sử NGAY TRƯỚC KHI thực hiện 1 thao tác rời rạc (đổi hình dáng, size,
 *  số tầng, thêm/xóa phụ kiện...). Mỗi lần ghi mới sẽ xóa nhánh redo cũ. */
function recordHistory() {
  if (isRestoring) return
  undoStack.value.push(captureSnapshot())
  if (undoStack.value.length > MAX_HISTORY) undoStack.value.shift()
  redoStack.value = []
}

/** Dùng cho thao tác liên tục (kéo color picker, gõ lời chúc, kéo di chuyển phụ kiện):
 *  beginEdit() chụp lại trạng thái TRƯỚC khi bắt đầu sửa, commitEdit() mới thật sự đẩy
 *  vào undoStack khi người dùng đã hoàn tất (buông chuột / rời focus), tránh ghi lịch sử
 *  dồn dập theo từng pixel kéo hay từng ký tự gõ. */
function beginEdit() {
  if (isRestoring) return
  pendingSnapshotBeforeEdit = captureSnapshot()
}

function commitEdit() {
  if (isRestoring || !pendingSnapshotBeforeEdit) return
  undoStack.value.push(pendingSnapshotBeforeEdit)
  if (undoStack.value.length > MAX_HISTORY) undoStack.value.shift()
  redoStack.value = []
  pendingSnapshotBeforeEdit = null
}

/** Xóa sạch phụ kiện hiện có trên bánh (dùng nội bộ khi khôi phục snapshot,
 *  không ghi thêm lịch sử vì recordHistory() đã được gọi ở undo()/redo()). */
function clearAllMarkers() {
  for (const uid of [...placedMeshes.keys()]) removeMarker(uid)
}

/** Dựng lại từng phụ kiện đúng vị trí + góc xoay đã lưu trong snapshot. */
async function restoreAccessoriesFromSnapshot(list) {
  for (const acc of list || []) {
    const itemDef = decorState.accessories.find((a) => a.id === acc.phuKienId) || {
      id: acc.phuKienId,
      tenPhuKien: acc.tenPhuKien,
      soLuongTon: Infinity,
    }
    addOne(itemDef) // khôi phục lại số lượng đã dùng tương ứng ở sidebar

    const marker = await buildMarkerMesh({ id: acc.phuKienId, tenPhuKien: acc.tenPhuKien })
    marker.position.set(acc.position.x, acc.position.y, acc.position.z)
    marker.rotation.y = acc.rotationY || 0
    marker.userData.isDecorMarker = true
    marker.userData.uid = acc.uid
    marker.userData.phuKienId = acc.phuKienId

    cakeGroup.add(marker)
    placedMeshes.set(acc.uid, marker)
    placedAccessories.value.push({ uid: acc.uid, phuKienId: acc.phuKienId, tenPhuKien: acc.tenPhuKien })
  }
}

/** Khôi phục toàn bộ scene về đúng trạng thái của 1 snapshot đã lưu. */
async function applySnapshot(snapshot) {
  isRestoring = true
  try {
    clearAllMarkers()
    selectMarker(null)

    currentShape.value = snapshot.shape
    currentSize.value = snapshot.size
    tierCount.value = snapshot.tierCount
    frostingColorHex.value = snapshot.frostingColor

    const found = sizes.find((s) => s.key === snapshot.size)
    targetScale = found ? found.scale : 1
    cakeGroup.scale.setScalar(targetScale) // áp ngay lập tức, không cần lerp mượt khi undo/redo

    await loadCakeShape(snapshot.shape) // rebuild đúng hình dáng + số tầng, tự áp lại màu kem

    cakeMessage.value = snapshot.message
    messageColorHex.value = snapshot.messageColor
    applyCakeMessage(snapshot.message)

    await restoreAccessoriesFromSnapshot(snapshot.accessories)
  } finally {
    isRestoring = false
  }
}

function undo() {
  if (!undoStack.value.length) return
  const prevSnapshot = undoStack.value.pop()
  redoStack.value.push(captureSnapshot())
  if (redoStack.value.length > MAX_HISTORY) redoStack.value.shift()
  applySnapshot(prevSnapshot)
}

/**
 * Nạp 1 mẫu bánh 3D dựng sẵn (xem fe/src/data/cakeTemplates.js) vào trạng thái đang chỉnh sửa.
 * Tái dùng lại đúng cơ chế applySnapshot() của Undo/Redo (T053) nên: đổi hình dáng, size,
 * số tầng, màu kem, lời chúc và toàn bộ phụ kiện lên đúng vị trí chỉ trong 1 lần gọi;
 * đồng thời tự động ghi 1 bước lịch sử TRƯỚC khi nạp mẫu, để khách bấm "Hoàn tác" (Undo)
 * có thể quay lại trạng thái trống trước khi chọn mẫu.
 * Khách vẫn có thể sửa/thêm/xóa bình thường sau khi mẫu đã được nạp — giá tiền
 * (totalPrice/price-change) tự tính lại như mọi thao tác chỉnh sửa khác.
 */
async function loadTemplate(mau) {
  if (!mau || !mau.thietKe) return

  await builderReadyPromise // chờ bánh mặc định dựng xong (tránh đụng độ nếu gọi ngay sau khi mount)
  await ensureLoaded() // đảm bảo đã có danh sách phụ kiện để đối chiếu phuKienId

  recordHistory() // để khách Undo được về trạng thái trước khi chọn mẫu

  const tk = mau.thietKe
  const snapshot = {
    shape: tk.shape || 'round',
    size: tk.size || 'm',
    tierCount: tk.tierCount || 1,
    frostingColor: tk.frostingColor || frostingColorHex.value,
    message: tk.message || '',
    messageColor: tk.messageColor || messageColorHex.value,
    accessories: buildAccessoriesFromTemplate(mau),
  }

  await applySnapshot(snapshot)
}

/** Bung danh sách phụ kiện của mẫu (mỗi phụ kiện có soLuong) thành danh sách phẳng
 *  từng phụ kiện đơn lẻ đúng định dạng mà restoreAccessoriesFromSnapshot() cần. */
function buildAccessoriesFromTemplate(mau) {
  const result = []
  const tk = mau.thietKe
  let counter = 0

  for (const acc of tk.accessories || []) {
    const positions = acc.viTri && acc.viTri.length ? acc.viTri : [{ x: 0, y: 0.6, z: 0 }]
    const soLuong = acc.soLuong || 1

    for (let i = 0; i < soLuong; i++) {
      counter += 1
      const pos = positions[i] || positions[positions.length - 1]
      result.push({
        uid: `tmpl-${mau.id}-${acc.phuKienId}-${counter}-${Date.now()}`,
        phuKienId: acc.phuKienId,
        tenPhuKien: acc.tenPhuKien,
        position: pos,
        rotationY: 0,
      })
    }
  }

  return result
}

function redo() {
  if (!redoStack.value.length) return
  const nextSnapshot = redoStack.value.pop()
  undoStack.value.push(captureSnapshot())
  if (undoStack.value.length > MAX_HISTORY) undoStack.value.shift()
  applySnapshot(nextSnapshot)
}

// Các object Three.js không cần reactivity sâu -> dùng biến thường
let scene, camera, renderer, controls, animationId, resizeObserver
let targetScale = 1
const cakeGroup = new THREE.Group()
const gltfLoader = new GLTFLoader()
const MARKER_OFFSET = 0.002
 // nhích phụ kiện lên khỏi mặt bánh 1 chút, tránh z-fighting

// T051/T052 - Raycaster dùng chung cho thả phụ kiện / chọn / kéo di chuyển trên bánh
const raycaster = new THREE.Raycaster()
const pointerNDC = new THREE.Vector2()
let cakeSurfaceMeshes = [] // các mesh thuộc hình dáng bánh hiện tại (để raycast tìm bề mặt)
let topTierMeshes = [] // chỉ các mesh của TẦNG TRÊN CÙNG (để canh lời chúc đúng mặt trên cùng, không lẫn topping)
const placedMeshes = new Map() // uid -> THREE.Group (marker phụ kiện đã gắn)
let draggingMarkerUid = null // uid marker đang được kéo di chuyển (T052)

// T049 - CanvasTexture dùng để vẽ lời chúc realtime lên mặt bánh
const messageCanvas = document.createElement('canvas')
messageCanvas.width = 512
messageCanvas.height = 512
const messageCtx = messageCanvas.getContext('2d')
const messageTexture = new THREE.CanvasTexture(messageCanvas)
let messageMesh = null

/* ----------------------------------------------------------------
 * T045: Khởi tạo Scene + Camera + Lighting + OrbitControls
 * ---------------------------------------------------------------- */
function initScene() {
  const container = containerRef.value
  const width = container.clientWidth
  const height = container.clientHeight

  scene = new THREE.Scene()
  scene.background = null // để nền trong suốt, hoà với chocopine-card

  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
  camera.position.set(2.6, 2.1, 3.4)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace // bắt buộc cho model GLTF có texture, thiếu dòng này texture sẽ ra đen/sai màu
  container.appendChild(renderer.domElement)

  // --- Ánh sáng ---
  const ambient = new THREE.AmbientLight(0xfff1de, 0.7)
  scene.add(ambient)

  const keyLight = new THREE.DirectionalLight(0xfff6e8, 1.4)
  keyLight.position.set(3, 5, 2)
  keyLight.castShadow = true
  keyLight.shadow.mapSize.set(1024, 1024)
  keyLight.shadow.camera.near = 0.5
  keyLight.shadow.camera.far = 15
  scene.add(keyLight)

  const fillLight = new THREE.DirectionalLight(0xb8956a, 0.35)
  fillLight.position.set(-3, 2, -2)
  scene.add(fillLight)

  // --- Mặt bàn để bánh có bóng đổ, nhìn thật hơn ---
  const plate = new THREE.Mesh(
    new THREE.CircleGeometry(2.4, 48),
    new THREE.MeshStandardMaterial({ color: 0xfdf6ec, roughness: 0.9 })
  )
  plate.rotation.x = -Math.PI / 2
  plate.position.y = -0.001
  plate.receiveShadow = true
  scene.add(plate)

  scene.add(cakeGroup)

  // T049 - Mesh phẳng hiển thị lời chúc, là con của cakeGroup để tự xoay/scale theo bánh
  const messageMaterial = new THREE.MeshBasicMaterial({
    map: messageTexture,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,
  })
  messageMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), messageMaterial)
  messageMesh.rotation.x = -Math.PI / 2 // nằm úp mặt lên trên, song song mặt bánh
  messageMesh.visible = false
  cakeGroup.add(messageMesh)

  // --- OrbitControls: xoay / zoom khung nhìn ---
  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0.4, 0)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 2
  controls.maxDistance = 6
  controls.maxPolarAngle = Math.PI / 2.05 // không cho xoay xuống dưới mặt bàn
  controls.update()

  animate()

  resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(container)

  // T052 - chọn / kéo di chuyển / xóa phụ kiện đã gắn lên bánh
  renderer.domElement.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('keydown', onKeyDown)
}

function animate() {
  animationId = requestAnimationFrame(animate)
  controls.update()

  // T048: phóng to/thu nhỏ mượt theo đúng tỉ lệ khi đổi size (lerp mỗi frame)
  const current = cakeGroup.scale.x
  if (Math.abs(current - targetScale) > 0.001) {
    const next = THREE.MathUtils.lerp(current, targetScale, 0.12)
    cakeGroup.scale.setScalar(next)
  }

  renderer.render(scene, camera)
}

function handleResize() {
  const container = containerRef.value
  if (!container || !renderer || !camera) return
  const width = container.clientWidth
  const height = container.clientHeight
  if (width === 0 || height === 0) return
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

/* ----------------------------------------------------------------
 * T046: Chọn hình dáng cốt bánh -> load model 3D tương ứng
 * ---------------------------------------------------------------- */
async function selectShape(shapeKey) {
  if (loading.value || currentShape.value === shapeKey) {
    currentShape.value = shapeKey
    return
  }
  recordHistory()
  currentShape.value = shapeKey
  await loadCakeShape(shapeKey)
}

/** Đổi số tầng bánh -> build lại hình (bánh nhiều tầng luôn dùng hình mẫu dựng sẵn) */
async function selectTier(tierKey) {
  if (loading.value || tierCount.value === tierKey) return
  recordHistory()
  tierCount.value = tierKey
  await loadCakeShape(currentShape.value)
}

async function loadCakeShape(shapeKey) {
  loading.value = true
  loadError.value = ''

  // Bánh từ 2 tầng trở lên: chưa có file model GLTF nhiều tầng -> luôn dùng hình mẫu dựng sẵn
  if (tierCount.value > 1) {
    loadError.value = `Bánh ${tierCount.value} tầng đang hiển thị hình mẫu dựng sẵn (chưa có file mô hình 3D nhiều tầng).`
    setCakeMesh(buildFallbackMesh(shapeKey, frostingColorHex.value, tierCount.value))
    loading.value = false
    return
  }

  const path = MODEL_PATHS[shapeKey]

  try {
    const gltf = await gltfLoader.loadAsync(path)
    setCakeMesh(gltf.scene)
  } catch (err) {
    // Xử lý lỗi: không có/không load được file 3D -> KHÔNG crash trang,
    // hiển thị hình mẫu dựng sẵn (procedural geometry) để vẫn xem trước được.
    console.warn(`[CakeBuilder3D] Không tải được model "${path}", dùng hình mẫu dựng sẵn.`, err)
    loadError.value = 'Chưa có file mô hình 3D cho hình dáng này, đang hiển thị hình mẫu dựng sẵn.'
    setCakeMesh(buildFallbackMesh(shapeKey, frostingColorHex.value, 1))
  } finally {
    loading.value = false
  }
}

function setCakeMesh(object3d) {
  // Dọn mesh cũ, giải phóng bộ nhớ geometry/material trước khi thêm mesh mới
  // (giữ lại messageMesh - T049 - và các marker phụ kiện đã gắn - T051/T052 -
  // vì chúng không gắn liền với hình dáng bánh cụ thể)
  for (const child of [...cakeGroup.children]) {
    if (child === messageMesh || child.userData?.isDecorMarker) continue
    cakeGroup.remove(child)
    child.traverse?.((node) => {
      node.geometry?.dispose?.()
      if (Array.isArray(node.material)) {
        node.material.forEach((m) => m.dispose?.())
      } else {
        node.material?.dispose?.()
      }
    })
  }

  object3d.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true
      node.receiveShadow = true
    }
  })

  cakeGroup.add(object3d)

  // T051 - ghi nhận lại danh sách mesh bề mặt bánh hiện tại để raycast thả/di chuyển phụ kiện
  cakeSurfaceMeshes = []
  const newTopTierMeshes = []
  object3d.traverse((node) => {
    if (node.isMesh) {
      cakeSurfaceMeshes.push(node)
      if (node.userData?.isTopTier) newTopTierMeshes.push(node)
    }
  })
  // Model GLTF/hình mẫu 1 tầng không đánh dấu isTopTier -> coi cả khối là "tầng trên cùng"
  topTierMeshes = newTopTierMeshes.length ? newTopTierMeshes : cakeSurfaceMeshes

  // Áp lại màu kem nền đang chọn cho hình dáng/model vừa load (T047)
  applyFrostingColor(frostingColorHex.value)

  // T049 - đặt lại vị trí/kích thước mặt chữ theo hình dáng bánh vừa đổi
  positionMessageMesh()

  // T052 - hình dáng bánh đổi -> chiếu lại phụ kiện đã gắn lên bề mặt mới,
  // phụ kiện nào rơi ra ngoài bánh mới (VD đổi từ vuông sang tròn) sẽ tự bị gỡ
  repositionMarkersAfterShapeChange()
}

/** Hình mẫu dựng sẵn khi chưa có / không load được model thật.
 *  tierCount > 1 -> xếp chồng nhiều tầng nhỏ dần (kiểu bánh cưới), tầng trên cùng được
 *  đánh dấu isTopTier để biết đặt lời chúc/raycast đúng mặt trên cùng. */
function buildFallbackMesh(shapeKey, initialColorHex, tierCount = 1) {
  const group = new THREE.Group()
  const tierTotal = Math.min(Math.max(tierCount, 1), 3)
  const tierHeight = tierTotal > 1 ? 0.42 : 0.55

  let cumulativeY = 0

  for (let i = 0; i < tierTotal; i++) {
    const scaleXZ = Math.max(0.42, 1 - i * 0.22) // mỗi tầng nhỏ dần khi xếp lên cao
    const { baseGeometry, frostingGeometry } = createTierGeometries(shapeKey, scaleXZ, tierHeight)

    const baseMaterial = new THREE.MeshStandardMaterial({ color: initialColorHex, roughness: 0.55 })
    const frostingMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 })
    // Đánh dấu để applyFrostingColor() tìm đúng mesh cần đổi màu, kể cả khi đổi hình dáng
    baseMaterial.userData.isFrosting = true
    frostingMaterial.userData.isFrostingTrim = true

    const isTopTier = i === tierTotal - 1

    const base = new THREE.Mesh(baseGeometry, baseMaterial)
    base.position.y = cumulativeY + tierHeight / 2
    base.castShadow = true
    base.receiveShadow = true
    base.userData.isTopTier = isTopTier
    group.add(base)

    const frosting = new THREE.Mesh(frostingGeometry, frostingMaterial)
    frosting.position.y = cumulativeY + tierHeight + 0.04
    frosting.castShadow = true
    frosting.userData.isTopTier = isTopTier
    group.add(frosting)

    cumulativeY += tierHeight
  }

  return group
}

/** Tạo geometry phần thân + phần kem viền cho 1 tầng bánh, theo hình dáng + tỉ lệ thu nhỏ scaleXZ */
function createTierGeometries(shapeKey, scaleXZ, height) {
  let baseGeometry
  let frostingGeometry

  if (shapeKey === 'square') {
    const size = 1.4 * scaleXZ
    baseGeometry = new THREE.BoxGeometry(size, height, size)
    frostingGeometry = new THREE.BoxGeometry(size + 0.02, 0.08, size + 0.02)
  } else if (shapeKey === 'heart') {
    const heartShape = createHeartShape()
    const extrudeSettings = { depth: height, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2, curveSegments: 24 }
    baseGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings)
    baseGeometry.center()
    baseGeometry.rotateX(-Math.PI / 2)
    baseGeometry.scale(1.3 * scaleXZ, 1, 1.3 * scaleXZ)

    frostingGeometry = new THREE.ExtrudeGeometry(heartShape, { ...extrudeSettings, depth: 0.06 })
    frostingGeometry.center()
    frostingGeometry.rotateX(-Math.PI / 2)
    frostingGeometry.scale(1.32 * scaleXZ, 1, 1.32 * scaleXZ)
  } else {
    // round (mặc định)
    const rTop = 0.75 * scaleXZ
    const rBottom = 0.78 * scaleXZ
    baseGeometry = new THREE.CylinderGeometry(rTop, rBottom, height, 48)
    frostingGeometry = new THREE.CylinderGeometry(rTop + 0.01, rTop + 0.01, 0.08, 48)
  }

  return { baseGeometry, frostingGeometry }
}

/** Đường cong hình trái tim (theo ví dụ chuẩn của Three.js), đơn vị ~1 */
function createHeartShape() {
  const shape = new THREE.Shape()
  const x = 0
  const y = 0
  shape.moveTo(x + 0.25, y + 0.25)
  shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y)
  shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35)
  shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95)
  shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35)
  shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y)
  shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25)
  return shape
}

/* ----------------------------------------------------------------
 * T047: ColorPicker màu kem nền -> đổi màu realtime khi kéo thanh chọn màu
 * ---------------------------------------------------------------- */
function applyFrostingColor(hexColor) {
  const baseColor = new THREE.Color(hexColor)
  const trimColor = baseColor.clone().lerp(new THREE.Color('#ffffff'), 0.4)

  cakeGroup.traverse((node) => {
    if (!node.isMesh || !node.material) return

    if (node.material.userData?.isFrosting) {
      node.material.color.copy(baseColor)
    } else if (node.material.userData?.isFrostingTrim) {
      node.material.color.copy(trimColor)
    } else if (/kem|frosting/i.test(node.name)) {
      // Quy ước cho model GLTF thật: đặt tên mesh/material chứa "kem" hoặc "frosting"
      // để ColorPicker này tự nhận diện và đổi màu được, không cần sửa code.
      node.material.color.copy(baseColor)
    }
  })
}

/* ----------------------------------------------------------------
 * T049 - Viết chữ lên bánh bằng CanvasTexture: nhập lời chúc vào ô text
 * -> chữ hiển thị lên mặt bánh 3D ngay lập tức (vẽ lại canvas + needsUpdate)
 * ---------------------------------------------------------------- */
function drawMessageCanvas(text) {
  const { width, height } = messageCanvas
  messageCtx.clearRect(0, 0, width, height)

  const trimmed = (text || '').trim()
  if (!trimmed) {
    messageTexture.needsUpdate = true
    return
  }

  messageCtx.textAlign = 'center'
  messageCtx.textBaseline = 'middle'
  messageCtx.fillStyle = messageColorHex.value

  // Tự co chữ nhỏ lại nếu lời chúc dài để vẫn vừa mặt bánh
  let fontSize = 64
  if (trimmed.length > 18) fontSize = 46
  if (trimmed.length > 28) fontSize = 36

  messageCtx.font = `italic 700 ${fontSize}px Georgia, 'Brush Script MT', cursive`

  // Word-wrap đơn giản theo bề rộng canvas
  const maxWidth = width * 0.82
  const words = trimmed.split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word
    if (messageCtx.measureText(testLine).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = testLine
    }
  }
  if (line) lines.push(line)

  const lineHeight = fontSize * 1.25
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2
  lines.forEach((l, i) => {
    messageCtx.fillText(l, width / 2, startY + i * lineHeight)
  })

  messageTexture.needsUpdate = true
}

/** Canh lại vị trí + kích thước mặt chữ lên đúng mặt TRÊN CÙNG của bánh hiện tại.
 *  Lưu ý: chỉ tính bounding box từ `topTierMeshes` (mesh thật của bánh), KHÔNG tính
 *  cả cakeGroup, vì nếu tính cả cakeGroup thì các topping/phụ kiện đã gắn (nằm cao hơn
 *  mặt kem 1 chút) sẽ làm bounding box bị đẩy lên cao -> chữ bị nổi lơ lửng phía trên topping. */
function positionMessageMesh() {
  if (!messageMesh || !topTierMeshes.length) return

  const box = new THREE.Box3()
  topTierMeshes.forEach((mesh) => box.expandByObject(mesh))
  if (box.isEmpty()) return

  const size = new THREE.Vector3()
  box.getSize(size)

  const topY = box.max.y - cakeGroup.position.y + 0.004 // nhích lên 1 chút tránh z-fighting
  const planeSize = Math.max(0.18, Math.min(size.x, size.z) * 0.82)

  messageMesh.position.set(0, topY, 0)
  if (messageMesh.geometry.parameters.width !== planeSize) {
    messageMesh.geometry.dispose()
    messageMesh.geometry = new THREE.PlaneGeometry(planeSize, planeSize)
  }
}

function applyCakeMessage(text) {
  drawMessageCanvas(text)
  if (messageMesh) messageMesh.visible = !!(text || '').trim()
  positionMessageMesh()
}


/* ----------------------------------------------------------------
 * T051 - Kéo phụ kiện từ sidebar thả lên bánh -> gắn đúng vị trí bề mặt bánh
 * ---------------------------------------------------------------- */
function setPointerFromEvent(evt, rect) {
  pointerNDC.x = ((evt.clientX - rect.left) / rect.width) * 2 - 1
  pointerNDC.y = -((evt.clientY - rect.top) / rect.height) * 2 + 1
}

function raycastCakeSurface(evt, rect) {
  if (!camera || !cakeSurfaceMeshes.length) return null
  setPointerFromEvent(evt, rect)
  raycaster.setFromCamera(pointerNDC, camera)
  const hits = raycaster.intersectObjects(cakeSurfaceMeshes, false)
  return hits.length ? hits[0] : null
}

function onCanvasDragOver(evt) {
  if (!decorState.draggingItem) return
  evt.dataTransfer.dropEffect = 'copy'
  isDragOverCanvas.value = true
}

function onCanvasDragLeave() {
  isDragOverCanvas.value = false
}

function onCanvasDrop(evt) {
  evt.preventDefault()
  isDragOverCanvas.value = false

  const item = decorState.draggingItem
  decorState.draggingItem = null
  if (!item || !containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const hit = raycastCakeSurface(evt, rect)
  if (!hit) return // thả ra ngoài bánh -> bỏ qua

  if (!addOne(item)) return // hết hàng / đã đạt giới hạn tồn kho
  recordHistory()
  addPlacedAccessory(item, hit.point)
}

/** Tạo mesh đại diện 1 phụ kiện đã gắn lên bánh (T051/T052).
 *  Chọn hình dáng theo TÊN phụ kiện (tenPhuKien) - khi nào có API thật, chỉ cần tên đúng
 *  quy ước (nến/hoa/topper/trái cây) là model tự khớp, không cần sửa code 3D.
 *  Ưu tiên dùng model .glb THẬT (ACCESSORY_MODEL_PATHS) nếu có, nếu load lỗi thì
 *  tự rơi về hình mẫu dựng sẵn (procedural) để không bao giờ làm trắng màn hình. */
async function buildMarkerMesh(item) {
  const group = new THREE.Group()
  const name = (item.tenPhuKien || '').toLowerCase()

  let visual

  if (/nến|candle/.test(name)) {
    visual = await loadRealAccessoryModel('candle', 0.13, buildCandleVisual)
  } else if (/macaron|hoa|flower/.test(name)) {
    // "Hoa kem hồng pastel" dùng tạm model macaron thật (gần nghĩa nhất trong 4 phụ kiện hiện có)
    visual = await loadRealAccessoryModel('macaron', 0.09, buildFlowerVisual)
  } else if (/oreo/.test(name)) {
    visual = await loadRealAccessoryModel('oreo', 0.1, buildGiftVisual.bind(null, item.id))
  } else if (/topper/.test(name)) {
    visual = buildTopperVisual()
  } else if (/trái cây|fruit|dâu|raspberry|mâm xôi/.test(name)) {
    visual = await loadRealAccessoryModel('fruit', 0.09, buildFruitVisual)
  } else {
    visual = buildGiftVisual(item.id) // mặc định: hộp quà chung cho phụ kiện chưa định nghĩa kiểu riêng
  }

  group.add(visual)

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.085, 0.007, 8, 32),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  )
  ring.rotation.x = Math.PI / 2
  ring.visible = false
  ring.userData.isSelectRing = true
  group.add(ring)

  return group
}

/** Load 1 model .glb thật theo `key` trong ACCESSORY_MODEL_PATHS.
 *  Thay vì đoán mò 1 con số scale cố định (rất dễ sai vì mỗi model trên Sketchfab có
 *  đơn vị/tỉ lệ gốc khác nhau), hàm này TỰ ĐO bounding box thật của model sau khi load,
 *  rồi tính scale sao cho chiều lớn nhất của model = đúng `desiredSize` (đơn vị world
 *  của scene, bánh có đường kính ~1.5). Đồng thời hạ model xuống cho đáy chạm y=0,
 *  để không bị lơ lửng trên mặt bánh.
 *  Nếu load lỗi (chưa có file / sai tên / lỗi mạng) -> tự fallback về hình mẫu dựng sẵn. */
async function loadRealAccessoryModel(key, desiredSize, fallbackBuilder) {
  try {
    const gltf = await loadAccessoryModel(key)
    const visual = gltf.scene.clone(true)
    visual.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })

    // Đo kích thước gốc của model -> tính hệ số scale để đạt đúng desiredSize
    const box = new THREE.Box3().setFromObject(visual)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const scale = desiredSize / maxDim
    visual.scale.setScalar(scale)

    // Sau khi scale, đo lại bounding box để hạ đáy model về đúng y=0 (đứng thẳng trên mặt bánh)
    const scaledBox = new THREE.Box3().setFromObject(visual)
    visual.position.y -= scaledBox.min.y

    return visual
  } catch (err) {
    console.warn(`[CakeBuilder3D] Không tải được model phụ kiện "${key}" (${ACCESSORY_MODEL_PATHS[key]}), dùng hình mẫu dựng sẵn.`, err)
    return fallbackBuilder()
  }
}

/** Nến sinh nhật: thân nến + ngọn lửa nhỏ phát sáng nhẹ */
/** Nến sinh nhật: thân nến có vân sọc + ngọn lửa 2 lớp + ánh sáng phát ra thật */
function buildCandleVisual() {
  const g = new THREE.Group()

  // Thân nến: dùng MeshPhysicalMaterial cho hơi trong như sáp thật
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0145, 0.016, 0.09, 16),
    new THREE.MeshPhysicalMaterial({
      color: 0xfff6e6,
      roughness: 0.25,
      clearcoat: 0.4,
      transmission: 0.15,
      thickness: 0.05,
    })
  )
  body.position.y = 0.045
  body.castShadow = true
  g.add(body)

  // Sọc xoắn trang trí (vài thanh mỏng màu khác nằm dọc thân)
  const stripeMaterial = new THREE.MeshStandardMaterial({ color: 0xe8748a, roughness: 0.4 })
  for (let i = 0; i < 3; i++) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.09, 0.004), stripeMaterial)
    const angle = (i / 3) * Math.PI * 2
    stripe.position.set(Math.cos(angle) * 0.014, 0.045, Math.sin(angle) * 0.014)
    g.add(stripe)
  }

  // Bấc nến
  const wick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0015, 0.0015, 0.012, 6),
    new THREE.MeshStandardMaterial({ color: 0x3a2a1a })
  )
  wick.position.y = 0.096
  g.add(wick)

  // Ngọn lửa: lớp ngoài cam mờ + lõi vàng sáng
  const flameOuter = new THREE.Mesh(
    new THREE.ConeGeometry(0.016, 0.038, 12),
    new THREE.MeshStandardMaterial({
      color: 0xff8a3d,
      emissive: 0xff6a1a,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.85,
    })
  )
  flameOuter.position.y = 0.118
  g.add(flameOuter)

  const flameInner = new THREE.Mesh(
    new THREE.ConeGeometry(0.008, 0.022, 10),
    new THREE.MeshStandardMaterial({ color: 0xfff1a8, emissive: 0xffd966, emissiveIntensity: 1.4 })
  )
  flameInner.position.y = 0.112
  g.add(flameInner)

  // Ánh sáng le lói thật từ ngọn nến
  const flameLight = new THREE.PointLight(0xffae42, 0.5, 0.25, 2)
  flameLight.position.y = 0.115
  g.add(flameLight)

  return g
}

/** Hoa kem: cánh hoa dạng giọt nước xếp 2 lớp + nhụy lấp lánh */
function buildFlowerVisual() {
  const g = new THREE.Group()
  const petalMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf3a6c4,
    roughness: 0.45,
    clearcoat: 0.3,
    sheen: 1,
    sheenColor: new THREE.Color(0xffffff),
  })

  // Lớp cánh ngoài (lớn hơn, thấp hơn)
  const outerCount = 6
  for (let i = 0; i < outerCount; i++) {
    const angle = (i / outerCount) * Math.PI * 2
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 12), petalMaterial)
    petal.scale.set(1, 0.4, 1.6)
    petal.position.set(Math.cos(angle) * 0.034, 0.014, Math.sin(angle) * 0.034)
    petal.rotation.y = angle
    petal.castShadow = true
    g.add(petal)
  }

  // Lớp cánh trong (nhỏ hơn, cao hơn, xoay lệch để tạo độ sâu)
  const innerCount = 5
  for (let i = 0; i < innerCount; i++) {
    const angle = (i / innerCount) * Math.PI * 2 + 0.3
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 10), petalMaterial)
    petal.scale.set(1, 0.5, 1.3)
    petal.position.set(Math.cos(angle) * 0.018, 0.024, Math.sin(angle) * 0.018)
    petal.rotation.y = angle
    petal.castShadow = true
    g.add(petal)
  }

  // Nhụy hoa
  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.016, 12, 12),
    new THREE.MeshPhysicalMaterial({ color: 0xffd45e, roughness: 0.3, clearcoat: 0.6 })
  )
  center.position.y = 0.03
  center.castShadow = true
  g.add(center)

  // Vài hạt nhụy li ti
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.003, 6, 6),
      new THREE.MeshStandardMaterial({ color: 0xb8860b })
    )
    dot.position.set(Math.cos(angle) * 0.012, 0.038, Math.sin(angle) * 0.012)
    g.add(dot)
  }

  return g
}

/** Topper chữ/hình: que cắm có độ dày thật + thẻ bo góc bằng ExtrudeGeometry */
function buildTopperVisual() {
  const g = new THREE.Group()

  const stick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0035, 0.004, 0.09, 10),
    new THREE.MeshStandardMaterial({ color: 0xcdb79e, roughness: 0.6 })
  )
  stick.position.y = 0.045
  stick.castShadow = true
  g.add(stick)

  // Thẻ bo góc, có độ dày (ExtrudeGeometry) thay vì plane phẳng
  const w = 0.11, h = 0.052, r = 0.008
  const shape = new THREE.Shape()
  shape.moveTo(-w / 2 + r, -h / 2)
  shape.lineTo(w / 2 - r, -h / 2)
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
  shape.lineTo(w / 2, h / 2 - r)
  shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
  shape.lineTo(-w / 2 + r, h / 2)
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
  shape.lineTo(-w / 2, -h / 2 + r)
  shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2)

  const cardGeometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.007,
    bevelEnabled: true,
    bevelThickness: 0.0015,
    bevelSize: 0.0015,
    bevelSegments: 2,
    curveSegments: 8,
  })
  cardGeometry.center()

  const card = new THREE.Mesh(
    cardGeometry,
    new THREE.MeshPhysicalMaterial({ color: 0xe8748a, roughness: 0.35, clearcoat: 0.5 })
  )
  card.position.y = 0.108
  card.castShadow = true
  card.receiveShadow = true
  g.add(card)

  return g
}

/** Trái cây tươi: hình dáng/màu khác nhau cho từng loại + chấm cuống lá */
function buildFruitVisual() {
  const g = new THREE.Group()

  const fruitDefs = [
    { color: 0xe25656, scale: [1, 1, 1], pos: [0, 0.02, 0] },        // dâu/anh đào
    { color: 0xf4b942, scale: [0.85, 0.85, 0.85], pos: [0.026, 0.016, 0.014] }, // cam nhỏ
    { color: 0x7cb464, scale: [0.9, 1.1, 0.9], pos: [-0.022, 0.018, -0.016] },  // nho/việt quất
  ]

  fruitDefs.forEach(({ color, scale, pos }) => {
    const fruit = new THREE.Mesh(
      new THREE.SphereGeometry(0.022, 14, 14),
      new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2 })
    )
    fruit.scale.set(...scale)
    fruit.position.set(...pos)
    fruit.castShadow = true
    g.add(fruit)

    // cuống lá nhỏ màu xanh trên đỉnh mỗi trái
    const leaf = new THREE.Mesh(
      new THREE.ConeGeometry(0.006, 0.012, 6),
      new THREE.MeshStandardMaterial({ color: 0x4a7c3a, roughness: 0.5 })
    )
    leaf.position.set(pos[0], pos[1] + 0.022 * scale[1], pos[2])
    g.add(leaf)
  })

  return g
}

/** Hộp quà chung: nơ thật (loop ribbon) thay vì 2 thanh box cắt nhau */
function buildGiftVisual(id) {
  const g = new THREE.Group()
  const color = colorFromAccessoryId(id)

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.04, 0.05),
    new THREE.MeshPhysicalMaterial({ color, roughness: 0.4, clearcoat: 0.3 })
  )
  box.position.y = 0.02
  box.castShadow = true
  g.add(box)

  const ribbonMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.2, clearcoat: 0.6 })
  const ribbon1 = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.044, 0.012), ribbonMaterial)
  ribbon1.position.y = 0.02
  ribbon1.castShadow = true
  g.add(ribbon1)

  const ribbon2 = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.044, 0.052), ribbonMaterial)
  ribbon2.position.y = 0.02
  ribbon2.castShadow = true
  g.add(ribbon2)

  // Nơ trên đỉnh: 2 vòng torus chéo nhau thay vì khối đặc
  const loopGeo = new THREE.TorusGeometry(0.012, 0.004, 8, 16)
  const loopL = new THREE.Mesh(loopGeo, ribbonMaterial)
  loopL.position.set(-0.01, 0.044, 0)
  loopL.rotation.set(Math.PI / 2, 0, 0.6)
  g.add(loopL)

  const loopR = new THREE.Mesh(loopGeo, ribbonMaterial)
  loopR.position.set(0.01, 0.044, 0)
  loopR.rotation.set(Math.PI / 2, 0, -0.6)
  g.add(loopR)

  return g
}
function colorFromAccessoryId(id) {
  const str = String(id)
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % 360
  return new THREE.Color(`hsl(${hash}, 70%, 55%)`)
}

async function addPlacedAccessory(item, worldPoint) {
  const uid = `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const local = cakeGroup.worldToLocal(worldPoint.clone())

  const marker = await buildMarkerMesh(item)
  marker.position.set(local.x, local.y + MARKER_OFFSET, local.z)
  marker.userData.isDecorMarker = true
  marker.userData.uid = uid
  marker.userData.phuKienId = item.id

  cakeGroup.add(marker)
  placedMeshes.set(uid, marker)
  placedAccessories.value.push({ uid, phuKienId: item.id, tenPhuKien: item.tenPhuKien })
  selectMarker(uid)
}

/* ----------------------------------------------------------------
 * T052 - Kéo phụ kiện đã gắn để di chuyển + xóa bằng nút/phím Delete
 * ---------------------------------------------------------------- */
function selectMarker(uid) {
  selectedMarkerUid.value = uid
  for (const marker of placedMeshes.values()) {
    const ring = marker.children.find((c) => c.userData.isSelectRing)
    if (ring) ring.visible = marker.userData.uid === uid
  }
}

function removeMarker(uid) {
  const marker = placedMeshes.get(uid)
  if (!marker) return

  cakeGroup.remove(marker)
  marker.traverse((node) => {
    node.geometry?.dispose?.()
    node.material?.dispose?.()
  })
  placedMeshes.delete(uid)

  const idx = placedAccessories.value.findIndex((p) => p.uid === uid)
  if (idx !== -1) {
    const removed = placedAccessories.value[idx]
    placedAccessories.value.splice(idx, 1)
    removeOne(removed.phuKienId) // giảm số lượng tương ứng ở DecorPanel/sidebar
  }

  if (selectedMarkerUid.value === uid) selectedMarkerUid.value = null
}

/** Wrapper cho thao tác xóa phụ kiện DO NGƯỜI DÙNG bấm (nút xóa / phím Delete) ->
 *  ghi lịch sử trước khi xóa. Các lệnh removeMarker() gọi nội bộ (đổi hình dáng bánh,
 *  khôi phục snapshot) KHÔNG đi qua wrapper này nên không ghi lịch sử trùng lặp. */
function removeMarkerByUser(uid) {
  if (!placedMeshes.has(uid)) return
  recordHistory()
  removeMarker(uid)
}

/** Sau khi đổi hình dáng bánh: chiếu lại phụ kiện đã gắn xuống bề mặt mới, gỡ phụ kiện rơi ra ngoài */
function repositionMarkersAfterShapeChange() {
  if (!placedMeshes.size || !cakeSurfaceMeshes.length) return

  const downRay = new THREE.Raycaster()
  for (const [uid, marker] of [...placedMeshes.entries()]) {
    const worldPos = marker.getWorldPosition(new THREE.Vector3())
    downRay.set(new THREE.Vector3(worldPos.x, 5, worldPos.z), new THREE.Vector3(0, -1, 0))
    const hits = downRay.intersectObjects(cakeSurfaceMeshes, false)

    if (hits.length) {
      const local = cakeGroup.worldToLocal(hits[0].point.clone())
      marker.position.set(local.x, local.y + MARKER_OFFSET, local.z)
    } else {
      removeMarker(uid) // không còn nằm trên mặt bánh mới -> tự động gỡ bỏ
    }
  }
}

function onPointerDown(evt) {
  if (evt.button !== 0 || !containerRef.value) return // chỉ xử lý chuột trái

  const rect = containerRef.value.getBoundingClientRect()
  setPointerFromEvent(evt, rect)
  raycaster.setFromCamera(pointerNDC, camera)

  const markerObjects = Array.from(placedMeshes.values())
  const hits = raycaster.intersectObjects(markerObjects, true)

  if (hits.length) {
    let obj = hits[0].object
    while (obj && !obj.userData?.uid) obj = obj.parent
    if (obj) {
      draggingMarkerUid = obj.userData.uid
      beginEdit() // T053 - chụp lại trạng thái trước khi kéo di chuyển, để Undo về đúng vị trí cũ
      selectMarker(draggingMarkerUid)
      controls.enabled = false // tạm tắt xoay khung nhìn trong lúc kéo phụ kiện
    }
    return
  }

  // Bấm không trúng phụ kiện nào -> bỏ chọn (vẫn cho OrbitControls hoạt động bình thường)
  if (selectedMarkerUid.value) selectMarker(null)
}

function onPointerMove(evt) {
  if (!draggingMarkerUid || !containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const hit = raycastCakeSurface(evt, rect)
  if (!hit) return

  const marker = placedMeshes.get(draggingMarkerUid)
  if (!marker) return

  const local = cakeGroup.worldToLocal(hit.point.clone())
  marker.position.set(local.x, local.y + MARKER_OFFSET, local.z)
}

function onPointerUp() {
  if (draggingMarkerUid) {
    draggingMarkerUid = null
    controls.enabled = true
    commitEdit() // T053 - kéo xong -> chốt lại vị trí mới vào lịch sử Undo
  }
}

function onKeyDown(evt) {
  const tag = evt.target?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') return

  // T053 - Phím tắt Undo/Redo: Ctrl/Cmd+Z để hoàn tác, Ctrl/Cmd+Y (hoặc Ctrl+Shift+Z) để làm lại
  if ((evt.ctrlKey || evt.metaKey) && evt.key.toLowerCase() === 'z' && !evt.shiftKey) {
    evt.preventDefault()
    undo()
    return
  }
  if ((evt.ctrlKey || evt.metaKey) && (evt.key.toLowerCase() === 'y' || (evt.shiftKey && evt.key.toLowerCase() === 'z'))) {
    evt.preventDefault()
    redo()
    return
  }

  if (evt.key !== 'Delete' && evt.key !== 'Backspace') return
  if (!selectedMarkerUid.value) return

  evt.preventDefault()
  removeMarkerByUser(selectedMarkerUid.value)
}

/* ----------------------------------------------------------------
 * T048: Chọn size -> phóng to/thu nhỏ theo tỉ lệ + tính giá realtime
 * ---------------------------------------------------------------- */
function selectSize(sizeKey) {
  if (currentSize.value === sizeKey) return
  recordHistory()
  currentSize.value = sizeKey
  const found = sizes.find((s) => s.key === sizeKey)
  targetScale = found ? found.scale : 1
}

const basePrice = computed(() => sizes.find((s) => s.key === currentSize.value)?.price ?? 0)
const tierExtraPrice = computed(() => tiers.find((t) => t.key === tierCount.value)?.extraPrice ?? 0)
const totalPrice = computed(() => basePrice.value + tierExtraPrice.value + (props.accessoriesTotal || 0))



watch(totalPrice, (value) => emit('price-change', value), { immediate: true })
watch([currentShape, currentSize, tierCount, frostingColorHex, cakeMessage, messageColorHex], () => {
  emit('design-change', {
    shape: currentShape.value,
    size: currentSize.value,
    tierCount: tierCount.value,
    frostingColor: frostingColorHex.value,
    message: cakeMessage.value,
    messageColor: messageColorHex.value,
  })
})
watch(cakeMessage, (text) => applyCakeMessage(text))
watch(messageColorHex, () => applyCakeMessage(cakeMessage.value))

onMounted(async () => {
  initScene()
  await loadCakeShape(currentShape.value)
  resolveBuilderReady() // báo cho loadTemplate() (nếu Design.vue gọi ngay sau khi mount) biết đã dựng xong bánh mặc định
})

// Cho phép component cha (Design.vue) gọi builderRef.value.loadTemplate(mau) khi khách bấm "Chọn mẫu này"
defineExpose({ loadTemplate })

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  resizeObserver?.disconnect()
  controls?.dispose()
  renderer?.domElement?.removeEventListener('pointerdown', onPointerDown)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('keydown', onKeyDown)
  messageMesh?.geometry?.dispose()
  messageMesh?.material?.dispose()
  messageTexture?.dispose()
  renderer?.dispose()
  if (renderer?.domElement?.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement)
  }
})
</script>

<style scoped>
.shape-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.shape-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-card);
  color: var(--color-text);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.shape-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
  color: var(--color-primary);
}

.shape-btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.shape-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.history-group {
  display: flex;
  gap: 4px;
  margin-left: 4px;
  padding-left: 10px;
  border-left: 1px solid var(--color-border);
}

.history-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-card);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.15s ease;
}

.history-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
  color: var(--color-primary);
}

.history-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.cake3d-canvas {
  position: relative;
  width: 100%;
  height: 420px;
  border-radius: 16px;
  background: radial-gradient(circle at 50% 30%, var(--cream-white-soft) 0%, var(--cream-white-deep) 100%);
  overflow: hidden;
}

.cake3d-canvas :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

.cake3d-overlay {
  position: absolute;
  top: 14px;
  left: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--color-text-muted);
  font-size: 12.5px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.cake3d-overlay--warn {
  color: var(--color-warning);
}

.cake3d-overlay--hint {
  top: auto;
  bottom: 14px;
  left: 14px;
  right: 14px;
  justify-content: center;
  text-align: center;
  font-size: 11.5px;
}

.cake3d-canvas--drop-active {
  outline: 2px dashed var(--color-primary);
  outline-offset: -4px;
}

.cake3d-selected-toolbar {
  position: absolute;
  top: 14px;
  right: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px 6px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.95);
  color: var(--color-text);
  font-size: 12.5px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.cake3d-delete-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 999px;
  border: none;
  background: var(--color-danger, #e35454);
  color: #fff;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
}

.cake3d-delete-btn:hover {
  filter: brightness(0.95);
}

.cake3d-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== T047 + T048 ===== */
.cake3d-options {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  align-items: start;
}

.cake3d-option-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cake3d-option-label {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.message-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.message-text-input {
  width: 100%;
  max-width: 420px;
  padding: 9px 12px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-card);
  color: var(--color-text);
  font-size: 13.5px;
}

.message-text-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.message-hint {
  font-size: 11.5px;
  color: var(--color-text-muted);
}

.color-picker-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-swatch-input {
  width: 44px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: none;
  cursor: pointer;
}

.color-swatch-input::-webkit-color-swatch-wrapper {
  padding: 3px;
}
.color-swatch-input::-webkit-color-swatch {
  border-radius: 7px;
  border: none;
}

.color-hex {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 0.02em;
}

.size-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.size-btn {
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-card);
  color: var(--color-text);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.size-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-primary);
}

.size-btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.cake3d-price {
  grid-column: 1 / -1;
  border-top: 1px dashed var(--color-border);
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cake3d-price-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--color-text-muted);
}

.cake3d-price-row--total {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary);
}
</style>