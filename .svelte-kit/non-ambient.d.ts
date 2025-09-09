
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
		RouteId(): "/" | "/abstract-machine" | "/aesthetic-research" | "/kitchen" | "/kitchen/cookie-roulette" | "/kitchen/error-oracle" | "/kitchen/primordial-soup" | "/kitchen/scroll-yoga" | "/map" | "/wunschmaschine-pure" | "/wunschmaschine";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/abstract-machine": Record<string, never>;
			"/aesthetic-research": Record<string, never>;
			"/kitchen": Record<string, never>;
			"/kitchen/cookie-roulette": Record<string, never>;
			"/kitchen/error-oracle": Record<string, never>;
			"/kitchen/primordial-soup": Record<string, never>;
			"/kitchen/scroll-yoga": Record<string, never>;
			"/map": Record<string, never>;
			"/wunschmaschine-pure": Record<string, never>;
			"/wunschmaschine": Record<string, never>
		};
		Pathname(): "/" | "/abstract-machine" | "/abstract-machine/" | "/aesthetic-research" | "/aesthetic-research/" | "/kitchen" | "/kitchen/" | "/kitchen/cookie-roulette" | "/kitchen/cookie-roulette/" | "/kitchen/error-oracle" | "/kitchen/error-oracle/" | "/kitchen/primordial-soup" | "/kitchen/primordial-soup/" | "/kitchen/scroll-yoga" | "/kitchen/scroll-yoga/" | "/map" | "/map/" | "/wunschmaschine-pure" | "/wunschmaschine-pure/" | "/wunschmaschine" | "/wunschmaschine/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.svg" | string & {};
	}
}