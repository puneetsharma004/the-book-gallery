import { create } from "zustand";
import { getCurrentUser } from "../auth";
import { supabase } from "../supabase";

export const useUserStore = create((set) => ({
  user: null,
  loading: false,

  loadUser: async () => {
    set({ loading: true });
    try {
      const user = await getCurrentUser();
      set({ user, loading: false });
      return user;
    } catch (error) {
      set({ user: null, loading: false });
      throw error;
    }
  },

  logoutUser: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
}));
