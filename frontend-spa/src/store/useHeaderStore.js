import { create } from 'zustand';

export const useHeaderStore = create((set) => ({
  title: null,
  subtitle: null,
  leftComponent: null,
  setHeader: (title, subtitle, leftComponent = null) => set({ title, subtitle, leftComponent }),
  clearHeader: () => set({ title: null, subtitle: null, leftComponent: null }),
}));
