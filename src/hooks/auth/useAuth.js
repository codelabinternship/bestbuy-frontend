import { useMutation, useQuery, useQueryClient } from "react-query";
import { login, register, getProfile } from "./authApi";
import { useAuthStore } from "./authStore";

export const useLogin = () => {
  const { setToken, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation(login, {
    onSuccess: (data) => {
      setToken(data.access_token);
      setUser(data.user);
      queryClient.invalidateQueries("me");
    },
  });
};

export const useRegister = () => {
  const { setToken, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation(register, {
    onSuccess: (data) => {
      setToken(data.access_token);
      setUser(data.user);
      queryClient.invalidateQueries("me");
    },
  });
};

export const useMe = () => {
  const { token } = useAuthStore();
  return useQuery(["me", token], () => getProfile(token), {
    enabled: !!token,
  });
};
