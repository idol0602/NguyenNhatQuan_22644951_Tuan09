import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import React from "react";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  await db
    .execAsync(
      `
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' -- Thêm status với giá trị mặc định
    );

    -- Nếu bảng đã tồn tại nhưng chưa có cột status, thêm thủ công (tránh lỗi khi chạy lại)
    ALTER TABLE jobs ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
  `
    )
    .catch(() => {
      // Nếu cột đã tồn tại thì ALTER TABLE sẽ báo lỗi -> bắt lỗi để tránh crash
    });
}

export default function TabLayout() {
  return (
    <SQLiteProvider databaseName="jobs.db" onInit={migrateDbIfNeeded}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="listTask" options={{ headerShown: false }} />
        <Stack.Screen name="addTask" options={{ headerShown: false }} />
      </Stack>
    </SQLiteProvider>
  );
}
