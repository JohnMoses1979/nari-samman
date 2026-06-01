import { createRef } from 'react';
import { CommonActions } from '@react-navigation/native';

// Global navigation ref - attached to the NavigationContainer in App.js
export const navigationRef = createRef();

// Navigate to any root-level screen from anywhere in the app
export function navigate(name, params) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}

// Hard-reset the entire navigation stack - used for logout and role changes
export function resetToScreen(name) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: name }] })
    );
  }
}