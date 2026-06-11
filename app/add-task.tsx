import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTaskStore, Task } from '../store/taskStore';
import { COLORS } from '../constants/colors';
import { todayISO } from '../utils/dateHelpers';

const PRIORITIES: Task['priority'][] = ['low', 'medium', 'high'];
const PRIORITY_LABEL = { low: '低', medium: '中', high: '高' };
const PRIORITY_COLOR = { low: '#4CAF82', medium: '#FFB347', high: '#FF6B6B' };

const PRESET_TAGS = ['仕事', '個人', '買い物', '健康', '学習', '家事', '緊急', 'アイデア'];

export default function AddTaskScreen() {
  const router = useRouter();
  const { addTask } = useTaskStore();

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [hasDue, setHasDue] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    const t = customTag.trim();
    if (t && !selectedTags.includes(t)) {
      setSelectedTags((prev) => [...prev, t]);
    }
    setCustomTag('');
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('エラー', 'タイトルを入力してください');
      return;
    }
    addTask({
      title: title.trim(),
      notes: notes.trim() || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      priority,
      dueDate: hasDue ? todayISO() : undefined,
    });
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>タイトル</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="タスクを入力"
        placeholderTextColor={COLORS.textSecondary}
        autoFocus
      />

      <Text style={styles.label}>メモ</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        value={notes}
        onChangeText={setNotes}
        placeholder="詳細や備考を入力 (任意)"
        placeholderTextColor={COLORS.textSecondary}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      <Text style={styles.label}>タグ</Text>
      <View style={styles.tagsWrap}>
        {PRESET_TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, selectedTags.includes(tag) && styles.tagActive]}
            onPress={() => toggleTag(tag)}
          >
            <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextActive]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.customTagRow}>
        <TextInput
          style={[styles.input, styles.customTagInput]}
          value={customTag}
          onChangeText={setCustomTag}
          placeholder="カスタムタグ"
          placeholderTextColor={COLORS.textSecondary}
          onSubmitEditing={addCustomTag}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addTagBtn} onPress={addCustomTag}>
          <Text style={styles.addTagBtnText}>追加</Text>
        </TouchableOpacity>
      </View>
      {selectedTags.length > 0 && (
        <View style={styles.selectedTagsWrap}>
          {selectedTags.map((tag) => (
            <TouchableOpacity key={tag} style={styles.selectedTag} onPress={() => toggleTag(tag)}>
              <Text style={styles.selectedTagText}>{tag} ✕</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>優先度</Text>
      <View style={styles.row}>
        {PRIORITIES.map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.priorityBtn,
              priority === p && { backgroundColor: PRIORITY_COLOR[p] + '33', borderColor: PRIORITY_COLOR[p] },
            ]}
            onPress={() => setPriority(p)}
          >
            <Text style={[styles.priorityText, priority === p && { color: PRIORITY_COLOR[p] }]}>
              {PRIORITY_LABEL[p]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>期日</Text>
      <TouchableOpacity
        style={[styles.toggleBtn, hasDue && styles.toggleBtnActive]}
        onPress={() => setHasDue(!hasDue)}
      >
        <Text style={[styles.toggleText, hasDue && styles.toggleTextActive]}>
          {hasDue ? '📅 今日' : '期日なし'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>保存</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 24, paddingBottom: 40 },
  label: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 10, marginTop: 20 },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    color: COLORS.text,
    fontSize: 16,
  },
  notesInput: { minHeight: 80, paddingTop: 14 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagActive: { backgroundColor: COLORS.primary + '22', borderColor: COLORS.primary },
  tagText: { color: COLORS.textSecondary, fontSize: 13 },
  tagTextActive: { color: COLORS.primary, fontWeight: '600' },
  customTagRow: { flexDirection: 'row', gap: 8 },
  customTagInput: { flex: 1 },
  addTagBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addTagBtnText: { color: '#fff', fontWeight: '600' },
  selectedTagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  selectedTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  selectedTagText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 10 },
  priorityBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    alignItems: 'center',
  },
  priorityText: { color: COLORS.textSecondary, fontWeight: '600' },
  toggleBtn: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleBtnActive: { borderColor: COLORS.primary },
  toggleText: { color: COLORS.textSecondary, fontWeight: '600' },
  toggleTextActive: { color: COLORS.primary },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
