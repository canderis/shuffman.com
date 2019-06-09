("use strict");

import { Switcher } from "./PageSwitcher.js";
import Background from "./Background.js";
import Hamburger from "./Hamburger.js";

document.addEventListener("DOMContentLoaded", () => {
	const background = new Background("app");
	const hamburger = new Hamburger("nav", 1100);
	hamburger.disableHamburger();

	background.build();

	const portfolioItemLinks = document.getElementById("portfolio-item-links");
	const portfolioPage = document.getElementById("portfolio-page");
	const aboutPage = document.getElementById("about-page");

	const nav = document.getElementById("nav");

	portfolioPage.addEventListener("onTo", $event => {
		portfolioItemLinks.classList.add("show");
		nav.classList.add("nav--pages");
		hamburger.enableHamburger();
		background.runAnimate = false;
	});

	portfolioPage.addEventListener("onFrom", $event => {
		portfolioItemLinks.classList.remove("show");
		nav.classList.remove("nav--pages");
		hamburger.disableHamburger();
	});

	aboutPage.addEventListener("onTo", $event => {
		nav.classList.add("nav--pages");
		hamburger.enableHamburger();
		background.runAnimate = false;
	});

	aboutPage.addEventListener("onFrom", $event => {
		nav.classList.remove("nav--pages");
		hamburger.disableHamburger();
	});

	const homePage = document.getElementById("home-page");

	homePage.addEventListener("onTo", $event => {
		background.runAnimate = true;
	});

	new Switcher();

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
