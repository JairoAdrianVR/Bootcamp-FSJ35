import React from 'react';

export default function LugarLoading() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16 animate-pulse">
      {/* Top bar skeleton */}
      <div className="h-10 bg-slate-200 border-b border-slate-200" />

      {/* Hero skeleton */}
      <div className="h-[50vh] bg-slate-300 w-full" />

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 h-64">
              <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-5/6" />
                <div className="h-4 bg-slate-100 rounded w-4/6" />
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-slate-200 h-64">
              <div className="h-6 bg-slate-200 rounded w-1/4 mb-4" />
              <div className="grid grid-cols-3 gap-4">
                <div className="aspect-[4/3] bg-slate-100 rounded-2xl" />
                <div className="aspect-[4/3] bg-slate-100 rounded-2xl" />
                <div className="aspect-[4/3] bg-slate-100 rounded-2xl" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 h-80" />
          </div>
        </div>
      </div>
    </div>
  );
}
