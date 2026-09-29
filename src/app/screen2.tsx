import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Screen2() {
  const router = useRouter();
  const params = useLocalSearchParams<{ userName?: string; mssv?: string }>();

  const userName = params.userName || '';
  const mssv = params.mssv || '';

  // Hiển thị định dạng "UserName - MSSV" theo đúng yêu cầu
  const displayText =
    userName && mssv
      ? `${userName} - ${mssv}`
      : userName || mssv || 'Trần Đức Mạnh - BIT240148';

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Ở vị trí top-left: 1 button black-arrow click vào chuyển về Screen 1 */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.blackArrowButton}
          onPress={handleGoBack}
          activeOpacity={0.6}
          accessibilityRole="button"
          accessibilityLabel="Quay về Screen 1"
          testID="btn-black-arrow"
        >
          {/* Black arrow icon */}
          <Text style={styles.blackArrowText}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị chính giữa màn hình: "UserName - MSSV" */}
      <View style={styles.centerContainer}>
        <Text style={styles.displayText}>{displayText}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: StatusBar.currentHeight || 20,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  blackArrowButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  blackArrowText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000', // Black arrow
    lineHeight: 36,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  displayText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
