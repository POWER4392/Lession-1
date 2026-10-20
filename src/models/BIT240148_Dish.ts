/**
 * Model Dish - Thể hiện món ăn theo đề bài.
 * Bảng lưu trữ: BIT240148_Dish
 * Tiền tố các trường dữ liệu: BIT240148_
 */
export interface BIT240148_Dish {
  BIT240148_Id: number;
  BIT240148_Name: string;
  BIT240148_Price: number;
  BIT240148_PreparationTime: number; // Tính bằng phút
  BIT240148_IsAvailable: boolean;
  BIT240148_Description: string;
  BIT240148_DishCategoryId: number;
  BIT240148_SyncStatus: number; // 0: Đã đồng bộ, 1: Chờ tạo/sửa trên MockAPI, 2: Chờ xóa
  BIT240148_UpdatedAt: number;
}

export const DISH_STORAGE_KEY = 'BIT240148_Dish';

export const SYNC_STATUS_SYNCED = 0;
export const SYNC_STATUS_PENDING = 1;
export const SYNC_STATUS_PENDING_DELETE = 2;

/**
 * Yêu cầu 4.3: Hiển thị "Quick / Nhanh" khi PreparationTime <= 15 phút,
 * ngược lại là "Regular / Thông thường"
 */
export const isDishQuick = (prepTime: number): boolean => {
  return prepTime <= 15;
};
