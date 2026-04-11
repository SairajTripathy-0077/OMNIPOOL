import React from 'react';
import type { MentorMatch } from '../../store/useStore';
import Badge from '../ui/Badge';

interface MentorMatchesProps {
  mentors: MentorMatch[];
}

const MentorMatches: React.FC<MentorMatchesProps> = ({ mentors }) => {
  if (mentors.length === 0) return null;

  return (
    <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-accent-amber/15 flex items-center justify-center">
          <svg className="w-5 h-5 text-accent-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Available Mentors</h3>
          <p className="text-xs text-text-muted">{mentors.length} mentors matched to your project</p>
        </div>
      </div>

      <div className="space-y-3">
        {mentors.map((mentor) => (
          <div
            key={mentor._id}
            className="flex items-start gap-4 p-4 rounded-xl bg-bg-tertiary/50 border border-border-default
              hover:border-border-hover hover:bg-bg-glass transition-all duration-200"
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center text-white font-bold text-lg shrink-0">
              {mentor.name.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-text-primary">{mentor.name}</h4>
                {mentor.availability && (
                  <span className="flex items-center gap-1 text-[10px] text-accent-emerald">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald" />
                    Available
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted mb-2 line-clamp-2">{mentor.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {mentor.skills.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="default" size="sm">{skill}</Badge>
                ))}
                {mentor.skills.length > 4 && (
                  <Badge variant="default" size="sm">+{mentor.skills.length - 4}</Badge>
                )}
              </div>
            </div>

            {/* Score */}
            <div className="text-right shrink-0">
              <div className="text-lg font-bold text-accent-amber">{Math.round((mentor.score || 0) * 100)}%</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">match</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorMatches;
