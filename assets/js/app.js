(() => {
	"use strict";

	const THEME_KEY = "macrolens_theme";
	const WATCHLIST_KEY = "macrolens_watchlist";

	const qs = (sel, root = document) => root.querySelector(sel);
	const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

	const getSavedTheme = () => localStorage.getItem(THEME_KEY) || "light";

	const applyTheme = (theme) => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem(THEME_KEY, theme);

		qsa("[data-theme-label]").forEach((el) => {
			el.textContent = theme === "dark" ? "Dark" : "Light";
		});
	};

	const initTheme = () => {
		applyTheme(getSavedTheme());

		qsa("[data-theme-toggle]").forEach((btn) => {
			btn.addEventListener("click", () => {
				const current = document.documentElement.getAttribute("data-theme") || "light";
				applyTheme(current === "light" ? "dark" : "light");
			});
		});
	};

	const initMobileNav = () => {
		const nav = qs("[data-nav]");
		const toggles = qsa("[data-nav-toggle]");
		if (!nav || !toggles.length) return;

		toggles.forEach((btn) => {
			btn.addEventListener("click", () => {
				nav.classList.toggle("nav--open");
			});
		});

		qsa("a", nav).forEach((a) => {
			a.addEventListener("click", () => nav.classList.remove("nav--open"));
		});
	};

	const setYear = () => {
		const el = qs("#year");
		if (el) el.textContent = String(new Date().getFullYear());
	};

	const readWatchlist = () => {
		try{
			const raw = localStorage.getItem(WATCHLIST_KEY);
			const list = raw ? JSON.parse(raw) : [];
			return Array.isArray(list) ? list : [];
		}catch{
			return [];
		}
	};

	const writeWatchlist = (list) => {
		localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
	};

	const renderWatchlistPage = () => {
		const listEl = qs("#wl-list");
		const inputEl = qs("#wl-input");
		const addBtn = qs("#wl-add");
		const clearBtn = qs("#wl-clear");

		if (!listEl || !inputEl || !addBtn || !clearBtn) return;

		const render = () => {
			const items = readWatchlist();
			listEl.innerHTML = "";

			if (!items.length){
				const empty = document.createElement("div");
				empty.className = "list__row muted";
				empty.textContent = "No tickers yet.";
				listEl.appendChild(empty);
				return;
			}

			items.forEach((tkr) => {
				const row = document.createElement("div");
				row.className = "list__row";

				const left = document.createElement("div");
				left.className = "list__left";
				left.textContent = tkr;

				const right = document.createElement("div");
				right.className = "list__right";

				const del = document.createElement("button");
				del.className = "btn btn--ghost btn--sm";
				del.type = "button";
				del.textContent = "Remove";
				del.addEventListener("click", () => {
					writeWatchlist(readWatchlist().filter((x) => x !== tkr));
					render();
				});

				right.appendChild(del);
				row.appendChild(left);
				row.appendChild(right);
				listEl.appendChild(row);
			});
		};

		const add = () => {
			const raw = inputEl.value.trim().toUpperCase();
			if (!raw) return;

			const valid = raw.replace(/[^A-Z0-9.\-]/g, "");
			if (!valid) return;

			const current = readWatchlist();
			if (!current.includes(valid)) writeWatchlist([valid, ...current].slice(0, 50));

			inputEl.value = "";
			render();
		};

		addBtn.addEventListener("click", add);
		inputEl.addEventListener("keydown", (e) => {
			if (e.key === "Enter") add();
		});

		clearBtn.addEventListener("click", () => {
			writeWatchlist([]);
			render();
		});

		render();
	};

	const renderWatchlistPreview = () => {
		const previewEl = qs("#watchlist-preview");
		if (!previewEl) return;

		const items = readWatchlist().slice(0, 6);
		previewEl.innerHTML = "";

		if (!items.length){
			const empty = document.createElement("div");
			empty.className = "list__row muted";
			empty.textContent = "No tickers yet. Add some on the Watchlist page.";
			previewEl.appendChild(empty);
			return;
		}

		items.forEach((tkr) => {
			const row = document.createElement("div");
			row.className = "list__row";
			row.textContent = tkr;
			previewEl.appendChild(row);
		});
	};

	const initPlaceholders = () => {
		const c = qs("#kpi-catalysts");
		const e = qs("#kpi-earnings");
		const h = qs("#kpi-headlines");

		if (c) c.textContent = "0";
		if (e) e.textContent = "0";
		if (h) h.textContent = "0";
	};

	document.addEventListener("DOMContentLoaded", () => {
		initTheme();
		initMobileNav();
		setYear();
		renderWatchlistPage();
		renderWatchlistPreview();
		initPlaceholders();
	});
})();
