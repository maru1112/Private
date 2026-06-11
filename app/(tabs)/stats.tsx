import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useHabitStore } from '../../store/habitStore';
import { useTaskStore } from '../../store/taskStore';
import DayGrid from '../../components/DayGrid';
import { COLORS } from '../../constants/colors';
import { calculateStreak, calculateBestStreak } from '../../utils/dateHelpers';

export default function StatsScreen() {
  const { habits } = useHabitStore();
  const { tasks } = useTaskStore();

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNum}>{habits.length}</Text>
          <Text style={styles.summaryLabel}>習慣数</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNum}>{completedTasks}</Text>
          <Text style={styles.summaryLabel}>完了タスク</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNum}>{totalTasks - completedTasks}</Text>
          <Text style={styles.summaryLabel}>残タスク</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>習慣の記録</Text>

      {habits.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>習慣を追加すると統計が表示されます</Text>
        </View>
      ) : (
        habits.map((h) => {
          const streak = calculateStreak(h.completions);
          const best = calculateBestStreak(h.completions);
          return (
            <View key={h.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{h.icon}</Text>
                <Text style={styles.cardName}>{h.name}</Text>
              </View>
              <View style={styles.cardStats}>
                <View style={styles.statItem}>
                  <Text style={[styles.statNum, { color: h.color }]}>{streak}</Text>
                  <Text style={styles.statLabel}>現在のストリーク</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNum}>{best}</Text>
                  <Text style={styles.statLabel}>最長ストリーク</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNum}>{h.completions.length}</Text>
                  <Text style={styles.statLabel}>累計達成</Text>
                </View>
              </View>
              <View style={styles.gridWrap}>
                <Text style={styles.gridLabel}>過去7日</Text>
                <DayGrid completions={h.completions} color={h.color} />
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 40 },
  summary: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  summaryNum: { color: COLORS.primary, fontSize: 28, fontWeight: '800' },
  summaryLabel: { color: COLORS.textSecondary, fontSize: 11, marginTop: 4 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700', marginBottom: 14 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center' },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  cardIcon: { fontSize: 22, marginRight: 10 },
  cardName: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  cardStats: { flexDirection: 'row', marginBottom: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { color: COLORS.text, fontSize: 22, fontWeight: '800' },
  statLabel: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2, textAlign: 'center' },
  gridWrap: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  gridLabel: { color: COLORS.textSecondary, fontSize: 12, width: 42 },
});
