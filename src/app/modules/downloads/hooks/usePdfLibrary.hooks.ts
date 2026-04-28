/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { fetchUserPdfs } from "@/app/lib/features/chat/chat.slice";
import { selectPdfs, selectPdfsPagination, selectIsFetchingPdfs, selectChatError } from "@/app/lib/features/chat/chat.selector";
import { IPdfRecord, IGetUserPdfsPayload } from "@/app/lib/types/chat.types";
import { PdfFilterState } from "../types/pdf.types";

const PAGE_LIMIT = 18;

const defaultFilters: PdfFilterState = {
    exportedBy: "all",
    sortOrder: "desc",
    from: "",
    to: "",
    q: "",
};

export function usePdfLibrary() {
    const dispatch = useAppDispatch();
    const storePdfs = useAppSelector(selectPdfs);
    const pagination = useAppSelector(selectPdfsPagination);
    const isFetching = useAppSelector(selectIsFetchingPdfs);
    const error = useAppSelector(selectChatError);

    const [displayedPdfs, setDisplayedPdfs] = useState<IPdfRecord[]>([]);
    const [filters, setFilters] = useState<PdfFilterState>(defaultFilters);
    const [page, setPage] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const buildParams = useCallback(
        (pageNum: number, overrideFilters?: PdfFilterState): IGetUserPdfsPayload => {
            const f = overrideFilters ?? filters;
            return {
                sortOrder: f.sortOrder,
                page: pageNum,
                limit: PAGE_LIMIT,
                ...(f.exportedBy !== "all" && { exportedBy: f.exportedBy as "auto" | "manual" }),
                ...(f.from && { from: f.from }),
                ...(f.to && { to: f.to }),
                ...(f.q.trim() && { q: f.q.trim() }),
            };
        },
        [filters]
    );

    const fetchPage = useCallback(
        async (pageNum: number, reset = false, overrideFilters?: PdfFilterState) => {
            if (pageNum > 1) setIsFetchingMore(true);
            try {
                const result = await dispatch(fetchUserPdfs(buildParams(pageNum, overrideFilters)));
                const payload = result.payload as { pdfs: IPdfRecord[]; pagination: { totalPages: number } } | undefined;
                const newPdfs = payload?.pdfs ?? [];
                const totalPages = payload?.pagination?.totalPages ?? 1;

                if (reset || pageNum === 1) {
                    setDisplayedPdfs(newPdfs);
                } else {
                    setDisplayedPdfs((prev) => {
                        const existingIds = new Set(prev.map((p) => p.id));
                        return [...prev, ...newPdfs.filter((p) => !existingIds.has(p.id))];
                    });
                }
                setHasMore(pageNum < totalPages);
            } finally {
                setIsFetchingMore(false);
                setIsInitialLoad(false);
            }
        },
        [dispatch, buildParams]
    );

    useEffect(() => {
        fetchPage(1, true);
    }, [fetchPage]);

    const updateFilter = useCallback(
        <K extends keyof PdfFilterState>(key: K, value: PdfFilterState[K]) => {
            setFilters((prev: any) => {
                const next = { ...prev, [key]: value };
                setPage(1);
                if (key !== "q") {
                    fetchPage(1, true, next);
                }
                return next;
            });
        },
        [fetchPage]
    );

    const handleSearchChange = useCallback(
        (q: string) => {
            setFilters((prev: any) => ({ ...prev, q }));
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
            searchTimeout.current = setTimeout(() => {
                setPage(1);
                setFilters((prev: any) => {
                    fetchPage(1, true, { ...prev, q });
                    return prev;
                });
            }, 300);
        },
        [fetchPage]
    );

    const loadMore = useCallback(() => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPage(nextPage, false);
    }, [page, fetchPage]);

    const resetFilters = useCallback(() => {
        setFilters(defaultFilters);
        setPage(1);
        fetchPage(1, true, defaultFilters);
    }, [fetchPage]);

    const refresh = useCallback(() => {
        setPage(1);
        fetchPage(1, true);
    }, [fetchPage]);

    const hasActiveFilters =
        filters.exportedBy !== "all" ||
        filters.sortOrder !== "desc" ||
        filters.from !== "" ||
        filters.to !== "" ||
        filters.q.trim() !== "";

    return {
        pdfs: displayedPdfs,
        pagination,
        filters,
        isFetching,
        isFetchingMore,
        isInitialLoad,
        hasMore,
        error,
        hasActiveFilters,
        updateFilter,
        handleSearchChange,
        loadMore,
        resetFilters,
        refresh,
    };
}