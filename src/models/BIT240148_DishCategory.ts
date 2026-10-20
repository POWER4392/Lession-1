/**
 * Model DishCategory - Thể hiện loại món ăn theo đề bài.
 * Bảng lưu trữ: BIT240148_DishCategory
 * Tiền tố các trường dữ liệu: BIT240148_
 */
export interface BIT240148_DishCategory {
  BIT240148_Id: number;
  BIT240148_Name: string;
  BIT240148_Description: string;
}

export const CATEGORY_STORAGE_KEY = 'BIT240148_DishCategory';
