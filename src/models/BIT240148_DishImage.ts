/**
 * Model DishImage - Danh sách ảnh của món ăn.
 * Bảng lưu trữ: BIT240148_DishImage
 * Tiền tố các trường dữ liệu: BIT240148_
 * Ràng buộc: Mỗi món có tối đa 01 ảnh IsThumbnail = true.
 */
export interface BIT240148_DishImage {
  BIT240148_Id: number;
  BIT240148_DishId: number;
  BIT240148_ImageUrl: string;
  BIT240148_IsThumbnail: boolean;
}

export const DISH_IMAGE_STORAGE_KEY = 'BIT240148_DishImage';
