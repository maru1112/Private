import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { todayISO } from '../utils/dateHelpers';

export interface Memo {
  id: string;
  title: string;
  body: string;
  tags?: string[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MemoStore {
  memos: Memo[];
  addMemo: (m: Pick<Memo, 'title' | 'body' | 'tags'>) => void;
  updateMemo: (id: string, m: Partial<Pick<Memo, 'title' | 'body' | 'tags'>>) => void;
  deleteMemo: (id: string) => void;
  togglePin: (id: string) => void;
}

export const useMemoStore = create<MemoStore>()(
  persist(
    (set) => ({
      memos: [],
      addMemo: (m) =>
        set((state) => ({
          memos: [
            { ...m, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, pinned: false, createdAt: todayISO(), updatedAt: todayISO() },
            ...state.memos,
          ],
        })),
      updateMemo: (id, m) =>
        set((state) => ({
          memos: state.memos.map((memo) =>
            memo.id === id ? { ...memo, ...m, updatedAt: todayISO() } : memo
          ),
        })),
      deleteMemo: (id) =>
        set((state) => ({ memos: state.memos.filter((m) => m.id !== id) })),
      togglePin: (id) =>
        set((state) => ({
          memos: state.memos.map((m) => (m.id === id ? { ...m, pinned: !m.pinned } : m)),
        })),
    }),
    { name: 'memo-store', storage: createJSONStorage(() => AsyncStorage) }
  )
);
