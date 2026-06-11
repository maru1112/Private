import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useHabitStore } from '../store/habitStore';
import { COLORS, HABIT_COLORS, HABIT_ICONS } from '../constants/colors';

export default function AddHabitScreen() {
  const router = useRouter();
  const { addHabit } = useHabitStore();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState(HABIT_ICONS[0]);
  const [color, setColor] = useState(HABIT_COLORS[0]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('エラー', '習慣名を入力してください');
      return;
    }
    addHabit({ name: name.trim(), icon, color });
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>習慣名</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="例: 水を飲む"
        placeholderTextColor={COLORS.textSecondary}
        autoFocus
      />

      <Text style={styles.label}>アイコン</Text>
      <View style={styles.grid}>
        {HABIT_ICONS.map((ic) => (
          <TouchableOpacity
            key={ic}
            style={[styles.iconBtn, icon === ic && styles.iconBtnActive]}
            onPress={() => setIcon(ic)}
          >
            <Text style={styles.iconText}>{ic}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>カラー</Text>
      <View style={styles.colorRow}>
        {HABIT_COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotActive]}
            onPress={() => setColor(c)}
          />
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
  content: { padding: 24, paddingBottom: 40 },
  label: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 10, marginTop: 20 },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    color: COLORS.text,
    fontSize: 16,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: { backgroundColor: COLORS.primary + '44', borderWidth: 2, borderColor: COLORS.primary },
  iconText: { fontSize: 24 },
  colorRow: { flexDirection: 'row', gap: 12 },
  colorDot: { width: 36, height: 36, borderRadius: 18 },
  colorDotActive: { borderWidth: 3, borderColor: '#fff' },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
