export default function PostCardSkeleton() {
  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16 animate-pulse">
      {/* Header */}
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Avatar */}
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#e0e0e0', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Author name */}
              <div style={{ width: 120, height: 12, borderRadius: 6, background: '#e0e0e0' }} />
              {/* Time */}
              <div style={{ width: 80, height: 10, borderRadius: 6, background: '#e0e0e0' }} />
            </div>
          </div>
          {/* Dropdown dots */}
          <div style={{ width: 20, height: 20, borderRadius: 4, background: '#e0e0e0' }} />
        </div>

        {/* Post text lines */}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ width: '100%', height: 12, borderRadius: 6, background: '#e0e0e0' }} />
          <div style={{ width: '80%', height: 12, borderRadius: 6, background: '#e0e0e0' }} />
          <div style={{ width: '60%', height: 12, borderRadius: 6, background: '#e0e0e0' }} />
        </div>
      </div>

      {/* Reaction bar */}
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 60, height: 10, borderRadius: 6, background: '#e0e0e0' }} />
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ width: 70, height: 10, borderRadius: 6, background: '#e0e0e0' }} />
          <div style={{ width: 50, height: 10, borderRadius: 6, background: '#e0e0e0' }} />
        </div>
      </div>

      {/* Divider */}
      <div style={{ margin: '12px 24px', height: 1, background: '#e0e0e0' }} />

      {/* Action buttons */}
      <div className="_feed_inner_timeline_reaction" style={{ padding: '0 24px', display: 'flex', gap: 8 }}>
        {[90, 100, 80].map((w, i) => (
          <div
            key={i}
            style={{ width: w, height: 32, borderRadius: 6, background: '#e0e0e0' }}
          />
        ))}
      </div>
    </div>
  );
}
