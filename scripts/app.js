const feedContainer = document.querySelector("[data-feed-list]");
const gitDeck = document.querySelector("[data-git-deck]");
const toolsTray = document.querySelector("[data-quick-tools]");
const actionButtons = document.querySelectorAll("[data-action]");
const yearEl = document.getElementById("year");
const { formatRelativeTime, createEl } = window.CodeFrontUtils;

async function fetchJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Kunne ikke hente ${path}`);
  }
  return res.json();
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
    meta.appendChild(createEl("span", "feed__source", item.source));
    if (item.posted) {
      meta.appendChild(createEl("span", "", formatRelativeTime(item.posted)));
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

    if (item.summary) {
      card.appendChild(createEl("p", "", item.summary));
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

async function loadAll() {
  try {
    const [feed, git, tools] = await Promise.all([
      fetchJson("data/feed.json"),
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
