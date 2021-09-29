import {fetchApi} from "../helper/fetch-helper";

export async function loginWithGoogle(token: string): Promise<string | null> {
  return await fetchApi<{ token: string }>(
    "auth/google/login",
    "POST",
    {token}
  )
    .then(data => {
      if (data.ok) {
        return data.val.token;
      }

      return null;
    });
}