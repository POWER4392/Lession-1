import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { BIT240148_DishCategory } from '../models/BIT240148_DishCategory';
import { storageService } from '../data/BIT240148_StorageService';
import { useLanguage } from '../localization/BIT240148_LanguageContext';
import { BIT240148_Strings } from '../localization/BIT240148_Strings';
import { BIT240148_DishValidator } from '../validation/BIT240148_DishValidator';
import { BIT240148_TopAppBar } from '../components/BIT240148_TopAppBar';
import { syncEngine } from '../network/BIT240148_SyncEngine';

interface DishFormScreenProps {
  dishId: number; // 0: Tạo mới, > 0: Chỉnh sửa
  onGoBack: () => void;
}

export const BIT240148_DishFormScreen: React.FC<DishFormScreenProps> = ({ dishId, onGoBack }) => {
  const { language } = useLanguage();
  const isEditMode = dishId > 0;

  const [name, setName] = useState('');
  const [priceStr, setPriceStr] = useState('');
  const [prepTimeStr, setPrepTimeStr] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [description, setDescription] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState<BIT240148_DishCategory[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const cats = await storageService.getAllCategories();
      setCategories(cats);

      if (isEditMode) {
        const item = await storageService.getDishWithDetailsById(dishId);
        if (item) {
          setName(item.dish.BIT240148_Name);
          setPriceStr(item.dish.BIT240148_Price.toString());
          setPrepTimeStr(item.dish.BIT240148_PreparationTime.toString());
          setIsAvailable(item.dish.BIT240148_IsAvailable);
          setDescription(item.dish.BIT240148_Description);
          setSelectedCatId(item.dish.BIT240148_DishCategoryId);
          setImageUrl(item.thumbnailUrl);
        }
      } else {
        if (cats.length > 0) {
          setSelectedCatId(cats[0].BIT240148_Id);
        }
      }
    };
    init();
  }, [dishId, isEditMode]);

  const handleSave = async () => {
    // Lấy các món cùng loại để kiểm tra trùng tên
    const allDishes = await storageService.getAllDishes();
    const dishesInSameCategory = selectedCatId
      ? allDishes.filter(d => d.BIT240148_DishCategoryId === selectedCatId)
      : [];

    // Kiểm tra dữ liệu (Validation) theo mục 3 và 4.4 của đề bài
    const validation = BIT240148_DishValidator.validateDish(
      dishId,
      name,
      priceStr,
      prepTimeStr,
      selectedCatId,
      dishesInSameCategory,
      language
    );

    if (!validation.isValid) {
      setErrorMsg(validation.errorMessage || '');
      return;
    }

    const price = parseFloat(priceStr);
    const prepTime = parseInt(prepTimeStr, 10);
    const imgList = imageUrl.trim() ? [imageUrl.trim()] : [];

    await storageService.saveDish(
      dishId,
      name.trim(),
      price,
      prepTime,
      isAvailable,
      description.trim(),
      selectedCatId!,
      imgList,
      imageUrl.trim() || undefined
    );

    // Kích hoạt đồng bộ tự động
    syncEngine.autoSync();

    onGoBack();
  };

  const title = isEditMode ? BIT240148_Strings.editDish(language) : BIT240148_Strings.addDish(language);

  return (
    <SafeAreaView style={styles.container}>
      <BIT240148_TopAppBar
        title={title}
        isOnline={true}
        isSyncing={false}
        canGoBack
        onGoBack={onGoBack}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {errorMsg && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
          </View>
        )}

        {/* 1. Name */}
        <Text style={styles.label}>{language === 'en' ? 'Dish Name *' : 'Tên món ăn *'}</Text>
        <TextInput
          style={styles.input}
          placeholder="vd: Phở Bò Tái Nạm"
          value={name}
          onChangeText={t => {
            setName(t);
            setErrorMsg(null);
          }}
        />

        {/* 2. Category selection */}
        <Text style={styles.label}>{BIT240148_Strings.category(language)} *</Text>
        <View style={styles.catChipsRow}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.BIT240148_Id}
              style={[styles.catChip, selectedCatId === cat.BIT240148_Id && styles.catChipActive]}
              onPress={() => {
                setSelectedCatId(cat.BIT240148_Id);
                setErrorMsg(null);
              }}
            >
              <Text style={[styles.catChipText, selectedCatId === cat.BIT240148_Id && styles.catChipTextActive]}>
                {cat.BIT240148_Name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. Price & PrepTime */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{BIT240148_Strings.price(language)} (đ) *</Text>
            <TextInput
              style={styles.input}
              placeholder="55000"
              keyboardType="numeric"
              value={priceStr}
              onChangeText={t => {
                setPriceStr(t);
                setErrorMsg(null);
              }}
            />
          </View>

          <View style={{ width: 16 }} />

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{BIT240148_Strings.prepTime(language)} ({BIT240148_Strings.minutes(language)}) *</Text>
            <TextInput
              style={styles.input}
              placeholder="15"
              keyboardType="numeric"
              value={prepTimeStr}
              onChangeText={t => {
                setPrepTimeStr(t);
                setErrorMsg(null);
              }}
            />
          </View>
        </View>

        {/* 4. Image URL */}
        <Text style={styles.label}>{BIT240148_Strings.imageUrl(language)}</Text>
        <TextInput
          style={styles.input}
          placeholder="https://images.unsplash.com/..."
          value={imageUrl}
          onChangeText={setImageUrl}
        />

        {/* 5. Available Switch */}
        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>{BIT240148_Strings.status(language)}</Text>
            <Text style={styles.switchSub}>
              {isAvailable ? BIT240148_Strings.available(language) : BIT240148_Strings.unavailable(language)}
            </Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: '#BDBDBD', true: '#FFE0B2' }}
            thumbColor={isAvailable ? '#E65100' : '#F5F5F5'}
          />
        </View>

        {/* 6. Description */}
        <Text style={styles.label}>{BIT240148_Strings.description(language)}</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mô tả hương vị, nguyên liệu món ăn..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onGoBack}>
            <Text style={styles.cancelBtnText}>{BIT240148_Strings.cancel(language)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>💾 {BIT240148_Strings.save(language)}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6'
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F'
  },
  errorText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 13
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#424242',
    marginBottom: 6,
    marginTop: 8
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#212121'
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top'
  },
  catChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  catChipActive: {
    backgroundColor: '#FFE0B2',
    borderColor: '#E65100'
  },
  catChipText: {
    fontSize: 12,
    color: '#616161'
  },
  catChipTextActive: {
    color: '#E65100',
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 12,
    marginBottom: 8
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121'
  },
  switchSub: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 28
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    alignItems: 'center'
  },
  cancelBtnText: {
    color: '#757575',
    fontWeight: 'bold',
    fontSize: 14
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#E65100',
    alignItems: 'center'
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14
  }
});
