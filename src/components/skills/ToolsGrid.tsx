import type { CSSProperties } from 'react';

export type ToolGroup = {
  label: string;
  tools: string[];
};

/**
 * Every tool visible at once, grouped so it can be scanned in a glance.
 * The chips drift gently in a staggered wave (CSS only) to keep the tile alive.
 */
export default function ToolsGrid({ groups }: { groups: ToolGroup[] }) {
  let i = 0;
  return (
    <div className="tools-grid">
      {groups.map((group) => (
        <div key={group.label} className="tools-group">
          <p className="tools-group-label">{group.label}</p>
          <ul className="tools-group-chips">
            {group.tools.map((tool) => (
              <li key={tool} style={{ '--i': i++ } as CSSProperties}>{tool}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
