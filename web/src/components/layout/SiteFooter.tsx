import { copy } from "../../locales";

export function SiteFooter() {
  const { intro, projectQuoted, outro } = copy.siteFooter;

  return (
    <footer>
      {intro} {projectQuoted} {outro}
    </footer>
  );
}
