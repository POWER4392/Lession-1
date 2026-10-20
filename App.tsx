import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { LanguageProvider } from './src/localization/BIT240148_LanguageContext';
import { BIT240148_DishListScreen } from './src/screens/BIT240148_DishListScreen';
import { BIT240148_DishDetailScreen } from './src/screens/BIT240148_DishDetailScreen';
import { BIT240148_DishFormScreen } from './src/screens/BIT240148_DishFormScreen';
import { BIT240148_CategoryScreen } from './src/screens/BIT240148_CategoryScreen';
import { BIT240148_FilterCriteria, defaultFilterCriteria } from './src/models/BIT240148_FilterCriteria';

type Screen =
  | { name: 'LIST' }
  | { name: 'DETAIL'; dishId: number }
  | { name: 'FORM'; dishId: number }
  | { name: 'CATEGORIES' };

export default function App() {
  const [backStack, setBackStack] = useState<Screen[]>([{ name: 'LIST' }]);
  // Duy trì bộ lọc & sắp xếp khi chuyển đổi giữa các màn hình (Yêu cầu 4.2)
  const [criteria, setCriteria] = useState<BIT240148_FilterCriteria>(defaultFilterCriteria);

  const currentScreen = backStack[backStack.length - 1] || { name: 'LIST' };

  const pushScreen = (screen: Screen) => {
    setBackStack(prev => [...prev, screen]);
  };

  const goBack = () => {
    if (backStack.length > 1) {
      setBackStack(prev => prev.slice(0, prev.length - 1));
    }
  };

  return (
    <LanguageProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        {currentScreen.name === 'LIST' && (
          <BIT240148_DishListScreen
            onSelectDish={dishId => pushScreen({ name: 'DETAIL', dishId })}
            onAddDish={() => pushScreen({ name: 'FORM', dishId: 0 })}
            onEditDish={dishId => pushScreen({ name: 'FORM', dishId })}
            onManageCategories={() => pushScreen({ name: 'CATEGORIES' })}
            criteria={criteria}
            setCriteria={setCriteria}
          />
        )}

        {currentScreen.name === 'DETAIL' && (
          <BIT240148_DishDetailScreen
            dishId={currentScreen.dishId}
            onGoBack={goBack}
            onEditDish={dishId => pushScreen({ name: 'FORM', dishId })}
          />
        )}

        {currentScreen.name === 'FORM' && (
          <BIT240148_DishFormScreen
            dishId={currentScreen.dishId}
            onGoBack={goBack}
          />
        )}

        {currentScreen.name === 'CATEGORIES' && (
          <BIT240148_CategoryScreen onGoBack={goBack} />
        )}
      </SafeAreaView>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) : 0
  }
});
