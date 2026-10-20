import { BIT240148_Dish } from './BIT240148_Dish';
import { BIT240148_DishCategory } from './BIT240148_DishCategory';
import { BIT240148_DishImage } from './BIT240148_DishImage';

/**
 * Model kết hợp thông tin Món ăn + Loại món + Danh sách ảnh
 */
export interface BIT240148_DishWithDetails {
  dish: BIT240148_Dish;
  category?: BIT240148_DishCategory;
  images: BIT240148_DishImage[];
  thumbnailUrl: string;
}
