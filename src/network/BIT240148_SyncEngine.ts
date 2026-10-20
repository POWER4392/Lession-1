import { storageService } from '../data/BIT240148_StorageService';
import { mockApiClient } from './BIT240148_MockApiClient';

type SyncListener = (isSyncing: boolean, message: string) => void;

/**
 * Xử lý yêu cầu nâng cao: Hoạt động offline và tự động đồng bộ (1,5 điểm)
 * - Khi mất mạng: cho phép tạo/sửa/xóa và lưu vào AsyncStorage local.
 * - Khi có mạng trở lại: tự động đồng bộ lên MockAPI mà không yêu cầu bấm nút.
 * - Nhất quán dữ liệu, không sinh bản ghi trùng.
 */
class BIT240148_SyncEngine {
  private isSyncing = false;
  private listeners: SyncListener[] = [];
  private isOnline = true;

  addListener(listener: SyncListener) {
    this.listeners.push(listener);
  }

  removeListener(listener: SyncListener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notify(isSyncing: boolean, msg: string) {
    this.isSyncing = isSyncing;
    this.listeners.forEach(l => l(isSyncing, msg));
  }

  setOnlineStatus(online: boolean) {
    const wasOffline = !this.isOnline;
    this.isOnline = online;
    if (online && wasOffline) {
      // Tự động kích hoạt đồng bộ khi có mạng trở lại (Yêu cầu 5)
      this.autoSync();
    }
  }

  async autoSync(): Promise<void> {
    if (this.isSyncing || !this.isOnline) return;

    this.notify(true, 'Đang tự động đồng bộ lên MockAPI...');

    try {
      // 1. Xóa các món pending delete
      const pendingDeletes = await storageService.getPendingDeleteDishes();
      for (const dish of pendingDeletes) {
        await mockApiClient.deleteDish(dish.BIT240148_Id);
        await storageService.permanentlyDeleteDish(dish.BIT240148_Id);
      }

      // 2. Đồng bộ các món pending create / update
      const pendingDishes = await storageService.getPendingDishes();
      for (const dish of pendingDishes) {
        const updated = await mockApiClient.updateDish(dish);
        if (updated) {
          await storageService.markDishSynced(dish.BIT240148_Id);
        } else {
          const created = await mockApiClient.createDish(dish);
          if (created) {
            await storageService.markDishSynced(dish.BIT240148_Id);
          }
        }
      }

      this.notify(false, 'Đã tự động đồng bộ thành công!');
    } catch (e: any) {
      this.notify(false, `Lỗi đồng bộ: ${e.message}`);
    }
  }
}

export const syncEngine = new BIT240148_SyncEngine();
