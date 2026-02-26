import { create } from 'zustand';
import { FilterType } from '../features/tasks/model/Task';

interface TaskUIState {
  filter: FilterType;
  isSyncing: boolean;
  setFilter: (filter: FilterType) => void;
  setIsSyncing: (isSyncing: boolean) => void;
}

// Estado global para la UI de tareas, incluyendo el filtro actual y el estado de sincronización.
export const useTaskStore = create<TaskUIState>(set => ({
  filter: 'all',
  isSyncing: false,
  setFilter: filter => set({ filter }),
  setIsSyncing: isSyncing => set({ isSyncing }),
}));
