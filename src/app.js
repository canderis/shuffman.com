"use strict";

import { Switcher } from "./PageSwitcher.js";
import Hamburger from "./Hamburger.js";
import Animate from "./Animate.js";


document.addEventListener("DOMContentLoaded", () => {
	const hamburger = new Hamburger("nav");

	new Animate();
	// hamburger.disableHamburger();

	let homeLoaded = false;
	let background;

	const portfolioItemLinks = document.getElementById("portfolio-item-links");
	const portfolioPage = document.getElementById("portfolio-page");
	const aboutPage = document.getElementById("about-page");

	const nav = document.getElementById("nav");

	portfolioPage.addEventListener("onTo", $event => {
		portfolioItemLinks.classList.add("show");
		nav.classList.add("nav--pages");
		// hamburger.enableHamburger();
		if(homeLoaded) background.runAnimate = false;
	});

	portfolioPage.addEventListener("onFrom", $event => {
		portfolioItemLinks.classList.remove("show");
		nav.classList.remove("nav--pages");
		// hamburger.disableHamburger();
	});

	aboutPage.addEventListener("onTo", $event => {
		nav.classList.add("nav--pages");
		// hamburger.enableHamburger();
		if(homeLoaded) background.runAnimate = false;
	});

	aboutPage.addEventListener("onFrom", $event => {
		nav.classList.remove("nav--pages");
		// hamburger.disableHamburger();
	});

	const homePage = document.getElementById("home-page");

	homePage.addEventListener("onTo", $event => {
		if(!homeLoaded){
			homeLoaded = true;
			// eslint-disable-next-line
			import('./Background.js').then(module => {
				const Background = module.default;
				background = new Background("app");
				background.build();
			});
		}
		else{
			background.runAnimate = true;
			background.animate();
		}
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

	let activeLink;
	const portfolioNavLinkChange = (entries) => {
		entries.forEach((entry) => {
			if(entry.isIntersecting && entry.intersectionRatio >= 0.55) {
				if(activeLink) activeLink.classList.remove('-active');

				const id = entry.target.getAttribute('id');
				activeLink = document.querySelector(`[href="#${id}"]`);
				activeLink.classList.add('-active');
			}
		});
	}

	const observer = new IntersectionObserver(portfolioNavLinkChange, { threshold: 0.55 });

	portfolioPage.querySelectorAll(".portfolio-item").forEach( page => {
		observer.observe(page);
	});

});
