interface PageState {
	route: string;
	from: () => void;
	to: () => void;
}

interface SwitcherApp {
	routes: Map<string, PageState>;
	activeState: PageState | null;
	transition: (to: PageState) => void;
	loadPage: (to: PageState) => void;
	error: string;
}

const buildStylesheet = (): void => {
	const element = document.createElement("style");
	document.head.appendChild(element);

	const stylesheet = element.sheet;
	if (!stylesheet) return;

	stylesheet.insertRule(`
		[ps-page].-active{
			transform: translateY(0) translateX(0);
			opacity: 1;
		}`);

	stylesheet.insertRule(`
		[ps-page]{
			top: 0;
			width: 100vw;
			height: 100vh;
			position: fixed;
			transition: 1s;
		}`);

	stylesheet.insertRule(`
		[ps-page][ps-transition="left"] {
			transform: translateX(-100vw);
		}`);

	stylesheet.insertRule(`
		[ps-page][ps-transition="right"] {
			transform: translateX(100vw);
		}`);

	stylesheet.insertRule(`
		[ps-page][ps-transition="top"] {
			transform: translateY(-100vh);
		}`);

	stylesheet.insertRule(`
		[ps-page][ps-transition="bottom"]{
			transform: translateY(100vh);
		}`);

	stylesheet.insertRule(`
		[ps-page]:not(.-active) {
			opacity: 0;
		}`);
};

const createPage = (pageId: string, app: SwitcherApp): PageState => {
	const pageEl = document.querySelector(`[ps-page="${pageId}"]`);
	const linkEls = document.querySelectorAll(`[ps-route="${pageId}"]`);

	if (!pageEl) {
		throw new Error(`Page element for route "${pageId}" not found`);
	}

	const state: PageState = {
		route: pageId,
		from: () => {
			pageEl.classList.remove("-active");
			linkEls.forEach((link) => link.classList.remove("-active"));
			pageEl.dispatchEvent(new Event("onFrom"));
		},
		to: () => {
			pageEl.classList.add("-active");
			linkEls.forEach((link) => link.classList.add("-active"));
			pageEl.dispatchEvent(new Event("onTo"));
		},
	};

	linkEls.forEach((link) =>
		link.addEventListener("click", () => {
			app.loadPage(state);
		}),
	);

	return state;
};

export class Switcher {
	constructor(error = "/") {
		const app: SwitcherApp = {
			routes: new Map(),
			activeState: null,
			transition: (to: PageState) => {
				app.activeState?.from();
				app.activeState = to;
				app.activeState.to();
			},
			loadPage: function (to: PageState) {
				window.history.pushState(
					{},
					to.route,
					window.location.origin + to.route,
				);
				this.transition(to);
			},
			error,
		};

		buildStylesheet();

		document.querySelectorAll("[ps-page]").forEach((pageEl) => {
			const id = pageEl.getAttribute("ps-page");
			if (id) app.routes.set(id, createPage(id, app));
		});

		window.onpopstate = () => {
			const page = app.routes.get(location.pathname);
			if (page) app.transition(page);
			else {
				const errorPage = app.routes.get(app.error);
				if (errorPage) app.transition(errorPage);
			}
		};

		const page = app.routes.get(location.pathname);
		if (page) {
			app.activeState = page;
			app.activeState.to();
		} else {
			const errorPage = app.routes.get(app.error);
			if (!errorPage) return;
			app.activeState = errorPage;
			window.history.replaceState(
				{},
				app.error,
				window.location.origin + app.error,
			);
			app.activeState.to();
		}
	}
}
