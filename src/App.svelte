<script lang="ts">
  import {Router} from "@roxi/routify";
  import {routes} from "../.routify/routes";

  import {jwt} from "./stores/auth";
  import {darkMode} from "./stores/theme";

  jwt.useLocalStorage();
  darkMode.useLocalStorage();

  $: {
    if ($darkMode)
      document.documentElement.classList.add('dark')
    else
      document.documentElement.classList.remove('dark')
  }
</script>

<Router {routes}/>