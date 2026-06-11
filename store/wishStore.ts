import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { todayISO } from '../utils/dateHelpers';

export interface WishItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
}

interface WishStore {
  items: WishItem[];
  addItem: (text: string) => void;
  toggleItem: (id: string) => void;
  deleteItem: (id: string) => void;
}

export const useWishStore = create<WishStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (text) =>
        set((state) => ({
          items: [
            ...state.items,
            { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text, done: false, createdAt: todayISO() },
          ],
        })),
      toggleItem: (id) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
        })),
      deleteItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
    }),
    { name: 'wish-store', storage: createJSONStorage(() => AsyncStorage) }
  )
);
