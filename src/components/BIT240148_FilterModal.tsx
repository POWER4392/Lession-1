import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet
} from 'react-native';
import { BIT240148_DishCategory } from '../models/BIT240148_DishCategory';
import { BIT240148_FilterCriteria, BIT240148_SortOption } from '../models/BIT240148_FilterCriteria';
import { useLanguage } from '../localization/BIT240148_LanguageContext';
import { BIT240148_Strings } from '../localization/BIT240148_Strings';
import { BIT240148_DishValidator } from '../validation/BIT240148_DishValidator';

interface FilterModalProps {
  visible: boolean;
  criteria: BIT240148_FilterCriteria;
  categories: BIT240148_DishCategory[];
  onApply: (newCriteria: BIT240148_FilterCriteria) => void;
  onReset: () => void;
  onClose: () => void;
}

export const BIT240148_FilterModal: React.FC<FilterModalProps> = ({
  visible,
  criteria,
  categories,
  onApply,
  onReset,
  onClose
}) => {
  const { language } = useLanguage();

  const [selectedCatId, setSelectedCatId] = useState<number | null | undefined>(criteria.categoryId);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean | null | undefined>(criteria.onlyAvailable);
  const [minPrice, setMinPrice] = useState<string>(criteria.minPrice ? criteria.minPrice.toString() : '');
  const [maxPrice, setMaxPrice] = useState<string>(criteria.maxPrice ? criteria.maxPrice.toString() : '');
  const [sortOption, setSortOption] = useState<BIT240148_SortOption>(criteria.sortOption);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleApply = () => {
    // Validate khoảng giá
    const validation = BIT240148_DishValidator.validatePriceRange(minPrice, maxPrice, language);
    if (!validation.isValid) {
      setErrorMsg(validation.errorMessage || '');
      return;
    }

    onApply({
      ...criteria,
      categoryId: selectedCatId,
      onlyAvailable: onlyAvailable,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      sortOption: sortOption
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedCatId(null);
    setOnlyAvailable(null);
    setMinPrice('');
    setMaxPrice('');
    setSortOption('NONE');
    setErrorMsg(null);
    onReset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{BIT240148_Strings.filterAndSort(language)}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll}>
            {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

            {/* 1. Category Filter */}
            <Text style={styles.sectionTitle}>{BIT240148_Strings.category(language)}</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[styles.chip, selectedCatId === null && styles.chipActive]}
                onPress={() => setSelectedCatId(null)}
              >
                <Text style={[styles.chipText, selectedCatId === null && styles.chipTextActive]}>
                  {BIT240148_Strings.allCategories(language)}
                </Text>
              </TouchableOpacity>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.BIT240148_Id}
                  style={[styles.chip, selectedCatId === cat.BIT240148_Id && styles.chipActive]}
                  onPress={() => setSelectedCatId(selectedCatId === cat.BIT240148_Id ? null : cat.BIT240148_Id)}
                >
                  <Text style={[styles.chipText, selectedCatId === cat.BIT240148_Id && styles.chipTextActive]}>
                    {cat.BIT240148_Name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 2. Status Filter */}
            <Text style={styles.sectionTitle}>{BIT240148_Strings.status(language)}</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[styles.chip, onlyAvailable === null && styles.chipActive]}
                onPress={() => setOnlyAvailable(null)}
              >
                <Text style={[styles.chipText, onlyAvailable === null && styles.chipTextActive]}>
                  {BIT240148_Strings.allStatuses(language)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, onlyAvailable === true && styles.chipActive]}
                onPress={() => setOnlyAvailable(onlyAvailable === true ? null : true)}
              >
                <Text style={[styles.chipText, onlyAvailable === true && styles.chipTextActive]}>
                  {BIT240148_Strings.available(language)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, onlyAvailable === false && styles.chipActive]}
                onPress={() => setOnlyAvailable(onlyAvailable === false ? null : false)}
              >
                <Text style={[styles.chipText, onlyAvailable === false && styles.chipTextActive]}>
                  {BIT240148_Strings.unavailable(language)}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 3. Price Range Filter */}
            <Text style={styles.sectionTitle}>{BIT240148_Strings.priceRange(language)}</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder={BIT240148_Strings.minPrice(language)}
                keyboardType="numeric"
                value={minPrice}
                onChangeText={t => {
                  setMinPrice(t);
                  setErrorMsg(null);
                }}
              />
              <Text style={{ marginHorizontal: 8, color: '#757575' }}>—</Text>
              <TextInput
                style={styles.input}
                placeholder={BIT240148_Strings.maxPrice(language)}
                keyboardType="numeric"
                value={maxPrice}
                onChangeText={t => {
                  setMaxPrice(t);
                  setErrorMsg(null);
                }}
              />
            </View>

            {/* 4. Sort Options */}
            <Text style={styles.sectionTitle}>{BIT240148_Strings.sortBy(language)}</Text>
            {[
              { id: 'NONE', label: BIT240148_Strings.sortNone(language) },
              { id: 'PRICE_ASC', label: BIT240148_Strings.sortPriceAsc(language) },
              { id: 'PRICE_DESC', label: BIT240148_Strings.sortPriceDesc(language) },
              { id: 'PREP_TIME_ASC', label: BIT240148_Strings.sortPrepTimeAsc(language) }
            ].map(opt => (
              <TouchableOpacity
                key={opt.id}
                style={styles.radioRow}
                onPress={() => setSortOption(opt.id as BIT240148_SortOption)}
              >
                <View style={[styles.radioCircle, sortOption === opt.id && styles.radioCircleActive]}>
                  {sortOption === opt.id && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetText}>{BIT240148_Strings.resetFilters(language)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyText}>{BIT240148_Strings.applyFilters(language)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 24
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121'
  },
  closeBtn: {
    padding: 4
  },
  closeText: {
    fontSize: 18,
    color: '#757575'
  },
  scroll: {
    padding: 18
  },
  error: {
    color: '#D32F2F',
    fontWeight: 'bold',
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#424242',
    marginTop: 12,
    marginBottom: 8
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  chipActive: {
    backgroundColor: '#FFE0B2',
    borderColor: '#E65100'
  },
  chipText: {
    fontSize: 12,
    color: '#616161'
  },
  chipTextActive: {
    color: '#E65100',
    fontWeight: 'bold'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#FAFAFA'
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#BDBDBD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  radioCircleActive: {
    borderColor: '#E65100'
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E65100'
  },
  radioLabel: {
    fontSize: 14,
    color: '#333333'
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingTop: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE'
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    alignItems: 'center'
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#616161'
  },
  applyBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#E65100',
    alignItems: 'center'
  },
  applyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF'
  }
});
