import React from 'react';
import type { HardwareMatch } from '../../store/useStore';
import Badge from '../ui/Badge';

interface HardwareMatchesProps {
  items: HardwareMatch[];
}

const categoryColors: Record<string, 'cyan' | 'indigo' | 'violet' | 'emerald' | 'amber' | 'rose'> = {
  compute: 'indigo',
  sensor: 'cyan',
  networking: 'violet',
  storage: 'emerald',
  display: 'amber',
  power: 'rose',
  other: 'cyan',
};

const HardwareMatches: React.FC<HardwareMatchesProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-accent-emerald/15 flex items-center justify-center">
          <svg className="w-5 h-5 text-accent-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Hardware Nearby</h3>
          <p className="text-xs text-text-muted">{items.length} matches found in your community</p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 p-4 rounded-xl bg-bg-tertiary/50 border border-border-default
              hover:border-border-hover hover:bg-bg-glass transition-all duration-200"
          >
            {/* Category icon */}
            <div className="w-12 h-12 rounded-xl bg-bg-card border border-border-default flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-accent-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-text-primary truncate">{item.name}</h4>
                <Badge variant={categoryColors[item.category] || 'cyan'} size="sm">{item.category}</Badge>
              </div>
              <p className="text-xs text-text-muted truncate">{item.description}</p>
              <p className="text-xs text-text-secondary mt-1">
                Owned by <span className="text-accent-indigo">{item.owner_id?.name || 'Community Member'}</span>
              </p>
            </div>

            {/* Match score */}
            <div className="text-right shrink-0">
              <div className="text-lg font-bold text-accent-emerald">{Math.round((item.score || 0) * 100)}%</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">match</div>
            </div>

            {/* Availability indicator */}
            <div className={`w-3 h-3 rounded-full shrink-0 ${
              item.availability_status === 'available' ? 'bg-accent-emerald' :
              item.availability_status === 'in-use' ? 'bg-accent-amber' : 'bg-accent-rose'
            }`} title={item.availability_status} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HardwareMatches;
