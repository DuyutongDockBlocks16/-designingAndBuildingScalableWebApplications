
<script>
    import { userUuid } from "../stores/stores.js";

    export let assignments_completed;
  
</script>
  
<nav>
    <span id="assignments_completed">Assignments completed: {assignments_completed}/3</span>
    <span>User id: {$userUuid}</span>
</nav>
  
<style>
    nav {
      @apply p-1 mb-1 bg-purple-500 w-full flex justify-between items-center;
    }
  
    span {
      @apply text-lg text-white font-mono; 
    }

    #assignments_completed {
      @apply text-lg font-bold; /* 保持字体大小一致，并加粗 */
    }
</style>