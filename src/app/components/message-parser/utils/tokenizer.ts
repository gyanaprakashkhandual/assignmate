export type TokenType =
    | "heading"
    | "codeblock"
    | "blockquote"
    | "table"
    | "hr"
    | "tasklist"
    | "ul"
    | "ol"
    | "callout"
    | "paragraph"
    | "blank";

export interface Token {
    type: TokenType;
    raw: string;
    depth?: number;
    language?: string;
    filename?: string;
    code?: string;
    text?: string;
    items?: TokenListItem[];
    headers?: string[];
    rows?: string[][];
    ordered?: boolean;
    start?: number;
    calloutType?: string;
    calloutTitle?: string;
    calloutBody?: string;
}

export interface TokenListItem {
    content: string;
    checked: boolean | null;
    children?: TokenListItem[];
    ordered?: boolean;
}

const CALLOUT_TYPES = ["info", "warning", "error", "success", "note", "tip"];

function parseTableRow(row: string): string[] {
    return row
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((cell) => cell.trim());
}

function isTableSeparator(row: string): boolean {
    return /^\|?[\s\-:]+(\|[\s\-:]+)*\|?$/.test(row.trim());
}

function parseListItems(lines: string[], ordered: boolean): TokenListItem[] {
    const items: TokenListItem[] = [];
    const re = ordered ? /^(\d+)\.\s+(.*)/ : /^[-*+]\s+(.*)/;
    const taskRe = /^\[([xX ])\]\s+(.*)/;

    for (const line of lines) {
        const m = line.match(re);
        if (!m) continue;
        const rawContent = ordered ? m[2] : m[1];
        const taskMatch = rawContent.match(taskRe);
        if (taskMatch) {
            items.push({
                checked: taskMatch[1].toLowerCase() === "x",
                content: taskMatch[2],
            });
        } else {
            items.push({ checked: null, content: rawContent });
        }
    }
    return items;
}

export function tokenize(markdown: string): Token[] {
    const tokens: Token[] = [];
    const lines = markdown.split("\n");
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        if (line.trim() === "") {
            i++;
            continue;
        }

        const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
        if (headingMatch) {
            tokens.push({
                type: "heading",
                raw: line,
                depth: headingMatch[1].length,
                text: headingMatch[2],
            });
            i++;
            continue;
        }

        if (line.trim() === "---" || line.trim() === "***" || line.trim() === "___") {
            tokens.push({ type: "hr", raw: line });
            i++;
            continue;
        }

        if (line.startsWith("```") || line.startsWith("~~~")) {
            const fence = line.startsWith("```") ? "```" : "~~~";
            const meta = line.slice(fence.length).trim();
            const parts = meta.split(/\s+/);
            const language = parts[0] || "";
            const filename = parts.slice(1).join(" ") || undefined;
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].startsWith(fence)) {
                codeLines.push(lines[i]);
                i++;
            }
            i++;
            tokens.push({
                type: "codeblock",
                raw: "",
                language,
                filename,
                code: codeLines.join("\n"),
            });
            continue;
        }

        if (line.startsWith(">")) {
            const calloutMatch = line.match(/^>\s*\[!([\w]+)\](?:\s+(.*))?/i);
            if (calloutMatch) {
                const calloutType = calloutMatch[1].toLowerCase();
                const calloutTitle = calloutMatch[2] || calloutMatch[1];
                const bodyLines: string[] = [];
                i++;
                while (i < lines.length && lines[i].startsWith(">")) {
                    bodyLines.push(lines[i].replace(/^>\s?/, ""));
                    i++;
                }
                if (CALLOUT_TYPES.includes(calloutType)) {
                    tokens.push({
                        type: "callout",
                        raw: "",
                        calloutType,
                        calloutTitle,
                        calloutBody: bodyLines.join("\n"),
                    });
                    continue;
                }
            }

            const quoteLines: string[] = [line.replace(/^>\s?/, "")];
            i++;
            while (i < lines.length && lines[i].startsWith(">")) {
                quoteLines.push(lines[i].replace(/^>\s?/, ""));
                i++;
            }
            tokens.push({ type: "blockquote", raw: "", text: quoteLines.join("\n") });
            continue;
        }

        if (line.startsWith("|") || (lines[i + 1] && isTableSeparator(lines[i + 1] || ""))) {
            const tableLines: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith("|")) {
                tableLines.push(lines[i]);
                i++;
            }
            if (tableLines.length >= 2) {
                const headers = parseTableRow(tableLines[0]);
                const rows = tableLines
                    .slice(2)
                    .filter((r) => !isTableSeparator(r))
                    .map(parseTableRow);
                tokens.push({ type: "table", raw: "", headers, rows });
                continue;
            }
        }

        const ulMatch = line.match(/^([-*+])\s/);
        const olMatch = line.match(/^(\d+)\.\s/);

        if (ulMatch || olMatch) {
            const ordered = !!olMatch;
            const startNum = olMatch ? parseInt(olMatch[1], 10) : 1;
            const listLines: string[] = [line];
            i++;
            while (i < lines.length && (lines[i].match(/^[-*+]\s/) || lines[i].match(/^\d+\.\s/) || lines[i].startsWith("  "))) {
                listLines.push(lines[i]);
                i++;
            }

            const hasTasks = listLines.some((l) => l.match(/^[-*+]\s+\[([xX ])\]/));
            tokens.push({
                type: hasTasks ? "tasklist" : ordered ? "ol" : "ul",
                raw: "",
                ordered,
                start: startNum,
                items: parseListItems(listLines, ordered),
            });
            continue;
        }

        const paraLines: string[] = [line];
        i++;
        while (
            i < lines.length &&
            lines[i].trim() !== "" &&
            !lines[i].match(/^#{1,6}\s/) &&
            !lines[i].startsWith("```") &&
            !lines[i].startsWith("~~~") &&
            !lines[i].startsWith(">") &&
            !lines[i].startsWith("|") &&
            !lines[i].match(/^[-*+]\s/) &&
            !lines[i].match(/^\d+\.\s/) &&
            lines[i].trim() !== "---" &&
            lines[i].trim() !== "***"
        ) {
            paraLines.push(lines[i]);
            i++;
        }

        tokens.push({ type: "paragraph", raw: "", text: paraLines.join("\n") });
    }

    return tokens;
}