export class Animate {
	element!: HTMLStyleElement;
	stylesheet!: CSSStyleSheet;

	constructor() {
		this.buildStylesheet();
		document.querySelectorAll("[c-animate]").forEach((el) => {
			const delay = el.getAttribute("c-animate-delay") || "0";
			const duration = el.getAttribute("c-animate-duration") || "500";
			const style = `animation-delay: ${delay}ms; animation-duration: ${duration}ms;`;

			el.setAttribute("style", style);
			el.classList.add("c-animation--init");

			const observer = this.observerFactory(el);
			observer.observe(el);
		});
	}

	observerFactory(el: Element): IntersectionObserver {
		const threshold = el.getAttribute("c-threshold") || "0";

		const callback: IntersectionObserverCallback = (entries, observer) => {
			entries.forEach((entry) => {
				if (
					entry.isIntersecting &&
					entry.intersectionRatio >= Number(threshold)
				) {
					const src = entry.target.getAttribute("c-animate-src");
					if (src) {
						entry.target.setAttribute("src", src);
					}
					entry.target.classList.add("c-animation");
					observer.disconnect();
				}
			});
		};
		const params: IntersectionObserverInit = {
			threshold: parseFloat(threshold) / 100,
			rootMargin: "30px",
		};
		return new IntersectionObserver(callback, params);
	}

	buildStylesheet(): void {
		this.element = document.createElement("style");
		document.head.appendChild(this.element);
		const stylesheet = this.element.sheet;
		if (!stylesheet) {
			throw new Error("Failed to create animation stylesheet");
		}
		this.stylesheet = stylesheet;

		this.stylesheet.insertRule(`
			.c-animation--init {
				opacity: 0;
			}`);
		this.stylesheet.insertRule(`
			.c-animation {
				opacity: 0;
				animation-fill-mode: forwards;
				animation-timing-function: ease;
				animation-duration: 500ms;
			}`);
		this.stylesheet.insertRule(`
			.c-animation[c-animate-dir="up"] {
				animation-name: c-animation-up;
			}`);

		this.stylesheet.insertRule(`
			.c-animation[c-animate-dir="down"] {
				animation-name: c-animation-down;
			}`);
		this.stylesheet.insertRule(`
			.c-animation[c-animate-dir="right"] {
				animation-name: c-animation-right;
			}`);
		this.stylesheet.insertRule(`
			.c-animation[c-animate-dir="left"] {
				animation-name: c-animation-left;
			}`);
		this.stylesheet.insertRule(`
			@keyframes c-animation-up {
				0% {
					transform: translateY(50%);
				}
				100% {
					opacity: 1;
				}
			}`);
		this.stylesheet.insertRule(`
			@keyframes c-animation-down {
				0% {
					transform: translateY(50%);
				}
				100% {
					opacity: 1;
				}
			}`);
		this.stylesheet.insertRule(`
			@keyframes c-animation-right {
				0% {
					transform: translateX(50%);
				}
				100% {
					opacity: 1;
				}
			}`);
		this.stylesheet.insertRule(`
			@keyframes c-animation-left {
				0% {
					transform: translateX(-50%);
				}
				100% {
					opacity: 1;
				}
			}`);
	}
}

export default Animate;
