import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainComponent from './components/MainComponent';
import { AppProvider } from './components/AppContext';

export default function App() {
  return (
    <AppProvider>
      <MainComponent />
    </AppProvider>
  );
}