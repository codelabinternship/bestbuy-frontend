import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

/**
 * Foydalanuvchini /me endpoint orqali olib keladi.
 * Axios instance token’ni headerga qo‘shib yuborishi kerak
 * (login paytida localStorage / cookie’dan olinib).
 */
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      // const res = await api.get("api/api/auth/me/");
      document.title = res.data.market.name;
      function updateFavicon(url) {
        let link =
          document.querySelector("link[rel~='icon']") ||
          document.createElement("link");
        link.rel = "icon";
        link.type = "image/svg+xml";
        link.href = url;
        if (!link.parentNode) {
          document.head.appendChild(link);
        }
      }
      updateFavicon(`http://127.0.0.1:8000${res.data.market.logo}`);
      return res.data;
    },
    // //staleTime: 5 * 60 * 1000,
  });
}
