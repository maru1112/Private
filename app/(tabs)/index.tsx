import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useHabitStore } from '../../store/habitStore';
import { useTaskStore } from '../../store/taskStore';
import { useWishStore } from '../../store/wishStore';
import HabitRing from '../../components/HabitRing';
import TaskItem from '../../components/TaskItem';
import { COLORS } from '../../constants/colors';
import { todayISO, tomorrowISO, formatGreeting, formatDate } from '../../utils/dateHelpers';

export default function TodayScreen() {
  const router = useRouter();
  const { habits, toggleCompletion, getStreak } = useHabitStore();
  const { toggleTask, deleteTask, getTodayTasks, getOverdueTasks } = useTaskStore();
  const [tomorrowOpen, setTomorrowOpen] = useState(false);
  const [wishInput, setWishInput] = useState('');
  const { items: wishItems, addItem, toggleItem, deleteItem } = useWishStore();

  const today = todayISO();
  const tomorrow = tomorrowISO();
  const todayTasks = getTodayTasks();
  const overdueTasks = getOverdueTasks();

  const handleHabitPress = (id: string, date: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleCompletion(id, date);
  };

  const todayDone = habits.filter((h) => h.completions.includes(today)).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{formatGreeting()} 👋</Text>
        <Text style={styles.date}>{formatDate(today)}</Text>
      </View>

      {/* 今日の習慣 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>今日の習慣</Text>
            {habits.length > 0 && (
              <Text style={styles.progress}>{todayDone} / {habits.length} 完了</Text>
            )}
          </View>
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
                onPress={() => handleHabitPress(h.id, today)}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* 期限切れタスク */}
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

      {/* 今日のタスク */}
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

      {/* やりたいこと */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>やりたいこと 🌟</Text>
        <View style={styles.wishInputRow}>
          <TextInput
            style={styles.wishInput}
            value={wishInput}
            onChangeText={setWishInput}
            placeholder="追加する..."
            placeholderTextColor={COLORS.textSecondary}
            onSubmitEditing={() => {
              if (wishInput.trim()) { addItem(wishInput.trim()); setWishInput(''); }
            }}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.wishAddBtn}
            onPress={() => {
              if (wishInput.trim()) { addItem(wishInput.trim()); setWishInput(''); }
            }}
          >
            <Text style={styles.wishAddBtnText}>追加</Text>
          </TouchableOpacity>
        </View>
        {wishItems.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🌟</Text>
            <Text style={styles.emptyText}>やりたいことを追加しましょう</Text>
          </View>
        ) : (
          wishItems.map((item) => (
            <View key={item.id} style={styles.wishRow}>
              <TouchableOpacity onPress={() => toggleItem(item.id)} style={styles.wishCheck}>
                <View style={[styles.wishCheckbox, item.done && styles.wishCheckboxDone]}>
                  {item.done && <Text style={styles.wishCheckmark}>✓</Text>}
                </View>
              </TouchableOpacity>
              <Text style={[styles.wishText, item.done && styles.wishTextDone]}>{item.text}</Text>
              <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.wishDel}>
                <Text style={styles.wishDelText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* 明日の習慣 */}
      {habits.length > 0 && (
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setTomorrowOpen((v) => !v)}
            activeOpacity={0.7}
          >
            <View>
              <Text style={styles.sectionTitle}>明日の習慣 🌙</Text>
              <Text style={styles.progress}>{formatDate(tomorrow)}</Text>
            </View>
            <Text style={styles.chevron}>{tomorrowOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {tomorrowOpen && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rings}>
              {habits.map((h) => (
                <HabitRing
                  key={h.id}
                  name={h.name}
                  icon={h.icon}
                  color={h.completions.includes(tomorrow) ? h.color : COLORS.border}
                  done={h.completions.includes(tomorrow)}
                  streak={getStreak(h.id)}
                  onPress={() => handleHabitPress(h.id, tomorrow)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      )}
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
  progress: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  addBtn: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  chevron: { color: COLORS.textSecondary, fontSize: 14 },
  rings: { flexDirection: 'row' },
  empty: { backgroundColor: COLORS.surface, borderRadius: 14, padding: 24, alignItems: 'center' },
  emptyIcon: { fontSize: 32, marginBottom: 8 },
  emptyText: { color: COLORS.textSecondary, fontSize: 14 },
  wishInputRow: { flexDirection: 'row', gap: 8, marginBottom: 12, marginTop: 12 },
  wishInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    color: COLORS.text,
    fontSize: 15,
  },
  wishAddBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  wishAddBtnText: { color: '#fff', fontWeight: '700' },
  wishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  wishCheck: { marginRight: 12 },
  wishCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishCheckboxDone: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  wishCheckmark: { color: '#fff', fontSize: 13, fontWeight: '700' },
  wishText: { flex: 1, color: COLORS.text, fontSize: 15 },
  wishTextDone: { color: COLORS.textSecondary, textDecorationLine: 'line-through' },
  wishDel: { padding: 4 },
  wishDelText: { color: COLORS.textSecondary, fontSize: 14 },
});
