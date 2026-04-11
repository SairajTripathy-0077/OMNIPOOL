import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border-default bg-bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-base font-bold gradient-text">OmniPool</span>
            </Link>
            <p className="text-sm text-text-muted max-w-xs leading-relaxed">
              The community-powered platform for sharing hardware resources and finding expert mentors — powered by AI.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Platform</h4>
            <ul className="space-y-2">
              {[
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/hardware', label: 'Hardware Registry' },
                { to: '/skills', label: 'Skills Profile' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-text-muted hover:text-accent-indigo transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">Resources</h4>
            <ul className="space-y-2">
              {['Documentation', 'API Reference', 'Community'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-text-muted hover:text-accent-indigo transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border-default mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} OmniPool. Built with ❤️ for makers.
          </p>
          <div className="flex gap-4">
            {['GitHub', 'Discord', 'Twitter'].map((social) => (
              <span
                key={social}
                className="text-xs text-text-muted hover:text-accent-indigo transition-colors cursor-pointer"
              >
                {social}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
