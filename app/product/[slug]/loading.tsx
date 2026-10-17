export default function ProductDetailsLoading() {
  return (
    <main
      role="status"
      aria-label="পণ্যের তথ্য লোড হচ্ছে"
      className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8"
    >
      <span className="sr-only">পণ্যের তথ্য লোড হচ্ছে...</span>

      <div aria-hidden="true" className="space-y-6 motion-safe:animate-pulse">
        <div className="h-5 w-36 rounded bg-gray-200" />

        <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="h-24 w-24 shrink-0 rounded-2xl bg-gray-200" />

            <div className="flex-1 space-y-3">
              <div className="h-8 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-100" />
              <div className="h-6 w-24 rounded-full bg-gray-200" />
            </div>

            <div className="space-y-3">
              <div className="h-4 w-20 rounded bg-gray-100" />
              <div className="h-9 w-36 rounded bg-gray-200" />
              <div className="h-6 w-20 rounded-full bg-gray-100" />
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6"
            >
              <div className="h-4 w-24 rounded bg-gray-100" />
              <div className="h-8 w-32 rounded bg-gray-200" />
              <div className="h-3 w-16 rounded bg-gray-100" />
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-6 h-6 w-48 rounded bg-gray-200" />

          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-12 rounded-lg bg-gray-100"
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}