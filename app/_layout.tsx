import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.text,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-habit"
          options={{
            presentation: 'modal',
            title: '習慣を追加',
            headerStyle: { backgroundColor: COLORS.surface },
            headerTintColor: COLORS.text,
          }}
        />
        <Stack.Screen
          name="add-task"
          options={{
            presentation: 'modal',
            title: 'タスクを追加',
            headerStyle: { backgroundColor: COLORS.surface },
            headerTintColor: COLORS.text,
          }}
        />
        <Stack.Screen
          name="add-memo"
          options={{
            presentation: 'modal',
            title: 'メモを作成',
            headerStyle: { backgroundColor: COLORS.surface },
            headerTintColor: COLORS.text,
          }}
        />
        <Stack.Screen
          name="edit-memo"
          options={{
            title: 'メモを編集',
            headerStyle: { backgroundColor: COLORS.surface },
            headerTintColor: COLORS.text,
          }}
        />
      </Stack>
    </>
  );
}
