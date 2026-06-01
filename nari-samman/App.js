import 'react-native-gesture-handler';
import React, { useCallback, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import { navigationRef } from './src/navigation/NavigationService';
import { setupAutoTranslation } from './src/autoTranslation/setupAutoTranslation';
import AIAssistantFAB from './src/components/AIAssistantFAB';

setupAutoTranslation();

const HIDDEN_ROUTES = new Set([
  'Splash',
  'Onboarding',
  'RoleSelect',
  'ConsumerLogin',
  'SHGLogin',
  'AdminLogin',
  'SHGPendingApproval',
  'ForgotPassword',
  'LanguageSelect',
  'VendorStack',
  'AdminStack',
  'AIAssistant',
]);

function shouldShowAssistantFab(routeName) {
  return Boolean(routeName && !HIDDEN_ROUTES.has(routeName));
}

export default function App() {
  const [currentRouteName, setCurrentRouteName] = useState('Splash');

  const syncRouteName = useCallback(() => {
    const rootState = navigationRef.current?.getRootState?.();
    const rootRoute = rootState?.routes?.[rootState?.index ?? 0];
    setCurrentRouteName(rootRoute?.name || 'Splash');
  }, []);

  return (
    <View style={styles.root}>
      <NavigationContainer ref={navigationRef} onReady={syncRouteName} onStateChange={syncRouteName}>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>

      {shouldShowAssistantFab(currentRouteName) ? (
        <AIAssistantFAB onPress={() => navigationRef.current?.navigate('AIAssistant')} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
});
