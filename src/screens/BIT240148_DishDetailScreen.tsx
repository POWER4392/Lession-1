import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';
import { BIT240148_DishWithDetails } from '../models/BIT240148_DishWithDetails';
import { isDishQuick } from '../models/BIT240148_Dish';
import { storageService } from '../data/BIT240148_StorageService';
import { useLanguage } from '../localization/BIT240148_LanguageContext';
import { BIT240148_Strings } from '../localization/BIT240148_Strings';
import { BIT240148_TopAppBar } from '../components/BIT240148_TopAppBar';
import { BIT240148_ConfirmModal } from '../components/BIT240148_ConfirmModal';

interface DishDetailScreenProps {
  dishId: number;
  onGoBack: () => void;
  onEditDish: (dishId: number) => void;
}

export const BIT240148_DishDetailScreen: React.FC<DishDetailScreenProps> = ({
  dishId,
  onGoBack,
  onEditDish
}) => {
  const { language } = useLanguage();
  const [item, setItem] = useState<BIT240148_DishWithDetails | null>(null);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showAddImage, setShowAddImage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadDetail = async () => {
    const data = await storageService.getDishWithDetailsById(dishId);
    setItem(data);
  };

  useEffect(() => {
    loadDetail();
  }, [dishId]);

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <BIT240148_TopAppBar
          title={BIT240148_Strings.appTitle(language)}
          isOnline={true}
          isSyncing={false}
          canGoBack
          onGoBack={onGoBack}
        />
        <View style={styles.center}>
          <Text>{BIT240148_Strings.noDishesFound(language)}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { dish, category, images } = item;
  const isQuick = isDishQuick(dish.BIT240148_PreparationTime);
  const prepLabel = isQuick ? BIT240148_Strings.quickTime(language) : BIT240148_Strings.regularTime(language);
  const statusLabel = dish.BIT240148_IsAvailable
    ? BIT240148_Strings.available(language)
    : BIT240148_Strings.unavailable(language);

  const currentImg = images[selectedImgIdx] || images[0];

  const handleSetThumbnail = async () => {
    if (currentImg) {
      await storageService.setAsThumbnail(dish.BIT240148_Id, currentImg.BIT240148_Id);
      await loadDetail();
      Alert.alert('Thành công', 'Đã đặt làm ảnh đại diện món ăn');
    }
  };

  const handleAddImage = async () => {
    if (newImageUrl.trim()) {
      await storageService.addImage(dish.BIT240148_Id, newImageUrl.trim(), images.length === 0);
      setNewImageUrl('');
      setShowAddImage(false);
      await loadDetail();
    }
  };

  const handleDeleteDish = async () => {
    await storageService.deleteDish(dish.BIT240148_Id);
    setShowDeleteModal(false);
    onGoBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <BIT240148_TopAppBar
        title={dish.BIT240148_Name}
        isOnline={true}
        isSyncing={false}
        canGoBack
        onGoBack={onGoBack}
      />

      <ScrollView style={styles.scroll}>
        {/* Main Hero Image */}
        <View style={styles.heroWrapper}>
          {currentImg ? (
            <Image source={{ uri: currentImg.BIT240148_ImageUrl }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderHero}>
              <Text style={{ fontSize: 60 }}>🍲</Text>
            </View>
          )}

          {currentImg?.BIT240148_IsThumbnail && (
            <View style={styles.thumbBadge}>
              <Text style={styles.thumbBadgeText}>★ {BIT240148_Strings.thumbnailBadge(language)}</Text>
            </View>
          )}
        </View>

        {/* Gallery Strip */}
        <View style={styles.galleryHeader}>
          <Text style={styles.galleryTitle}>
            {BIT240148_Strings.imagesTitle(language)} ({images.length})
          </Text>
          <TouchableOpacity onPress={() => setShowAddImage(!showAddImage)}>
            <Text style={styles.addImageLink}>+ {BIT240148_Strings.addImage(language)}</Text>
          </TouchableOpacity>
        </View>

        {showAddImage && (
          <View style={styles.addImageBox}>
            <TextInput
              style={styles.addImageInput}
              placeholder={BIT240148_Strings.imageUrl(language)}
              value={newImageUrl}
              onChangeText={setNewImageUrl}
            />
            <TouchableOpacity style={styles.addImageBtn} onPress={handleAddImage}>
              <Text style={styles.addImageBtnText}>{BIT240148_Strings.save(language)}</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScroll}>
          {images.map((img, idx) => (
            <TouchableOpacity
              key={img.BIT240148_Id}
              onPress={() => setSelectedImgIdx(idx)}
              style={[styles.galleryThumbWrapper, selectedImgIdx === idx && styles.galleryThumbActive]}
            >
              <Image source={{ uri: img.BIT240148_ImageUrl }} style={styles.galleryThumb} />
              {img.BIT240148_IsThumbnail && <Text style={styles.starIcon}>★</Text>}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Set Thumbnail Action */}
        {currentImg && !currentImg.BIT240148_IsThumbnail && (
          <TouchableOpacity style={styles.setThumbBtn} onPress={handleSetThumbnail}>
            <Text style={styles.setThumbText}>⭐ {BIT240148_Strings.isThumbnail(language)}</Text>
          </TouchableOpacity>
        )}

        {/* Details Section */}
        <View style={styles.infoCard}>
          <Text style={styles.dishName}>{dish.BIT240148_Name}</Text>
          {category && <Text style={styles.catName}>{category.BIT240148_Name}</Text>}

          {/* Badges */}
          <View style={styles.badgesRow}>
            <View style={[styles.badge, isQuick ? styles.quickBadge : styles.regularBadge]}>
              <Text style={[styles.badgeText, isQuick ? styles.quickText : styles.regularText]}>
                ⏱ {prepLabel}: {dish.BIT240148_PreparationTime} {BIT240148_Strings.minutes(language)}
              </Text>
            </View>
            <View style={[styles.badge, dish.BIT240148_IsAvailable ? styles.availBadge : styles.unavailBadge]}>
              <Text style={[styles.badgeText, dish.BIT240148_IsAvailable ? styles.availText : styles.unavailText]}>
                {statusLabel}
              </Text>
            </View>
          </View>

          {/* Price Box */}
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>{BIT240148_Strings.price(language)}</Text>
            <Text style={styles.priceValue}>{dish.BIT240148_Price.toLocaleString('vi-VN')} đ</Text>
          </View>

          {/* Description */}
          <Text style={styles.descTitle}>{BIT240148_Strings.description(language)}</Text>
          <Text style={styles.descBody}>{dish.BIT240148_Description || '...'}</Text>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => setShowDeleteModal(true)}>
              <Text style={styles.deleteBtnText}>🗑 {BIT240148_Strings.deleteDish(language)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editBtn} onPress={() => onEditDish(dish.BIT240148_Id)}>
              <Text style={styles.editBtnText}>✏️ {BIT240148_Strings.editDish(language)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Delete Modal */}
      <BIT240148_ConfirmModal
        visible={showDeleteModal}
        name={dish.BIT240148_Name}
        onConfirm={handleDeleteDish}
        onCancel={() => setShowDeleteModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6'
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scroll: {
    flex: 1
  },
  heroWrapper: {
    width: '100%',
    height: 240,
    backgroundColor: '#EEEEEE',
    position: 'relative'
  },
  heroImage: {
    width: '100%',
    height: '100%'
  },
  placeholderHero: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE0B2'
  },
  thumbBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#E65100',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  thumbBadgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8
  },
  galleryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#212121'
  },
  addImageLink: {
    fontSize: 13,
    color: '#E65100',
    fontWeight: '700'
  },
  addImageBox: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 8
  },
  addImageInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13
  },
  addImageBtn: {
    backgroundColor: '#E65100',
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center'
  },
  addImageBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13
  },
  galleryScroll: {
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 8
  },
  galleryThumbWrapper: {
    width: 64,
    height: 64,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    position: 'relative'
  },
  galleryThumbActive: {
    borderColor: '#E65100'
  },
  galleryThumb: {
    width: '100%',
    height: '100%'
  },
  starIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
    color: '#FFB300',
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 4,
    paddingHorizontal: 2
  },
  setThumbBtn: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E65100',
    alignItems: 'center'
  },
  setThumbText: {
    color: '#E65100',
    fontWeight: '700',
    fontSize: 13
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4
  },
  dishName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 2
  },
  catName: {
    fontSize: 14,
    color: '#E65100',
    fontWeight: '600',
    marginBottom: 10
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold'
  },
  quickBadge: {
    backgroundColor: '#E8F5E9'
  },
  quickText: {
    color: '#2E7D32'
  },
  regularBadge: {
    backgroundColor: '#E3F2FD'
  },
  regularText: {
    color: '#1565C0'
  },
  availBadge: {
    backgroundColor: '#E8F5E9'
  },
  availText: {
    color: '#2E7D32'
  },
  unavailBadge: {
    backgroundColor: '#FFEBEE'
  },
  unavailText: {
    color: '#C62828'
  },
  priceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16
  },
  priceLabel: {
    fontSize: 14,
    color: '#795548',
    fontWeight: '600'
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100'
  },
  descTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 4
  },
  descBody: {
    fontSize: 14,
    color: '#616161',
    lineHeight: 22,
    marginBottom: 24
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12
  },
  deleteBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D32F2F',
    alignItems: 'center'
  },
  deleteBtnText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 14
  },
  editBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#E65100',
    alignItems: 'center'
  },
  editBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14
  }
});
