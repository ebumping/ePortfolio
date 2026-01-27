'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Skills from '@/components/Skills';
import ProjectCard from '@/components/ProjectCard';
import Footer from '@/components/Footer';
import { projects, categories } from '@/data/projects';

type CategoryFilter = keyof typeof categories | 'all';

export default function Home() {
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);

  const categoryColors: Record<string, string> = {
    'all': 'text-terminal-text border-terminal-text',
    'systems': 'text-yellow-400 border-yellow-400',
    'ml-ai': 'text-orange-400 border-orange-400',
    'web': 'text-amber-400 border-amber-400',
    'security': 'text-rose-400 border-rose-400',
    'trading': 'text-emerald-400 border-emerald-400',
  };

  return (
    <main className="min-h-screen bg-terminal-bg">
      <Header />
      <Skills />

      {/* Projects Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-terminal-amber">$</span>
              <span className="text-terminal-text">ls -la ./projects/</span>
              <span className="text-terminal-dim ml-2">
                [{filteredProjects.length} items]
              </span>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filter === 'all'}
                onClick={() => setFilter('all')}
                colorClass={categoryColors['all']}
              >
                all
              </FilterButton>
              {Object.entries(categories).map(([key, { name }]) => (
                <FilterButton
                  key={key}
                  active={filter === key}
                  onClick={() => setFilter(key as CategoryFilter)}
                  colorClass={categoryColors[key]}
                >
                  {name.toLowerCase()}
                </FilterButton>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <div className="text-terminal-dim mb-2">
                $ find . -type f -name &quot;*.project&quot;
              </div>
              <div className="text-terminal-amber">
                No matching projects found.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 px-4 border-t border-terminal-border bg-terminal-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-terminal-amber">$</span>
            <span className="text-terminal-text">cat about.txt</span>
          </div>

          <div className="max-w-3xl">
            <p className="text-terminal-dim leading-relaxed mb-4">
              <span className="text-terminal-amber">{'>'}</span> Building distributed systems,
              ML pipelines, and security tools. Focused on high-performance Rust systems,
              multi-LLM orchestration, and production-grade infrastructure.
            </p>
            <p className="text-terminal-dim leading-relaxed mb-4">
              <span className="text-terminal-amber">{'>'}</span> Experience spans enterprise
              platforms with 90+ crate architectures, research-grade reverse engineering tools,
              full-stack web applications, and quantitative trading systems with ML/RL integration.
            </p>
            <p className="text-terminal-dim leading-relaxed">
              <span className="text-terminal-amber">{'>'}</span> Currently working on multi-provider
              LLM orchestration, cloud GPU ML pipelines, and autonomous trading systems.
            </p>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-terminal-border">
            <div className="flex items-center gap-2 text-sm text-terminal-dim">
              <span className="text-terminal-amber">$</span>
              <span>echo $CONTACT</span>
            </div>
            <div className="mt-2 text-terminal-text">
              <span className="text-terminal-gold">
                Present in the{' '}
                <a
                  href="https://www.wired-chan.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terminal-amber hover:text-terminal-gold underline underline-offset-4 decoration-terminal-amber/50 hover:decoration-terminal-gold transition-colors"
                >
                  wired
                </a>
                .
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FilterButton({
  children,
  active,
  onClick,
  colorClass,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  colorClass: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1 text-xs font-mono rounded border transition-all
        ${active
          ? `${colorClass} bg-terminal-surface`
          : 'text-terminal-dim border-terminal-border hover:border-terminal-dim'
        }
      `}
    >
      {children}
    </button>
  );
}
