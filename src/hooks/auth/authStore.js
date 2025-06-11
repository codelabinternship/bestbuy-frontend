import { create } from "zustand";
import Cookies from "js-cookie";

export const useAuthStore = create((set) => ({
  user: null,
  token: Cookies.get("token") || localStorage.getItem("token"),
  setUser: (user) => set({ user }),
  setToken: (token) => {
    Cookies.set("token", token, { expires: 20 }); // 20 kunlik cookie
    set({ token });
  },
  logout: () => {
    Cookies.remove("token");
    set({ token: null, user: null });
  },
}));
