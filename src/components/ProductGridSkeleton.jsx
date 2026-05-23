import React from 'react';

function ProductGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading products">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#eeeeee] bg-white shadow-sm skeleton-shimmer"
          key={index}
        >
          <div className="h-[240px] bg-[#f5f5f5]" />
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex justify-end">
              <span className="h-3 w-10 rounded-full bg-[#eeeeee]" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded-full bg-[#eeeeee]" />
              <div className="h-4 w-3/4 rounded-full bg-[#eeeeee]" />
            </div>
            <div className="mt-2 h-7 w-24 rounded-full bg-[#eeeeee]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGridSkeleton;
