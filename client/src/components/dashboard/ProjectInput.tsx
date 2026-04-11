import React, { useState } from 'react';
import Button from '../ui/Button';

interface ProjectInputProps {
  onSubmit: (description: string) => void;
  isLoading: boolean;
}

const ProjectInput: React.FC<ProjectInputProps> = ({ onSubmit, isLoading }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit(description.trim());
    }
  };

  const examplePrompts = [
    'I want to build an autonomous line-following robot with obstacle avoidance',
    'Build a weather monitoring station that logs to the cloud',
    'Create a custom FPV drone for aerial photography',
    'Smart home automation system with voice control',
  ];

  return (
    <div className="glass-card p-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary">I'm Building...</h2>
          <p className="text-sm text-text-secondary">Describe your project and let AI do the rest</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            id="project-description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project in detail... What are you building? What should it do?"
            className={`
              w-full min-h-[160px] bg-bg-tertiary/50 border rounded-xl
              px-5 py-4 text-text-primary placeholder-text-muted
              focus:outline-none focus:ring-2 focus:ring-accent-indigo/30
              transition-all duration-300 resize-y font-sans text-base leading-relaxed
              ${isLoading ? 'border-accent-indigo animate-pulse-glow' : 'border-border-default focus:border-accent-indigo'}
            `}
            disabled={isLoading}
          />
        </div>

        {/* Example prompts */}
        <div className="mt-4 mb-5">
          <p className="text-xs text-text-muted mb-2">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setDescription(prompt)}
                className="text-xs px-3 py-1.5 rounded-full bg-bg-tertiary border border-border-default
                  text-text-muted hover:text-accent-indigo hover:border-accent-indigo/30
                  transition-all duration-200 cursor-pointer"
              >
                {prompt.length > 45 ? prompt.slice(0, 45) + '...' : prompt}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          disabled={!description.trim()}
          className="w-full"
        >
          {isLoading ? 'Analyzing with AI...' : 'Analyze Project'}
          {!isLoading && (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ProjectInput;
