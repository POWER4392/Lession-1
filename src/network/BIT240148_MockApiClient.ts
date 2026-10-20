import { BIT240148_Dish } from '../models/BIT240148_Dish';

/**
 * REST API client kết nối tới MockAPI theo đề bài
 */
class BIT240148_MockApiClient {
  baseUrl: string = 'https://67b5e43ba9acbdb38ed04db1.mockapi.io/api/v1/BIT240148_Dish';

  async getDishes(): Promise<BIT240148_Dish[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (response.ok) {
        const json = await response.json();
        return json.map((item: any) => ({
          BIT240148_Id: item.BIT240148_Id || parseInt(item.id, 10),
          BIT240148_Name: item.BIT240148_Name || item.name,
          BIT240148_Price: parseFloat(item.BIT240148_Price || item.price || '0'),
          BIT240148_PreparationTime: parseInt(item.BIT240148_PreparationTime || item.preparationTime || '0', 10),
          BIT240148_IsAvailable: item.BIT240148_IsAvailable !== undefined ? item.BIT240148_IsAvailable : item.isAvailable,
          BIT240148_Description: item.BIT240148_Description || item.description || '',
          BIT240148_DishCategoryId: parseInt(item.BIT240148_DishCategoryId || item.dishCategoryId || '1', 10),
          BIT240148_SyncStatus: 0,
          BIT240148_UpdatedAt: Date.now()
        }));
      }
      return [];
    } catch (e) {
      console.log('Error fetching MockAPI:', e);
      return [];
    }
  }

  async createDish(dish: BIT240148_Dish): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BIT240148_Id: dish.BIT240148_Id,
          BIT240148_Name: dish.BIT240148_Name,
          BIT240148_Price: dish.BIT240148_Price,
          BIT240148_PreparationTime: dish.BIT240148_PreparationTime,
          BIT240148_IsAvailable: dish.BIT240148_IsAvailable,
          BIT240148_Description: dish.BIT240148_Description,
          BIT240148_DishCategoryId: dish.BIT240148_DishCategoryId,
          name: dish.BIT240148_Name,
          price: dish.BIT240148_Price,
          preparationTime: dish.BIT240148_PreparationTime,
          isAvailable: dish.BIT240148_IsAvailable
        })
      });
      return response.ok;
    } catch (e) {
      console.log('Error creating dish on MockAPI:', e);
      return false;
    }
  }

  async updateDish(dish: BIT240148_Dish): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${dish.BIT240148_Id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BIT240148_Name: dish.BIT240148_Name,
          BIT240148_Price: dish.BIT240148_Price,
          BIT240148_PreparationTime: dish.BIT240148_PreparationTime,
          BIT240148_IsAvailable: dish.BIT240148_IsAvailable,
          BIT240148_Description: dish.BIT240148_Description,
          BIT240148_DishCategoryId: dish.BIT240148_DishCategoryId,
          name: dish.BIT240148_Name,
          price: dish.BIT240148_Price,
          preparationTime: dish.BIT240148_PreparationTime,
          isAvailable: dish.BIT240148_IsAvailable
        })
      });
      return response.ok;
    } catch (e) {
      console.log('Error updating dish on MockAPI:', e);
      return false;
    }
  }

  async deleteDish(dishId: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${dishId}`, {
        method: 'DELETE'
      });
      return response.ok;
    } catch (e) {
      console.log('Error deleting dish on MockAPI:', e);
      return false;
    }
  }
}

export const mockApiClient = new BIT240148_MockApiClient();
