import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useHabitStore } from '../../store/habitStore';
import HabitRow from '../../components/HabitRow';
import { COLORS } from '../../constants/colors';

export default function HabitsScreen() {
  const router = useRouter();
  const { habits, deleteHabit } = useHabitStore();

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyText}>まだ習慣がありません</Text>
            <Text style={styles.emptyHint}>下の + ボタンから追加しましょう</Text>
          </View>
        }
        renderItem={({ item }) => (
          <HabitRow habit={item} onDelete={() => deleteHabit(item.id)} />
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/add-habit')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 20, paddingBottom: 100 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: COLORS.text, fontSize: 18, fontWeight: '600', marginBottom: 6 },
  emptyHint: { color: COLORS.textSecondary, fontSize: 14 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
});
