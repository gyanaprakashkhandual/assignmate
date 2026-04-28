"use client";
import { SkeletonProvider, SkeletonRect, SkeletonText, SkeletonCircle } from "@/ui/feedback/skeleton/Skeleton.ui"

export function HistorySessionCardSkeleton() {
    return (
        <SkeletonProvider loading animation="wave" theme="default" radius="md">
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-100 dark:border-gray-900 bg-white dark:bg-black">
                <SkeletonRect width={16} height={16} radius="sm" />
                <SkeletonCircle size={32} />
                <div className="flex-1 min-w-0 space-y-2">
                    <SkeletonText lines={1} lineHeight="0.875rem" lastLineWidth="100%" />
                    <SkeletonText lines={1} lineHeight="0.75rem" lastLineWidth="40%" />
                </div>
                <SkeletonRect width={28} height={28} radius="lg" />
            </div>
        </SkeletonProvider>
    );
}

export function HistoryListSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="flex flex-col gap-2">
            {Array.from({ length: count }).map((_, i) => (
                <HistorySessionCardSkeleton key={i} />
            ))}
        </div>
    );
}