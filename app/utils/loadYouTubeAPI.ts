let isYouTubeAPILoaded = false;
let isYouTubeAPILoading = false;
let resolveQueue: (() => void)[] = [];

export const loadYouTubeAPI = (): Promise<void> => {
	return new Promise<void>((resolve) => {
		if (isYouTubeAPILoaded) {
			resolve();
			return;
		}

		if (isYouTubeAPILoading) {
			resolveQueue.push(resolve);
			return;
		}

		isYouTubeAPILoading = true;
		resolveQueue.push(resolve);

		const tag = document.createElement("script");
		tag.src = "https://www.youtube.com/iframe_api";
		tag.async = true;
		document.body.appendChild(tag);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).onYouTubeIframeAPIReady = () => {
			isYouTubeAPILoaded = true;
			isYouTubeAPILoading = false;
			for (const cb of resolveQueue) {
				cb();
			}
			resolveQueue = [];
		};
	});
};
