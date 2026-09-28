import { copy } from "../../locales";

export function SiteFooter() {
  const { intro, projectQuoted, outro, backgroundCredit: credit } = copy.siteFooter;

  return (
    <footer>
      {intro} {projectQuoted} {outro}{" "}
      <span className="footer-credit">
        {credit.before}{" "}
        <a href={credit.sketchUrl} target="_blank" rel="noopener noreferrer">
          {credit.sketchTitle}
        </a>{" "}
        {credit.by}{" "}
        <a href={credit.authorUrl} target="_blank" rel="noopener noreferrer">
          {credit.author}
        </a>
        ,{" "}
        <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer">
          {credit.license}
        </a>
        .
      </span>
    </footer>
  );
}
