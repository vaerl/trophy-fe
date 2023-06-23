<script lang="ts">
  import { login } from '../lib/auth';
  import { isEnterKeyEvent } from '../lib/util';

  let username: string = '',
    password: string = '';

  function handleKeydown(event: KeyboardEvent) {
    // login on enter
    if (isEnterKeyEvent(event)) {
      login(username, password);
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="flex flex-row  h-full items-center">
  <div class="flex flex-col w-1/3 m-auto gap-2">
    <h1 class="text-4xl text-center">Anmelden</h1>
    <input
      class="input input-bordered"
      placeholder="Benutzername"
      bind:value={username}
      type="text"
    />
    <input
      class="input input-bordered"
      placeholder="Passwort"
      bind:value={password}
      type="password"
    />
    <button class="btn" on:click={() => login(username, password)}>login</button
    >
  </div>
</div>
