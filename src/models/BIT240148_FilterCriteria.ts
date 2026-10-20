export type BIT240148_SortOption = 'NONE' | 'PRICE_ASC' | 'PRICE_DESC' | 'PREP_TIME_ASC';

/**
 * Tiêu chí tìm kiếm, lọc đa điều kiện và sắp xếp món ăn
 */
export interface BIT240148_FilterCriteria {
  searchQuery: string;
  categoryId?: number | null;
  onlyAvailable?: boolean | null; // true: chỉ đang bán, false: chỉ ngừng bán, null: tất cả
  minPrice?: number | null;
  maxPrice?: number | null;
  sortOption: BIT240148_SortOption;
}

export const defaultFilterCriteria: BIT240148_FilterCriteria = {
  searchQuery: '',
  categoryId: null,
  onlyAvailable: null,
  minPrice: null,
  maxPrice: null,
  sortOption: 'NONE'
};
