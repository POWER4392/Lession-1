import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function App() {
  const router = useRouter();

  // State quản lý dữ liệu nhập
  const [userName, setUserName] = useState('');
  const [mssv, setMssv] = useState('');

  // State quản lý thông báo lỗi validate
  const [userNameError, setUserNameError] = useState('');
  const [mssvError, setMssvError] = useState('');

  // Xử lý khi nhấn nút "Click me"
  const handleClickMe = () => {
    let isValid = true;

    if (!userName.trim()) {
      setUserNameError('UserName không được để trống!');
      isValid = false;
    } else {
      setUserNameError('');
    }

    if (!mssv.trim()) {
      setMssvError('MSSV không được để trống!');
      isValid = false;
    } else {
      setMssvError('');
    }

    // Nếu dữ liệu hợp lệ, chuyển sang Screen 2 và truyền dữ liệu
    if (isValid) {
      router.push({
        pathname: '/screen2',
        params: {
          userName: userName.trim(),
          mssv: mssv.trim(),
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Screen 1 */}
          <View style={styles.screenHeader}>
            <Text style={styles.screenTitle}>Screen 1</Text>
          </View>

          {/* Grid Layout bài học cũ */}
          <View style={styles.gridContainer}>
            {/* Hàng 1: Ô 1 và Ô 2 (tỉ lệ 1:1) */}
            <View style={styles.row1}>
              <View style={[styles.box, styles.box1]}>
                <Text style={styles.numberText}>1</Text>
              </View>
              <View style={[styles.box, styles.box2]}>
                <Text style={styles.numberText}>2</Text>
              </View>
            </View>

            {/* Hàng 2: Ô 3, 4, 5 và Ô trống */}
            <View style={styles.row2}>
              <View style={[styles.box, styles.box3]}>
                <Text style={[styles.numberText, styles.darkText]}>3</Text>
              </View>
              <View style={[styles.box, styles.box4]}>
                <Text style={styles.numberText}>4</Text>
              </View>
              <View style={[styles.box, styles.box5]}>
                <Text style={styles.numberText}>5</Text>
              </View>
              <View style={styles.emptyBox} />
            </View>

            {/* Hàng 3: Ô 6 */}
            <View style={styles.row3}>
              <View style={[styles.box, styles.box6]}>
                <Text style={styles.numberText}>6</Text>
              </View>
            </View>
          </View>

          {/* Form nhập thông tin UserName & MSSV */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Thông tin sinh viên</Text>

            {/* Ô nhập UserName */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                UserName <Text style={styles.requiredMark}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, userNameError ? styles.inputError : null]}
                placeholder="Nhập UserName..."
                placeholderTextColor="#9E9E9E"
                value={userName}
                onChangeText={(text) => {
                  setUserName(text);
                  if (userNameError) setUserNameError('');
                }}
                autoCapitalize="words"
              />
              {userNameError ? (
                <Text style={styles.errorText}>{userNameError}</Text>
              ) : null}
            </View>

            {/* Ô nhập MSSV */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                MSSV <Text style={styles.requiredMark}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, mssvError ? styles.inputError : null]}
                placeholder="Nhập MSSV (ví dụ: BIT240148)..."
                placeholderTextColor="#9E9E9E"
                value={mssv}
                onChangeText={(text) => {
                  setMssv(text);
                  if (mssvError) setMssvError('');
                }}
                autoCapitalize="characters"
              />
              {mssvError ? (
                <Text style={styles.errorText}>{mssvError}</Text>
              ) : null}
            </View>
          </View>

          {/* Vị trí Bottom-Center: Nút bấm "Click me" */}
          <View style={styles.bottomCenterSection}>
            <TouchableOpacity
              style={styles.clickMeButton}
              onPress={handleClickMe}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Click me để chuyển sang Screen 2"
              testID="btn-click-me"
            >
              <Text style={styles.clickMeButtonText}>Click me</Text>
            </TouchableOpacity>

            {/* Footer thông tin sinh viên */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Trần Đức Mạnh - BIT240148</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: StatusBar.currentHeight || 20,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  screenHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 10,
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  numberText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  darkText: {
    color: '#1A1A1A',
  },

  /* Hàng 1 */
  row1: {
    flexDirection: 'row',
    height: 110,
    gap: 10,
  },
  box1: {
    flex: 1,
    backgroundColor: '#1976D2', // Xanh dương
  },
  box2: {
    flex: 1,
    backgroundColor: '#E53935', // Đỏ
  },

  /* Hàng 2 */
  row2: {
    flexDirection: 'row',
    height: 100,
    gap: 10,
  },
  box3: {
    flex: 1,
    backgroundColor: '#FBC02D', // Vàng
  },
  box4: {
    flex: 1,
    backgroundColor: '#388E3C', // Xanh lá
  },
  box5: {
    flex: 1,
    backgroundColor: '#7E57C2', // Tím
  },
  emptyBox: {
    flex: 1, // Ô thừa để trống
  },

  /* Hàng 3 */
  row3: {
    height: 80,
  },
  box6: {
    flex: 1,
    backgroundColor: '#F57C00', // Cam
  },

  /* Form nhập thông tin */
  formContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#37474F',
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 6,
  },
  requiredMark: {
    color: '#E53935',
  },
  input: {
    height: 46,
    borderWidth: 1.5,
    borderColor: '#CFD8DC',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: '#FAFAFA',
    color: '#212121',
  },
  inputError: {
    borderColor: '#E53935',
    backgroundColor: '#FFEBEE',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },

  /* Nút bấm ở bottom-center */
  bottomCenterSection: {
    marginTop: 18,
    alignItems: 'center', // Căn giữa nút bấm theo chiều ngang
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  clickMeButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: 180,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  clickMeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  /* Footer */
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#616161',
  },
});