import { computed, reactive } from 'vue'
import { accessoryService } from '@/services/AccessoryService'

/**
 * T050/T051/T052 - State dùng chung giữa DecorPanel (sidebar) và CakeBuilder3D (canvas 3D),
 * để khi khách kéo-thả phụ kiện lên bánh thì số lượng + tổng tiền ở sidebar cũng tự cập nhật,
 * và khi xóa phụ kiện khỏi bánh thì số lượng ở sidebar giảm tương ứng.
 */

// Dữ liệu tĩnh dự phòng khi chưa gọi được API phụ kiện
const FALLBACK_ACCESSORIES = [
  { id: 'fallback-1', tenPhuKien: 'Nến số sinh nhật', donGia: 15000, soLuongTon: 50, anhPhuKien: '' },
  { id: 'fallback-2', tenPhuKien: 'Hoa kem hồng pastel', donGia: 25000, soLuongTon: 30, anhPhuKien: '' },
  { id: 'fallback-3', tenPhuKien: 'Topper "Happy Birthday"', donGia: 20000, soLuongTon: 40, anhPhuKien: '' },
  { id: 'fallback-4', tenPhuKien: 'Trái cây tươi trang trí', donGia: 35000, soLuongTon: 25, anhPhuKien: '' },
  { id: 'fallback-5', tenPhuKien: 'Bánh quy Oreo', donGia: 18000, soLuongTon: 35, anhPhuKien: '' },
]

const state = reactive({
  accessories: [],
  quantities: {}, // id -> số lượng đã chọn/gắn lên bánh
  loading: true,
  usingFallback: false,
  loaded: false,
  // T051 - phụ kiện đang được kéo từ sidebar (null khi không kéo)
  draggingItem: null,
})

async function ensureLoaded() {
  if (state.loaded) return
  state.loaded = true
  state.loading = true
  try {
    const res = await accessoryService.getAvailableAccessories()
    const data = Array.isArray(res.data) ? res.data : []
    if (data.length) {
      state.accessories = data
      state.usingFallback = false
    } else {
      state.accessories = FALLBACK_ACCESSORIES
      state.usingFallback = true
    }
  } catch (err) {
    // Không có API / lỗi mạng -> dùng dữ liệu tĩnh, không chặn người dùng thao tác
    console.warn('[DecorAccessories] Không gọi được API phụ kiện, dùng dữ liệu tĩnh.', err)
    state.accessories = FALLBACK_ACCESSORIES
    state.usingFallback = true
  } finally {
    state.accessories.forEach((item) => {
      if (!(item.id in state.quantities)) state.quantities[item.id] = 0
    })
    state.loading = false
  }
}

function canAdd(item) {
  if (!item) return false
  const current = state.quantities[item.id] || 0
  const max = item.soLuongTon ?? Infinity
  return current < max
}

/** Tăng số lượng 1 phụ kiện (gọi khi thả lên bánh hoặc bấm nút +). Trả về false nếu hết hàng. */
function addOne(item) {
  if (!canAdd(item)) return false
  state.quantities[item.id] = (state.quantities[item.id] || 0) + 1
  return true
}

/** Giảm số lượng 1 phụ kiện (gọi khi xóa khỏi bánh hoặc bấm nút -). */
function removeOne(itemId) {
  const current = state.quantities[itemId] || 0
  if (current > 0) state.quantities[itemId] = current - 1
}

const selectedItems = computed(() =>
  state.accessories
    .filter((item) => (state.quantities[item.id] || 0) > 0)
    .map((item) => ({
      phu_kien_id: item.id,
      so_luong: state.quantities[item.id],
      ten_phu_kien: item.tenPhuKien,
      don_gia: item.donGia,
    }))
)

const total = computed(() =>
  selectedItems.value.reduce((sum, it) => sum + (it.don_gia || 0) * it.so_luong, 0)
)

export function useDecorAccessories() {
  return { state, ensureLoaded, canAdd, addOne, removeOne, selectedItems, total }
}