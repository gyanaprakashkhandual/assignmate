/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Check } from "lucide-react";
import {
  BlockquoteProps,
  HorizontalRuleProps,
  HeadingProps,
  ParagraphProps,
  ListProps,
  ListItemProps,
  TaskListProps,
} from "../types";

export function Blockquote({ children, className = "" }: BlockquoteProps) {
  return (
    <blockquote
      className={`my-4 pl-4 border-l-[3px] border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 italic leading-relaxed ${className}`}
    >
      {children}
    </blockquote>
  );
}

export function HorizontalRule({ className = "" }: HorizontalRuleProps) {
  return (
    <hr
      className={`my-6 border-0 border-t border-gray-200 dark:border-gray-700 ${className}`}
    />
  );
}

const headingStyles = {
  1: "text-2xl font-bold tracking-tight text-black dark:text-white mt-8 mb-4 first:mt-0",
  2: "text-xl font-bold tracking-tight text-black dark:text-white mt-7 mb-3 first:mt-0",
  3: "text-lg font-semibold text-black dark:text-white mt-6 mb-2.5 first:mt-0",
  4: "text-base font-semibold text-black dark:text-white mt-5 mb-2 first:mt-0",
  5: "text-sm font-semibold text-black dark:text-white mt-4 mb-1.5 first:mt-0",
  6: "text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-4 mb-1.5 first:mt-0",
};

export function Heading({ level, children, id, className = "" }: HeadingProps) {
  const Tag = `h${level}` as any;
  return (
    <Tag id={id} className={`${headingStyles[level]} ${className}`}>
      {children}
    </Tag>
  );
}

export function Paragraph({ children, className = "" }: ParagraphProps) {
  return (
    <p
      className={`text-sm leading-relaxed text-gray-800 dark:text-gray-200 my-3 first:mt-0 last:mb-0 ${className}`}
    >
      {children}
    </p>
  );
}

export function List({
  ordered,
  children,
  start = 1,
  className = "",
}: ListProps) {
  if (ordered) {
    return (
      <ol
        start={start}
        className={`my-3 pl-6 space-y-1 list-decimal marker:text-gray-400 dark:marker:text-gray-600 text-sm text-gray-800 dark:text-gray-200 ${className}`}
      >
        {children}
      </ol>
    );
  }
  return (
    <ul
      className={`my-3 pl-6 space-y-1 list-disc marker:text-gray-400 dark:marker:text-gray-600 text-sm text-gray-800 dark:text-gray-200 ${className}`}
    >
      {children}
    </ul>
  );
}

export function ListItem({ children, className = "" }: ListItemProps) {
  return <li className={`leading-relaxed ${className}`}>{children}</li>;
}

export function TaskList({
  items,
  className = "",
  classNames = {},
}: TaskListProps) {
  return (
    <ul className={`my-3 space-y-2 ${classNames.taskList ?? ""} ${className}`}>
      {items.map((item, i) => (
        <li
          key={i}
          className={`flex items-start gap-2.5 text-sm ${classNames.taskItem ?? ""}`}
        >
          <span
            className={`mt-0.5 shrink-0 w-4 h-4 rounded flex items-center justify-center border ${
              item.checked
                ? "bg-black dark:bg-white border-black dark:border-white"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
            } ${classNames.taskCheckbox ?? ""}`}
          >
            {item.checked && (
              <Check
                size={10}
                className="text-white dark:text-black"
                strokeWidth={3}
              />
            )}
          </span>
          <span
            className={`leading-relaxed flex-1 ${item.checked ? "line-through text-gray-400 dark:text-gray-600" : "text-gray-800 dark:text-gray-200"}`}
          >
            {item.content}
          </span>
        </li>
      ))}
    </ul>
  );
}
