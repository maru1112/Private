import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useHabitStore } from '../../store/habitStore';
import { useTaskStore } from '../../store/taskStore';
import HabitRing from '../../components/HabitRing';
import TaskItem from '../../components/TaskItem';
import { COLORS } from '../../constants/colors';
import { todayISO, formatGreeting, formatDate } from '../../utils/dateHelpers';

export default function TodayScreen() {
  const router = useRouter();
  const { habits, toggleCompletion, getStreak } = useHabitStore();
  const { toggleTask, deleteTask, getTodayTasks, getOverdueTasks } = useTaskStore();

  const today = todayISO();
  const todayTasks = getTodayTasks();
  const overdueTasks = getOverdueTasks();

  const handleHabitPress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleCompletion(id, today);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{formatGreeting()} 👋</Text>
        <Text style={styles.date}>{formatDate(today)}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>今日の習慣</Text>
          <TouchableOpacity onPress={() => router.push('/add-habit')}>
            <Text style={styles.addBtn}>+ 追加</Text>
          </TouchableOpacity>
        </View>
        {habits.length === 0 ? (
          <TouchableOpacity style={styles.empty} onPress={() => router.push('/add-habit')}>
            <Text style={styles.emptyIcon}>✨</Text>
            <Text style={styles.emptyText}>習慣を追加しましょう</Text>
          </TouchableOpacity>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rings}>
            {habits.map((h) => (
              <HabitRing
                key={h.id}
                name={h.name}
                icon={h.icon}
                color={h.color}
                done={h.completions.includes(today)}
                streak={getStreak(h.id)}
                onPress={() => handleHabitPress(h.id)}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {overdueTasks.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.danger }]}>期限切れ</Text>
          {overdueTasks.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              onToggle={() => toggleTask(t.id)}
              onDelete={() => deleteTask(t.id)}
            />
          ))}
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>今日のタスク</Text>
          <TouchableOpacity onPress={() => router.push('/add-task')}>
            <Text style={styles.addBtn}>+ 追加</Text>
          </TouchableOpacity>
        </View>
        {todayTasks.length === 0 ? (
          <TouchableOpacity style={styles.empty} onPress={() => router.push('/add-task')}>
            <Text style={styles.emptyIcon}>🎉</Text>
            <Text style={styles.emptyText}>タスクを追加しましょう</Text>
          </TouchableOpacity>
        ) : (
          todayTasks.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              onToggle={() => toggleTask(t.id)}
              onDelete={() => deleteTask(t.id)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 28 },
  greeting: { color: COLORS.text, fontSize: 26, fontWeight: '700' },
  date: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4 },
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  addBtn: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  rings: { flexDirection: 'row' },
  empty: { backgroundColor: COLORS.surface, borderRadius: 14, padding: 24, alignItems: 'center' },
  emptyIcon: { fontSize: 32, marginBottom: 8 },
  emptyText: { color: COLORS.textSecondary, fontSize: 14 },
});
