import React from 'react';
import Badge from '../ui/Badge';

interface SkillsPanelProps {
  skills: string[];
}

const badgeVariants = ['indigo', 'violet', 'cyan', 'emerald', 'amber', 'rose'] as const;

const SkillsPanel: React.FC<SkillsPanelProps> = ({ skills }) => {
  if (skills.length === 0) return null;

  return (
    <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-accent-violet/15 flex items-center justify-center">
          <svg className="w-5 h-5 text-accent-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Required Skills</h3>
          <p className="text-xs text-text-muted">{skills.length} skills identified</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge
            key={skill}
            variant={badgeVariants[index % badgeVariants.length]}
            size="md"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SkillsPanel;
