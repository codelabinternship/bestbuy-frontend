import { create } from "zustand";
import Cookies from "js-cookie";

export const useAuthStore = create((set) => ({
  user: null,
  token: Cookies.get("token") || null,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    Cookies.set("token", token, { expires: 7 }); // 7 kunlik cookie
    set({ token });
  },
  logout: () => {
    Cookies.remove("token");
    set({ token: null, user: null });
  },
}));
