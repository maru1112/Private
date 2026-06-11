import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { Task } from '../store/taskStore';
import { formatDate } from '../utils/dateHelpers';

const PRIORITY_COLOR = {
  high: '#FF6B6B',
  medium: '#FFB347',
  low: '#4CAF82',
};

interface Props {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasExtra = !!task.notes || (task.tags && task.tags.length > 0);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <TouchableOpacity onPress={onToggle} style={styles.check}>
          <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
            {task.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.info} onPress={() => hasExtra && setExpanded((v) => !v)} activeOpacity={hasExtra ? 0.7 : 1}>
          <Text style={[styles.title, task.completed && styles.titleDone]}>{task.title}</Text>
          <View style={styles.meta}>
            <View style={[styles.dot, { backgroundColor: PRIORITY_COLOR[task.priority] }]} />
            <Text style={styles.metaText}>{task.priority}</Text>
            {task.dueDate && (
              <Text style={styles.metaText}> · {formatDate(task.dueDate)}</Text>
            )}
            {task.tags && task.tags.length > 0 && (
              <Text style={styles.metaText}> · 🏷 {task.tags.length}</Text>
            )}
            {task.notes && <Text style={styles.metaText}> · 📝</Text>}
          </View>
        </TouchableOpacity>
        {hasExtra && (
          <TouchableOpacity onPress={() => setExpanded((v) => !v)} style={styles.expandBtn}>
            <Text style={styles.expandText}>{expanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onDelete} style={styles.del}>
          <Text style={styles.delText}>✕</Text>
        </TouchableOpacity>
      </View>

      {expanded && (
        <View style={styles.extra}>
          {task.tags && task.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {task.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
          {task.notes && (
            <Text style={styles.notes}>{task.notes}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  check: { marginRight: 12 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  checkmark: { color: '#fff', fontSize: 13, fontWeight: '700' },
  info: { flex: 1 },
  title: { color: COLORS.text, fontSize: 15, fontWeight: '500' },
  titleDone: { color: COLORS.textSecondary, textDecorationLine: 'line-through' },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, flexWrap: 'wrap' },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  metaText: { color: COLORS.textSecondary, fontSize: 12 },
  expandBtn: { padding: 4, marginRight: 4 },
  expandText: { color: COLORS.textSecondary, fontSize: 11 },
  del: { padding: 4 },
  delText: { color: COLORS.textSecondary, fontSize: 16 },
  extra: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  tag: {
    backgroundColor: COLORS.primary + '22',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  notes: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 18 },
});
