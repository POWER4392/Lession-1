import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { BIT240148_DishWithDetails } from '../models/BIT240148_DishWithDetails';
import { isDishQuick } from '../models/BIT240148_Dish';
import { useLanguage } from '../localization/BIT240148_LanguageContext';
import { BIT240148_Strings } from '../localization/BIT240148_Strings';

interface DishCardProps {
  item: BIT240148_DishWithDetails;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const BIT240148_DishCard: React.FC<DishCardProps> = ({ item, onPress, onEdit, onDelete }) => {
  const { language } = useLanguage();
  const { dish, category, thumbnailUrl } = item;

  const isQuick = isDishQuick(dish.BIT240148_PreparationTime);
  const prepLabel = isQuick ? BIT240148_Strings.quickTime(language) : BIT240148_Strings.regularTime(language);
  const statusLabel = dish.BIT240148_IsAvailable
    ? BIT240148_Strings.available(language)
    : BIT240148_Strings.unavailable(language);

  const priceFormatted = `${dish.BIT240148_Price.toLocaleString('vi-VN')} đ`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Thumbnail Image */}
      <View style={styles.imageContainer}>
        {thumbnailUrl ? (
          <Image source={{ uri: thumbnailUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderIcon}>🍲</Text>
          </View>
        )}
        {dish.BIT240148_SyncStatus !== 0 && (
          <View style={styles.syncBadge}>
            <Text style={styles.syncBadgeText}>⏳</Text>
          </View>
        )}
      </View>

      {/* Info Column */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {dish.BIT240148_Name}
        </Text>
        {category && (
          <Text style={styles.category} numberOfLines={1}>
            {category.BIT240148_Name}
          </Text>
        )}
        <Text style={styles.price}>{priceFormatted}</Text>

        {/* Badges Row */}
        <View style={styles.badgesRow}>
          {/* Quick / Regular tag */}
          <View style={[styles.tag, isQuick ? styles.quickTag : styles.regularTag]}>
            <Text style={[styles.tagText, isQuick ? styles.quickText : styles.regularText]}>
              ⏱ {prepLabel} ({dish.BIT240148_PreparationTime}')
            </Text>
          </View>

          {/* Status tag */}
          <View style={[styles.tag, dish.BIT240148_IsAvailable ? styles.availTag : styles.unavailTag]}>
            <Text style={[styles.tagText, dish.BIT240148_IsAvailable ? styles.availText : styles.unavailText]}>
              {statusLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions Column */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
          <Text style={styles.actionIcon}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
          <Text style={styles.actionIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  imageContainer: {
    width: 84,
    height: 84,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE0B2'
  },
  placeholderIcon: {
    fontSize: 32
  },
  syncBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#E65100',
    borderRadius: 8,
    padding: 2
  },
  syncBadgeText: {
    fontSize: 10
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center'
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 2
  },
  category: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E65100',
    marginBottom: 6
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  quickTag: {
    backgroundColor: '#E8F5E9'
  },
  quickText: {
    color: '#2E7D32'
  },
  regularTag: {
    backgroundColor: '#E3F2FD'
  },
  regularText: {
    color: '#1565C0'
  },
  availTag: {
    backgroundColor: '#E8F5E9'
  },
  availText: {
    color: '#2E7D32'
  },
  unavailTag: {
    backgroundColor: '#FFEBEE'
  },
  unavailText: {
    color: '#C62828'
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600'
  },
  actions: {
    justifyContent: 'space-around',
    paddingLeft: 8
  },
  actionBtn: {
    padding: 6
  },
  actionIcon: {
    fontSize: 18
  }
});
