import React from "react";
import { MessageParserClassNames, MessageParserComponents } from "../types";

interface InlineOptions {
  classNames?: MessageParserClassNames;
  components?: MessageParserComponents;
  onLinkClick?: (href: string) => void;
}

type InlineNode =
  | { type: "text"; value: string }
  | { type: "strong"; children: InlineNode[] }
  | { type: "em"; children: InlineNode[] }
  | { type: "del"; children: InlineNode[] }
  | { type: "code"; value: string }
  | { type: "link"; href: string; children: InlineNode[] }
  | { type: "image"; src: string; alt: string; title?: string }
  | { type: "kbd"; value: string }
  | { type: "mark"; children: InlineNode[] }
  | { type: "br" }
  | { type: "badge"; value: string }
  | { type: "button"; value: string; href?: string };

function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let i = 0;

  while (i < text.length) {
    if (text[i] === "\\" && i + 1 < text.length) {
      nodes.push({ type: "text", value: text[i + 1] });
      i += 2;
      continue;
    }

    if (text.slice(i, i + 2) === "  " && text[i + 2] === "\n") {
      nodes.push({ type: "br" });
      i += 3;
      continue;
    }

    if (text[i] === "\n") {
      nodes.push({ type: "text", value: " " });
      i++;
      continue;
    }

    if (text.slice(i, i + 2) === "**" || text.slice(i, i + 2) === "__") {
      const marker = text.slice(i, i + 2);
      const end = text.indexOf(marker, i + 2);
      if (end !== -1) {
        const inner = parseInline(text.slice(i + 2, end));
        nodes.push({ type: "strong", children: inner });
        i = end + 2;
        continue;
      }
    }

    if (text[i] === "*" || text[i] === "_") {
      const marker = text[i];
      const end = text.indexOf(marker, i + 1);
      if (end !== -1 && end !== i + 1) {
        const inner = parseInline(text.slice(i + 1, end));
        nodes.push({ type: "em", children: inner });
        i = end + 1;
        continue;
      }
    }

    if (text.slice(i, i + 2) === "~~") {
      const end = text.indexOf("~~", i + 2);
      if (end !== -1) {
        const inner = parseInline(text.slice(i + 2, end));
        nodes.push({ type: "del", children: inner });
        i = end + 2;
        continue;
      }
    }

    if (text.slice(i, i + 2) === "==") {
      const end = text.indexOf("==", i + 2);
      if (end !== -1) {
        const inner = parseInline(text.slice(i + 2, end));
        nodes.push({ type: "mark", children: inner });
        i = end + 2;
        continue;
      }
    }

    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        nodes.push({ type: "code", value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }

    const kbdMatch = text.slice(i).match(/^<kbd>(.*?)<\/kbd>/i);
    if (kbdMatch) {
      nodes.push({ type: "kbd", value: kbdMatch[1] });
      i += kbdMatch[0].length;
      continue;
    }

    const badgeMatch = text.slice(i).match(/^\[:([^\]]+)\]/);
    if (badgeMatch) {
      nodes.push({ type: "badge", value: badgeMatch[1] });
      i += badgeMatch[0].length;
      continue;
    }

    const btnMatch = text.slice(i).match(/^\[btn:([^\]]+)\](?:\(([^)]+)\))?/);
    if (btnMatch) {
      nodes.push({ type: "button", value: btnMatch[1], href: btnMatch[2] });
      i += btnMatch[0].length;
      continue;
    }

    const imgMatch = text
      .slice(i)
      .match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/);
    if (imgMatch) {
      nodes.push({
        type: "image",
        src: imgMatch[2],
        alt: imgMatch[1],
        title: imgMatch[3],
      });
      i += imgMatch[0].length;
      continue;
    }

    const linkMatch = text
      .slice(i)
      .match(/^\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
    if (linkMatch) {
      const inner = parseInline(linkMatch[1]);
      nodes.push({ type: "link", href: linkMatch[2], children: inner });
      i += linkMatch[0].length;
      continue;
    }

    const autoLink = text.slice(i).match(/^(https?:\/\/[^\s<>)"]+)/);
    if (autoLink) {
      nodes.push({
        type: "link",
        href: autoLink[1],
        children: [{ type: "text", value: autoLink[1] }],
      });
      i += autoLink[0].length;
      continue;
    }

    const last = nodes[nodes.length - 1];
    if (last && last.type === "text") {
      last.value += text[i];
    } else {
      nodes.push({ type: "text", value: text[i] });
    }
    i++;
  }

  return nodes;
}

function renderInlineNodes(
  nodes: InlineNode[],
  options: InlineOptions,
  keyPrefix: string,
): React.ReactNode[] {
  const { classNames = {}, components = {}, onLinkClick } = options;

  return nodes.map((node, idx) => {
    const key = `${keyPrefix}-${idx}`;

    switch (node.type) {
      case "text":
        return node.value;

      case "br":
        return React.createElement("br", { key });

      case "strong":
        return React.createElement(
          "strong",
          { key, className: `font-semibold ${classNames.strong ?? ""}` },
          ...renderInlineNodes(node.children, options, key),
        );

      case "em":
        return React.createElement(
          "em",
          { key, className: `italic ${classNames.em ?? ""}` },
          ...renderInlineNodes(node.children, options, key),
        );

      case "del":
        return React.createElement(
          "del",
          { key, className: `line-through ${classNames.del ?? ""}` },
          ...renderInlineNodes(node.children, options, key),
        );

      case "code": {
        const IC = components.InlineCode;
        if (IC)
          return React.createElement(
            IC,
            { key, className: classNames.inlineCode },
            node.value,
          );
        return React.createElement(
          "code",
          {
            key,
            className: `font-mono text-[0.85em] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 ${classNames.inlineCode ?? ""}`,
          },
          node.value,
        );
      }

      case "link": {
        const LC = components.Link;
        const isExternal = node.href.startsWith("http");
        const children = renderInlineNodes(node.children, options, key);
        if (LC)
          return React.createElement(
            LC,
            {
              key,
              href: node.href,
              external: isExternal,
              className: classNames.link,
            },
            ...children,
          );
        return React.createElement(
          "a",
          {
            key,
            href: node.href,
            target: isExternal ? "_blank" : undefined,
            rel: isExternal ? "noopener noreferrer" : undefined,
            onClick: onLinkClick
              ? (e: React.MouseEvent) => {
                  e.preventDefault();
                  onLinkClick(node.href);
                }
              : undefined,
            className: `text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-100 ${classNames.link ?? ""}`,
          },
          ...children,
        );
      }

      case "image": {
        const IC2 = components.Image;
        if (IC2)
          return React.createElement(IC2, {
            key,
            src: node.src,
            alt: node.alt,
            title: node.title,
            classNames: {
              image: classNames.image,
              imageWrapper: classNames.imageWrapper,
            },
          });
        return React.createElement(
          "span",
          { key, className: `inline-block ${classNames.imageWrapper ?? ""}` },
          React.createElement("img", {
            src: node.src,
            alt: node.alt,
            title: node.title,
            className: `max-w-full h-auto rounded-md ${classNames.image ?? ""}`,
          }),
        );
      }

      case "kbd":
        return React.createElement(
          "kbd",
          {
            key,
            className: `font-mono text-xs px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm ${classNames.kbd ?? ""}`,
          },
          node.value,
        );

      case "mark":
        return React.createElement(
          "mark",
          {
            key,
            className: `bg-yellow-200 dark:bg-yellow-800/50 text-black dark:text-white px-0.5 rounded ${classNames.mark ?? ""}`,
          },
          ...renderInlineNodes(node.children, options, key),
        );

      case "badge": {
        const BC = components.Badge;
        if (BC)
          return React.createElement(
            BC,
            { key, className: classNames.badge },
            node.value,
          );
        return React.createElement(
          "span",
          {
            key,
            className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 ${classNames.badge ?? ""}`,
          },
          node.value,
        );
      }

      case "button": {
        const BtnC = components.Button;
        if (BtnC)
          return React.createElement(
            BtnC,
            { key, href: node.href, className: classNames.button },
            node.value,
          );
        const El = node.href ? "a" : "button";
        return React.createElement(
          El,
          {
            key,
            href: node.href,
            target: node.href?.startsWith("http") ? "_blank" : undefined,
            rel: node.href?.startsWith("http")
              ? "noopener noreferrer"
              : undefined,
            className: `inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-150 ${classNames.button ?? ""}`,
          },
          node.value,
        );
      }

      default:
        return null;
    }
  });
}

export function renderInline(
  text: string,
  options: InlineOptions = {},
  keyPrefix = "inline",
): React.ReactNode {
  const nodes = parseInline(text);
  const rendered = renderInlineNodes(nodes, options, keyPrefix);
  return rendered;
}
