import {
  getData,
  setAuthentication,
  setServer,
  setUser,
} from "@/native/config";

export async function useNativeStorage() {
  const authentication = useAuthenticationStore();
  const server = useServerStore();
  const user = useUserStore();
  const data = await getData();

  if (data.authentication) authentication.$patch(data.authentication);
  if (data.server) server.$patch(data.server);
  if (data.user) user.$patch(data.user);

  authentication.$subscribe(() => {
    setAuthentication(authentication.$state);
  });

  server.$subscribe(() => {
    setServer(server.$state);
  });

  user.$subscribe(() => {
    setUser(user.$state);
  });
}
