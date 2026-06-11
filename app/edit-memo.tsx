import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMemoStore } from '../store/memoStore';
import { COLORS } from '../constants/colors';

const PRESET_TAGS = ['仕事', '個人', 'アイデア', '学習', '日記', '買い物', '旅行', '健康'];

export default function EditMemoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { memos, updateMemo } = useMemoStore();
  const memo = memos.find((m) => m.id === id);

  const [title, setTitle] = useState(memo?.title ?? '');
  const [body, setBody] = useState(memo?.body ?? '');
  const [selectedTags, setSelectedTags] = useState<string[]>(memo?.tags ?? []);

  if (!memo) {
    return (
      <View style={styles.container}>
        <Text style={{ color: COLORS.text, padding: 20 }}>メモが見つかりません</Text>
      </View>
    );
  }

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const handleSave = () => {
    updateMemo(id, { title: title.trim(), body: body.trim(), tags: selectedTags.length > 0 ? selectedTags : undefined });
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="タイトル (任意)"
        placeholderTextColor={COLORS.textSecondary}
        autoFocus
      />
      <TextInput
        style={styles.bodyInput}
        value={body}
        onChangeText={setBody}
        placeholder="メモを入力…"
        placeholderTextColor={COLORS.textSecondary}
        multiline
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
            <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextActive]}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>保存</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 20, paddingBottom: 40 },
  titleInput: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 12,
    marginBottom: 16,
  },
  bodyInput: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 200,
  },
  label: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 10, marginTop: 24 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
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
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
