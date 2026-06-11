import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { todayISO } from '../utils/dateHelpers';
import { isBefore, parseISO } from 'date-fns';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  tags?: string[];
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

interface TaskStore {
  tasks: Task[];
  addTask: (t: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  getTodayTasks: () => Task[];
  getOverdueTasks: () => Task[];
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (t) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { ...t, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, completed: false, createdAt: todayISO() },
          ],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, completed: !t.completed, completedAt: !t.completed ? todayISO() : undefined }
              : t
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      getTodayTasks: () => {
        const today = todayISO();
        return get().tasks.filter((t) => !t.completed && t.dueDate === today);
      },
      getOverdueTasks: () => {
        const today = todayISO();
        return get().tasks.filter(
          (t) => !t.completed && t.dueDate && isBefore(parseISO(t.dueDate), parseISO(today))
        );
      },
    }),
    {
      name: 'task-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
