export function HackathonCard() {
  return (
    <div className="rounded-xl bg-surface-container overflow-hidden relative aspect-[21/9]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-container/30 via-primary/20 to-surface-container" />
      <div className="absolute inset-0 bg-gradient-to-r from-on-surface/80 via-on-surface/50 to-on-surface/30" />

      {/* Content — horizontal layout */}
      <div className="absolute inset-0 p-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-1.5 py-0.5 bg-primary text-[8px] font-bold text-white uppercase tracking-widest rounded">
              Live Event
            </span>
          </div>
          <h3 className="font-headline text-lg text-white font-semibold leading-snug">
            The Autumn Hackathon 2026
          </h3>
          <p className="text-xs text-white/70 mt-1 leading-relaxed line-clamp-1">
            Join 400+ builders in our largest internal sprint yet.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 bg-white text-on-surface px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/90 transition-colors"
        >
          Apply Now
        </button>
      </div>
    </div>
  )
}
