<script lang="ts">
  import {jwt} from "../../stores/auth";
  import {darkMode} from "../../stores/theme";
  import {loginWithGoogle} from "../../lib/api/auth/login-with-google";

  interface GoogleResponse {
    credential: string;
  }

  let promise = undefined;
  (window as any).handleCredentialResponse = (google: GoogleResponse) => {
    promise = loginWithGoogle(google.credential);
    promise.then(token => jwt.set(token))
  }
</script>

<svelte:head>
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>

{#if promise === undefined}
  <div id="g_id_onload"
       data-client_id="{import.meta.env.VITE_GOOGLE_CLIENT_ID}"
       data-context="signup"
       data-ux_mode="popup"
       data-callback="handleCredentialResponse"
       data-auto_prompt="false">
  </div>

  <div class="g_id_signin"
       data-type="standard"
       data-shape="pill"
       data-theme="{$darkMode ? 'filled_black' : 'outline'}"
       data-text="signin_with"
       data-size="large"
       data-logo_alignment="left">
  </div>
{:else}
  {#await promise}
    <p>Loading ...</p>
  {:then value}
    <p>You are now logged :)</p>
  {:catch error}
    <p>Something went wrong :( {error.message}</p>
  {/await}
{/if}
