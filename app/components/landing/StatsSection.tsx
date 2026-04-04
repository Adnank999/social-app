const stats = [
  { value: '50K+', label: 'Active Users', icon: '👥' },
  { value: '1M+',  label: 'Posts Shared', icon: '📸' },
  { value: '200K+', label: 'Friendships', icon: '🤝' },
  { value: '24/7',  label: 'Always Online', icon: '⚡' },
];

export default function StatsSection() {
  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a0a3d 0%, #0d1a3a 50%, #0e1124 100%)' }}
    >
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.6) 40%, rgba(79,70,229,0.6) 60%, transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4) 40%, rgba(79,70,229,0.4) 60%, transparent)' }} />

      {/* Decorative blur */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-48 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(ellipse, #7c3aed, transparent)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div
                className="text-4xl sm:text-5xl font-extrabold mb-1"
                style={{ background: 'linear-gradient(135deg, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                {s.value}
              </div>
              <div className="text-white/50 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
