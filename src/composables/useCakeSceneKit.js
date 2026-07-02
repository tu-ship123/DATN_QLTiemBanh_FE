/**
 * useCakeSceneKit.js
 * ------------------------------------------------------------------
 * Bộ dựng hình 3D DÙNG CHUNG cho cả 2 nơi:
 *   1. CakeBuilder3D.vue   - khách tự thiết kế bánh (có kéo-thả, chỉnh sửa)
 *   2. CakeDesignViewer3D.vue - nhân viên bếp xem lại (chỉ xem, không sửa)
 *
 * Trước đây mỗi bên tự viết 1 bộ hình dáng bánh + hình phụ kiện riêng (đoán theo từ khoá
 * tên phụ kiện) -> 2 bên luôn ra hình khác nhau dù cùng 1 đơn hàng. Giờ dùng chung file này
 * để đảm bảo nhân viên bếp nhìn thấy ĐÚNG những gì khách đã xếp, không phải bản đoán lại.
 * ------------------------------------------------------------------ */
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/** Mỗi hình dáng cốt bánh tương ứng 1 file model 3D thật (đặt trong public/models/).
 *  Chưa có file -> tự fallback sang hình mẫu dựng sẵn (buildFallbackCakeGroup). */
export const MODEL_PATHS = {
  round: '/models/cake-round.glb',
  square: '/models/cake-square.glb',
  heart: '/models/cake-heart.glb',
}

/** Model 3D thật cho phụ kiện trang trí - dùng khi phụ kiện KHÔNG có `model3dUrl` riêng
 *  trong DB (cột model_3d_url của bảng phu_kien_trang_tri), lúc đó đoán theo từ khoá tên. */
export const ACCESSORY_MODEL_PATHS = {
  candle: '/models/birthday_candle.glb',
  fruit: '/models/free_raspberry.glb',
  macaron: '/models/sweet_strawberry_macaron.glb',
  oreo: '/models/oreo.glb',
}

/** Bảng size bánh (khớp 100% với `sizes` trong CakeBuilder3D.vue) - dùng CHUNG để
 *  CakeDesignViewer3D.vue (bên bếp) hiện đúng số cm khách đã chọn, không lệch dữ liệu.
 *  key 's'/'m'/'l' là giá trị thô lưu trong snapshot thiết kế (captureSnapshot() -> size). */
export const SIZE_CM = { s: 16, m: 20, l: 25 }
export const SIZE_LABELS = { s: 'S - 16cm', m: 'M - 20cm', l: 'L - 25cm' }

const gltfLoader = new GLTFLoader()
const accessoryModelCache = {} // url -> Promise<GLTF>

function loadAccessoryModelByUrl(url) {
  if (!accessoryModelCache[url]) {
    accessoryModelCache[url] = gltfLoader.loadAsync(url)
  }
  return accessoryModelCache[url]
}

/* ----------------------------------------------------------------
 * HÌNH DÁNG CỐT BÁNH
 * ---------------------------------------------------------------- */

/** Đường cong hình trái tim chuẩn (theo ví dụ chính thức của Three.js), đơn vị ~1 */
export function createHeartShape() {
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

/** Tạo geometry phần thân + phần kem viền cho 1 tầng bánh, theo hình dáng + tỉ lệ thu nhỏ scaleXZ */
export function createTierGeometries(shapeKey, scaleXZ, height) {
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

/** Hình mẫu dựng sẵn khi chưa có / không load được model thật.
 *  tierCount > 1 -> xếp chồng nhiều tầng nhỏ dần (kiểu bánh cưới), tầng trên cùng được
 *  đánh dấu isTopTier để biết đặt lời chúc/raycast đúng mặt trên cùng. */
export function buildFallbackCakeGroup(shapeKey, colorHex, tierCount = 1) {
  const group = new THREE.Group()
  const tierTotal = Math.min(Math.max(tierCount, 1), 3)
  const tierHeight = tierTotal > 1 ? 0.42 : 0.55

  let cumulativeY = 0

  for (let i = 0; i < tierTotal; i++) {
    const scaleXZ = Math.max(0.42, 1 - i * 0.22) // mỗi tầng nhỏ dần khi xếp lên cao
    const { baseGeometry, frostingGeometry } = createTierGeometries(shapeKey, scaleXZ, tierHeight)

    const baseMaterial = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.55 })
    const frostingMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 })
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

/** Load đúng model 3D thật của hình dáng bánh (MODEL_PATHS), nếu lỗi/thiếu file thì tự
 *  fallback sang buildFallbackCakeGroup(). Dùng chung cho cả builder lẫn viewer. */
export async function loadCakeShapeObject3D(shapeKey, colorHex, tierCount = 1) {
  if (tierCount > 1) {
    return {
      object3d: buildFallbackCakeGroup(shapeKey, colorHex, tierCount),
      usedFallback: true,
      message: `Bánh ${tierCount} tầng đang hiển thị hình mẫu dựng sẵn (chưa có file mô hình 3D nhiều tầng).`,
    }
  }

  const path = MODEL_PATHS[shapeKey]
  try {
    const gltf = await gltfLoader.loadAsync(path)
    return { object3d: gltf.scene.clone(true), usedFallback: false, message: '' }
  } catch (err) {
    console.warn(`[useCakeSceneKit] Không tải được model "${path}", dùng hình mẫu dựng sẵn.`, err)
    return {
      object3d: buildFallbackCakeGroup(shapeKey, colorHex, 1),
      usedFallback: true,
      message: 'Chưa có file mô hình 3D cho hình dáng này, đang hiển thị hình mẫu dựng sẵn.',
    }
  }
}

/* ----------------------------------------------------------------
 * PHỤ KIỆN TRANG TRÍ
 * ---------------------------------------------------------------- */

/** Load 1 model .glb thật theo `url`, tự đo bounding box để scale đúng `desiredSize` và
 *  hạ đáy chạm y=0. Lỗi/thiếu file -> fallback sang hình mẫu dựng sẵn (fallbackBuilder). */
async function loadRealAccessoryModel(url, desiredSize, fallbackBuilder) {
  try {
    const gltf = await loadAccessoryModelByUrl(url)
    const visual = gltf.scene.clone(true)
    visual.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })

    const box = new THREE.Box3().setFromObject(visual)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const scale = desiredSize / maxDim
    visual.scale.setScalar(scale)

    const scaledBox = new THREE.Box3().setFromObject(visual)
    visual.position.y -= scaledBox.min.y

    return visual
  } catch (err) {
    console.warn(`[useCakeSceneKit] Không tải được model phụ kiện tại "${url}", dùng hình mẫu dựng sẵn.`, err)
    return fallbackBuilder()
  }
}

function colorFromAccessoryId(id) {
  const str = String(id)
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % 360
  return new THREE.Color(`hsl(${hash}, 70%, 55%)`)
}

/** Nến sinh nhật: thân nến có vân sọc + ngọn lửa 2 lớp + ánh sáng phát ra thật */
function buildCandleVisual() {
  const g = new THREE.Group()

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0145, 0.016, 0.09, 16),
    new THREE.MeshPhysicalMaterial({ color: 0xfff6e6, roughness: 0.25, clearcoat: 0.4, transmission: 0.15, thickness: 0.05 })
  )
  body.position.y = 0.045
  body.castShadow = true
  g.add(body)

  const stripeMaterial = new THREE.MeshStandardMaterial({ color: 0xe8748a, roughness: 0.4 })
  for (let i = 0; i < 3; i++) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.09, 0.004), stripeMaterial)
    const angle = (i / 3) * Math.PI * 2
    stripe.position.set(Math.cos(angle) * 0.014, 0.045, Math.sin(angle) * 0.014)
    g.add(stripe)
  }

  const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.0015, 0.0015, 0.012, 6), new THREE.MeshStandardMaterial({ color: 0x3a2a1a }))
  wick.position.y = 0.096
  g.add(wick)

  const flameOuter = new THREE.Mesh(
    new THREE.ConeGeometry(0.016, 0.038, 12),
    new THREE.MeshStandardMaterial({ color: 0xff8a3d, emissive: 0xff6a1a, emissiveIntensity: 0.9, transparent: true, opacity: 0.85 })
  )
  flameOuter.position.y = 0.118
  g.add(flameOuter)

  const flameInner = new THREE.Mesh(
    new THREE.ConeGeometry(0.008, 0.022, 10),
    new THREE.MeshStandardMaterial({ color: 0xfff1a8, emissive: 0xffd966, emissiveIntensity: 1.4 })
  )
  flameInner.position.y = 0.112
  g.add(flameInner)

  const flameLight = new THREE.PointLight(0xffae42, 0.5, 0.25, 2)
  flameLight.position.y = 0.115
  g.add(flameLight)

  return g
}

/** Hoa kem: cánh hoa dạng giọt nước xếp 2 lớp + nhụy lấp lánh */
function buildFlowerVisual() {
  const g = new THREE.Group()
  const petalMaterial = new THREE.MeshPhysicalMaterial({ color: 0xf3a6c4, roughness: 0.45, clearcoat: 0.3, sheen: 1, sheenColor: new THREE.Color(0xffffff) })

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

  const center = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 12), new THREE.MeshPhysicalMaterial({ color: 0xffd45e, roughness: 0.3, clearcoat: 0.6 }))
  center.position.y = 0.03
  center.castShadow = true
  g.add(center)

  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.003, 6, 6), new THREE.MeshStandardMaterial({ color: 0xb8860b }))
    dot.position.set(Math.cos(angle) * 0.012, 0.038, Math.sin(angle) * 0.012)
    g.add(dot)
  }

  return g
}

/** Topper chữ/hình: que cắm có độ dày thật + thẻ bo góc bằng ExtrudeGeometry */
function buildTopperVisual() {
  const g = new THREE.Group()

  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.004, 0.09, 10), new THREE.MeshStandardMaterial({ color: 0xcdb79e, roughness: 0.6 }))
  stick.position.y = 0.045
  stick.castShadow = true
  g.add(stick)

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

  const cardGeometry = new THREE.ExtrudeGeometry(shape, { depth: 0.007, bevelEnabled: true, bevelThickness: 0.0015, bevelSize: 0.0015, bevelSegments: 2, curveSegments: 8 })
  cardGeometry.center()

  const card = new THREE.Mesh(cardGeometry, new THREE.MeshPhysicalMaterial({ color: 0xe8748a, roughness: 0.35, clearcoat: 0.5 }))
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
    { color: 0xe25656, scale: [1, 1, 1], pos: [0, 0.02, 0] },
    { color: 0xf4b942, scale: [0.85, 0.85, 0.85], pos: [0.026, 0.016, 0.014] },
    { color: 0x7cb464, scale: [0.9, 1.1, 0.9], pos: [-0.022, 0.018, -0.016] },
  ]

  fruitDefs.forEach(({ color, scale, pos }) => {
    const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.022, 14, 14), new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2 }))
    fruit.scale.set(...scale)
    fruit.position.set(...pos)
    fruit.castShadow = true
    g.add(fruit)

    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.006, 0.012, 6), new THREE.MeshStandardMaterial({ color: 0x4a7c3a, roughness: 0.5 }))
    leaf.position.set(pos[0], pos[1] + 0.022 * scale[1], pos[2])
    g.add(leaf)
  })

  return g
}

/** Hộp quà chung: dùng khi phụ kiện chưa định nghĩa kiểu riêng (nơ thật, không phải box cắt nhau) */
function buildGiftVisual(id) {
  const g = new THREE.Group()
  const color = colorFromAccessoryId(id)

  const box = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.05), new THREE.MeshPhysicalMaterial({ color, roughness: 0.4, clearcoat: 0.3 }))
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

/** Tạo mesh đại diện 1 phụ kiện đã gắn lên bánh - DÙNG CHUNG cho builder (khách) và viewer (bếp),
 *  nên bếp luôn thấy ĐÚNG hình phụ kiện mà khách đã thấy, không phải bản đoán lại riêng.
 *  `item` cần tối thiểu { id, tenPhuKien }, có thêm `model3dUrl` nếu phụ kiện đã gắn model thật ở Admin. */
export async function buildAccessoryMesh(item) {
  const group = new THREE.Group()
  const name = (item.tenPhuKien || '').toLowerCase()

  let visual

  if (item.model3dUrl) {
    visual = await loadRealAccessoryModel(item.model3dUrl, 0.1, () => buildGiftVisual(item.id))
  } else if (/nến|candle/.test(name)) {
    visual = await loadRealAccessoryModel(ACCESSORY_MODEL_PATHS.candle, 0.13, buildCandleVisual)
  } else if (/macaron|hoa|flower/.test(name)) {
    visual = await loadRealAccessoryModel(ACCESSORY_MODEL_PATHS.macaron, 0.09, buildFlowerVisual)
  } else if (/oreo/.test(name)) {
    visual = await loadRealAccessoryModel(ACCESSORY_MODEL_PATHS.oreo, 0.1, buildGiftVisual.bind(null, item.id))
  } else if (/topper/.test(name)) {
    visual = buildTopperVisual()
  } else if (/trái cây|fruit|dâu|raspberry|mâm xôi/.test(name)) {
    visual = await loadRealAccessoryModel(ACCESSORY_MODEL_PATHS.fruit, 0.09, buildFruitVisual)
  } else {
    visual = buildGiftVisual(item.id)
  }

  group.add(visual)

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.007, 8, 32), new THREE.MeshBasicMaterial({ color: 0xffffff }))
  ring.rotation.x = Math.PI / 2
  ring.visible = false
  ring.userData.isSelectRing = true
  group.add(ring)

  return group
}