import type React from "react";

interface DecorativeBorderProps {
  children: React.ReactNode;
  className?: string;
}

export default function DashedBorder({
  children,
  className = "",
}: DecorativeBorderProps) {
  return (
    <div className={`relative m-4 p-4 ${className}`}>
      {children}
      <div
        className="pointer-events-none absolute -inset-y-8 -left-0.5 border-l border-dashed border-neutral-700
                   [mask-image:linear-gradient(to_bottom,transparent,white_2rem,white_calc(100%_-_2rem),transparent)] opacity-50"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -inset-y-8 -right-0.5 border-r border-dashed border-neutral-700
                   [mask-image:linear-gradient(to_bottom,transparent,white_2rem,white_calc(100%_-_2rem),transparent)] opacity-50"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -inset-x-8 -top-0.5 border-t border-dashed border-neutral-700
                   [mask-image:linear-gradient(to_right,transparent,white_2rem,white_calc(100%_-_2rem),transparent)] opacity-50"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -inset-x-8 -bottom-0.5 border-b border-dashed border-neutral-700
                   [mask-image:linear-gradient(to_right,transparent,white_2rem,white_calc(100%_-_2rem),transparent)] opacity-50"
        aria-hidden="true"
      />
    </div>
  );
}
