/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, {
  useEffect,
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import {
  ActionMenuProvider,
  useActionMenuContext,
  type ActionMenuProviderProps,
  type ActionItem,
  type ActionMenuSize,
  type ActionItemVariant,
  type MenuAlign,
} from "./Action.menu.context";

const sizeConfig = {
  sm: {
    menuWidth: 176,
    itemPx: "px-2",
    itemPy: "py-1",
    itemText: "text-xs",
    iconSize: 13,
    trailingTextSize: "text-[10px]",
    headerText: "text-[10px]",
    descText: "text-[10px]",
    chevronSize: 10,
    triggerPx: "px-2",
    triggerPy: "py-1",
    triggerText: "text-xs",
    triggerIconSize: 13,
    backBtnPy: "py-1",
    backBtnPx: "px-2",
  },
  md: {
    menuWidth: 220,
    itemPx: "px-2.5",
    itemPy: "py-1.5",
    itemText: "text-sm",
    iconSize: 15,
    trailingTextSize: "text-xs",
    headerText: "text-[10px]",
    descText: "text-xs",
    chevronSize: 12,
    triggerPx: "px-3",
    triggerPy: "py-1.5",
    triggerText: "text-sm",
    triggerIconSize: 15,
    backBtnPy: "py-1.5",
    backBtnPx: "px-2.5",
  },
  lg: {
    menuWidth: 256,
    itemPx: "px-3",
    itemPy: "py-2",
    itemText: "text-sm",
    iconSize: 16,
    trailingTextSize: "text-xs",
    headerText: "text-[11px]",
    descText: "text-xs",
    chevronSize: 13,
    triggerPx: "px-3.5",
    triggerPy: "py-2",
    triggerText: "text-sm",
    triggerIconSize: 16,
    backBtnPy: "py-2",
    backBtnPx: "px-3",
  },
  xl: {
    menuWidth: 288,
    itemPx: "px-3.5",
    itemPy: "py-2.5",
    itemText: "text-sm",
    iconSize: 17,
    trailingTextSize: "text-sm",
    headerText: "text-xs",
    descText: "text-xs",
    chevronSize: 14,
    triggerPx: "px-4",
    triggerPy: "py-2.5",
    triggerText: "text-base",
    triggerIconSize: 17,
    backBtnPy: "py-2.5",
    backBtnPx: "px-3.5",
  },
};

const variantStyles: Record<ActionItemVariant, string> = {
  default:
    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
  danger:
    "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40",
  warning:
    "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40",
  success:
    "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40",
};

const variantIconStyles: Record<ActionItemVariant, string> = {
  default: "text-gray-400 dark:text-gray-500",
  danger: "text-red-500 dark:text-red-400",
  warning: "text-amber-500 dark:text-amber-400",
  success: "text-emerald-500 dark:text-emerald-400",
};

const MENU_GAP = 6;

type ResolvedAlign = "bottom-left" | "bottom-right" | "top-left" | "top-right";

interface MenuPosition {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

function computeMenuPosition(
  triggerRect: DOMRect,
  menuWidth: number,
  menuHeight: number,
  preferred: MenuAlign,
): { pos: MenuPosition; resolved: ResolvedAlign } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const spaceBelow = vh - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  const spaceRight = vw - triggerRect.left;
  const spaceLeft = triggerRect.right;

  let vert: "bottom" | "top";
  let horiz: "left" | "right";

  if (preferred !== "auto") {
    [vert, horiz] = preferred.split("-") as [
      "bottom" | "top",
      "left" | "right",
    ];
  } else {
    vert =
      spaceBelow >= menuHeight || spaceBelow >= spaceAbove ? "bottom" : "top";
    horiz = spaceRight >= menuWidth ? "left" : "right";
  }

  const pos: MenuPosition = {};

  if (vert === "bottom") {
    pos.top = triggerRect.bottom + MENU_GAP + window.scrollY;
  } else {
    pos.top = triggerRect.top - menuHeight - MENU_GAP + window.scrollY;
  }

  if (horiz === "left") {
    const left = triggerRect.left + window.scrollX;
    pos.left = Math.min(left, vw - menuWidth - 8);
  } else {
    const right = vw - triggerRect.right + window.scrollX;
    pos.left = Math.max(triggerRect.right - menuWidth + window.scrollX, 8);
  }

  return { pos, resolved: `${vert}-${horiz}` as ResolvedAlign };
}

function computeSubmenuPosition(
  itemRect: DOMRect,
  menuWidth: number,
): { left: number; top: number } {
  const vw = window.innerWidth;
  const spaceRight = vw - itemRect.right;
  const left =
    spaceRight >= menuWidth + 4
      ? itemRect.right + 4 + window.scrollX
      : itemRect.left - menuWidth - 4 + window.scrollX;
  const top = itemRect.top + window.scrollY;
  return { left, top };
}

import type { Transition } from "framer-motion";

const menuTransition: Transition = { duration: 0.13, ease: "easeOut" };
const menuMotion = {
  initial: { opacity: 0, scale: 0.97, y: -4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: -4 },
  transition: menuTransition,
};

const submenuTransition: Transition = { duration: 0.12, ease: "easeOut" };
const submenuMotion = {
  initial: { opacity: 0, x: 6, scale: 0.97 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 6, scale: 0.97 },
  transition: submenuTransition,
};

function MenuPanel({
  items,
  size,
  onClose,
  style,
}: {
  items: ActionItem[];
  size: ActionMenuSize;
  onClose: () => void;
  style?: React.CSSProperties;
}) {
  const s = sizeConfig[size];
  return (
    <div
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/40 overflow-hidden"
      style={{ minWidth: s.menuWidth, ...style }}
    >
      <div className="p-1">
        {items.map((item, idx) => (
          <React.Fragment key={item.id}>
            {item.dividerBefore && idx > 0 && (
              <div className="my-1 -mx-1 border-t border-gray-100 dark:border-gray-800" />
            )}
            {item.header && (
              <div
                className={`${s.itemPx} pt-2 pb-1 ${s.headerText} font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 select-none`}
              >
                {item.header}
              </div>
            )}
            <ActionRow item={item} size={size} onClose={onClose} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function ActionRow({
  item,
  size,
  onClose,
}: {
  item: ActionItem;
  size: ActionMenuSize;
  onClose: () => void;
}) {
  const { onAction } = useActionMenuContext();
  const s = sizeConfig[size];
  const hasChildren = !!item.children?.length;
  const variant = item.variant ?? "default";
  const itemRef = useRef<HTMLDivElement>(null);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [submenuPos, setSubmenuPos] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (item.disabled || !hasChildren) return;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setSubmenuPos(computeSubmenuPosition(rect, s.menuWidth));
    }
    setSubmenuOpen(true);
  }, [item.disabled, hasChildren, s.menuWidth]);

  const handleMouseLeave = useCallback(() => {
    if (!hasChildren) return;
    hideTimer.current = setTimeout(() => setSubmenuOpen(false), 100);
  }, [hasChildren]);

  const handleSubmenuMouseEnter = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  const handleSubmenuMouseLeave = useCallback(() => {
    hideTimer.current = setTimeout(() => setSubmenuOpen(false), 100);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const handleClick = useCallback(() => {
    if (item.disabled || hasChildren) return;
    item.onClick?.();
    onAction?.(item);
    onClose();
  }, [item, hasChildren, onAction, onClose]);

  return (
    <div
      ref={itemRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        disabled={item.disabled}
        onClick={handleClick}
        className={`
          w-full flex items-center gap-2 ${s.itemPx} ${s.itemPy} rounded-md
          ${s.itemText} font-medium transition-colors duration-100 text-left
          ${
            item.disabled
              ? "opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600"
              : variantStyles[variant]
          }
        `}
      >
        {item.leadingIcon && (
          <span
            className={`shrink-0 flex items-center justify-center ${item.disabled ? "opacity-40" : variantIconStyles[variant]}`}
            style={{ width: s.iconSize, height: s.iconSize }}
          >
            {item.leadingIcon}
          </span>
        )}

        <span className="flex-1 min-w-0">
          <span className="block truncate">{item.label}</span>
          {item.description && (
            <span
              className={`block truncate ${s.descText} text-gray-400 dark:text-gray-500 font-normal mt-0.5`}
            >
              {item.description}
            </span>
          )}
        </span>

        {item.trailingText && (
          <span
            className={`shrink-0 ${s.trailingTextSize} text-gray-400 dark:text-gray-500 font-normal`}
          >
            {item.trailingText}
          </span>
        )}

        {item.trailingIcon && !hasChildren && (
          <span
            className={`shrink-0 flex items-center justify-center ${variantIconStyles[variant]}`}
            style={{ width: s.iconSize - 2, height: s.iconSize - 2 }}
          >
            {item.trailingIcon}
          </span>
        )}

        {hasChildren && (
          <ChevronRight
            size={s.chevronSize}
            className="shrink-0 text-gray-400 dark:text-gray-500"
          />
        )}
      </button>

      {hasChildren &&
        submenuOpen &&
        submenuPos &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: submenuPos.top,
              left: submenuPos.left,
              zIndex: 99999,
              minWidth: s.menuWidth,
            }}
            onMouseEnter={handleSubmenuMouseEnter}
            onMouseLeave={handleSubmenuMouseLeave}
          >
            <AnimatePresence>
              <motion.div {...submenuMotion}>
                <MenuPanel
                  items={item.children!}
                  size={size}
                  onClose={onClose}
                />
              </motion.div>
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </div>
  );
}

function ActionMenuInner({
  items,
  size,
  trigger,
  align,
}: {
  items: ActionItem[];
  size: ActionMenuSize;
  trigger: React.ReactNode;
  align: MenuAlign;
}) {
  const { state, toggle, close } = useActionMenuContext();
  const s = sizeConfig[size];
  const triggerRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);

  const estimatedMenuHeight = Math.min(items.length * 36 + 16, 400);

  useLayoutEffect(() => {
    if (!state.isOpen || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const { pos } = computeMenuPosition(
      rect,
      s.menuWidth,
      estimatedMenuHeight,
      align,
    );
    setMenuPos(pos);
  }, [state.isOpen, align, s.menuWidth, estimatedMenuHeight]);

  useEffect(() => {
    if (!state.isOpen) return;

    const handleScroll = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const { pos } = computeMenuPosition(
        rect,
        s.menuWidth,
        estimatedMenuHeight,
        align,
      );
      setMenuPos(pos);
    };

    const handleOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        const menuEl = document.getElementById("action-menu-portal");
        if (menuEl && menuEl.contains(e.target as Node)) return;
        close();
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [state.isOpen, close, align, s.menuWidth, estimatedMenuHeight]);

  return (
    <div ref={triggerRef} className="relative inline-block">
      <div
        onClick={() => {
          if (!state.disabled) toggle();
        }}
        className={
          state.disabled
            ? "opacity-50 cursor-not-allowed pointer-events-none"
            : "cursor-pointer"
        }
      >
        {trigger}
      </div>

      {state.isOpen &&
        menuPos &&
        createPortal(
          <AnimatePresence>
            <motion.div
              key="action-menu"
              id="action-menu-portal"
              {...menuMotion}
              style={{
                position: "absolute",
                top: menuPos.top,
                left: menuPos.left,
                zIndex: 99999,
                minWidth: s.menuWidth,
              }}
            >
              <MenuPanel items={items} size={size} onClose={close} />
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}

export interface ActionMenuProps extends Omit<
  ActionMenuProviderProps,
  "children"
> {
  items: ActionItem[];
  trigger: React.ReactNode;
  size?: ActionMenuSize;
  align?: MenuAlign;
  className?: string;
}

export function ActionMenu({
  items,
  trigger,
  size = "md",
  align = "auto",
  className = "",
  ...providerProps
}: ActionMenuProps) {
  return (
    <div className={className}>
      <ActionMenuProvider {...providerProps} size={size} align={align}>
        <ActionMenuInner
          items={items}
          size={size}
          trigger={trigger}
          align={align}
        />
      </ActionMenuProvider>
    </div>
  );
}

export interface DefaultTriggerProps {
  label?: string;
  size?: ActionMenuSize;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  variant?: "default" | "ghost" | "outline";
}

export function DefaultTrigger({
  label = "Actions",
  size = "md",
  leadingIcon,
  trailingIcon,
  variant = "default",
}: DefaultTriggerProps) {
  const s = sizeConfig[size];

  const variantClass = {
    default:
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm",
    ghost:
      "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent",
    outline:
      "bg-transparent border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
  }[variant];

  return (
    <button
      type="button"
      className={`
        inline-flex items-center gap-1.5 ${s.triggerPx} ${s.triggerPy}
        ${s.triggerText} font-medium rounded-lg transition-colors duration-100
        text-gray-700 dark:text-gray-200 ${variantClass}
      `}
    >
      {leadingIcon && (
        <span
          className="shrink-0 flex items-center text-gray-500 dark:text-gray-400"
          style={{ width: s.triggerIconSize, height: s.triggerIconSize }}
        >
          {leadingIcon}
        </span>
      )}
      {label && <span>{label}</span>}
      {trailingIcon && (
        <span
          className="shrink-0 flex items-center text-gray-400 dark:text-gray-500"
          style={{
            width: s.triggerIconSize - 2,
            height: s.triggerIconSize - 2,
          }}
        >
          {trailingIcon}
        </span>
      )}
    </button>
  );
}

export interface IconTriggerProps {
  size?: ActionMenuSize;
  icon: React.ReactNode;
  variant?: "default" | "ghost";
}

export function IconTrigger({
  size = "md",
  icon,
  variant = "ghost",
}: IconTriggerProps) {
  const s = sizeConfig[size];
  const dim = { sm: "w-7 h-7", md: "w-8 h-8", lg: "w-9 h-9", xl: "w-10 h-10" }[
    size
  ];

  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center ${dim} rounded-lg
        text-gray-500 dark:text-gray-400 transition-colors duration-100
        ${
          variant === "ghost"
            ? "hover:bg-gray-100 dark:hover:bg-gray-800"
            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm"
        }
      `}
    >
      <span
        style={{
          width: s.triggerIconSize,
          height: s.triggerIconSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </span>
    </button>
  );
}

export { ActionMenuProvider, useActionMenuContext };
export type { ActionItem, ActionMenuSize, MenuAlign, ActionItemVariant };
