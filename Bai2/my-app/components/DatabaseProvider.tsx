// components/DatabaseProvider.tsx (Tạo file mới)
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";

const DATABASE_NAME = "drinks.db";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  await db
    .execAsync(
      `
    -- Bật Write-Ahead Logging để cải thiện hiệu suất
    PRAGMA journal_mode = WAL;

    -- 1. TẠO BẢNG CART_ITEMS
    CREATE TABLE IF NOT EXISTS cart_items (
      drink_id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT,
      quantity INTEGER NOT NULL
    );
    `
    )
    .catch((error) => {
      console.error("Migration failed:", error);
    });
}

interface DatabaseProviderProps {
  children: React.ReactNode;
}

const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  return (
    <SQLiteProvider
      databaseName={DATABASE_NAME}
      onInit={migrateDbIfNeeded}
      // Fallback UI trong khi DB đang khởi tạo (tuỳ chọn)
      fallback={
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
          <Text>Loading Database...</Text>
        </View>
      }
    >
      {children}
    </SQLiteProvider>
  );
};

export default DatabaseProvider;
