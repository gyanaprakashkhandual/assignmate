/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";

export function useStreamingCursor(streaming: boolean): boolean {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!streaming) {
            setVisible(false);
            return;
        }
        const id = setInterval(() => setVisible((v) => !v), 500);
        return () => clearInterval(id);
    }, [streaming]);

    return visible && streaming;
}