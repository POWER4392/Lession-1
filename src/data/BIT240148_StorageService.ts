import AsyncStorage from '@react-native-async-storage/async-storage';
import { BIT240148_DishCategory, CATEGORY_STORAGE_KEY } from '../models/BIT240148_DishCategory';
import {
  BIT240148_Dish,
  DISH_STORAGE_KEY,
  SYNC_STATUS_SYNCED,
  SYNC_STATUS_PENDING,
  SYNC_STATUS_PENDING_DELETE
} from '../models/BIT240148_Dish';
import { BIT240148_DishImage, DISH_IMAGE_STORAGE_KEY } from '../models/BIT240148_DishImage';
import { BIT240148_DishWithDetails } from '../models/BIT240148_DishWithDetails';

/**
 * Service lưu trữ dữ liệu local qua AsyncStorage.
 * Tổ chức dữ liệu logic quan hệ theo đúng lưu ý đề thi:
 * "AsyncStorage là lưu trữ key-value, sinh viên cần tự tổ chức dữ liệu để bảo đảm quan hệ logic giữa các đối tượng"
 * Tất cả Key và Thuộc tính đều có tiền tố MSSV: BIT240148_
 */
class BIT240148_StorageService {
  private isInitialized = false;

  async initStorage(): Promise<void> {
    if (this.isInitialized) return;
    const existingCats = await AsyncStorage.getItem(CATEGORY_STORAGE_KEY);
    if (!existingCats) {
      await this.seedInitialData();
    }
    this.isInitialized = true;
  }

  /**
   * Nạp sẵn tối thiểu 03 loại món ăn và 06 món ăn mẫu (5 đang bán + 1 ngừng bán)
   */
  private async seedInitialData(): Promise<void> {
    const initialCategories: BIT240148_DishCategory[] = [
      {
        BIT240148_Id: 1,
        BIT240148_Name: 'Món Khai Vị (Appetizers)',
        BIT240148_Description: 'Các món ăn nhẹ nhàng kích thích vị giác'
      },
      {
        BIT240148_Id: 2,
        BIT240148_Name: 'Món Chính (Main Courses)',
        BIT240148_Description: 'Các món ăn truyền thống đậm đà, giàu dinh dưỡng'
      },
      {
        BIT240148_Id: 3,
        BIT240148_Name: 'Tráng Miệng & Đồ Uống (Desserts)',
        BIT240148_Description: 'Chè ngọt thanh và thức uống giải nhiệt'
      }
    ];

    const now = Date.now();
    const initialDishes: BIT240148_Dish[] = [
      {
        BIT240148_Id: 1,
        BIT240148_Name: 'Phở Bò Tái Nạm Đặc Biệt',
        BIT240148_Price: 55000,
        BIT240148_PreparationTime: 12, // Quick (<= 15m)
        BIT240148_IsAvailable: true,
        BIT240148_Description: 'Nước dùng ninh xương 12 tiếng, bánh phở mềm dẻo, bò tái nạm thơm ngon.',
        BIT240148_DishCategoryId: 2,
        BIT240148_SyncStatus: SYNC_STATUS_SYNCED,
        BIT240148_UpdatedAt: now
      },
      {
        BIT240148_Id: 2,
        BIT240148_Name: 'Bún Chả Hà Nội Than Hoa',
        BIT240148_Price: 60000,
        BIT240148_PreparationTime: 20, // Regular (> 15m)
        BIT240148_IsAvailable: true,
        BIT240148_Description: 'Chả nướng than hoa thơm lừng, nước chấm đu đủ chua ngọt thanh.',
        BIT240148_DishCategoryId: 2,
        BIT240148_SyncStatus: SYNC_STATUS_SYNCED,
        BIT240148_UpdatedAt: now
      },
      {
        BIT240148_Id: 3,
        BIT240148_Name: 'Gỏi Cuốn Tôm Thịt Nam Bộ',
        BIT240148_Price: 35000,
        BIT240148_PreparationTime: 10, // Quick (<= 15m)
        BIT240148_IsAvailable: true,
        BIT240148_Description: 'Tôm thịt tươi ngon cuộn bún và rau sống chấm tương đậu phộng.',
        BIT240148_DishCategoryId: 1,
        BIT240148_SyncStatus: SYNC_STATUS_SYNCED,
        BIT240148_UpdatedAt: now
      },
      {
        BIT240148_Id: 4,
        BIT240148_Name: 'Nem Rán Giòn Rụm',
        BIT240148_Price: 45000,
        BIT240148_PreparationTime: 18, // Regular (> 15m)
        BIT240148_IsAvailable: true,
        BIT240148_Description: 'Vỏ nem giòn tan, nhân thịt băm mộc nhĩ nấm hương miến dong.',
        BIT240148_DishCategoryId: 1,
        BIT240148_SyncStatus: SYNC_STATUS_SYNCED,
        BIT240148_UpdatedAt: now
      },
      {
        BIT240148_Id: 5,
        BIT240148_Name: 'Chè Hạt Sen Long Nhãn',
        BIT240148_Price: 28000,
        BIT240148_PreparationTime: 15, // Quick (<= 15m)
        BIT240148_IsAvailable: true,
        BIT240148_Description: 'Hạt sen bùi bở bọc trong cùi nhãn ngọt thanh hoa bưởi mát lành.',
        BIT240148_DishCategoryId: 3,
        BIT240148_SyncStatus: SYNC_STATUS_SYNCED,
        BIT240148_UpdatedAt: now
      },
      {
        BIT240148_Id: 6,
        BIT240148_Name: 'Cà Phê Muối Xứ Huế',
        BIT240148_Price: 30000,
        BIT240148_PreparationTime: 8, // Quick (<= 15m)
        BIT240148_IsAvailable: false, // Ngừng bán (để demo kiểm tra lọc đang bán)
        BIT240148_Description: 'Cà phê pha phin truyền thống phối hợp cùng lớp kem mặn béo ngậy.',
        BIT240148_DishCategoryId: 3,
        BIT240148_SyncStatus: SYNC_STATUS_SYNCED,
        BIT240148_UpdatedAt: now
      }
    ];

    const initialImages: BIT240148_DishImage[] = [
      {
        BIT240148_Id: 1,
        BIT240148_DishId: 1,
        BIT240148_ImageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600',
        BIT240148_IsThumbnail: true
      },
      {
        BIT240148_Id: 2,
        BIT240148_DishId: 1,
        BIT240148_ImageUrl: 'https://images.unsplash.com/photo-1503764654157-724e030b05b6?w=600',
        BIT240148_IsThumbnail: false
      },
      {
        BIT240148_Id: 3,
        BIT240148_DishId: 2,
        BIT240148_ImageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600',
        BIT240148_IsThumbnail: true
      },
      {
        BIT240148_Id: 4,
        BIT240148_DishId: 2,
        BIT240148_ImageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600',
        BIT240148_IsThumbnail: false
      },
      {
        BIT240148_Id: 5,
        BIT240148_DishId: 3,
        BIT240148_ImageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600',
        BIT240148_IsThumbnail: true
      },
      {
        BIT240148_Id: 6,
        BIT240148_DishId: 4,
        BIT240148_ImageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600',
        BIT240148_IsThumbnail: true
      },
      {
        BIT240148_Id: 7,
        BIT240148_DishId: 5,
        BIT240148_ImageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600',
        BIT240148_IsThumbnail: true
      },
      {
        BIT240148_Id: 8,
        BIT240148_DishId: 6,
        BIT240148_ImageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600',
        BIT240148_IsThumbnail: true
      }
    ];

    await AsyncStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(initialCategories));
    await AsyncStorage.setItem(DISH_STORAGE_KEY, JSON.stringify(initialDishes));
    await AsyncStorage.setItem(DISH_IMAGE_STORAGE_KEY, JSON.stringify(initialImages));
  }

  // ==================== CATEGORIES ====================

  async getAllCategories(): Promise<BIT240148_DishCategory[]> {
    await this.initStorage();
    const data = await AsyncStorage.getItem(CATEGORY_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  async isCategoryInUse(categoryId: number): Promise<boolean> {
    const dishes = await this.getAllDishes();
    return dishes.some(
      d => d.BIT240148_DishCategoryId === categoryId && d.BIT240148_SyncStatus !== SYNC_STATUS_PENDING_DELETE
    );
  }

  async deleteCategory(categoryId: number): Promise<boolean> {
    if (await this.isCategoryInUse(categoryId)) {
      return false;
    }
    const categories = await this.getAllCategories();
    const filtered = categories.filter(c => c.BIT240148_Id !== categoryId);
    await AsyncStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  // ==================== DISHES ====================

  async getAllDishes(): Promise<BIT240148_Dish[]> {
    await this.initStorage();
    const data = await AsyncStorage.getItem(DISH_STORAGE_KEY);
    const dishes: BIT240148_Dish[] = data ? JSON.parse(data) : [];
    return dishes.filter(d => d.BIT240148_SyncStatus !== SYNC_STATUS_PENDING_DELETE);
  }

  async getAllImages(): Promise<BIT240148_DishImage[]> {
    await this.initStorage();
    const data = await AsyncStorage.getItem(DISH_IMAGE_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  async getAllDishesWithDetails(): Promise<BIT240148_DishWithDetails[]> {
    const dishes = await this.getAllDishes();
    const categories = await this.getAllCategories();
    const allImages = await this.getAllImages();

    const categoryMap = new Map(categories.map(c => [c.BIT240148_Id, c]));

    return dishes.map(dish => {
      const dishImages = allImages.filter(img => img.BIT240148_DishId === dish.BIT240148_Id);
      const thumb =
        dishImages.find(img => img.BIT240148_IsThumbnail)?.BIT240148_ImageUrl ||
        dishImages[0]?.BIT240148_ImageUrl ||
        '';

      return {
        dish,
        category: categoryMap.get(dish.BIT240148_DishCategoryId),
        images: dishImages,
        thumbnailUrl: thumb
      };
    });
  }

  async getDishWithDetailsById(dishId: number): Promise<BIT240148_DishWithDetails | null> {
    const all = await this.getAllDishesWithDetails();
    return all.find(item => item.dish.BIT240148_Id === dishId) || null;
  }

  async saveDish(
    dishId: number,
    name: string,
    price: number,
    prepTime: number,
    isAvailable: boolean,
    description: string,
    categoryId: number,
    imageUrls: string[] = [],
    thumbnailUrl?: string
  ): Promise<number> {
    await this.initStorage();
    const rawDishesData = await AsyncStorage.getItem(DISH_STORAGE_KEY);
    const dishes: BIT240148_Dish[] = rawDishesData ? JSON.parse(rawDishesData) : [];
    const rawImagesData = await AsyncStorage.getItem(DISH_IMAGE_STORAGE_KEY);
    let images: BIT240148_DishImage[] = rawImagesData ? JSON.parse(rawImagesData) : [];

    let targetDishId = dishId;
    const now = Date.now();

    if (dishId === 0) {
      // Tạo món mới
      targetDishId = dishes.length > 0 ? Math.max(...dishes.map(d => d.BIT240148_Id)) + 1 : 1;
      const newDish: BIT240148_Dish = {
        BIT240148_Id: targetDishId,
        BIT240148_Name: name,
        BIT240148_Price: price,
        BIT240148_PreparationTime: prepTime,
        BIT240148_IsAvailable: isAvailable,
        BIT240148_Description: description,
        BIT240148_DishCategoryId: categoryId,
        BIT240148_SyncStatus: SYNC_STATUS_PENDING,
        BIT240148_UpdatedAt: now
      };
      dishes.push(newDish);
    } else {
      // Cập nhật món cũ
      const idx = dishes.findIndex(d => d.BIT240148_Id === dishId);
      if (idx !== -1) {
        dishes[idx] = {
          ...dishes[idx],
          BIT240148_Name: name,
          BIT240148_Price: price,
          BIT240148_PreparationTime: prepTime,
          BIT240148_IsAvailable: isAvailable,
          BIT240148_Description: description,
          BIT240148_DishCategoryId: categoryId,
          BIT240148_SyncStatus: SYNC_STATUS_PENDING,
          BIT240148_UpdatedAt: now
        };
      }
    }

    // Lưu ảnh mới nếu có
    const thumbTarget = thumbnailUrl || imageUrls[0];
    for (const url of imageUrls) {
      if (url.trim()) {
        const nextImgId = images.length > 0 ? Math.max(...images.map(i => i.BIT240148_Id)) + 1 : 1;
        images.push({
          BIT240148_Id: nextImgId,
          BIT240148_DishId: targetDishId,
          BIT240148_ImageUrl: url.trim(),
          BIT240148_IsThumbnail: url.trim() === thumbTarget
        });
      }
    }

    await AsyncStorage.setItem(DISH_STORAGE_KEY, JSON.stringify(dishes));
    await AsyncStorage.setItem(DISH_IMAGE_STORAGE_KEY, JSON.stringify(images));

    return targetDishId;
  }

  async deleteDish(dishId: number): Promise<boolean> {
    await this.initStorage();
    const data = await AsyncStorage.getItem(DISH_STORAGE_KEY);
    const dishes: BIT240148_Dish[] = data ? JSON.parse(data) : [];
    const idx = dishes.findIndex(d => d.BIT240148_Id === dishId);
    if (idx !== -1) {
      dishes[idx].BIT240148_SyncStatus = SYNC_STATUS_PENDING_DELETE;
      dishes[idx].BIT240148_UpdatedAt = Date.now();
      await AsyncStorage.setItem(DISH_STORAGE_KEY, JSON.stringify(dishes));
      return true;
    }
    return false;
  }

  async setAsThumbnail(dishId: number, imageId: number): Promise<boolean> {
    const rawImages = await AsyncStorage.getItem(DISH_IMAGE_STORAGE_KEY);
    const images: BIT240148_DishImage[] = rawImages ? JSON.parse(rawImages) : [];

    for (const img of images) {
      if (img.BIT240148_DishId === dishId) {
        img.BIT240148_IsThumbnail = img.BIT240148_Id === imageId;
      }
    }

    await AsyncStorage.setItem(DISH_IMAGE_STORAGE_KEY, JSON.stringify(images));
    return true;
  }

  async addImage(dishId: number, url: string, isThumbnail: boolean): Promise<void> {
    const rawImages = await AsyncStorage.getItem(DISH_IMAGE_STORAGE_KEY);
    const images: BIT240148_DishImage[] = rawImages ? JSON.parse(rawImages) : [];

    if (isThumbnail) {
      for (const img of images) {
        if (img.BIT240148_DishId === dishId) {
          img.BIT240148_IsThumbnail = false;
        }
      }
    }

    const nextId = images.length > 0 ? Math.max(...images.map(i => i.BIT240148_Id)) + 1 : 1;
    images.push({
      BIT240148_Id: nextId,
      BIT240148_DishId: dishId,
      BIT240148_ImageUrl: url,
      BIT240148_IsThumbnail: isThumbnail
    });

    await AsyncStorage.setItem(DISH_IMAGE_STORAGE_KEY, JSON.stringify(images));
  }

  // ==================== SYNC HELPERS ====================

  async getPendingDishes(): Promise<BIT240148_Dish[]> {
    const data = await AsyncStorage.getItem(DISH_STORAGE_KEY);
    const dishes: BIT240148_Dish[] = data ? JSON.parse(data) : [];
    return dishes.filter(d => d.BIT240148_SyncStatus === SYNC_STATUS_PENDING);
  }

  async getPendingDeleteDishes(): Promise<BIT240148_Dish[]> {
    const data = await AsyncStorage.getItem(DISH_STORAGE_KEY);
    const dishes: BIT240148_Dish[] = data ? JSON.parse(data) : [];
    return dishes.filter(d => d.BIT240148_SyncStatus === SYNC_STATUS_PENDING_DELETE);
  }

  async markDishSynced(dishId: number): Promise<void> {
    const data = await AsyncStorage.getItem(DISH_STORAGE_KEY);
    const dishes: BIT240148_Dish[] = data ? JSON.parse(data) : [];
    const idx = dishes.findIndex(d => d.BIT240148_Id === dishId);
    if (idx !== -1) {
      dishes[idx].BIT240148_SyncStatus = SYNC_STATUS_SYNCED;
      await AsyncStorage.setItem(DISH_STORAGE_KEY, JSON.stringify(dishes));
    }
  }

  async permanentlyDeleteDish(dishId: number): Promise<void> {
    const data = await AsyncStorage.getItem(DISH_STORAGE_KEY);
    const dishes: BIT240148_Dish[] = data ? JSON.parse(data) : [];
    const filtered = dishes.filter(d => d.BIT240148_Id !== dishId);
    await AsyncStorage.setItem(DISH_STORAGE_KEY, JSON.stringify(filtered));

    const rawImgs = await AsyncStorage.getItem(DISH_IMAGE_STORAGE_KEY);
    const images: BIT240148_DishImage[] = rawImgs ? JSON.parse(rawImgs) : [];
    const filteredImgs = images.filter(i => i.BIT240148_DishId !== dishId);
    await AsyncStorage.setItem(DISH_IMAGE_STORAGE_KEY, JSON.stringify(filteredImgs));
  }
}

export const storageService = new BIT240148_StorageService();
