'use client';

import { skills } from '@/data/projects';

const skillCategories = [
  { key: 'languages', label: 'Languages', icon: '{}' },
  { key: 'systems', label: 'Infrastructure', icon: '⚙' },
  { key: 'ml', label: 'ML/AI', icon: '◈' },
  { key: 'web', label: 'Web', icon: '◇' },
  { key: 'databases', label: 'Databases', icon: '▣' },
  { key: 'security', label: 'Security', icon: '◆' },
  { key: 'blockchain', label: 'Blockchain', icon: '⬡' },
  { key: 'devops', label: 'DevOps & Tooling', icon: '⚡' },
] as const;

export default function Skills() {
  return (
    <section className="py-12 px-4 border-b border-terminal-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-terminal-amber">$</span>
          <span className="text-terminal-text">cat skills.json</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillCategories.map(({ key, label, icon }) => (
            <div
              key={key}
              className="bg-terminal-surface border border-terminal-border rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-terminal-gold">{icon}</span>
                <span className="text-sm font-medium text-terminal-text">{label}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills[key as keyof typeof skills].map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-1 bg-terminal-bg border border-terminal-border rounded text-terminal-dim hover:text-terminal-amber hover:border-terminal-amber/50 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
