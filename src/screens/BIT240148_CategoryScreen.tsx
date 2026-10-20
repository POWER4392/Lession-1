import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';
import { BIT240148_DishCategory } from '../models/BIT240148_DishCategory';
import { storageService } from '../data/BIT240148_StorageService';
import { useLanguage } from '../localization/BIT240148_LanguageContext';
import { BIT240148_Strings } from '../localization/BIT240148_Strings';
import { BIT240148_TopAppBar } from '../components/BIT240148_TopAppBar';

interface CategoryScreenProps {
  onGoBack: () => void;
}

export const BIT240148_CategoryScreen: React.FC<CategoryScreenProps> = ({ onGoBack }) => {
  const { language } = useLanguage();
  const [categories, setCategories] = useState<BIT240148_DishCategory[]>([]);

  const loadCategories = async () => {
    const list = await storageService.getAllCategories();
    setCategories(list);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDeleteCategory = async (cat: BIT240148_DishCategory) => {
    // Ràng buộc 4.4: Không cho xóa loại món đang được sử dụng
    const inUse = await storageService.isCategoryInUse(cat.BIT240148_Id);
    if (inUse) {
      Alert.alert('Không thể xóa', BIT240148_Strings.errCategoryInUse(language));
      return;
    }

    Alert.alert(
      BIT240148_Strings.confirmDeleteTitle(language),
      `Bạn có chắc chắn muốn xóa loại món '${cat.BIT240148_Name}'?`,
      [
        { text: BIT240148_Strings.cancel(language), style: 'cancel' },
        {
          text: BIT240148_Strings.delete(language),
          style: 'destructive',
          onPress: async () => {
            await storageService.deleteCategory(cat.BIT240148_Id);
            loadCategories();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <BIT240148_TopAppBar
        title={BIT240148_Strings.category(language)}
        isOnline={true}
        isSyncing={false}
        canGoBack
        onGoBack={onGoBack}
      />

      <FlatList
        data={categories}
        keyExtractor={item => item.BIT240148_Id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.BIT240148_Name}</Text>
              {Boolean(item.BIT240148_Description) && (
                <Text style={styles.desc}>{item.BIT240148_Description}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteCategory(item)}
              style={styles.deleteBtn}
            >
              <Text style={{ fontSize: 18 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6'
  },
  list: {
    padding: 16
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4
  },
  desc: {
    fontSize: 12,
    color: '#757575'
  },
  deleteBtn: {
    padding: 8
  }
});
