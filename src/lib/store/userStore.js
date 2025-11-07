import { create } from "zustand";
import { getCurrentUser } from "../auth";

export const useUserStore = create((set) => ({
  user: null,

  loadUser: async () => {
    const user = await getCurrentUser();
    set({ user });
    return user; // ✅ important so pages can use it
  },

  logoutUser: async () => {
    await logout();
    set({ user: null });
  },
}));
