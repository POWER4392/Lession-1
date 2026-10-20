import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { BIT240148_DishWithDetails } from '../models/BIT240148_DishWithDetails';
import { BIT240148_DishCategory } from '../models/BIT240148_DishCategory';
import { BIT240148_FilterCriteria, defaultFilterCriteria } from '../models/BIT240148_FilterCriteria';
import { storageService } from '../data/BIT240148_StorageService';
import { useLanguage } from '../localization/BIT240148_LanguageContext';
import { BIT240148_Strings } from '../localization/BIT240148_Strings';
import { BIT240148_TopAppBar } from '../components/BIT240148_TopAppBar';
import { BIT240148_DishCard } from '../components/BIT240148_DishCard';
import { BIT240148_FilterModal } from '../components/BIT240148_FilterModal';
import { BIT240148_ConfirmModal } from '../components/BIT240148_ConfirmModal';
import { syncEngine } from '../network/BIT240148_SyncEngine';

interface DishListScreenProps {
  onSelectDish: (dishId: number) => void;
  onAddDish: () => void;
  onEditDish: (dishId: number) => void;
  onManageCategories: () => void;
  criteria: BIT240148_FilterCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<BIT240148_FilterCriteria>>;
}

export const BIT240148_DishListScreen: React.FC<DishListScreenProps> = ({
  onSelectDish,
  onAddDish,
  onEditDish,
  onManageCategories,
  criteria,
  setCriteria
}) => {
  const { language } = useLanguage();

  const [allDishes, setAllDishes] = useState<BIT240148_DishWithDetails[]>([]);
  const [categories, setCategories] = useState<BIT240148_DishCategory[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [dishToDelete, setDishToDelete] = useState<{ id: number; name: string } | null>(null);

  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadData = async () => {
    const list = await storageService.getAllDishesWithDetails();
    const cats = await storageService.getAllCategories();
    setAllDishes(list);
    setCategories(cats);
  };

  useEffect(() => {
    loadData();

    const handleSyncChange = (syncing: boolean) => {
      setIsSyncing(syncing);
      if (!syncing) {
        loadData();
      }
    };
    syncEngine.addListener(handleSyncChange);

    return () => syncEngine.removeListener(handleSyncChange);
  }, []);

  // Lọc và sắp xếp kết hợp theo yêu cầu 4.2
  const filteredDishes = useMemo(() => {
    let result = [...allDishes];

    // 1. Tìm theo tên món (một phần tên)
    if (criteria.searchQuery.trim()) {
      const q = criteria.searchQuery.trim().toLowerCase();
      result = result.filter(item => item.dish.BIT240148_Name.toLowerCase().includes(q));
    }

    // 2. Lọc theo loại món
    if (criteria.categoryId) {
      result = result.filter(item => item.dish.BIT240148_DishCategoryId === criteria.categoryId);
    }

    // 3. Lọc theo trạng thái đang bán (Yêu cầu 4.4: món ngừng bán vẫn hiện trong quản lý, nhưng không hiện khi lọc đang bán)
    if (criteria.onlyAvailable !== null && criteria.onlyAvailable !== undefined) {
      result = result.filter(item => item.dish.BIT240148_IsAvailable === criteria.onlyAvailable);
    }

    // 4. Lọc theo khoảng giá
    if (criteria.minPrice !== null && criteria.minPrice !== undefined) {
      result = result.filter(item => item.dish.BIT240148_Price >= criteria.minPrice!);
    }
    if (criteria.maxPrice !== null && criteria.maxPrice !== undefined) {
      result = result.filter(item => item.dish.BIT240148_Price <= criteria.maxPrice!);
    }

    // 5. Sắp xếp
    switch (criteria.sortOption) {
      case 'PRICE_ASC':
        result.sort((a, b) => a.dish.BIT240148_Price - b.dish.BIT240148_Price);
        break;
      case 'PRICE_DESC':
        result.sort((a, b) => b.dish.BIT240148_Price - a.dish.BIT240148_Price);
        break;
      case 'PREP_TIME_ASC':
        result.sort((a, b) => a.dish.BIT240148_PreparationTime - b.dish.BIT240148_PreparationTime);
        break;
    }

    return result;
  }, [allDishes, criteria]);

  const handleDeleteConfirm = async () => {
    if (dishToDelete) {
      await storageService.deleteDish(dishToDelete.id);
      setDishToDelete(null);
      loadData();
      if (isOnline) {
        syncEngine.autoSync();
      }
    }
  };

  const isFilterActive =
    Boolean(criteria.searchQuery) ||
    Boolean(criteria.categoryId) ||
    criteria.onlyAvailable !== null ||
    criteria.minPrice !== null ||
    criteria.maxPrice !== null ||
    criteria.sortOption !== 'NONE';

  return (
    <SafeAreaView style={styles.container}>
      <BIT240148_TopAppBar
        title={BIT240148_Strings.appTitle(language)}
        isOnline={isOnline}
        isSyncing={isSyncing}
        onOpenFilter={() => setFilterModalVisible(true)}
        isFilterActive={isFilterActive}
      />

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={BIT240148_Strings.searchPlaceholder(language)}
          value={criteria.searchQuery}
          onChangeText={text => setCriteria(prev => ({ ...prev, searchQuery: text }))}
        />
        {Boolean(criteria.searchQuery) && (
          <TouchableOpacity onPress={() => setCriteria(prev => ({ ...prev, searchQuery: '' }))}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Category Chips Row */}
      <View style={styles.quickCatsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickCats}>
          <TouchableOpacity
            style={[styles.quickChip, !criteria.categoryId && styles.quickChipActive]}
            onPress={() => setCriteria(prev => ({ ...prev, categoryId: null }))}
          >
            <Text style={[styles.quickChipText, !criteria.categoryId && styles.quickChipTextActive]}>
              {BIT240148_Strings.allCategories(language)}
            </Text>
          </TouchableOpacity>

          {categories.map(cat => (
            <TouchableOpacity
              key={cat.BIT240148_Id}
              style={[styles.quickChip, criteria.categoryId === cat.BIT240148_Id && styles.quickChipActive]}
              onPress={() =>
                setCriteria(prev => ({
                  ...prev,
                  categoryId: prev.categoryId === cat.BIT240148_Id ? null : cat.BIT240148_Id
                }))
              }
            >
              <Text style={[styles.quickChipText, criteria.categoryId === cat.BIT240148_Id && styles.quickChipTextActive]}>
                {cat.BIT240148_Name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Dish List */}
      <FlatList
        data={filteredDishes}
        keyExtractor={item => item.dish.BIT240148_Id.toString()}
        renderItem={({ item }) => (
          <BIT240148_DishCard
            item={item}
            onPress={() => onSelectDish(item.dish.BIT240148_Id)}
            onEdit={() => onEditDish(item.dish.BIT240148_Id)}
            onDelete={() => setDishToDelete({ id: item.dish.BIT240148_Id, name: item.dish.BIT240148_Name })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyText}>
              {isFilterActive
                ? BIT240148_Strings.noDishesFound(language)
                : BIT240148_Strings.emptyDishList(language)}
            </Text>
          </View>
        }
      />

      {/* Floating Action Button (Add Dish) */}
      <TouchableOpacity style={styles.fab} onPress={onAddDish}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* Filter Modal */}
      <BIT240148_FilterModal
        visible={filterModalVisible}
        criteria={criteria}
        categories={categories}
        onApply={newCriteria => setCriteria(newCriteria)}
        onReset={() => setCriteria(defaultFilterCriteria)}
        onClose={() => setFilterModalVisible(false)}
      />

      {/* Delete Confirmation Modal */}
      {dishToDelete && (
        <BIT240148_ConfirmModal
          visible={Boolean(dishToDelete)}
          name={dishToDelete.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDishToDelete(null)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6'
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 44
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#212121'
  },
  clearIcon: {
    fontSize: 16,
    color: '#9E9E9E',
    padding: 4
  },
  quickCatsWrapper: {
    paddingVertical: 6
  },
  quickCats: {
    paddingHorizontal: 16,
    gap: 8
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  quickChipActive: {
    backgroundColor: '#FFE0B2',
    borderColor: '#E65100'
  },
  quickChipText: {
    fontSize: 12,
    color: '#616161'
  },
  quickChipTextActive: {
    color: '#E65100',
    fontWeight: 'bold'
  },
  listContent: {
    padding: 16,
    paddingBottom: 90
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12
  },
  emptyText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center'
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E65100',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 }
  },
  fabText: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: -2
  }
});
