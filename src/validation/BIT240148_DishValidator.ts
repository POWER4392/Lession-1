import { BIT240148_Dish } from '../models/BIT240148_Dish';
import { BIT240148_Strings, Language } from '../localization/BIT240148_Strings';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const BIT240148_DishValidator = {
  validateDish: (
    dishId: number,
    name: string,
    priceStr: string,
    prepTimeStr: string,
    categoryId: number | null | undefined,
    existingDishesInSameCategory: BIT240148_Dish[],
    lang: Language
  ): ValidationResult => {
    // 1. Tên món không rỗng
    if (!name || !name.trim()) {
      return { isValid: false, errorMessage: BIT240148_Strings.errNameEmpty(lang) };
    }

    // 2. Giá > 0
    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) {
      return { isValid: false, errorMessage: BIT240148_Strings.errPriceInvalid(lang) };
    }

    // 3. Thời gian chế biến > 0
    const prepTime = parseInt(prepTimeStr, 10);
    if (isNaN(prepTime) || prepTime <= 0) {
      return { isValid: false, errorMessage: BIT240148_Strings.errPrepTimeInvalid(lang) };
    }

    // 4. Loại món hợp lệ
    if (!categoryId || categoryId <= 0) {
      return { isValid: false, errorMessage: BIT240148_Strings.errCategoryRequired(lang) };
    }

    // 5. Tên món không trùng trong cùng một loại
    const isDuplicate = existingDishesInSameCategory.some(
      existing =>
        existing.BIT240148_Id !== dishId &&
        existing.BIT240148_Name.trim().toLowerCase() === name.trim().toLowerCase()
    );

    if (isDuplicate) {
      return { isValid: false, errorMessage: BIT240148_Strings.errNameDuplicate(lang) };
    }

    return { isValid: true };
  },

  validatePriceRange: (minStr: string, maxStr: string, lang: Language): ValidationResult => {
    const min = parseFloat(minStr);
    const max = parseFloat(maxStr);

    if (!isNaN(min) && !isNaN(max) && min > max) {
      return { isValid: false, errorMessage: BIT240148_Strings.errPriceRangeInvalid(lang) };
    }
    return { isValid: true };
  }
};
