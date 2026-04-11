import React from 'react';
import type { BOMItem } from '../../store/useStore';

interface BOMPanelProps {
  items: BOMItem[];
}

const BOMPanel: React.FC<BOMPanelProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <div className="glass-card p-6 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-accent-cyan/15 flex items-center justify-center">
          <svg className="w-5 h-5 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Bill of Materials</h3>
          <p className="text-xs text-text-muted">{items.length} components identified</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-default">
              <th className="text-left py-2.5 px-3 text-text-muted font-medium text-xs uppercase tracking-wider">Component</th>
              <th className="text-center py-2.5 px-3 text-text-muted font-medium text-xs uppercase tracking-wider">Qty</th>
              <th className="text-left py-2.5 px-3 text-text-muted font-medium text-xs uppercase tracking-wider">Notes</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className="border-b border-border-default/50 hover:bg-bg-glass transition-colors"
              >
                <td className="py-3 px-3 text-text-primary font-medium">{item.hardware_name}</td>
                <td className="py-3 px-3 text-center">
                  <span className="inline-flex items-center justify-center min-w-[28px] h-7 rounded-md bg-accent-cyan/10 text-accent-cyan font-mono text-xs font-bold">
                    {item.quantity}
                  </span>
                </td>
                <td className="py-3 px-3 text-text-muted text-xs">{item.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BOMPanel;
