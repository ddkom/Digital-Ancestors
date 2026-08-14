import type { PathwayResourceGroup } from "../../utils/extractPathwayResources";

type Props = {
  groups: PathwayResourceGroup[];
  idPrefix?: string;
};

export function ResourceGroupList({ groups, idPrefix = "group" }: Props) {
  return (
    <>
      {groups.map((group) => {
        const headingId = `${idPrefix}-${group.nodeId}`;
        return (
          <div
            key={group.nodeId}
            className="resources-group"
            aria-labelledby={headingId}
          >
            <header className="resources-group-header">
              <div className="resources-step-title-row">
                <h3 className="resources-step-title" id={headingId}>
                  {group.nodeTitle}
                </h3>
                {group.nodeTag ? (
                  <span className="resources-step-tag">{group.nodeTag}</span>
                ) : null}
              </div>
            </header>

            {group.blocks.map((block, blockIndex) => (
              <div
                key={`${group.nodeId}-${block.category}-${blockIndex}`}
                className="resources-block"
              >
                {group.blocks.length > 1 ? (
                  <p className="resources-block-label">{block.category}</p>
                ) : null}
                {block.notes ? (
                  <p className="resources-block-notes">{block.notes}</p>
                ) : null}
                <ul className="resources-list">
                  {block.resources.map((resource) => (
                    <li key={resource.link} className="resources-item">
                      <a
                        href={resource.link}
                        className="resource-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resource.title ?? resource.name}
                      </a>
                      {resource.desc ? (
                        <p className="resource-desc">{resource.desc}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}
