("use strict");

import { Switcher } from "./PageSwitcher.js";
import Background from "./Background.js";
import Hamburger from "./Hamburger.js";

document.addEventListener("DOMContentLoaded", () => {
	const background = new Background("app");
	background.build();

	const portfolioItemLinks = document.getElementById("portfolio-item-links");
	const portfolioPage = document.getElementById("portfolio-page");

	portfolioPage.addEventListener("onTo", $event => {
		portfolioItemLinks.classList.add("show");
	});

	portfolioPage.addEventListener("onFrom", $event => {
		portfolioItemLinks.classList.remove("show");
	});

	const homePage = document.getElementById("home-page");

	homePage.addEventListener("onFrom", $event => {
		background.runAnimate = false;
	});

	homePage.addEventListener("onTo", $event => {
		background.runAnimate = true;
	});

	new Switcher();
	const hamburger = new Hamburger("nav", 1100);

	const list = document.getElementsByClassName("init");
	let i = 125;
	(() => {
		for (const item of list) {
			const int = setInterval(() => {
				item.classList.remove("init");
				clearInterval(int);
			}, (i += 125));
		}
	})();

	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener("click", function(e) {
			e.preventDefault();

			document.querySelector(this.getAttribute("href")).scrollIntoView({
				behavior: "smooth"
			});
		});
	});

	const pages = Array.from(
		portfolioPage.getElementsByClassName("portfolio-item")
	);
	const pageLinks = pages.map(page =>
		document.getElementById(page.getAttribute("c-nav-link"))
	);

	let active = 0;
	pageLinks[active].classList.add("-active");

	portfolioPage.addEventListener("scroll", e => {
		const scrollVal = e.target.scrollTop;
		let range = Math.floor(scrollVal / window.innerHeight);
		if (range >= pageLinks.length) range = pageLinks.length - 1;
		if (range != active) {
			pageLinks[active].classList.remove("-active");
			active = range;
			pageLinks[active].classList.add("-active");
		}
	});
});
