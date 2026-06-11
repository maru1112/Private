import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMemoStore } from '../store/memoStore';
import { COLORS } from '../constants/colors';

const PRESET_TAGS = ['仕事', '個人', 'アイデア', '学習', '日記', '買い物', '旅行', '健康'];

export default function AddMemoScreen() {
  const router = useRouter();
  const { addMemo } = useMemoStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [savedCount, setSavedCount] = useState(0);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const doSave = useCallback(() => {
    if (!body.trim() && !title.trim()) {
      Alert.alert('エラー', 'タイトルまたは本文を入力してください');
      return false;
    }
    addMemo({ title: title.trim(), body: body.trim(), tags: selectedTags.length > 0 ? selectedTags : undefined });
    return true;
  }, [title, body, selectedTags, addMemo]);

  const handleSave = () => {
    if (doSave()) router.back();
  };

  const handleSaveAndAddAnother = () => {
    if (doSave()) {
      setTitle('');
      setBody('');
      setSelectedTags([]);
      setSavedCount((n) => n + 1);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {savedCount > 0 && (
        <View style={styles.savedBanner}>
          <Text style={styles.savedBannerText}>✅ {savedCount}件保存済み</Text>
        </View>
      )}

      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="タイトル (任意)"
        placeholderTextColor={COLORS.textSecondary}
        autoFocus={savedCount === 0}
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

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.addAnotherBtn} onPress={handleSaveAndAddAnother}>
          <Text style={styles.addAnotherText}>＋ 続けて追加</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>保存して閉じる</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 20, paddingBottom: 40 },
  savedBanner: {
    backgroundColor: COLORS.success + '22',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  savedBannerText: { color: COLORS.success, fontWeight: '700', fontSize: 13 },
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
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 32 },
  addAnotherBtn: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  addAnotherText: { color: COLORS.primary, fontSize: 15, fontWeight: '700' },
  saveBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
