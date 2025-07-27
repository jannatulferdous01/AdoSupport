import { Skeleton } from "@/components/ui/skeleton";

export default function PostDetailSkeleton() {
  return (
    <main className="max-w-4xl mx-auto pb-16 px-4 sm:px-6">
      {/* Header skeleton */}
      <div className="py-6 flex items-center text-sm">
        <Skeleton className="h-5 w-32" />
      </div>

      <div className="space-y-6">
        {/* Post article skeleton */}
        <article className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {/* Author and metadata skeleton */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-40 mb-2" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>

            {/* Post title skeleton */}
            <Skeleton className="h-8 w-3/4 mb-6" />

            {/* Post content skeleton - Multiple lines */}
            <div className="space-y-3 mb-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Post image skeleton (50% chance) */}
            {Math.random() > 0.5 && (
              <Skeleton className="h-64 w-full rounded-lg mt-5" />
            )}

            {/* Tags skeleton */}
            <div className="flex flex-wrap gap-1 mt-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>

          {/* Actions skeleton */}
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </article>

        {/* Comments section skeleton */}
        <section className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {/* Comments header */}
          <div className="p-4 md:p-5 border-b border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-40" />
            </div>
          </div>

          {/* Comment input area */}
          <div className="p-4 md:p-5 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-[72px] w-full rounded-md mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>

          {/* Comment items */}
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 md:p-5">
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Skeleton className="h-4 w-32" />
                      {Math.random() > 0.7 && (
                        <Skeleton className="h-4 w-16 rounded-full" />
                      )}
                    </div>
                    <Skeleton className="h-3 w-24 mb-2" />
                    <div className="space-y-2 mb-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-7 w-16 rounded-md" />
                      <Skeleton className="h-7 w-16 rounded-md" />
                    </div>

                    {/* Add a nested reply for one comment */}
                    {i === 2 && (
                      <div className="mt-4 pl-6 border-l-2 border-gray-100">
                        <div className="flex gap-3">
                          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-28 mb-1" />
                            <Skeleton className="h-3 w-20 mb-2" />
                            <div className="space-y-2 mb-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>
                            <div className="flex gap-2">
                              <Skeleton className="h-6 w-14 rounded-md" />
                              <Skeleton className="h-6 w-14 rounded-md" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}