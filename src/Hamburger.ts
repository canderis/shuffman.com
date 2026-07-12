class Hamburger {
	widthThreshold: number | undefined;
	navId: string;
	element: HTMLStyleElement;
	hamburger: HTMLDivElement;
	nav: HTMLElement;
	stylesheet: CSSStyleSheet;
	navVisible = false;

	constructor(navId: string, widthThreshold?: number) {
		this.widthThreshold = widthThreshold;
		this.navId = navId;

		this.element = document.createElement("style");
		document.head.appendChild(this.element);

		const nav = document.getElementById(this.navId);
		if (!nav) {
			throw new Error(`Nav element "#${this.navId}" not found`);
		}
		this.nav = nav;

		this.hamburger = document.createElement("div");
		this.nav.append(this.hamburger);
		this.hamburger.setAttribute("id", "hamburger");
		this.hamburger.append(document.createElement("span"));
		this.hamburger.append(document.createElement("span"));
		this.hamburger.append(document.createElement("span"));

		let css = [
			`#hamburger{
				opacity: 1;
				transform: rotate(0);
			}`,
			`#${this.navId}.-show #hamburger{
				transform: rotate(90deg);
			}`,
			`#${this.navId}:not(.-show) ul {
				opacity: 0;
			}`,
			`#${this.navId} ul {
				opacity: 1;
				transition: 1s;
            }`,
			`#hamburger.-hide {
				opacity: 0;
			}`,
		];

		if (this.widthThreshold) {
			css = [
				`@media only screen and (max-width: ${this.widthThreshold}px) {
					${css.join("")}
				}`,
			];
		}

		const stylesheet = this.element.sheet;
		if (!stylesheet) {
			throw new Error("Failed to create hamburger stylesheet");
		}
		this.stylesheet = stylesheet;

		css.forEach((val) => {
			this.stylesheet.insertRule(val);
		});

		this.stylesheet.insertRule(`
			#hamburger {
				display: grid;
				transition: 1s;
				position: fixed;
				cursor: pointer;
				opacity: 0;
				top: 20px;
				left: 20px;
				width: 30px;
				grid-gap: 6px;
				z-index: 9001;
			}`);
		this.stylesheet.insertRule(`
			#hamburger span {
				display: block;
				width: 30px;
				height: 4px;
				background-color: #fffc;
				margin: auto;
				border-radius: 3px;
			}`);

		this.hamburger.addEventListener("click", () => {
			this.toggleNav();
		});
	}

	toggleNav(): void {
		if (!this.navVisible) {
			this.nav.classList.add("-show");
		} else {
			this.nav.classList.remove("-show");
		}
		this.navVisible = !this.navVisible;
	}

	disableHamburger(): void {
		this.navVisible = true;
		this.nav.classList.add("-show");
		this.hamburger.classList.add("-hide");
	}

	enableHamburger(): void {
		this.navVisible = false;
		this.nav.classList.remove("-show");
		this.hamburger.classList.remove("-hide");
	}
}

export default Hamburger;
