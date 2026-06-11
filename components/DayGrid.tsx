import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { getLast7Days } from '../utils/dateHelpers';

interface Props {
  completions: string[];
  color: string;
}

export default function DayGrid({ completions, color }: Props) {
  const days = getLast7Days();
  return (
    <View style={styles.row}>
      {days.map((d) => (
        <View
          key={d}
          style={[
            styles.cell,
            completions.includes(d) ? { backgroundColor: color } : null,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4 },
  cell: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
});
