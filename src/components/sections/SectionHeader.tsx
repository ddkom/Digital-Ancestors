import type { ReactNode } from "react";

type Props = {
  kicker: string;
  title: string;
  titleId?: string;
  body?: ReactNode;
};

export function SectionHeader({ kicker, title, titleId, body }: Props) {
  return (
    <div className="section-header">
      <div className="section-kicker">{kicker}</div>
      <h2 className="section-title" id={titleId}>
        {title}
      </h2>
      {body ? <p className="section-body">{body}</p> : null}
    </div>
  );
}
