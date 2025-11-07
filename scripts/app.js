const feedContainer = document.querySelector("[data-feed-list]");
const gitDeck = document.querySelector("[data-git-deck]");
const toolsTray = document.querySelector("[data-quick-tools]");
const actionButtons = document.querySelectorAll("[data-action]");
const yearEl = document.getElementById("year");
const { formatRelativeTime, createEl } = window.CodeFrontUtils;
const state = { config: {} };

async function fetchJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Kunne ikke hente ${path}`);
  }
  return res.json();
}

async function loadConfig() {
  try {
    const config = await fetchJson("data/config.json");
    state.config = config;
  } catch (error) {
    console.warn("Fant ikke config.json, bruker fallback", error);
    state.config = {};
  }
}

function renderFeed(entries) {
  feedContainer.innerHTML = "";
  if (!entries.length) {
    feedContainer.innerHTML = '<div class="empty-state">Feedtomt i dag – legg inn nye kilder i data/feed.json.</div>';
    return;
  }

  entries.forEach((item) => {
    const card = createEl("article", "feed__item");

    const meta = createEl("div", "feed__meta");
    const sourceLabel = item.sourceName || item.source || "Ukjent kilde";
    meta.appendChild(createEl("span", "feed__source", sourceLabel));

    const posted = item.publishedAt || item.posted;
    if (posted) {
      const iso = typeof posted === "number" ? new Date(posted).toISOString() : posted;
      meta.appendChild(createEl("span", "", formatRelativeTime(iso)));
    }

    if (item.category) {
      meta.appendChild(createEl("span", "", item.category));
    }

    if (item.tags?.length) {
      item.tags.forEach((tag) => {
        meta.appendChild(createEl("span", "", `#${tag}`));
      });
    }
    card.appendChild(meta);

    const link = createEl("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = item.title;
    card.appendChild(link);

    const summary = item.summary || item.description;
    if (summary) {
      card.appendChild(createEl("p", "", summary));
    }

    feedContainer.appendChild(card);
  });
}

function renderGit(cards) {
  gitDeck.innerHTML = "";
  if (!cards.length) {
    gitDeck.innerHTML = '<div class="empty-state">Legg inn git-kort i data/git.json.</div>';
    return;
  }

  cards.forEach((item) => {
    const card = createEl("article", "card git-card");
    card.appendChild(createEl("span", "git-card__category", item.category));
    card.appendChild(createEl("h3", "", item.title));

    const command = createEl("div", "git-card__command");
    command.textContent = item.command;
    card.appendChild(command);

    if (item.explain) {
      card.appendChild(createEl("p", "", item.explain));
    }

    gitDeck.appendChild(card);
  });
}

function renderTools(tools) {
  toolsTray.innerHTML = "";
  if (!tools.length) {
    toolsTray.innerHTML = '<div class="empty-state">Legg til hurtigverktøy i data/tools.json.</div>';
    return;
  }

  tools.forEach((tool) => {
    const link = createEl("a");
    link.href = tool.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.innerHTML = `<strong>${tool.label}</strong><span>${tool.hint ?? ""}</span>`;
    toolsTray.appendChild(link);
  });
}

async function loadFeed() {
  const endpoint = resolveEndpoint();
  if (endpoint) {
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) throw new Error(`Endpoint ${endpoint} svarte ${res.status}`);
      const payload = await res.json();
      return payload.items ?? payload;
    } catch (error) {
      console.warn("Klarte ikke hente live-feed, bruker fallback", error);
    }
  }

  const fallbackPath = state.config.fallbackFeed || "data/feed.json";
  return fetchJson(fallbackPath);
}

function resolveEndpoint() {
  if (state.config.newsEndpoint) {
    return state.config.newsEndpoint;
  }

  if (window.location.hostname === "localhost") {
    return "http://localhost:4010/api/feed";
  }

  return "";
}

async function loadAll() {
  try {
    await loadConfig();

    const [feed, git, tools] = await Promise.all([
      loadFeed(),
      fetchJson("data/git.json"),
      fetchJson("data/tools.json")
    ]);
    renderFeed(feed);
    renderGit(git);
    renderTools(tools);
  } catch (error) {
    console.error(error);
    const errorState = '<div class="empty-state">Kunne ikke laste data. Sjekk JSON-filene i data/.</div>';
    feedContainer.innerHTML = errorState;
    gitDeck.innerHTML = errorState;
    toolsTray.innerHTML = errorState;
  }
}

function handleAction(event) {
  const action = event.currentTarget.dataset.action;
  if (action === "refresh") {
    loadAll();
  }
  if (action === "focus") {
    alert("Start en 25-minutters fokusøkt. Start klokka, lukk Slack, og kjør!");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (yearEl) {
    yearEl.textContent = new Date().getUTCFullYear();
  }
  loadAll();
  actionButtons.forEach((button) => button.addEventListener("click", handleAction));
});
