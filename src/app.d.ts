// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Auth } from 'firebase/auth';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: Auth;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
