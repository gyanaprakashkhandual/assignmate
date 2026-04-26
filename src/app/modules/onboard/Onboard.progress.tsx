"use client";

interface Props {
  current: number;
  total: number;
}

export default function OnboardProgress({ current, total }: Props) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-500 ${
            i < current ? "bg-black" : "bg-zinc-200"
          } ${i === current - 1 ? "w-8" : "w-4"}`}
        />
      ))}
    </div>
  );
}
