export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero skeleton */}
      <section className="rounded-es-[40px] bg-gray-200 pt-16 pb-6 lg:rounded-es-[80px] lg:pt-20 lg:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <div className="h-10 w-3/4 rounded-lg bg-gray-300" />
              <div className="mt-6 h-64 w-full rounded-3xl bg-gray-300 sm:h-80 lg:h-[370px]" />
              <div className="mt-4 h-6 w-1/2 rounded bg-gray-300" />
              <div className="mt-2 h-4 w-full rounded bg-gray-300" />
            </div>
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              <div className="h-32 rounded-2xl bg-gray-300" />
              <div className="h-32 rounded-2xl bg-gray-300" />
              <div className="h-32 rounded-2xl bg-gray-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-8 w-1/3 rounded-lg bg-gray-200" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
