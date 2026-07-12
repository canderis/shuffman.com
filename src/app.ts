import { Switcher } from "./PageSwitcher";
import Hamburger from "./Hamburger";
import Animate from "./animate";
import type Background from "./Background";

function boot(): void {
	const hamburger = new Hamburger("nav");

	new Animate();

	let homeLoaded = false;
	let background: Background | undefined;

	const portfolioItemLinks = document.getElementById("portfolio-item-links");
	const portfolioPage = document.getElementById("portfolio-page");
	const aboutPage = document.getElementById("about-page");
	const nav = document.getElementById("nav");
	const homePage = document.getElementById("home-page");

	if (!portfolioItemLinks || !portfolioPage || !aboutPage || !nav || !homePage) {
		throw new Error("Required page elements not found");
	}

	portfolioPage.addEventListener("onTo", () => {
		portfolioItemLinks.classList.add("show");
		nav.classList.add("nav--pages");

		if (homeLoaded && background) background.runAnimate = false;
	});

	portfolioPage.addEventListener("onFrom", () => {
		portfolioItemLinks.classList.remove("show");
		nav.classList.remove("nav--pages");
	});

	aboutPage.addEventListener("onTo", () => {
		nav.classList.add("nav--pages");
		if (homeLoaded && background) background.runAnimate = false;
	});

	aboutPage.addEventListener("onFrom", () => {
		nav.classList.remove("nav--pages");
	});

	homePage.addEventListener("onTo", () => {
		if (window.innerWidth > 1100) hamburger.enableHamburger();
		else hamburger.disableHamburger();

		if (!homeLoaded) {
			homeLoaded = true;
			void import("./Background").then((module) => {
				const BackgroundClass = module.default;
				background = new BackgroundClass("app");
				background.build();
			});
		} else if (background) {
			background.runAnimate = true;
			background.animate();
		}
	});

	homePage.addEventListener("onFrom", () => {
		hamburger.enableHamburger();
	});

	new Switcher();

	const list = document.getElementsByClassName("init");
	let i = 125;
	for (const item of Array.from(list)) {
		const delay = (i += 125);
		window.setTimeout(() => {
			item.classList.remove("init");
		}, delay);
	}

	document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", function (e) {
			e.preventDefault();
			const href = this.getAttribute("href");
			if (!href) return;
			document.querySelector(href)?.scrollIntoView({
				behavior: "smooth",
			});
		});
	});

	let activeLink: Element | null = null;
	const portfolioNavLinkChange: IntersectionObserverCallback = (entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
				if (activeLink) activeLink.classList.remove("-active");

				const id = entry.target.getAttribute("id");
				activeLink = document.querySelector(`[href="#${id}"]`);
				activeLink?.classList.add("-active");
			}
		});
	};

	const observer = new IntersectionObserver(portfolioNavLinkChange, {
		threshold: 0.55,
	});

	portfolioPage.querySelectorAll(".portfolio-item").forEach((page) => {
		observer.observe(page);
	});
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", boot);
} else {
	boot();
}
