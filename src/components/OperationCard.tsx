import type { ReactNode } from "react";

type OperationCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
};

export function OperationCard({
  title,
  description,
  children,
  className = "",
  titleClassName = "text-slate-900",
}: OperationCardProps) {
  return (
    <article
      className={`rounded-xl border border-slate-200 p-4 ${className}`.trim()}
    >
      <h2 className={`text-lg font-semibold ${titleClassName}`.trim()}>
        {title}
      </h2>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      {children}
    </article>
  );
}
