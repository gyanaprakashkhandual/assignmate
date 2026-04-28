"use client";
import { SkeletonProvider, SkeletonRect, SkeletonText } from "@/ui/feedback/skeleton/Skeleton.ui";

export function PdfCardSkeleton() {
    return (
        <SkeletonProvider loading animation="wave" theme="default" radius="md">
            <div className="flex flex-col rounded-2xl border border-gray-100 dark:border-gray-900 overflow-hidden bg-white dark:bg-black">
                <SkeletonRect width="100%" height={144} radius="none" />
                <div className="px-3.5 py-3 space-y-2 border-t border-gray-100 dark:border-gray-900">
                    <SkeletonText lines={1} lineHeight="0.875rem" lastLineWidth="100%" />
                    <SkeletonText lines={1} lineHeight="0.75rem" lastLineWidth="55%" />
                    <SkeletonRect width="100%" height={28} radius="lg" />
                </div>
            </div>
        </SkeletonProvider>
    );
}

export function PdfListRowSkeleton() {
    return (
        <SkeletonProvider loading animation="wave" theme="default" radius="md">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-900">
                <SkeletonRect width={36} height={36} radius="lg" />
                <div className="flex-1 space-y-1.5">
                    <SkeletonText lines={1} lineHeight="0.875rem" lastLineWidth="100%" />
                    <SkeletonText lines={1} lineHeight="0.75rem" lastLineWidth="40%" />
                </div>
                <SkeletonRect width={120} height={28} radius="lg" />
            </div>
        </SkeletonProvider>
    );
}

export function PdfGridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: count }).map((_, i) => (
                <PdfCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function PdfListSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="flex flex-col gap-1.5">
            {Array.from({ length: count }).map((_, i) => (
                <PdfListRowSkeleton key={i} />
            ))}
        </div>
    );
}