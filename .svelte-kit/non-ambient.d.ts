
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/kitchen" | "/kitchen/cookie-roulette" | "/kitchen/error-oracle" | "/kitchen/primordial-soup" | "/kitchen/scroll-yoga" | "/map";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/kitchen": Record<string, never>;
			"/kitchen/cookie-roulette": Record<string, never>;
			"/kitchen/error-oracle": Record<string, never>;
			"/kitchen/primordial-soup": Record<string, never>;
			"/kitchen/scroll-yoga": Record<string, never>;
			"/map": Record<string, never>
		};
		Pathname(): "/" | "/kitchen" | "/kitchen/" | "/kitchen/cookie-roulette" | "/kitchen/cookie-roulette/" | "/kitchen/error-oracle" | "/kitchen/error-oracle/" | "/kitchen/primordial-soup" | "/kitchen/primordial-soup/" | "/kitchen/scroll-yoga" | "/kitchen/scroll-yoga/" | "/map" | "/map/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.svg" | string & {};
	}
}