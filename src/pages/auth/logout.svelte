<script>
  import { goto } from '@roxi/routify'
  import { jwt } from "../../stores/auth";

  jwt.set(null);
  $goto('/auth/login')
</script>