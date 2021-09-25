import {get} from "svelte/store";
import jwtDecode from "jwt-decode";

export function logoutIfTokenExpired(jwt) {
  if (hasTokenExpired(jwt)) {
    jwt.set(null)
  }
}

function hasTokenExpired(jwt): boolean {
  try {
    const decoded: { exp: number } = jwtDecode(get(jwt))
    return decoded.exp <= Date.now() / 1000;
  } catch (e) {
    return false;
  }
}
