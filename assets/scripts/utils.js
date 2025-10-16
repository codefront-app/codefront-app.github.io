(function (global) {
  function formatRelativeTime(isoString) {
    if (!isoString) return "";
    const now = new Date();
    const target = new Date(isoString);
    const diff = (target.getTime() - now.getTime()) / 1000;
    const abs = Math.abs(diff);

    if (abs < 60) return "nå";
    if (abs < 3600) {
      const mins = Math.round(abs / 60);
      return diff < 0 ? `${mins} min siden` : `om ${mins} min`;
    }
    if (abs < 86400) {
      const hours = Math.round(abs / 3600);
      return diff < 0 ? `${hours} t siden` : `om ${hours} t`;
    }
    const days = Math.round(abs / 86400);
    return diff < 0 ? `${days} d siden` : `om ${days} d`;
  }

  function createEl(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== undefined) {
      el.innerHTML = content;
    }
    return el;
  }

  global.CodeFrontUtils = {
    formatRelativeTime,
    createEl
  };
})(window);
