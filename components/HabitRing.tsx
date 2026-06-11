import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../constants/colors';

interface Props {
  name: string;
  icon: string;
  color: string;
  done: boolean;
  streak: number;
  onPress: () => void;
}

const SIZE = 72;
const RADIUS = 30;
const STROKE = 4;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function HabitRing({ name, icon, color, done, streak, onPress }: Props) {
  const progress = done ? 1 : 0;
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.ringWrap}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={COLORS.border}
            strokeWidth={STROKE}
            fill="transparent"
          />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={color}
            strokeWidth={STROKE}
            fill="transparent"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
        <View style={styles.iconOverlay}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
      </View>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      {streak > 0 && (
        <Text style={[styles.streak, { color }]}>🔥 {streak}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: 84, marginHorizontal: 6 },
  ringWrap: { position: 'relative', width: SIZE, height: SIZE },
  iconOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 26 },
  name: { color: COLORS.textSecondary, fontSize: 11, marginTop: 4, textAlign: 'center' },
  streak: { fontSize: 11, fontWeight: '600', marginTop: 2 },
});
