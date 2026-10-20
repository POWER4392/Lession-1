import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLanguage } from '../localization/BIT240148_LanguageContext';
import { BIT240148_Strings } from '../localization/BIT240148_Strings';

interface TopAppBarProps {
  title: string;
  isOnline: boolean;
  isSyncing: boolean;
  canGoBack?: boolean;
  onGoBack?: () => void;
  onOpenFilter?: () => void;
  isFilterActive?: boolean;
}

export const BIT240148_TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  isOnline,
  isSyncing,
  canGoBack = false,
  onGoBack,
  onOpenFilter,
  isFilterActive = false
}) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {canGoBack && (
          <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.actionsRow}>
        {/* Network & Sync Badge */}
        <View style={[styles.badge, isOnline ? styles.onlineBadge : styles.offlineBadge]}>
          {isSyncing ? (
            <ActivityIndicator size="small" color="#1565C0" style={{ marginRight: 4 }} />
          ) : (
            <View style={[styles.dot, isOnline ? styles.onlineDot : styles.offlineDot]} />
          )}
          <Text style={[styles.badgeText, isOnline ? styles.onlineText : styles.offlineText]}>
            {isSyncing ? 'Syncing' : isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>

        {/* Filter Button */}
        {onOpenFilter && (
          <TouchableOpacity onPress={onOpenFilter} style={styles.iconButton}>
            <Text style={styles.iconText}>🔍</Text>
            {isFilterActive && <View style={styles.filterDot} />}
          </TouchableOpacity>
        )}

        {/* Language Switcher */}
        <TouchableOpacity onPress={toggleLanguage} style={styles.langButton}>
          <Text style={styles.langButtonText}>{language === 'en' ? '🇺🇸 EN' : '🇻🇳 VI'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  backButton: {
    paddingRight: 12,
    paddingVertical: 8
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E65100'
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8
  },
  onlineBadge: {
    backgroundColor: '#E8F5E9'
  },
  offlineBadge: {
    backgroundColor: '#FFEBEE'
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4
  },
  onlineDot: {
    backgroundColor: '#2E7D32'
  },
  offlineDot: {
    backgroundColor: '#C62828'
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700'
  },
  onlineText: {
    color: '#2E7D32'
  },
  offlineText: {
    color: '#C62828'
  },
  iconButton: {
    padding: 6,
    marginRight: 8,
    position: 'relative'
  },
  iconText: {
    fontSize: 18
  },
  filterDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#D32F2F'
  },
  langButton: {
    backgroundColor: '#FFE0B2',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8
  },
  langButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E65100'
  }
});
