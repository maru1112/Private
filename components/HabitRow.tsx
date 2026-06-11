import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { getLast7Days, calculateStreak } from '../utils/dateHelpers';
import { Habit } from '../store/habitStore';

interface Props {
  habit: Habit;
  onDelete: () => void;
}

export default function HabitRow({ habit, onDelete }: Props) {
  const last7 = getLast7Days();
  const streak = calculateStreak(habit.completions);

  return (
    <View style={styles.row}>
      <Text style={styles.icon}>{habit.icon}</Text>
      <View style={styles.info}>
        <Text style={styles.name}>{habit.name}</Text>
        <View style={styles.dots}>
          {last7.map((d) => (
            <View
              key={d}
              style={[
                styles.dot,
                habit.completions.includes(d) && { backgroundColor: habit.color },
              ]}
            />
          ))}
        </View>
      </View>
      {streak > 0 && (
        <View style={[styles.badge, { borderColor: habit.color }]}>
          <Text style={[styles.badgeText, { color: habit.color }]}>🔥{streak}</Text>
        </View>
      )}
      <TouchableOpacity onPress={onDelete} style={styles.del}>
        <Text style={styles.delText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  icon: { fontSize: 24, marginRight: 12 },
  info: { flex: 1 },
  name: { color: COLORS.text, fontSize: 15, fontWeight: '600', marginBottom: 6 },
  dots: { flexDirection: 'row', gap: 4 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 8,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  del: { padding: 4 },
  delText: { color: COLORS.textSecondary, fontSize: 16 },
});
