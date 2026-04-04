import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer
      className="relative py-12 border-t border-white/8"
      style={{ background: '#060410' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Logo & tagline */}
          <div className="flex flex-col items-center md:items-start gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z" fill="white" />
                  <path d="M3 21C3 17.134 7.02944 14 12 14C16.9706 14 21 17.134 21 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-white font-bold text-base">
                Buddy<span className="text-violet-400">Script</span>
              </span>
            </div>
            <p className="text-white/35 text-xs">Connect. Share. Belong.</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { label: 'Feed', href: '/feed' },
              { label: 'Sign In', href: '/auth/login' },
              { label: 'Register', href: '/auth/register' },
              { label: 'Features', href: '#features' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white/40 hover:text-white/80 text-sm transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-white/25 text-xs text-center md:text-right">
            © {new Date().getFullYear()} BuddyScript.
            <br className="hidden md:block" />
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
