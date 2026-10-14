export default function Loading() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-48 bg-zinc-800/80 rounded-lg" />
        <div className="h-4 w-80 bg-zinc-900 rounded-md" />
      </div>
      <div className="space-y-4 pt-2">
        {[1, 2, 3].map((index) => (
          <div key={index} className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-zinc-800/80" />
              <div className="h-3.5 w-32 bg-zinc-800/60 rounded" />
              <div className="h-3.5 w-20 bg-zinc-900 rounded ml-auto" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-3/4 bg-zinc-800/90 rounded-md" />
              <div className="h-4 w-full bg-zinc-900/80 rounded" />
              <div className="h-4 w-5/6 bg-zinc-900/60 rounded" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <div className="h-5 w-14 bg-zinc-900 rounded-md border border-zinc-800/50" />
                <div className="h-5 w-16 bg-zinc-900 rounded-md border border-zinc-800/50" />
              </div>
              <div className="h-4 w-12 bg-zinc-900 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}