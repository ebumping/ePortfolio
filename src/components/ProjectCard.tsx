'use client';

import { Project, categories } from '@/data/projects';
import { useState } from 'react';

interface ProjectCardProps {
  project: Project;
  index: number;
}

// Language color mappings for syntax highlighting hints
const langColors: Record<string, { keyword: string; string: string; comment: string; function: string }> = {
  rust: {
    keyword: 'text-orange-400',
    string: 'text-amber-300',
    comment: 'text-terminal-dim',
    function: 'text-yellow-400',
  },
  python: {
    keyword: 'text-orange-400',
    string: 'text-amber-200',
    comment: 'text-terminal-dim',
    function: 'text-yellow-400',
  },
  typescript: {
    keyword: 'text-orange-400',
    string: 'text-amber-300',
    comment: 'text-terminal-dim',
    function: 'text-yellow-400',
  },
  javascript: {
    keyword: 'text-orange-400',
    string: 'text-amber-300',
    comment: 'text-terminal-dim',
    function: 'text-yellow-400',
  },
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const category = categories[project.category];

  const categoryColors: Record<string, string> = {
    'terminal-gold': 'text-yellow-400 border-yellow-400/30',
    'terminal-honey': 'text-orange-400 border-orange-400/30',
    'terminal-amber': 'text-amber-400 border-amber-400/30',
    'terminal-magenta': 'text-rose-400 border-rose-400/30',
    'terminal-cyan': 'text-emerald-400 border-emerald-400/30',
  };

  const colorClass = categoryColors[category.color] || 'text-amber-400 border-amber-400/30';

  const handleCodeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCode(!showCode);
  };

  return (
    <div
      className="project-card bg-terminal-surface border border-terminal-border rounded-lg p-6 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-terminal-amber opacity-50 text-sm">
              [{String(index + 1).padStart(2, '0')}]
            </span>
            <h3 className="text-lg font-semibold text-terminal-text">
              {project.name}
            </h3>
          </div>
          <p className={`text-sm ${colorClass.split(' ')[0]} opacity-80`}>
            {project.tagline}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs px-2 py-0.5 rounded border ${colorClass}`}>
            {category.name}
          </span>
          {project.scale && (
            <span className="text-xs text-terminal-dim">
              {project.scale}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-terminal-dim mb-4 leading-relaxed">
        {isExpanded && project.longDescription ? project.longDescription : project.description}
      </p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tech.map((tech) => (
          <span key={tech} className="tech-tag">
            {tech}
          </span>
        ))}
      </div>

      {/* Highlights (expanded) */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-terminal-border">
          <div className="text-xs text-terminal-amber mb-2 font-medium">
            $ cat highlights.txt
          </div>
          <ul className="space-y-1">
            {project.highlights.map((highlight, i) => (
              <li key={i} className="text-sm text-terminal-dim flex items-start gap-2">
                <span className="text-terminal-amber opacity-50">{'>'}</span>
                {highlight}
              </li>
            ))}
          </ul>

          {/* Code Highlight Section */}
          {project.codeHighlight && (
            <div className="mt-4 pt-4 border-t border-terminal-border">
              <button
                onClick={handleCodeToggle}
                className="flex items-center gap-2 text-xs text-terminal-gold hover:text-terminal-amber transition-colors mb-2"
              >
                <span>{showCode ? '▼' : '▶'}</span>
                <span>$ cat {project.codeHighlight.filename}</span>
                <span className="text-terminal-dim">({project.codeHighlight.language})</span>
              </button>

              {showCode && (
                <div className="relative">
                  {/* Code block header */}
                  <div className="flex items-center justify-between bg-terminal-bg rounded-t border border-terminal-border border-b-0 px-3 py-1.5">
                    <span className="text-xs text-terminal-dim font-mono">
                      {project.codeHighlight.filename}
                    </span>
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                  </div>

                  {/* Code content */}
                  <div className="bg-terminal-bg border border-terminal-border rounded-b overflow-x-auto">
                    <pre className="p-4 text-xs leading-relaxed">
                      <code className="text-terminal-text">
                        {highlightCode(project.codeHighlight.code, project.codeHighlight.language)}
                      </code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Expand indicator */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-terminal-border">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            project.status === 'active' ? 'bg-green-500 animate-pulse' :
            project.status === 'maintained' ? 'bg-amber-500' : 'bg-terminal-dim'
          }`} />
          <span className="text-xs text-terminal-dim capitalize">{project.status}</span>
        </div>
        <span className="text-xs text-terminal-dim">
          {isExpanded ? '[-] collapse' : '[+] expand'}
        </span>
      </div>
    </div>
  );
}

// Simple syntax highlighting function
function highlightCode(code: string, language: string): React.ReactNode[] {
  const colors = langColors[language] || langColors.javascript;

  // Keywords by language
  const keywords: Record<string, string[]> = {
    rust: ['pub', 'async', 'fn', 'let', 'const', 'match', 'await', 'self', 'return', 'Ok', 'Err', 'impl', 'struct', 'enum', 'use', 'mod', 'for', 'in', 'if', 'else'],
    python: ['def', 'class', 'async', 'await', 'return', 'if', 'else', 'for', 'in', 'import', 'from', 'self', 'yield', 'with', 'as', 'try', 'except'],
    typescript: ['const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'for', 'of', 'in', 'export', 'import', 'from', 'class', 'interface', 'type', 'extends', 'implements'],
    javascript: ['const', 'let', 'var', 'function', 'async', 'await', 'return', 'if', 'else', 'for', 'of', 'in', 'export', 'import', 'from', 'class'],
  };

  const langKeywords = keywords[language] || keywords.javascript;

  return code.split('\n').map((line, lineIndex) => {
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    // Handle comments
    const commentIndex = remaining.indexOf('//');
    const hashComment = language === 'python' ? remaining.indexOf('#') : -1;
    const actualCommentIndex = commentIndex >= 0 ? commentIndex : hashComment;

    if (actualCommentIndex >= 0) {
      const beforeComment = remaining.slice(0, actualCommentIndex);
      const comment = remaining.slice(actualCommentIndex);
      parts.push(...tokenizeLine(beforeComment, langKeywords, colors, key));
      key += beforeComment.length;
      parts.push(
        <span key={`comment-${lineIndex}`} className={colors.comment}>
          {comment}
        </span>
      );
    } else {
      parts.push(...tokenizeLine(remaining, langKeywords, colors, key));
    }

    return (
      <span key={lineIndex}>
        {parts}
        {lineIndex < code.split('\n').length - 1 && '\n'}
      </span>
    );
  });
}

function tokenizeLine(
  line: string,
  keywords: string[],
  colors: { keyword: string; string: string; comment: string; function: string },
  startKey: number
): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let key = startKey;

  while (remaining.length > 0) {
    // Check for strings
    const stringMatch = remaining.match(/^(["'`])([^"'`]*)\1/);
    if (stringMatch) {
      parts.push(
        <span key={key++} className={colors.string}>
          {stringMatch[0]}
        </span>
      );
      remaining = remaining.slice(stringMatch[0].length);
      continue;
    }

    // Check for keywords
    let foundKeyword = false;
    for (const kw of keywords) {
      if (remaining.startsWith(kw) && !/\w/.test(remaining[kw.length] || '')) {
        parts.push(
          <span key={key++} className={colors.keyword}>
            {kw}
          </span>
        );
        remaining = remaining.slice(kw.length);
        foundKeyword = true;
        break;
      }
    }
    if (foundKeyword) continue;

    // Check for function calls (word followed by parenthesis)
    const funcMatch = remaining.match(/^(\w+)(\()/);
    if (funcMatch) {
      parts.push(
        <span key={key++} className={colors.function}>
          {funcMatch[1]}
        </span>
      );
      parts.push(<span key={key++}>(</span>);
      remaining = remaining.slice(funcMatch[0].length);
      continue;
    }

    // Default: just add the character
    parts.push(<span key={key++}>{remaining[0]}</span>);
    remaining = remaining.slice(1);
  }

  return parts;
}
