import ElectroBorder from "../ElectroBorder";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    from: '#7c3aed',
    to: '#a855f7',
    glowColor: 'rgba(124,58,237,0.35)',
    number: '01',
    label: 'Build Connections',
    desc: 'Find friends, follow creators, and join communities that match your interests and passions.',
    tag: 'Communities',
    distortion: 1.8,
    animationSpeed: 1.2,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    from: '#ec4899',
    to: '#f43f5e',
    glowColor: 'rgba(236,72,153,0.35)',
    number: '02',
    label: 'Share Moments',
    desc: 'Post photos, stories, and life updates that keep your circle in the loop, everywhere.',
    tag: 'Stories',
    distortion: 2.2,
    animationSpeed: 1.2,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    from: '#0ea5e9',
    to: '#2563eb',
    glowColor: 'rgba(14,165,233,0.35)',
    number: '03',
    label: 'Real-Time Chat',
    desc: 'Message anyone instantly. Group chats, reactions, media sharing — all in one place.',
    tag: 'Messaging',
    distortion: 1.5,
    animationSpeed: 1.2,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    from: '#f59e0b',
    to: '#f97316',
    glowColor: 'rgba(245,158,11,0.35)',
    number: '04',
    label: 'Smart Notifications',
    desc: 'Never miss a like, comment, or friend request. Real-time updates delivered instantly.',
    tag: 'Real-time',
    distortion: 2.5,
    animationSpeed: 1.2,
  },
];

export default function FeaturesSection() {
  console.log('rendering features section');
  return (
    <section
      id="features"
      className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0618 0%, #0c1220 100%)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5) 50%, transparent)' }} />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/10 text-violet-300 text-xs font-semibold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Why BuddyScript
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.15] mb-4">
            Everything you need to
            <br />
            <span className="gradient-text">stay connected</span>
          </h2>
          <p className="text-white/45 text-lg max-w-lg mx-auto leading-relaxed">
            A platform designed around real interactions — not algorithms.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <ElectroBorder
              key={f.label}
              borderColor={f.from}
              borderWidth={3}
              distortion={f.distortion}
              animationSpeed={f.animationSpeed}
              glowBlur={40}
              glow
              aura
              radius="24px"
              className="hover:-translate-y-2 transition-transform duration-500"
            >
              <div
                className="group relative flex flex-col rounded-3xl overflow-hidden transition-all duration-500"
                style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(20px)' }}
              >
        
                <div className="flex flex-col flex-1 p-6 gap-5">

                  {/* Number + Tag */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest" style={{ color: f.from }}>
                      {f.number}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        color: f.from,
                        background: f.glowColor.replace('0.35', '0.12'),
                        border: `1px solid ${f.glowColor.replace('0.35', '0.25')}`,
                      }}
                    >
                      {f.tag}
                    </span>
                  </div>

                  {/* Icon */}
                  <div
                    className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${f.from}, ${f.to})`,
                      boxShadow: `0 8px 24px ${f.glowColor}`,
                    }}
                  >
                    {f.icon}
                    <div className="absolute inset-0 rounded-2xl"
                      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)' }} />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-2 flex-1">
                    <h3 className="text-white font-bold text-[17px] leading-snug">{f.label}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
                  </div>

                  {/* Learn more */}
                  <div
                    className="flex items-center gap-1.5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
                    style={{ color: f.from }}
                  >
                    Learn more
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </ElectroBorder>
          ))}
        </div>
      </div>
    </section>
  );
}
