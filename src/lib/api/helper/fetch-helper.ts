const API_URL = import.meta.env.VITE_API_BASE_URL;

export type EmptyResponse = null;

export async function fetchApi<T>(
  path: string,
  method: HttpMethod = 'GET',
  content: any = undefined,
  token: string | undefined = undefined
): Promise<T> {
  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  if (token !== undefined)
    headers['Authorization'] = `Bearer ${token}`;

  return await fetch(API_URL + path, {
    method: method,
    body: JSON.stringify(content),
    headers: headers,
  })
    .then(async response => {
      if (!response.ok)
        throw new Error(response.statusText)

      if (response.status !== 204)
        return await response.json() as T;
      return null;
    })
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';