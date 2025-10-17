import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name='listTask' options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name='addTask' options={{headerShown: false}}></Stack.Screen>
    </Stack>
  );
}
