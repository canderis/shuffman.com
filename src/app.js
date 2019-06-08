("use strict");

import { Switcher } from "./PageSwitcher.js";
import Background from "./Background.js";

document.addEventListener("DOMContentLoaded", () => {
	const Hamburger = require("./Hamburger.js");

	const background = new Background("app");
	background.build();

	new Switcher();
	new Hamburger("nav", 940);

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
});

// (() => {
// 	let transition = null;

// 	const hamburger = document.getElementById("hamburger");
// 	const nav = document.getElementById("nav");

// 	const homeState = (() => {
// 		const logo = document.getElementById("logo");
// 		const homeLink = document.getElementById("home-link");

// 		const state = {
// 			from: () => {
// 				logo.classList.add("init");
// 				homeLink.classList.remove("-active");
// 				hamburger.classList.add("show");
// 				// if (document.body.offsetWidth < 940) {
// 				//     // mobile
// 				//     nav.classList.remove('show');
// 				//     nav.classList.add('top');
// 				// }
// 			},
// 			to: () => {
// 				logo.classList.remove("init");
// 				homeLink.classList.add("-active");
// 				hamburger.classList.remove("show");
// 				if (document.body.offsetWidth < 940) {
// 					// mobile
// 					nav.classList.add("show");
// 					nav.classList.remove("top");
// 				}
// 			}
// 		};

// 		homeLink.addEventListener("click", () => {
// 			console.log("home click");

// 			transition(state);
// 		});

// 		return state;
// 	})();

// 	(() => {
// 		const aboutPage = document.getElementById("about-page");
// 		const aboutLink = document.getElementById("about-link");

// 		const state = {
// 			from: () => {
// 				aboutPage.classList.remove("show");
// 				aboutLink.classList.remove("-active");
// 			},
// 			to: () => {
// 				aboutPage.classList.add("show");
// 				aboutLink.classList.add("-active");
// 				if (document.body.offsetWidth < 940) {
// 					// mobile
// 					nav.classList.remove("show");
// 					nav.classList.add("top");
// 				}
// 			}
// 		};

// 		aboutLink.addEventListener("click", () => {
// 			transition(state);
// 		});

// 		return state;
// 	})();

// 	(() => {
// 		const portfolioPage = document.getElementById("portfolio-page");
// 		const portfolioLink = document.getElementById("portfolio-link");

// 		const portfolioItemLinks = document.getElementById(
// 			"portfolio-item-links"
// 		);

// 		const state = {
// 			from: () => {
// 				portfolioPage.classList.remove("show");
// 				portfolioLink.classList.remove("-active");
// 				portfolioItemLinks.classList.remove("show");
// 				hamburger.classList.remove("portfolio");
// 				nav.classList.remove("portfolio");
// 			},
// 			to: () => {
// 				portfolioItemLinks.classList.add("show");
// 				portfolioPage.classList.add("show");
// 				portfolioLink.classList.add("-active");
// 				hamburger.classList.add("portfolio");
// 				nav.classList.add("portfolio");
// 				if (document.body.offsetWidth < 940) {
// 					// mobile
// 					nav.classList.remove("show");
// 					nav.classList.add("top");
// 				}
// 			}
// 		};

// 		portfolioLink.addEventListener("click", () => {
// 			transition(state);
// 		});

// 		const safeWalkPage = document.getElementById("safewalk-page");
// 		const adelitasPage = document.getElementById("adelitas-page");
// 		const calendarPage = document.getElementById("calendar-page");
// 		const revanPage = document.getElementById("revan-page");

// 		const safeWalkLink = document.getElementById("safewalk-link");
// 		const adelitasLink = document.getElementById("adelitas-link");
// 		const calendarLink = document.getElementById("calendar-link");
// 		const revanLink = document.getElementById("revan-link");

// 		const mid = page => page.offsetTop + (page.offsetHeight * 2) / 3;
// 		// console.log(safeWalkPage.)
// 		const safeWalkMid = mid(safeWalkPage);
// 		const adelitasMid = mid(adelitasPage);
// 		const calendarMid = mid(calendarPage);
// 		const revanMid = mid(revanPage);

// 		adelitasLink.addEventListener("click", () => {
// 			adelitasPage.scrollIntoView({ behavior: "smooth" });
// 		});
// 		revanLink.addEventListener("click", () => {
// 			revanPage.scrollIntoView({ behavior: "smooth" });
// 		});

// 		calendarLink.addEventListener("click", () => {
// 			calendarPage.scrollIntoView({ behavior: "smooth" });
// 		});

// 		safeWalkLink.addEventListener("click", () => {
// 			safeWalkPage.scrollIntoView({ behavior: "smooth" });
// 		});

// 		const checkState = (() => {
// 			let activeLink = adelitasLink;

// 			return newLink => {
// 				if (activeLink != newLink) {
// 					activeLink.classList.remove("-active");
// 					newLink.classList.add("-active");
// 					activeLink = newLink;
// 				}
// 			};
// 		})();

// 		portfolioPage.addEventListener("scroll", e => {
// 			const scrollVal = e.target.scrollTop;

// 			if (scrollVal < adelitasMid) {
// 				checkState(adelitasLink);
// 			} else if (scrollVal < calendarMid) {
// 				// state changed to safewalk
// 				checkState(calendarLink);
// 			} else if (scrollVal < safeWalkMid) {
// 				// state changed to safewalk
// 				checkState(safeWalkLink);
// 			} else {
// 				checkState(revanLink);
// 			}
// 		});

// 		return state;
// 	})();

// 	transition = (() => {
// 		let navVisible = false;
// 		let activeState = homeState;

// 		(() => {
// 			hamburger.addEventListener("click", () => {
// 				if (activeState != homeState) {
// 					navVisible = !navVisible;
// 					if (navVisible) nav.classList.add("show");
// 					else nav.classList.remove("show");
// 				}
// 			});
// 		})();

// 		return to => {
// 			navVisible = false;
// 			activeState.from();
// 			activeState = to;
// 			activeState.to();
// 		};
// 	})();
// })();

// (() => {
//     const links = document.getElementsByClassName('nav-link');
//     let active = document.getElementById('home-link');
//     let pg = document.getElementById('home-page');
//     const rmActive = (newPgLink, newPg) => {
//         newPgLink.classList.add('-active');
//         pg.classList.remove('top');
//         if (newPg.getAttribute('id') !== 'home-page') {
//             const oldPg = pg;
//             const int = setInterval(() => {
//                 // runAnimate = false;
//                 oldPg.classList.remove('show' );
//                 clearInterval(int);
//             }, 1000);
//         } else {
//             // runAnimate = true;
//             pg.classList.remove('show' );
//         }

//         pg = newPg;
//         active.classList.remove('-active');
//         active = newPgLink;
//     };

//     for (const link of links) {
//         console.log();
//         link.addEventListener('click', () => {
//             const pgEl =
//            document.getElementById(`${link.getAttribute('_target')}-page`);
//             pgEl.classList.add('show', 'top');
//             rmActive(link, pgEl);
//         });
//     }
// })();
