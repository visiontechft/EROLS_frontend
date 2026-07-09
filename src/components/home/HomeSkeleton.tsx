/** Mirrors the real Home layout's proportions so the swap-in feels instant
 * and nothing jumps (no CLS) once the real data arrives. */
export function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Hero */}
      <div className="bg-gray-950 py-14 lg:py-24">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="h-6 w-40 rounded-full bg-white/10" />
            <div className="h-12 w-full max-w-md rounded-lg bg-white/10" />
            <div className="h-12 w-3/4 rounded-lg bg-white/10" />
            <div className="h-4 w-full max-w-lg rounded bg-white/10" />
            <div className="flex gap-3 pt-2">
              <div className="h-14 w-48 rounded-full bg-white/10" />
              <div className="h-14 w-48 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="hidden lg:block h-[440px] rounded-3xl bg-white/5" />
        </div>
      </div>

      {/* Search bar */}
      <div className="relative -mt-8 lg:-mt-10 z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto h-16 rounded-full bg-gray-100" />
      </div>

      {/* Categories */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="h-8 w-56 rounded bg-gray-100 mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-56 lg:h-64 rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>

      {/* Product carousel */}
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-56 rounded bg-gray-200 mb-10" />
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[240px] sm:w-[260px] space-y-3">
                <div className="aspect-square rounded-2xl bg-gray-200" />
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
