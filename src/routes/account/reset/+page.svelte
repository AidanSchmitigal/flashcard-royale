<!-- src/routes/account/reset/+page.svelte -->
<script lang="ts">
    import { auth } from '$lib/client/firebase';
    import { sendPasswordResetEmail } from 'firebase/auth';
    import { onMount } from 'svelte';
    
    let email = '';
    let message = '';
    let error = '';
    let clicked = false;
    let working = false;
  
    async function handleReset() {
      clicked = true;
      working = true;
      console.log('Attempting reset for:', email); // DEBUG

      try {
        await sendPasswordResetEmail(auth, email);
        console.log('Password reset email sent'); // DEBUG
        message = 'Password reset email sent! Check your inbox.';
        error = '';
      } catch (err: any) {
        console.error('Error sending reset email:', err); // DEBUG
        error = err.message;
        message = '';
      }

      working = false;
    }
  </script>
  
  <div class="flex h-screen items-center justify-center bg-gray-50">
    <div class="max-w-md w-full bg-white p-8 rounded shadow">
      <h1 class="text-2xl font-bold text-blue-900 mb-4">Reset Your Password</h1>
      <input
        type="email"
        bind:value={email}
        placeholder="Enter your email"
        class="w-full border border-gray-300 p-2 rounded mb-4"
      />
      <button
        on:click={handleReset}
        disabled={working}
        class="w-full py-2 rounded"
        class:bg-blue-600={!clicked}
        class:bg-gray-400={clicked}
      >
        {#if working}
          Working...
        {:else}
          Send Reset Email
        {/if}
      </button>
  
      {#if message}
        <p class="mt-4 text-green-600">{message}</p>
      {/if}
      {#if error}
        <p class="mt-4 text-red-600">{error}</p>
      {/if}
    </div>
  </div>
  