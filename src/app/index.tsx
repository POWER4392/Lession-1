import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

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
        </View>

        <View style={styles.row3}>
          <View style={[styles.box, styles.box6]}>
            <Text style={styles.numberText}>6</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Trần Đức Mạnh - BIT240148</Text>
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
  gridContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 12,
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  numberText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  darkText: {
    color: '#1A1A1A',
  },

  /* Hàng 1 */
  row1: {
    flexDirection: 'row',
    height: 160,
    gap: 12,
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
    height: 150,
    gap: 12,
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
    flex: 2,
    backgroundColor: '#7E57C2', // Tím
  },

  /* Hàng 3 */
  row3: {
    height: 130,
  },
  box6: {
    flex: 1,
    backgroundColor: '#F57C00', // Cam
  },

  /* Footer */
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
});