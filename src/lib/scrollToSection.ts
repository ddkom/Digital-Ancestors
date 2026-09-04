const HEADER_OFFSET = 80;

export function scrollToSection(id: string) {
  const scroll = () => {
    const el = document.getElementById(id);
    if (!el) return false;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    return true;
  };

  if (scroll()) return;

  requestAnimationFrame(() => {
    if (scroll()) return;
    window.setTimeout(scroll, 150);
  });
}
