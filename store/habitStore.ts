import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateStreak, todayISO } from '../utils/dateHelpers';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  completions: string[];
  createdAt: string;
}

interface HabitStore {
  habits: Habit[];
  addHabit: (h: Omit<Habit, 'id' | 'completions' | 'createdAt'>) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (id: string, date: string) => void;
  getStreak: (id: string) => number;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      addHabit: (h) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...h,
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              completions: [],
              createdAt: todayISO(),
            },
          ],
        })),
      deleteHabit: (id) =>
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) })),
      toggleCompletion: (id, date) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            const has = h.completions.includes(date);
            return {
              ...h,
              completions: has
                ? h.completions.filter((d) => d !== date)
                : [...h.completions, date],
            };
          }),
        })),
      getStreak: (id) => {
        const habit = get().habits.find((h) => h.id === id);
        return habit ? calculateStreak(habit.completions) : 0;
      },
    }),
    {
      name: 'habit-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
