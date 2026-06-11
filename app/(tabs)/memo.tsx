import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useMemoStore } from '../../store/memoStore';
import { COLORS } from '../../constants/colors';
import { formatDate } from '../../utils/dateHelpers';

export default function MemoScreen() {
  const router = useRouter();
  const { memos, deleteMemo, togglePin } = useMemoStore();
  const [search, setSearch] = useState('');

  const filtered = memos
    .filter((m) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return m.title.toLowerCase().includes(q) || m.body.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt.localeCompare(a.updatedAt);
    });

  return (
    <View style={styles.container}>
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="🔍 メモを検索"
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>メモがありません</Text>
            <Text style={styles.emptyHint}>下の + ボタンから作成しましょう</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, item.pinned && styles.cardPinned]}
            onPress={() => router.push({ pathname: '/edit-memo', params: { id: item.id } })}
            activeOpacity={0.75}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.pinned ? '📌 ' : ''}{item.title || '無題'}
              </Text>
              <TouchableOpacity onPress={() => togglePin(item.id)} style={styles.pinBtn}>
                <Text style={styles.pinBtnText}>{item.pinned ? '📌' : '•••'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.cardBody} numberOfLines={2}>{item.body}</Text>
            {item.tags && item.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {item.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
            <View style={styles.cardFooter}>
              <Text style={styles.date}>{formatDate(item.updatedAt)}</Text>
              <TouchableOpacity onPress={() => deleteMemo(item.id)}>
                <Text style={styles.delText}>削除</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/add-memo')}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchWrap: { padding: 16, paddingBottom: 8 },
  search: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    color: COLORS.text,
    fontSize: 15,
  },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: COLORS.text, fontSize: 18, fontWeight: '600', marginBottom: 6 },
  emptyHint: { color: COLORS.textSecondary, fontSize: 14 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  cardPinned: { borderLeftWidth: 3, borderLeftColor: COLORS.primary },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', flex: 1 },
  pinBtn: { padding: 4 },
  pinBtnText: { fontSize: 14, color: COLORS.textSecondary },
  cardBody: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 18, marginBottom: 8 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  tag: { backgroundColor: COLORS.primary + '22', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  tagText: { color: COLORS.primary, fontSize: 11, fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { color: COLORS.textSecondary, fontSize: 11 },
  delText: { color: COLORS.danger, fontSize: 12 },
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
