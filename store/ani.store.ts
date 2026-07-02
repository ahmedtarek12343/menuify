import { create } from "zustand";

interface AniState {
  ani: boolean;
  setAni: (ani: boolean) => void;
}

export const useAniStore = create<AniState>((set) => ({
  ani: true,
  setAni: (ani: boolean) => set({ ani }),
}));
