// app/_layout.tsx (hoặc file layout gốc của bạn)

import React from "react";
import { Stack } from "expo-router";
// 1. Chỉ cần import component Wrapper
import DatabaseProvider from "../../components/DatabaseProvider";

// Lưu ý: Không cần import SQLiteDatabase, SQLiteProvider, migrateDbIfNeeded, hay DATABASE_NAME ở đây nữa

export default function TabLayout() {
  return (
    // 2. Sử dụng component Wrapper đã tách
    <DatabaseProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: "home", headerShown: false }}
        />
        <Stack.Screen
          name="shop"
          options={{ title: "Shops Near Me", headerShown: true }}
        />
        <Stack.Screen
          name="drinks"
          options={{ title: "Drinks", headerShown: true }}
        />
        <Stack.Screen
          name="order"
          options={{ title: "Your orders", headerShown: true }}
        />
      </Stack>
    </DatabaseProvider>
  );
}
