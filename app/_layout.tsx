import React from 'react'
import { Stack, Tabs } from 'expo-router'
import '@/polyfills'
// Import your global CSS file
import "../global.css";
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const RootLayout = () => {
  return (
    <View className='flex-1'>
      <StatusBar style='dark'/>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

export default RootLayout