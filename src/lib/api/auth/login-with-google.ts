import {fetchApi} from "../helper/fetch-helper";

export async function loginWithGoogle(token: string): Promise<string> {
  return await fetchApi<{ token: string }>(
    "auth/google/login",
    "POST",
    {token}
  )
    .then(data => data.token);
}