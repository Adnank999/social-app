import Link from 'next/link';
import Image from 'next/image';

const avatars = [
  '/assets/images/card_ppl1.png',
  '/assets/images/card_ppl2.png',
  '/assets/images/card_ppl3.png',
  '/assets/images/card_ppl4.png',
  '/assets/images/people1.png',
];

export default function CTASection() {
  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0c1220 0%, #0a0618 100%)' }}
    >
      {/* Glowing orbs */}
      <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />

      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5) 50%, transparent)' }} />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">

        {/* Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-8">
          <span className="text-lg">🚀</span>
          <span className="text-violet-300 text-xs font-medium tracking-wide">Free to join — no credit card needed</span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
          Ready to find your{' '}
          <span className="gradient-text">community?</span>
        </h2>

        <p className="text-white/55 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Join thousands of people already sharing their stories, making friends,
          and building meaningful connections on BuddyScript.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}
          >
            Create Free Account
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-white/75 border border-white/20 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300"
          >
            Sign In Instead
          </Link>
        </div>

        {/* Social proof avatars */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex -space-x-3">
            {avatars.map((src, i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0618] overflow-hidden shadow-lg">
                <Image src={src} alt="" width={40} height={40} className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-[#0a0618] flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
              50K
            </div>
          </div>
          <p className="text-white/40 text-sm">Join the growing BuddyScript community</p>
        </div>
      </div>
    </section>
  );
}
