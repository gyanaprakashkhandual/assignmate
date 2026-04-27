/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  DateTimeProvider,
  useDateTimeContext,
  type DateTimeProviderProps,
  type PickerMode,
  type PickerSize,
  type DropdownPosition,
  type DateTimeValue,
  type CalendarView,
} from "./Time.context";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toDateString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseDate(str: string): Date | null {
  if (!str) return null;
  const d = new Date(str + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function formatDateDisplay(str: string): string {
  const d = parseDate(str);
  if (!d) return str;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeDisplay(str: string): string {
  if (!str) return str;
  const [h, m] = str.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

const sizeConfig = {
  sm: {
    calendarWidth: "w-52",
    timeWidth: "w-44",
    triggerHeight: "h-7",
    triggerText: "text-xs",
    triggerPx: "px-2.5",
    iconSize: 11,
    labelText: "text-[10px]",
    dayText: "text-[10px]",
    headerText: "text-[11px]",
    cellText: "text-[10px]",
    gap: "gap-y-0",
    navBtn: "w-6 h-6",
  },
  md: {
    calendarWidth: "w-64",
    timeWidth: "w-56",
    triggerHeight: "h-9",
    triggerText: "text-sm",
    triggerPx: "px-3",
    iconSize: 13,
    labelText: "text-xs",
    dayText: "text-[10px]",
    headerText: "text-xs",
    cellText: "text-xs",
    gap: "gap-y-0.5",
    navBtn: "w-7 h-7",
  },
  lg: {
    calendarWidth: "w-72",
    timeWidth: "w-64",
    triggerHeight: "h-10",
    triggerText: "text-sm",
    triggerPx: "px-3.5",
    iconSize: 14,
    labelText: "text-xs",
    dayText: "text-[11px]",
    headerText: "text-sm",
    cellText: "text-xs",
    gap: "gap-y-1",
    navBtn: "w-8 h-8",
  },
  xl: {
    calendarWidth: "w-80",
    timeWidth: "w-72",
    triggerHeight: "h-11",
    triggerText: "text-base",
    triggerPx: "px-4",
    iconSize: 16,
    labelText: "text-sm",
    dayText: "text-xs",
    headerText: "text-sm",
    cellText: "text-sm",
    gap: "gap-y-1",
    navBtn: "w-9 h-9",
  },
};

function useAutoPosition(
  open: boolean,
  anchorRef: React.RefObject<HTMLDivElement | null>,
  preferredPosition: DropdownPosition | "auto",
): DropdownPosition {
  const [pos, setPos] = useState<DropdownPosition>("bottom-left");

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    if (preferredPosition !== "auto") {
      setPos(preferredPosition);
      return;
    }
    const rect = anchorRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = window.innerWidth - rect.left;
    const vertical =
      spaceBelow >= 320 || spaceBelow >= spaceAbove ? "bottom" : "top";
    const horizontal = spaceRight >= 260 ? "left" : "right";
    setPos(`${vertical}-${horizontal}` as DropdownPosition);
  }, [open, anchorRef, preferredPosition]);

  return pos;
}

function positionClasses(pos: DropdownPosition): string {
  switch (pos) {
    case "bottom-left":
      return "top-full left-0 mt-1.5";
    case "bottom-right":
      return "top-full right-0 mt-1.5";
    case "top-left":
      return "bottom-full left-0 mb-1.5";
    case "top-right":
      return "bottom-full right-0 mb-1.5";
  }
}

interface YearPickerProps {
  size: PickerSize;
}

function YearPicker({ size }: YearPickerProps) {
  const { state, setCalendarView, dispatch } = useDateTimeContext();
  const { viewYear } = state;
  const s = sizeConfig[size];

  const startYear = Math.floor(viewYear / 10) * 10;
  const years = Array.from({ length: 12 }, (_, i) => startYear - 1 + i);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className={`${s.calendarWidth} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/40 p-3`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          type="button"
          onClick={() => dispatch({ type: "PREV_YEAR" })}
          className={`${s.navBtn} flex items-center justify-center rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
        >
          <ChevronLeft size={s.iconSize - 1} />
        </button>
        <span
          className={`${s.headerText} font-semibold text-gray-900 dark:text-white`}
        >
          {startYear} - {startYear + 11}
        </span>
        <button
          type="button"
          onClick={() => dispatch({ type: "NEXT_YEAR" })}
          className={`${s.navBtn} flex items-center justify-center rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
        >
          <ChevronRight size={s.iconSize - 1} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {years.map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => {
              dispatch({ type: "SET_VIEW_YEAR", payload: year });
              setCalendarView("month");
            }}
            className={`py-2 rounded-lg text-center ${s.cellText} font-medium transition-all ${
              year === viewYear
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {year}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

interface MonthPickerProps {
  size: PickerSize;
}

function MonthPicker({ size }: MonthPickerProps) {
  const { state, setCalendarView, dispatch } = useDateTimeContext();
  const { viewYear, viewMonth } = state;
  const s = sizeConfig[size];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className={`${s.calendarWidth} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/40 p-3`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          type="button"
          onClick={() => dispatch({ type: "PREV_YEAR" })}
          className={`${s.navBtn} flex items-center justify-center rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
        >
          <ChevronLeft size={s.iconSize - 1} />
        </button>
        <button
          type="button"
          onClick={() => setCalendarView("year")}
          className={`${s.headerText} font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors`}
        >
          {viewYear}
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "NEXT_YEAR" })}
          className={`${s.navBtn} flex items-center justify-center rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
        >
          <ChevronRight size={s.iconSize - 1} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {MONTHS.map((month, idx) => (
          <button
            key={month}
            type="button"
            onClick={() => {
              dispatch({ type: "SET_VIEW_MONTH", payload: idx });
              setCalendarView("date");
            }}
            className={`py-2 rounded-lg text-center ${s.cellText} font-medium transition-all ${
              idx === viewMonth
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {month.slice(0, 3)}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

interface CalendarPickerProps {
  size: PickerSize;
}

function CalendarPicker({ size }: CalendarPickerProps) {
  const { state, setDate, closePicker, prevMonth, nextMonth, setCalendarView } =
    useDateTimeContext();
  const {
    dateValue,
    viewYear,
    viewMonth,
    calendarView,
    minDate,
    maxDate,
    disabledDates,
    disabledDaysOfWeek,
  } = state;
  const s = sizeConfig[size];
  const today = new Date();
  const selected = parseDate(dateValue);
  const min = parseDate(minDate);
  const max = parseDate(maxDate);
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  if (calendarView === "year") {
    return <YearPicker size={size} />;
  }

  if (calendarView === "month") {
    return <MonthPicker size={size} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className={`${s.calendarWidth} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/40 p-3 select-none`}
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <button
          type="button"
          onClick={prevMonth}
          className={`${s.navBtn} flex items-center justify-center rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
        >
          <ChevronLeft size={s.iconSize - 1} />
        </button>
        <button
          type="button"
          onClick={() => setCalendarView("month")}
          className={`${s.headerText} font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors`}
        >
          {MONTHS[viewMonth]} {viewYear}
        </button>
        <button
          type="button"
          onClick={nextMonth}
          className={`${s.navBtn} flex items-center justify-center rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
        >
          <ChevronRight size={s.iconSize - 1} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className={`text-center ${s.dayText} font-semibold text-gray-400 dark:text-gray-500 py-1`}
          >
            {d}
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-7 ${s.gap}`}>
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const thisDate = new Date(viewYear, viewMonth, day);
          const dateStr = toDateString(thisDate);
          const isSelected = selected && toDateString(selected) === dateStr;
          const isToday = toDateString(today) === dateStr;
          const isDisabledByMin = min ? thisDate < min : false;
          const isDisabledByMax = max ? thisDate > max : false;
          const isDisabledByDate = disabledDates.includes(dateStr);
          const isDisabledByDow = disabledDaysOfWeek.includes(
            thisDate.getDay(),
          );
          const isDisabled =
            isDisabledByMin ||
            isDisabledByMax ||
            isDisabledByDate ||
            isDisabledByDow;

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                setDate(dateStr);
                closePicker();
              }}
              className={`
                w-full aspect-square flex items-center justify-center rounded-md ${s.cellText} font-medium transition-all
                ${isDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                ${
                  isSelected
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                    : isToday
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold ring-1 ring-gray-300 dark:ring-gray-600"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {dateValue && (
        <button
          type="button"
          onClick={() => {
            setDate("");
          }}
          className={`mt-2 w-full text-center ${s.cellText} text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors py-1`}
        >
          Clear date
        </button>
      )}
    </motion.div>
  );
}

interface TimePickerInnerProps {
  size: PickerSize;
}

function TimePickerInner({ size }: TimePickerInnerProps) {
  const { state, setTime } = useDateTimeContext();
  const { timeValue } = state;
  const s = sizeConfig[size];

  const [hour, setHourState] = useState<number>(12);
  const [minute, setMinuteState] = useState<number>(0);
  const [ampm, setAmpmState] = useState<"AM" | "PM">("AM");

  useEffect(() => {
    if (timeValue) {
      const [h, m] = timeValue.split(":").map(Number);
      setAmpmState(h >= 12 ? "PM" : "AM");
      setHourState(h % 12 || 12);
      setMinuteState(m);
    }
  }, [timeValue]);

  const emit = useCallback(
    (h: number, m: number, ap: "AM" | "PM") => {
      let h24 = h % 12;
      if (ap === "PM") h24 += 12;
      setTime(`${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    },
    [setTime],
  );

  const setH = (h: number) => {
    setHourState(h);
    emit(h, minute, ampm);
  };
  const setM = (m: number) => {
    setMinuteState(m);
    emit(hour, m, ampm);
  };
  const setAP = (ap: "AM" | "PM") => {
    setAmpmState(ap);
    emit(hour, minute, ap);
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className={`${s.timeWidth} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg shadow-black/10 dark:shadow-black/40 p-3 select-none`}
    >
      <div className="flex gap-1.5 mb-3">
        {(["AM", "PM"] as const).map((ap) => (
          <button
            key={ap}
            type="button"
            onClick={() => setAP(ap)}
            className={`flex-1 py-1.5 rounded-md ${s.cellText} font-semibold transition-all ${
              ampm === ap
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {ap}
          </button>
        ))}
      </div>

      <p
        className={`${s.dayText} font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5 px-0.5`}
      >
        Hour
      </p>
      <div className="grid grid-cols-6 gap-1 mb-3 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {hours.map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => setH(h)}
            className={`h-7 rounded-md ${s.cellText} font-medium transition-all whitespace-nowrap ${
              hour === h
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {h}
          </button>
        ))}
      </div>

      <p
        className={`${s.dayText} font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5 px-0.5`}
      >
        Minute
      </p>
      <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {minutes.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setM(m)}
            className={`h-7 rounded-md ${s.cellText} font-medium transition-all whitespace-nowrap ${
              minute === m
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {String(m).padStart(2, "0")}
          </button>
        ))}
      </div>

      {timeValue && (
        <button
          type="button"
          onClick={() => setTime("")}
          className={`mt-2 w-full text-center ${s.cellText} text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors py-1`}
        >
          Clear time
        </button>
      )}
    </motion.div>
  );
}

interface DateInputFieldProps {
  label?: string;
  placeholder?: string;
  size: PickerSize;
  value?: string;
  onChange?: (value: string) => void;
}

function DateInputField({
  label,
  placeholder = "Pick a date",
  size,
  value,
  onChange,
}: DateInputFieldProps) {
  const { state, setDate, openDatePicker, closePicker } = useDateTimeContext();
  const {
    dateValue: contextDateValue,
    openPicker,
    isDisabled,
    isReadOnly,
    dropdownPosition,
  } = state;
  const s = sizeConfig[size];
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = openPicker === "date";
  const pos = useAutoPosition(isOpen, ref, dropdownPosition);
  const dateValue = value !== undefined ? value : contextDateValue;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) closePicker();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [closePicker]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (onChange) {
      onChange(inputValue);
    } else {
      setDate(inputValue);
    }
  };

  return (
    <div ref={ref} className="relative w-full">
      {label && (
        <label
          className={`block ${s.labelText} font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <Calendar
          size={s.iconSize}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
        />
        <input
          type="text"
          disabled={isDisabled}
          readOnly={isReadOnly}
          value={dateValue ? formatDateDisplay(dateValue) : ""}
          onChange={handleInputChange}
          placeholder={placeholder}
          onClick={() => (isOpen ? closePicker() : openDatePicker())}
          className={`
            w-full ${s.triggerHeight} pl-9 pr-3 rounded-lg border ${s.triggerText} transition-all text-left
            bg-white dark:bg-gray-800
            ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
            ${isReadOnly ? "cursor-default" : ""}
            ${
              isOpen
                ? "border-gray-400 dark:border-gray-500 ring-1 ring-gray-900 dark:ring-white"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-900 dark:focus:ring-white"
            }
          `}
        />
        {dateValue && !isDisabled && !isReadOnly && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDate("");
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
          >
            <X size={s.iconSize - 2} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className={`absolute z-50 ${positionClasses(pos)}`}>
            <CalendarPicker size={size} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TimeInputFieldProps {
  label?: string;
  placeholder?: string;
  size: PickerSize;
  value?: string;
  onChange?: (value: string) => void;
}

function TimeInputField({
  label,
  placeholder = "Pick a time",
  size,
  value,
  onChange,
}: TimeInputFieldProps) {
  const { state, setTime, openTimePicker, closePicker } = useDateTimeContext();
  const {
    timeValue: contextTimeValue,
    openPicker,
    isDisabled,
    isReadOnly,
    dropdownPosition,
  } = state;
  const s = sizeConfig[size];
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = openPicker === "time";
  const pos = useAutoPosition(isOpen, ref, dropdownPosition);
  const timeValue = value !== undefined ? value : contextTimeValue;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) closePicker();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [closePicker]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (onChange) {
      onChange(inputValue);
    } else {
      setTime(inputValue);
    }
  };

  return (
    <div ref={ref} className="relative w-full">
      {label && (
        <label
          className={`block ${s.labelText} font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <Clock
          size={s.iconSize}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
        />
        <input
          type="text"
          disabled={isDisabled}
          readOnly={isReadOnly}
          value={timeValue ? formatTimeDisplay(timeValue) : ""}
          onChange={handleInputChange}
          placeholder={placeholder}
          onClick={() => (isOpen ? closePicker() : openTimePicker())}
          className={`
            w-full ${s.triggerHeight} pl-9 pr-3 rounded-lg border ${s.triggerText} transition-all text-left
            bg-white dark:bg-gray-800
            ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
            ${isReadOnly ? "cursor-default" : ""}
            ${
              isOpen
                ? "border-gray-400 dark:border-gray-500 ring-1 ring-gray-900 dark:ring-white"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-900 dark:focus:ring-white"
            }
          `}
        />
        {timeValue && !isDisabled && !isReadOnly && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setTime("");
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
          >
            <X size={s.iconSize - 2} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className={`absolute z-50 ${positionClasses(pos)}`}>
            <TimePickerInner size={size} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export interface DateTimePickerProps extends Omit<
  DateTimeProviderProps,
  "children"
> {
  mode?: PickerMode;
  size?: PickerSize;
  dateLabel?: string;
  timeLabel?: string;
  datePlaceholder?: string;
  timePlaceholder?: string;
  className?: string;
  layout?: "horizontal" | "vertical";
  dateValue?: string;
  timeValue?: string;
  onDateChange?: (value: string) => void;
  onTimeChange?: (value: string) => void;
}

export function DateTimePicker({
  mode = "datetime",
  size = "md",
  dateLabel,
  timeLabel,
  datePlaceholder,
  timePlaceholder,
  className = "",
  layout = "horizontal",
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  ...providerProps
}: DateTimePickerProps) {
  return (
    <DateTimeProvider {...providerProps} mode={mode} size={size}>
      <div
        className={`
          ${layout === "horizontal" && mode === "datetime" ? "flex flex-wrap gap-3 items-end" : "flex flex-col gap-3"}
          ${className}
        `}
      >
        {(mode === "date" || mode === "datetime") && (
          <div
            className={
              mode === "datetime" && layout === "horizontal"
                ? "flex-1 min-w-0"
                : "w-full"
            }
          >
            <DateInputField
              label={dateLabel}
              placeholder={datePlaceholder}
              size={size}
              value={dateValue}
              onChange={onDateChange}
            />
          </div>
        )}
        {(mode === "time" || mode === "datetime") && (
          <div
            className={
              mode === "datetime" && layout === "horizontal"
                ? "flex-1 min-w-0"
                : "w-full"
            }
          >
            <TimeInputField
              label={timeLabel}
              placeholder={timePlaceholder}
              size={size}
              value={timeValue}
              onChange={onTimeChange}
            />
          </div>
        )}
      </div>
    </DateTimeProvider>
  );
}

export interface StandaloneDatePickerProps extends Omit<
  DateTimeProviderProps,
  "children"
> {
  size?: PickerSize;
  label?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function StandaloneDatePicker({
  size = "md",
  label,
  placeholder,
  className = "",
  value,
  onChange,
  ...providerProps
}: StandaloneDatePickerProps) {
  return (
    <DateTimeProvider {...providerProps} mode="date" size={size}>
      <div className={className}>
        <DateInputField
          label={label}
          placeholder={placeholder}
          size={size}
          value={value}
          onChange={onChange}
        />
      </div>
    </DateTimeProvider>
  );
}

export interface StandaloneTimePickerProps extends Omit<
  DateTimeProviderProps,
  "children"
> {
  size?: PickerSize;
  label?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function StandaloneTimePicker({
  size = "md",
  label,
  placeholder,
  className = "",
  value,
  onChange,
  ...providerProps
}: StandaloneTimePickerProps) {
  return (
    <DateTimeProvider {...providerProps} mode="time" size={size}>
      <div className={className}>
        <TimeInputField
          label={label}
          placeholder={placeholder}
          size={size}
          value={value}
          onChange={onChange}
        />
      </div>
    </DateTimeProvider>
  );
}

export { DateTimeProvider, useDateTimeContext };
export type {
  PickerMode,
  PickerSize,
  DropdownPosition,
  DateTimeValue,
  CalendarView,
};
