"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import { tokenize } from "../utils/tokenizer";
import { renderInline } from "../components/Inline";
import { useStreamingCursor } from "@/app/hooks/useStreamingCursor.hooks";
import { CodeBlock } from "../components/Code.block";
import { Table } from "../components/Table";
import { Callout } from "../components/Callout";
import {
  Blockquote,
  HorizontalRule,
  Heading,
  Paragraph,
  List,
  ListItem,
  TaskList,
} from "../components/Typography";
import {
  MessageParserProps,
  MessageParserClassNames,
  MessageParserComponents,
} from "../types";

const blockTransition: Transition = { duration: 0.18, ease: "easeOut" };

interface RenderOptions {
  classNames: MessageParserClassNames;
  components: MessageParserComponents;
  onLinkClick?: (href: string) => void;
}

function renderTokens(content: string, opts: RenderOptions): React.ReactNode[] {
  const { classNames, components, onLinkClick } = opts;
  const tokens = tokenize(content);
  const inlineOpts = { classNames, components, onLinkClick };

  return tokens.map((token, idx) => {
    const key = `token-${idx}`;

    switch (token.type) {
      case "heading": {
        const level = (token.depth ?? 1) as 1 | 2 | 3 | 4 | 5 | 6;
        const HeadingComp = components.Heading ?? Heading;
        const slug = (token.text ?? "")
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");
        return (
          <HeadingComp
            key={key}
            level={level}
            id={slug}
            className={classNames[`h${level}`]}
          >
            {renderInline(token.text ?? "", inlineOpts, key)}
          </HeadingComp>
        );
      }

      case "codeblock": {
        const CB = components.CodeBlock ?? CodeBlock;
        return (
          <CB
            key={key}
            code={token.code ?? ""}
            language={token.language}
            filename={token.filename}
            className={classNames.codeBlock}
            classNames={{
              codeBlock: classNames.codeBlock,
              codeBlockHeader: classNames.codeBlockHeader,
              codeBlockBody: classNames.codeBlockBody,
              codeBlockLanguage: classNames.codeBlockLanguage,
              codeBlockCopyButton: classNames.codeBlockCopyButton,
            }}
          />
        );
      }

      case "blockquote": {
        const BQ = components.Blockquote ?? Blockquote;
        const inner = renderTokens(token.text ?? "", opts);
        return (
          <BQ key={key} className={classNames.blockquote}>
            {inner.length
              ? inner
              : renderInline(token.text ?? "", inlineOpts, key)}
          </BQ>
        );
      }

      case "table": {
        const TComp = components.Table ?? Table;
        return (
          <TComp
            key={key}
            headers={token.headers ?? []}
            rows={token.rows ?? []}
            className={classNames.table}
            classNames={{
              table: classNames.table,
              tableWrapper: classNames.tableWrapper,
              thead: classNames.thead,
              tbody: classNames.tbody,
              tr: classNames.tr,
              th: classNames.th,
              td: classNames.td,
            }}
          />
        );
      }

      case "hr": {
        const HR = components.HorizontalRule ?? HorizontalRule;
        return <HR key={key} className={classNames.hr} />;
      }

      case "callout": {
        const CalloutComp = components.Callout ?? Callout;
        const calloutType = (token.calloutType ?? "info") as
          | "info"
          | "warning"
          | "error"
          | "success"
          | "note"
          | "tip";
        const inner = token.calloutBody
          ? renderTokens(token.calloutBody, opts)
          : null;
        return (
          <CalloutComp
            key={key}
            type={calloutType}
            title={token.calloutTitle}
            className={classNames.callout}
            classNames={{
              callout: classNames.callout,
              calloutTitle: classNames.calloutTitle,
              calloutBody: classNames.calloutBody,
            }}
          >
            {inner}
          </CalloutComp>
        );
      }

      case "tasklist": {
        const TL = components.TaskList ?? TaskList;
        const items = (token.items ?? []).map((item) => ({
          checked: item.checked ?? false,
          content: renderInline(item.content, inlineOpts, `task-${idx}`),
        }));
        return (
          <TL
            key={key}
            items={items}
            className={classNames.taskList}
            classNames={{
              taskList: classNames.taskList,
              taskItem: classNames.taskItem,
              taskCheckbox: classNames.taskCheckbox,
            }}
          />
        );
      }

      case "ul":
      case "ol": {
        const ordered = token.type === "ol";
        const ListComp = components.List ?? List;
        const ListItemComp = components.ListItem ?? ListItem;
        return (
          <ListComp
            key={key}
            ordered={ordered}
            start={token.start}
            className={classNames[ordered ? "ol" : "ul"]}
          >
            {(token.items ?? []).map((item, li) => (
              <ListItemComp key={li} className={classNames.li}>
                {renderInline(item.content, inlineOpts, `li-${idx}-${li}`)}
              </ListItemComp>
            ))}
          </ListComp>
        );
      }

      case "paragraph": {
        const Para = components.Paragraph ?? Paragraph;
        return (
          <Para key={key} className={classNames.paragraph}>
            {renderInline(token.text ?? "", inlineOpts, key)}
          </Para>
        );
      }

      default:
        return null;
    }
  });
}

export function MessageParser({
  content,
  classNames = {},
  components = {},
  className = "",
  streaming = false,
  onLinkClick,
}: MessageParserProps) {
  const cursorVisible = useStreamingCursor(streaming);

  const rendered = useMemo(
    () => renderTokens(content, { classNames, components, onLinkClick }),
    [content, classNames, components, onLinkClick],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={blockTransition}
      className={`message-parser w-full min-w-0 ${className}`}
    >
      {rendered}
      {streaming && cursorVisible && (
        <span
          className="inline-block w-0.5 h-4 bg-gray-800 dark:bg-gray-200 ml-0.5 align-middle animate-pulse"
          aria-hidden
        />
      )}
    </motion.div>
  );
}
