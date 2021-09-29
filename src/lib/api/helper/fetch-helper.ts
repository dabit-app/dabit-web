import type {Result} from "ts-results";
import {Err, Ok} from "ts-results";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export type EmptyResponse = null;

export async function fetchApi<T = void, E = void>(
  path: string,
  method: HttpMethod = 'GET',
  content: any = undefined,
  token: string | undefined = undefined
): Promise<Result<T, E>> {
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
      if (!response.ok) {
        let content = await response.text();

        if (content !== "") {
          return Err(JSON.parse(content) as E);
        } else {
          return Err(null);
        }
      }

      if (response.status !== 204) {
        return Ok(await response.json() as T);
      }

      return Ok(null);
    })
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';